import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const isProd = process.env.NODE_ENV === 'production';
const MOCK_STORAGE_DIR = isProd 
  ? path.join("/tmp", "ipfs_mock") 
  : path.join(process.cwd(), ".data", "ipfs_mock");

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const params = await context.params;
  const pathParts = params.path;
  const cid = pathParts[0];
  const subPath = pathParts.slice(1).join("/");

  const fullPath = path.join(MOCK_STORAGE_DIR, cid, subPath);
  const singleFilePath = path.join(MOCK_STORAGE_DIR, cid);

  try {
    // 1. Try directory access first if there's a subPath
    if (subPath && fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.isFile()) {
        const content = fs.readFileSync(fullPath);
        return new NextResponse(content, {
          headers: {
            "Content-Type": getContentType(fullPath),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    }

    // 2. Try single file access
    if (fs.existsSync(singleFilePath)) {
      const stats = fs.statSync(singleFilePath);
      if (stats.isFile()) {
        const content = fs.readFileSync(singleFilePath);
        let contentType = "application/octet-stream";
        let filename = cid;

        // Try to load metadata
        const metaPath = singleFilePath + ".meta";
        if (fs.existsSync(metaPath)) {
          const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
          contentType = meta.contentType || contentType;
          filename = meta.filename || filename;
        }

        return new NextResponse(content, {
          headers: {
            "Content-Type": contentType,
            "Content-Disposition": `inline; filename="${filename}"`,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } else if (stats.isDirectory() && !subPath) {
          // Serve an index of the directory if possible
          const files = fs.readdirSync(singleFilePath);
          return NextResponse.json({
              cid,
              type: "directory",
              files: files.map(f => ({
                  name: f,
                  url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/ipfs/${cid}/${f}`
              }))
          });
      }
    }

    return new NextResponse("File Not Found (Mock IPFS)", { status: 404 });
  } catch (error) {
    console.error("Local IPFS Gateway Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

function getContentType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".pdf": return "application/pdf";
    case ".pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    case ".docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case ".xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case ".zip": return "application/zip";
    case ".png": return "image/png";
    case ".jpg":
    case ".jpeg": return "image/jpeg";
    case ".svg": return "image/svg+xml";
    case ".md": return "text/markdown";
    case ".json": return "application/json";
    case ".js": return "application/javascript";
    case ".css": return "text/css";
    case ".html": return "text/html";
    default: return "application/octet-stream";
  }
}
