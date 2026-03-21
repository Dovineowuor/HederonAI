"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Sparkles
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: ShoppingCart, label: "Marketplace", href: "/marketplace" },
  { icon: Sparkles, label: "Creator Studio", href: "/creator/dashboard" },
  { icon: ClipboardList, label: "My Contracts", href: "/marketplace/my-jobs" },
  { icon: Presentation, label: "Pitch Deck", href: "/pitchdeck" },
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const sidebarContent = (isMobile = false) => (
    <aside
      className={cn(
        "h-screen border-r border-white/[0.08] bg-zinc-950/90 backdrop-blur-xl flex flex-col transition-all duration-300 ease-in-out",
        isMobile ? "w-64" : collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header: Logo + Collapse Toggle */}
      <div className={cn("flex items-center p-4 gap-3 border-b border-white/[0.05]", collapsed && !isMobile ? "justify-center" : "justify-between")}>
        <Link href="/" className="flex items-center gap-3 group min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 overflow-hidden">
            <img src="/logo.png" alt="Hederon AI" className="w-full h-full object-contain" />
          </div>
          <AnimatePresence initial={false}>
            {(!collapsed || isMobile) && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden min-w-0"
              >
                <h1 className="text-sm font-bold text-white tracking-tight whitespace-nowrap">Hederon AI</h1>
                <p className="text-[9px] text-zinc-500 font-medium uppercase tracking-widest leading-none mt-0.5">v1.0.0 Beta</p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        {/* Desktop collapse toggle */}
        {!isMobile && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all shrink-0"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed && !isMobile ? item.label : undefined}
              className={cn(
                "flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden",
                collapsed && !isMobile ? "justify-center" : "",
                isActive 
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-inner" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-5 bg-violet-400 rounded-full"
                />
              )}
              <item.icon className={cn("w-4 h-4 shrink-0 transition-colors", isActive ? "text-violet-400" : "group-hover:text-white")} />
              <AnimatePresence initial={false}>
                {(!collapsed || isMobile) && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap flex-1"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {!isActive && (!collapsed || isMobile) && (
                <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-40 transition-opacity" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-2 mt-auto border-t border-white/[0.08] space-y-1">
        {[
          { icon: Settings, label: "Settings" },
          { icon: HelpCircle, label: "Help & Support" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            title={collapsed && !isMobile ? label : undefined}
            className={cn(
              "w-full flex items-center gap-3 px-2.5 py-2 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl text-sm transition-all",
              collapsed && !isMobile ? "justify-center" : ""
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <AnimatePresence initial={false}>
              {(!collapsed || isMobile) && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}

        {/* User / Auth section */}
        {session ? (
          <div className={cn(
            "p-2 glass rounded-2xl flex items-center group overflow-hidden relative mt-2",
            collapsed && !isMobile ? "justify-center" : "justify-between gap-2"
          )}>
            <div className="absolute -inset-2 bg-violet-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <div className="flex items-center gap-2.5 relative min-w-0">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
              <AnimatePresence initial={false}>
                {(!collapsed || isMobile) && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden min-w-0"
                  >
                    <p className="text-xs font-bold text-white truncate leading-none mb-0.5">
                      {session.user?.name || session.user?.email?.split("@")[0]}
                    </p>
                    <p className="text-[9px] text-zinc-500 truncate leading-none uppercase tracking-tighter">
                      {session.user?.email?.includes("hedera.wallet") ? "Hedera Wallet" : "Verified AI User"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {(!collapsed || isMobile) && (
              <button
                onClick={() => signOut({ callbackUrl: `${window.location.origin}/` })}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all relative shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 mt-2",
              collapsed && !isMobile ? "px-2" : ""
            )}
          >
            {collapsed && !isMobile ? <User className="w-4 h-4" /> : "Sign In"}
          </Link>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile hamburger button — only visible on small screens */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-4 left-4 z-[60] p-2 rounded-xl bg-zinc-900 border border-white/10 text-white shadow-lg md:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:block fixed left-0 top-0 z-50 h-screen">
        {sidebarContent(false)}
      </div>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[55] bg-black/60 backdrop-blur-sm md:hidden"
            />
            {/* Slide-in panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 z-[60] h-screen md:hidden"
            >
              {sidebarContent(true)}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
