import type { Metadata } from "next";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service – Hederon AI",
  description: "Hederon AI Terms of Service – rules, obligations, and intellectual property rights.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <div className="relative border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
            Legal Document
          </span>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Terms of <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Service</span>
          </h1>
          <p className="text-zinc-400 text-base max-w-xl mx-auto leading-relaxed">
            By accessing or using Hederon AI, you agree to be bound by these Terms. Please read them carefully.
          </p>
          <p className="text-zinc-600 text-xs mt-6 font-mono">Effective Date: March 21, 2026 · Version 1.0</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-12">

        <section className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15">
          <p className="text-amber-200/80 text-sm leading-relaxed">
            <strong className="text-amber-300">⚠️ Important Notice:</strong> Hederon AI is currently operating on the <strong>Hedera Testnet</strong> for the purposes of the Hedera Hello Future Hackathon. All transactions, escrow balances, and HBAR amounts are testnet-only and hold no real monetary value at this stage.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">1</span>
            Acceptance of Terms
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            By creating an account or accessing the Hederon AI platform (&quot;Platform,&quot; &quot;Service&quot;), you agree to these Terms of Service (&quot;Terms&quot;) and our <a href="/privacy" className="text-violet-400 hover:underline">Privacy Policy</a>. If you do not agree, do not use the Service.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            These Terms constitute a legally binding agreement between you and Dovetec Enterprises (Dovine Owuor). We reserve the right to update these Terms at any time. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">2</span>
            Description of Service
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Hederon AI provides:
          </p>
          <ul className="space-y-2">
            {[
              "An AI multi-agent execution platform that transforms user goals into structured deliverables.",
              "An Agent Marketplace where creators can list proprietary AI Agents and earn HBAR-denominated fees.",
              "An escrow-based contract system managed through Hedera Token Service (HTS) and Smart Contracts.",
              "Verifiable audit logs of all agent actions submitted to Hedera Consensus Service (HCS).",
              "Decentralized archival of deliverables via IPFS.",
              "Automatic provisioning of Hedera Testnet wallets for new email and OAuth users.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">3</span>
            User Accounts & Hedera Wallet
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            When you sign up via email, Hederon AI will automatically provision a unique Hedera Testnet account funded with a small amount of test HBAR. You acknowledge that:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ["Key Custody", "Your auto-generated private key is held by the platform on your behalf. You are responsible for backing it up if you connect it to a hardware wallet."],
              ["Testnet Only", "All wallets provisioned are on Hedera Testnet. Test HBAR has no monetary value."],
              ["Account Security", "You are responsible for maintaining the confidentiality of your login credentials and must notify us immediately of any unauthorized access."],
              ["Accurate Information", "You agree to provide accurate registration details. False identity information may result in account termination."],
            ].map(([title, body]) => (
              <div key={title as string} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <p className="text-white text-xs font-bold mb-1">{title}</p>
                <p className="text-zinc-500 text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">4</span>
            Creator Economy & Fee Split
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Hederon AI operates a decentralized <strong className="text-white">Agent Creator Economy</strong> governed by the following rules:
          </p>
          {[
            ["70/30 Split", "When a user hires an agent, 70% of the HBAR fee is credited to the agent creator and 30% is retained by the platform as a service fee."],
            ["Agent Listing", "By listing an agent on the marketplace, you grant Hederon AI a non-exclusive license to display, market, and execute your agent on behalf of users."],
            ["Agent Content", "You retain full intellectual property rights to your agent's system prompt and proprietary logic."],
            ["Prohibited Agents", "You may not list agents designed to generate harmful, deceptive, illegal, or malicious content. Violations will result in immediate removal and potential account termination."],
          ].map(([title, body]) => (
            <div key={title as string} className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="mt-0.5 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
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
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">5</span>
            Acceptable Use Policy
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">You agree <strong className="text-white">NOT</strong> to use the Service to:</p>
          <ul className="space-y-2">
            {[
              "Generate, distribute, or solicit illegal, harmful, abusive, harassing, defamatory, or discriminatory content.",
              "Attempt unauthorized access to other users' accounts, the platform's database, or Hedera network nodes.",
              "Submit malicious instructions to AI agents in an attempt to exfiltrate data or bypass safety mechanisms.",
              "Exploit the HBAR escrow system for financial manipulation, wash trading, or money laundering.",
              "Reverse-engineer, decompile, or scrape the platform without our written consent.",
              "Misrepresent your identity or affiliation when creating agents or submitting work.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-400 text-sm">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-rose-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">6</span>
            Intellectual Property
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            The Hederon AI platform, its UI, branding, agent orchestration logic, and codebase are owned by Dovetec Enterprises and licensed under the <strong className="text-white">MIT License</strong> where the source code is publicly available. You are free to fork, modify, and deploy your own instance in accordance with the license.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Content you submit as agent instructions or deliverables remains yours. By submitting to IPFS, you grant a worldwide, royalty-free license to the IPFS network to store and serve that content.
          </p>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">7</span>
            Disclaimer of Warranties
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            AI-generated outputs may be inaccurate, incomplete, or biased. Hederon AI does not guarantee the accuracy or fitness of any agent output for any purpose. Always review AI deliverables before acting on them.
          </p>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">8</span>
            Limitation of Liability
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, DOVETEC ENTERPRISES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF DATA, LOSS OF PROFITS, OR ANY BLOCKCHAIN TRANSACTION FAILURES, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
          </p>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">9</span>
            Governing Law & Dispute Resolution
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of Kenya. Any disputes shall first be attempted to be resolved through good-faith negotiation. If unresolved, disputes shall be submitted to binding arbitration under the Nairobi Centre for International Arbitration rules.
          </p>
        </section>

        <hr className="border-white/5" />

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-black flex items-center justify-center">10</span>
            Contact
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            For questions regarding these Terms, contact us at{" "}
            <a href="mailto:owuordove@gmail.com" className="text-violet-400 hover:underline">owuordove@gmail.com</a> or via our{" "}
            <a href="https://github.com/Dovineowuor/HederonAI" className="text-violet-400 hover:underline">GitHub repository</a>.
          </p>
        </section>

        <Footer />
      </div>
    </div>
  );
}
