import { NextRequest, NextResponse } from "next/server";
import { getJobs, EscrowJob } from "@/lib/db";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id || session.user.email;
    const allJobs = getJobs();
    
    // Filter jobs by the authenticated client ID
    const userJobs = allJobs.filter((job) => job.clientId === userId);

    return NextResponse.json({ jobs: userJobs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user jobs" }, { status: 500 });
  }
}
