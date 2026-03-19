"use client";

import React, { useRef, useState } from "react";

export default function PitchDeckViewer() {
  const [isExporting, setIsExporting] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  // The slides array matching our PITCH_DECK content
  const slides = [
    {
      id: "slide-1",
      title: "ExecuAI\nYour AI Executive Team",
      subtitle: "Run a company of one — powered by intelligent agents and Hedera.",
      content: (
        <div className="flex flex-col h-full items-center justify-center text-center space-y-6">
          <div className="text-6xl text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 font-bold mb-4 drop-shadow-md">
            ExecuAI
          </div>
          <div className="text-2xl text-zinc-200 max-w-2xl font-medium leading-relaxed">
            Run a company of one — powered by intelligent agents and Hedera.
          </div>
          <div className="mt-12 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-semibold tracking-wide text-zinc-400 uppercase">
            Hedera Hello Future Apex Hackathon 2026 • AI & Agents
          </div>
        </div>
      )
    },
    {
      id: "slide-2",
      title: "The Problem",
      subtitle: "Human Bandwidth Crisis",
      content: (
        <div className="flex flex-col justify-center h-full space-y-8">
          <p className="text-2xl text-zinc-300 leading-relaxed border-l-4 border-rose-500 pl-6 bg-rose-500/5 py-4 rounded-r-xl">
            Entrepreneurs must bounce between Strategy, Marketing, Operations, and Execution. One person cannot scale like a full team.
          </p>
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="glass p-6 rounded-2xl border border-white/10 bg-black/40">
              <div className="text-rose-400 font-bold text-xl mb-3">Market Impact</div>
              <ul className="text-zinc-300 space-y-3 text-lg list-disc pl-5">
                <li>58M solo founders face burnout.</li>
                <li>90% of startups fail due to resource constraints.</li>
                <li>Current GenAI acts as a passive chatbot, not a proactive team.</li>
              </ul>
            </div>
            <div className="glass p-6 rounded-2xl border border-white/10 bg-black/40 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">⏳</div>
                <div className="text-xl font-semibold text-zinc-200">Time & Capital Bottleneck</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-3",
      title: "Our Solution",
      subtitle: "The Coordinated AI Swarm",
      content: (
        <div className="flex flex-col h-full space-y-6">
          <p className="text-xl text-zinc-300 mb-4">
            ExecuAI provides a native multi-agent system on Hedera that transforms goals into tangible execution.
          </p>
          <div className="grid grid-cols-2 gap-4 flex-grow">
            <div className="border border-amber-500/30 bg-amber-500/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">👑 <span className="text-amber-300 font-bold">CEO Agent</span></div>
              <p className="text-zinc-300">Goal decomposition & central coordination of workflows.</p>
            </div>
            <div className="border border-violet-500/30 bg-violet-500/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">📊 <span className="text-violet-300 font-bold">Strategy Analyst</span></div>
              <p className="text-zinc-300">Deep market research & actionable insight generation.</p>
            </div>
            <div className="border border-blue-500/30 bg-blue-500/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">📣 <span className="text-blue-300 font-bold">Marketing Manager</span></div>
              <p className="text-zinc-300">Growth planning, GTM execution, and content drafting.</p>
            </div>
            <div className="border border-emerald-500/30 bg-emerald-500/10 rounded-2xl p-5">
              <div className="text-2xl mb-2">⚙️ <span className="text-emerald-300 font-bold">Operations</span></div>
              <p className="text-zinc-300">System optimization & logistical milestone tracking.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-4",
      title: "Multi-Agent Intelligence",
      subtitle: "Synchronized Executive Decision Making",
      content: (
        <div className="flex flex-col h-full space-y-6 justify-center">
           <div className="flex flex-col gap-6">
              <div className="glass p-6 rounded-2xl border border-white/10 bg-zinc-900/60 flex items-center gap-8">
                 <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-4xl">👑</div>
                 <div>
                    <h3 className="text-xl font-bold text-amber-300 mb-1">CEO Orchestrator</h3>
                    <p className="text-zinc-400">Goal decomposition, task delegation, and cross-agent synchronization.</p>
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                 <div className="glass p-6 rounded-2xl border border-white/10 bg-zinc-900/60 text-center">
                    <div className="text-3xl mb-3">📊</div>
                    <div className="font-bold text-white mb-1">Strategy</div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Market Research</p>
                 </div>
                 <div className="glass p-6 rounded-2xl border border-white/10 bg-zinc-900/60 text-center">
                    <div className="text-3xl mb-3">📣</div>
                    <div className="font-bold text-white mb-1">Marketing</div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">GTM Strategy</p>
                 </div>
                 <div className="glass p-6 rounded-2xl border border-white/10 bg-zinc-900/60 text-center">
                    <div className="text-3xl mb-3">🛠️</div>
                    <div className="font-bold text-white mb-1">Operations</div>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Implementation</p>
                 </div>
              </div>
           </div>
        </div>
      )
    },
    {
      id: "slide-5",
      title: "The Deliverable Ecosystem",
      subtitle: "Beyond Chatbots: Real Project Assets",
      content: (
        <div className="flex flex-col h-full space-y-6">
          <p className="text-xl text-zinc-300">
            ExecuAI doesn't just talk — it builds. Every goal results in a professional-grade execution pack.
          </p>
          <div className="grid grid-cols-5 gap-4 h-full pb-32">
            <div className="glass p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center flex flex-col items-center justify-center">
              <div className="text-4xl mb-3">📄</div>
              <div className="font-bold text-rose-300 text-sm">PRD</div>
              <div className="text-[10px] text-zinc-500 mt-2">Full specs & user stories</div>
            </div>
            <div className="glass p-5 rounded-2xl border border-violet-500/20 bg-violet-500/5 text-center flex flex-col items-center justify-center">
              <div className="text-4xl mb-3">🏗️</div>
              <div className="font-bold text-violet-300 text-sm">Architecture</div>
              <div className="text-[10px] text-zinc-500 mt-2">Detailed system designs</div>
            </div>
            <div className="glass p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center flex flex-col items-center justify-center">
              <div className="text-4xl mb-3">📋</div>
              <div className="font-bold text-emerald-300 text-sm">BOM</div>
              <div className="text-[10px] text-zinc-500 mt-2">Resource & cost analysis</div>
            </div>
            <div className="glass p-5 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-center flex flex-col items-center justify-center">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-bold text-blue-300 text-sm">QA Plan</div>
              <div className="text-[10px] text-zinc-500 mt-2">Testing & security audit</div>
            </div>
            <div className="glass p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center flex flex-col items-center justify-center">
              <div className="text-4xl mb-3">📦</div>
              <div className="font-bold text-amber-300 text-sm">Codebase</div>
              <div className="text-[10px] text-zinc-500 mt-2">Ready-to-deploy ZIP</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-6",
      title: "Hedera-Backed Accountability",
      subtitle: "The Trust Layer for AI Decisions",
      content: (
        <div className="flex flex-col h-full space-y-6 justify-center">
          <div className="grid grid-cols-2 gap-8">
            <div className="glass p-8 rounded-3xl border border-white/10 bg-zinc-900/60">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4 flex items-center gap-3">
                 <span>⛓️</span> HCS Audit Traces
              </h3>
              <p className="text-lg text-zinc-300">
                Every agent thought, decision hash, and task transition is inscribed onto the <strong>Hedera Consensus Service</strong>. This solves the "Black Box" problem, providing immutable proof of work.
              </p>
            </div>
            <div className="glass p-8 rounded-3xl border border-white/10 bg-zinc-900/60">
               <h3 className="text-2xl font-bold text-emerald-400 mb-4 flex items-center gap-3">
                 <span>💸</span> HTS Agent Economy
              </h3>
              <p className="text-lg text-zinc-300">
                 Simulating a futuristic circular economy where agents settle micro-payments via <strong>Hedera Token Service</strong>. CEO agents pay consultants, creating a verifiable incentive lattice.
              </p>
            </div>
          </div>
          <div className="glass p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
             <div className="text-sm font-black uppercase tracking-[0.2em] text-zinc-500">Security & Sovereignty</div>
             <div className="text-xl font-bold text-zinc-200 mt-1 italic">IPFS Pinned • DLT Verified • User Owned</div>
          </div>
        </div>
      )
    },
    {
      id: "slide-7",
      title: "Live Demo & Architecture",
      subtitle: "A Production-Ready MVP",
      content: (
        <div className="flex flex-col h-full space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-center">
              <div className="text-teal-400 font-bold mb-2">Frontend</div>
              <div className="text-sm text-zinc-300">Next.js 16 (Turbopack)<br/>React 19, Tailwind CSS</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-center">
              <div className="text-purple-400 font-bold mb-2">Brain & Agents</div>
              <div className="text-sm text-zinc-300">Eliza OS, Agent Kit, OpenConvAI<br/>Kilo AI Gateway Fallback</div>
            </div>
            <div className="bg-white/5 border border-white/10 p-5 rounded-xl text-center">
              <div className="text-lime-400 font-bold mb-2">Web3</div>
              <div className="text-sm text-zinc-300">Hedera HCS + HTS<br/>IPFS Kubo API</div>
            </div>
          </div>
          <div className="glass rounded-2xl flex items-center justify-center p-8 bg-zinc-900/50 border border-white/10 flex-grow">
            <div className="text-center">
              <div className="text-white text-2xl font-semibold mb-2">Try the platform live today</div>
              <a href="https://execuai-demo.vercel.app" className="text-blue-400 text-3xl font-bold hover:underline">
                execuai-demo.vercel.app
              </a>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-8",
      title: "Future Roadmap",
      subtitle: "Where we are going",
      content: (
        <div className="flex flex-col h-full justify-center space-y-6 relative">
          <div className="absolute left-8 top-4 bottom-4 w-1 bg-white/10 rounded-full"></div>
          
          <div className="relative pl-16">
            <div className="absolute left-6 w-4 h-4 rounded-full bg-amber-500 top-2"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Q3 2026: The Agent Marketplace</h3>
            <p className="text-xl text-zinc-400">Deploy the world's first open-source Hedera Smart Contract marketplace where users can hire user-generated specialized AI agents via token escrow.</p>
          </div>
          
          <div className="relative pl-16">
            <div className="absolute left-6 w-4 h-4 rounded-full bg-violet-500 top-2"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Q4 2026: Swarm Protocols</h3>
            <p className="text-xl text-zinc-400">Introduce complex recursive task delegation spanning dozens of agents for large-scale enterprise execution.</p>
          </div>
          
          <div className="relative pl-16">
            <div className="absolute left-6 w-4 h-4 rounded-full bg-blue-500 top-2"></div>
            <h3 className="text-2xl font-bold text-white mb-2">2027+: Fully Autonomous DAOs</h3>
            <p className="text-xl text-zinc-400">Moving toward pure DAOs managed seamlessly by 24/7 specialized ExecuAI agents staking & transacting natively in HBAR/HTS.</p>
          </div>
        </div>
      )
    },
    {
      id: "slide-9",
      title: "Thank You",
      subtitle: "One Person. Unlimited Execution.",
      content: (
        <div className="flex flex-col h-full items-center justify-center text-center space-y-8">
          <div className="text-7xl mb-4">✨</div>
          <div className="text-4xl font-bold text-white">ExecuAI Team</div>
          <div className="text-2xl text-zinc-400">Hedera Hello Future Apex Hackathon</div>
          
          <div className="flex gap-6 mt-8">
            <a href="https://github.com/your-repo/execuai" className="px-6 py-3 rounded-full bg-white text-black font-semibold text-lg hover:bg-zinc-200 transition">
              View GitHub Repo
            </a>
            <a href="https://execuai-demo.vercel.app" className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-lg hover:bg-white/10 transition">
              Launch Web App
            </a>
          </div>
        </div>
      )
    }
  ];

  // ----------------------------------------------------
  // EXPORT LOGIC
  // ----------------------------------------------------
  
  const exportToPDF = async () => {
    if (!deckRef.current) return;
    setIsExporting(true);

    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Create A4 Landscape PDF (16:9 ratio matches perfectly: 297mm x 167mm)
      const pdf = new jsPDF("landscape", "px", [1920, 1080]);
      const slideNodes = deckRef.current.querySelectorAll(".pitch-slide");

      for (let i = 0; i < slideNodes.length; i++) {
        const slide = slideNodes[i] as HTMLElement;
        const canvas = await html2canvas(slide, {
          scale: 2,           // High res rendering
          useCORS: true,      // Handle external fonts/images if any
          backgroundColor: "#000000",
          width: 1920,
          height: 1080,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);

        if (i > 0) {
          pdf.addPage([1920, 1080], "landscape");
        }
        pdf.addImage(imgData, "JPEG", 0, 0, 1920, 1080);
      }

      pdf.save("ExecuAI_Pitch_Deck.pdf");
    } catch (error) {
      console.error("PDF Export failed", error);
      alert("Failed to export PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPPTX = async () => {
    if (!deckRef.current) return;
    setIsExporting(true);

    try {
      const pptxgen = (await import("pptxgenjs")).default;
      const html2canvas = (await import("html2canvas")).default;

      const pres = new pptxgen();
      pres.layout = "LAYOUT_16x9"; // W: 10, H: 5.625 inches roughly
      
      const slideNodes = deckRef.current.querySelectorAll(".pitch-slide");

      for (let i = 0; i < slideNodes.length; i++) {
        const slide = slideNodes[i] as HTMLElement;
        const canvas = await html2canvas(slide, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#000000",
          width: 1920,
          height: 1080,
        });

        // Add 100% full background image to PPTX slide to perfectly preserve DOM styling
        const base64 = canvas.toDataURL("image/png");
        const pptxSlide = pres.addSlide();
        pptxSlide.background = { data: base64 };
      }

      await pres.writeFile({ fileName: "ExecuAI_Pitch_Deck.pptx" });
    } catch (error) {
      console.error("PPTX Export failed", error);
      alert("Failed to export PPTX.");
    } finally {
      setIsExporting(false);
    }
  };

  // ----------------------------------------------------
  // RENDER
  // ----------------------------------------------------

  return (
    <div className="min-h-screen bg-black text-white p-8 pb-32 font-sans selection:bg-amber-500/30">
      
      {/* Header & Controls */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
            ExecuAI Pitch Deck
          </h1>
          <p className="text-zinc-400 mt-1">High-fidelity 16:9 presentation (Tailwind native)</p>
        </div>
        
        <div className="flex gap-4">
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isExporting ? <span className="animate-spin text-xl">⚪</span> : "📄"} 
            Download PDF
          </button>
          
          <button
            onClick={exportToPPTX}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isExporting ? <span className="animate-spin text-xl">⚪</span> : "📊"} 
            Download PPTX
          </button>
        </div>
      </div>

      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center p-8 rounded-2xl glass border border-white/10">
            <div className="text-4xl animate-bounce mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-2">Rendering Deck...</h2>
            <p className="text-zinc-400">Converting Tailwind CSS layouts exactly as they appear.</p>
          </div>
        </div>
      )}

      {/* Presentation Wrapper - Fixed 1920x1080 scaling container */}
      <div 
        className="max-w-7xl mx-auto space-y-12 drop-shadow-2xl"
        ref={deckRef}
      >
        {slides.map((slide, index) => (
          <div 
            key={slide.id}
            className="pitch-slide overflow-hidden relative border border-white/10 rounded-2xl mx-auto"
            style={{ 
              width: "1920px", 
              height: "1080px",
              // We use CSS transform to scale it down visually in the browser without losing the 1920x1080 exact pixel layout for html2canvas
              transform: "scale(0.65)",
              transformOrigin: "top center",
              marginBottom: "-378px", // Offset the height lost in scaling so they stack nicely
              background: "linear-gradient(135deg, #09090b 0%, #18181b 100%)",
            }}
          >
            {/* Background Decorators */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[150px] pointer-events-none"></div>

            <div className="relative z-10 w-full h-full flex flex-col p-24">
              
              {/* Slide Header */}
              {index > 0 && index < slides.length - 1 && (
                <div className="mb-16">
                  <h2 className="text-6xl font-bold text-white tracking-tight mb-4">
                    {slide.title}
                  </h2>
                  <h3 className="text-3xl text-zinc-400 font-medium">
                    {slide.subtitle}
                  </h3>
                  <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 mt-8 rounded-full"></div>
                </div>
              )}

              {/* Slide Content */}
              <div className="flex-grow">
                {slide.content}
              </div>

              {/* Footer Stamp */}
              {index > 0 && index < slides.length - 1 && (
                <div className="absolute bottom-12 left-24 right-24 flex justify-between items-center text-zinc-500 text-xl font-medium border-t border-white/10 pt-8">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-orange-500"></div>
                    ExecuAI
                  </div>
                  <div>Slide {index + 1}</div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
