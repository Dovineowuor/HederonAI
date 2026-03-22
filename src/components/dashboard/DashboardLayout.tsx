"use client";

import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Footer from "../Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-violet-500/30 selection:text-violet-200">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area — no margin on mobile (sidebar is overlay), md:ml-64 for fixed sidebar */}
      <main className="flex-1 ml-0 md:ml-64 min-h-screen relative overflow-x-hidden transition-[margin] duration-300">
        {/* Animated Background Orbs (Moved to layout for consistency) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] opacity-40" />
          <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] opacity-30" />
          <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-emerald-600/8 rounded-full blur-[120px] opacity-30" />
        </div>

        {/* Page Content */}
        <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto min-h-screen flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex-1 flex flex-col"
          >
            {children}
          </motion.div>

          {/* Global Footer */}
          <div className="mt-auto">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
