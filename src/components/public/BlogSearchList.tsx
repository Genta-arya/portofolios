import React, { useState } from 'react';
import { Search, Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import DataFetchLoader from '../ui/DataFetchLoader';

export interface BlogPostItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  readingTimeMinutes?: number | null;
  viewsCount?: number | null;
  publishedAt?: Date | string | null;
  createdAt: Date | string;
  categoryName?: string;
  isFeatured?: boolean | null;
}

interface BlogSearchListProps {
  initialPosts: BlogPostItem[];
  categories: { id: number; name: string; slug: string }[];
}

export default function BlogSearchList({ initialPosts = [], categories = [] }: BlogSearchListProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFiltering, setIsFiltering] = useState(false);

  const handleSelectCategory = (catName: string) => {
    if (catName === selectedCategory) return;
    setIsFiltering(true);
    setSelectedCategory(catName);
    setTimeout(() => setIsFiltering(false), 350);
  };

  const filtered = initialPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' ||
      post.categoryName?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCat;
  });

  return (
    <div>
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10 bg-[#0D0818]/90 p-4 rounded-3xl border border-purple-500/20">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau topik artikel..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#120B24] border border-purple-500/30 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => handleSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-zinc-400 hover:text-white bg-[#120B24] border border-purple-500/20'
            }`}
          >
            Semua Topik
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectCategory(c.name)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === c.name
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-zinc-400 hover:text-white bg-[#120B24] border border-purple-500/20'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid Area with Gradient Waves Data Fetch Loader */}
      <div className="relative min-h-[350px]">
        <DataFetchLoader
          mode="overlay"
          isLoading={isFiltering}
          message="Memuat Artikel..."
          subMessage={`Filter topik: ${selectedCategory === 'all' ? 'Semua Topik' : selectedCategory}`}
        />
      {filtered.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-[#0D0818]/60 border border-purple-500/15 p-8">
          <BookOpen className="w-10 h-10 text-purple-400/60 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">Tidak Ada Artikel Ditemukan</h3>
          <p className="text-xs text-zinc-400">Coba ubah kata kunci pencarian atau pilih topik lainnya.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <a
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group rounded-3xl bg-[#0D0818]/80 border border-purple-500/20 hover:border-purple-400/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_12px_35px_rgba(139,92,246,0.2)] hover:-translate-y-1.5"
            >
              <div>
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-[#120B24] border border-purple-500/20 relative">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {post.categoryName && (
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0D0818]/90 text-purple-300 border border-purple-500/30 backdrop-blur-md">
                      {post.categoryName}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-zinc-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>{post.readingTimeMinutes || 3} min</span>
                  </span>
                  <span>•</span>
                  <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-purple-500/15 flex items-center justify-between text-xs font-semibold text-purple-400">
                <span>Baca Artikel</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
