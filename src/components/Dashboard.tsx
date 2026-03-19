"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { Zap, RotateCcw, ChevronRight, Layers, Activity, Lightbulb, Download, FileText, Presentation, Code, Image, ShoppingCart, LogOut, User, ClipboardList } from "lucide-react";
import ReactMarkdown from "react-markdown";
import AgentCard from "@/components/AgentCard";
import HederaLogPanel from "@/components/HederaLogPanel";
import type { AgentRunResult, ExecutionMode, Deliverable } from "@/lib/types";
import { cn } from "@/lib/utils";

const EXAMPLE_GOALS = [
  "Launch an AI newsletter for developers",
  "Build and market a SaaS productivity tool",
  "Grow a personal brand on LinkedIn and Twitter",
  "Create an e-commerce store for handmade jewelry",
];

const EXAMPLE_CHALLENGES = [
  "How can I reduce customer churn by 50% in 6 months?",
  "What's the best way to enter a saturated market as a new startup?",
  "How do I scale from 100 to 10,000 users with limited budget?",
  "What strategies work for B2B SaaS in economic downturns?",
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [mode, setMode] = useState<ExecutionMode>("goal");
  const [goal, setGoal] = useState("");
  const [challenge, setChallenge] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AgentRunResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"agents" | "hedera" | "deliverables">("agents");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (mode === "goal" && !goal.trim() || isLoading) return;
    if (mode === "challenge" && !challenge.trim() || isLoading) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const payload = mode === "goal" 
        ? { mode: "goal", goal: goal.trim() }
        : { mode: "challenge", challenge: challenge.trim() };

      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong");
      }

      setResult(data);
      setActiveTab(mode === "challenge" && data.deliverables ? "deliverables" : "agents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    setGoal("");
    setChallenge("");
    setResult(null);
    setError(null);
    setActiveTab("agents");
  }

  async function downloadDeliverable(deliverable: Deliverable) {
    try {
      const response = await fetch('/api/ipfs-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deliverable }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload to IPFS');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Copy IPFS URL to clipboard
        await navigator.clipboard.writeText(result.ipfsUrl);
        
        // Show success message
        alert(`✅ File uploaded to IPFS!\n\n🔗 IPFS URL: ${result.ipfsUrl}\n\n📋 URL copied to clipboard\n\n💾 IPFS Hash: ${result.ipfsHash}`);
        
        // Open IPFS URL in new tab
        window.open(result.ipfsUrl, '_blank');
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('IPFS download error:', error);
      alert(`❌ Failed to upload to IPFS: ${(error as Error).message}`);
    }
  }

  const doneCount = result?.plan?.tasks.filter((t) => t.status === "done").length ?? 0;
  const totalCount = result?.plan?.tasks.length ?? 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Blurred gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/3 w-[400px] h-[400px] bg-emerald-600/8 rounded-full blur-[120px]" />
      </div>

      <div className="relative flex flex-col min-h-screen max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center animate-float">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">ExecuAI</h1>
              <p className="text-[11px] text-zinc-500 leading-none mt-0.5">
                Your AI Executive Team
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <a 
              href="/pitchdeck" 
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium text-white transition-all shadow-lg hover:shadow-white/5"
            >
              <Presentation className="w-4 h-4 text-emerald-400" />
              Interactive Pitch Deck
            </a>
            <a 
              href="/marketplace" 
              className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium text-white transition-all shadow-lg hover:shadow-white/5"
            >
              <ShoppingCart className="w-4 h-4 text-amber-400" />
              Agent Marketplace
            </a>
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
                    {session.user?.email?.includes('hedera.wallet') ? 'Verified Wallet' : 'SSO Authenticated'}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-zinc-400" />
                </div>
                <button
                  onClick={() => signOut()}
                  className="w-10 h-10 rounded-xl glass glass-hover flex items-center justify-center text-zinc-400 hover:text-rose-400 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <a 
                href="/login" 
                className="px-6 h-10 rounded-xl bg-white text-black font-bold text-sm flex items-center justify-center hover:bg-zinc-200 transition-all shadow-lg shadow-white/10"
              >
                Sign In
              </a>
            )}
            <div className="glass px-3 py-1.5 rounded-full flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-zinc-400">Hedera Testnet</span>
            </div>
          </motion.div>
        </header>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-2 p-1 glass rounded-xl">
            <button
              type="button"
              onClick={() => setMode("goal")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                mode === "goal" 
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Zap className="w-4 h-4 mr-2" />
              Execute Goal
            </button>
            <button
              type="button"
              onClick={() => setMode("challenge")}
              className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all duration-200",
                mode === "challenge" 
                  ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" 
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Brainstorm Challenge
            </button>
          </div>
        </motion.div>

        {/* Hero */}
        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="gradient-text">One Person.</span>
              <br />
              <span className="text-white">Unlimited {mode === "goal" ? "Execution" : "Ideation"}.</span>
            </h2>
            <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
              {mode === "goal" 
                ? "Enter a goal and your AI executive team — CEO, Strategy, Marketing & Operations — springs into action, powered by Hedera."
                : "Describe a challenge and our AI Innovation Brainstormer will generate 5 diverse solution approaches to help you overcome obstacles."
              }
            </p>
          </motion.div>
        )}

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="glass rounded-2xl p-4 glow">
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  {mode === "goal" ? (
                    <textarea
                      id="goal-input"
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="Enter your goal… e.g. Launch an AI newsletter for developers"
                      rows={2}
                      className="w-full bg-transparent text-white placeholder-zinc-500 text-base resize-none focus:outline-none leading-relaxed"
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e as unknown as React.FormEvent);
                        }
                      }}
                    />
                  ) : (
                    <textarea
                      id="challenge-input"
                      value={challenge}
                      onChange={(e) => setChallenge(e.target.value)}
                      placeholder="Describe your challenge… e.g. How can I reduce customer churn by 50% in 6 months?"
                      rows={3}
                      className="w-full bg-transparent text-white placeholder-zinc-500 text-base resize-none focus:outline-none leading-relaxed"
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e as unknown as React.FormEvent);
                        }
                      }}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1 shrink-0">
                  {result && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="w-10 h-10 rounded-xl glass glass-hover flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    id="run-agents-btn"
                    type="submit"
                    disabled={isLoading || (mode === "goal" && !goal.trim()) || (mode === "challenge" && !challenge.trim())}
                    className="flex items-center gap-2 px-5 h-10 rounded-xl font-semibold text-sm transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Running…
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        {mode === "goal" ? "Execute" : "Brainstorm"}
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Example goals/challenges */}
              {!result && !isLoading && (
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                  {(mode === "goal" ? EXAMPLE_GOALS : EXAMPLE_CHALLENGES).map((eg) => (
                    <button
                      key={eg}
                      type="button"
                      onClick={() => mode === "goal" ? setGoal(eg) : setChallenge(eg)}
                      className="text-xs text-zinc-500 hover:text-zinc-300 px-2.5 py-1 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.06] transition-all flex items-center gap-1"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {eg}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </form>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 glass border border-red-500/30 rounded-xl p-4 text-sm text-red-300"
            >
              ⚠️ {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass rounded-2xl p-8 text-center glow"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-2 border-violet-500/20 animate-spin" style={{ borderTopColor: "rgba(139,92,246,0.8)" }} />
                  <div className="absolute inset-2 rounded-full border-2 border-blue-500/20 animate-spin" style={{ borderTopColor: "rgba(96,165,250,0.8)", animationDirection: "reverse", animationDuration: "0.8s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-violet-400" />
                  </div>
                </div>
                <div>
                  <p className="text-white font-semibold mb-1">Your AI team is on the case</p>
                  <p className="text-zinc-400 text-sm">CEO → Strategy → Marketing → Operations</p>
                </div>
                <div className="flex items-center gap-3">
                  {["CEO", "Strategy", "Marketing", "Operations"].map((label, i) => (
                    <motion.div
                      key={label}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                      className="text-xs text-zinc-500"
                    >
                      {label}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Summary bar */}
              <div className="glass rounded-2xl p-4 mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 mb-0.5">
                    {mode === "goal" ? "Goal" : "Challenge"}
                  </p>
                  <p className="text-white font-medium text-sm">
                    {mode === "goal" ? result.plan?.goal : result.challenge?.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {mode === "goal" && (
                    <div className="text-right">
                      <p className="text-xs text-zinc-500 mb-0.5">Completed</p>
                      <p className="text-white font-semibold">
                        {doneCount}/{totalCount} tasks
                      </p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-zinc-500 mb-0.5">Hedera logs</p>
                    <p className="text-white font-semibold">{result.hederaLogs.length}</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mb-6 glass rounded-xl p-1 w-fit">
                {[
                  { id: "agents" as const, label: mode === "goal" ? "Agent Outputs" : "Solution Approaches", icon: Layers },
                  { id: "deliverables" as const, label: "Generated Files", icon: Download },
                  { id: "hedera" as const, label: "Hedera Logs", icon: Activity },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      activeTab === id
                        ? "bg-white/10 text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                    {id === "hedera" && (
                      <span className="ml-1 text-[10px] bg-violet-500/30 text-violet-300 px-1.5 py-0.5 rounded-full">
                        {result.hederaLogs.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Agent outputs / Solution approaches */}
              {activeTab === "agents" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {mode === "goal" && result.plan ? (
                    result.plan.tasks.map((task, i) => (
                      <AgentCard key={task.id} task={task} index={i} />
                    ))
                  ) : mode === "challenge" && result.challenge ? (
                    result.challenge.tasks && result.challenge.tasks.length > 0 ? (
                      // Show agentic workflow results
                      result.challenge.tasks.map((task, i) => (
                        <AgentCard key={task.id} task={task} index={i} />
                      ))
                    ) : result.challenge.brainstormedSolutions ? (
                      // Show brainstorming results (fallback)
                      result.challenge.brainstormedSolutions.map((solution, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                          className="glass rounded-2xl p-5 border border-violet-500/30 transition-all duration-300"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/10 flex items-center justify-center">
                              <Lightbulb className="w-5 h-5 text-violet-300" />
                            </div>
                            <div>
                              <p className="text-violet-300 text-sm font-semibold mb-1">Solution Approach {i + 1}</p>
                              <div className="text-white text-sm leading-relaxed prose prose-sm prose-invert max-w-none [&_h3]:text-xs [&_h3]:font-semibold [&_h3]:text-violet-400 [&_h3]:uppercase [&_h3]:tracking-wider [&_h3]:mt-3 [&_h3]:mb-1.5 [&_strong]:text-white [&_strong]:font-semibold">
                                <ReactMarkdown>{solution}</ReactMarkdown>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : null
                  ) : null}
                </div>
              )}

              {/* Generated Files */}
              {activeTab === "deliverables" && result.deliverables && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {result.deliverables.map((deliverable, i) => (
                    <motion.div
                      key={deliverable.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
                      className="glass rounded-2xl p-5 border border-violet-500/30 transition-all duration-300 hover:border-violet-500/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/10 flex items-center justify-center">
                            {deliverable.type === "presentation" && <Presentation className="w-5 h-5 text-violet-300" />}
                            {deliverable.type === "document" && <FileText className="w-5 h-5 text-violet-300" />}
                            {deliverable.type === "spreadsheet" && <FileText className="w-5 h-5 text-violet-300" />}
                            {deliverable.type === "codebase" && <Code className="w-5 h-5 text-violet-300" />}
                            {deliverable.type === "image" && <Image className="w-5 h-5 text-violet-300" />}
                          </div>
                          <div>
                            <p className="text-violet-300 text-sm font-semibold mb-1">{deliverable.name}</p>
                            <p className="text-zinc-400 text-xs mb-2">{deliverable.description}</p>
                            <p className="text-white text-xs bg-violet-500/20 px-2 py-1 rounded inline-block">
                              {deliverable.type.toUpperCase()}
                            </p>
                            <p className="text-xs text-green-400 mt-2">
                              🌐 Stored on IPFS
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => downloadDeliverable(deliverable)}
                          className="px-3 py-2 bg-violet-500 hover:bg-violet-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Upload to IPFS
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Hedera logs */}
              {activeTab === "hedera" && (
                <div className="glass rounded-2xl p-5 border border-white/[0.06]">
                  <div className="flex items-center gap-2 mb-5">
                    <Activity className="w-4 h-4 text-violet-400" />
                    <h3 className="text-sm font-semibold text-white">Hedera Activity Log</h3>
                    <span className="text-xs text-zinc-500 ml-auto">
                      Immutable • Timestamped • Testnet
                    </span>
                  </div>
                  <HederaLogPanel logs={result.hederaLogs} />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-auto pt-12 text-center">
          <p className="text-zinc-600 text-xs">
            Powered by{" "}
            <span className="text-violet-400">OpenAI</span> ·{" "}
            <span className="text-emerald-400">Hedera</span> ·{" "}
            <span className="text-blue-400">Next.js</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
