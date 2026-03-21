"use client";

import { motion } from "framer-motion";

interface DashboardHeroProps {
  mode: "goal" | "challenge";
}

export default function DashboardHero({ mode }: DashboardHeroProps) {
  return (
    <div className="text-left mb-10 pt-4 relative">
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
      </motion.div>
    </div>
  );
}
