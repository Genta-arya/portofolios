import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GradientWaves from '../reactbits/GradientWaves';
import ElectricBorder from '../reactbits/ElectricBorder';

export interface DataFetchLoaderProps {
  /**
   * Mode tampilan:
   * - 'fullscreen': Overlay layar penuh dengan backdrop blur dan background GradientWaves.
   * - 'inline': Ditampilkan sebagai container mandiri.
   * - 'overlay': Menutupi container relatif parent.
   * - 'mini': Versi ringkas untuk card kecil.
   */
  mode?: 'fullscreen' | 'inline' | 'overlay' | 'mini';

  /**
   * Status aktif loading. Jika tidak dioper, dapat dikontrol via event global.
   */
  isLoading?: boolean;

  /**
   * Pesan teks (default: 'Tunggu sebentar').
   */
  message?: string;

  /**
   * Sub-keterangan (opsional, disembunyikan agar minimalis sesuai arahan desain).
   */
  subMessage?: string;

  /**
   * Warna gelombang kustom (opsional).
   */
  waveColor?: string;
  crestColor?: string;
  horizonColor?: string;

  /**
   * Apakah mendengarkan event global `data-fetch:start` & `data-fetch:end` pada window.
   */
  globalListener?: boolean;

  /**
   * Kelas tambahan.
   */
  className?: string;
}

export default function DataFetchLoader({
  mode = 'fullscreen',
  isLoading: propLoading,
  message: propMessage = 'Tunggu sebentar',
  subMessage: _propSubMessage,
  waveColor = '#8B5CF6',
  crestColor = '#06B6D4',
  horizonColor = '#15062C',
  globalListener = false,
  className = '',
}: DataFetchLoaderProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(propMessage);

  // Sinkronisasi dengan prop jika diberikan
  const active = propLoading !== undefined ? propLoading : internalLoading;

  useEffect(() => {
    if (propMessage) setCurrentMessage(propMessage);
  }, [propMessage]);

  // Listener event global & link navigation
  useEffect(() => {
    if (!globalListener || typeof window === 'undefined') return;

    const handleStart = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string; subMessage?: string }>;
      if (customEvent.detail?.message) setCurrentMessage(customEvent.detail.message);
      setInternalLoading(true);
    };

    const handleEnd = () => {
      setInternalLoading(false);
    };

    // Auto-listen to internal navigation links (bila user berpindah halaman)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      // Abaikan anchor link (#hash), target _blank, atau link eksternal
      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        target.target === '_blank' ||
        href.startsWith('http://') ||
        href.startsWith('https://')
      ) {
        return;
      }

      // Jangan tampilkan jika sudah di URL yang sama persis
      if (href === window.location.pathname) return;

      setCurrentMessage('Tunggu sebentar');
      setInternalLoading(true);

      // Auto dismiss safety timeout jika navigasi selesai atau dibatalkan
      setTimeout(() => {
        setInternalLoading(false);
      }, 4000);
    };

    window.addEventListener('data-fetch:start', handleStart);
    window.addEventListener('data-fetch:end', handleEnd);
    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('data-fetch:start', handleStart);
      window.removeEventListener('data-fetch:end', handleEnd);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, [globalListener]);

  // Kunci scrolling halaman saat fullscreen loader aktif
  useEffect(() => {
    if (active && mode === 'fullscreen' && typeof document !== 'undefined') {
      const originalBodyOverflow = document.body.style.overflow;
      const originalBodyTouch = document.body.style.touchAction;
      const originalHtmlOverflow = document.documentElement.style.overflow;

      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      document.documentElement.style.overflow = 'hidden';

      const preventScroll = (e: Event) => {
        e.preventDefault();
      };

      window.addEventListener('wheel', preventScroll, { passive: false });
      window.addEventListener('touchmove', preventScroll, { passive: false });

      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.body.style.touchAction = originalBodyTouch;
        document.documentElement.style.overflow = originalHtmlOverflow;

        window.removeEventListener('wheel', preventScroll);
        window.removeEventListener('touchmove', preventScroll);
      };
    }
  }, [active, mode]);

  if (!active && (mode === 'fullscreen' || mode === 'overlay')) {
    return null;
  }

  // Bersihkan trailing titik dari pesan agar animasi 3 titik rapi
  const rawText = currentMessage || 'Tunggu sebentar';
  const displayTitle = rawText.replace(/\.+$/, '').trim() || 'Tunggu sebentar';

  // --- KONTEN UTAMA HUD LOADER ---
  const loaderContent = (
    <div className="relative z-10 flex flex-col items-center justify-center p-6 sm:p-7 text-center max-w-sm sm:max-w-md mx-auto">
      {/* Looping Futuristic Cosmic Animated GIF */}
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center mb-3">
        {/* Ambient Radiant Glow Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-600/35 via-fuchsia-600/30 to-cyan-400/35 blur-xl pointer-events-none" />

        {/* Looping Cosmic Quantum GIF Indicator */}
        <img
          src="/images/cosmic-loader.gif"
          alt="Loading indicator"
          width={128}
          height={128}
          className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-[0_0_25px_rgba(168,85,247,0.7)] select-none pointer-events-none"
        />
      </div>

      {/* Main Title dengan Animasi Titik-Titik (. . .) */}
      <div className="flex items-center justify-center text-lg sm:text-xl font-bold text-white tracking-tight drop-shadow-md mb-4">
        <span>{displayTitle}</span>
        <span className="inline-flex items-center ml-1 space-x-1 text-cyan-400 font-black">
          <motion.span
            animate={{ opacity: [0.15, 1, 0.15], y: [0, -3.5, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: 0 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.15, 1, 0.15], y: [0, -3.5, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: 0.2 }}
          >
            .
          </motion.span>
          <motion.span
            animate={{ opacity: [0.15, 1, 0.15], y: [0, -3.5, 0] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: 0.4 }}
          >
            .
          </motion.span>
        </span>
      </div>

      {/* Neon Stream Progress Line */}
      <div className="w-44 sm:w-52 h-1.5 bg-[#120B24] rounded-full overflow-hidden border border-purple-500/30 relative">
        <motion.div
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-1/2 h-full bg-gradient-to-r from-transparent via-cyan-400 to-purple-400 rounded-full shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        />
      </div>
    </div>
  );

  // --- MODE 1: FULLSCREEN (Modal / Page Navigation) ---
  if (mode === 'fullscreen') {
    return (
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#080314]/90 backdrop-blur-xl select-none touch-none overscroll-none"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* React Bits Gradient Waves Background */}
            <div className="absolute inset-0 pointer-events-none opacity-90">
              <GradientWaves
                horizonColor={horizonColor}
                waveColor={waveColor}
                crestColor={crestColor}
                backgroundColor="#080314"
                speed={0.65}
                amplitude={2.7}
                waveScale={0.55}
                swell={35}
                turbulence={22}
                tilt={60}
                brightness={1.15}
                sheen={0.5}
                grain={0.15}
                quality="medium"
                dpr={1.5}
              />
            </div>

            {/* Dark Radial Mask for High Readability in Center */}
            <div className="absolute inset-0 bg-radial from-[#080314]/70 via-[#080314]/50 to-transparent pointer-events-none" />

            {/* Floating Holographic Central Card with Electric Border */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="relative z-10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(139,92,246,0.4)] backdrop-blur-2xl"
            >
              <ElectricBorder
                color="#06B6D4"
                glowColor="#A855F7"
                speed={1.2}
                chaos={0.8}
                thickness={2}
                borderRadius="1.5rem"
                className="rounded-3xl"
              >
                <div className="relative rounded-3xl bg-[#0F0822]/90 border border-purple-500/35 overflow-hidden">
                  {/* Top Accent Glowing Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2.5px] rounded-t-3xl"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${crestColor}, transparent)`,
                    }}
                  />
                  {loaderContent}
                </div>
              </ElectricBorder>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- MODE 2: OVERLAY (Didalam Container Tertentu yang sedang fetch) ---
  if (mode === 'overlay') {
    return (
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className={`absolute inset-0 z-30 flex items-center justify-center overflow-hidden rounded-3xl bg-[#080314]/85 backdrop-blur-md select-none touch-none ${className}`}
          >
            <div className="absolute inset-0 pointer-events-none opacity-85">
              <GradientWaves
                horizonColor={horizonColor}
                waveColor={waveColor}
                crestColor={crestColor}
                backgroundColor="#080314"
                speed={0.6}
                amplitude={2.5}
                waveScale={0.6}
                quality="low"
                dpr={1.25}
              />
            </div>
            {loaderContent}
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // --- MODE 3: INLINE (Komponen Section Mandiri) ---
  return (
    <div
      className={`relative w-full min-h-[380px] rounded-3xl overflow-hidden border border-purple-500/25 bg-[#0D071A]/95 shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex items-center justify-center ${className}`}
    >
      {/* Background Gradient Waves */}
      <div className="absolute inset-0 pointer-events-none opacity-90">
        <GradientWaves
          horizonColor={horizonColor}
          waveColor={waveColor}
          crestColor={crestColor}
          backgroundColor="#0D071A"
          speed={0.55}
          amplitude={2.5}
          waveScale={0.6}
          swell={30}
          turbulence={18}
          tilt={62}
          brightness={1.1}
          quality="medium"
          dpr={1.5}
        />
      </div>

      {/* Top Accent Glowing Line */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${crestColor}, transparent)`,
        }}
      />

      {/* Center Holographic HUD */}
      <div className="relative z-10 rounded-2xl bg-[#0F0822]/75 border border-purple-500/30 backdrop-blur-xl shadow-2xl">
        {loaderContent}
      </div>
    </div>
  );
}
