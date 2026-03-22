"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Star, ShieldCheck, CheckCircle2, History, Briefcase, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

type EscrowAgent = {
  id: string;
  name: string;
  creator: string;
  description: string;
  category: string;
  priceHbar: number;
  rating: number;
  reviewCount: number;
  hires: number;
  isSystem?: boolean;
};

type EscrowJob = {
  id: string;
  clientInstruction: string;
  output?: string;
  cid?: string;
  rating?: number;
  txHash?: string;
  clientId?: string;
  status: string;
  completedAt?: string;
};

export default function AgentProfilePage() {
  const router = useRouter();
  const params = useParams();
  const agentId = params?.id as string;

  const [agent, setAgent] = useState<EscrowAgent | null>(null);
  const [jobs, setJobs] = useState<EscrowJob[]>([]);
  const [loading, setLoading] = useState(true);

  // Expanded/collapsed states for past jobs
  const [expandedJob, setExpandedJob] = useState<string | null>(null);

  useEffect(() => {
    if (!agentId) return;

    // We can fetch agents and jobs
    Promise.all([
      fetch(`/api/marketplace/agents`).then(r => r.json()),
      fetch(`/api/marketplace/agent/${agentId}/jobs`).then(r => r.json()).catch(() => ({ jobs: [] }))
    ]).then(([agentsData, jobsData]) => {
      const found = agentsData.agents?.find((a: any) => a.id === agentId);
      if (found) setAgent(found);
      if (jobsData.jobs) setJobs(jobsData.jobs);
      setLoading(false);
    });
  }, [agentId]);

  if (loading || !agent) {
    return (
      <div className="min-h-screen bg-black flex justify-center py-32">
        <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  // Filter only completed jobs and take top 12
  const recentJobs = jobs.filter(j => j.status === "completed").slice(0, 12);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/30">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-[400px] bg-gradient-to-b from-amber-900/20 to-transparent pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 py-8 md:py-16">
        <button
          onClick={() => router.push("/marketplace")}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        {/* Profile Header */}
        <div className="glass rounded-3xl p-8 mb-12 border border-white/10 flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px]"></div>
          
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shrink-0 shadow-xl shadow-amber-500/20 border-2 border-amber-300 group overflow-hidden">
            <img src="/logo.png" alt="Agent" className="w-16 h-16 object-contain group-hover:scale-110 transition-transform" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                {agent.name}
              </h1>
              {agent.isSystem ? (
                 <span className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase px-3 py-1 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" /> Verified System Agent
                 </span>
              ) : (
                <span className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-xs font-black uppercase px-3 py-1 rounded-full border border-amber-500/20">
                   <Briefcase className="w-4 h-4" /> Creator Agent
                </span>
              )}
            </div>
            <div className="text-zinc-400 font-mono text-sm mb-4">Contract ID: {agent.id} • Creator: {agent.creator}</div>
            <p className="text-lg text-zinc-300 max-w-2xl leading-relaxed">
              {agent.description}
            </p>
          </div>

          <div className="glass p-5 rounded-2xl border border-white/10 bg-black/50 min-w-[200px] text-center shrink-0">
            <div className="text-amber-400 font-bold flex items-center justify-center gap-1 text-xl mb-1">
              <Star className="w-5 h-5 fill-current" />
              {agent.rating > 0 ? agent.rating : "New"}
              <span className="text-sm font-normal text-zinc-500 ml-1">({agent.reviewCount} reviews)</span>
            </div>
            <div className="text-zinc-300 font-medium mb-4">{agent.hires} Successful Contracts</div>
            <button
              onClick={() => router.push(`/marketplace/hire?agentId=${agent.id}`)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex flex-col items-center justify-center"
            >
              <div className="text-lg">Hire for {agent.priceHbar} ℏ</div>
              <div className="text-[10px] uppercase tracking-widest opacity-60">Instant HTS Settlement</div>
            </button>
            {!agent.isSystem && (
              <div className="mt-3 text-[10px] text-zinc-500 text-center leading-tight">
                70% of fees go directly to creator<br/>
                30% platform stabilization fee
              </div>
            )}
          </div>
        </div>

        {/* verifiable History Board */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-400" />
            Verifiable Job History
            <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20 ml-3">
              Last 12 Completed Handshakes
            </span>
          </h2>

          {recentJobs.length === 0 ? (
            <div className="glass p-12 text-center rounded-2xl border border-white/5 text-zinc-400">
               No cryptographic handshakes resolved yet for this agent on the current testnet ledger.
            </div>
          ) : (
            <div className="space-y-4">
              {recentJobs.map(job => (
                <div key={job.id} className="glass border border-white/5 rounded-2xl overflow-hidden bg-zinc-900/30">
                  <div 
                    className="p-5 flex justify-between items-center cursor-pointer hover:bg-zinc-800/50 transition"
                    onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/5 flex items-center justify-center border border-emerald-500/20 relative group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full blur-[4px] animate-pulse"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <div className="font-mono text-[10px] text-zinc-500 bg-white/5 px-2 py-0.5 rounded border border-white/5">{job.id}</div>
                          <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter Otros">{new Date(job.completedAt || "").toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                          {job.clientId && (
                            <div className="flex items-center gap-1 bg-indigo-500/10 text-indigo-400 text-[9px] px-2 py-0.5 rounded-full border border-indigo-500/20 font-black uppercase tracking-widest">
                              <ShieldCheck className="w-2.5 h-2.5" />
                              Client: {job.clientId.includes('0.0.') ? job.clientId : job.clientId.substring(0, 8) + '...'}
                            </div>
                          )}
                        </div>
                        <div className="font-bold text-white group-hover:text-amber-400 transition-colors truncate max-w-sm md:max-w-xl text-sm italic">
                          "{job.clientInstruction}"
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      {job.rating && (
                        <div className="flex text-amber-400 items-center text-sm gap-1 hidden md:flex">
                          {Array.from({length: job.rating}).map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                        </div>
                      )}
                      <ChevronRight className={`w-5 h-5 text-zinc-500 transition-transform ${expandedJob === job.id ? "rotate-90" : ""}`} />
                    </div>
                  </div>

                  {expandedJob === job.id && (
                    <div className="p-6 border-t border-white/5 bg-black/40">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                          <Briefcase className="w-4 h-4" /> Rendered Output Preview
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          {job.txHash && (
                            <a 
                              href={`https://hashscan.io/testnet/transaction/${job.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white transition-colors text-xs font-bold py-1 px-3 rounded-full border border-purple-500/30 flex items-center gap-1"
                            >
                              Verify on Hashscan
                            </a>
                          )}
                          {job.cid && (
                            <a 
                              href={`${process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io"}/ipfs/${job.cid}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-indigo-500/20 hover:bg-indigo-500 text-indigo-300 hover:text-white transition-colors text-xs font-bold py-1 px-3 rounded-full border border-indigo-500/30 flex items-center gap-1"
                            >
                              Download Artifacts
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="prose prose-invert prose-sm max-w-none text-zinc-300">
                        <ReactMarkdown>
                           {job.output ? (job.output.length > 300 ? job.output.substring(0, 300) + '...' : job.output) : "*No output preview available for this job*"}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
