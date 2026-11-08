import React from 'react';
import { motion } from 'framer-motion';
import { Layers, CheckCircle2, Cpu, ShieldCheck, Rocket, Terminal, Sparkles } from 'lucide-react';
import { TiltCard, TiltItem } from '../ui/TiltCard';
import AccordionGallery from '../reactbits/AccordionGallery';
import ElectricBorder from '../reactbits/ElectricBorder';

export default function ProfileWorkflow() {
  const steps = [
    {
      num: '01',
      title: 'Konsultasi & Analisis',
      desc: 'Memahami spesifikasi kebutuhan bisnis, flow sistem, arsitektur database, dan pemilihan stack teknologi yang tepat.',
      icon: Terminal,
      image: '/images/workflow-analysis.jpg',
      accentColor: '#A855F7',
      glowColor: 'rgba(168, 85, 247, 0.35)',
      badgeColor: 'text-purple-400 border-purple-500/30 bg-purple-950/40',
    },
    {
      num: '02',
      title: 'UI/UX & Prototyping',
      desc: 'Perancangan antarmuka visual modern bertema dark/aurora, wireframing responsif, dan mapping interaksi komponen pengguna.',
      icon: Layers,
      image: '/images/workflow-design.jpg',
      accentColor: '#D946EF',
      glowColor: 'rgba(217, 70, 239, 0.35)',
      badgeColor: 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-950/40',
    },
    {
      num: '03',
      title: 'Fullstack Development',
      desc: 'Koding clean code berstandar tinggi: integrasi frontend React/Astro, REST API terstruktur, optimasi query MySQL, dan state management.',
      icon: Cpu,
      image: '/images/workflow-development.jpg',
      accentColor: '#6366F1',
      glowColor: 'rgba(99, 102, 241, 0.35)',
      badgeColor: 'text-indigo-400 border-indigo-500/30 bg-indigo-950/40',
    },
    {
      num: '04',
      title: 'Testing & Optimization',
      desc: 'Pengujian performa Lighthouse, validasi keamanan input, responsivitas mobile di berbagai layar, dan zero-bug verification.',
      icon: ShieldCheck,
      image: '/images/workflow-testing.jpg',
      accentColor: '#06B6D4',
      glowColor: 'rgba(6, 182, 212, 0.35)',
      badgeColor: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
    },
    {
      num: '05',
      title: 'Deployment & Support',
      desc: 'Deploy ke VPS / Cloud Server (Nginx, Docker, CI/CD), setup domain SSL, konfigurasi CDN Cloudinary, dan pendampingan pasca rilis.',
      icon: Rocket,
      image: '/images/workflow-deployment.jpg',
      accentColor: '#10B981',
      glowColor: 'rgba(16, 185, 129, 0.35)',
      badgeColor: 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40',
    },
  ];

  return (
    <section id="profile" className="py-24 relative overflow-hidden max-w-full">
      {/* Ambient Aurora Glow behind Profile & Workflow - Clipped for mobile overflow safety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[950px] max-w-none h-[550px] bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-fuchsia-600/25 blur-[135px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600/10 border border-purple-500/25 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Alur Kerja</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tahapan Pengerjaan Proyek
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3">
            Setiap proyek dikerjakan secara terstruktur mulai dari tahap analisis kebutuhan hingga siap digunakan dan dipelihara.
          </p>
        </motion.div>

        {/* Workflow Timeline with Official React Bits AccordionGallery */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="mb-16 w-full"
        >
          <AccordionGallery items={steps} defaultIndex={2} tilt={7} />
        </motion.div>

        {/* Bento Grid Profil & Nilai Unggulan with 3D Tilt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento Card 1: Core Philosophy */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="md:col-span-8 h-full"
          >
            <ElectricBorder
              color="#A855F7"
              glowColor="#C084FC"
              speed={1.2}
              chaos={0.85}
              thickness={2}
              borderRadius="1.5rem"
              className="h-full rounded-3xl"
            >
              <TiltCard
                maxTilt={10}
                scale={1.015}
                glareColor="rgba(217, 70, 239, 0.22)"
                glareSize={75}
                perspective={1100}
                containerClassName="h-full"
                className="p-8 rounded-3xl bg-gradient-to-br from-[#120B24]/95 via-[#0F091E]/95 to-[#0D0818]/95 border border-purple-500/25 hover:border-purple-400/50 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.22)] flex flex-col justify-between h-full transition-colors duration-300"
              >
                <div>
                  <TiltItem translateZ={22}>
                    <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Filosofi Kode</span>
                  </TiltItem>

                  <TiltItem translateZ={34}>
                    <h3 className="text-2xl font-bold text-white mt-1 mb-3">
                      Kecepatan, Arsitektur Bersih, dan Estetika Tanpa Kompromi
                    </h3>
                  </TiltItem>

                  <TiltItem translateZ={20}>
                    <p className="text-sm text-zinc-300 leading-relaxed max-w-xl">
                      Bukan sekadar membuat aplikasi berfungsi, melainkan memastikan struktur kode modular, database teroptimasi dengan index yang tepat, serta visual yang memberikan kesan premium bagi pengguna akhir.
                    </p>
                  </TiltItem>
                </div>

                {/* Floating Tech Badges */}
                <TiltItem translateZ={28}>
                  <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-purple-500/20">
                    {['Astro SSR', 'React Islands', 'MySQL & Drizzle', 'Tailwind CSS', 'Framer Motion', 'Cloudinary CDN'].map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 rounded-lg text-xs font-medium bg-purple-950/60 text-purple-200 border border-purple-500/25 shadow-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </TiltItem>
              </TiltCard>
            </ElectricBorder>
          </motion.div>

          {/* Bento Card 2: Stats Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="md:col-span-4 h-full"
          >
            <ElectricBorder
              color="#EC4899"
              glowColor="#F472B6"
              speed={1.2}
              chaos={0.85}
              thickness={2}
              borderRadius="1.5rem"
              className="h-full rounded-3xl"
            >
              <TiltCard
                maxTilt={12}
                scale={1.02}
                glareColor="rgba(168, 85, 247, 0.25)"
                glareSize={65}
                perspective={1000}
                containerClassName="h-full"
                className="p-8 rounded-3xl bg-[#0D0818]/90 border border-purple-500/25 hover:border-purple-400/50 shadow-[0_12px_40px_rgba(0,0,0,0.6)] hover:shadow-[0_20px_50px_rgba(139,92,246,0.22)] flex flex-col justify-between h-full transition-colors duration-300"
              >
                <div>
                  <TiltItem translateZ={20}>
                    <span className="text-xs font-semibold text-fuchsia-400 uppercase tracking-wider">Rekam Jejak</span>
                  </TiltItem>

                  <TiltItem translateZ={30}>
                    <h3 className="text-xl font-bold text-white mt-1 mb-4">Portofolio Nyata</h3>
                  </TiltItem>

                  {/* 3D Elevated Stats List */}
                  <TiltItem translateZ={25} className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b border-purple-500/15">
                      <span className="text-xs text-zinc-400">Web Enterprise</span>
                      <span className="text-sm font-bold text-white">5+ Aplikasi</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-purple-500/15">
                      <span className="text-xs text-zinc-400">Mobile Android</span>
                      <span className="text-sm font-bold text-white">5+ Aplikasi</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-purple-500/15">
                      <span className="text-xs text-zinc-400">Landing Page &amp; Profil</span>
                      <span className="text-sm font-bold text-white">4+ Website</span>
                    </div>
                  </TiltItem>
                </div>

                {/* 3D Elevated Action */}
                <TiltItem translateZ={32}>
                  <a
                    href="#portfolio"
                    className="mt-6 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Jelajahi Showcase Proyek</span>
                    <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  </a>
                </TiltItem>
              </TiltCard>
            </ElectricBorder>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
