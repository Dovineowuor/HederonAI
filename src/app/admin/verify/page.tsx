"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function AdminVerifyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<"initial" | "sent" | "verifying">("initial");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "admin") {
      router.push("/creator/dashboard");
    }
  }, [status, session, router]);

  const requestMagicLink = async () => {
    try {
      const res = await fetch("/api/admin/request-link", { method: "POST" });
      if (res.ok) {
        setStep("sent");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to send magic link.");
      }
    } catch (err) {
      setError("An error occurred while sending.");
    }
  };

  const verifyLink = async (token?: string) => {
    const tokenToVerify = token || new URLSearchParams(window.location.search).get("token");
    if (!tokenToVerify) return;

    setStep("verifying");
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify })
      });
      
      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        setError(data.error || "Verification failed.");
        setStep("initial");
      }
    } catch (err) {
      setError("An error occurred during verification.");
      setStep("initial");
    }
  };

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token && step === "initial") {
      verifyLink(token);
    }
  }, []);

  if (status === "loading") return null;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 selection:bg-violet-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] opacity-40" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-8 relative">
            <ShieldCheck className="w-10 h-10 text-violet-400" />
            <div className="absolute -top-2 -right-2 bg-indigo-500 rounded-full p-1.5 border-4 border-black">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-black tracking-tight">Access <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Admin</span></h1>
          <p className="text-zinc-500 text-sm leading-relaxed">
            As the platform owner, you must verify your session via a secure magic link sent to **{session?.user?.email}**.
          </p>
        </div>

        {step === "initial" && (
          <div className="space-y-4">
            <button 
              onClick={requestMagicLink}
              className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 group"
            >
              <Mail className="w-5 h-5" />
              Send Magic Link
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            {error && <p className="text-rose-400 text-xs font-bold">{error}</p>}
          </div>
        )}

        {step === "sent" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
              <p className="text-emerald-400 text-sm font-bold">Magic link has been "sent"!</p>
            </div>
            <p className="text-zinc-500 text-xs leading-relaxed italic">
              In this POC, please click below to simulate clicking the link from your inbox.
            </p>
            <button 
              onClick={() => verifyLink()}
              className="w-full bg-violet-600 text-white py-4 rounded-2xl font-bold hover:bg-violet-500 transition-all flex items-center justify-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              Use Magic Link
            </button>
          </div>
        )}

        {step === "verifying" && (
          <div className="flex flex-col items-center gap-4 py-8 animate-pulse text-violet-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-xs font-black uppercase tracking-widest">Handshaking with platform...</p>
          </div>
        )}

        <div className="pt-8 border-t border-white/5">
          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-widest">
            Hederon Secure Admin Access • Protocol v1.4
          </p>
        </div>
      </div>
    </div>
  );
}
