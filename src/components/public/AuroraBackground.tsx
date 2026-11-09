import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import Prism from '../reactbits/Prism';
import { useDisplayMode } from '../../lib/displayModeStore';

interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

export default function AuroraBackground() {
  const { isLite } = useDisplayMode();
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<StarParticle[]>([]);

  // Raw mouse coordinates (-35 to +35 range)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Layered 3D Parallax Springs with differentiated physics
  const deepSpringX = useSpring(mouseX, { stiffness: 25, damping: 26 });
  const deepSpringY = useSpring(mouseY, { stiffness: 25, damping: 26 });
  const deepX = useTransform(deepSpringX, (v) => v * 0.3);
  const deepY = useTransform(deepSpringY, (v) => v * 0.3);

  const midSpringX = useSpring(mouseX, { stiffness: 45, damping: 22 });
  const midSpringY = useSpring(mouseY, { stiffness: 45, damping: 22 });
  const midX = useTransform(midSpringX, (v) => v * 0.7);
  const midY = useTransform(midSpringY, (v) => v * 0.7);

  const nearSpringX = useSpring(mouseX, { stiffness: 65, damping: 20 });
  const nearSpringY = useSpring(mouseY, { stiffness: 65, damping: 20 });
  const nearX = useTransform(nearSpringX, (v) => v * 1.1);
  const nearY = useTransform(nearSpringY, (v) => v * 1.1);

  const dustSpringX = useSpring(mouseX, { stiffness: 50, damping: 18 });
  const dustSpringY = useSpring(mouseY, { stiffness: 50, damping: 18 });
  const dustX = useTransform(dustSpringX, (v) => v * -1.3);
  const dustY = useTransform(dustSpringY, (v) => v * -1.3);

  useEffect(() => {
    setMounted(true);

    const colors = ['#FFFFFF', '#C084FC', '#F472B6', '#67E8F9', '#A5B4FC', '#FDE047'];
    const generated: StarParticle[] = Array.from({ length: 36 }, (_, i) => ({
      id: i,
      x: Math.floor((i * 3.3 + (i % 7) * 11) % 98) + 1,
      y: Math.floor((i * 4.9 + (i % 5) * 17) % 96) + 2,
      size: i % 4 === 0 ? 3.0 : i % 2 === 0 ? 2.0 : 1.3,
      opacity: 0.45 + (i % 5) * 0.12,
      duration: 3.2 + (i % 4) * 1.1,
      delay: (i % 6) * 0.7,
      color: colors[i % colors.length],
    }));
    setParticles(generated);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth - 0.5) * 70;
      const yPercent = (e.clientY / innerHeight - 0.5) * 70;
      mouseX.set(xPercent);
      mouseY.set(yPercent);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  if (isLite) {
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#070312]">
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-purple-700/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[400px] bg-cyan-700/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#070312]">
      {/* ---------------- REACT BITS: PRISM SPECTRAL BACKGROUND ---------------- */}
      {mounted && (
        <Prism
          className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
          speed={0.4}
          intensity={0.45}
          rainbowSpread={1.1}
        />
      )}

      {/* ---------------- 1. DEEP VIBRANT NEBULA TIER ---------------- */}
      <motion.div
        style={{ x: mounted ? deepX : 0, y: mounted ? deepY : 0 }}
        className="absolute inset-0 will-change-transform pointer-events-none"
      >
        {/* Vibrant Cosmic Purple & Violet Nebula (Top-Left) */}
        <motion.div
          animate={{
            x: [0, 45, -35, 0],
            y: [0, -35, 30, 0],
            scale: [1, 1.18, 0.94, 1],
          }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-32 -left-32 w-[720px] h-[720px] rounded-full bg-gradient-to-tr from-purple-600/50 via-violet-600/40 to-violet-900/35 blur-[95px] opacity-85"
        />

        {/* Luminous Magenta & Cosmic Rose Horizon (Bottom) */}
        <motion.div
          animate={{
            x: [0, 50, -45, 0],
            y: [0, -30, 25, 0],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute -bottom-40 left-1/5 w-[900px] h-[620px] rounded-full bg-gradient-to-tr from-purple-700/50 via-fuchsia-600/40 to-violet-950/35 blur-[105px] opacity-80"
        />
      </motion.div>

      {/* ---------------- 2. MIDGROUND FLUID AURORA TIER (Dynamic Northern Beams) ---------------- */}
      <motion.div
        style={{ x: mounted ? midX : 0, y: mounted ? midY : 0 }}
        className="absolute inset-0 will-change-transform pointer-events-none"
      >
        {/* Northern Arctic Cyan / Emerald Aurora Ribbon (Top-Right) */}
        <motion.div
          animate={{
            x: [0, -55, 40, 0],
            y: [0, 40, -30, 0],
            scale: [1, 1.22, 0.92, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute -top-20 right-[4%] w-[640px] h-[640px] rounded-full bg-gradient-to-bl from-cyan-400/45 via-emerald-400/30 to-purple-600/35 blur-[85px] opacity-85"
        />

        {/* Glowing Fuchsia & Hot Pink Solar Pulse Wave (Center-Left) */}
        <motion.div
          animate={{
            x: [0, 45, -50, 0],
            y: [0, 35, -40, 0],
            scale: [1, 1.18, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
          className="absolute top-1/3 left-1/3 -translate-x-1/2 w-[780px] h-[780px] rounded-full bg-violet-900/30 blur-[95px] opacity-85"
        />

        {/* Electric Indigo & Cyan Ambient Beam (Mid-Right) */}
        <motion.div
          animate={{
            x: [0, -40, 35, 0],
            y: [0, -40, 35, 0],
            scale: [0.95, 1.12, 1, 0.95],
          }}
          transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
          className="absolute top-1/2 -right-28 w-[680px] h-[680px] rounded-full bg-gradient-to-tl from-violet-600/40 via-purple-600/35 to-cyan-500/25 blur-[90px] opacity-85"
        />

        {/* Sweeping Aurora Curtains Across Header and Middle */}
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-purple-600/25 via-fuchsia-600/15 to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-0 right-0 h-48 bg-violet-900/20 blur-[60px] pointer-events-none" />
      </motion.div>

      {/* ---------------- 3. NEAR LIGHT BEAM TIER (Mouse Responsive Flare) ---------------- */}
      <motion.div
        style={{ x: mounted ? nearX : 0, y: mounted ? nearY : 0 }}
        className="absolute inset-0 will-change-transform pointer-events-none"
      >
        <motion.div
          animate={{
            opacity: [0.45, 0.75, 0.45],
            scale: [0.95, 1.08, 0.95],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/2 w-[520px] h-[520px] rounded-full bg-violet-900/25 blur-[80px]"
        />
      </motion.div>

      {/* ---------------- 4. FOREGROUND COSMIC STARDUST (Reverse 3D Parallax) ---------------- */}
      {mounted && (
        <motion.div
          style={{ x: dustX, y: dustY }}
          className="absolute inset-0 will-change-transform pointer-events-none"
        >
          {particles.map((p) => (
            <motion.div
              key={p.id}
              animate={{
                opacity: [p.opacity * 0.4, p.opacity, p.opacity * 0.4],
                y: [0, -22, 0],
                scale: [0.8, 1.3, 0.8],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                delay: p.delay,
                ease: 'easeInOut',
              }}
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
              }}
              className="absolute rounded-full"
            />
          ))}
        </motion.div>
      )}

      {/* ---------------- 5. TECH DOT GRID OVERLAY ---------------- */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  );
}
