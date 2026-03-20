"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, Send, Loader2, Coins, User } from "lucide-react";

type EscrowAgent = {
  id: string;
  name: string;
  priceHbar: number;
};

function HireAgentContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams?.get("agentId");

  const [agent, setAgent] = useState<EscrowAgent | null>(null);
  const [instruction, setInstruction] = useState("");
  const [isEscrowing, setIsEscrowing] = useState(false);

  useEffect(() => {
    if (agentId) {
      fetch("/api/marketplace/agents")
        .then(res => res.json())
        .then(data => {
          const found = data.agents.find((a: any) => a.id === agentId);
          if (found) setAgent(found);
        });
    }
  }, [agentId]);

  const handleEscrow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || !agent) return;

    setIsEscrowing(true);

    try {
      const res = await fetch("/api/marketplace/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          instruction,
          priceHbar: agent.priceHbar
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Successfully escrowed, route to the Job Status handshake view
      router.push(`/marketplace/jobs/${data.job.id}`);
      
    } catch (err) {
      console.error(err);
      alert("Failed to initiate escrow.");
      setIsEscrowing(false);
    }
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30">
      <div className="max-w-3xl mx-auto px-4 py-12 w-full">
        <header className="mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group mb-6"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back
          </button>
          
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-500">
            Escrow Agent
          </h1>
          <p className="text-lg text-zinc-400 mt-2">
            You are drafting a contract to hire <span className="text-white font-semibold">{agent.name}</span> for {agent.priceHbar} ℏ.
          </p>
        </header>

        <form onSubmit={handleEscrow} className="glass p-8 rounded-3xl border border-white/10 space-y-6">
          {session && (
            <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Hiring As</div>
                <div className="text-sm font-medium text-white">{session.user?.name || session.user?.email || "Authenticated User"}</div>
              </div>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Provide your required deliverables and context (The Mission):
            </label>
            <textarea 
              autoFocus
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="E.g., I need a full competitive analysis report on 3 AI agents in the Solana ecosystem..."
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[150px]"
              required
            />
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4">
            <Coins className="w-6 h-6 text-amber-400 shrink-0" />
            <div className="text-sm text-amber-200/80">
              Upon clicking below, {agent.priceHbar} HBAR will be deposited into the <code>AgentMarketplace.sol</code> Smart Contract.
              The agent will begin working autonomously. You maintain full control to Confirm/Reject the output.
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isEscrowing || !instruction.trim()}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-orange-500/20"
          >
            {isEscrowing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Escrowing on Hedera...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" /> Sign Contract & Escrow {agent.priceHbar} ℏ
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function HireAgentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-amber-500 w-8 h-8" />
      </div>
    }>
      <HireAgentContent />
    </Suspense>
  );
}
