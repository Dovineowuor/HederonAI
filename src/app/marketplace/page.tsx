"use client";

import Marketplace from "@/components/Marketplace";
import { ArrowLeft, LogOut, User, ClipboardList } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function MarketplacePage() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30">
      {/* Blurred gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <header className="flex items-center justify-between mb-12">
          <a
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            Back to Dashboard
          </a>

          <div className="flex items-center gap-4">
            {session && (
              <a 
                href="/marketplace/my-jobs" 
                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium text-white transition-all shadow-lg hover:shadow-white/5"
              >
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                My Contracts
              </a>
            )}
            {session ? (
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end hidden sm:block">
                  <p className="text-xs font-bold text-white leading-none mb-1">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono leading-none">
                    Marketplace User
                  </p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-9 h-9 rounded-xl glass glass-hover flex items-center justify-center text-zinc-400 hover:text-rose-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <a 
                href="/login" 
                className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center justify-center hover:bg-zinc-200 transition-all"
              >
                Sign In
              </a>
            )}
          </div>
        </header>

        <Marketplace />
      </div>
    </div>
  );
}
