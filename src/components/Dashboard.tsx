"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import DashboardLayout from "./dashboard/DashboardLayout";
import DashboardHero from "./dashboard/DashboardHero";
import ActionInput from "./dashboard/ActionInput";
import ProjectResults from "./dashboard/ProjectResults";
import CustomizationModal from "./dashboard/CustomizationModal";
import type { AgentRunResult, ExecutionMode, Deliverable } from "@/lib/types";
import { useEffect } from "react";


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
  const [showCustomization, setShowCustomization] = useState(false);
  const [hasContext, setHasContext] = useState<boolean | null>(null);

  // Check for existing context on mount
  useEffect(() => {
    if (session?.user?.email) {
      // 1. Check for guest context to sync
      const guestContext = localStorage.getItem("guest_user_context");
      if (guestContext) {
        try {
          const parsed = JSON.parse(guestContext);
          fetch("/api/user-context", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ context: parsed }),
          }).then(() => {
            localStorage.removeItem("guest_user_context");
            setHasContext(true);
          });
        } catch (e) {
          console.error("Failed to sync guest context", e);
        }
      } else {
        // 2. Otherwise fetch from DB
        fetch("/api/user-context")
          .then(res => res.json())
          .then(data => setHasContext(!!data.context))
          .catch(() => setHasContext(false));
      }
    } else {
      // For guests, check localStorage
      const guestContext = localStorage.getItem("guest_user_context");
      setHasContext(!!guestContext);
    }
  }, [session]);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "goal" && !goal.trim() || isLoading) return;
    if (mode === "challenge" && !challenge.trim() || isLoading) return;

    // Intercept if no context exists
    if (hasContext === false) {
      setShowCustomization(true);
      return;
    }

    setIsLoading(true);

    setResult(null);
    setError(null);

    try {
      // Get context from localStorage for guests or use existing hasContext flag
      let context = null;
      const savedContext = localStorage.getItem("guest_user_context");
      if (savedContext) {
        try {
          context = JSON.parse(savedContext);
        } catch (e) {
          console.error("Failed to parse guest context", e);
        }
      }

      const payload = mode === "goal" 
        ? { mode: "goal", goal: goal.trim(), context }
        : { mode: "challenge", challenge: challenge.trim(), context };

      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");

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
      if (!response.ok) throw new Error('Failed to upload to IPFS');
      
      const resData = await response.json();
      if (resData.success) {
        await navigator.clipboard.writeText(resData.ipfsUrl);
        alert(`✅ File uploaded to IPFS!\n\n🔗 IPFS URL: ${resData.ipfsUrl}\n\n📋 URL copied to clipboard`);
        window.open(resData.ipfsUrl, '_blank');
      } else {
        throw new Error(resData.error || 'Upload failed');
      }
    } catch (error) {
      console.error('IPFS download error:', error);
      alert(`❌ Failed to upload to IPFS: ${(error as Error).message}`);
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-10">
        {/* Top Hero Section */}
        <DashboardHero 
          mode={mode} 
          onRefine={() => setShowCustomization(true)}
          hasContext={!!hasContext}
        />

        {/* Action Center */}
        <ActionInput 
          mode={mode}
          setMode={setMode}
          goal={goal}
          setGoal={setGoal}
          challenge={challenge}
          setChallenge={setChallenge}
          isLoading={isLoading}
          handleSubmit={handleSubmit}
          handleReset={handleReset}
          hasResult={!!result}
          examples={mode === "goal" ? EXAMPLE_GOALS : EXAMPLE_CHALLENGES}
        />

        {/* Global Error Display */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="glass border-red-500/30 rounded-2xl p-4 text-sm text-red-300 shadow-lg shadow-red-500/5 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                 <span className="text-red-400 font-bold">!</span>
              </div>
              <p>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading Orchestrator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass rounded-[2rem] p-12 text-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-blue-500/5 to-emerald-500/5 animate-pulse" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                  <div className="flex flex-wrap items-center justify-center gap-3 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
                      <img src="/logo_monochrome.png" className="w-16 h-16 object-contain" alt="" />
                    </div>
                    {["CEO", "Strategy", "Marketing", "Operations"].map((role, i) => (
                       <motion.div
                          key={role}
                          animate={{ 
                             scale: [1, 1.1, 1],
                             opacity: [0.3, 1, 0.3]
                          }}
                          transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                          className="px-4 py-2 glass rounded-full text-xs font-bold text-violet-300 border-violet-500/20"
                       >
                          {role}
                       </motion.div>
                    ))}
                 </div>
                 <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Executing Agent Protocol...</h3>
                    <p className="text-zinc-500 text-sm">Synchronizing decentralised intelligence across Hedera nodes</p>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Hub */}
        <AnimatePresence>
          {result && (
            <ProjectResults 
              result={result}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              mode={mode}
              downloadDeliverable={downloadDeliverable}
            />
          )}
        </AnimatePresence>

        {/* Customization Questionnaire */}
        <AnimatePresence>
          {showCustomization && (
            <CustomizationModal 
              goal={mode === "goal" ? goal : undefined}
              challenge={mode === "challenge" ? challenge : undefined}
              onClose={() => setShowCustomization(false)}
              onComplete={() => {
                setShowCustomization(false);
                setHasContext(true);
                // Re-trigger submit after setting context
                setTimeout(() => {
                  const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
                  submitBtn?.click();
                }, 100);
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>

  );
}
