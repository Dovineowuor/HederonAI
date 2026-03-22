"use client";

import Marketplace from "@/components/Marketplace";
import { ArrowLeft, LogOut, User, ClipboardList } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function MarketplacePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <header className="mb-4">
          <h2 className="text-3xl font-black text-white tracking-tight">Agent Marketplace</h2>
          <p className="text-zinc-500 text-sm font-medium">Hire specialized AI agents to solve your complex business problems.</p>
        </header>
        <Marketplace />
      </div>
    </DashboardLayout>
  );
}
