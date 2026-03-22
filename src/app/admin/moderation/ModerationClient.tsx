"use client";

import { useState } from "react";
import { ShieldAlert, UserX, CheckCircle2, Flag, UserCheck, Wallet, User } from "lucide-react";
import Link from "next/link";

interface AdminUser {
  id: string;
  name: string;
  role: string;
  suspended: number;
  hederaAccountId?: string;
}

interface Job {
  id: string;
  status: string;
  clientInstruction: string;
  escrowAmountHbar: number;
}

interface ModerationPageProps {
  users: AdminUser[];
  jobs: Job[];
  suspendedCount: number;
  escrowedCount: number;
}

export function ModerationClient({ users, jobs, suspendedCount, escrowedCount }: ModerationPageProps) {
  const [localUsers, setLocalUsers] = useState(users);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const toggleSuspend = async (email: string, currentlySuspended: boolean) => {
    setLoadingId(email);
    try {
      const res = await fetch("/api/admin/suspend-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, suspend: !currentlySuspended }),
      });
      const data = await res.json();
      if (data.success) {
        setLocalUsers(prev =>
          prev.map(u => u.id === email ? { ...u, suspended: !currentlySuspended ? 1 : 0 } : u)
        );
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black flex items-center gap-3">
              <ShieldAlert className="text-rose-400 w-8 h-8" />
              Moderation <span className="text-zinc-500 font-light">| Trust & Safety</span>
            </h1>
            <p className="text-zinc-400 text-sm">Manage user accounts, review escrow transactions.</p>
          </div>
          <Link href="/admin" className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sm font-bold transition-all">
            &larr; Back to Admin
          </Link>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-rose-500/20 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <h3 className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <UserX className="w-4 h-4" /> Suspended Users
            </h3>
            <p className="text-3xl font-black text-rose-500">{suspendedCount}</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Active Escrows</h3>
            <p className="text-3xl font-black text-emerald-400">{escrowedCount}</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Total Users</h3>
            <p className="text-3xl font-black">{localUsers.length}</p>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-zinc-900/80 flex items-center justify-between">
            <h2 className="font-bold">Registered Users</h2>
            <span className="text-xs text-zinc-500">{localUsers.length} total</span>
          </div>
          <div className="divide-y divide-white/5">
            {localUsers.map((user) => (
              <div key={user.id} className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm truncate">{user.name || user.id}</p>
                      {user.role === "admin" && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-violet-500/15 text-violet-400">Admin</span>
                      )}
                      {user.suspended === 1 && (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-500/15 text-rose-400">Suspended</span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate">{user.id}</p>
                    {user.hederaAccountId && (
                      <p className="text-[10px] text-zinc-600 flex items-center gap-1 mt-0.5">
                        <Wallet className="w-3 h-3" /> {user.hederaAccountId}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-14 sm:ml-0">
                  {user.role !== "admin" && (
                    <button
                      disabled={loadingId === user.id}
                      onClick={() => toggleSuspend(user.id, user.suspended === 1)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50
                        ${user.suspended === 1
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                        }`}
                    >
                      {user.suspended === 1
                        ? <><UserCheck className="w-4 h-4" /> Reinstate</>
                        : <><UserX className="w-4 h-4" /> Suspend</>
                      }
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Escrow Jobs */}
        <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-zinc-900/80">
            <h2 className="font-bold">Recent Escrow Transactions</h2>
          </div>
          <div className="divide-y divide-white/5">
            {jobs.slice(0, 5).map((job) => (
              <div key={job.id} className="p-5 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold font-mono text-xs">{job.id}</h3>
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider
                      ${job.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                        job.status === 'escrowed' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-zinc-800 text-zinc-400'}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-1">{job.clientInstruction}</p>
                </div>
                <p className="font-mono text-white font-bold shrink-0">{job.escrowAmountHbar} ℏ</p>
              </div>
            ))}
            {jobs.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">No transactions to review.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
