"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SlideBase } from "./pitch/SlideBase";
import { SlideHeader } from "./pitch/SlideHeader";
import { SlideFooter } from "./pitch/SlideFooter";

export default function PitchDeckViewer() {
  const [isExporting, setIsExporting] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const deckRef = useRef<HTMLDivElement>(null);

  const COLORS = {
    blue: "#3b82f6",
    blueLight: "#60a5fa",
    violet: "#8b5cf6",
    violetDark: "#6d28d9",
    emerald: "#10b981",
    emeraldLight: "#34d399",
    amber: "#f59e0b",
    amberLight: "#fbbf24",
    rose: "#f43f5e",
    zinc100: "#f4f4f5",
    zinc200: "#e4e4e7",
    zinc300: "#d4d4d8",
    zinc400: "#a1a1aa",
    zinc500: "#71717a",
    zinc700: "#3f3f46",
    zinc800: "#27272a",
    zinc900: "#18181b",
    orange: "#f97316",
  };

  const BRAND = {
    title: "Hederon AI",
    strapline: "One Person. Unlimited Execution. Powered by Hedera.",
    website: "hederonai.dovetecenterprises.site",
    repoUrl: "https://github.com/DovineOwuor/HederonAI",
  };

  const slides = useMemo(
    () => [
      {
        id: "slide-1",
        category: "Mission Control",
        title: "Hederon AI",
        subtitle: "Your AI Executive Ecosystem",
        type: "TITLE",
        content: (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <img src="/logo_ilustrated.png" alt="Hederon AI" className="mb-10 h-44 object-contain" />
            </motion.div>
            <h1 className="mb-6 text-[10rem] font-black tracking-tighter leading-none" style={{ background: "linear-gradient(to right, #fff, #60a5fa, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Hederon AI
            </h1>
            <p className="max-w-5xl rounded-3xl border border-white/10 bg-white/5 px-10 py-6 text-4xl leading-relaxed text-zinc-300 backdrop-blur-md">
              Transforming organizational bandwidth limitations into <span className="text-white font-bold">unlimited execution potential.</span>
            </p>
            <div className="mt-12 flex items-center gap-4 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
              <img src="/visionary_founder.png" alt="Dovine Owuor" className="w-12 h-12 rounded-full border border-white/20 object-cover" />
              <div className="text-left">
                <div className="text-sm font-bold text-white uppercase tracking-widest">Presented by Dovine Owuor</div>
                <div className="text-xs text-zinc-500">Founder & Lead Architect</div>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "slide-2",
        category: "The Visionary",
        title: "Meet the Founder",
        subtitle: "Dovine Owuor — Founder & Lead Software Engineer",
        type: "FOUNDER",
        content: (
          <div className="grid h-full grid-cols-[0.8fr_1.2fr] gap-12 items-center">
            <div className="relative group">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="aspect-square rounded-[3rem] overflow-hidden border-4 border-white/10 shadow-2xl relative z-10"
              >
                <img src="/visionary_founder.png" alt="Dovine Owuor" className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
              </motion.div>
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 blur-3xl opacity-50" />
              <div className="mt-8 flex flex-wrap gap-2 justify-center">
                {["AI Orchestration", "Web3 Architect", "Full-Stack Dev"].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-bold text-blue-400 uppercase tracking-tighter">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="flex items-center gap-3 text-2xl font-black text-white italic">
                  <span className="text-blue-500 text-3xl">🛠️</span> Core Expertise
                </h4>
                <ul className="space-y-4">
                  {[
                    "Modern Web (Next.js 16, React 19)",
                    "Decentralized Apps & Hedera SDK",
                    "Autonomous Multi-Agent Swarms"
                  ].map(item => (
                    <li key={item} className="flex gap-4 items-start group">
                      <span className="text-blue-500 font-bold group-hover:translate-x-1 transition-transform">▹</span>
                      <span className="text-lg text-zinc-300 font-medium leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="flex items-center gap-3 text-2xl font-black text-white italic">
                  <span className="text-emerald-500 text-3xl">🏆</span> Breakthroughs
                </h4>
                <ul className="space-y-4">
                  {[
                    "Verifiable AI Decision Ledgers",
                    "Integrated AI Micro-Economics",
                    "IPFS-Backed Deliverable Vaults"
                  ].map(item => (
                    <li key={item} className="flex gap-4 items-start group">
                      <span className="text-emerald-500 font-bold group-hover:translate-x-1 transition-transform">▹</span>
                      <span className="text-lg text-zinc-300 font-medium leading-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 pt-8 border-t border-white/5 mt-auto">
                <p className="text-xl text-zinc-400/80 leading-relaxed italic border-l-4 border-blue-500/30 pl-6">
                  "The future of work is algorithmic. Scaling human creativity through coordinated, industry-agnostic AI swarms on Hedera."
                </p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "slide-3",
        category: "The Execution Barrier",
        title: "Scaling is a resource battlefield.",
        subtitle: "70% of organizational bandwidth is wasted on coordination rather than creation.",
        content: (
          <div className="grid h-full grid-cols-3 gap-8">
            {[
              { icon: "📉", title: "The Operational Tax", body: "Companies drown in repetitive strategy, operations, and analysis." },
              { icon: "⏳", title: "The Talent Gap", body: "Specialized expertise is expensive, slow to recruit, and harder to retain." },
              { icon: "🔨", title: "Fragmented Execution", body: "Disconnected tools deliver text, but rarely coordinated industry results." },
            ].map((p, i) => (
              <motion.div key={i} whileHover={{ y: -10 }} className="p-10 rounded-[3rem] bg-zinc-900/50 border border-white/5 flex flex-col justify-between">
                <div className="text-7xl mb-6">{p.icon}</div>
                <div>
                  <h4 className="text-3xl font-bold mb-4 text-white">{p.title}</h4>
                  <p className="text-xl text-zinc-400 leading-relaxed">{p.body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        ),
      },
      {
        id: "slide-4",
        category: "The Multi-Industry Swarm",
        title: "Don't just use AI. Orchestrate your workforce.",
        subtitle: "A coordinated executive board built for institutional trust.",
        content: (
          <div className="grid h-full grid-cols-2 gap-10">
            <div className="space-y-6">
              {[
                { title: "CEO Agent", subtitle: "The Orchestrator", body: "Turns organizational mess into mission. Goal decomposition & coordination." },
                { title: "Specialist Agents", subtitle: "The Industry Experts", body: "Precision agents for Legal, Marketing, Finance, and Supply Chain." },
              ].map((a, i) => (
                <div key={i} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-3xl font-bold text-blue-400">0{i + 1}</div>
                  <div>
                    <h4 className="text-3xl font-bold text-white mb-1">{a.title}</h4>
                    <p className="text-blue-400 font-bold mb-3 uppercase tracking-widest text-sm">{a.subtitle}</p>
                    <p className="text-xl text-zinc-400">{a.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-[3rem] p-12 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 flex flex-col justify-center">
              <h4 className="text-4xl font-black mb-6 text-white leading-tight">Hedera Trust Layer</h4>
              <p className="text-2xl text-zinc-300 leading-relaxed mb-8">
                Enterprise-grade security where every action is immutable (<span className="text-blue-400 font-bold">HCS</span>) and settled instantly (<span className="text-blue-400 font-bold">HTS</span>) with full auditability.
              </p>
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-zinc-950/50 rounded-full border border-white/10 self-start text-xl text-zinc-400">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                Live Consensus Verified
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "slide-5",
        category: "Hyper-Scale Pipeline",
        title: "Objective to Result in Seconds",
        subtitle: "A recursive pipeline that transforms high-level strategic mandates into verifiable deliverables.",
        content: (
          <div className="relative h-full flex items-center">
            <div className="grid grid-cols-5 gap-4 w-full h-[60%]">
              {["Objective", "Decomposition", "Execution", "Settlement", "Verification"].map((step, i) => (
                <div key={step} className="relative flex flex-col items-center group">
                  <div className="w-full aspect-square rounded-[2rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center p-6 transition-all group-hover:bg-blue-500/10 group-hover:border-blue-500/20">
                    <div className="text-4xl font-black text-white/20 mb-2">{i + 1}</div>
                    <div className="text-xl font-bold text-center text-white">{step}</div>
                  </div>
                  {i < 4 && (
                    <div className="absolute top-1/2 -right-4 translate-x-1/2 -translate-y-1/2 text-3xl opacity-20 group-hover:opacity-100 transition-opacity">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "slide-6",
        category: "The Creator Economy",
        title: "Scaling Specialized Expertise.",
        subtitle: "A marketplace for consultants, lawyers, and engineers to list proprietary swarms.",
        content: (
          <div className="grid h-full grid-cols-2 gap-10">
            <div className="p-12 rounded-[3rem] bg-zinc-900/50 border border-white/5 flex flex-col justify-center">
              <h4 className="text-5xl font-black text-white mb-8">70 / 30 Revenue Split</h4>
              <p className="text-2xl text-zinc-400 leading-relaxed">
                We reward the expertise and maintain the infrastructure. Hedera native settlement ensures immediate, low-fee payout for every handshake.
              </p>
            </div>
            <div className="space-y-6 flex flex-col justify-center">
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
                <h5 className="text-2xl font-bold text-blue-400 mb-2">Hederon Studio</h5>
                <p className="text-lg text-zinc-400">Industry experts build specialized agents with zero-code interfaces.</p>
              </div>
              <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
                <h5 className="text-2xl font-bold text-emerald-400 mb-2">Verifiable History</h5>
                <p className="text-lg text-zinc-400">Cryptographic proof of previous high-performance agent handshakes.</p>
              </div>
            </div>
          </div>
        ),
      },
      {
        id: "slide-7",
        category: "Technical Dominance",
        title: "Built for Institutional Trust.",
        subtitle: "Leveraging the full Hedera stack for enterprise-grade auditability.",
        content: (
          <div className="grid h-full grid-cols-4 gap-6">
            {[
              { name: "HCS", full: "Consensus Service", body: "Immutable activity logs for 100% compliant audits." },
              { name: "HTS", full: "Token Service", body: "Native micro-settlement for global creative swarms." },
              { name: "HOL", full: "Object Ledger", body: "Agent registration and discoverability registry." },
              { name: "MCP", full: "Context Protocol", body: "Unified framework for bridging AI and On-Chain context." },
            ].map((t) => (
              <div key={t.name} className="p-8 rounded-[2rem] bg-white/5 border border-white/10 text-center flex flex-col">
                <div className="text-4xl font-black text-blue-400 mb-2">{t.name}</div>
                <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6">{t.full}</div>
                <p className="text-lg text-zinc-400 leading-relaxed mt-auto">{t.body}</p>
              </div>
            ))}
          </div>
        ),
      },
      {
        id: "slide-8",
        category: "Infrastructure of Trust",
        title: "The Hedera Advantage",
        subtitle: "Why the global economy runs on the Hashgraph.",
        content: (
          <div className="grid h-full grid-cols-2 gap-10">
            <ul className="space-y-8 flex flex-col justify-center">
              {[
                ["ABFT Security", "The highest standard of consensus for high-stakes execution."],
                ["Native Multi-Sig", "Collaborative team-based wallet management for operations."],
                ["Global Compliance", "Immutable trails enable easy auditing for regulated industries."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">✓</div>
                  <div>
                    <h5 className="text-2xl font-bold text-white">{t}</h5>
                    <p className="text-lg text-zinc-400">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-center justify-center rounded-[3rem] bg-white/5 border border-white/10 p-12">
              <div className="text-9xl mb-8">🛡️</div>
              <div className="text-center font-bold text-2xl text-zinc-400">Zero-Compromise Security</div>
            </div>
          </div>
        ),
      },
      {
        id: "slide-9",
        category: "Live Demo",
        title: "Multi-Agent Swarm in Action",
        subtitle: "Watch the future of verifiable executive labor on Hedera.",
        content: (() => {
          const VideoEmbed = () => {
            const [playing, setPlaying] = React.useState(false);
            const videoId = "rffOV2-s0ow";
            return (
              <div className="h-full flex flex-col items-center justify-center gap-8">
                <div
                  className="w-full max-w-5xl aspect-video rounded-[2.5rem] overflow-hidden border border-white/10 bg-zinc-950 relative group shadow-2xl"
                  style={{ boxShadow: "0 0 80px rgba(59,130,246,0.15)" }}
                >
                  {playing ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                      title="Hederon AI Demo YouTube Player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <button
                      onClick={() => setPlaying(true)}
                      className="absolute inset-0 w-full h-full flex items-center justify-center group"
                      aria-label="Play demo video"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt="Demo thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-500"
                      />
                      <div className="relative z-10 w-28 h-28 rounded-full bg-blue-500/80 backdrop-blur-md flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-500 transition-all duration-300 shadow-[0_0_60px_rgba(59,130,246,0.5)]">
                        <div className="w-0 h-0 border-l-[36px] border-l-white border-y-[24px] border-y-transparent ml-3" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-8 text-left">
                        <p className="text-2xl font-bold text-white">Click to watch Demo Presentation</p>
                        <p className="mt-1 text-blue-400 font-mono text-lg">youtu.be/{videoId}</p>
                      </div>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-6 text-xl font-medium text-zinc-500">
                  <span className="text-blue-500">⚡</span>
                  Recursive Swarm Expansion &amp; HCS Audit Trails
                  <span className="text-emerald-500">⚡</span>
                </div>
              </div>
            );
          };
          return <VideoEmbed />;
        })(),
      },
      {
        id: "slide-10",
        category: "Roadmap",
        title: "The Future of Work",
        subtitle: "From a hackathon MVP to the world's first agent-managed DAOs.",
        content: (
          <div className="h-full flex items-center">
            <div className="grid grid-cols-4 gap-8 w-full">
              {[
                { q: "Q1 2026", t: "MVP Launch", d: "Hello Future Hackathon Delivery", status: "COMPLETE" },
                { q: "Q2 2026", t: "Enterprise Studio", d: "Proprietary swarm builder goes live", status: "NEXT" },
                { q: "Q3 2026", t: "Institutional Auth", d: "Hashpack, Blade & Enterprise SSO", status: "PLANNED" },
                { q: "Q4 2026", t: "Agent DAOs", d: "Autonomous consultancies launch", status: "VISION" },
              ].map((r) => (
                <div key={r.q} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col h-full">
                  <div className={`text-sm font-bold px-3 py-1 rounded-full w-min mb-6 ${r.status === "COMPLETE" ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}>{r.status}</div>
                  <div className="text-3xl font-black text-white mb-2">{r.q}</div>
                  <div className="text-xl font-bold text-blue-400 mb-4">{r.t}</div>
                  <p className="text-lg text-zinc-500 leading-relaxed">{r.d}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "slide-11",
        category: "Competitive DNA",
        title: "The Hederon Advantage",
        subtitle: "Why organizations choose Hederon AI over generic wrappers.",
        content: (
          <div className="grid h-full grid-cols-2 gap-8 items-center">
            <div className="grid grid-cols-1 gap-6">
              {[
                ["Industry Agnostic", "From creative teams to fintech consultancies."],
                ["Algorithmic Trust", "Proven results on-ledger, not marketing claims."],
                ["Sovereign Security", "Your workflows, your keys, your data."],
                ["Scale on Demand", "Instantly recruit a team of 100 specialized agents."],
              ].map(([t, b], i) => (
                <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 text-2xl font-black">{i + 1}</div>
                  <div>
                    <h5 className="text-xl font-bold text-white">{t}</h5>
                    <p className="text-zinc-400">{b}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-full bg-blue-500/10 rounded-[3rem] border border-blue-500/20 p-12 flex flex-col justify-center text-center">
              <div className="text-8xl mb-8">💎</div>
              <h4 className="text-4xl font-black text-white mb-4">Unfair Advantage</h4>
              <p className="text-xl text-zinc-400 leading-relaxed">The only platform bridging institutional trust and autonomous agent swarms.</p>
            </div>
          </div>
        ),
      },
      {
        id: "slide-12",
        category: "Business Model Canvas",
        title: "Revenue Architecture",
        subtitle: "Sustainable growth through a creator-aligned fee structure.",
        content: (
          <div className="grid h-full grid-cols-[1fr_0.8fr] gap-10">
            <div className="grid grid-rows-2 gap-8">
              <div className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/5">
                <h5 className="text-2xl font-bold text-zinc-500 uppercase tracking-widest mb-6 underline decoration-blue-500 underline-offset-8">Revenue Streams</h5>
                <ul className="space-y-4 text-2xl text-zinc-200">
                  <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500" /> 30% Platform Fee on mirco-tx</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-blue-500" /> Enterprise Studio Subscriptions</li>
                </ul>
              </div>
              <div className="p-10 rounded-[2.5rem] bg-zinc-900/50 border border-white/5">
                <h5 className="text-2xl font-bold text-zinc-500 uppercase tracking-widest mb-6 underline decoration-emerald-500 underline-offset-8">Cost Structure</h5>
                <ul className="space-y-4 text-2xl text-zinc-200">
                  <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Hedera Net Fees ($0.0001 avg)</li>
                  <li className="flex items-center gap-4"><div className="w-2 h-2 rounded-full bg-emerald-500" /> AI API / Compute Units</li>
                </ul>
              </div>
            </div>
            <div className="p-12 rounded-[3.5rem] bg-gradient-to-b from-emerald-600/20 to-blue-600/20 border border-white/10 flex flex-col items-center justify-center text-center">
              <div className="text-7xl font-black text-white mb-4">100x</div>
              <p className="text-2xl font-medium text-zinc-300">Reduction in coordination overhead for institutional partners.</p>
            </div>
          </div>
        ),
      },
      {
        id: "slide-13",
        category: "Go-To-Market Strategy",
        title: "The Rollout Plan",
        subtitle: "Targeted expansion from Web3 pioneers to global consultancies.",
        content: (
          <div className="grid h-full grid-cols-2 gap-10 items-center">
            <div className="space-y-10">
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 text-3xl font-black text-blue-500/40">01</div>
                <h5 className="text-3xl font-bold text-white mb-2">Build & Validate</h5>
                <p className="text-xl text-zinc-400">Target solo-founders and small dev shops in the Hedera ecosystem via HOL Registry.</p>
              </div>
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 text-3xl font-black text-emerald-500/40">02</div>
                <h5 className="text-3xl font-bold text-white mb-2">Scale & Ecosystem</h5>
                <p className="text-xl text-zinc-400">Launch the Agent Marketplace and white-labeling for Legal-Tech firms.</p>
              </div>
            </div>
            <div className="rounded-[3rem] bg-white/5 border border-white/10 p-12 text-center overflow-hidden">
              <h6 className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-12">Integrated Discovery</h6>
              <div className="text-4xl font-black text-white mb-4 italic">HOL + MCP</div>
            </div>
          </div>
        ),
      },
      {
        id: "slide-14",
        category: "Design Decisions",
        title: "Engineering for Scale.",
        subtitle: "Why we built a swarm instead of a wrapper.",
        content: (
          <div className="grid h-full grid-cols-2 gap-8">
            <div className="grid grid-cols-1 gap-4">
              {[
                ["Multi-Agent Swarm", "Higher precision, lower hallucinations than single LLMs."],
                ["HCS State Mgmt", "Provides 'Proof of Thought' audit trail for institutions."],
                ["Glassmorphism UI", "Enterprise aesthetic for non-crypto natives."],
              ].map(([t, d]) => (
                <div key={t} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                  <h5 className="text-xl font-bold text-blue-400 mb-1">{t}</h5>
                  <p className="text-zinc-400">{d}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Throughput", "10-15 HCS tx", "per goal"],
                ["Speed", "< 60s", "per deliverable"],
                ["Adoption", "4+ Accounts", "per user"],
                ["Efficiency", "100%", "Traceable"],
              ].map(([l, v, s]) => (
                <div key={l} className="p-6 rounded-2xl bg-zinc-950/50 border border-white/5 flex flex-col justify-center text-center">
                  <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-2">{l}</div>
                  <div className="text-2xl font-black text-white">{v}</div>
                  <div className="text-xs text-zinc-600">{s}</div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        id: "slide-15",
        category: "The Ask",
        title: "Join the Sovereign Revolution.",
        subtitle: "Hederon AI is ready to scale the future of organizational labor.",
        type: "ASK",
        content: (
          <div className="flex h-full flex-col justify-between">
            <h4 className="text-6xl font-black text-white italic mb-10">One Person. Unlimited Execution.</h4>

            <div className="grid grid-cols-[1fr_0.8fr] gap-12 items-center flex-1 min-h-0 mb-10">
              <div className="space-y-6">
                {[
                  { t: "Partners", d: "Strategic Hedera ecosystem integration.", icon: "🤝" },
                  { t: "Growth", d: "Beta-tester feedback from the next gen.", icon: "⚡" },
                  { t: "Investment", d: "Pre-seed opportunity for the labor shift.", icon: "💰" },
                ].map(a => (
                  <div key={a.t} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center gap-6">
                    <div className="text-4xl">{a.icon}</div>
                    <div className="text-left">
                      <h5 className="text-2xl font-black text-blue-400">{a.t}</h5>
                      <p className="text-xl text-zinc-400">{a.d}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="h-full flex flex-col justify-center">
                <div className="p-10 rounded-[3.5rem] bg-blue-500/10 border border-blue-500/20 text-left relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-6 mb-8">
                      <img src="/visionary_founder.png" alt="Dovine Owuor" className="w-24 h-24 rounded-full border-2 border-blue-500/30 object-cover" />
                      <div>
                        <div className="text-xl font-bold text-white">Dovine Owuor</div>
                        <div className="text-sm text-blue-400 font-bold uppercase tracking-widest">Founder & Lead Architect</div>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-white italic leading-tight mb-4">
                      "The future of work is algorithmic. Let's build it together."
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 p-8 text-6xl opacity-5">"</div>
                </div>
              </div>
            </div>

            <div className="flex gap-8 justify-center mt-auto">
              <button className="px-16 py-7 rounded-3xl bg-blue-500 text-white font-black text-3xl shadow-[0_0_60px_rgba(59,130,246,0.5)] transition hover:scale-105">Invest Now</button>
              <button className="px-16 py-7 rounded-3xl border-2 border-white/20 bg-white/5 text-white font-black text-3xl transition hover:bg-white/10">Partner with Us</button>
            </div>
          </div>
        )
      },
      {
        id: "slide-16",
        category: "Contact",
        title: "Connect & Build",
        subtitle: "Join the future of verifiable executive labor.",
        content: (
          <div className="flex h-[calc(100%-80px)] items-center justify-center">
            <div className="grid grid-cols-[1fr_400px] gap-16 w-full max-w-6xl">
              
              <div className="flex flex-col justify-center gap-10">
                <div className="space-y-4">
                  <h4 className="text-4xl font-black text-white">Let's Talk.</h4>
                  <p className="text-2xl text-zinc-400">Discover how Hederon AI can scale your organizational throughput.</p>
                </div>
                
                <div className="space-y-6">
                  {[
                    { label: "Website", val: "hederonai.dovetecenterprises.site" },
                    { label: "Email", val: "founders@hederon.ai" },
                    { label: "X (Twitter)", val: "@HederonAILabs" },
                    { label: "GitHub", val: "github.com/dovetec/hederon-ai" },
                  ].map(l => (
                    <div key={l.label} className="flex flex-col bg-white/5 border border-white/10 rounded-2xl p-6">
                      <span className="text-zinc-500 font-bold uppercase tracking-widest text-sm mb-1">{l.label}</span>
                      <span className="text-white text-xl font-medium font-mono">{l.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center items-center">
                <div className="bg-white p-6 rounded-3xl shadow-[0_0_80px_rgba(59,130,246,0.2)] mb-8">
                  <img 
                    src="/hederon-qr.png" 
                    alt="Hederon AI Website QR Code" 
                    className="w-full h-auto aspect-square rounded-xl"
                  />
                </div>
                <p className="text-zinc-400 text-lg font-bold">Scan to open website</p>
                <div className="mt-4 flex gap-4 text-3xl">
                  {/* Decorative simple icons for visual interest */}
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">🌍</div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">💬</div>
                </div>
              </div>

            </div>
          </div>
        )
      }
    ],
    []
  );

  const nextSlide = () => setActiveSlide((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setActiveSlide((prev) => Math.max(prev - 1, 0));

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMaximized) return;
      if (e.key === "ArrowRight" || e.key === " ") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "Escape") setIsMaximized(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMaximized, slides.length]);


  const renderSlides = () => (
    <div
      ref={deckRef}
      className={`mx-auto max-w-[1920px] px-4 space-y-20 ${isMaximized ? "pb-32" : ""}`}
      onClick={() => !isMaximized && setIsMaximized(true)}
      style={{ cursor: isMaximized ? "default" : "zoom-in" }}
    >
      {slides.map((slide, index) => {
        if (isMaximized && index !== activeSlide) return null;

        return (
          <SlideBase key={slide.id} id={slide.id} isMaximized={isMaximized}>
            <SlideHeader
              title={slide.title}
              subtitle={slide.subtitle}
              category={slide.category}
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={index === activeSlide || !isMaximized ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1"
            >
              {slide.content}
            </motion.div>
            <SlideFooter index={index} total={slides.length} />
          </SlideBase>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-black px-4 pb-32 pt-10 text-white sm:px-8">
      <div className="relative z-10 mx-auto mb-16 flex max-w-[1920px] flex-col items-start justify-between gap-6 md:flex-row md:items-center border-b border-white/5 pb-10">
        <div>
          <h1 className="bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-4xl font-black text-transparent tracking-tighter">
            Hederon AI Pitch Deck
          </h1>
          <p className="mt-2 text-xl text-zinc-500 font-medium">Clean, export-optimized 16:9 deck for institutional replication</p>
        </div>

        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setIsMaximized(true)}
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-medium transition hover:bg-white/10"
          >
            Fullscreen
          </button>
          <a
            href="/Hederon AI Pitch Deck.pdf"
            download="Hederon_AI_Pitch_Deck.pdf"
            className="rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 font-medium transition hover:bg-white/10 flex items-center gap-2"
          >
            Download PDF
          </a>
        </div>
      </div>



      {!isMaximized && renderSlides()}

      {isMaximized && (
        <div className="fixed inset-0 z-[100] flex flex-col h-screen w-screen overflow-hidden bg-black/95 backdrop-blur-2xl">
          <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-zinc-500 tracking-widest uppercase">Presentation Mode</span>
              <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-zinc-400">Slide {activeSlide + 1} / {slides.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={prevSlide}
                disabled={activeSlide === 0}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 disabled:opacity-20"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                disabled={activeSlide === slides.length - 1}
                className="rounded-xl border border-white/10 bg-white/5 p-3 text-white transition hover:bg-white/10 disabled:opacity-20"
              >
                →
              </button>
              <button
                onClick={() => setIsMaximized(false)}
                className="rounded-xl border-2 border-red-500/20 bg-red-500/10 px-6 py-2.5 text-red-400 font-bold transition hover:bg-red-500/20"
              >
                Exit
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 min-h-0 overflow-hidden">
            {renderSlides()}
          </div>

          <div className="p-6 flex justify-center gap-2 overflow-x-auto">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveSlide(i)}
                className={`w-3 h-1.5 rounded-full transition-all ${i === activeSlide ? "bg-blue-500 w-8" : "bg-white/10 hover:bg-white/20"}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
