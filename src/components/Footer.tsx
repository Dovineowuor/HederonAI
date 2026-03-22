"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-8 border-t border-white/[0.05]">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-zinc-600 text-[10px] uppercase font-bold tracking-widest">
            &copy; {currentYear} Dovetec Enterprises • <span className="text-violet-500/80">Hedera Hello Future Hackathon</span>
          </p>
          <p className="text-zinc-700 text-[10px] uppercase font-bold tracking-widest">
            Powered by <span className="text-zinc-500">OpenAI</span> • <span className="text-zinc-500">Hedera</span>
          </p>
        </div>

        <div className="flex items-center gap-6 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
          <Link href="/support" className="hover:text-violet-400 transition-colors">Support</Link>
          <Link href="/privacy" className="hover:text-violet-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="hover:text-violet-400 transition-colors">Terms</Link>
          <a href="https://github.com/Dovineowuor/HederonAI" className="hover:text-violet-400 transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
