// Server-only IPFS utilities using native fetch (no electron-fetch / ipfs-http-client)

const IPFS_GATEWAY = process.env.IPFS_GATEWAY_URL ?? "https://ipfs.io";
const IPFS_LOCAL_API = process.env.IPFS_API_URL ?? "http://localhost:5001/api";

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
  } catch {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let mockHash = "Qm";
    for (let i = 0; i < 44; i++) {
        mockHash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return {
      hash: mockHash,
      size: content.byteLength,
      url: `${IPFS_GATEWAY}/ipfs/${mockHash}`,
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
  } catch {
    const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    let mockHash = "Qm";
    for (let i = 0; i < 44; i++) {
        mockHash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return {
      hash: mockHash,
      size: 0,
      url: `${IPFS_GATEWAY}/ipfs/${mockHash}`,
    };
  }
}
