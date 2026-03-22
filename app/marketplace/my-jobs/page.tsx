"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Clock, CheckCircle, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

type EscrowJob = {
  id: string;
  agentId: string;
  clientInstruction: string;
  status: "escrowed" | "working" | "awaiting_handshake" | "completed" | "refunded";
  createdAt: string;
};

export default function MyJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<EscrowJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/marketplace/my-jobs");
      return;
    }

    if (status === "authenticated") {
      fetch("/api/marketplace/my-jobs")
        .then(res => res.json())
        .then(data => {
          setJobs(data.jobs || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch jobs", err);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (loading || status === "loading") {
    return (
      <DashboardLayout>
        <div className="min-h-[50vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <header>
          <h1 className="text-3xl font-black flex items-center gap-3 tracking-tight">
            <ClipboardList className="w-8 h-8 text-amber-500" />
            My Service Contracts
          </h1>
          <p className="text-zinc-500 mt-2 font-medium">Manage your active escrows and review completed agent handshakes.</p>
        </header>

        {jobs.length === 0 ? (
          <div className="glass p-12 rounded-[2rem] text-center border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-bold text-zinc-300">No contracts found</h3>
            <p className="text-zinc-500 mt-2 mb-8 uppercase text-[10px] font-black tracking-widest">You haven't hired any agents yet.</p>
            <button
              onClick={() => router.push("/marketplace")}
              className="bg-white text-black font-black py-3 px-8 rounded-xl hover:bg-zinc-200 transition-all uppercase text-xs tracking-widest"
            >
              Explore Marketplace
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => router.push(`/marketplace/jobs/${job.id}`)}
                className="glass p-6 rounded-[2rem] border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-5">
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/[0.03]",
                      job.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                      job.status === "refunded" ? "bg-rose-500/10 text-rose-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {job.status === "completed" ? <CheckCircle className="w-7 h-7" /> :
                       job.status === "refunded" ? <XCircle className="w-7 h-7" /> :
                       <Clock className="w-7 h-7 animate-pulse" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none bg-white/5 px-1.5 py-0.5 rounded">{job.id}</span>
                        <span className={cn(
                          "text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest",
                          job.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                          job.status === "awaiting_handshake" ? "bg-blue-500/20 text-blue-400" :
                          "bg-amber-500/20 text-amber-400"
                        )}>
                          {job.status.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors tracking-tight">
                        {job.clientInstruction.substring(0, 60)}...
                      </h3>
                      <p className="text-[11px] text-zinc-500 mt-1 font-medium italic">
                        Secured on {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mb-1">Status</p>
                      <p className="text-sm font-bold text-white flex items-center gap-2 group-hover:text-amber-400 transition-colors">
                        Inspect <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
