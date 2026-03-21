import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// --- Types ---

export type AgentCategory = "Strategy" | "Marketing" | "Engineering" | "Finance";

export type EscrowAgent = {
  id: string;
  name: string;
  creator: string;
  description: string;
  category: AgentCategory;
  priceHbar: number;
  rating: number;
  reviewCount: number;
  hires: number;
};

export type JobStatus = "escrowed" | "working" | "awaiting_handshake" | "completed" | "refunded";

export type EscrowJob = {
  id: string;
  agentId: string;
  clientInstruction: string;
  escrowAmountHbar: number;
  status: JobStatus;
  output?: string;
  cid?: string;
  rating?: number;
  txHash?: string;
  clientId?: string;
  createdAt: string;
  completedAt?: string;
};

// --- Initial seed data ---
const INITIAL_AGENTS: EscrowAgent[] = [
  {
    id: "agt-101",
    name: "GrowthHacker-X",
    creator: "0.0.44391...",
    description: "Specializes in B2B SaaS growth loops. Evaluates funnels and deploys automated strategies.",
    category: "Marketing",
    priceHbar: 15.5,
    rating: 4.9,
    reviewCount: 38,
    hires: 142,
  },
  {
    id: "agt-102",
    name: "SolidityAuditor-V4",
    creator: "0.0.51200...",
    description: "Deep static analysis of EVM Smart Contracts. Will find logic bugs before mainnet deployment.",
    category: "Engineering",
    priceHbar: 50.0,
    rating: 4.8,
    reviewCount: 21,
    hires: 89,
  },
  {
    id: "agt-104",
    name: "BrandVoice-Architect",
    creator: "0.0.77812...",
    description: "Generates comprehensive brand bibles, tone guidelines, and stylistic components.",
    category: "Strategy",
    priceHbar: 10.0,
    rating: 4.5,
    reviewCount: 12,
    hires: 56,
  },
];

const INITIAL_JOBS: EscrowJob[] = [
  {
    id: "job-sed1",
    agentId: "agt-101",
    clientInstruction: "Develop a cold outreach strategy for enterprise SaaS CISOs.",
    escrowAmountHbar: 15.5,
    status: "completed",
    output: "## Cold Outreach Strategy: Enterprise CISOs\n\n1. **Value Proposition**: Security consolidation over feature lists.\n2. **Channel Matrix**: Private LinkedIn groups + Peer referrals.\n3. **Content Anchor**: Interactive risk assessment calculator.",
    rating: 5,
    cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    txHash: "0.0.491231@1731604123.189123000",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 1.9).toISOString(),
  },
  {
    id: "job-sed2",
    agentId: "agt-101",
    clientInstruction: "Optimize our signup funnel for PLG (Product-Led Growth).",
    escrowAmountHbar: 15.5,
    status: "completed",
    output: "## PLG Funnel Optimization\n\n- Removed credit card requirement from initial onboarding.\n- Implemented progressive profiling (3 data points max).\n- Added in-app 'Aha moment' tooltip sequence.",
    rating: 5,
    cid: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
    txHash: "0.0.100912@1731584920.012391000",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 4.8).toISOString(),
  },
  {
    id: "job-sed3",
    agentId: "agt-102",
    clientInstruction: "Audit the ERC20 staking vault logic for reentrancy vectors.",
    escrowAmountHbar: 50.0,
    status: "completed",
    output: "## Vault Audit Report\n\n**Severity: HIGH**\n\nThe `withdraw()` function updates the user's balance *after* the external `transfer` call. This is vulnerable to cross-function reentrancy.\n\n**Remediation**:\nApply the Checks-Effects-Interactions pattern.",
    rating: 5,
    cid: "QmZTR5bcpQD7cFgTorhxR5TBRSqG8fGq2oHhX6r5xWwY7B",
    txHash: "0.0.981245@1731213012.991200000",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    completedAt: new Date(Date.now() - 86400000 * 9.9).toISOString(),
  },
];

// --- SQLite setup ---
const isProd = process.env.NODE_ENV === 'production';
const DB_DIR = isProd ? "/tmp" : path.join(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "hederon-ai.db");

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL"); // Faster concurrent writes
  db.pragma("foreign_keys = ON");

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      creator     TEXT NOT NULL,
      description TEXT NOT NULL,
      category    TEXT NOT NULL,
      priceHbar   REAL NOT NULL DEFAULT 0,
      createdAt   TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id                 TEXT PRIMARY KEY,
      agentId            TEXT NOT NULL,
      clientInstruction  TEXT NOT NULL,
      escrowAmountHbar   REAL NOT NULL DEFAULT 0,
      status             TEXT NOT NULL DEFAULT 'escrowed',
      output             TEXT,
      cid                TEXT,
      rating             REAL,
      txHash             TEXT,
      clientId           TEXT,
      createdAt          TEXT NOT NULL DEFAULT (datetime('now')),
      completedAt        TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY, -- Email
      name        TEXT NOT NULL,
      password    TEXT NOT NULL,
      createdAt   TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  // Seed initial data if tables are empty
  const agentCount = (db.prepare("SELECT COUNT(*) as c FROM agents").get() as { c: number }).c;
  if (agentCount === 0) {
    const insertAgent = db.prepare(
      "INSERT OR IGNORE INTO agents (id, name, creator, description, category, priceHbar) VALUES (?, ?, ?, ?, ?, ?)"
    );
    const insertJob = db.prepare(
      `INSERT OR IGNORE INTO jobs (id, agentId, clientInstruction, escrowAmountHbar, status, output, cid, rating, txHash, clientId, createdAt, completedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const seedTx = db.transaction(() => {
      for (const a of INITIAL_AGENTS) {
        insertAgent.run(a.id, a.name, a.creator, a.description, a.category, a.priceHbar);
      }
      for (const j of INITIAL_JOBS) {
        insertJob.run(
          j.id, j.agentId, j.clientInstruction, j.escrowAmountHbar,
          j.status, j.output ?? null, j.cid ?? null, j.rating ?? null,
          j.txHash ?? null, j.clientId ?? null, j.createdAt, j.completedAt ?? null
        );
      }
    });
    seedTx();
  }

  _db = db;
  return db;
}

// --- Trigger async snapshot after writes ---
function triggerSnapshot() {
  // Non-blocking: fire and forget
  setImmediate(async () => {
    try {
      const { snapshotToIPFS } = await import("./db-ipfs");
      await snapshotToIPFS();
    } catch {
      // Snapshot failures are non-fatal
    }
  });
}

// --- Helper: compute live agent metrics from jobs ---
function enrichAgent(agent: Omit<EscrowAgent, "rating" | "reviewCount" | "hires"> & { priceHbar: number }, db: Database.Database): EscrowAgent {
  const completedJobs = db.prepare(
    "SELECT rating FROM jobs WHERE agentId = ? AND status = 'completed'"
  ).all(agent.id) as { rating: number | null }[];

  const hires = completedJobs.length;
  const ratedJobs = completedJobs.filter((j) => j.rating !== null);
  const reviewCount = ratedJobs.length;
  const rating = reviewCount > 0
    ? Number((ratedJobs.reduce((acc, j) => acc + j.rating!, 0) / reviewCount).toFixed(1))
    : 0;

  return { ...agent, hires, reviewCount, rating };
}

// --- API Methods ---

export function getAgents(): EscrowAgent[] {
  const db = getDb();
  const raw = db.prepare("SELECT * FROM agents").all() as Omit<EscrowAgent, "rating" | "reviewCount" | "hires">[];
  return raw
    .map((a) => enrichAgent(a, db))
    .sort((a, b) => b.rating - a.rating || b.hires - a.hires);
}

export function getAgent(id: string): EscrowAgent | undefined {
  const db = getDb();
  const raw = db.prepare("SELECT * FROM agents WHERE id = ?").get(id) as Omit<EscrowAgent, "rating" | "reviewCount" | "hires"> | undefined;
  if (!raw) return undefined;
  return enrichAgent(raw, db);
}

export function getJobs(): EscrowJob[] {
  return (getDb().prepare("SELECT * FROM jobs ORDER BY createdAt DESC").all() as EscrowJob[]);
}

export function getJobsByAgent(agentId: string): EscrowJob[] {
  return (getDb().prepare("SELECT * FROM jobs WHERE agentId = ? ORDER BY createdAt DESC").all(agentId) as EscrowJob[]);
}

export function getJob(id: string): EscrowJob | undefined {
  return (getDb().prepare("SELECT * FROM jobs WHERE id = ?").get(id) as EscrowJob | undefined);
}

export function createJob(
  agentId: string,
  clientInstruction: string,
  amount: number,
  txHash?: string,
  clientId?: string
): EscrowJob {
  const db = getDb();
  const id = "job-" + crypto.randomUUID().slice(0, 8);
  const createdAt = new Date().toISOString();

  db.prepare(
    `INSERT INTO jobs (id, agentId, clientInstruction, escrowAmountHbar, status, txHash, clientId, createdAt)
     VALUES (?, ?, ?, ?, 'escrowed', ?, ?, ?)`
  ).run(id, agentId, clientInstruction, amount, txHash ?? null, clientId ?? null, createdAt);

  triggerSnapshot();
  return getJob(id)!;
}

export function updateJobStatus(
  id: string,
  status: JobStatus,
  output?: string,
  cid?: string,
  txHash?: string
): EscrowJob | null {
  const db = getDb();
  const job = getJob(id);
  if (!job) return null;

  const completedAt = (status === "completed" || status === "refunded") ? new Date().toISOString() : null;

  db.prepare(
    `UPDATE jobs SET
      status      = ?,
      output      = COALESCE(?, output),
      cid         = COALESCE(?, cid),
      txHash      = COALESCE(?, txHash),
      completedAt = COALESCE(?, completedAt)
     WHERE id = ?`
  ).run(status, output ?? null, cid ?? null, txHash ?? null, completedAt, id);

  triggerSnapshot();
  return getJob(id)!;
}

export function rateJob(jobId: string, ratingValue: number, txHash?: string): EscrowJob | null {
  const db = getDb();
  const job = getJob(jobId);
  if (!job || job.status !== "completed" || job.rating) return job ?? null;

  db.prepare(
    "UPDATE jobs SET rating = ?, txHash = COALESCE(?, txHash) WHERE id = ?"
  ).run(ratingValue, txHash ?? null, jobId);

  triggerSnapshot();
  return getJob(jobId)!;
}

// --- User Management ---

export function createUser(email: string, name: string, password: string) {
  const db = getDb();
  // Secure hashing with salt for the POC
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  const storedPassword = `${salt}.${hash}`;

  db.prepare(
    "INSERT OR REPLACE INTO users (id, name, password) VALUES (?, ?, ?)"
  ).run(email, name, storedPassword);
}

export function getUserByEmail(email: string) {
  const db = getDb();
  return db.prepare("SELECT * FROM users WHERE id = ?").get(email) as { id: string, name: string, password: string } | undefined;
}
