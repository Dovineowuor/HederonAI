"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wallet, Shield, Globe, Lock, ArrowRight, Loader2, Mail, UserPlus, Fingerprint } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams?.get("callbackUrl") || "/marketplace";
  // Ensure callbackUrl is always relative to prevent localhost redirection issues in prod
  const callbackUrl = rawCallbackUrl.startsWith("http") 
    ? new URL(rawCallbackUrl).pathname 
    : rawCallbackUrl;
  
  const [loading, setLoading] = useState<string | null>(null);
  const [authMethod, setAuthMethod] = useState<"credentials" | "wallet">("credentials");
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountIdInput, setAccountIdInput] = useState(
    process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || "0.0.8064776"
  );

  const handleAuth0Login = async () => {
    setLoading("auth0");
    const safeCallback = `${window.location.origin}${callbackUrl}`;
    await signIn("auth0", { callbackUrl: safeCallback });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("credentials");
    try {
      if (isSignUp) {
        // Sign Up Flow
        const signupRes = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name: email.split("@")[0], password }),
        });
        const signupData = await signupRes.json();
        if (!signupRes.ok) {
          throw new Error(signupData.error || "Signup failed");
        }
      }

      // Sign In Flow (Directly after signup or as standalone)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        alert("Invalid email or password. For POC, any email + 4 char password works.");
      } else {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Authentication failed");
    } finally {
      setLoading(null);
    }
  };

  const handleWalletLogin = async () => {
    setLoading("wallet");
    // Simulate Hedera Wallet Interaction
    setTimeout(async () => {
      const mockAccountId = accountIdInput.trim() || "0.0.8064776";
      const sessionPayload = `${mockAccountId}:${Date.now()}:auth_request`;
      const mockSignature = typeof window !== "undefined" ? btoa(sessionPayload) : "dynamic_hash";

      const safeCallback = `${window.location.origin}${callbackUrl}`;
      await signIn("hedera-wallet", {
        accountId: mockAccountId,
        signature: mockSignature,
        callbackUrl: safeCallback,
      });
      setLoading(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-6 shadow-xl shadow-amber-500/10 border border-white/10 overflow-hidden group">
            <img src="/logo_ilustrated.png" alt="Hederon AI" className="w-12 h-12 object-contain group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-3xl font-bold mb-2 tracking-tight italic">Hederon<span className="text-amber-500"> AI</span></h1>
          <p className="text-zinc-500 text-sm">Autonomous Intelligence. Handshake Guaranteed.</p>
        </div>

        <div className="glass p-8 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="space-y-6 relative z-10">
            
            {/* Tab Selector */}
            <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5 mb-6">
              <button 
                onClick={() => setAuthMethod("credentials")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${authMethod === "credentials" ? "bg-white text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Mail className="w-3.5 h-3.5" /> Direct Login
              </button>
              <button 
                onClick={() => setAuthMethod("wallet")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${authMethod === "wallet" ? "bg-amber-500 text-black shadow-lg" : "text-zinc-500 hover:text-zinc-300"}`}
              >
                <Wallet className="w-3.5 h-3.5" /> Web3 Connect
              </button>
            </div>

            {authMethod === "credentials" ? (
              <form onSubmit={handleEmailLogin} className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Work Email</label>
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1">Secret Key</label>
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500/50 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!!loading}
                  className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {loading === "credentials" ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {isSignUp ? "Create Account" : "Access Marketplace"}
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-zinc-500 hover:text-zinc-300 text-xs font-medium py-1"
                >
                  {isSignUp ? "Already have an account? Sign in" : "New to Hederon AI? Create an account"}
                </button>
              </form>
            ) : (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 ml-1 text-center block">Hedera Account ID</label>
                  <input 
                    type="text" 
                    value={accountIdInput}
                    onChange={(e) => setAccountIdInput(e.target.value)}
                    placeholder="0.0.xxxxx"
                    className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 transition-colors text-center font-mono"
                    disabled={!!loading}
                  />
                </div>
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
                <div className="p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 text-[10px] text-amber-200/50 text-center leading-relaxed font-mono">
                  Wallet connect is recommended for high-value autonomous escrow contracts on the mainnet.
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 py-2 opacity-50">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Enterprise</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            {/* SSO / Auth0 */}
            <button
              onClick={handleAuth0Login}
              disabled={!!loading}
              className="w-full group relative flex items-center justify-center gap-3 bg-white text-black font-bold py-3.5 rounded-xl transition-all hover:bg-zinc-200 active:scale-[0.98] disabled:opacity-50"
            >
              <Globe className="w-4 h-4 text-indigo-600" />
              Sign in with SSO (Auth0)
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-3 text-center">
            <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
              <Shield className="w-3 h-3 text-emerald-500" />
              Verifiable Handshake Protocol
            </div>
          </div>
        </div>

        <button 
          onClick={() => router.push("/")}
          className="w-full mt-8 text-zinc-600 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          ← Cancel and return home
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
