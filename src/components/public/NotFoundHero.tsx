import React from 'react';
import { motion } from 'framer-motion';
import { Home, Compass, ArrowLeft, Terminal, ShieldAlert } from 'lucide-react';
import Orb from '../reactbits/Orb';
import FuzzyText from '../reactbits/FuzzyText';
import ElectricBorder from '../reactbits/ElectricBorder';

export default function NotFoundHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-20 px-4 overflow-hidden select-none">
      {/* 1. React Bits Orb Background (Swirling WebGL Cosmic Plasma Ring) */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[340px] h-[340px] sm:w-[580px] sm:h-[580px] lg:w-[750px] lg:h-[750px] opacity-90 transition-opacity duration-700">
          <Orb
            hue={275}
            hoverIntensity={0.85}
            rotateOnHover={true}
            forceHoverState={false}
            className="w-full h-full"
          />
        </div>

        {/* Ambient Vignette Overlay */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#05030A]/60 to-[#05030A]" />
      </div>

      {/* 2. Interactive Foreground Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
        {/* Status Beacon Pill */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/50 border border-red-500/40 text-red-300 text-xs font-mono font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(239,68,68,0.25)]"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
          <span>Sinyal Hilang // Status 404</span>
        </motion.div>

        {/* Main 404 Title with React Bits FuzzyText (TV Static / Analog Jitter) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="my-2"
        >
          <FuzzyText
            text="404"
            fontSize="clamp(5.5rem, 18vw, 12rem)"
            fontWeight={950}
            color="#FFFFFF"
            baseIntensity={0.2}
            hoverIntensity={0.7}
            enableHover={true}
            className="filter drop-shadow-[0_0_40px_rgba(168,85,247,0.7)]"
          />
        </motion.div>

        {/* Subtitle with FuzzyText */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <FuzzyText
            text="HALAMAN TIDAK DITEMUKAN"
            fontSize="clamp(1.1rem, 3.5vw, 1.8rem)"
            fontWeight={800}
            color="#C084FC"
            baseIntensity={0.12}
            hoverIntensity={0.5}
            enableHover={true}
            className="tracking-wider"
          />
        </motion.div>

        {/* Description paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-sm sm:text-base text-zinc-300 max-w-md mx-auto leading-relaxed mb-8"
        >
          Koordinat atau rute yang Anda tuju berada di luar jangkauan radar, telah dipindahkan, atau belum pernah dibuat dalam semesta ini.
        </motion.p>

        {/* Action Panel with ElectricBorder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-md"
        >
          <ElectricBorder
            color="#A855F7"
            glowColor="#06B6D4"
            speed={1.2}
            chaos={0.8}
            thickness={2}
            borderRadius="1.25rem"
            className="rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0D071D] border border-purple-500/30 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="/"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-violet-700 text-white text-xs font-bold shadow-lg shadow-purple-600/35 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                <span>Kembali ke Beranda</span>
              </a>

              <a
                href="/#portfolio"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#150A2E] hover:bg-[#1E0F3D] text-purple-200 hover:text-white border border-purple-500/30 text-xs font-semibold hover:border-purple-400 transition-all duration-200"
              >
                <Compass className="w-4 h-4 text-purple-400" />
                <span>Jelajahi Portofolio</span>
              </a>
            </div>
          </ElectricBorder>
        </motion.div>

        {/* Terminal Telemetry Footer Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="mt-8 flex items-center gap-3 text-[11px] font-mono text-zinc-500"
        >
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>ERR_ROUTE_NOT_FOUND</span>
          </div>
          <span>•</span>
          <span>HTTP 404</span>
        </motion.div>
      </div>
    </section>
  );
}

