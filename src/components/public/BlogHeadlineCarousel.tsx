import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  ArrowUpRight, 
  Calendar 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate } from '../../lib/utils';
import type { BlogPostItem } from './BlogSearchList';

interface BlogHeadlineCarouselProps {
  posts: BlogPostItem[];
}

export default function BlogHeadlineCarousel({ posts = [] }: BlogHeadlineCarouselProps) {
  // Take top 5 posts as headlines
  const headlinePosts = posts.slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<number>(1); // 1 = next, -1 = prev
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = headlinePosts.length;

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const goToSlide = (idx: number) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
  };

  // Continuous auto-play timer (5 seconds) without pause button
  useEffect(() => {
    if (total <= 1) return;

    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [total, currentIndex]);

  if (total === 0) return null;

  const current = headlinePosts[currentIndex];

  // Motion variants for smooth sweet carousel transition
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 40 : -40,
      opacity: 0,
      filter: 'blur(4px)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.35 },
        filter: { duration: 0.3 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -40 : 40,
      opacity: 0,
      filter: 'blur(4px)',
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 28 },
        opacity: { duration: 0.25 },
        filter: { duration: 0.2 },
      },
    }),
  };

  return (
    <div className="mb-14 relative group">
      {/* Top Badge & Carousel Controls Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-violet-950/60 text-purple-300 border border-purple-500/30 shadow-sm uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
          <span>Top 5 Headline Wawasan Terkini</span>
        </div>

        {/* Navigation Arrows (Prev / Next only, Pause removed for continuous automatic play) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={prevSlide}
            title="Artikel sebelumnya"
            className="w-8 h-8 rounded-xl bg-[#0D0818] border border-purple-500/25 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:border-purple-400 active:scale-95 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            title="Artikel selanjutnya"
            className="w-8 h-8 rounded-xl bg-[#0D0818] border border-purple-500/25 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer hover:border-purple-400 active:scale-95 shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Carousel Card Container with Layered Glow */}
      <div className="relative rounded-3xl bg-gradient-to-br from-[#160E2E]/95 via-[#0E0720]/95 to-[#0D0818]/95 border border-purple-500/30 p-5 sm:p-8 overflow-hidden shadow-[0_16px_50px_rgba(139,92,246,0.22),inset_0_1px_1px_rgba(255,255,255,0.1)]">
        
        {/* Ambient Moving Radial Glows */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Continuous Automatic Animated Progress Indicator Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-white/5 overflow-hidden">
          <motion.div
            key={currentIndex}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 5, ease: 'linear' }}
            className="h-full bg-violet-500 origin-left"
          />
        </div>

        {/* Animated Slide Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.slug}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10"
          >
            {/* Cover Image Container: Aspect 16/9 with object-contain to prevent any cropping */}
            <div className="lg:col-span-7 aspect-[16/9] rounded-2xl overflow-hidden bg-[#0a0515] border border-purple-500/30 flex items-center justify-center shadow-inner relative group/thumb">
              <a href={`/article/${current.slug}`} className="w-full h-full block">
                <motion.img
                  src={current.coverImageUrl}
                  alt={current.title}
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover/thumb:scale-105"
                />
              </a>

              {/* Category Tag Overlay */}
              {current.categoryName && (
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-[#0D0818]/90 text-purple-300 border border-purple-500/40 backdrop-blur-md shadow-md">
                  {current.categoryName}
                </div>
              )}

              {/* Position Indicator Badge */}
              <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-mono font-bold bg-black/85 text-zinc-300 border border-white/10 backdrop-blur-sm">
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
                  <a href={`/article/${current.slug}`}>
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
                {/* Dots Indicator with Spring Animation */}
                <div className="flex items-center gap-1.5">
                  {headlinePosts.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => goToSlide(idx)}
                      title={`Lihat headline ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentIndex === idx
                          ? 'w-8 bg-violet-500 shadow-md shadow-purple-500/50'
                          : 'w-2 bg-zinc-700/80 hover:bg-zinc-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Read Now Button */}
                <a
                  href={`/article/${current.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Baca Sekarang</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </div>
  );
}
