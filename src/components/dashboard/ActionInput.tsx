"use client";

import { motion } from "framer-motion";
import { Lightbulb, RotateCcw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionInputProps {
  mode: "goal" | "challenge";
  setMode: (mode: "goal" | "challenge") => void;
  goal: string;
  setGoal: (val: string) => void;
  challenge: string;
  setChallenge: (val: string) => void;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  handleReset: () => void;
  hasResult: boolean;
  examples: string[];
}

export default function ActionInput({
  mode, setMode, goal, setGoal, challenge, setChallenge,
  isLoading, handleSubmit, handleReset, hasResult, examples
}: ActionInputProps) {
  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex p-1.5 glass bg-white/[0.03] border-white/[0.08] rounded-2xl w-full sm:w-fit">
        <button
          onClick={() => setMode("goal")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
            mode === "goal" 
              ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" 
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <img src="/logo_monochrome.png" className={cn("w-4 h-4 object-contain", mode === "goal" ? "brightness-200" : "opacity-50")} alt="" />
          Execute Goal
        </button>
        <button
          onClick={() => setMode("challenge")}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
            mode === "challenge" 
              ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Lightbulb className={cn("w-4 h-4", mode === "challenge" ? "fill-white/20" : "")} />
          Brainstorm
        </button>
      </div>

      {/* Main Input Card */}
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500/10 to-blue-500/10 rounded-[2rem] blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
        
        <div className="relative glass border-white/[0.08] rounded-[2rem] p-6 shadow-2xl backdrop-blur-2xl">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <textarea
                value={mode === "goal" ? goal : challenge}
                onChange={(e) => mode === "goal" ? setGoal(e.target.value) : setChallenge(e.target.value)}
                placeholder={mode === "goal" ? "What's the objective today?" : "Describe your bottleneck..."}
                rows={2}
                className="w-full bg-transparent text-white placeholder-zinc-600 text-xl font-medium resize-none focus:outline-none leading-snug"
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e as unknown as React.FormEvent);
                  }
                }}
              />
              
              {!hasResult && (
                 <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/[0.04]">
                    <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mr-2 self-center">
                      Try:
                    </span>
                    {examples.map((eg) => (
                      <button
                        key={eg}
                        type="button"
                        onClick={() => mode === "goal" ? setGoal(eg) : setChallenge(eg)}
                        className="text-[11px] text-zinc-500 hover:text-violet-400 px-3 py-1 rounded-full bg-white/[0.02] hover:bg-violet-500/5 border border-white/[0.06] transition-all flex items-center gap-1 group/btn"
                      >
                        {eg}
                        <ChevronRight className="w-3 h-3 opacity-0 group-hover/btn:opacity-100 -ml-1 group-hover/btn:ml-0 transition-all" />
                      </button>
                    ))}
                 </div>
              )}
            </div>

            <div className="flex flex-col gap-2 shrink-0">
               {hasResult && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-12 h-12 rounded-2xl glass hover:bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all shadow-xl"
                  >
                    <RotateCcw className="w-5 h-5" />
                  </button>
               )}
               <button
                  id="run-agents-btn"
                  type="submit"
                  disabled={isLoading || (mode === "goal" ? !goal.trim() : !challenge.trim())}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl disabled:opacity-30 disabled:grayscale",
                    mode === "goal" ? "bg-white text-black hover:bg-zinc-200" : "bg-blue-500 text-white hover:bg-blue-400"
                  )}
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-zinc-500 border-t-zinc-900 rounded-full animate-spin" />
                  ) : (
                    <img src="/logo.png" className={cn("w-5 h-5 object-contain", mode === "goal" ? "" : "brightness-200")} alt="" />
                  )}
               </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
