"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Shield, Users, FileText, Activity, AlertCircle, Settings, ChevronRight, Zap, ShieldAlert, DollarSign } from "lucide-react";
import Link from "next/link";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface PlatformStats {
  usersCount: number;
  jobsCount: number;
  completedJobsCount: number;
  agentsCount: number;
  platformIncome: number;
  suspendedCount: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [platformStats, setPlatformStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && session?.user) {
      if ((session.user as any).role === "admin" || session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true);
        // Fetch live stats
        fetch("/api/admin/stats")
          .then(r => r.json())
          .then(data => setPlatformStats(data))
          .catch(() => {});
      } else {
        router.push("/creator/dashboard");
      }
    }
  }, [session, status, router]);

  if (status === "loading" || !isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-12 pb-20">
        <header className="flex justify-between items-end">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-400 bg-violet-500/10 px-4 py-1 rounded-full border border-violet-500/20">
              System Admin
            </span>
            <h1 className="text-4xl font-black tracking-tight">Platform <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Overview</span></h1>
            <p className="text-zinc-500 text-sm max-w-sm">Manage users, articles, and system configurations from a central dashboard.</p>
          </div>
          <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2">
            <Settings className="w-4 h-4 text-zinc-400" />
            Config
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Users", value: platformStats ? String(platformStats.usersCount) : "—", icon: Users, color: "text-blue-400" },
            { label: "Escrow Jobs", value: platformStats ? String(platformStats.jobsCount) : "—", icon: Activity, color: "text-emerald-400" },
            { label: "Platform Income", value: platformStats ? `${platformStats.platformIncome.toFixed(2)} ℏ` : "—", icon: DollarSign, color: "text-violet-400" },
            { label: "Active Agents", value: platformStats ? String(platformStats.agentsCount) : "—", icon: Shield, color: "text-amber-400" },
          ].map((stat) => (
            <div key={stat.label} className="p-6 rounded-3xl bg-white/[0.03] border border-white/[0.08] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:translate-x-10 group-hover:-translate-y-10" />
              <div className="relative z-10 flex flex-col justify-between h-full">
                <div className={`p-3 rounded-2xl bg-white/5 w-fit mb-6 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Logs & Article Management */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Recent System Events
              </h2>
            </div>
            <div className="rounded-3xl border border-white/[0.08] bg-black overflow-hidden">
               <table className="w-full text-left text-xs">
                 <thead className="bg-white/5 text-zinc-500 uppercase font-black tracking-widest">
                   <tr>
                     <th className="px-6 py-4">Event</th>
                     <th className="px-6 py-4">Status</th>
                     <th className="px-6 py-4">Timestamp</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {[
                     { event: "HCS Sequence Validated", status: "Success", time: "2m ago" },
                     { event: "New Agent Profile - Created", status: "Review", time: "15m ago" },
                     { event: "Escrow Finalized #7842", status: "Success", time: "1h ago" },
                     { event: "IPFS Pinning - Verification", status: "Success", time: "3h ago" },
                   ].map((item, i) => (
                     <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                       <td className="px-6 py-4 font-bold text-zinc-300">{item.event}</td>
                       <td className="px-6 py-4">
                         <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${item.status === 'Success' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                           {item.status}
                         </span>
                       </td>
                       <td className="px-6 py-4 text-zinc-500">{item.time}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold">Admin Toolkit</h2>
            <div className="space-y-3">
              {[
                { label: "Content (CMS)", icon: FileText, href: "/admin/content", color: "text-violet-400", hoverColor: "group-hover:text-violet-400" },
                { label: "Metrics & Telemetry", icon: Activity, href: "/admin/telemetry", color: "text-cyan-400", hoverColor: "group-hover:text-cyan-400" },
                { label: "Platform Moderation", icon: ShieldAlert, href: "/admin/moderation", color: "text-rose-400", hoverColor: "group-hover:text-rose-400" },
              ].map((tool) => (
                <Link href={tool.href} key={tool.label} className="w-full p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-violet-500/30 transition-all text-left flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-white/5 text-zinc-400 ${tool.hoverColor} transition-colors`}>
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-zinc-300 group-hover:text-white transition-colors">{tool.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
