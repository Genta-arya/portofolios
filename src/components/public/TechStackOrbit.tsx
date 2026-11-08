import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code,
  Sparkles,
  Layers,
  Cpu,
  Database,
  Smartphone,
  Globe,
  Cloud,
  X,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import TechGalaxy3D from '../three/TechGalaxy3D';
import ElectricBorder from '../reactbits/ElectricBorder';
import BounceCards from '../reactbits/BounceCards';
import CardSwap from '../reactbits/CardSwap';
import TechLogo from '../ui/TechLogo';
import { useDisplayMode } from '../../lib/displayModeStore';

export interface TechItem {
  id?: number;
  name: string;
  roleLabel?: string | null;
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'devops';
  glowColor?: string | null;
}

interface TechStackOrbitProps {
  initialTechs?: TechItem[];
}

const techDescriptions: Record<string, string> = {
  'React JS': 'Framework frontend untuk membangun antarmuka web yang interaktif, modular, dan responsif.',
  'TypeScript': 'Menambahkan type safety pada JavaScript untuk menjaga kualitas kode dan meminimalkan error.',
  'Astro 5': 'Framework web modern berarsitektur Islands untuk performa loading yang sangat cepat dan efisien.',
  'Next.js': 'Framework React untuk aplikasi web dengan Server-Side Rendering (SSR) dan performa optimal.',
  'Tailwind CSS': 'Utility-first CSS framework untuk styling cepat, responsif, dan konsisten di berbagai perangkat.',
  'Node.js': 'Runtime JavaScript untuk membangun layanan backend dan REST API yang andal.',
  'Express JS': 'Framework web backend minimalis untuk pembuatan REST API yang terstruktur.',
  'Drizzle ORM': 'ORM TypeScript yang ringan dan cepat untuk mengelola query database dengan type safety.',
  'MySQL': 'Sistem manajemen database relasional yang stabil untuk penyimpanan data terstruktur.',
  'React Native': 'Framework untuk membangun aplikasi mobile multiplatform dengan performa native.',
  'Kotlin': 'Bahasa pemrograman resmi untuk pengembangan aplikasi Android native berkinerja tinggi.',
  'Cloudinary': 'Layanan cloud untuk optimasi, hosting, dan pengelolaan aset gambar serta media secara otomatis.',
};

export default function TechStackOrbit({ initialTechs }: TechStackOrbitProps) {
  const { isLite } = useDisplayMode();
  const [activeTab, setActiveTab] = useState<'all' | 'frontend' | 'backend' | 'mobile' | 'database' | 'devops'>('all');
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);
  const orbitContainerRef = useRef<HTMLDivElement>(null);

  const defaultTechs: TechItem[] = [
    { name: 'React JS', roleLabel: 'Frontend UI', category: 'frontend', glowColor: '#61DAFB' },
    { name: 'TypeScript', roleLabel: 'Type Safety', category: 'frontend', glowColor: '#3178C6' },
    { name: 'Astro 5', roleLabel: 'Meta-Framework', category: 'frontend', glowColor: '#FF5D01' },
    { name: 'Next.js', roleLabel: 'Fullstack React', category: 'frontend', glowColor: '#FFFFFF' },
    { name: 'Tailwind CSS', roleLabel: 'Modern Styling', category: 'frontend', glowColor: '#38BDF8' },
    { name: 'Node.js', roleLabel: 'Runtime Engine', category: 'backend', glowColor: '#22C55E' },
    { name: 'Express JS', roleLabel: 'REST API', category: 'backend', glowColor: '#A855F7' },
    { name: 'Drizzle ORM', roleLabel: 'High-Speed ORM', category: 'backend', glowColor: '#C5F74F' },
    { name: 'MySQL', roleLabel: 'Relational DB', category: 'database', glowColor: '#00758F' },
    { name: 'React Native', roleLabel: 'Mobile Android', category: 'mobile', glowColor: '#00D8FF' },
    { name: 'Kotlin', roleLabel: 'Native Android', category: 'mobile', glowColor: '#7F52FF' },
    { name: 'Cloudinary', roleLabel: 'Media CDN', category: 'devops', glowColor: '#3448C5' },
  ];

  const items = initialTechs && initialTechs.length > 0 ? initialTechs : defaultTechs;

  const categories = [
    { id: 'all', label: 'All Stacks', icon: Compass },
    { id: 'frontend', label: 'Frontend', icon: Globe },
    { id: 'backend', label: 'Backend', icon: Cpu },
    { id: 'mobile', label: 'Mobile', icon: Smartphone },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'devops', label: 'Cloud & Tools', icon: Cloud },
  ];

  const filtered = activeTab === 'all'
    ? items
    : items.filter((t) => t.category === activeTab);

  // Smooth scroll directly to the 3D Galaxy Orbit stage
  const scrollToOrbit = () => {
    if (orbitContainerRef.current) {
      const navbarHeight = 85;
      const targetTop =
        orbitContainerRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        navbarHeight;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth',
      });
    }
  };

  // Handle tech selection from 3D canvas or direct interaction
  const handleSelectTech = (tech: TechItem) => {
    if (selectedTech?.name === tech.name) {
      setSelectedTech(null); // Toggle off if clicked again
    } else {
      setSelectedTech(tech);
    }
  };

  // Handle tech selection from card deck click with auto-scroll to 3D orbit
  const handleCardClick = (tech: TechItem) => {
    setSelectedTech(tech);
    scrollToOrbit();
  };

  return (
    <section id="tech-stack" className="py-24 relative overflow-hidden max-w-full">
      {/* Background ambient lighting - Clipped for mobile overflow safety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-w-none h-[700px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Keahlian &amp; Teknologi</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Teknologi &amp; Alat Pengembangan
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3 leading-relaxed">
            Daftar teknologi, framework, dan tools yang saya gunakan untuk membangun sistem web dan aplikasi mobile yang cepat dan andal.
          </p>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((c) => {
              const Icon = c.icon;
              const isActive = activeTab === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setActiveTab(c.id as any);
                    // If current selected tech does not belong to active tab, deselect it
                    if (selectedTech && c.id !== 'all' && selectedTech.category !== c.id) {
                      setSelectedTech(null);
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-purple-600/35 border border-fuchsia-400/40 scale-105'
                      : 'bg-[#120B24]/80 text-zinc-400 border border-purple-500/20 hover:text-white hover:border-purple-400/40 hover:bg-[#180E30]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-purple-400'}`} />
                  <span>{c.label}</span>
                  {c.id !== 'all' && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-950/60 text-purple-300">
                      {items.filter((t) => t.category === c.id).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tech Stage: 3D Galaxy Canvas in 3D Mode, or Sleek 2D Grid in Lite Mode */}
        <motion.div
          ref={orbitContainerRef}
          id="tech-galaxy-stage"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7 }}
          className="relative mb-10 scroll-mt-24"
        >
          {!isLite ? (
            <ElectricBorder
              color="#A855F7"
              glowColor="#06B6D4"
              speed={1.1}
              chaos={0.8}
              thickness={2}
              borderRadius="1.5rem"
              className="rounded-3xl"
            >
              <TechGalaxy3D
                techs={items}
                activeCategory={activeTab}
                selectedTech={selectedTech}
                onSelectTech={handleSelectTech}
              />
            </ElectricBorder>
          ) : (
            /* 2D Flat Constellation Grid in Lite Mode (Zero WebGL overhead) */
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0D0818]/90 border border-purple-500/25">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                {filtered.map((tech) => {
                  const isSelected = selectedTech?.name === tech.name;
                  return (
                    <button
                      key={tech.name}
                      onClick={() => handleSelectTech(tech)}
                      className={`p-4 rounded-2xl border text-center transition-all duration-200 flex flex-col items-center justify-between gap-3 cursor-pointer ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.35)] scale-105'
                          : 'bg-[#120B24]/90 border-purple-500/20 hover:border-purple-400/50 hover:bg-[#180E30]'
                      }`}
                    >
                      <TechLogo name={tech.name} className="w-9 h-9" />
                      <div>
                        <div className="text-xs font-bold text-white tracking-tight">{tech.name}</div>
                        <div className="text-[10px] text-zinc-400 mt-0.5">{tech.roleLabel || tech.category}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Floating Detail HUD Overlay if a node is selected */}
          <AnimatePresence>
            {selectedTech && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-20 p-5 rounded-2xl bg-[#0D0818]/95 backdrop-blur-xl border border-purple-500/40 shadow-[0_15px_40px_rgba(0,0,0,0.7)]"
                style={{
                  boxShadow: `0 0 30px ${selectedTech.glowColor || '#8B5CF6'}30, 0 10px 30px rgba(0,0,0,0.8)`,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: `${selectedTech.glowColor || '#8B5CF6'}20`,
                        border: `1px solid ${selectedTech.glowColor || '#8B5CF6'}60`,
                      }}
                    >
                      <TechLogo name={selectedTech.name} color={selectedTech.glowColor || undefined} size={22} className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-extrabold text-white flex items-center gap-2">
                        {selectedTech.name}
                        <span
                          className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${selectedTech.glowColor || '#8B5CF6'}25`,
                            color: selectedTech.glowColor || '#D946EF',
                            border: `1px solid ${selectedTech.glowColor || '#8B5CF6'}40`,
                          }}
                        >
                          {selectedTech.category}
                        </span>
                      </h4>
                      <p className="text-xs text-zinc-400">
                        {selectedTech.roleLabel || 'Komponen Utama Arsitektur'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedTech(null)}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Tutup detail"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed mt-2.5">
                  {techDescriptions[selectedTech.name] ||
                    'Teknologi yang digunakan dalam pengembangan aplikasi untuk menjaga stabilitas dan performa sistem.'}
                </p>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-purple-500/20 text-[11px] text-zinc-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Digunakan dalam proyek dan aplikasi aktif</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Showcase Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs text-zinc-400 font-medium">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Katalog Teknologi ({filtered.length} Perangkat)</span>
          </div>
        </div>

        {/* Desktop View: React Bits BounceCards */}
        <div className="hidden md:block">
          <BounceCards
            items={filtered.map((t) => ({
              ...t,
              description: techDescriptions[t.name],
            }))}
            selectedItem={selectedTech}
            onSelectItem={handleCardClick}
          />
        </div>

        {/* Mobile View: React Bits CardSwap */}
        <div className="block md:hidden py-4">
          <CardSwap
            items={filtered.map((t) => ({
              ...t,
              description: techDescriptions[t.name],
            }))}
            selectedItem={selectedTech}
            onCardClick={handleCardClick}
            width={290}
            height={360}
            cardDistance={22}
            verticalDistance={16}
            delay={4000}
            autoplay={true}
            pauseOnHover={true}
          />
        </div>

      </div>
    </section>
  );
}
