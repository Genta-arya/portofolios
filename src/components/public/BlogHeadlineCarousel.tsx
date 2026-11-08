import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Clock, 
  ArrowUpRight, 
  Pause, 
  Play, 
  Calendar 
} from 'lucide-react';
import { formatDate } from '../../lib/utils';
import type { BlogPostItem } from './BlogSearchList';

interface BlogHeadlineCarouselProps {
  posts: BlogPostItem[];
}

export default function BlogHeadlineCarousel({ posts = [] }: BlogHeadlineCarouselProps) {
  // Take top 5 posts as headlines
  const headlinePosts = posts.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = headlinePosts.length;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
  };

  // Auto-play timer (5 seconds)
  useEffect(() => {
    if (total <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, isPaused, currentIndex]);

  if (total === 0) return null;

  const current = headlinePosts[currentIndex];

  return (
    <div 
      className="mb-14 relative group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Badge & Carousel Controls Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 text-purple-300 border border-purple-500/30 shadow-sm uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Top 5 Headline Wawasan Terkini</span>
        </div>

        {/* Navigation Arrows & Play/Pause */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            title={isPaused ? "Lanjutkan putar otomatis" : "Jeda putar otomatis"}
            className="w-8 h-8 rounded-xl bg-[#0D0818] border border-purple-500/25 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={prevSlide}
            title="Artikel sebelumnya"
            className="w-8 h-8 rounded-xl bg-[#0D0818] border border-purple-500/25 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:border-purple-400 active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            title="Artikel selanjutnya"
            className="w-8 h-8 rounded-xl bg-[#0D0818] border border-purple-500/25 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:border-purple-400 active:scale-95"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Carousel Hero Card */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#150D28] via-[#0E0720] to-[#0D0818] border border-purple-500/30 p-5 sm:p-8 overflow-hidden shadow-[0_16px_45px_rgba(139,92,246,0.22)] transition-all">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          
          {/* Cover Image Container: Aspect 16/9 with contain to prevent cropping */}
          <div className="lg:col-span-7 aspect-[16/9] rounded-2xl overflow-hidden bg-[#0a0515] border border-purple-500/25 flex items-center justify-center shadow-inner relative group/thumb">
            <a href={`/blog/${current.slug}`} className="w-full h-full block">
              <img
                src={current.coverImageUrl}
                alt={current.title}
                key={current.slug}
                className="w-full h-full object-contain transition-all duration-700 group-hover/thumb:scale-105"
              />
            </a>

            {/* Category Tag Overlay */}
            {current.categoryName && (
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-[#0D0818]/90 text-purple-300 border border-purple-500/35 backdrop-blur-md shadow-md">
                {current.categoryName}
              </div>
            )}

            {/* Position Indicator Badge */}
            <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-black/80 text-zinc-300 border border-white/10 backdrop-blur-sm">
              #{currentIndex + 1} dari {total}
            </div>
          </div>

          {/* Headline Details */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-zinc-400 mb-3">
                <span className="flex items-center gap-1 font-medium text-purple-300">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>{current.readingTimeMinutes || 4} min baca</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatDate(current.publishedAt || current.createdAt)}</span>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-3 hover:text-purple-300 transition-colors leading-snug line-clamp-2">
                <a href={`/blog/${current.slug}`}>
                  {current.title}
                </a>
              </h2>

              {/* Excerpt */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6 line-clamp-3">
                {current.excerpt}
              </p>
            </div>

            {/* Action Bar & Slide Dots */}
            <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
              {/* Dots Indicator */}
              <div className="flex items-center gap-1.5">
                {headlinePosts.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    title={`Lihat headline ${idx + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === idx
                        ? 'w-7 bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-md shadow-purple-500/50'
                        : 'w-2 bg-zinc-700 hover:bg-zinc-500'
                    }`}
                  />
                ))}
              </div>

              {/* Read Now Button */}
              <a
                href={`/blog/${current.slug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Baca Sekarang</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
