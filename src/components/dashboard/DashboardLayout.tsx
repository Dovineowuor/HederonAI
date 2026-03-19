"use client";

import { motion } from "framer-motion";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-violet-500/30 selection:text-violet-200">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 ml-64 min-h-screen relative overflow-x-hidden">
        {/* Animated Background Orbs (Moved to layout for consistency) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] opacity-40" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] opacity-30" />
          <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-emerald-600/8 rounded-full blur-[120px] opacity-30" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 p-8 max-w-6xl mx-auto min-h-screen flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>

          {/* Minimal Footer */}
          <footer className="mt-20 py-8 border-t border-white/[0.05] text-center">
            <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
              Powered by <span className="text-violet-500/80">OpenAI</span> • <span className="text-emerald-500/80">Hedera</span> • <span className="text-blue-500/80">Vercel</span>
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
