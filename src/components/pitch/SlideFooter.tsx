"use client";

import React from "react";

interface SlideFooterProps {
  index: number;
  total: number;
}

export const SlideFooter: React.FC<SlideFooterProps> = ({ index, total }) => {
  return (
    <div
      className="mt-auto flex items-center justify-between text-xl font-medium text-zinc-600 relative z-20"
    >
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="h-6 w-0.5 bg-blue-500/40 rounded-full" />
          <span className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-sm">
            Hederon AI
          </span>
        </div>
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
        <span className="text-sm opacity-60">Strategic AI Execution Layer</span>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-zinc-500">hederonai.dovetecenterprises.site</span>
        <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-1.5 rounded-full font-bold text-lg text-zinc-400">
          <span className="text-white">{index + 1}</span>
          <span className="mx-2 opacity-30">/</span>
          <span>{total}</span>
        </div>
      </div>
    </div>
  );
};
