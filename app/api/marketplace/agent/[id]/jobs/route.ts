import { NextRequest, NextResponse } from "next/server";
import { getJobsByAgent } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const jobs = getJobsByAgent(id);
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}
