"use client";

import React, { useRef, useState } from "react";

export default function PitchDeckViewer() {
  const [isExporting, setIsExporting] = useState(false);
  const deckRef = useRef<HTMLDivElement>(null);

  // HEX Constants to ensure html2canvas compatibility
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
    orangeLight: "#fb923c",
  };

  const slides = [
    {
      id: "slide-1",
      title: "Hederon AI\nYour AI Executive Team",
      subtitle: "One Person. Unlimited Execution. Powered by Hedera.",
      content: (
        <div className="flex flex-col h-full items-center justify-center text-center space-y-8">
          <div className="flex justify-center mb-4">
            <img src="/logo_ilustrated.png" alt="Hederon AI" className="h-40 object-contain drop-shadow-2xl" />
          </div>
          <div 
            className="text-8xl font-extrabold mb-4 drop-shadow-2xl font-sans"
            style={{ 
              background: `linear-gradient(to right, ${COLORS.blueLight}, ${COLORS.violet}, ${COLORS.emeraldLight})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              color: "transparent"
            }}
          >
            Hederon AI
          </div>
          <div 
            className="text-3xl max-w-3xl font-medium leading-relaxed py-4 px-8 rounded-2xl border font-sans"
            style={{ 
              color: COLORS.zinc200,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "rgba(255, 255, 255, 0.1)"
            }}
          >
            Automating the entire SDLC with a coordinated swarm of AI agents.
          </div>
          <div className="mt-12 flex gap-6">
            <div 
              className="px-6 py-3 rounded-xl border text-sm font-bold uppercase tracking-widest font-sans"
              style={{ 
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                borderColor: "rgba(59, 130, 246, 0.2)",
                color: COLORS.blueLight
              }}
            >
              AI & Agents Track
            </div>
            <div 
              className="px-6 py-3 rounded-xl border text-sm font-bold uppercase tracking-widest font-sans"
              style={{ 
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "rgba(16, 185, 129, 0.2)",
                color: COLORS.emeraldLight
              }}
            >
              Hello Future Apex 2026
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-2",
      title: "The Visionary",
      subtitle: "Meet the Founder",
      content: (
        <div className="flex flex-col justify-center h-full space-y-12">
          <div 
            className="flex items-center gap-12 p-12 rounded-[40px] border backdrop-blur-md shadow-2xl"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
          >
            <div 
              className="w-48 h-48 rounded-3xl flex items-center justify-center text-7xl shadow-inner border"
              style={{ 
                background: `linear-gradient(to bottom right, ${COLORS.blue}, ${COLORS.violetDark})`,
                borderColor: "rgba(255, 255, 255, 0.2)"
              }}
            >
              👨‍💻
            </div>
            <div className="flex-grow">
              <h3 className="text-6xl font-bold mb-4 tracking-tight font-sans" style={{ color: "white" }}>Dovine Owuor</h3>
              <p className="text-3xl font-semibold mb-8 font-sans" style={{ color: COLORS.blueLight }}>Founder & Lead Software Engineer</p>
              <div className="grid grid-cols-3 gap-4">
                 {["AI Orchestration", "Web3 Architect", "Full-Stack Dev"].map(tag => (
                   <span 
                    key={tag} 
                    className="px-4 py-2 rounded-xl border text-lg text-center font-medium font-sans"
                    style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)", color: COLORS.zinc400 }}
                   >
                     {tag}
                   </span>
                 ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-8">
            <div 
              className="p-8 rounded-3xl border font-sans"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div className="font-extrabold text-2xl mb-4 flex items-center gap-3 font-sans" style={{ color: COLORS.blueLight }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "rgba(59, 130, 246, 0.2)" }}>🛠️</span>
                Core Expertise
              </div>
              <ul className="space-y-4 text-xl font-sans" style={{ color: COLORS.zinc300 }}>
                <li className="flex items-start gap-3"><span style={{ color: COLORS.blue }}>▹</span> Modern Web (Next.js 16, React 19)</li>
                <li className="flex items-start gap-3"><span style={{ color: COLORS.blue }}>▹</span> Decentralized Apps & Hedera SDK</li>
                <li className="flex items-start gap-3"><span style={{ color: COLORS.blue }}>▹</span> Autonomous Multi-Agent Swarms</li>
              </ul>
            </div>
            <div 
              className="p-8 rounded-3xl border font-sans"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div className="font-extrabold text-2xl mb-4 flex items-center gap-3 font-sans" style={{ color: COLORS.emeraldLight }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}>🏆</span>
                Breakthroughs
              </div>
              <ul className="space-y-4 text-xl font-sans" style={{ color: COLORS.zinc300 }}>
                <li className="flex items-start gap-3"><span style={{ color: COLORS.emerald }}>▹</span> Verifiable AI Decision Ledgers</li>
                <li className="flex items-start gap-3"><span style={{ color: COLORS.emerald }}>▹</span> Integrated AI Micro-Economics</li>
                <li className="flex items-start gap-3"><span style={{ color: COLORS.emerald }}>▹</span> IPFS-Backed Deliverable Vaults</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-3",
      title: "The Core Problem",
      subtitle: "The Scalability Wall",
      content: (
        <div className="flex flex-col justify-center h-full space-y-12">
          <div 
            className="text-4xl font-medium leading-relaxed border-l-8 pl-10 py-8 rounded-r-3xl font-sans"
            style={{ 
              color: COLORS.zinc300, 
              borderColor: COLORS.rose,
              background: `linear-gradient(to right, rgba(244, 63, 94, 0.1), transparent)`
            }}
          >
            Solo founders and lean teams are crushed by the need to play CEO, Strategist, Marketer, and Engineer simultaneously.
          </div>
          <div className="grid grid-cols-3 gap-8">
            {[
              { icon: "📉", title: "Efficiency Loss", desc: "Constant context switching kills deep work." },
              { icon: "💸", title: "High Overhead", desc: "Hiring experts is slow and expensive for startups." },
              { icon: "🤖", title: "Chatbot Fatigue", desc: "GenAI wrappers require constant 'babysitting'." }
            ].map(item => (
              <div 
                key={item.title} 
                className="p-8 rounded-3xl border flex flex-col items-center text-center font-sans"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.4)", borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <div className="text-6xl mb-6">{item.icon}</div>
                <div className="text-2xl font-bold mb-4 font-sans" style={{ color: "white" }}>{item.title}</div>
                <div className="text-lg font-sans" style={{ color: COLORS.zinc400 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: "slide-4",
      title: "Hedera Integration",
      subtitle: "The Immutable AI Ledger",
      content: (
        <div className="flex flex-col justify-center h-full space-y-10">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-8">
              <div 
                className="flex items-start gap-6 p-8 rounded-3xl border font-sans"
                style={{ backgroundColor: "rgba(245, 158, 11, 0.05)", borderColor: "rgba(245, 158, 11, 0.2)" }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold font-sans" style={{ backgroundColor: "rgba(245, 158, 11, 0.2)", color: COLORS.amberLight }}>HCS</div>
                <div>
                  <h4 className="text-2xl font-bold mb-2 font-sans" style={{ color: "white" }}>Consensus Service</h4>
                  <p className="text-lg font-sans" style={{ color: COLORS.zinc400 }}>Every agent decision and execution state is hashed and logged immutably on-chain for total transparency.</p>
                </div>
              </div>
              <div 
                className="flex items-start gap-6 p-8 rounded-3xl border font-sans"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.05)", borderColor: "rgba(59, 130, 246, 0.2)" }}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold font-sans" style={{ backgroundColor: "rgba(59, 130, 246, 0.2)", color: COLORS.blueLight }}>HTS</div>
                <div>
                  <h4 className="text-2xl font-bold mb-2 font-sans" style={{ color: "white" }}>Token Service</h4>
                  <p className="text-lg font-sans" style={{ color: COLORS.zinc400 }}>Simulating autonomous agent economies where specialized entities hire and pay each other using native Hedera tokens.</p>
                </div>
              </div>
            </div>
            <div 
              className="relative rounded-3xl overflow-hidden border flex items-center justify-center font-sans"
              style={{ backgroundColor: COLORS.zinc900, borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div 
                className="absolute inset-0 opacity-50"
                style={{ background: `linear-gradient(to bottom right, rgba(245, 158, 11, 0.1), rgba(59, 130, 246, 0.1))` }}
              ></div>
              <div className="p-12 text-center relative z-10">
                <div className="text-5xl font-mono text-zinc-500 mb-6 uppercase tracking-tighter" style={{ color: COLORS.zinc500 }}>Transaction Verified</div>
                <div className="text-6xl font-bold mb-4 tracking-tight leading-none font-sans" style={{ color: COLORS.amber }}>0.0.8288373</div>
                <div className="text-xl font-medium font-sans" style={{ color: COLORS.zinc400 }}>Consensus Topic ID</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-5",
      title: "The Multi-Agent Swarm",
      subtitle: "Coordinated Intelligence",
      content: (
        <div className="flex flex-col justify-center h-full space-y-12">
          <div 
            className="flex justify-between items-center p-10 rounded-3xl border font-sans"
            style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
          >
             {[
               { role: "CEO", icon: "🏢", color: COLORS.blue },
               { role: "Strategy", icon: "🧬", color: COLORS.violet },
               { role: "Marketing", icon: "📣", color: COLORS.emerald },
               { role: "Operations", icon: "⚙️", color: COLORS.amber }
             ].map((agent, i) => (
               <React.Fragment key={agent.role}>
                 <div className="flex flex-col items-center gap-4">
                   <div 
                    className="w-24 h-24 rounded-2xl border flex items-center justify-center text-4xl shadow-lg" 
                    style={{ borderColor: agent.color, backgroundColor: `${agent.color}20` }}
                   >
                     {agent.icon}
                   </div>
                   <div className="text-xl font-bold font-sans" style={{ color: "white" }}>{agent.role}</div>
                 </div>
                 {i < 3 && <div className="text-4xl font-thin font-sans" style={{ color: COLORS.zinc700 }}>👉</div>}
               </React.Fragment>
             ))}
          </div>
          <div className="text-center text-3xl font-medium italic font-sans" style={{ color: COLORS.zinc300 }}>
            "One high-level goal triggers an entire department of specialized minds working in parallel."
          </div>
        </div>
      )
    },
    {
      id: "slide-6",
      title: "SDLC Automation",
      subtitle: "The 5-Document Suite",
      content: (
        <div className="flex flex-col justify-center h-full space-y-10">
          <div className="grid grid-cols-5 gap-6">
            {[
              { title: "PRD", icon: "📄", desc: "Reqs" },
              { title: "Arch", icon: "🏗️", desc: "Design" },
              { title: "BOM", icon: "📦", desc: "Resources" },
              { title: "QA", icon: "🧪", desc: "Tests" },
              { title: "Code", icon: "💻", desc: "Logic" }
            ].map(doc => (
              <div 
                key={doc.title} 
                className="p-6 rounded-2xl border flex flex-col items-center text-center font-sans"
                style={{ backgroundColor: "rgba(24, 24, 27, 0.5)", borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <div className="text-5xl mb-4">{doc.icon}</div>
                <div className="text-xl font-extrabold mb-2 font-sans" style={{ color: "white" }}>{doc.title}</div>
                <div className="text-sm font-medium uppercase tracking-widest font-sans" style={{ color: COLORS.zinc500 }}>{doc.desc}</div>
              </div>
            ))}
          </div>
          <div 
            className="p-8 rounded-3xl border text-center font-sans"
            style={{ backgroundColor: "rgba(16, 185, 129, 0.05)", borderColor: "rgba(16, 185, 129, 0.2)" }}
          >
            <span className="text-2xl font-bold font-sans" style={{ color: COLORS.emeraldLight }}>Project Bundling:</span>
            <span className="text-2xl ml-3 font-sans" style={{ color: COLORS.zinc100 }}>Automated generation of functional project bundles pinned to IPFS and linked via Hedera.</span>
          </div>
        </div>
      )
    },
    {
      id: "slide-7",
      title: "Data Persistence",
      subtitle: "Permanent Agent Memory",
      content: (
        <div className="flex flex-col justify-center h-full space-y-12">
          <div className="grid grid-cols-2 gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <h4 className="text-4xl font-bold font-sans" style={{ color: COLORS.blueLight }}>Decentralized Vaults</h4>
              <p className="text-2xl leading-relaxed font-sans" style={{ color: COLORS.zinc300 }}>
                By combining **SQLite persistence** with **IPFS backup**, Hederon AI ensures that agent-generated intelligence is never lost and always verifiable.
              </p>
            </div>
            <div 
              className="p-10 rounded-[40px] border flex flex-col items-center justify-center space-y-8 font-sans"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.6)", borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div className="text-8xl">🧊</div>
              <div className="text-center">
                <div className="text-3xl font-mono font-bold break-all px-4" style={{ color: COLORS.emerald }}>QmRXhlY3VBSV9qb2...</div>
                <div className="mt-4 text-lg uppercase font-black tracking-[0.2em] font-sans" style={{ color: COLORS.zinc500 }}>IPFS CID</div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-8",
      title: "Roadmap 2026",
      subtitle: "The Road to Autonomy",
      content: (
        <div className="flex flex-col justify-center h-full space-y-12">
           <div className="relative">
             <div className="absolute left-0 top-1/2 w-full h-1 -translate-y-1/2" style={{ backgroundColor: COLORS.zinc800 }}></div>
             <div className="grid grid-cols-4 gap-8 relative z-10">
               {[
                 { q: "Q2 2026", task: "Mainnet Launch", status: "Focus" },
                 { q: "Q3 2026", task: "Agent Marketplace", status: "Scale" },
                 { q: "Q4 2026", task: "HCS Voting", status: "Governance" },
                 { q: "2027+", task: "DAOs", status: "Finality" }
               ].map(item => (
                 <div key={item.q} className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded-full border-4 mb-6" 
                      style={{ backgroundColor: COLORS.blue, borderColor: "black", boxShadow: `0 0 20px rgba(59, 130, 246, 0.5)` }}
                    ></div>
                    <div className="text-2xl font-black mb-2 font-sans" style={{ color: "white" }}>{item.q}</div>
                    <div className="text-xl font-bold mb-1 font-sans" style={{ color: COLORS.blueLight }}>{item.task}</div>
                    <div className="text-sm font-medium uppercase tracking-widest font-sans" style={{ color: COLORS.zinc500 }}>{item.status}</div>
                 </div>
               ))}
             </div>
           </div>
        </div>
      )
    },
    {
      id: "slide-9",
      title: "Market Opportunity",
      subtitle: "Building the AI Economy",
      content: (
        <div className="flex flex-col justify-center h-full space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <div 
              className="p-10 rounded-3xl border font-sans"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div className="text-5xl font-bold mb-6 tracking-tight font-sans" style={{ color: "white" }}>$53B</div>
              <div className="text-2xl font-bold mb-4 font-sans" style={{ color: COLORS.blueLight }}>AI Agent Market (2030)</div>
              <p className="text-xl leading-relaxed font-sans" style={{ color: COLORS.zinc400 }}>The shift from "AI Tools" to "AI Employees" is the largest economic transition in history.</p>
            </div>
            <div 
              className="p-10 rounded-3xl border font-sans"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <div className="text-5xl font-bold mb-6 tracking-tight font-sans" style={{ color: "white" }}>Zero-Cost</div>
              <div className="text-2xl font-bold mb-4 font-sans" style={{ color: COLORS.emeraldLight }}>Scalability Advantage</div>
              <p className="text-xl leading-relaxed font-sans" style={{ color: COLORS.zinc400 }}>Hedera's low fees enable high-frequency agent-to-agent transactions that are impossible on other chains.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "slide-10",
      title: "One Goal.",
      subtitle: "Unlimited Potential",
      content: (
        <div className="flex flex-col h-full items-center justify-center text-center space-y-10">
          <div 
            className="w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-6xl shadow-2xl animate-pulse"
            style={{ background: `linear-gradient(to bottom right, ${COLORS.blue}, ${COLORS.emerald})` }}
          >
            🚀
          </div>
          <h2 className="text-7xl font-black tracking-tighter font-sans" style={{ color: "white" }}>Ready to Swarm.</h2>
          <div className="flex gap-8">
            <a
              href="/"
              className="px-12 py-5 rounded-2xl text-2xl font-bold hover:scale-105 transition-transform font-sans"
              style={{ backgroundColor: "white", color: "black" }}
            >
              Start Your Swarm
            </a>
            <a
              href="https://github.com/DovineOwuor"
              target="_blank"
              rel="noopener noreferrer"
              className="px-12 py-5 rounded-2xl border text-2xl font-bold hover:bg-white/10 transition-colors font-sans"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.05)", borderColor: "rgba(255, 255, 255, 0.1)", color: "white" }}
            >
              View Repository
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
      const { toPng } = await import("html-to-image");
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF("landscape", "px", [1920, 1080]);
      const slideNodes = deckRef.current.querySelectorAll(".pitch-slide");

      for (let i = 0; i < slideNodes.length; i++) {
        const slide = slideNodes[i] as HTMLElement;
        const dataUrl = await toPng(slide, {
          width: 1920,
          height: 1080,
          style: {
            transform: "none",
            transformOrigin: "top left",
            margin: "0",
          },
          pixelRatio: 1,
        });

        if (i > 0) {
          pdf.addPage([1920, 1080], "landscape");
        }
        pdf.addImage(dataUrl, "PNG", 0, 0, 1920, 1080);
      }

      pdf.save("Hederon_AI_Pitch_Deck.pdf");
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
      const { toPng } = await import("html-to-image");

      const pres = new pptxgen();
      pres.layout = "LAYOUT_16x9";

      const slideNodes = deckRef.current.querySelectorAll(".pitch-slide");

      for (let i = 0; i < slideNodes.length; i++) {
        const slide = slideNodes[i] as HTMLElement;
        const dataUrl = await toPng(slide, {
          width: 1920,
          height: 1080,
          style: {
            transform: "none",
            transformOrigin: "top left",
            margin: "0",
          },
          pixelRatio: 1,
        });

        const pptxSlide = pres.addSlide();
        pptxSlide.background = { data: dataUrl };
      }

      await pres.writeFile({ fileName: "Hederon_AI_Pitch_Deck.pptx" });
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
  
  const [isMaximized, setIsMaximized] = useState(false);

  // The actual slides rendered function to reuse inside and outside modal
  const renderSlides = () => (
    <div
      className={`max-w-7xl mx-auto space-y-12 drop-shadow-2xl ${isMaximized ? "pb-32" : ""}`}
      ref={deckRef}
      onClick={() => !isMaximized && setIsMaximized(true)}
      style={{ cursor: isMaximized ? "default" : "zoom-in" }}
    >
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className="pitch-slide overflow-hidden relative border border-white/10 rounded-2xl mx-auto transition-transform hover:border-white/20"
          style={{
            width: "1920px",
            height: "1080px",
            transform: "scale(0.65)",
            transformOrigin: "top center",
            marginBottom: "-378px", 
            background: COLORS.zinc900,
          }}
        >
          {/* Background Decorators - Using fixed radial gradients */}
          <div 
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] pointer-events-none"
            style={{ background: "rgba(59, 130, 246, 0.1)" }}
          ></div>
          <div 
            className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] pointer-events-none"
            style={{ background: "rgba(245, 158, 11, 0.1)" }}
          ></div>

          <div className="relative z-10 w-full h-full flex flex-col p-24">

            {/* Slide Header */}
            {index > 0 && index < slides.length - 1 && (
              <div className="mb-16">
                <h2 className="text-6xl font-bold tracking-tight mb-4 font-sans" style={{ color: "white" }}>
                  {slide.title}
                </h2>
                <h3 className="text-3xl font-medium font-sans" style={{ color: COLORS.zinc400 }}>
                  {slide.subtitle}
                </h3>
                <div className="w-24 h-1.5 mt-8 rounded-full" style={{ background: `linear-gradient(to right, ${COLORS.amber}, ${COLORS.orange})` }}></div>
              </div>
            )}

            {/* Slide Content */}
            <div className="flex-grow">
              {slide.content}
            </div>

            {/* Slide Footer */}
            <div className="mt-auto flex justify-between items-center font-mono text-lg" style={{ color: COLORS.zinc500 }}>
              <div className="flex items-center gap-4">
                <img src="/logo_monochrome.png" alt="Hederon AI" className="h-6 opacity-60" />
                <span className="font-bold" style={{ color: "rgba(245, 158, 11, 0.5)" }}>HEDERON AI</span>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS.zinc800 }}></span>
                <span>CONFIDENTIAL</span>
              </div>
              <div>SLIDE {index + 1} / {slides.length}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8 pb-32 font-sans selection:bg-amber-500/30">

      {/* Header & Controls */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-10 gap-6 relative z-10">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500 font-sans">
            Hederon AI Pitch Deck
          </h1>
          <p className="text-zinc-400 mt-1 font-sans">High-fidelity 16:9 presentation (Export Optimized)</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setIsMaximized(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition font-medium font-sans"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
            Fullscreen
          </button>
          
          <button
            onClick={exportToPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium font-sans"
          >
            {isExporting ? <span className="animate-spin text-xl">⚪</span> : "📄"}
            Export PDF
          </button>
        </div>
      </div>

      {isExporting && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="text-center p-8 rounded-2xl glass border border-white/10">
            <div className="text-4xl animate-bounce mb-4">🚀</div>
            <h2 className="text-2xl font-bold text-white mb-2 font-sans">Rendering Deck...</h2>
            <p className="text-zinc-400 font-sans">Converting styles to standard RGB/HEX for full compatibility.</p>
          </div>
        </div>
      )}

      {/* Slide deck: scale-down on desktop, horizontal scroll on mobile */}
      {!isMaximized && (
        <p className="text-zinc-600 text-xs text-center mb-4 sm:hidden">👆 Tap deck to fullscreen • scroll to browse</p>
      )}
      {!isMaximized && renderSlides()}

      {/* Fullscreen Modal View */}
      {isMaximized && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl overflow-y-auto w-screen h-screen">
           <div className="sticky top-0 z-[110] p-6 flex justify-end bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
             <button 
               onClick={() => setIsMaximized(false)}
               className="pointer-events-auto flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full border border-white/20 transition-all shadow-2xl backdrop-blur-md"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
               Minimize
             </button>
           </div>
           
           <div className="pt-4 pb-32 animate-in fade-in zoom-in-95 duration-300">
             {renderSlides()}
           </div>
        </div>
      )}

    </div>
  );
}
