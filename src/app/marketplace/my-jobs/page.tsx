"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ClipboardList, Clock, CheckCircle, XCircle, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <header className="mb-12 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.push("/marketplace")}
              className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group mb-4"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Marketplace
            </button>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <ClipboardList className="w-8 h-8 text-amber-500" />
              My AI Service Contracts
            </h1>
            <p className="text-zinc-400 mt-2">Manage your active escrows and review completed agent handshakes.</p>
          </div>
        </header>

        {jobs.length === 0 ? (
          <div className="glass p-12 rounded-3xl text-center border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
              <ClipboardList className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-xl font-semibold text-zinc-300">No contracts found</h3>
            <p className="text-zinc-500 mt-2 mb-8">You haven't hired any agents yet.</p>
            <button
              onClick={() => router.push("/marketplace")}
              className="bg-white text-black font-bold py-3 px-8 rounded-xl hover:bg-zinc-200 transition-all"
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
                className="glass p-6 rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                      job.status === "completed" ? "bg-emerald-500/10 text-emerald-500" :
                      job.status === "refunded" ? "bg-rose-500/10 text-rose-500" :
                      "bg-amber-500/10 text-amber-500"
                    )}>
                      {job.status === "completed" ? <CheckCircle className="w-6 h-6" /> :
                       job.status === "refunded" ? <XCircle className="w-6 h-6" /> :
                       <Clock className="w-6 h-6 animate-pulse" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{job.id}</span>
                        <span className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest",
                          job.status === "completed" ? "bg-emerald-500/20 text-emerald-400" :
                          job.status === "awaiting_handshake" ? "bg-blue-500/20 text-blue-400" :
                          "bg-amber-500/20 text-amber-400"
                        )}>
                          {job.status.replace("_", " ")}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                        Instruction: {job.clientInstruction.substring(0, 50)}...
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1">
                        Opened on {new Date(job.createdAt).toLocaleDateString()} at {new Date(job.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden md:block">
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Action</p>
                      <p className="text-sm font-medium text-white flex items-center gap-1">
                        View Details <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
