import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CircularCarouselProps {
  /**
   * Elemen-elemen yang akan diletakkan di lingkaran silinder
   */
  children: React.ReactNode[];

  /**
   * Radius lingkaran dalam px untuk layar desktop (default: 340)
   */
  radius?: number;

  /**
   * Radius lingkaran dalam px untuk layar mobile (default: 210)
   */
  mobileRadius?: number;

  /**
   * Kecepatan putaran otomatis dalam derajat per frame (default: 0.22)
   */
  autoRotateSpeed?: number;

  /**
   * Apakah putaran otomatis aktif secara default (default: true)
   */
  autoRotate?: boolean;

  /**
   * Apakah putaran otomatis dijeda saat mouse hover (default: false untuk continuous autoplay)
   */
  pauseOnHover?: boolean;

  /**
   * Kelas styling container
   */
  className?: string;

  /**
   * Apakah menampilkan kontrol navigasi & dots (default: false)
   */
  showControls?: boolean;

  /**
   * Callback saat item di depan berganti
   */
  onActiveChange?: (index: number) => void;
}

export default function CircularCarousel({
  children,
  radius = 340,
  mobileRadius = 210,
  autoRotateSpeed = 0.22,
  autoRotate = true,
  pauseOnHover = false,
  className = '',
  showControls = false,
  onActiveChange,
}: CircularCarouselProps) {
  const count = React.Children.count(children);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [targetRotation, setTargetRotation] = useState(0);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [isInteracting, setIsInteracting] = useState(false);
  const [currentRadius, setCurrentRadius] = useState(radius);

  // Drag state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const lastX = useRef(0);
  const velocity = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsiveness: deteksi ukuran layar untuk radius
  useEffect(() => {
    const updateRadius = () => {
      if (typeof window !== 'undefined') {
        setCurrentRadius(window.innerWidth < 768 ? mobileRadius : radius);
      }
    };

    updateRadius();
    window.addEventListener('resize', updateRadius);
    return () => window.removeEventListener('resize', updateRadius);
  }, [radius, mobileRadius]);

  // Sudut antar elemen
  const angleStep = 360 / Math.max(1, count);

  // Deteksi indeks item yang paling dekat ke depan
  const getClosestIndex = useCallback(
    (rot: number) => {
      const normalized = ((-rot % 360) + 360) % 360;
      const index = Math.round(normalized / angleStep) % count;
      return index;
    },
    [angleStep, count]
  );

  // Putar ke item spesifik
  const rotateToIndex = useCallback(
    (index: number) => {
      const currentTargetIndex = getClosestIndex(targetRotation);
      let diff = index - currentTargetIndex;
      if (diff > count / 2) diff -= count;
      if (diff < -count / 2) diff += count;

      setTargetRotation((prev) => prev - diff * angleStep);
      onActiveChange?.(index);
    },
    [angleStep, count, getClosestIndex, onActiveChange, targetRotation]
  );

  const rotateNext = useCallback(() => {
    setTargetRotation((prev) => prev - angleStep);
  }, [angleStep]);

  const rotatePrev = useCallback(() => {
    setTargetRotation((prev) => prev + angleStep);
  }, [angleStep]);

  // Main animation loop: smooth lerp + auto rotation
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!isDragging.current) {
        if (isRotating && (!pauseOnHover || !isInteracting)) {
          // Putaran otomatis konstan
          setTargetRotation((prev) => prev - autoRotateSpeed * (dt * 60));
        }

        // Terapkan sisa momentum velocity jika ada
        if (Math.abs(velocity.current) > 0.05) {
          setTargetRotation((prev) => prev + velocity.current);
          velocity.current *= 0.92; // Friction damping
        }
      }

      // Smooth interpolation (lerp) currentRotation ke targetRotation
      setCurrentRotation((prev) => {
        const diff = targetRotation - prev;
        if (Math.abs(diff) < 0.01) return targetRotation;
        return prev + diff * 0.12;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isRotating, isInteracting, autoRotateSpeed, targetRotation]);

  // Update active index callback saat rotasi berubah
  useEffect(() => {
    const activeIdx = getClosestIndex(currentRotation);
    onActiveChange?.(activeIdx);
  }, [currentRotation, getClosestIndex, onActiveChange]);

  // Pointer drag gestures (mouse & touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    setIsInteracting(true);
    startX.current = e.clientX;
    lastX.current = e.clientX;
    velocity.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastX.current;
    lastX.current = e.clientX;

    // Sensitivitas drag
    const sensitivity = 0.38;
    velocity.current = deltaX * sensitivity;
    setTargetRotation((prev) => prev + deltaX * sensitivity);
  };

  const handlePointerUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    // Biarkan timeout singkat agar interaksi klik tidak langsung memulai autorotate
    setTimeout(() => {
      setIsInteracting(false);
    }, 1500);
  };

  const childrenArray = React.Children.toArray(children);
  const activeIndex = getClosestIndex(currentRotation);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => {
        if (pauseOnHover) setIsInteracting(true);
      }}
      onMouseLeave={() => {
        if (pauseOnHover && !isDragging.current) setIsInteracting(false);
      }}
      className={`relative w-full flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* 3D Circular Stage Container */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ contain: 'paint' }}
        className="relative w-full max-w-full h-[460px] sm:h-[520px] flex items-center justify-center overflow-hidden overflow-clip cursor-grab active:cursor-grabbing [perspective:1100px]"
      >
        {/* Revolving 3D Ring Cylinder */}
        <div
          style={{
            transform: `translateZ(-${currentRadius}px) rotateY(${currentRotation}deg)`,
            transformStyle: 'preserve-3d',
            transition: isDragging.current ? 'none' : 'transform 0.05s linear',
          }}
          className="relative w-0 h-0 flex items-center justify-center"
        >
          {childrenArray.map((child, i) => {
            const itemAngle = i * angleStep;

            // Hitung normalisasi posisi sudut relatif ke depan (0 derajat = tepat menghadap user)
            const angleFromFront = (((itemAngle + currentRotation) % 360) + 360) % 360;
            const radFromFront = (angleFromFront * Math.PI) / 180;
            const cosVal = Math.cos(radFromFront); // 1 = depan, -1 = belakang

            // Opacity dan skala berdasarkan kedalaman
            const isNearFront = cosVal > 0.1;
            const opacity = Math.max(0.28, (cosVal + 1) / 2);
            const scale = 0.8 + 0.25 * ((cosVal + 1) / 2);
            const zIndex = Math.round((cosVal + 1) * 50);

            return (
              <div
                key={i}
                onClick={(e) => {
                  // Jika hanya klik (bukan drag besar), putar ke item tersebut
                  if (Math.abs(startX.current - lastX.current) < 5) {
                    rotateToIndex(i);
                  }
                }}
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(${currentRadius}px) scale(${scale})`,
                  opacity,
                  zIndex,
                  position: 'absolute',
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
                className={`transition-opacity duration-300 ${
                  isNearFront ? 'pointer-events-auto cursor-pointer' : 'pointer-events-none'
                }`}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>

      {/* Control Dock */}
      {showControls && (
        <div className="mt-6 flex items-center justify-center gap-3 relative z-20">
          <div className="inline-flex items-center gap-2.5 p-2 rounded-2xl bg-[#0E071D]/90 backdrop-blur-xl border border-purple-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
            <button
              type="button"
              onClick={rotatePrev}
              aria-label="Item Sebelumnya"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#150B28] text-purple-300 hover:text-white hover:bg-purple-900/60 border border-purple-500/25 transition-all shadow cursor-pointer active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Indicator Dots */}
            <div className="flex items-center gap-1.5 px-2">
              {childrenArray.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => rotateToIndex(i)}
                  aria-label={`Ke Tech ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? 'w-6 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                      : 'w-2 bg-purple-900/60 hover:bg-purple-500/50'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={rotateNext}
              aria-label="Item Selanjutnya"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#150B28] text-purple-300 hover:text-white hover:bg-purple-900/60 border border-purple-500/25 transition-all shadow cursor-pointer active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
