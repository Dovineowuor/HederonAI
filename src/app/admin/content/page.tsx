import { FileText, Plus, Database, AlertCircle, Eye, LayoutTemplate, BookOpen, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { SUPPORT_ARTICLES } from "@/lib/support";
import { getJobs, getUsersCount, getArticleStats } from "@/lib/db";

export default async function AdminContentPage() {
  const articles = SUPPORT_ARTICLES;
  const usersCount = getUsersCount();
  const jobs = getJobs();
  const articleStats = getArticleStats();
  
  // Estimated views per article: weight by job activity
  const estimatedWeeklyViews = Math.max(12, usersCount * 3 + jobs.length * 2);

  const topArticleSlug = articleStats.topArticle?.slug;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black flex items-center gap-3">
              <Database className="text-violet-400 w-8 h-8" />
              Content <span className="text-zinc-500 font-light">| CMS</span>
            </h1>
            <p className="text-zinc-400 text-sm">Manage platform support knowledge base and static articles.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin" className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-sm font-bold transition-all">
              &larr; Back to Admin
            </Link>
            <button className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" /> New Article
            </button>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Total Articles
            </h3>
            <p className="text-3xl font-black">{articles.length}</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Tag className="w-4 h-4" /> Categories
            </h3>
            <p className="text-3xl font-black text-violet-400">
              {new Set(articles.map(a => a.category)).size}
            </p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5 space-y-2">
            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
              <Eye className="w-4 h-4" /> Est. Weekly Views
            </h3>
            <p className="text-3xl font-black text-emerald-400">{estimatedWeeklyViews.toLocaleString()}</p>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-zinc-900/30 rounded-2xl border border-white/5 overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-zinc-900/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutTemplate className="w-5 h-5 text-indigo-400" />
              <h2 className="font-bold">Support Knowledge Base</h2>
            </div>
            <span className="text-xs text-zinc-500">{articles.length} articles</span>
          </div>
          
          <div className="divide-y divide-white/5">
            {articles.map((article) => {
              const views = articleStats.list.find(a => a.slug === article.slug)?.views || 0;
              const isTop = article.slug === topArticleSlug && views > 0;
              
              return (
              <div key={article.slug} className="p-6 hover:bg-white/[0.02] transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <h3 className="font-bold group-hover:text-violet-300 transition-colors flex items-center gap-2">
                      {article.title}
                      {isTop && (
                        <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-400">
                          <TrendingUp className="w-3 h-3" /> Top
                        </span>
                      )}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-400">
                        {article.category}
                      </span>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {views.toLocaleString()} views
                      </p>
                      <span className="text-zinc-700 text-xs">•</span>
                      <p className="text-xs text-zinc-500">{article.readTime}</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/support/articles/${article.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Preview article"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <button className="px-4 py-2 text-xs font-bold rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            )})}
            {articles.length === 0 && (
              <div className="p-8 text-center text-zinc-500 text-sm">No articles found.</div>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 flex gap-3 text-sm text-violet-200">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p>
            <strong>CMS Status:</strong> Analytics and telemetry are active. Article create/edit capabilities will be unlocked in the v2 administration panel upgrade.
          </p>
        </div>
        
      </div>
    </div>
  );
}
