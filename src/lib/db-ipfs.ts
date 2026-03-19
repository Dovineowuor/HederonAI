/**
 * db-ipfs.ts
 * 
 * Provides a decentralized backup layer for the ExecuAI database.
 * 
 * - snapshotToIPFS(): serialises the current SQLite state to JSON,
 *   uploads it to Hedera File Service (HFS), and logs the fileId to HCS.
 * 
 * - restoreFromIPFS(fileId): downloads a snapshot from HFS and
 *   re-seeds the SQLite database (used on cold-start if DB is missing).
 * 
 * All operations are non-fatal — failures are logged but do not crash the app.
 */

import { uploadToHFS, logToHCS } from "./hedera";
import path from "path";
import fs from "fs";
import Database from "better-sqlite3";

const DB_PATH = path.join(process.cwd(), ".data", "execuai.db");
const SNAPSHOT_INDEX = path.join(process.cwd(), ".data", "snapshots.json");

// Track the latest HFS fileId locally so we can reference it on restore
interface SnapshotRecord {
  fileId: string;
  timestamp: string;
  agentCount: number;
  jobCount: number;
}

function loadSnapshotIndex(): SnapshotRecord[] {
  if (!fs.existsSync(SNAPSHOT_INDEX)) return [];
  try {
    return JSON.parse(fs.readFileSync(SNAPSHOT_INDEX, "utf-8"));
  } catch {
    return [];
  }
}

function saveSnapshotIndex(records: SnapshotRecord[]) {
  try {
    // Keep only last 50 snapshots to avoid unbounded growth
    const trimmed = records.slice(-50);
    fs.writeFileSync(SNAPSHOT_INDEX, JSON.stringify(trimmed, null, 2));
  } catch (err) {
    console.error("[db-ipfs] Failed to save snapshot index:", err);
  }
}

export async function snapshotToIPFS(): Promise<SnapshotRecord | null> {
  try {
    if (!fs.existsSync(DB_PATH)) {
      console.warn("[db-ipfs] SQLite DB not found, skipping snapshot.");
      return null;
    }

    // Read current state directly from SQLite
    const db = new Database(DB_PATH, { readonly: true });
    const agents = db.prepare("SELECT * FROM agents").all();
    const jobs   = db.prepare("SELECT * FROM jobs ORDER BY createdAt DESC").all();
    db.close();

    const snapshot = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      agents,
      jobs,
    };

    const json = JSON.stringify(snapshot, null, 2);
    const data = Buffer.from(json, "utf-8");

    // Upload to Hedera File Service
    const hfsLog = await uploadToHFS(data, `execuai-db-snapshot-${Date.now()}`);

    if (!hfsLog.fileId) {
      console.warn("[db-ipfs] HFS upload did not return a fileId.");
      return null;
    }

    // Pin the snapshot reference to HCS
    await logToHCS(
      JSON.stringify({
        event: "DB_SNAPSHOT",
        fileId: hfsLog.fileId,
        txId: hfsLog.txId,
        timestamp: snapshot.timestamp,
        agentCount: agents.length,
        jobCount: jobs.length,
      })
    );

    const record: SnapshotRecord = {
      fileId: hfsLog.fileId,
      timestamp: snapshot.timestamp,
      agentCount: agents.length,
      jobCount: (jobs as any[]).length,
    };

    const index = loadSnapshotIndex();
    index.push(record);
    saveSnapshotIndex(index);

    console.info(`[db-ipfs] Snapshot uploaded → HFS:${hfsLog.fileId} (${agents.length} agents, ${(jobs as any[]).length} jobs)`);
    return record;
  } catch (err) {
    console.error("[db-ipfs] Snapshot failed:", err);
    return null;
  }
}

/**
 * Returns the latest known snapshot record from the local index.
 * Use this to decide whether to attempt a restore on cold start.
 */
export function getLatestSnapshot(): SnapshotRecord | null {
  const index = loadSnapshotIndex();
  return index.length > 0 ? index[index.length - 1] : null;
}

/**
 * Returns all recorded snapshots (newest last).
 */
export function getAllSnapshots(): SnapshotRecord[] {
  return loadSnapshotIndex();
}
