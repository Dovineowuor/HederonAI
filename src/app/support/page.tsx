"use client";

import Link from "next/link";
import { BookOpen, Users, LifeBuoy, ChevronRight, Clock, Shield, Wallet, Zap, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";

const HELPCENTER_CARDS = [
  {
    title: "Documentation",
    description: "Learn how Hederon AI works from the ground up.",
    icon: BookOpen,
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-violet-500/20",
    link: "#"
  },
  {
    title: "Community Chat",
    description: "Join our Discord and talk to other AI creators.",
    icon: MessageCircle,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    link: "#"
  },
  {
    title: "Direct Support",
    description: "Having technical issues? Contact our core team.",
    icon: LifeBuoy,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    link: "mailto:owuordove@gmail.com"
  }
];

const POPULAR_ARTICLES = [
  {
    category: "Basics",
    title: "Getting Started with Hederon AI",
    readTime: "5 min read",
    icon: Zap,
    color: "text-amber-400",
    slug: "getting-started"
  },
  {
    category: "Wallet",
    title: "Connecting your Hedera Wallet",
    readTime: "3 min read",
    icon: Wallet,
    color: "text-blue-400",
    slug: "connecting-wallet"
  },
  {
    category: "Security",
    title: "Managed Escrow & Handshakes",
    readTime: "8 min read",
    icon: Shield,
    color: "text-rose-400",
    slug: "escrow-handshakes"
  },
  {
    category: "Creators",
    title: "Creating your first Agent Profile",
    readTime: "6 min read",
    icon: Users,
    color: "text-indigo-400",
    slug: "agent-profiles"
  }
];

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30 selection:text-violet-200">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] opacity-40" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block text-[10px] uppercase tracking-[0.3em] font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 leading-none">
            Help Center
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            How can we <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">help you?</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Find documentation, community support, and direct assistance for your Hederon AI journey.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {HELPCENTER_CARDS.map((card) => (
            <Link 
              key={card.title} 
              href={card.link}
              className={`group p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.05] hover:border-white/15 transition-all duration-300 relative overflow-hidden`}
            >
              <div className={`w-12 h-12 rounded-2xl ${card.bg} border ${card.border} flex items-center justify-center mb-6`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-violet-400 transition-colors">{card.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                {card.description}
              </p>
              <div className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">
                Explore <ChevronRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500">
                <BookOpen className="w-4 h-4" />
              </span>
              Popular Articles
            </h2>
            <Link href="#" className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
              View All
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {POPULAR_ARTICLES.map((article) => (
              <Link 
                key={article.title}
                href={`/support/articles/${article.slug}`}
                className="group p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${article.color}`}>
                    {article.category}
                  </span>
                  <article.icon className={`w-4 h-4 text-zinc-600 group-hover:${article.color} transition-colors`} />
                </div>
                <h4 className="font-bold text-sm mb-3 group-hover:text-white transition-colors">
                  {article.title}
                </h4>
                <div className="flex items-center gap-2 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                  <Clock className="w-3 h-3" />
                  {article.readTime}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="rounded-3xl bg-gradient-to-br from-violet-900/20 to-indigo-900/10 border border-violet-500/20 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
          <div className="relative z-10 space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold">Need help immediately?</h2>
            <p className="text-zinc-400 max-w-xl mx-auto leading-relaxed">
              Our average response time is under 12 hours for premium users. Having a critical issue? Drop us an email.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <a 
                href="mailto:owuordove@gmail.com" 
                className="bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors"
              >
                Email Support
              </a>
              <a 
                href="https://github.com/Dovineowuor/HederonAI" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/5 border border-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                Follow Updates
              </a>
            </div>
          </div>
        </div>

        {/* Global Footer Inclusion */}
        <Footer />
      </div>
    </div>
  );
}
