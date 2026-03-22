import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { saveAdminVerification } from "@/lib/db";
import { sendMagicLink } from "@/lib/mail";
import crypto from "crypto";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins

  try {
    require('fs').appendFileSync('/tmp/mail-debug.log', `[${new Date().toISOString()}] User: ${session.user.email}, Role: ${(session.user as any).role}\n`);
    saveAdminVerification(session.user.email!, token, expiresAt);
    const sent = await sendMagicLink(session.user.email!, token);
    
    require('fs').appendFileSync('/tmp/mail-debug.log', `[${new Date().toISOString()}] Mail result: ${sent}\n`);

    if (sent) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
  } catch (err: any) {
    require('fs').appendFileSync('/tmp/mail-debug.log', `[${new Date().toISOString()}] Server Error: ${err.message}\n`);
    console.error("Link request error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
