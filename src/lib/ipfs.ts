// Server-only IPFS utilities using native fetch (no electron-fetch / ipfs-http-client)

const IPFS_GATEWAY = process.env.IPFS_GATEWAY_URL ?? "https://ipfs.io";
const IPFS_LOCAL_API = process.env.IPFS_API_URL ?? "http://localhost:5001/api";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const isProd = process.env.NODE_ENV === 'production';
const MOCK_STORAGE_DIR = isProd 
  ? path.join("/tmp", "ipfs_mock") 
  : path.join(process.cwd(), ".data", "ipfs_mock");

function ensureMockDir() {
  if (!fs.existsSync(MOCK_STORAGE_DIR)) {
    fs.mkdirSync(MOCK_STORAGE_DIR, { recursive: true });
  }
}

function generateMockCID(content: Uint8Array | string): string {
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  // Simple Base58-ish mock (not a real CID but looks enough for demo)
  return "QmHost" + hash.slice(0, 40);
}

export interface IPFSResult {
  hash: string;
  size: number;
  url: string;
}

/**
 * Upload content to IPFS.
 * Tries local Kubo node first, falls back to mock (returns a deterministic fake CID).
 */
export async function uploadToIPFS(
  content: Uint8Array,
  filename: string,
  _mimeType: string = "application/octet-stream"
): Promise<IPFSResult> {
  // Try local IPFS node via HTTP API (Kubo)
  try {
    const form = new FormData();
    const blob = new Blob([content as any], { type: _mimeType });
    form.append("file", blob, filename);

    const res = await fetch(`${IPFS_LOCAL_API}/v0/add?pin=true`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) throw new Error(`IPFS API ${res.status}`);

    const data = await res.json();
    const hash = data.Hash as string;
    return {
      hash,
      size: content.byteLength,
      url: `${IPFS_GATEWAY}/ipfs/${hash}`,
    };
  } catch (err) {
    ensureMockDir();
    const hash = generateMockCID(content);
    const mockHash = hash;
    
    const filePath = path.join(MOCK_STORAGE_DIR, mockHash);
    fs.writeFileSync(filePath, Buffer.from(content));
    
    // Store metadata (MIME type)
    fs.writeFileSync(filePath + ".meta", JSON.stringify({ filename, contentType: _mimeType }));

    return {
      hash: mockHash,
      size: content.byteLength,
      url: `${APP_URL}/api/ipfs/${mockHash}`,
    };
  }
}

/**
 * Upload multiple files as a directory to IPFS.
 */
export async function uploadDirectoryToIPFS(
  files: Array<{ path: string; content: string | Uint8Array }>,
  _directoryName: string
): Promise<IPFSResult> {
  try {
    const form = new FormData();

    for (const file of files) {
      const bytes = typeof file.content === "string"
        ? new TextEncoder().encode(file.content)
        : (file.content as Uint8Array);
      const blob = new Blob([bytes as BlobPart]);
      form.append("file", blob, file.path);
    }

    const res = await fetch(`${IPFS_LOCAL_API}/v0/add?wrap-with-directory=true&pin=true`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) throw new Error(`IPFS API ${res.status}`);

    // Last line of NDJSON is the directory entry
    const text = await res.text();
    const lines = text.trim().split("\n");
    const last = JSON.parse(lines[lines.length - 1]);
    const hash = last.Hash as string;

    return {
      hash,
      size: last.Size ?? 0,
      url: `${IPFS_GATEWAY}/ipfs/${hash}`,
    };
  } catch (err) {
    ensureMockDir();
    // For directory, we just hash the list of files
    const combinedContent = files.map(f => f.path + (typeof f.content === 'string' ? f.content : f.content.length)).join(',');
    const mockHash = generateMockCID(combinedContent);
    
    const dirPath = path.join(MOCK_STORAGE_DIR, mockHash);
    if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

    for (const file of files) {
       const filePath = path.join(dirPath, file.path);
       const dirName = path.dirname(filePath);
       if (!fs.existsSync(dirName)) fs.mkdirSync(dirName, { recursive: true });
       fs.writeFileSync(filePath, typeof file.content === 'string' ? file.content : Buffer.from(file.content));
    }

    return {
      hash: mockHash,
      size: 0,
      url: `${APP_URL}/api/ipfs/${mockHash}`,
    };
  }
}
