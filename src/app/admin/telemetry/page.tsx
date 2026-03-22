import { Activity, Server, Clock, AlertTriangle, ArrowRight, Zap, RefreshCw, Users, DollarSign, Briefcase, BookOpen, Star, TrendingDown } from "lucide-react";
import Link from "next/link";
import { getUsersCount, getJobs, getAgents, getArticleStats } from "@/lib/db";

export default async function AdminTelemetryPage() {
  const usersCount = getUsersCount();
  const jobs = getJobs();
  const agentsCount = getAgents().length;
  const articleStats = getArticleStats();
  
  const platformIncome = jobs
    .filter(job => job.status === 'completed')
    .reduce((acc, job) => acc + (job.escrowAmountHbar * 0.025), 0);
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Activity className="text-cyan-400 w-8 h-8" />
              Telemetry <span className="text-zinc-500 font-light">| Gateway</span>
            </h1>
            <p className="text-zinc-400 text-sm">Real-time API gateway metrics, latency tracking, and error logs.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sm font-bold transition-all">
              &larr; Back to Admin
            </Link>
            <button className="px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 text-sm font-bold transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Refresh Data
            </button>
          </div>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Total Platform Income</p>
              <h2 className="text-3xl font-black font-mono">{platformIncome.toFixed(2)} ℏ</h2>
            </div>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Total Users</p>
              <h2 className="text-3xl font-black font-mono">{usersCount}</h2>
            </div>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Transactions (Jobs)</p>
              <h2 className="text-3xl font-black font-mono">{jobs.length}</h2>
            </div>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-3">
             <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-1">Listed Agents</p>
              <h2 className="text-3xl font-black font-mono">{agentsCount}</h2>
            </div>
          </div>
        </div>

        {/* Content & Article Analytics */}
        <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-zinc-900/80 flex items-center justify-between">
            <h2 className="font-bold">Content & Article Analytics</h2>
            <span className="text-xs text-zinc-500">{articleStats.list.length} tracked articles</span>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Platform Total Views
              </h3>
              <p className="text-3xl font-black text-white">{articleStats.totalViews.toLocaleString()}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <Star className="w-4 h-4" /> Top Article
              </h3>
              <p className="text-lg font-bold text-white truncate" title={articleStats.topArticle?.slug || "None"}>
                {articleStats.topArticle?.slug || "No data"}
              </p>
              <p className="text-sm font-mono text-zinc-500">{articleStats.topArticle?.views || 0} views</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <TrendingDown className="w-4 h-4" /> Lowest Performing
              </h3>
              <p className="text-lg font-bold text-white truncate" title={articleStats.worstArticle?.slug || "None"}>
                {articleStats.worstArticle?.slug || "No data"}
              </p>
              <p className="text-sm font-mono text-zinc-500">{articleStats.worstArticle?.views || 0} views</p>
            </div>
          </div>
        </div>

        {/* Recent API Logs */}
        <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-zinc-900/80">
            <h2 className="font-bold">Recent Kilo AI API Invocations</h2>
          </div>
          
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-400">
              <thead className="text-xs uppercase bg-zinc-900/50 text-zinc-500">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Endpoint</th>
                  <th className="px-6 py-4">Model</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {[
                  { time: "2 mins ago", ep: "/api/gateway/chat", model: "minimax-8b", dur: "1.1s", stat: "200 OK", col: "text-emerald-400" },
                  { time: "5 mins ago", ep: "/api/gateway/chat", model: "qwen-2.5-7b", dur: "4.2s", stat: "200 OK", col: "text-emerald-400" },
                  { time: "12 mins ago", ep: "/api/gateway/chat", model: "gemma2-9b-it", dur: "8.1s", stat: "504 Timeout", col: "text-red-500" },
                  { time: "18 mins ago", ep: "/api/gateway/chat", model: "qwen-2.5-7b", dur: "2.3s", stat: "200 OK", col: "text-emerald-400" },
                  { time: "30 mins ago", ep: "/api/settings", model: "N/A", dur: "0.1s", stat: "200 OK", col: "text-emerald-400" },
                ].map((log, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">{log.time}</td>
                    <td className="px-6 py-4 text-zinc-300">{log.ep}</td>
                    <td className="px-6 py-4">{log.model}</td>
                    <td className="px-6 py-4">{log.dur}</td>
                    <td className={`px-6 py-4 text-right font-bold ${log.col}`}>{log.stat}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
