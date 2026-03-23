"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

interface SlideHeaderProps {
  title: string;
  subtitle?: string;
  category?: string;
}

export const SlideHeader: React.FC<SlideHeaderProps> = ({ title, subtitle, category }) => {
  return (
    <div className="mb-10 relative z-20">
      <div className="flex items-center gap-3 mb-4 text-sm font-bold uppercase tracking-[0.2em] text-zinc-500">
        <span>Hederon AI</span>
        {category && (
          <>
            <ChevronRight className="w-4 h-4" />
            <span className="text-zinc-400">{category}</span>
          </>
        )}
      </div>
      
      <h2 className="mb-3 text-7xl font-black tracking-tight text-white leading-none">
        {title}
      </h2>
      
      {subtitle && (
        <h3 className="text-3xl font-medium text-zinc-400 max-w-7xl leading-relaxed">
          {subtitle}
        </h3>
      )}
      
      <div className="mt-6 h-1 w-24 rounded-full overflow-hidden bg-zinc-800">
        <div 
          className="h-full w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500"
          style={{ width: "40%" }} // Visual accent
        />
      </div>
    </div>
  );
};
