"use client";

import dynamic from "next/dynamic";

// Dynamically import the viewer component with SSR disabled
// This prevents Next.js from trying to build browser-only libraries like jsPDF and html2canvas on the server.
const PitchDeckViewer = dynamic(
  () => import("@/components/PitchDeckViewer"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="text-4xl animate-bounce mb-4">🚀</div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Pitch Deck...</h2>
        <p className="text-zinc-400">Initializing high-fidelity rendering engine.</p>
      </div>
    )
  }
);

export default function PitchDeckPage() {
  return <PitchDeckViewer />;
}
