"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Sparkles, Save, Shield, Cpu, Zap, Info, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Strategy", "Marketing", "Engineering", "Finance"];

export default function CreatorStudio() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "Strategy",
    priceHbar: 10,
    systemPrompt: ""
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/creator/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/marketplace"), 2000);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create agent");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-12 text-left relative">
           <div className="absolute -top-10 -left-10 w-32 h-32 opacity-[0.05] pointer-events-none grayscale">
             <img src="/logo_ilustrated.png" alt="" className="w-full h-full object-contain" />
           </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 gradient-text">
              Agent Creator Studio
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Build, list, and monetize your prompt engineering expertise. 
              Earn 70% of every execution fee on the Hederon network.
            </p>
          </motion.div>
        </div>

        {/* Studio Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <motion.form 
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass rounded-[2rem] p-8 space-y-8 border border-white/10"
            >
              {/* Basic Info */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">Agent Identity</label>
                  <input 
                    type="text"
                    placeholder="e.g. GrowthHacker-V1"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors appearance-none"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">Price (HBAR)</label>
                    <input 
                      type="number"
                      step="0.1"
                      min="1"
                      required
                      value={formData.priceHbar}
                      onChange={e => setFormData({ ...formData, priceHbar: Number(e.target.value) })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-widest">Marketplace Description</label>
                  <textarea 
                    placeholder="Describe what your agent does best..."
                    required
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Core Logic */}
              <div className="pt-6 border-t border-white/5">
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="w-5 h-5 text-amber-500" />
                  <label className="block text-sm font-bold text-zinc-400 uppercase tracking-widest">System Prompt (The Agent's Mind)</label>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                  <textarea 
                    placeholder="You are an expert growth hacker specializing in B2B SaaS. Your goal is to..."
                    required
                    rows={8}
                    value={formData.systemPrompt}
                    onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
                    className="relative w-full bg-zinc-950 border border-white/10 rounded-2xl px-6 py-6 text-white font-mono text-sm leading-relaxed focus:outline-none focus:border-amber-500/30 transition-colors resize-none"
                  />
                </div>
                <p className="mt-3 text-xs text-zinc-500 flex items-center gap-1.5">
                  <Info className="w-3 h-3" />
                  Your prompt remains private and is only executed within the Hederon AI secure environment.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-xl shadow-white/5 active:scale-95"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : success ? (
                  <>
                    <Zap className="w-5 h-5 fill-black" />
                    Agent Listed Successfully!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Launch & List Agent
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          </div>

          {/* Sidebar / Preview */}
          <div className="space-y-6">
             {/* Rules/Tips Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass p-6 rounded-3xl border border-white/10 space-y-4"
            >
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Creator Rights
              </h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  Earn 70% of execution fees
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  Maintain prompt IP ownership
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  Update or delist anytime
                </li>
              </ul>
            </motion.div>

            {/* Verification Hint */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="glass p-6 rounded-3xl border border-white/10 bg-gradient-to-br from-amber-500/[0.03] to-orange-500/[0.03]"
            >
              <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                 Pro Tip
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Be specific in your system prompt. Agents with clear constraints and specialized domain knowledge tend to get higher ratings and more hires on the Hederon network.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
