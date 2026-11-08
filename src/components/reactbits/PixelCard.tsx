import React, { useEffect, useRef, useState } from 'react';

export interface PixelCardProps {
  /**
   * Ukuran sisi per pixel dalam px (default: 3)
   */
  pixelSize?: number;

  /**
   * Jarak antar pixel dalam px (default: 5)
   */
  gap?: number;

  /**
   * Kecepatan animasi / peluruhan partikel (default: 35)
   */
  speed?: number;

  /**
   * Daftar warna hex dipisah koma (default tema ungu cosmic)
   */
  colors?: string;

  /**
   * Apakah partikel selalu berkilau secara halus di latar belakang
   */
  alwaysSparkle?: boolean;

  /**
   * Kelas styling container pembungkus
   */
  className?: string;

  /**
   * Konten di dalam card
   */
  children?: React.ReactNode;
}

interface PixelParticle {
  x: number;
  y: number;
  baseColor: string;
  alpha: number;
  targetAlpha: number;
  size: number;
  speed: number;
  isHovered: boolean;
}

export default function PixelCard({
  pixelSize = 3.5,
  gap = 6,
  speed = 40,
  colors = '#A855F7,#C084FC,#E879F9,#9333EA,#D946EF,#7E22CE,#F472B6',
  alwaysSparkle = true,
  className = '',
  children,
}: PixelCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const colorPalette = colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let pixels: PixelParticle[] = [];

    const initGrid = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      if (width === 0 || height === 0) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      pixels = [];
      const step = pixelSize + gap;
      const cols = Math.ceil(width / step);
      const rows = Math.ceil(height / step);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * step + gap / 2;
          const y = r * step + gap / 2;
          const randomColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];

          pixels.push({
            x,
            y,
            baseColor: randomColor,
            alpha: 0,
            targetAlpha: 0,
            size: pixelSize,
            speed: (0.015 + Math.random() * 0.035) * (speed / 30),
            isHovered: false,
          });
        }
      }
    };

    initGrid();

    // Resize observer untuk menangani ukuran dinamis
    const resizeObserver = new ResizeObserver(() => {
      initGrid();
    });
    resizeObserver.observe(container);

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const mouseX = mousePosRef.current.x;
      const mouseY = mousePosRef.current.y;
      const hoverRadius = 85;

      for (let i = 0; i < pixels.length; i++) {
        const p = pixels[i];

        // Hitung jarak ke kursor mouse
        const dist = Math.hypot(p.x - mouseX, p.y - mouseY);

        if (dist < hoverRadius) {
          const proximity = 1 - dist / hoverRadius;
          p.targetAlpha = Math.max(p.targetAlpha, proximity * 0.95);
        } else if (alwaysSparkle && Math.random() < 0.0018) {
          // Subtle ambient purple twinkle saat idle
          p.targetAlpha = 0.25 + Math.random() * 0.45;
        } else {
          p.targetAlpha = 0;
        }

        // Interpolasi alpha halus
        if (p.alpha < p.targetAlpha) {
          p.alpha = Math.min(p.targetAlpha, p.alpha + p.speed * 4 * dt * 60);
        } else if (p.alpha > p.targetAlpha) {
          p.alpha = Math.max(p.targetAlpha, p.alpha - p.speed * 1.5 * dt * 60);
        }

        // Gambar pixel jika terlihat
        if (p.alpha > 0.02) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.baseColor;
          
          // Glow effect untuk pixel dekat kursor
          if (p.alpha > 0.5) {
            ctx.shadowColor = p.baseColor;
            ctx.shadowBlur = 6;
          }

          // Gambar kotak pixel yang rapi
          ctx.fillRect(p.x, p.y, p.size, p.size);
          ctx.restore();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [pixelSize, gap, speed, colors, alwaysSparkle]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mousePosRef.current = { x: -1000, y: -1000 };
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      {/* HTML5 Canvas untuk Partikel Pixel Ungu */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0.7 }}
      />

      {/* Konten Utama Card */}
      <div className="relative z-10 w-full h-full pointer-events-auto">
        {children}
      </div>
    </div>
  );
}

