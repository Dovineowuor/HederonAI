import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserContext, saveUserContext, clearUserContext } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const context = getUserContext(session.user.email);
  return NextResponse.json({ context });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { context } = await req.json();
    if (!context || typeof context !== "object") {
      return NextResponse.json({ error: "Invalid context data" }, { status: 400 });
    }

    saveUserContext(session.user.email, context);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save context" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  clearUserContext(session.user.email);
  return NextResponse.json({ success: true });
}
