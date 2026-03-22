"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Wallet, Shield, Lock, ArrowRight, Loader2, Mail, ChevronDown, ChevronUp
} from "lucide-react";

// Inline SVG icons for brand accuracy
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f25022" d="M1 1h10v10H1z"/>
    <path fill="#00a4ef" d="M13 1h10v10H13z"/>
    <path fill="#7fba00" d="M1 13h10v10H1z"/>
    <path fill="#ffb900" d="M13 13h10v10H13z"/>
  </svg>
);

const Auth0Icon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path fill="#EB5424" d="M21 12 15.7 2.5l-3.7 6.4 3.9 6.8-3.9 6.8h7.5L21 12zM8.3 12l3.9-6.8L8.5 2.5H1L3 6.7l-2 5.3 2 5.3L1 21.5h7.5L12.2 12z"/>
  </svg>
);

const HederaIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-amber-400" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5V13H9v-2h1.5V7.5h2V11H14v2h-1.5v3.5h-2z"/>
  </svg>
);

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams?.get("callbackUrl") || "/marketplace";
  const callbackUrl = rawCallbackUrl.startsWith("http")
    ? new URL(rawCallbackUrl).pathname
    : rawCallbackUrl;

  const [loading, setLoading] = useState<string | null>(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showWalletForm, setShowWalletForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountIdInput, setAccountIdInput] = useState(
    process.env.NEXT_PUBLIC_HEDERA_ACCOUNT_ID || "0.0.8064776"
  );

  const handleOAuthLogin = async (provider: string) => {
    setLoading(provider);
    const safeCallback = `${window.location.origin}${callbackUrl}`;
    await signIn(provider, { callbackUrl: safeCallback });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("credentials");
    try {
      if (isSignUp) {
        const signupRes = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, name: email.split("@")[0], password }),
        });
        const signupData = await signupRes.json();
        if (!signupRes.ok) throw new Error(signupData.error || "Signup failed");
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        alert("Invalid email or password.");
      } else {
        router.push(callbackUrl);
      }
    } catch (err: any) {
      alert(err.message || "Authentication failed");
    } finally {
      setLoading(null);
    }
  };

  const handleWalletLogin = async () => {
    setLoading("wallet");
    setTimeout(async () => {
      const mockAccountId = accountIdInput.trim() || "0.0.8064776";
      const sessionPayload = `${mockAccountId}:${Date.now()}:auth_request`;
      const mockSignature = typeof window !== "undefined" ? btoa(sessionPayload) : "sig";
      const safeCallback = `${window.location.origin}${callbackUrl}`;
      await signIn("hedera-wallet", { accountId: mockAccountId, signature: mockSignature, callbackUrl: safeCallback });
      setLoading(null);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-amber-500/8 rounded-full blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 mb-5 border border-white/10 overflow-hidden">
            <img src="/logo_ilustrated.png" alt="Hederon AI" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-black tracking-tight mb-1 italic">
            Hederon<span className="text-amber-400">AI</span>
          </h1>
          <p className="text-zinc-500 text-xs">Autonomous Intelligence. Handshake Guaranteed.</p>
        </div>

        {/* Main Card */}
        <div
          className="rounded-3xl border border-white/10 p-6 space-y-3"
          style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(24px)" }}
        >
          <p className="text-[10px] uppercase tracking-widest font-bold text-zinc-600 text-center mb-4">Sign in with</p>

          {/* Google */}
          <button
            onClick={() => handleOAuthLogin("google")}
            disabled={!!loading}
            className="w-full flex items-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-zinc-100 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading === "google" ? <Loader2 className="w-4 h-4 animate-spin" /> : <GoogleIcon />}
            <span className="flex-1 text-sm">Continue with Google</span>
          </button>

          {/* GitHub */}
          <button
            onClick={() => handleOAuthLogin("github")}
            disabled={!!loading}
            className="w-full flex items-center gap-3 bg-zinc-900 text-white font-semibold py-3 px-4 rounded-xl border border-white/10 hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading === "github" ? <Loader2 className="w-4 h-4 animate-spin" /> : <GitHubIcon />}
            <span className="flex-1 text-sm">Continue with GitHub</span>
          </button>

          {/* Microsoft */}
          <button
            onClick={() => handleOAuthLogin("azure-ad")}
            disabled={!!loading}
            className="w-full flex items-center gap-3 bg-zinc-900 text-white font-semibold py-3 px-4 rounded-xl border border-white/10 hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading === "azure-ad" ? <Loader2 className="w-4 h-4 animate-spin" /> : <MicrosoftIcon />}
            <span className="flex-1 text-sm">Continue with Microsoft</span>
          </button>

          {/* Auth0 SSO */}
          <button
            onClick={() => handleOAuthLogin("auth0")}
            disabled={!!loading}
            className="w-full flex items-center gap-3 bg-zinc-900 text-white font-semibold py-3 px-4 rounded-xl border border-white/10 hover:bg-zinc-800 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading === "auth0" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Auth0Icon />}
            <span className="flex-1 text-sm">Continue with SSO / Auth0</span>
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">or</span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          {/* Hedera Wallet */}
          <button
            onClick={() => setShowWalletForm(!showWalletForm)}
            disabled={!!loading}
            className="w-full flex items-center gap-3 bg-amber-500/10 text-amber-300 font-semibold py-3 px-4 rounded-xl border border-amber-500/20 hover:bg-amber-500/20 transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            {loading === "wallet" ? <Loader2 className="w-4 h-4 animate-spin" /> : <HederaIcon />}
            <span className="flex-1 text-sm text-left">Connect Hedera Wallet</span>
            {showWalletForm ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
          </button>

          {showWalletForm && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <input
                type="text"
                value={accountIdInput}
                onChange={(e) => setAccountIdInput(e.target.value)}
                placeholder="0.0.xxxxx"
                className="w-full bg-black/60 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-200 placeholder-zinc-700 focus:outline-none focus:border-amber-500/50 font-mono text-center text-sm"
                disabled={!!loading}
              />
              <button
                onClick={handleWalletLogin}
                disabled={!!loading || !accountIdInput.trim()}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 text-black font-bold py-3 rounded-xl hover:bg-amber-400 transition-all disabled:opacity-50 active:scale-[0.98] text-sm"
              >
                {loading === "wallet" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wallet className="w-4 h-4" />}
                Sign in with Wallet
              </button>
            </div>
          )}

          {/* Email / Password */}
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            disabled={!!loading}
            className="w-full flex items-center gap-3 bg-zinc-900/60 text-zinc-400 font-semibold py-3 px-4 rounded-xl border border-white/5 hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50 active:scale-[0.98]"
          >
            <Mail className="w-4 h-4" />
            <span className="flex-1 text-sm text-left">Continue with Email</span>
            {showEmailForm ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
          </button>

          {showEmailForm && (
            <form onSubmit={handleEmailLogin} className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 text-sm"
              />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 text-sm"
              />
              <button
                type="submit"
                disabled={!!loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 active:scale-[0.98] text-sm"
              >
                {loading === "credentials" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                {isSignUp ? "Create Account & Get Wallet" : "Sign In"}
                {loading !== "credentials" && <ArrowRight className="w-3.5 h-3.5 ml-auto" />}
              </button>
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="w-full text-zinc-600 hover:text-zinc-400 text-xs py-1 transition-colors"
              >
                {isSignUp ? "Already have an account? Sign in" : "New here? Create an account & get your Hedera wallet"}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
            <Shield className="w-3 h-3 text-emerald-500" />
            Verifiable Handshake Protocol — Powered by Hedera
          </div>
          <button
            onClick={() => router.push("/")}
            className="text-zinc-700 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
          >
            ← Return home
          </button>
        </div>
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
