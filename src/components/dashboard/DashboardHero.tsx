"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface DashboardHeroProps {
  mode: "goal" | "challenge";
  onRefine: () => void;
  hasContext: boolean;
}

export default function DashboardHero({ mode, onRefine, hasContext }: DashboardHeroProps) {
  return (
    <div className="text-left mb-10 pt-4 relative group">
      <div className="absolute -top-6 -left-12 w-32 h-32 opacity-[0.03] pointer-events-none select-none">
        <img src="/logo_ilustrated.png" className="w-full h-full object-contain grayscale" alt="" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6">
          <span className="gradient-text drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]">
            {mode === "goal" ? "Execute" : "Brainstorm"}
          </span>
          <br />
          <span className="text-white">With Precision.</span>
        </h2>
        
        <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed font-medium">
          {mode === "goal" 
            ? "Your AI executive team — CEO, Strategy, Marketing & Operations — springs into action, powered by Hedera Testnet and Decentralized AI."
            : "Facing a bottleneck? Describe your challenge and let our AI Innovation Brainstormer generate high-impact solution frameworks."
          }
        </p>

        <div className="mt-8 flex items-center gap-4">
          <button 
            onClick={onRefine}
            className="group relative flex items-center gap-2 px-6 py-3 glass rounded-2xl hover:border-violet-500/50 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            <Sparkles className="w-4 h-4 text-violet-400 group-hover:rotate-12 transition-transform" />
            <span className="text-sm font-bold text-white tracking-wide">
              {hasContext ? "Refine Strategy" : "Define Project DNA"}
            </span>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-all" />
          </button>
          
           {!hasContext && (
             <p className="text-[10px] font-black uppercase tracking-widest text-violet-500/60 animate-pulse">
               Intelligence Phase Required
             </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
