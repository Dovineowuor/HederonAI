"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface SlideBaseProps {
  children: React.ReactNode;
  id: string;
  isMaximized?: boolean;
}

const SLIDE_W = 1920;
const SLIDE_H = 1080;

export const SlideBase: React.FC<SlideBaseProps> = ({ children, id, isMaximized }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useLayoutEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const availW = containerRef.current.offsetWidth;
      let s = availW / SLIDE_W;
      // On scroll-view, cap at 90% so there's breathing room; in presentation mode fill fully
      if (!isMaximized) s = Math.min(s, 0.92);
      else s = Math.min(s, 1.0);
      setScale(s);
    };

    const ro = new ResizeObserver(updateScale);
    if (containerRef.current) ro.observe(containerRef.current);
    updateScale();
    return () => ro.disconnect();
  }, [isMaximized]);

  const scaledH = SLIDE_H * scale;
  // When scaled, the 1920px element protrudes outside — we need to shift it left by half the overflow
  const offsetX = ((SLIDE_W * scale) - (SLIDE_W * scale)) / 2; // always 0 — centering handled by flex

  return (
    <div ref={containerRef} className="w-full flex justify-center" style={{ height: `${scaledH}px` }}>
      <div
        style={{
          width: `${SLIDE_W}px`,
          height: `${SLIDE_H}px`,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        <section
          id={id}
          className="pitch-slide relative overflow-hidden rounded-3xl border shadow-2xl w-full h-full"
          style={{
            backgroundColor: "#09090b",
            borderColor: "rgba(255,255,255,0.10)",
          }}
        >
          {/* Ambient Background */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-[-10%] top-[-15%] h-[60%] w-[60%] rounded-full blur-[160px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-15%] right-[-10%] h-[60%] w-[60%] rounded-full blur-[160px] pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)" }}
          />

          {/* Content */}
          <div className="relative z-10 flex h-full w-full flex-col px-[8rem] py-[5rem]">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
};
