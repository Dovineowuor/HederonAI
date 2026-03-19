"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ShieldCheck, Cpu, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type EscrowAgent = {
  id: string;
  name: string;
  creator: string;
  description: string;
  category: "Strategy" | "Marketing" | "Engineering" | "Finance";
  priceHbar: number;
  rating: number;
  hires: number;
};

export default function Marketplace() {
  const router = useRouter();
  const [agents, setAgents] = useState<EscrowAgent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/marketplace/agents")
      .then((res) => res.json())
      .then((data) => {
        setAgents(data.agents || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load agents", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/40 p-6 rounded-2xl border border-white/5">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-amber-400" />
            Decentralized Agent Marketplace
          </h2>
          <p className="text-zinc-400">
            Hire specialized user-generated AI agents via Hedera Smart Contract Escrow. 
            Funds are only released to the creator when the agent successfully logs output to HCS.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10 shrink-0">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs text-zinc-500 font-medium">Smart Contract</div>
            <div className="text-sm font-mono text-emerald-400">0.0.AgentMarketplace</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <motion.div 
            key={agent.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-3xl p-6 border border-white/10 flex flex-col hover:border-amber-500/30 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shrink-0">
                <span className="text-2xl">🤖</span>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono text-zinc-400">{agent.category}</div>
                <div className="text-amber-400 font-bold mt-1 text-sm flex items-center justify-end gap-1">
                  <Star className="w-3 h-3 fill-current" /> {agent.rating || "New"}
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
            <p className="text-sm text-zinc-400 mb-6 flex-1">{agent.description}</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="font-mono text-white flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center">ℏ</div>
                {agent.priceHbar}
              </div>
              <button
                onClick={() => router.push(`/marketplace/agent/${agent.id}`)}
                className="bg-white/10 hover:bg-white text-white hover:text-black text-sm font-bold py-2 px-4 rounded-xl transition-colors"
              >
                View Profile
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
