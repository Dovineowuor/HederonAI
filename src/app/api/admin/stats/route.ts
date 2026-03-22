import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUsersCount, getJobs, getAgents, getAllUsers, getArticleStats } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if ((session?.user as any)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const jobs = getJobs();
  const agentsCount = getAgents().length;
  const usersCount = getUsersCount();
  const allUsers = getAllUsers();
  const articleStats = getArticleStats();

  const completedJobs = jobs.filter(j => j.status === "completed");
  const escrowedJobs = jobs.filter(j => j.status === "escrowed");
  const platformIncome = completedJobs.reduce((acc, j) => acc + j.escrowAmountHbar * 0.025, 0);
  const suspendedCount = allUsers.filter(u => u.suspended === 1).length;

  return NextResponse.json({
    usersCount,
    suspendedCount,
    jobsCount: jobs.length,
    completedJobsCount: completedJobs.length,
    escrowedJobsCount: escrowedJobs.length,
    agentsCount,
    platformIncome,
    articleStats,
  });
}
