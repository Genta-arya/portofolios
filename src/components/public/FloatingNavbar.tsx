import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Menu, X, ArrowUpRight, Sparkles, Box, Zap } from 'lucide-react';
import Magnet from '../reactbits/Magnet';
import { useDisplayMode } from '../../lib/displayModeStore';

interface FloatingNavbarProps {
  currentPath?: string;
}

export default function FloatingNavbar({ currentPath = '/' }: FloatingNavbarProps) {
  const { mode, isLite, setMode } = useDisplayMode();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const navRef = useRef<HTMLElement>(null);

  // 3D Parallax Tilt Physics on Mouse Hover (Disabled on Lite Mode)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-40, 40], isLite ? [0, 0] : [5, -5]), {
    stiffness: 350,
    damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-350, 350], isLite ? [0, 0] : [-6, 6]), {
    stiffness: 350,
    damping: 25,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!navRef.current) return;
    const rect = navRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['hero', 'profile', 'experience', 'services', 'portfolio', 'tech-circular', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Profile', href: '/#profile', id: 'profile' },
    { label: 'Experience', href: '/#experience', id: 'experience' },
    { label: 'Services', href: '/#services', id: 'services' },
    { label: 'Portfolio', href: '/#portfolio', id: 'portfolio' },
    { label: 'Tech Stack', href: '/#tech-circular', id: 'tech-circular' },
    { label: 'Article', href: '/blog', isExternalPage: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full max-w-full z-50 flex justify-center px-4 py-3 sm:py-4 pointer-events-none [perspective:1200px] overflow-x-clip">
      <motion.nav
        ref={navRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className={`pointer-events-auto relative w-full max-w-5xl rounded-2xl sm:rounded-full transition-all duration-300 flex items-center justify-between px-4 sm:px-6 py-2 sm:py-2.5 ${
          scrolled
            ? 'bg-[#0E0720]/90 backdrop-blur-2xl border-t border-t-white/25 border-b-2 border-b-[#2E1065]/90 border-x border-purple-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(168,85,247,0.25),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-3px_6px_rgba(0,0,0,0.7)]'
            : 'bg-[#0C061C]/75 backdrop-blur-xl border-t border-t-white/15 border-b-2 border-b-[#1F0A43]/80 border-x border-purple-500/20 shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(168,85,247,0.15),inset_0_1px_1px_rgba(255,255,255,0.15)]'
        }`}
      >
        {/* Top 3D Specular Light Bevel Reflection */}
        <div className="absolute top-0 inset-x-8 sm:inset-x-16 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 via-purple-300/80 to-transparent pointer-events-none" />

        {/* Brand 3D Cube Logo & Identity */}
        <a href="/" className="flex items-center gap-2.5 group select-none [transform-style:preserve-3d]">
          {/* 3D Extruded Cube Gem Badge */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-800 via-purple-600 to-fuchsia-500 flex items-center justify-center border-t border-t-white/50 border-x border-purple-400/40 border-b-2 border-b-[#3B0764] shadow-[0_4px_0_#3B0764,0_8px_18px_rgba(168,85,247,0.5),inset_0_2px_3px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.5)] transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-[0_6px_0_#3B0764,0_12px_24px_rgba(192,132,252,0.65)] group-active:translate-y-0.5 group-active:shadow-[0_2px_0_#3B0764]">
            {/* Top Shine Flare */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/30 via-transparent to-black/30 pointer-events-none" />
            <span className="relative z-10 font-black text-white text-base sm:text-lg tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              G
            </span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-extrabold tracking-tight text-white group-hover:text-purple-200 transition-colors drop-shadow-sm flex items-center gap-1.5">
              <span>Gentha Arya</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
            </span>
            <span className="text-[10px] text-purple-300/80 font-mono tracking-wider -mt-0.5">Fullstack Dev</span>
          </div>
        </a>

        {/* Desktop 3D Navigation Inset Trench */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#070312]/85 border border-purple-500/25 shadow-[inset_0_2px_6px_rgba(0,0,0,0.95),0_1px_0_rgba(255,255,255,0.08)] [transform-style:preserve-3d]">
          {navLinks.map((link) => {
            const isActive = link.isExternalPage
              ? currentPath.startsWith('/blog')
              : activeSection === link.id;

            return (
              <a
                key={link.label}
                href={link.href}
                className={`relative px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 select-none ${
                  isActive
                    ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {/* 3D Elevated Active Pill with Crisp Edge Lighting */}
                {isActive && (
                  <motion.div
                    layoutId="activeNavPill"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-b from-purple-500/60 via-purple-600/45 to-fuchsia-600/35 border-t border-t-white/40 border-b border-b-purple-900/80 border-x border-purple-400/40 shadow-[0_4px_14px_rgba(168,85,247,0.5),inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_-1px_2px_rgba(0,0,0,0.5)] -z-10"
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Desktop Mode Toggle & 3D Tactile Push-Button ("Let's Talk") */}
        <div className="hidden md:flex items-center gap-2.5 [transform-style:preserve-3d]">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-mode-modal'))}
            className={`px-3 py-1.5 rounded-full border text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLite
                ? 'bg-[#120B24]/90 border-cyan-500/35 text-cyan-300 hover:border-cyan-400'
                : 'bg-[#120B24]/90 border-purple-500/35 text-purple-300 hover:border-purple-400'
            }`}
            title="Ubah Mode Tampilan (3D / Ringan)"
          >
            {isLite ? <Zap className="w-3 h-3 text-cyan-400" /> : <Box className="w-3 h-3 text-purple-400" />}
            <span>{isLite ? 'Ringan' : '3D'}</span>
          </button>

          <Magnet magnetStrength={0.2}>
            <a
              href="/#contact"
              className="relative group inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full text-xs font-extrabold text-white tracking-wide cursor-pointer select-none bg-gradient-to-b from-fuchsia-500 via-purple-600 to-indigo-700 border-t border-t-white/45 border-x border-purple-400/30 border-b-2 border-b-[#4A154B] shadow-[0_4px_0_#4A154B,0_8px_20px_rgba(168,85,247,0.45),inset_0_1px_1px_rgba(255,255,255,0.45)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_0_#4A154B,0_12px_26px_rgba(192,132,252,0.6)] active:translate-y-1 active:shadow-[0_1px_0_#4A154B,0_4px_10px_rgba(168,85,247,0.4)]"
            >
              {/* Shimmer flare line on button face */}
              <div className="absolute top-0 inset-x-3 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent pointer-events-none" />
              <span>Let&apos;s Talk</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-fuchsia-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </Magnet>
        </div>

        {/* Mobile Menu 3D Toggle Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen((prev) => !prev);
          }}
          aria-label="Toggle Navigation Menu"
          aria-expanded={mobileMenuOpen}
          className="md:hidden relative z-30 p-2.5 rounded-xl bg-[#140A28] border-t border-t-white/25 border-b-2 border-b-[#2E1065] border-x border-purple-500/35 text-purple-300 hover:text-white active:scale-95 transition-transform cursor-pointer shadow-[0_3px_0_#2E1065,0_6px_15px_rgba(0,0,0,0.6)]"
        >
          {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-purple-300" />}
        </button>
      </motion.nav>

      {/* Mobile 3D Suspended Glass Menu - Rendered with AnimatePresence & pointer-events-auto */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden pointer-events-auto">
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Menu Container Card */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="absolute top-20 inset-x-4 max-w-lg mx-auto bg-[#0D071E]/95 backdrop-blur-2xl rounded-3xl p-5 border-t border-t-white/25 border-b-2 border-b-[#2E1065] border-x border-purple-500/35 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(168,85,247,0.3)] flex flex-col gap-2 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-purple-500/20 mb-1">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Navigasi Menu</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {navLinks.map((link) => {
                const isActive = link.isExternalPage
                  ? currentPath.startsWith('/blog')
                  : activeSection === link.id;

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 text-sm font-semibold rounded-2xl border transition-all ${
                      isActive
                        ? 'bg-purple-600/30 text-white border-purple-500/50 shadow-md'
                        : 'text-zinc-300 hover:text-white bg-[#140A28]/60 border-purple-500/15 hover:border-purple-500/35'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  window.dispatchEvent(new CustomEvent('open-mode-modal'));
                }}
                className="w-full text-center py-3 rounded-2xl text-xs font-bold bg-[#140A28] border border-purple-500/30 text-purple-300 hover:text-white flex items-center justify-center gap-2 mt-1 cursor-pointer transition-colors"
              >
                {isLite ? <Zap className="w-3.5 h-3.5 text-cyan-400" /> : <Box className="w-3.5 h-3.5 text-purple-400" />}
                <span>Mode Tampilan: {isLite ? 'Ringan (Fast)' : '3D Imersif'}</span>
              </button>

              <a
                href="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3.5 rounded-2xl text-sm font-bold bg-gradient-to-b from-fuchsia-500 via-purple-600 to-indigo-700 text-white border-t border-t-white/30 border-b-2 border-b-[#3B0764] shadow-[0_4px_0_#3B0764,0_10px_20px_rgba(168,85,247,0.4)] mt-2 active:scale-95 transition-transform"
              >
                Let&apos;s Talk ↗
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}

