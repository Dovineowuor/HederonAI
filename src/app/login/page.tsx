"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wallet, Shield, Globe, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/marketplace";
  const [loading, setLoading] = useState<string | null>(null);
  const [accountIdInput, setAccountIdInput] = useState(
    process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || "0.0.8064776"
  );

  const handleAuth0Login = async () => {
    setLoading("auth0");
    await signIn("auth0", { callbackUrl });
  };

  const handleWalletLogin = async () => {
    setLoading("wallet");
    // Simulate Hedera Wallet Interaction
    // In a real app, we'd call HashConnect/Blade/Hashpack here
    setTimeout(async () => {
      const mockAccountId = accountIdInput.trim() || "0.0.8064776";
      // Generate a dynamic mock signature payload using the account and current timestamp
      const sessionPayload = `${mockAccountId}:${Date.now()}:auth_request`;
      const mockSignature = typeof window !== "undefined" ? btoa(sessionPayload) : "dynamic_hash";

      await signIn("hedera-wallet", {
        accountId: mockAccountId,
        signature: mockSignature,
        callbackUrl,
      });
      setLoading(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 mb-6 shadow-xl shadow-amber-500/20">
            <Lock className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome to ExecuAI</h1>
          <p className="text-zinc-400">Secure access to your AI Executive Team</p>
        </div>

        <div className="glass p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="space-y-4 relative z-10">
            {/* SSO / Auth0 */}
            <button
              onClick={handleAuth0Login}
              disabled={!!loading}
              className="w-full group relative flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-xl transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading === "auth0" ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Globe className="w-5 h-5 text-indigo-600" />
                  Sign in with SSO (Auth0)
                </>
              )}
              <ArrowRight className="w-4 h-4 absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Or</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {/* Hedera Wallet */}
            <div className="space-y-3 pt-2">
              <input 
                type="text" 
                value={accountIdInput}
                onChange={(e) => setAccountIdInput(e.target.value)}
                placeholder="0.0.xxxxx"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 transition-colors text-center font-mono"
                disabled={!!loading}
              />
              <button
                onClick={handleWalletLogin}
                disabled={!!loading || !accountIdInput.trim()}
                className="w-full group relative flex items-center justify-center gap-3 bg-zinc-900 text-white font-bold py-4 rounded-xl border border-white/10 transition-all hover:bg-zinc-800 hover:border-amber-500/50 active:scale-[0.98] disabled:opacity-50"
              >
                {loading === "wallet" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Wallet className="w-5 h-5 text-amber-500" />
                    Connect Hedera Wallet
                  </>
                )}
                <ArrowRight className="w-4 h-4 absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </button>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex flex-col items-center gap-4 text-center">
            <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
              <Shield className="w-3 h-3 text-emerald-500" />
              Enterprise-grade security on Hedera
            </div>
            <p className="text-[10px] text-zinc-600 leading-relaxed max-w-[240px]">
              By signing in, you agree to our Terms of Service and acknowledge the smart contract governance of the ExecuAI marketplace.
            </p>
          </div>
        </div>

        <button 
          onClick={() => router.push("/")}
          className="w-full mt-8 text-zinc-500 hover:text-white transition-colors text-sm font-medium"
        >
          Cancel and return home
        </button>
      </div>
    </div>
  );
}
