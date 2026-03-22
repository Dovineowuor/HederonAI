import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { suspendUser, getUserByEmail } from "@/lib/db";
import { sendSuspensionEmail, sendReinstateEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { email, suspend } = await req.json();
  if (!email || typeof suspend !== "boolean") {
    return NextResponse.json({ error: "Missing email or suspend flag" }, { status: 400 });
  }

  try {
    suspendUser(email, suspend);

    // Send notification email to the affected user
    const user = getUserByEmail(email);
    const name = user?.name || email.split("@")[0];
    if (suspend) {
      sendSuspensionEmail(email, name).catch(console.error);
    } else {
      sendReinstateEmail(email, name).catch(console.error);
    }

    return NextResponse.json({ success: true, email, suspended: suspend });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
