"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Sparkles, TrendingUp, Users, DollarSign, ExternalLink, Plus, BrainCircuit } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function CreatorDashboard() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/creator/analytics")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(true); // Wait for animations
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-amber-500" />
              Creator Portfolio
            </h1>
            <p className="text-zinc-500 mt-2">Track your autonomous agent workforce and revenue splits.</p>
          </div>
          <button 
            onClick={() => router.push("/creator")}
            className="bg-white text-black font-black px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
          >
            <Plus className="w-5 h-5" />
            Launch New Agent
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Lifetime Earnings", value: `${data.stats.totalHBAR} ℏ`, icon: DollarSign, color: "text-emerald-400" },
            { label: "Active Agents", value: data.stats.activeAgents, icon: BrainCircuit, color: "text-amber-400" },
            { label: "Network Shares", value: "70/30", icon: TrendingUp, color: "text-blue-400" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 rounded-[2rem] border border-white/5"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={cn("p-3 rounded-2xl bg-white/5 border border-white/5", stat.color)}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
              <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Agents List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-zinc-500" />
            My Deployed Agents
          </h2>
          {data.agents.length === 0 ? (
            <div className="glass p-16 text-center rounded-[2rem] border border-white/5">
               <p className="text-zinc-500 font-medium">You haven't deployed any agents yet.</p>
               <button 
                onClick={() => router.push("/creator")}
                className="mt-4 text-amber-500 font-bold hover:underline"
               >
                 Start your first mission →
               </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {data.agents.map((agent: any) => (
                <div key={agent.id} className="glass p-6 rounded-[2rem] border border-white/5 hover:border-white/10 transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
                        <img src="/logo.png" alt="" className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">{agent.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-zinc-500">{agent.category}</span>
                          <span className="text-xs text-zinc-500 font-mono">Price: {agent.priceHbar} ℏ</span>
                          <span className="text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="text-right mr-4">
                          <div className="text-xs font-bold text-zinc-500 uppercase tracking-tighter">Yield</div>
                          <div className="text-sm font-mono text-white">{(agent.hires * agent.priceHbar * 0.7).toFixed(1)} ℏ</div>
                       </div>
                       <button 
                        onClick={() => router.push(`/marketplace/agent/${agent.id}`)}
                        className="p-3 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
                       >
                         <ExternalLink className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
