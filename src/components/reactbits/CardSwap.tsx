import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TechLogo from '../ui/TechLogo';
import { useDisplayMode } from '../../lib/displayModeStore';

export interface CardSwapItem {
  id?: number | string;
  name: string;
  roleLabel?: string | null;
  category: string;
  glowColor?: string | null;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  [key: string]: any;
}

interface CardSwapProps {
  items: CardSwapItem[];
  selectedItem?: CardSwapItem | null;
  onSelectItem?: (item: CardSwapItem) => void;
  onCardClick?: (item: CardSwapItem) => void;
  width?: number;
  height?: number;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  autoplay?: boolean;
  pauseOnHover?: boolean;
  className?: string;
}

export function Card({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div className={`relative w-full h-full ${className}`} {...props}>
      {children}
    </div>
  );
}

export default function CardSwap({
  items,
  selectedItem,
  onSelectItem,
  onCardClick,
  width = 290,
  height = 360,
  cardDistance = 20,
  verticalDistance = 16,
  delay = 4500,
  autoplay = true,
  pauseOnHover = true,
  className = '',
}: CardSwapProps) {
  const { isLite } = useDisplayMode();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stable fingerprint of item list (only changes when category filter actually changes)
  const itemsFingerprint = useMemo(
    () => items.map((t) => t.name).join('|'),
    [items]
  );

  // Reset active index ONLY when category filter changes the item list
  useEffect(() => {
    setActiveIndex(0);
  }, [itemsFingerprint]);

  const total = items.length;

  // Navigasi internal kartu (TIDAK memanggil auto-scroll orbit saat autoplay)
  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setDirection('next');
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setDirection('prev');
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || (pauseOnHover && isHovered) || total <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, delay);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoplay, delay, pauseOnHover, isHovered, handleNext, total]);

  if (!items || items.length === 0) return null;

  const activeItem = items[activeIndex] || items[0];
  const maxVisibleCards = Math.min(total, 4);

  // Generate array of visible cards in order from front to back
  const visibleCards = [];
  for (let offset = 0; offset < maxVisibleCards; offset++) {
    const itemIndex = (activeIndex + offset) % total;
    visibleCards.push({
      item: items[itemIndex],
      itemIndex,
      depth: offset,
    });
  }

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Perspective Card Stack Container */}
      <div
        className="relative flex items-center justify-center"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          perspective: '1200px',
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {visibleCards.map(({ item, depth, itemIndex }) => {
            const isFront = depth === 0;
            const color = item.glowColor || '#8B5CF6';
            const Icon = item.icon;

            // Progressive depth transforms (flat in lite mode)
            const targetY = depth * verticalDistance;
            const targetX =
              depth === 0 || isLite
                ? 0
                : (depth % 2 === 1 ? 1 : -1) * (depth * cardDistance * 0.45);
            const targetRotate =
              depth === 0 || isLite
                ? 0
                : (depth % 2 === 1 ? 1 : -1) * (depth * 2.5);
            const targetScale = 1 - depth * 0.05;
            const zIndex = maxVisibleCards - depth;
            const opacity = 1 - depth * 0.16;

            return (
              <motion.div
                key={item.name}
                layout
                drag={isFront ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.65}
                onDragEnd={(_e, info) => {
                  if (!isFront) return;
                  if (info.offset.x < -60 || info.velocity.x < -300) {
                    handleNext();
                  } else if (info.offset.x > 60 || info.velocity.x > 300) {
                    handlePrev();
                  }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(itemIndex);
                  onCardClick?.(item);
                  onSelectItem?.(item);
                }}
                initial={{
                  scale: 0.82,
                  y: 40,
                  opacity: 0,
                  rotate: isLite ? 0 : (direction === 'next' ? 12 : -12),
                }}
                animate={{
                  x: targetX,
                  y: targetY,
                  scale: targetScale,
                  rotate: targetRotate,
                  opacity,
                  zIndex,
                }}
                exit={{
                  x: direction === 'next' ? -260 : 260,
                  rotate: direction === 'next' ? -22 : 22,
                  opacity: 0,
                  scale: 0.8,
                  transition: { duration: 0.32, ease: 'easeInOut' },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 24,
                  mass: 0.8,
                }}
                className="absolute inset-0 rounded-3xl p-5 sm:p-6 flex flex-col justify-between cursor-pointer backdrop-blur-xl border touch-pan-y"
                style={{
                  backgroundColor: 'rgba(14, 8, 28, 0.95)',
                  borderColor: isFront ? `${color}85` : 'rgba(139, 92, 246, 0.22)',
                  boxShadow: isFront
                    ? `0 20px 45px -10px ${color}60, 0 0 30px ${color}35, inset 0 1px 1px rgba(255,255,255,0.15)`
                    : '0 10px 25px rgba(0, 0, 0, 0.65)',
                }}
              >
                {/* Header: Category Badge & Index Indicator */}
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                    style={{
                      backgroundColor: `${color}25`,
                      color: color,
                      border: `1px solid ${color}50`,
                    }}
                  >
                    {item.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-zinc-400 font-mono font-semibold">
                      #{itemIndex + 1}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: color,
                        boxShadow: `0 0 10px ${color}`,
                      }}
                    />
                  </div>
                </div>

                {/* Center: Tech Icon, Name & Description */}
                <div className="my-auto flex flex-col items-center text-center px-1">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: -4 }}
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-transform"
                    style={{
                      backgroundColor: `${color}20`,
                      border: `1.5px solid ${color}55`,
                      boxShadow: `0 0 25px ${color}30`,
                    }}
                  >
                    <TechLogo name={item.name} color={color} size={32} className="w-8 h-8" />
                  </motion.div>

                  <h3 className="text-lg font-black text-white tracking-tight">
                    {item.name}
                  </h3>
                  <p
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: `${color}dd` }}
                  >
                    {item.roleLabel || 'Tech Stack Core'}
                  </p>

                  <p className="text-[11px] text-zinc-300 mt-2.5 line-clamp-3 leading-relaxed">
                    {item.description ||
                      'Teknologi yang digunakan dalam pengembangan aplikasi untuk menjaga stabilitas dan performa sistem.'}
                  </p>
                </div>

                {/* Footer: Clean status info without instructional guide text */}
                <div className="pt-2.5 border-t border-purple-500/20 flex items-center justify-between text-[10px] text-zinc-400 font-medium">
                  <span
                    className="font-mono text-[10px] tracking-wider uppercase"
                    style={{ color: `${color}cc` }}
                  >
                    {item.category}
                  </span>
                  <span className="text-zinc-400 font-mono font-semibold">
                    {itemIndex + 1} / {total}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Mobile Swap Navigation Bar */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Sebelumnya"
          className="w-9 h-9 rounded-full bg-[#120B24]/90 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Minimal dot progress */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#120B24]/80 border border-purple-500/20">
          <span className="text-xs font-bold text-white">
            {activeItem.name}
          </span>
          <span className="text-[10px] text-zinc-400 font-mono">
            ({activeIndex + 1}/{total})
          </span>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Berikutnya"
          className="w-9 h-9 rounded-full bg-[#120B24]/90 border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-400 flex items-center justify-center active:scale-90 transition-all cursor-pointer shadow-md"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
