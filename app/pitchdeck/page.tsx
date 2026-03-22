"use client";

import dynamic from "next/dynamic";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

// Dynamically import the viewer component with SSR disabled
const PitchDeckViewer = dynamic(
  () => import("@/components/PitchDeckViewer"),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-[50vh] flex flex-col items-center justify-center">
        <div className="text-4xl animate-bounce mb-4">🚀</div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Pitch Deck...</h2>
        <p className="text-zinc-400">Initializing high-fidelity rendering engine.</p>
      </div>
    )
  }
);

export default function PitchDeckPage() {
  return (
    <DashboardLayout>
       <PitchDeckViewer />
    </DashboardLayout>
  );
}
