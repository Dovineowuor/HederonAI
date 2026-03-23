"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Star, ShieldCheck, Cpu, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";

type EscrowAgent = {
  id: string;
  name: string;
  creator: string;
  description: string;
  category: "Strategy" | "Marketing" | "Engineering" | "Finance";
  priceHbar: number;
  rating: number;
  hires: number;
  isSystem?: boolean;
};

export default function Marketplace() {
  const router = useRouter();
  const [agents, setAgents] = useState<EscrowAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userContext, setUserContext] = useState<Record<string, string> | null>(null);

  useEffect(() => {
    // Load context for recommendations
    const fetchContext = async () => {
      try {
        const res = await fetch("/api/user-context");
        const data = await res.json();
        if (data.context) {
          setUserContext(data.context);
        } else {
          // Check localStorage for guests
          const guest = localStorage.getItem("guest_user_context");
          if (guest) setUserContext(JSON.parse(guest));
        }
      } catch (e) {
        console.error("Failed to load context for marketplace", e);
      }
    };

    const fetchAgents = async () => {
      try {
        const res = await fetch("/api/marketplace/agents");
        const data = await res.json();
        setAgents(data.agents || []);
      } catch (err) {
        console.error("Failed to load agents", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContext();
    fetchAgents();
  }, []);

  // Simple recommendation logic
  const recommendedAgents = agents.filter(agent => {
    if (!userContext) return false;
    const targetChain = userContext.targetChain?.toLowerCase();
    const model = userContext.businessModel?.toLowerCase();
    
    return (
      (targetChain && agent.description.toLowerCase().includes(targetChain)) ||
      (model && agent.category.toLowerCase().includes(model.split(' ')[0])) ||
      (targetChain && agent.name.toLowerCase().includes("hedera") && targetChain.includes("hedera"))
    );
  }).slice(0, 2);

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

      {/* Recommended Section */}
      <AnimatePresence>
        {recommendedAgents.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 px-2">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <h3 className="text-sm font-black uppercase tracking-widest text-emerald-400">Smart Recommendations</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent ml-4" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/5">
               {recommendedAgents.map(agent => (
                 <AgentCard key={`rec-${agent.id}`} agent={agent} isRecommended />
               ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>
    </div>
  );
}

function AgentCard({ agent, isRecommended }: { agent: EscrowAgent; isRecommended?: boolean }) {
  const router = useRouter();
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`glass rounded-3xl p-6 border transition-all duration-500 ${
        isRecommended 
          ? 'border-emerald-500/40 bg-emerald-500/5 shadow-lg shadow-emerald-500/5' 
          : 'border-white/10 hover:border-amber-500/30'
      } flex flex-col`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden group">
            <img src="/logo.png" alt="Agent" className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" />
          </div>
          {isRecommended && (
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-1 shadow-lg animate-bounce">
              <Star className="w-2 h-2 fill-current" /> MATCH
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-zinc-400">{agent.category}</div>
          <div className="flex items-center justify-end gap-2 mb-1">
            {agent.isSystem && (
              <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-2.5 h-2.5" /> Verified
              </span>
            )}
            <div className="text-amber-400 font-bold text-sm flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" /> {agent.rating || "New"}
            </div>
          </div>
          {!agent.isSystem && (
            <div className="text-[10px] text-zinc-500 font-mono truncate max-w-[120px]" title={agent.creator}>
              By {agent.creator.length > 15 ? `${agent.creator.slice(0, 10)}...` : agent.creator}
            </div>
          )}
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{agent.name}</h3>
      <p className="text-sm text-zinc-400 mb-6 flex-1">{agent.description}</p>
      
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <div className="font-mono text-white flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs">ℏ</div>
          {agent.priceHbar}
        </div>
        <button
          onClick={() => router.push(`/marketplace/agent/${agent.id}`)}
          className={`text-sm font-bold py-2 px-4 rounded-xl transition-all duration-300 ${
            isRecommended
              ? 'bg-emerald-500 text-black hover:bg-emerald-400'
              : 'bg-white/10 hover:bg-white text-white hover:text-black'
          }`}
        >
          View Profile
        </button>
      </div>
    </motion.div>
  );
}
