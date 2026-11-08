import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Box, Smartphone, Check, SlidersHorizontal, X } from 'lucide-react';
import { useDisplayMode, type DisplayMode } from '../../lib/displayModeStore';

export default function ModeSelectionModal() {
  const { mode, setMode, isLite, hasChosen } = useDisplayMode();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Jika belum memilih mode di localStorage, buka modal otomatis
    const saved = localStorage.getItem('gentha_display_mode');
    if (!saved) {
      // Sedikit jeda 400ms agar halaman mulai ter-mount dengan halus
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, []);

  // Dengarkan trigger jika user ingin ganti mode dari mana saja
  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-mode-modal', handleOpen);
    return () => window.removeEventListener('open-mode-modal', handleOpen);
  }, []);

  const selectMode = (newMode: DisplayMode) => {
    setMode(newMode);
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating Mode Toggle Pill at Bottom-Left (disembunyikan saat modal terbuka) */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="fixed bottom-6 left-6 z-40"
        >
          <button
            onClick={() => setIsOpen(true)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border backdrop-blur-xl shadow-lg transition-all duration-300 text-xs font-semibold cursor-pointer group hover:scale-105 ${
              isLite
                ? 'bg-[#120B24]/90 border-cyan-500/40 text-cyan-300 shadow-cyan-950/40 hover:border-cyan-400'
                : 'bg-[#0D0818]/90 border-purple-500/40 text-purple-300 shadow-purple-950/40 hover:border-purple-400'
            }`}
            title="Klik untuk mengubah mode tampilan (3D / Ringan)"
          >
            {isLite ? (
              <>
                <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Mode: Ringan</span>
              </>
            ) : (
              <>
                <Box className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-12 transition-transform" />
                <span>Mode: 3D Imersif</span>
              </>
            )}
            <SlidersHorizontal className="w-3 h-3 text-zinc-500 group-hover:text-zinc-300 ml-0.5" />
          </button>
        </motion.div>
      )}

      {/* Backdrop & Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => {
                // Hanya izinkan tutup backdrop jika user sudah pernah memilih sebelumnya
                if (hasChosen) setIsOpen(false);
              }}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9998]"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-gradient-to-b from-[#160B2C] via-[#0E071D] to-[#070310] border border-purple-500/40 rounded-3xl p-5 sm:p-8 shadow-[0_25px_70px_rgba(139,92,246,0.45)] z-[9999] my-auto"
            >
              {/* Close Button at Top Right */}
              {hasChosen && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer z-30"
                  aria-label="Tutup"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              {/* Subtle Ambient Radial Glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

              {/* Header */}
              <div className="text-center mb-6 sm:mb-8 relative pr-6 sm:pr-0">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />
                  <span>Kustomisasi Pengalaman</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Pilih Mode Tampilan Portofolio
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-md mx-auto">
                  Sesuaikan kenyamanan visual sesuai spesifikasi perangkat Anda untuk pengalaman terbaik.
                </p>
              </div>

              {/* Two Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
                
                {/* 1. Mode 3D Imersif */}
                <div
                  onClick={() => selectMode('3d')}
                  className={`group relative p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] ${
                    mode === '3d'
                      ? 'bg-gradient-to-b from-purple-900/40 to-fuchsia-950/40 border-purple-400 shadow-[0_10px_30px_rgba(168,85,247,0.25)] ring-1 ring-purple-400'
                      : 'bg-[#120B24]/70 border-purple-500/20 hover:border-purple-400/60 hover:bg-[#160D2E]/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                        <Box className="w-6 h-6 text-purple-400" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        PC / Laptop
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                      <span>Mode 3D Imersif</span>
                      {mode === '3d' && <Check className="w-4 h-4 text-purple-400" />}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Efek visual 3D penuh, kartu ID lanyard bersimulasi fisika, galaksi orbit 3D, serta tilt card interaktif.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-purple-500/15">
                    <button
                      type="button"
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        mode === '3d'
                          ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md shadow-purple-600/40'
                          : 'bg-purple-600/20 text-purple-300 hover:bg-purple-600 hover:text-white'
                      }`}
                    >
                      Pilih Mode 3D
                    </button>
                  </div>
                </div>

                {/* 2. Mode Ringan (Lite) */}
                <div
                  onClick={() => selectMode('lite')}
                  className={`group relative p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between hover:scale-[1.02] ${
                    mode === 'lite'
                      ? 'bg-gradient-to-b from-cyan-950/40 to-blue-950/40 border-cyan-400 shadow-[0_10px_30px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                      : 'bg-[#120B24]/70 border-purple-500/20 hover:border-cyan-400/60 hover:bg-[#160D2E]/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6 text-cyan-400" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Ringan &amp; Cepat
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white mb-1.5 flex items-center gap-2">
                      <span>Mode Ringan</span>
                      {mode === 'lite' && <Check className="w-4 h-4 text-cyan-400" />}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Desain flat 2D modern super cepat tanpa efek 3D berat. Bebas lag/ngeframe, hemat baterai, dan loading instan di semua perangkat.
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-purple-500/15">
                    <button
                      type="button"
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all ${
                        mode === 'lite'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/40'
                          : 'bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600 hover:text-white'
                      }`}
                    >
                      Pilih Mode Ringan
                    </button>
                  </div>
                </div>

              </div>

              {/* Footer Note */}
              <div className="text-center pt-2 border-t border-purple-500/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-400">
                <span>💡 Pilihan dapat diubah kapan saja melalui tombol di pojok kiri bawah.</span>
                {hasChosen && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="mt-2 sm:mt-0 text-purple-400 hover:text-white underline cursor-pointer"
                  >
                    Tutup
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

