import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getAgentsByCreator, getCreatorEarnings } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const agents = getAgentsByCreator(session.user.email);
    const stats = getCreatorEarnings(session.user.email);

    return NextResponse.json({ agents, stats });
  } catch (error) {
    console.error("Creator analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
