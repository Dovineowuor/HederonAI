"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Activity, Star, DownloadCloud, ShieldCheck } from "lucide-react";
import ReactMarkdown from "react-markdown";

type EscrowJob = {
  id: string;
  agentId: string;
  clientInstruction: string;
  rating?: number;
  txHash?: string;
  clientId?: string;
  status: "escrowed" | "working" | "awaiting_handshake" | "completed" | "refunded";
  output?: string;
  cid?: string;
};

export default function HandshakeJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params?.id as string;
  
  const [job, setJob] = useState<EscrowJob | null>(null);
  const [processing, setProcessing] = useState(false);

  // Poll for job updates (simulate real-time background execution)
  useEffect(() => {
    if (!jobId) return;
    
    let interval: NodeJS.Timeout;
    const fetchJob = async () => {
      const res = await fetch(`/api/marketplace/jobs/${jobId}`);
      const data = await res.json();
      if (data.job) {
        setJob(data.job);
        // If it's still being processed, keep polling every 2s
        if (data.job.status === "escrowed" || data.job.status === "working") {
          interval = setTimeout(fetchJob, 2000);
        }
      }
    };
    fetchJob();
    return () => clearTimeout(interval);
  }, [jobId]);

  const handleHandshake = async (action: "confirm" | "reject") => {
    if (!jobId) return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/marketplace/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      alert(data.message);
      
      // Refresh job state
      const refreshed = await fetch(`/api/marketplace/jobs/${jobId}`);
      const freshData = await refreshed.json();
      setJob(freshData.job);
      
    } catch (err) {
      console.error(err);
      alert("Handshake failed.");
    } finally {
      setProcessing(false);
    }
  };

  const handleRate = async (rating: number) => {
    if (!jobId || !job || job.status !== "completed") return;
    setProcessing(true);
    try {
      const res = await fetch(`/api/marketplace/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "rate", rating })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Refresh job state to show it is rated
      const refreshed = await fetch(`/api/marketplace/jobs/${jobId}`);
      const freshData = await refreshed.json();
      setJob(freshData.job);
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating.");
    } finally {
      setProcessing(false);
    }
  };

  const downloadSimulatedArtifact = () => {
    if (!job) return;
    const report = `# ExecuAI Job Deliverable: ${job.id}
---
**Client Instruction**: ${job.clientInstruction}
**Agent ID**: ${job.agentId}
**Timestamp**: ${new Date().toLocaleString()}
**Hedera Transaction**: ${job.txHash || "N/A"}

## Agent Output:
${job.output || "No output provided."}

---
*This is a verifiable simulated artifact for the ExecuAI Marketplace POC (Phase 10).*
`;

    const blob = new Blob([report], { type: "text/markdown" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ExecuAI_${job.id}_Report.md`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!job) {
    return (
      <div className="min-h-screen bg-black flex justify-center py-32">
        <div className="w-8 h-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin"></div>
      </div>
    );
  }

  const isWorking = job.status === "escrowed" || job.status === "working";
  const ipfsGatewayUrl = process.env.NEXT_PUBLIC_IPFS_GATEWAY || "https://ipfs.io";
  const needsHandshake = job.status === "awaiting_handshake";
  const isFinalized = job.status === "completed" || job.status === "refunded";

  return (
    <div className="min-h-screen bg-black text-white pb-32">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <button
          onClick={() => router.push("/marketplace")}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Activity className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Escrow Contract: {job.id}</h1>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-zinc-400">Agent autonomously executing task instructions</p>
              {job.clientId && (
                <div className="flex items-center gap-1.5 pl-2 ml-2 border-l border-white/10">
                  <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Hired By:</span>
                  <span className="text-xs text-indigo-400 font-mono font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">
                    {job.clientId}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Pipeline Visualizer */}
        <div className="glass p-6 rounded-2xl mb-8 border border-white/5 flex flex-wrap gap-4 items-center font-mono text-sm">
          <div className="text-emerald-400">● 1. Funds Escrowed</div>
          <div className="text-zinc-600">→</div>
          <div className={job.status === "working" || needsHandshake || isFinalized ? "text-amber-400" : "text-zinc-600"}>
            ● 2. Agent Working
          </div>
          <div className="text-zinc-600">→</div>
          <div className={needsHandshake || isFinalized ? "text-blue-400" : "text-zinc-600"}>
            ● 3. Awaiting Handshake
          </div>
          <div className="text-zinc-600">→</div>
          <div className={isFinalized ? (job.status === "completed" ? "text-emerald-400 font-bold" : "text-rose-400 font-bold") : "text-zinc-600"}>
            ● 4. Settlement
          </div>
        </div>

        {isWorking ? (
          <div className="glass p-16 rounded-3xl text-center border border-white/10 flex flex-col items-center">
            <Loader2 className="w-16 h-16 text-amber-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white mb-2">Agent is actively processing...</h2>
            <p className="text-zinc-400 max-w-md mx-auto">
              Please wait while the AI agent analyzes your instructions and generates the deliverables. 
              The HCS events are currently being logged in the background.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl border border-white/10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 pb-8 border-b border-white/5">
                <div>
                  <h2 className="text-lg font-bold text-zinc-400 mb-1 tracking-wider uppercase flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Deliverable Output
                  </h2>
                  <p className="text-sm text-zinc-500">The agent has completed the autonomous execution phase.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {job.cid && (
                    <button 
                      onClick={downloadSimulatedArtifact}
                      className="flex items-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 px-4 py-2 rounded-xl text-indigo-400 text-sm font-bold transition-all"
                    >
                      <DownloadCloud className="w-4 h-4" />
                      Simulated Artifact
                    </button>
                  )}
                  {job.txHash && (
                    <a 
                      href={`https://hashscan.io/testnet/transaction/${job.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 px-4 py-2 rounded-xl text-purple-400 text-sm font-bold transition-all"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      HFS Ledger Proof
                    </a>
                  )}
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-zinc-300">
                <ReactMarkdown>{job.output || "No output provided."}</ReactMarkdown>
              </div>
            </div>

            {/* Verifiable Metadata Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">IPFS Fingerprint (Dev Local)</p>
                <code className="text-xs text-indigo-300 break-all">{job.cid || "N/A"}</code>
              </div>
              <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Hedera File Transcript (Primary)</p>
                <code className="text-xs text-purple-300 break-all">{job.txHash || "N/A"}</code>
              </div>
            </div>

          {/* Handshake Verification */}
          {job.status === "awaiting_handshake" && (
            <div className="glass p-8 rounded-2xl border border-white/10 mb-8 animate-in slide-in-from-bottom-4">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-indigo-400" />
                Handshake Verification Required
              </h2>
              
              <div className="bg-black/40 border border-white/5 rounded-xl p-6 mb-8 prose prose-invert max-w-none">
                <ReactMarkdown>{job.output || ""}</ReactMarkdown>
              </div>

              {job.cid && (
                <div className="mb-8 flex flex-col md:flex-row items-center gap-4 bg-indigo-500/10 border border-indigo-500/20 p-4 rounded-xl">
                  <DownloadCloud className="w-8 h-8 text-indigo-400 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-white font-bold mb-1">Verifiable Project Deliverables</h3>
                    <p className="text-sm text-indigo-200/70">The Agent has packaged formal files. Download the simulated bundle below for verification.</p>
                  </div>
                  <button 
                    onClick={downloadSimulatedArtifact}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Download (Local Sim)
                  </button>
                </div>
              )}

              {/* Simulation Mode Warning */}
              {job.cid?.startsWith('Qm') && job.cid.length === 46 && (
                <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                  <p className="text-[10px] text-amber-200/70 font-medium">
                    Note: Using a simulated CID for local development. Public gateways may return 404 until content is pinned to a global node.
                  </p>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-4 mt-8">
                <button
                  disabled={processing}
                  onClick={() => handleHandshake("confirm")}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-4 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex justify-center items-center gap-2"
                >
                  {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> Accept Work & Release Funds</>}
                </button>
                <button
                  disabled={processing}
                  onClick={() => handleHandshake("reject")}
                  className="w-full md:w-auto px-8 bg-zinc-800 hover:bg-rose-500/20 hover:text-rose-400 text-white font-bold py-4 rounded-xl transition-colors border border-transparent hover:border-rose-500/50"
                >
                  Reject & Refund
                </button>
              </div>
              <p className="text-xs text-zinc-500 text-center mt-4">
                * Rejecting the work initiates a smart contract reversal subject to a 5% system gas penalty.
              </p>
            </div>
          )}

          {/* Finalized Status & Ratings */}
          {isFinalized && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${job.status === "completed" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" : "bg-rose-500/10 border-rose-500/30 text-rose-400"}`}>
                <div className="flex items-center gap-3 font-bold text-lg">
                  {job.status === "completed" ? (
                    <><CheckCircle2 className="w-6 h-6" /> HANDSHAKE COMPLETE: Funds fully released to Agent.</>
                  ) : (
                    <><XCircle className="w-6 h-6" /> ESCROW REVERSED: Funds refunded to Client.</>
                  )}
                </div>
                {job.txHash && (
                  <div className="mt-4 pt-4 border-t border-current/20 flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
                    <div className="text-sm font-mono opacity-80 truncate">TX: {job.txHash}</div>
                    <a 
                      href={`https://hashscan.io/testnet/transaction/${job.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 bg-current/10 hover:bg-current/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors shrink-0"
                    >
                      Verify on Hashscan
                    </a>
                  </div>
                )}
              </div>

              {/* Leave Rating if Completed */}
              {job.status === "completed" && !job.rating && (
                <div className="glass p-6 rounded-2xl border border-white/10 text-center animate-in fade-in zoom-in">
                  <h3 className="text-white font-bold mb-4">Rate this Agent's Delivery</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => handleRate(star)}
                        disabled={processing}
                        className="p-2 hover:bg-amber-500/20 rounded-full transition-colors group disabled:opacity-50"
                      >
                        <Star className="w-8 h-8 text-zinc-500 group-hover:text-amber-500 group-hover:fill-amber-500 transition-all" />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-zinc-500">Leaving a review boosts this Agent on the Marketplace.</p>
                </div>
              )}

              {job.status === "completed" && job.rating && (
                <div className="glass p-6 rounded-2xl border border-amber-500/30 flex flex-col items-center">
                  <div className="flex text-amber-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-6 h-6 ${i < job.rating! ? "fill-amber-500" : "fill-transparent text-zinc-600 border-zinc-600"}`} />
                    ))}
                  </div>
                  <div className="text-emerald-400 font-bold mb-4">Thank you for leaving feedback!</div>
                  <button 
                    onClick={() => router.push(`/marketplace/agent/${job.agentId}`)}
                    className="text-white text-sm bg-white/10 hover:bg-white/20 py-2 px-6 rounded-xl font-medium transition"
                  >
                    Return to Agent Profile
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);
}
