import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface DepthCarouselProps {
  /**
   * Elemen slide/card yang akan dirender dalam 3D depth rail
   */
  children: React.ReactNode[];

  /**
   * Indeks slide awal yang aktif (default: 1 untuk card tengah)
   */
  initialIndex?: number;

  /**
   * Apakah carousel berganti otomatis (autoplay)
   */
  autoplay?: boolean;

  /**
   * Interval autoplay dalam milidetik (default: 4500)
   */
  autoplayInterval?: number;

  /**
   * Kelas styling container
   */
  className?: string;

  /**
   * Apakah menampilkan tombol panah navigasi kiri/kanan
   */
  showControls?: boolean;

  /**
   * Apakah menampilkan dot indicator di bawah
   */
  showIndicators?: boolean;

  /**
   * Callback saat slide aktif berganti
   */
  onIndexChange?: (index: number) => void;
}

export default function DepthCarousel({
  children,
  initialIndex = 1,
  autoplay = true,
  autoplayInterval = 5000,
  className = '',
  showControls = true,
  showIndicators = true,
  onIndexChange,
}: DepthCarouselProps) {
  const count = React.Children.count(children);
  const [activeIndex, setActiveIndex] = useState(
    Math.min(Math.max(0, initialIndex), Math.max(0, count - 1))
  );
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isHovered, setIsHovered] = useState(false);

  // Dragging state
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragDistanceRef = useRef(0);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % count;
      onIndexChange?.(next);
      return next;
    });
  }, [count, onIndexChange]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => {
      const prevIdx = (prev - 1 + count) % count;
      onIndexChange?.(prevIdx);
      return prevIdx;
    });
  }, [count, onIndexChange]);

  const goToIndex = (idx: number) => {
    setActiveIndex(idx);
    onIndexChange?.(idx);
  };

  // Autoplay loop
  useEffect(() => {
    if (!isPlaying || isHovered || count <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, autoplayInterval, goToNext, count]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    dragDistanceRef.current = e.clientX - dragStartXRef.current;
  };

  const handlePointerUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const threshold = 45;

    if (dragDistanceRef.current < -threshold) {
      goToNext();
    } else if (dragDistanceRef.current > threshold) {
      goToPrev();
    }
  };

  const childrenArray = React.Children.toArray(children);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full select-none ${className}`}
    >
      {/* 3D Depth Perspective Stage */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative w-full h-[580px] sm:h-[620px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing [perspective:1200px]"
      >
        <div className="relative w-full max-w-5xl h-full flex items-center justify-center [transform-style:preserve-3d]">
          {childrenArray.map((child, idx) => {
            // Hitung jarak relatif terhadap slide aktif
            let offset = idx - activeIndex;

            // Handle circular wrapping untuk 3 item
            if (count === 3) {
              if (offset === 2) offset = -1;
              if (offset === -2) offset = 1;
            } else if (Math.abs(offset) > count / 2) {
              offset = offset > 0 ? offset - count : offset + count;
            }

            const isActive = offset === 0;

            // Variasi kalkulasi 3D rail depth
            let xOffset = 0;
            let zOffset = 0;
            let rotateY = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 10;
            let blur = '0px';

            if (isActive) {
              // Posisi tengah aktif di depan
              xOffset = 0;
              zOffset = 0;
              rotateY = 0;
              scale = 1;
              opacity = 1;
              zIndex = 30;
              blur = '0px';
            } else if (offset === 1) {
              // Slide kanan mundur ke kedalaman 3D
              xOffset = 58; // dalam % lebar kartu
              zOffset = -180;
              rotateY = -28;
              scale = 0.88;
              opacity = 0.72;
              zIndex = 20;
              blur = '0.5px';
            } else if (offset === -1) {
              // Slide kiri mundur ke kedalaman 3D
              xOffset = -58;
              zOffset = -180;
              rotateY = 28;
              scale = 0.88;
              opacity = 0.72;
              zIndex = 20;
              blur = '0.5px';
            } else {
              // Slide di luar jangkauan langsung
              xOffset = offset * 80;
              zOffset = -320;
              rotateY = offset > 0 ? -40 : 40;
              scale = 0.75;
              opacity = 0.2;
              zIndex = 10;
              blur = '2px';
            }

            return (
              <motion.div
                key={idx}
                animate={{
                  x: `${xOffset}%`,
                  z: zOffset,
                  rotateY: rotateY,
                  scale: scale,
                  opacity: opacity,
                  filter: `blur(${blur})`,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 260,
                  damping: 26,
                  mass: 0.9,
                }}
                onClick={() => {
                  if (!isActive) goToIndex(idx);
                }}
                style={{
                  zIndex,
                  position: 'absolute',
                  transformStyle: 'preserve-3d',
                }}
                className={`w-[85vw] max-w-[340px] sm:max-w-[370px] transition-shadow duration-300 ${
                  !isActive ? 'cursor-pointer hover:opacity-90' : 'cursor-default'
                }`}
              >
                {/* Pointer events lock pada kartu non-aktif agar fokus pada kartu tengah */}
                <div className={!isActive ? 'pointer-events-none' : 'pointer-events-auto'}>
                  {child}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls & Indicator Dock */}
      {(showControls || showIndicators) && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-20">
          {/* Glassmorphic Navigation Bar */}
          <div className="inline-flex items-center gap-3 p-2 rounded-2xl bg-[#0E071D]/90 backdrop-blur-xl border border-purple-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
            {/* Tombol Sebelumnya */}
            {showControls && (
              <button
                type="button"
                onClick={goToPrev}
                aria-label="Layanan Sebelumnya"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#150B28] text-purple-300 hover:text-white hover:bg-purple-900/60 border border-purple-500/25 transition-all shadow cursor-pointer active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}

            {/* Indicator Dots */}
            {showIndicators && (
              <div className="flex items-center gap-2 px-2">
                {childrenArray.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => goToIndex(i)}
                    aria-label={`Ke Layanan ${i + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === activeIndex
                        ? 'w-8 bg-gradient-to-r from-purple-500 to-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.8)]'
                        : 'w-2.5 bg-purple-900/60 hover:bg-purple-500/50'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Tombol Selanjutnya */}
            {showControls && (
              <button
                type="button"
                onClick={goToNext}
                aria-label="Layanan Selanjutnya"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#150B28] text-purple-300 hover:text-white hover:bg-purple-900/60 border border-purple-500/25 transition-all shadow cursor-pointer active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

