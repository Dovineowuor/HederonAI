"use client";

import { cn } from "@/lib/utils";
import type { AgentRole, AgentTask } from "@/lib/types";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";

const AGENT_META: Record<
  AgentRole,
  { emoji: string; label: string; color: string; gradient: string; borderColor: string }
> = {
  CEO: {
    emoji: "👑",
    label: "CEO Agent",
    color: "text-amber-300",
    gradient: "from-amber-500/20 to-orange-500/10",
    borderColor: "border-amber-500/30",
  },
  Strategy: {
    emoji: "📊",
    label: "Strategy Analyst",
    color: "text-violet-300",
    gradient: "from-violet-500/20 to-purple-500/10",
    borderColor: "border-violet-500/30",
  },
  Marketing: {
    emoji: "📣",
    label: "Marketing Manager",
    color: "text-blue-300",
    gradient: "from-blue-500/20 to-cyan-500/10",
    borderColor: "border-blue-500/30",
  },
  Operations: {
    emoji: "⚙️",
    label: "Operations Manager",
    color: "text-emerald-300",
    gradient: "from-emerald-500/20 to-green-500/10",
    borderColor: "border-emerald-500/30",
  },
  Brainstormer: {
    emoji: "💡",
    label: "Innovation Brainstormer",
    color: "text-yellow-300",
    gradient: "from-yellow-500/20 to-amber-500/10",
    borderColor: "border-yellow-500/30",
  },
  Researcher: {
    emoji: "🔍",
    label: "Research Agent",
    color: "text-indigo-300",
    gradient: "from-indigo-500/20 to-blue-500/10",
    borderColor: "border-indigo-500/30",
  },
  Analyst: {
    emoji: "📈",
    label: "Business Analyst",
    color: "text-cyan-300",
    gradient: "from-cyan-500/20 to-teal-500/10",
    borderColor: "border-cyan-500/30",
  },
  Designer: {
    emoji: "🎨",
    label: "Solution Designer",
    color: "text-fuchsia-300",
    gradient: "from-fuchsia-500/20 to-pink-500/10",
    borderColor: "border-fuchsia-500/30",
  },
  Creator: {
    emoji: "🛠️",
    label: "Creator Agent",
    color: "text-rose-300",
    gradient: "from-rose-500/20 to-red-500/10",
    borderColor: "border-rose-500/30",
  },
};


const STATUS_CONFIG = {
  pending: { label: "Pending", dot: "bg-zinc-500", ring: "" },
  running: { label: "Executing…", dot: "bg-yellow-400 pulse-ring", ring: "ring-yellow-400/30" },
  done: { label: "Complete", dot: "bg-emerald-400", ring: "ring-emerald-400/20" },
  error: { label: "Error", dot: "bg-red-400", ring: "ring-red-400/20" },
};

interface AgentCardProps {
  task: AgentTask;
  index: number;
}

export default function AgentCard({ task, index }: AgentCardProps) {
  const meta = AGENT_META[task.assignedTo];
  const status = STATUS_CONFIG[task.status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: "easeOut" }}
      className={cn(
        "glass rounded-2xl p-5 border transition-all duration-300",
        meta.borderColor,
        task.status === "running" && "glow"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br",
              meta.gradient
            )}
          >
            {meta.emoji}
          </div>
          <div>
            <p className={cn("text-sm font-semibold", meta.color)}>{meta.label}</p>
            <p className="text-white font-medium text-sm mt-0.5 leading-snug">{task.title}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 shrink-0", status.ring)}>
          <span className={cn("w-2 h-2 rounded-full", status.dot)} />
          <span className="text-xs text-zinc-300 font-medium">{status.label}</span>
        </div>
      </div>

      {/* Running shimmer */}
      {task.status === "running" && (
        <div className="shimmer h-24 rounded-xl mb-3" />
      )}

      {/* Output */}
      {task.output && task.status !== "running" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-2"
        >
          <div
            className={cn(
              "rounded-xl p-4 bg-gradient-to-br text-sm",
              meta.gradient,
              "border border-white/5"
            )}
          >
            <div className="prose prose-sm prose-invert max-w-none text-zinc-200 leading-relaxed [&_h2]:text-xs [&_h2]:font-semibold [&_h2]:text-zinc-400 [&_h2]:uppercase [&_h2]:tracking-wider [&_h2]:mt-3 [&_h2]:mb-1.5 [&_ul]:mt-1 [&_li]:text-zinc-300 [&_strong]:text-white [&_strong]:font-semibold">
              <ReactMarkdown>{task.output}</ReactMarkdown>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
