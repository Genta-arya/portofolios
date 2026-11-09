import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import CircularCarousel from '../reactbits/CircularCarousel';
import ShinyText from '../reactbits/ShinyText';
import { useDisplayMode } from '../../lib/displayModeStore';
import {
  siReact,
  siAndroid,
  siFlutter,
  siMysql,
  siExpress,
  siNextdotjs,
  siTypescript,
  siKotlin,
  siTailwindcss,
  siAstro,
  siNodedotjs,
} from 'simple-icons';

interface TechItemConfig {
  name: string;
  category: string;
  description: string;
  hex: string;
  svgPath: string;
  badge: string;
}

const techItems: TechItemConfig[] = [
  {
    name: 'React JS',
    category: 'Frontend Library',
    description: 'Arsitektur komponen modular & reaktif untuk web modern',
    hex: '61DAFB',
    svgPath: siReact.path,
    badge: 'Core Stack',
  },
  {
    name: 'React Native',
    category: 'Mobile Cross-Platform',
    description: 'Pengembangan mobile Android performa native dengan 1 basis kode',
    hex: '00D8FF',
    svgPath: siReact.path,
    badge: 'Mobile Pro',
  },
  {
    name: 'Android',
    category: 'Mobile Operating System',
    description: 'Arsitektur aplikasi mobile Android SDK, background service & APK',
    hex: '3DDC84',
    svgPath: siAndroid.path,
    badge: 'Production Ready',
  },
  {
    name: 'Flutter',
    category: 'Mobile & Multiplatform',
    description: 'UI toolkit fleksibel dengan render engine Skia/Impeller cepat',
    hex: '02569B',
    svgPath: siFlutter.path,
    badge: 'Modern UI',
  },
  {
    name: 'MySQL',
    category: 'Relational Database',
    description: 'Database relasional terstruktur, query ACID compliant, & optimasi index',
    hex: '4479A1',
    svgPath: siMysql.path,
    badge: 'Enterprise DB',
  },
  {
    name: 'Express JS',
    category: 'Backend Framework',
    description: 'REST API berkinerja tinggi, middleware auth, & microservices',
    hex: 'A855F7',
    svgPath: siExpress.path,
    badge: 'High Speed API',
  },
  {
    name: 'Next.js',
    category: 'Fullstack React & SSR',
    description: 'Server Components, SSR/SSG, SEO teroptimasi, & API routes',
    hex: 'E2E8F0',
    svgPath: siNextdotjs.path,
    badge: 'Fullstack Pro',
  },
  {
    name: 'TypeScript',
    category: 'Type-Safe Programming',
    description: 'Static type checking ketat untuk meminimalkan bug enterprise',
    hex: '3178C6',
    svgPath: siTypescript.path,
    badge: 'Clean Code',
  },
  {
    name: 'Kotlin',
    category: 'Modern Android Language',
    description: 'Bahasa resmi Android dengan coroutines & Jetpack Architecture',
    hex: '7F52FF',
    svgPath: siKotlin.path,
    badge: 'Native Android',
  },
  {
    name: 'Tailwind CSS',
    category: 'Utility-First CSS',
    description: 'Styling responsif kilat bertema cosmic nebula & modern glassmorphism',
    hex: '06B6D4',
    svgPath: siTailwindcss.path,
    badge: 'Modern UI/UX',
  },
  {
    name: 'Astro 5',
    category: 'Island Architecture',
    description: 'Zero JS by default, loading instan, dan integrasi multi-framework',
    hex: 'FF5D01',
    svgPath: siAstro.path,
    badge: 'Lightning Fast',
  },
  {
    name: 'Node.js',
    category: 'Backend Runtime',
    description: 'Event-driven asynchronous I/O engine untuk backend terukur',
    hex: '5FA04E',
    svgPath: siNodedotjs.path,
    badge: 'Scalable Engine',
  },
];

export default function TechCircularShowcase() {
  const { isLite } = useDisplayMode();
  const [activeTechIndex, setActiveTechIndex] = useState(0);
  const activeTech = techItems[activeTechIndex] || techItems[0];

  return (
    <section id="tech-circular" className="py-24 relative overflow-hidden max-w-full">
      {/* Background Ambient Cosmic Glows - Clipped for mobile overflow safety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] max-w-none h-[550px] bg-gradient-to-r from-purple-700/25 via-cyan-600/20 to-fuchsia-600/25 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
            <ShinyText text="Eksplorasi Teknologi" speed={1.7} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ekosistem Stack &amp; Tools Unggulan
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3">
            Fondasi teknologi modern dan arsitektur perangkat lunak yang digunakan dalam membangun solusi web, mobile, dan database andal.
          </p>
        </motion.div>

        {/* Carousel: 3D Cylindrical Ring on 3D Mode, or Smooth 2D Grid on Lite Mode */}
        {!isLite ? (
          <CircularCarousel
            radius={340}
            mobileRadius={210}
            autoRotateSpeed={0.25}
            autoRotate={true}
            showControls={false}
            pauseOnHover={false}
            onActiveChange={(idx) => setActiveTechIndex(idx)}
          >
            {techItems.map((tech, idx) => {
              const isActive = idx === activeTechIndex;
              const brandColor = `#${tech.hex}`;

              return (
                <div
                  key={tech.name}
                  className={`relative w-44 sm:w-48 h-56 sm:h-60 rounded-3xl p-5 flex flex-col items-center justify-between text-center transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-b from-[#1A0C35] via-[#110724] to-[#070312] border-2 border-purple-400 shadow-[0_0_35px_rgba(168,85,247,0.5)] scale-105'
                      : 'bg-[#0E061E] border border-purple-500/30 hover:border-purple-400/60 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  <div
                    className="absolute top-0 left-4 right-4 h-[2px] rounded-full"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${brandColor}, transparent)`,
                    }}
                  />
                  <div className="w-full flex justify-center">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide border shadow-sm"
                      style={{
                        backgroundColor: `${brandColor}18`,
                        color: brandColor,
                        borderColor: `${brandColor}40`,
                      }}
                    >
                      {tech.badge}
                    </span>
                  </div>
                  <div className="relative my-auto flex items-center justify-center">
                    <div
                      className="absolute w-14 h-14 rounded-full blur-xl pointer-events-none opacity-60"
                      style={{ backgroundColor: brandColor }}
                    />
                    <div className="relative z-10 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      <svg
                        viewBox="0 0 24 24"
                        className="w-full h-full drop-shadow-md"
                        fill={brandColor}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d={tech.svgPath} />
                      </svg>
                    </div>
                  </div>
                  <div className="w-full">
                    <h4 className="text-base sm:text-lg font-extrabold text-white tracking-tight mb-0.5 drop-shadow">
                      {tech.name}
                    </h4>
                    <p className="text-[11px] text-zinc-400 font-medium line-clamp-1">
                      {tech.category}
                    </p>
                  </div>
                </div>
              );
            })}
          </CircularCarousel>
        ) : (
          /* 2D Flat Tech Showcase Grid in Lite Mode (Zero 3D perspective / 0% CPU strain) */
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {techItems.map((tech) => {
              const brandColor = `#${tech.hex}`;
              return (
                <div
                  key={tech.name}
                  className="p-4 rounded-2xl bg-[#0D0818]/90 border border-purple-500/25 flex flex-col items-center justify-between text-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:border-purple-400/50"
                >
                  <span
                    className="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide border"
                    style={{
                      backgroundColor: `${brandColor}18`,
                      color: brandColor,
                      borderColor: `${brandColor}40`,
                    }}
                  >
                    {tech.badge}
                  </span>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-8 h-8"
                      fill={brandColor}
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d={tech.svgPath} />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white tracking-tight">{tech.name}</div>
                    <div className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">{tech.category}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Active Tech Telemetry Detail Bar */}
        <motion.div
          key={activeTech.name}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-[#0D071D] border border-purple-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{
                backgroundColor: `#${activeTech.hex}15`,
                borderColor: `#${activeTech.hex}40`,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill={`#${activeTech.hex}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d={activeTech.svgPath} />
              </svg>
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-bold text-white">{activeTech.name}</span>
                <span className="text-[11px] text-purple-300 font-mono">({activeTech.category})</span>
              </div>
              <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                {activeTech.description}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-wrap items-center justify-center gap-2">
            <a
              href="#tech-galaxy-stage"
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById('tech-galaxy-stage');
                if (target) {
                  const navbarHeight = 85;
                  const targetTop =
                    target.getBoundingClientRect().top +
                    window.pageYOffset -
                    navbarHeight;
                  window.scrollTo({
                    top: Math.max(0, targetTop),
                    behavior: 'smooth',
                  });
                }
              }}
              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-purple-200 hover:text-white px-3.5 py-1.5 rounded-full bg-purple-950/70 hover:bg-purple-800/60 border border-purple-500/40 transition-all shadow-sm cursor-pointer"
            >
              <span>Buka di Orbit</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-purple-400" />
            </a>

            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Terverifikasi</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

