import React, { useState, useEffect } from 'react';
import { Search, Clock, ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Bookmark } from 'lucide-react';
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

const ITEMS_PER_PAGE = 5;

/**
 * Generate windowed page numbers with ellipsis for large datasets (e.g., 1000 items)
 * Example outputs:
 *  - 5 pages: [1, 2, 3, 4, 5]
 *  - 20 pages at page 1: [1, 2, 3, '...', 20]
 *  - 20 pages at page 10: [1, '...', 8, 9, 10, 11, 12, '...', 20]
 *  - 20 pages at page 20: [1, '...', 18, 19, 20]
 */
function getPaginationItems(current: number, total: number): (number | string)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items: (number | string)[] = [];

  // Always show first page
  items.push(1);

  const leftSibling = Math.max(current - 1, 2);
  const rightSibling = Math.min(current + 1, total - 1);

  if (leftSibling > 2) {
    items.push('...left');
  } else if (leftSibling === 2) {
    items.push(2);
  }

  for (let i = Math.max(leftSibling, 3); i <= Math.min(rightSibling, total - 2); i++) {
    items.push(i);
  }

  if (rightSibling < total - 1) {
    items.push('...right');
  } else if (rightSibling === total - 1 && !items.includes(total - 1)) {
    items.push(total - 1);
  }

  // Always show last page
  if (total > 1) {
    items.push(total);
  }

  // Ensure unique list preserving order
  const uniqueItems: (number | string)[] = [];
  for (const it of items) {
    if (typeof it === 'number') {
      if (!uniqueItems.includes(it)) {
        uniqueItems.push(it);
      }
    } else {
      uniqueItems.push(it);
    }
  }

  return uniqueItems;
}

export default function BlogSearchList({ initialPosts = [], categories = [] }: BlogSearchListProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);

  useEffect(() => {
    try {
      const bms = JSON.parse(localStorage.getItem('gentha_blog_bookmarks') || '[]');
      setSavedSlugs(bms.map((b: any) => b.slug));
    } catch (_e) {}
  }, []);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  const handleSelectCategory = (catName: string) => {
    if (catName === selectedCategory) return;
    setIsFiltering(true);
    setSelectedCategory(catName);
    setTimeout(() => setIsFiltering(false), 300);
  };

  const filtered = initialPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase());

    const matchesCat =
      selectedCategory === 'all'
        ? true
        : selectedCategory === 'bookmarks'
        ? savedSlugs.includes(post.slug)
        : post.categoryName === selectedCategory;

    return matchesSearch && matchesCat;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    try {
      const element = document.getElementById('article-list-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (_e) {
      // ignore scroll errors on some browsers
    }
  };

  const paginationItems = getPaginationItems(currentPage, totalPages);

  return (
    <div id="article-list-container" className="scroll-mt-24">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#0D0818]/90 p-4 rounded-3xl border border-purple-500/20 shadow-lg">
        
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari judul artikel, topik, atau kata kunci..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#140A28] border border-purple-500/30 text-white placeholder-zinc-500 text-xs sm:text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            type="button"
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
              type="button"
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
          {/* Saved Articles Bookmark Tab */}
          <button
            type="button"
            onClick={() => handleSelectCategory('bookmarks')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === 'bookmarks'
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/40 ring-1 ring-purple-400'
                : 'text-zinc-400 hover:text-white bg-[#120B24] border border-purple-500/20'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${selectedCategory === 'bookmarks' ? 'fill-current' : 'text-purple-400'}`} />
            <span>Tersimpan ({savedSlugs.length})</span>
          </button>
        </div>
      </div>

      {/* Articles Grid Area with isolated DataFetchLoader */}
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
          <div key={`page-${currentPage}`} className="flex flex-col gap-5 sm:gap-6">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                className="group relative rounded-3xl bg-gradient-to-r from-[#0E081D]/90 via-[#120B24]/80 to-[#0A0615]/90 border border-purple-500/20 hover:border-purple-400/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(139,92,246,0.18)] hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 sm:gap-6">
                  {/* Thumbnail Container: Aspect ratio 16/9 with contain + dark backdrop to guarantee zero cropping */}
                  <a
                    href={`/article/${post.slug}`}
                    className="relative w-full sm:w-64 md:w-72 sm:min-w-[256px] md:min-w-[288px] aspect-[16/9] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-[#0a0515] border border-purple-500/25 shrink-0 flex items-center justify-center block shadow-inner"
                  >
                    <img
                      src={post.coverImageUrl}
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    {post.categoryName && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#0D0818]/90 text-purple-300 border border-purple-500/30 backdrop-blur-md z-10 shadow-sm">
                        {post.categoryName}
                      </div>
                    )}
                  </a>

                  {/* Content Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      {/* Meta Info */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-400 mb-2.5">
                        <span className="flex items-center gap-1 font-medium text-purple-300">
                          <Clock className="w-3.5 h-3.5 text-purple-400" />
                          <span>{post.readingTimeMinutes || 3} min baca</span>
                        </span>
                        <span>•</span>
                        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
                        {post.isFeatured && (
                          <>
                            <span>•</span>
                            <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                              Unggulan
                            </span>
                          </>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors leading-snug mb-2 line-clamp-2">
                        <a href={`/article/${post.slug}`}>
                          {post.title}
                        </a>
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Action Link & Read Indicator */}
                    <div className="pt-3 border-t border-purple-500/15 flex items-center justify-between">
                      <a
                        href={`/article/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <span>Baca Selengkapnya</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Optimized Numeric Pagination Buttons */}
      {totalPages > 1 && (
        <div className="mt-10 pt-6 border-t border-purple-500/15 flex justify-center items-center relative z-20 pointer-events-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Prev Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Halaman sebelumnya"
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                currentPage === 1
                  ? 'opacity-35 cursor-not-allowed text-zinc-500 bg-[#0D0818] border border-purple-500/10'
                  : 'text-zinc-300 hover:text-white bg-[#120B24] border border-purple-500/30 hover:border-purple-400 active:scale-95 cursor-pointer shadow-sm'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {/* Smart Windowed Page Numbers with Ellipsis */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {paginationItems.map((item, idx) => {
                if (typeof item === 'string') {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="w-7 h-9 flex items-center justify-center text-xs text-zinc-500 font-mono select-none"
                    >
                      ...
                    </span>
                  );
                }

                const pageNum = item as number;
                const isActive = currentPage === pageNum;

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`min-w-[34px] sm:min-w-[38px] h-9 px-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/40 ring-1 ring-purple-400/50 scale-105'
                        : 'text-zinc-400 hover:text-white bg-[#120B24] border border-purple-500/20 hover:border-purple-400/40 active:scale-95'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Halaman selanjutnya"
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                currentPage === totalPages
                  ? 'opacity-35 cursor-not-allowed text-zinc-500 bg-[#0D0818] border border-purple-500/10'
                  : 'text-zinc-300 hover:text-white bg-[#120B24] border border-purple-500/30 hover:border-purple-400 active:scale-95 cursor-pointer shadow-sm'
              }`}
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
