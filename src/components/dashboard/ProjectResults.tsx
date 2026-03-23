"use client";

import { motion } from "framer-motion";
import { Activity, Download, FileText, Code, Presentation, Image, Layers, ShieldAlert, Lock, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AgentCard from "@/components/AgentCard";
import HederaLogPanel from "@/components/HederaLogPanel";
import { cn } from "@/lib/utils";
import type { AgentRunResult, Deliverable } from "@/lib/types";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useHOL } from "@/components/providers/HOLProvider";

interface ProjectResultsProps {
  result: AgentRunResult;
  activeTab: "agents" | "deliverables" | "hedera";
  setActiveTab: (tab: "agents" | "deliverables" | "hedera") => void;
  mode: "goal" | "challenge";
  downloadDeliverable: (deliverable: Deliverable) => void;
}

export default function ProjectResults({
  result, activeTab, setActiveTab, mode, downloadDeliverable
}: ProjectResultsProps) {
  const { data: session } = useSession();
  const { isConnected, accountId } = useHOL();
  const router = useRouter();

  const doneCount = result.plan?.tasks.filter((t) => t.status === "done").length ?? 0;
  const totalCount = result.plan?.tasks.length ?? 0;
  
  // Authenticated either via NextAuth or HOL Wallet
  const isAuth = !!session || isConnected;


  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-3xl p-6 flex flex-col justify-between hover:bg-white/[0.04] transition-colors border-white/[0.05]">
          <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Status</span>
          <div className="flex items-end justify-between">
             <h3 className="text-2xl font-bold text-white leading-none">Execution</h3>
             <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] rounded-full border border-emerald-500/20 font-bold uppercase italic tracking-tighter">Live</span>
          </div>
        </div>
        <div className="glass rounded-3xl p-6 flex flex-col justify-between hover:bg-white/[0.04] transition-colors border-white/[0.05]">
          <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Progress</span>
          <div className="flex items-end justify-between">
             <h3 className="text-2xl font-bold text-white leading-none">{doneCount}/{totalCount}</h3>
             <span className="text-zinc-500 text-xs font-medium">Tasks Resolved</span>
          </div>
        </div>
        <div className="glass rounded-3xl p-6 flex flex-col justify-between hover:bg-white/[0.04] transition-colors border-white/[0.05]">
          <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Network Activity</span>
          <div className="flex items-end justify-between">
             <h3 className="text-2xl font-bold text-violet-400 leading-none">{result.hederaLogs.length}</h3>
             <span className="text-zinc-500 text-xs font-medium uppercase font-black tracking-tighter">HCS Events</span>
          </div>
        </div>
      </div>

      {/* Internal Tabs - scrollable on mobile */}
      <div className="flex gap-1.5 p-1.5 glass bg-white/[0.03] rounded-2xl overflow-x-auto no-scrollbar">
        {[
          { id: "agents" as const, label: mode === "goal" ? "Agent Swarm" : "Solutions", icon: Layers },
          { id: "deliverables" as const, label: "Deliverables", icon: Download },
          { id: "hedera" as const, label: "Live Ledger", icon: Activity },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
              activeTab === id
                ? "bg-white/10 text-white shadow-lg"
                : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === "deliverables" && result.deliverables && (
               <span className="ml-1 text-[10px] bg-white/10 text-zinc-400 px-1.5 py-0.5 rounded-md">
                 {result.deliverables.length}
               </span>
            )}
          </button>
        ))}
      </div>

      {/* Panel Content (Bento Style) */}
      <div className="min-h-[400px] relative">
        <div className={cn("transition-all duration-700", !isAuth && activeTab !== "hedera" && "blur-lg pointer-events-none select-none select-none opacity-40")}>
          {activeTab === "agents" && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mode === "goal" && result.plan ? (
                  result.plan.tasks.map((task, i) => (
                    <AgentCard key={task.id} task={task} index={i} />
                  ))
                ) : mode === "challenge" && result.challenge ? (
                  (result.challenge.tasks?.length ?? 0) > 0 ? (
                    result.challenge.tasks!.map((task, i) => (
                      <AgentCard key={task.id} task={task} index={i} />
                    ))
                  ) : result.challenge.brainstormedSolutions?.map((solution, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass rounded-[2rem] p-7 border-white/[0.08] hover:bg-white/[0.04] transition-all group overflow-hidden relative"
                    >
                       {/* Approach Indicator */}
                       <div className="absolute top-0 right-0 px-4 py-1.5 bg-violet-500/20 text-violet-400 text-[9px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-violet-500/20">
                          Approach {i + 1}
                       </div>
                       <div className="text-white text-sm leading-relaxed prose prose-sm prose-invert max-w-none pt-4">
                          <ReactMarkdown>{solution}</ReactMarkdown>
                       </div>
                    </motion.div>
                  ))
                ) : null}
             </div>
          )}

          {activeTab === "deliverables" && result.deliverables && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {result.deliverables.map((deliverable, i) => (
                  <motion.div
                    key={deliverable.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-3xl p-4 sm:p-6 border-white/[0.08] hover:bg-white/[0.04] transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/10 to-blue-500/5 flex items-center justify-center border border-white/[0.05] group-hover:scale-110 transition-transform">
                         {deliverable.type === "presentation" && <Presentation className="w-7 h-7 text-violet-400" />}
                         {deliverable.type === "pdf" && <FileText className="w-7 h-7 text-red-400" />}
                         {deliverable.type === "spreadsheet" && <FileText className="w-7 h-7 text-emerald-400" />}
                         {deliverable.type === "codebase" && <Code className="w-7 h-7 text-amber-400" />}
                         {deliverable.type === "image" && <Image className="w-7 h-7 text-blue-400" />}
                      </div>
                      <div>
                         <h4 className="text-white font-bold text-lg mb-1 leading-none">{deliverable.name}</h4>
                         <p className="text-zinc-500 text-xs line-clamp-1">{deliverable.description}</p>
                         <div className="flex gap-2 mt-3">
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                              {deliverable.type}
                            </span>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-green-500/10 text-green-400 rounded">
                              IPFS Ready
                            </span>
                         </div>
                      </div>
                    </div>
                    <button
                      onClick={() => isAuth && downloadDeliverable(deliverable)}
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-xl",
                        isAuth ? "bg-white/5 hover:bg-violet-500 text-zinc-400 hover:text-white" : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                      )}
                    >
                      {isAuth ? <Download className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                    </button>
                  </motion.div>
                ))}
             </div>
          )}

          {activeTab === "hedera" && (
             <div className="glass rounded-[2rem] p-8 border-white/[0.08]">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">Live Ledger Traces</h3>
                      <p className="text-zinc-500 text-xs">Immutable transparency layer powered by Hedera Services</p>
                    </div>
                    <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
                       <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Connected</span>
                    </div>
                 </div>
                 <HederaLogPanel logs={result.hederaLogs} />
             </div>
          )}
        </div>

        {/* Lock Overlay for Guests */}
        {!isAuth && activeTab !== "hedera" && (
          <div className="absolute inset-x-0 top-0 bottom-0 z-20 flex items-center justify-center p-6">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="glass rounded-[2.5rem] p-10 max-w-lg w-full text-center border-violet-500/30 shadow-[0_0_50px_rgba(167,139,250,0.15)] overflow-hidden relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent animate-pulse" />
               <div className="w-20 h-20 rounded-[2rem] bg-violet-600/20 border border-violet-500/20 flex items-center justify-center mx-auto mb-8 relative group">
                  <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full animate-pulse group-hover:blur-2xl transition-all" />
                  <Lock className="w-10 h-10 text-violet-400 relative z-10" />
               </div>
               
               <h3 className="text-3xl font-black text-white mb-4 tracking-tight leading-tight">
                 Unlock Full <span className="gradient-text">Execution</span>
               </h3>
               <p className="text-zinc-400 mb-10 text-sm leading-relaxed max-w-xs mx-auto">
                 The Agents have completed their work autonomously. Create an account or authenticate to access the deliverables, codebases, and full strategy reports.
               </p>

                <div className="flex flex-col gap-4">
                  {/* HOL Wallet Connect Component */}
                  <hashgraph-wallet-connect 
                    theme="dark" 
                    btn-text="Connect to Unlock"
                  />
                  
                  <button 
                    onClick={() => router.push("/login")}
                    className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Start Building Now
                  </button>
                  <button 
                    onClick={() => router.push("/pricing")}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
                  >
                    Bypass with Enterprise License
                  </button>
                </div>
            </motion.div>
          </div>
        )}
      </div>

    </div>
  );
}
