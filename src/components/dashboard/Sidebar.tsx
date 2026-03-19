"use client";

import { motion } from "framer-motion";
import { 
  Zap, 
  LayoutDashboard, 
  ShoppingCart, 
  ClipboardList, 
  Presentation, 
  Settings, 
  HelpCircle,
  LogOut,
  User,
  ChevronRight
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ShoppingCart, label: "Marketplace", href: "/marketplace" },
  { icon: ClipboardList, label: "My Contracts", href: "/marketplace/my-jobs" },
  { icon: Presentation, label: "Pitch Deck", href: "/pitchdeck" },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen border-r border-white/[0.08] bg-zinc-950/50 backdrop-blur-xl flex flex-col fixed left-0 top-0 z-50">
      {/* Branding */}
      <div className="p-6">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">ExecuAI</h1>
            <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest leading-none mt-1">
              v1.0.0 Beta
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                isActive 
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-inner" 
                  : "text-zinc-500 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-5 bg-violet-400 rounded-full"
                />
              )}
              <item.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-violet-400" : "group-hover:text-white")} />
              {item.label}
              {!isActive && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-4 mt-auto border-t border-white/[0.08] space-y-4">
        <div className="flex flex-col gap-2">
           <button className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-white text-sm transition-colors">
              <Settings className="w-4 h-4" />
              Settings
           </button>
           <button className="flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-white text-sm transition-colors">
              <HelpCircle className="w-4 h-4" />
              Help & Support
           </button>
        </div>

        {session ? (
          <div className="p-3 glass rounded-2xl flex items-center justify-between group overflow-hidden relative">
            {/* Background glow for session */}
            <div className="absolute -inset-2 bg-violet-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="flex items-center gap-3 relative">
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-none mb-1">
                  {session.user?.name || session.user?.email?.split('@')[0]}
                </p>
                <p className="text-[10px] text-zinc-500 truncate leading-none uppercase tracking-tighter">
                  {session.user?.email?.includes('hedera.wallet') ? 'Hedera Wallet' : 'Verified AI User'}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all relative"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 animate-shimmer"
          >
            Sign In
          </Link>
        )}
      </div>
    </aside>
  );
}
