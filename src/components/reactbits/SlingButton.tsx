import React, { useState, useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { ArrowUp, Sparkles } from 'lucide-react';

export interface SlingButtonProps {
  /**
   * Aksi saat tombol dilontarkan (default: scroll to top)
   */
  onLaunch?: () => void;

  /**
   * Label atau tooltip tombol
   */
  label?: string;

  /**
   * Warna tali elastis & pendaran (default: tema cosmic purple/cyan)
   */
  glowColor?: string;

  /**
   * Ukuran tombol dalam px (default: 52)
   */
  size?: number;

  /**
   * Kelas styling tambahan
   */
  className?: string;
}

export default function SlingButton({
  onLaunch,
  label = 'Lontarkan ke Atas',
  glowColor = '#C084FC',
  size = 52,
  className = '',
}: SlingButtonProps) {
  const [isPulling, setIsPulling] = useState(false);
  const [isLaunched, setIsLaunched] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const startX = useRef(0);

  // Motion values untuk tarikan ketapel
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);

  // Spring physics untuk efek lentur tali ketapel saat dilepas
  const springConfig = { damping: 14, stiffness: 350, mass: 0.6 };
  const smoothX = useSpring(pullX, springConfig);
  const smoothY = useSpring(pullY, springConfig);

  // Batas maksimal tarikan
  const MAX_PULL = 65;
  const THRESHOLD = 35;

  const triggerLaunch = () => {
    setIsLaunched(true);
    
    // Spawn spark particles efek lontaran
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: (Math.random() - 0.5) * 40,
      y: -20 - Math.random() * 40,
      color: i % 2 === 0 ? '#C084FC' : '#22D3EE',
    }));
    setParticles(newParticles);

    // Panggil aksi
    onLaunch?.();

    // Reset status lontaran setelah animasi selesai
    setTimeout(() => {
      setIsLaunched(false);
      setParticles([]);
    }, 650);
  };

  // Pointer drag gestures
  const handlePointerDown = (e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsPulling(true);
    startX.current = e.clientX;
    startY.current = e.clientY;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isPulling) return;
    const dx = e.clientX - startX.current;
    const dy = e.clientY - startY.current;

    // Hanya izinkan tarikan ke bawah (slingshot pull down) dan sedikit geser horizontal
    const clampedY = Math.max(0, Math.min(dy, MAX_PULL));
    const clampedX = Math.max(-MAX_PULL * 0.45, Math.min(dx, MAX_PULL * 0.45));

    pullX.set(clampedX);
    pullY.set(clampedY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPulling) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    setIsPulling(false);

    const currentY = pullY.get();

    // Jika ditarik melebihi threshold -> Lontarkan!
    if (currentY >= THRESHOLD) {
      // Hentakkan sesaat ke atas (over-shoot release)
      pullY.set(-25);
      pullX.set(0);

      triggerLaunch();

      // Kembalikan ke titik netral
      setTimeout(() => {
        pullX.set(0);
        pullY.set(0);
      }, 120);
    } else {
      // Snap kembali ke nol dengan mulus jika tidak cukup jauh ditarik
      pullX.set(0);
      pullY.set(0);
    }
  };

  // Klik biasa sebagai fallback jika tidak ditarik
  const handleClick = () => {
    if (pullY.get() === 0 && !isLaunched) {
      // Animasi otomatis pull-back lalu jepret
      pullY.set(40);
      setTimeout(() => {
        pullY.set(-25);
        triggerLaunch();
        setTimeout(() => {
          pullY.set(0);
        }, 150);
      }, 160);
    }
  };

  // Anchor points untuk tali ketapel di kiri dan kanan
  const width = 110;
  const height = 130;
  const anchorY = 32;
  const anchorLeftX = 18;
  const anchorRightX = width - 18;

  // Nilai koordinat dinamis untuk ujung tali yang menempel pada tombol
  const [bandCoords, setBandCoords] = useState({ bx: width / 2, by: anchorY });

  useEffect(() => {
    const unsubX = smoothX.on('change', (latestX) => {
      setBandCoords((prev) => ({ ...prev, bx: width / 2 + latestX }));
    });
    const unsubY = smoothY.on('change', (latestY) => {
      setBandCoords((prev) => ({ ...prev, by: anchorY + latestY }));
    });

    return () => {
      unsubX();
      unsubY();
    };
  }, [smoothX, smoothY]);

  // Hitung persentase regangan tali
  const stretchRatio = Math.min(Math.max(0, bandCoords.by - anchorY) / MAX_PULL, 1);
  const cordStroke = Math.max(1.8, 3.2 - stretchRatio * 1.4);
  const cordColor = stretchRatio > 0.6 ? '#F43F5E' : stretchRatio > 0.25 ? '#E879F9' : '#A855F7';

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width, height }}
    >
      {/* Tooltip Keterangan Playful */}
      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 5, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#150B28]/95 border border-purple-500/40 text-[10px] font-semibold text-purple-200 shadow-xl whitespace-nowrap pointer-events-none z-30"
        >
          {isPulling ? 'Lepaskan untuk melontar!' : label}
        </motion.div>
      )}

      {/* SVG Canvas untuk Tali Karet Ketapel (Elastic Bands) */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible"
        viewBox={`0 0 ${width} ${height}`}
      >
        <defs>
          <filter id="cord-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Pasak Kiri (Left Slingshot Post) */}
        <circle cx={anchorLeftX} cy={anchorY} r="4.5" fill="#4C1D95" stroke="#A855F7" strokeWidth="2" />
        <circle cx={anchorLeftX} cy={anchorY} r="1.5" fill="#C084FC" />

        {/* Pasak Kanan (Right Slingshot Post) */}
        <circle cx={anchorRightX} cy={anchorY} r="4.5" fill="#4C1D95" stroke="#A855F7" strokeWidth="2" />
        <circle cx={anchorRightX} cy={anchorY} r="1.5" fill="#C084FC" />

        {/* Tali Karet Kiri: dari Pasak Kiri ke Sisi Kiri Tombol */}
        <path
          d={`M ${anchorLeftX} ${anchorY} Q ${(anchorLeftX + bandCoords.bx) / 2} ${
            (anchorY + bandCoords.by) / 2 + 3
          } ${bandCoords.bx - 12} ${bandCoords.by}`}
          fill="none"
          stroke={cordColor}
          strokeWidth={cordStroke}
          strokeLinecap="round"
          filter="url(#cord-glow)"
        />

        {/* Tali Karet Kanan: dari Pasak Kanan ke Sisi Kanan Tombol */}
        <path
          d={`M ${anchorRightX} ${anchorY} Q ${(anchorRightX + bandCoords.bx) / 2} ${
            (anchorY + bandCoords.by) / 2 + 3
          } ${bandCoords.bx + 12} ${bandCoords.by}`}
          fill="none"
          stroke={cordColor}
          strokeWidth={cordStroke}
          strokeLinecap="round"
          filter="url(#cord-glow)"
        />
      </svg>

      {/* Tombol Pelontar Utama (Slingshot Pouch & Button) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          width: size,
          height: size,
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        className={`relative z-10 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing shadow-xl transition-colors duration-200 ${
          isPulling
            ? 'bg-violet-600 border-2 border-white text-white shadow-[0_0_25px_rgba(236,72,153,0.8)] scale-105'
            : 'bg-gradient-to-tr from-[#1E0D3D] to-[#120826] border-2 border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-white shadow-[0_4px_20px_rgba(139,92,246,0.35)]'
        }`}
      >
        {/* Glowing Core */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-purple-600/30 via-transparent to-cyan-400/20 pointer-events-none" />

        {/* Arrow Icon with Dynamic Tilt & Launch Physics */}
        <motion.div
          animate={{
            y: isLaunched ? [-20, 0] : isPulling ? [0, 2, 0] : [0, -3, 0],
            rotate: isPulling ? (pullX.get() > 5 ? 12 : pullX.get() < -5 ? -12 : 0) : 0,
            scale: isLaunched ? [1.3, 1] : 1,
          }}
          transition={{
            y: { duration: isPulling ? 0.2 : 2, repeat: isPulling ? 0 : Infinity, ease: 'easeInOut' },
            scale: { duration: 0.3 },
          }}
        >
          <ArrowUp className="w-5 h-5 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
        </motion.div>
      </motion.div>

      {/* Partikel Percikan Saat Dilontarkan */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          animate={{
            opacity: 0,
            scale: 0.2,
            x: p.x,
            y: p.y - 45,
          }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="absolute w-2 h-2 rounded-full pointer-events-none z-20"
          style={{ backgroundColor: p.color, boxShadow: `0 0 8px ${p.color}` }}
        />
      ))}
    </div>
  );
}

