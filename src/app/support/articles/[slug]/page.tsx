import Link from "next/link";
import { ChevronLeft, Clock, Share2, BookOpen, Zap, Wallet, Shield, Users } from "lucide-react";
import Footer from "@/components/Footer";
import { getArticleBySlug } from "@/lib/support";
import ReactMarkdown from "react-markdown";
import { incrementArticleView } from "@/lib/db";

const ICON_MAP: Record<string, any> = {
  Zap,
  Wallet,
  Shield,
  Users
};

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
        <Link 
          href="/support"
          className="text-violet-400 font-bold hover:underline"
        >
          Back to Support
        </Link>
      </div>
    );
  }

  // Increment view counter persistently
  incrementArticleView(slug);

  const Icon = ICON_MAP[article.iconName] || BookOpen;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-violet-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 pt-24 pb-20">
        {/* Navigation */}
        <Link 
          href="/support"
          className="flex inline-flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors mb-12 group"
        >
          <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
          Back to Support
        </Link>

        {/* Article Header */}
        <header className="mb-12 space-y-6">
          <div className="flex items-center gap-3">
            <span className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 text-violet-400`}>
              <Icon className="w-4 h-4" />
              {article.category}
            </span>
            <span className="text-zinc-700 font-black text-xs uppercase tracking-widest">•</span>
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center font-black text-violet-400 text-[10px]">
                H
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">Hederon Team</p>
                <p className="text-zinc-500 tracking-widest uppercase text-[8px] font-black">Official Guide</p>
              </div>
            </div>
            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <article className="prose prose-invert prose-violet max-w-none mb-20 bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-3xl">
           <ReactMarkdown>{article.content}</ReactMarkdown>
        </article>

        {/* Next Steps */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-600/10 to-transparent border border-violet-500/20 mb-20">
          <h3 className="text-xl font-bold mb-4">Was this helpful?</h3>
          <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
            We're constantly improving our guides based on community feedback. If you still have questions, join our discord.
          </p>
          <div className="flex gap-4">
             <button className="px-6 py-2 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-500 transition-colors text-sm">
               Yes, thanks!
             </button>
             <button className="px-6 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 font-bold hover:bg-white/10 transition-colors text-sm">
               No, I need more help
             </button>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}
