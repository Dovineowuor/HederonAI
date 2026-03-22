"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Database, LayoutDashboard, Save, Loader2, Fingerprint, Mail, Key } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, any>>({
    auth_hedera_wallet: true,
    auth_email_password: true,
    auth_sso_auth0: true,
    integration_ipfs: true,
    integration_hedera_hcs: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load settings:", err);
        setIsLoading(false);
      });
  }, []);

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const Toggle = ({ title, description, icon: Icon, settingKey, badge }: any) => {
    const isActive = settings[settingKey];
    
    return (
      <div className="glass rounded-xl p-5 flex items-start sm:items-center justify-between gap-4 group hover:border-violet-500/30 transition-colors">
        <div className="flex items-start sm:items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${isActive ? 'bg-violet-500/20 border-violet-500/30 text-violet-400' : 'bg-white/5 border-white/10 text-zinc-500'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              {badge && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-zinc-300 px-2 py-0.5 rounded-full">
                  {badge}
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm">{description}</p>
          </div>
        </div>
        
        <button
          onClick={() => handleToggle(settingKey)}
          className={`relative shrink-0 w-12 h-6 rounded-full transition-colors duration-300 ${isActive ? 'bg-violet-500' : 'bg-zinc-700'}`}
        >
          <motion.div
            layout
            initial={false}
            animate={{ x: isActive ? 24 : 2 }}
            className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-md"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-20 md:pt-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">System Settings</h1>
              <p className="text-sm text-zinc-400 mt-1">Manage core integrations and authentication mechanisms.</p>
            </div>
            
            <button
              onClick={saveSettings}
              disabled={isSaving || isLoading}
              className="px-4 py-2 bg-white text-black rounded-lg font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
            </div>
          ) : (
            <div className="space-y-10">
              
              {/* Authentication Settings */}
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-violet-400" />
                  <h2 className="text-lg font-bold text-white">Authentication Providers</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Toggle 
                    title="Hedera Wallet Sign-In" 
                    description="Allow users to authenticate securely using their Hedera Account ID and signature."
                    icon={Fingerprint} 
                    settingKey="auth_hedera_wallet" 
                    badge="Web3"
                  />
                  <Toggle 
                    title="Auth0 SSO Integration" 
                    description="Enable enterprise Single Sign-On via Google, GitHub, and corporate directories."
                    icon={Key} 
                    settingKey="auth_sso_auth0" 
                    badge="OAuth"
                  />
                  <Toggle 
                    title="Direct Email/Password" 
                    description="Support traditional highly-secure PBKDF2 hashed local credentials."
                    icon={Mail} 
                    settingKey="auth_email_password" 
                  />
                </div>
              </section>

              {/* Infrastructure Settings */}
              <section>
                <div className="flex items-center gap-2 mb-4 mt-8">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-lg font-bold text-white">Infrastructure & Storage</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Toggle 
                    title="IPFS Immutable Storage" 
                    description="Auto-upload agent deliverables and workspace snapshots to the IPFS network."
                    icon={Database} 
                    settingKey="integration_ipfs" 
                    badge="Decentralized"
                  />
                  <Toggle 
                    title="Hedera Consensus Service" 
                    description="Log all marketplace escrow state changes to the Hedera public ledger."
                    icon={LayoutDashboard} 
                    settingKey="integration_hedera_hcs" 
                    badge="Audit Trail"
                  />
                </div>
              </section>

            </div>
          )}
          
        </div>
      </main>
    </div>
  );
}
