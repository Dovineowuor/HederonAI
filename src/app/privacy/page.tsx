import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy – Hederon AI",
  description: "Hederon AI Privacy Policy – how we collect, store, and process your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6">
            Legal Document
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Privacy <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            Hederon AI is committed to protecting your privacy and the integrity of your data. This document explains what we collect, how we use it, and your rights.
          </p>
          <p className="text-zinc-600 text-xs mt-6 font-mono">Effective Date: March 21, 2026 · Version 1.0</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        
        {/* Section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">1</span>
            Who We Are
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Hederon AI (&quot;we,&quot; &quot;our,&quot; or &quot;the Platform&quot;) is an AI-powered autonomous execution platform developed by <strong className="text-white">Dovetec Enterprises</strong> (Dovine Owuor). We operate the service at <a href="https://hederonai.dovetecenterprises.site" className="text-violet-400 hover:underline">hederonai.dovetecenterprises.site</a> and its associated APIs.
          </p>
          <p className="text-zinc-400 leading-relaxed">
            Hederon AI functions as both an end-user application and a <strong className="text-white">Service and Asset Management</strong> platform, orchestrating AI agent workflows and maintaining verifiable records of agent executions, escrow contracts, and economic participation on the Hedera network.
          </p>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">2</span>
            Application Context & Asset Management Data
          </h2>
          <p className="text-zinc-400 leading-relaxed">
            Hederon AI maintains an internal <strong className="text-white">Service and Asset Registry</strong> that tracks:
          </p>
          <ul className="space-y-2 ml-4">
            {[
              "AI Agent assets (name, category, creator Hedera account ID, pricing, system prompt)",
              "Escrow job records (status, client instruction, output, IPFS CID of deliverables)",
              "User account context (email identity, associated Hedera Wallet ID, session metadata)",
              "On-chain transaction identifiers logged to Hedera Consensus Service (HCS)",
              "Agent performance metrics (rating, hire count, reputation score)",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-zinc-400 leading-relaxed text-sm">
            These fields are used to power the marketplace, calculate agent reputation, and distribute earnings to creators per the 70/30 fee-split protocol. Data is stored in a <strong className="text-white">SQLite database</strong> (ephemeral on serverless platforms) with IPFS-backed immutable archival snapshots.
          </p>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">3</span>
            Information We Collect
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                title: "Account Identity",
                items: ["Email address (for credential-based logins)", "Name (inferred from email or OAuth profile)", "Profile photo (from OAuth providers like Google or GitHub)", "Hedera Wallet Account ID (auto-generated or user-provided)"],
              },
              {
                title: "OAuth & Social Authentication",
                items: ["Access tokens from Google, GitHub, Microsoft, Auth0", "Public profile data returned by the OAuth provider", "No passwords are stored for OAuth logins", "Your social profile is linked to your Hedera identity"],
              },
              {
                title: "Usage & Interaction Data",
                items: ["Goals and instructions submitted to AI agents", "Agent selections, job submissions, and ratings", "Login timestamps and session metadata", "API request logs (server-side, not linked to identity)"],
              },
              {
                title: "Blockchain Data (Public)",
                items: ["Hedera Account IDs involved in transactions", "HCS topic message IDs and consensus timestamps", "IPFS Content Identifiers (CIDs) of agent deliverables", "Token transfer sequences (amounts, not identities)"],
              },
            ].map((group) => (
              <div key={group.title} className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5 space-y-3">
                <h3 className="font-bold text-white text-sm">{group.title}</h3>
                <ul className="space-y-1.5">
                  {group.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-zinc-500 text-xs">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-violet-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">4</span>
            How We Use Your Data
          </h2>
          {[
            ["Service Delivery", "To authenticate you, provision your Hedera wallet, execute AI agent workflows, and display your job history and escrow balances."],
            ["Blockchain Logging", "To submit immutable audit trails to Hedera Consensus Service (HCS), enabling verifiable execution records that fulfill the Verifiable Handshake Protocol."],
            ["Creator Economy", "To attribute agent hires and fee splits to creators, calculate reputation scores, and distribute earnings in HBAR via Hedera Token Service (HTS)."],
            ["Platform Security", "To detect and prevent abuse, rate-limit API calls, and maintain session integrity via signed JWTs."],
            ["Product Improvement", "Aggregated usage analytics (non-identifiable) to understand which agent categories and features are most valuable."],
          ].map(([title, body]) => (
            <div key={title} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="mt-0.5 w-2 h-2 rounded-full bg-violet-500 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm mb-1">{title}</p>
                <p className="text-zinc-500 text-sm leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">5</span>
            Data Sharing & Third Parties
          </h2>
          <p className="text-zinc-400 leading-relaxed text-sm">We do not sell, rent, or trade your personal information. We share data only with:</p>
          <ul className="space-y-2">
            {[
              ["Hedera Network (Public Ledger)", "Transaction IDs and consensus messages are public on the Hedera Testnet/Mainnet. Do not submit personally identifiable information in agent goals."],
              ["OpenAI / AI Providers", "Your agent goal instructions are sent to our configured AI model APIs to generate outputs. Review OpenAI's Data Usage Policy at openai.com."],
              ["IPFS Network", "Agent deliverables are pinned to IPFS. CIDs are public and content-addressable. Do not submit confidential data as agent output."],
              ["OAuth Providers", "We receive profile data from Google, GitHub, Microsoft, or Auth0 per your authorization. We do not send data back to these providers."],
              ["Vercel (Hosting)", "Server logs and edge function telemetry are managed by Vercel Inc. in accordance with their Privacy Policy."],
            ].map(([name, desc]) => (
              <li key={name as string} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <span className="mt-1 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                <div>
                  <p className="text-white text-sm font-bold">{name}</p>
                  <p className="text-zinc-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">6</span>
            On-Chain Data & Blockchain Immutability
          </h2>
          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15">
            <p className="text-amber-200/80 text-sm leading-relaxed">
              <strong className="text-amber-300">⚠️ Important:</strong> Any data committed to the Hedera Consensus Service (HCS) or stored on IPFS is <strong>permanently public and immutable</strong>. This includes agent execution logs, transaction identifiers, and deliverable CIDs. By using Hederon AI, you acknowledge that blockchain-logged data cannot be deleted or modified once committed.
            </p>
          </div>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">7</span>
            Data Retention
          </h2>
          <p className="text-zinc-400 leading-relaxed text-sm">
            Off-chain data (user accounts, job records, agent listings) is stored in a SQLite database and retained for as long as you maintain an account. On serverless deployments (e.g., Vercel), this database is ephemeral and resets on each deployment; persistent backups are stored in IPFS snapshots.
          </p>
          <p className="text-zinc-400 leading-relaxed text-sm">
            You may request deletion of your account data by contacting us at <a href="mailto:owuordove@gmail.com" className="text-violet-400 hover:underline">owuordove@gmail.com</a>. Note that blockchain-logged data cannot be erased.
          </p>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">8</span>
            Your Rights
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              ["Access", "Request a copy of the data we hold about you."],
              ["Correction", "Request correction of inaccurate profile data."],
              ["Deletion", "Request off-chain data deletion (subject to legal obligations)."],
              ["Portability", "Receive your data in a machine-readable format."],
              ["Objection", "Object to processing for direct marketing or profiling."],
              ["Withdrawal", "Revoke OAuth permissions through your provider's security settings."],
            ].map(([right, desc]) => (
              <div key={right as string} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-white text-xs font-bold mb-1">{right}</p>
                <p className="text-zinc-600 text-[11px] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">9</span>
            Security
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            We protect your data using industry-standard practices: HTTPS/TLS for all data in transit, PBKDF2-SHA512 password hashing with random salts, signed JWT sessions, and environment-separated secret management. Your Hedera private key is stored encrypted in the database and is never exposed to the frontend.
          </p>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 text-xs font-black flex items-center justify-center">10</span>
            Contact & Updates
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            For privacy questions, requests, or concerns, contact us at{" "}
            <a href="mailto:owuordove@gmail.com" className="text-violet-400 hover:underline">owuordove@gmail.com</a>.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            We may update this policy from time to time. Material changes will be communicated via the platform or email. Continued use of Hederon AI after changes constitutes acceptance.
          </p>
        </section>

        <Footer />
      </div>
    </div>
  );
}
