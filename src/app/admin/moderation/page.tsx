import { getAllUsers, getJobs } from "@/lib/db";
import { ModerationClient } from "./ModerationClient";

export default function AdminModerationPage() {
  const users = getAllUsers();
  const jobs = getJobs();

  const suspendedCount = users.filter(u => u.suspended === 1).length;
  const escrowedCount = jobs.filter(j => j.status === "escrowed").length;

  return (
    <ModerationClient
      users={users}
      jobs={jobs}
      suspendedCount={suspendedCount}
      escrowedCount={escrowedCount}
    />
  );
}
