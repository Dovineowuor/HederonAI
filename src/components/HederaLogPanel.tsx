"use client";

import type { HederaLog } from "@/lib/types";
import { motion } from "framer-motion";
import { Link, Coins } from "lucide-react";

interface HederaLogPanelProps {
  logs: HederaLog[];
}

export default function HederaLogPanel({ logs }: HederaLogPanelProps) {
  return (
    <div className="flex flex-col gap-2">
      {logs.length === 0 && (
        <p className="text-zinc-500 text-xs text-center py-6">
          No logs yet. Run a goal to see Hedera activity.
        </p>
      )}
      {logs.map((log, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] transition-colors"
        >
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              log.type === "HCS"
                ? "bg-violet-500/20 text-violet-400"
                : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {log.type === "HCS" ? (
              <Link className="w-3 h-3" />
            ) : (
              <Coins className="w-3 h-3" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${
                  log.type === "HCS"
                    ? "bg-violet-500/20 text-violet-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {log.type}
              </span>
              <span className="text-[10px] text-zinc-500">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed truncate">{log.message}</p>
            {log.txId && (
              <p className="text-[10px] text-zinc-600 mt-0.5 font-mono truncate">
                tx: {log.txId}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
