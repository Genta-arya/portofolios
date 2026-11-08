import React, { useState, useEffect } from 'react';
import { Search, Clock, ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
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

export default function BlogSearchList({ initialPosts = [], categories = [] }: BlogSearchListProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMode, setPaginationMode] = useState<'pages' | 'infinite'>('pages');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Reset page when category or search changes
  useEffect(() => {
    setCurrentPage(1);
    setVisibleCount(ITEMS_PER_PAGE);
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
      selectedCategory === 'all' ||
      post.categoryName?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCat;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedPosts = paginationMode === 'pages'
    ? filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
    : filtered.slice(0, visibleCount);

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

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filtered.length));
  };

  return (
    <div id="article-list-container" className="scroll-mt-24">
      {/* Search and Category Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-[#0D0818]/90 p-4 rounded-3xl border border-purple-500/20 shadow-lg">
        
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
        </div>
      </div>

      {/* Meta Bar: Total Count & View Mode Toggle */}
      <div className="flex items-center justify-between text-xs text-zinc-400 mb-6 px-1">
        <div>
          Menampilkan <span className="font-semibold text-purple-300">{paginatedPosts.length}</span> dari{' '}
          <span className="font-semibold text-white">{filtered.length}</span> artikel
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-zinc-500 hidden sm:inline">Navigasi:</span>
          <div className="inline-flex rounded-xl bg-[#0D0818] border border-purple-500/20 p-1">
            <button
              type="button"
              onClick={() => setPaginationMode('pages')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                paginationMode === 'pages'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Halaman
            </button>
            <button
              type="button"
              onClick={() => setPaginationMode('infinite')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                paginationMode === 'infinite'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Muat Lebih Banyak
            </button>
          </div>
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
          <div key={`page-${currentPage}-${paginationMode}`} className="flex flex-col gap-5 sm:gap-6">
            {paginatedPosts.map((post) => (
              <article
                key={post.id}
                className="group relative rounded-3xl bg-gradient-to-r from-[#0E081D]/90 via-[#120B24]/80 to-[#0A0615]/90 border border-purple-500/20 hover:border-purple-400/50 p-4 sm:p-6 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(139,92,246,0.18)] hover:-translate-y-1"
              >
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 sm:gap-6">
                  {/* Thumbnail Container: Aspect ratio 16/9 with contain + dark backdrop to guarantee zero cropping */}
                  <a
                    href={`/blog/${post.slug}`}
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
                        <a href={`/blog/${post.slug}`}>
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
                        href={`/blog/${post.slug}`}
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

      {/* Pagination Controls - Placed OUTSIDE the relative container with pointer-events-auto */}
      {filtered.length > ITEMS_PER_PAGE && (
        <div className="mt-10 pt-6 border-t border-purple-500/15 relative z-20 pointer-events-auto">
          {paginationMode === 'pages' ? (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-zinc-400">
                Halaman <span className="font-semibold text-white">{currentPage}</span> dari{' '}
                <span className="font-semibold text-white">{totalPages}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                    currentPage === 1
                      ? 'opacity-40 cursor-not-allowed text-zinc-500 bg-[#0D0818] border border-purple-500/10'
                      : 'text-zinc-300 hover:text-white bg-[#120B24] border border-purple-500/30 hover:border-purple-400 active:scale-95 cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>

                {/* Page numbers (visible on all screens with flex) */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handlePageChange(page)}
                      className={`min-w-[34px] sm:min-w-[36px] h-9 px-2.5 rounded-xl text-xs font-bold transition-all select-none cursor-pointer ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/40 ring-1 ring-purple-400/50'
                          : 'text-zinc-400 hover:text-white bg-[#120B24] border border-purple-500/20 hover:border-purple-400/40 active:scale-95'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                    currentPage === totalPages
                      ? 'opacity-40 cursor-not-allowed text-zinc-500 bg-[#0D0818] border border-purple-500/10'
                      : 'text-zinc-300 hover:text-white bg-[#120B24] border border-purple-500/30 hover:border-purple-400 active:scale-95 cursor-pointer'
                  }`}
                >
                  <span>Selanjutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              {visibleCount < filtered.length ? (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Muat Artikel Lainnya ({filtered.length - visibleCount} tersisa)</span>
                </button>
              ) : (
                <p className="text-xs text-zinc-500">
                  🎉 Anda telah melihat semua {filtered.length} artikel yang tersedia.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
