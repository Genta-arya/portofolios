import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Building2,
  Activity,
  Smartphone,
  Calendar,
  MapPin,
  Sparkles,
  ShieldCheck,
  Award,
  ChevronRight,
} from 'lucide-react';
import ShinyText from '../reactbits/ShinyText';
import ScrollStack, { ScrollStackItem } from '../reactbits/ScrollStack';
import ElectricBorder from '../reactbits/ElectricBorder';

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  subdivision?: string;
  organizationType: string;
  period: string;
  durationLabel: string;
  location: string;
  status: 'current' | 'completed';
  icon: React.ComponentType<{ className?: string }>;
  logoUrl?: string;
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  summary: string;
  highlightMetric?: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 'kpu-sekadau',
    role: 'Penata Kelola Sistem dan Teknologi Informasi',
    organization: 'Komisi Pemilihan Umum (KPU) Kabupaten Sekadau',
    subdivision: 'Subbagian Teknis Penyelenggaraan Pemilu dan Hukum',
    organizationType: 'Lembaga Penyelenggara Pemilu',
    period: '2024 — Sekarang',
    durationLabel: 'Posisi Saat Ini',
    location: 'Kab. Sekadau, Kalimantan Barat',
    status: 'current',
    icon: Building2,
    logoUrl: '/images/logo-kpu.png',
    accentColor: '#D946EF',
    glowColor: 'rgba(217, 70, 239, 0.32)',
    badgeBg: 'bg-fuchsia-950/60 text-fuchsia-200 border-fuchsia-500/40',
    summary:
      'Bertugas sebagai Penata Kelola Sistem dan Teknologi Informasi pada Subbagian Teknis Penyelenggaraan Pemilu dan Hukum di KPU Kabupaten Sekadau. Bertanggung jawab atas pengelolaan sistem informasi teknis tahapan pemilu, operasional perangkat dan aplikasi kepemiluan, serta keandalan teknologi informasi pendukung di lingkungan subbagian.',
    highlightMetric: 'Subbagian Teknis & Hukum',
  },
  {
    id: 'rsud-agoesdjam',
    role: 'Staff IT Support',
    organization: 'RSUD dr. Agoesdjam Ketapang',
    subdivision: 'Unit Instalasi Teknologi Informasi (IT)',
    organizationType: 'Rumah Sakit Umum Daerah',
    period: '1 Tahun Masa Kerja',
    durationLabel: '1 Tahun',
    location: 'Kab. Ketapang, Kalimantan Barat',
    status: 'completed',
    icon: Activity,
    logoUrl: '/images/logo-rsud.png',
    accentColor: '#6366F1',
    glowColor: 'rgba(99, 102, 241, 0.30)',
    badgeBg: 'bg-indigo-950/60 text-indigo-200 border-indigo-500/40',
    summary:
      'Bertugas sebagai Staff IT Support selama 1 tahun di RSUD dr. Agoesdjam Ketapang, bertanggung jawab atas kelancaran operasional Sistem Informasi Manajemen Rumah Sakit (SIMRS), pemeliharaan infrastruktur jaringan, hardware medis dan administrasi, serta dukungan teknis pengguna 24/7.',
    highlightMetric: 'Dukungan IT Medis & SIMRS',
  },
  {
    id: 'bangkit-academy',
    role: 'Mobile Android Developer',
    organization: 'Bangkit Academy led by Google, GoTo, & Traveloka',
    subdivision: 'Alur Pembelajaran Mobile Android Developer',
    organizationType: 'Studi Independen Bersertifikat — Kampus Merdeka',
    period: '6 Bulan Intensive Cohort',
    durationLabel: '6 Bulan',
    location: 'Nasional (Daring / Hybrid)',
    status: 'completed',
    icon: Smartphone,
    logoUrl: '/images/logo-bangkit.png',
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.32)',
    badgeBg: 'bg-purple-950/60 text-purple-200 border-purple-500/40',
    summary:
      'Mengikuti program inkubasi 6 bulan Bangkit Academy (Kampus Merdeka Kemendikbudristek) yang diinisiasi oleh Google, GoTo, dan Traveloka. Fokus mendalami arsitektur pengembangan aplikasi mobile Android modern (Kotlin, Jetpack, Clean Architecture) serta menyelesaikan Capstone Project aplikasi mobile.',
    highlightMetric: 'Program Resmi Google & Kemendikbud',
  },
];

export default function CareerExperience() {
  return (
    <section id="experience" className="py-24 relative overflow-x-clip max-w-full">
      {/* Ambient Aurora Glow behind Career Section - Clipped to prevent mobile horizontal scroll */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] max-w-none h-[550px] bg-gradient-to-r from-fuchsia-600/25 via-purple-600/30 to-indigo-600/25 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 overflow-visible">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-600/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" />
            <ShinyText text="Pengalaman Kerja" speed={1.6} />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Pengalaman Kerja &amp; Karier
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-4 leading-relaxed">
            Pengalaman kerja dalam tata kelola sistem informasi instansi pemerintah, dukungan IT fasilitas kesehatan, serta program pengembangan aplikasi mobile.
          </p>
        </motion.div>

        {/* React Bits ScrollStack: Authentic Scroll Pinned Card Stacking */}
        <ScrollStack
          itemDistance={150}
          itemStackDistance={30}
          stackPosition="14%"
          itemScale={0.038}
          baseScale={0.88}
          blurAmount={1.8}
          rotationAmount={0}
          useWindowScroll={true}
        >
          {experiences.map((exp) => {
            const Icon = exp.icon;
            const isCurrent = exp.status === 'current';

            return (
              <ScrollStackItem key={exp.id}>
                <div
                  className={`w-full rounded-3xl bg-[#0E0720]/95 backdrop-blur-2xl border ${
                    isCurrent
                      ? 'border-fuchsia-500/60 shadow-[0_20px_50px_rgba(217,70,239,0.28)] ring-1 ring-fuchsia-500/30'
                      : 'border-purple-500/35 shadow-[0_20px_45px_rgba(0,0,0,0.7)]'
                  } p-6 sm:p-8 lg:p-9 transition-colors duration-300 relative overflow-hidden`}
                  style={{
                    boxShadow: isCurrent
                      ? `0 20px 50px -10px ${exp.glowColor}, 0 0 30px rgba(217, 70, 239, 0.2)`
                      : `0 15px 40px -10px rgba(0, 0, 0, 0.8), 0 0 20px ${exp.glowColor}`,
                  }}
                >
                  {/* Top Glowing Edge Line */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${exp.accentColor}, transparent)`,
                    }}
                  />

                  {/* Top Header Row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-purple-500/20">
                    <div className="flex items-start gap-4">
                      {/* Logo / Icon Badge */}
                      <div
                        className="w-14 h-14 sm:w-16 sm:h-16 p-2 rounded-2xl flex items-center justify-center shrink-0 border bg-white shadow-lg overflow-hidden"
                        style={{
                          borderColor: `${exp.accentColor}60`,
                          boxShadow: `0 0 20px ${exp.accentColor}35`,
                        }}
                      >
                        {exp.logoUrl ? (
                          <img
                            src={exp.logoUrl}
                            alt={exp.organization}
                            className="w-full h-full max-w-full max-h-full object-contain"
                            loading="lazy"
                          />
                        ) : (
                          <Icon className="w-6 h-6 text-purple-900" />
                        )}
                      </div>

                      <div>
                        {/* Status Pills */}
                        <div className="flex flex-wrap items-center gap-2.5 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${exp.badgeBg} flex items-center gap-1.5`}
                          >
                            {isCurrent && (
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                              </span>
                            )}
                            <span>{exp.durationLabel}</span>
                          </span>

                          <span className="text-xs text-zinc-400 font-medium">
                            {exp.organizationType}
                          </span>
                        </div>

                        {/* Role Title */}
                        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                          {exp.role}
                        </h3>

                        {/* Subdivision / Subbagian (Penting) */}
                        {exp.subdivision && (
                          <div className="mt-1 text-sm font-semibold text-fuchsia-300">
                            {exp.subdivision}
                          </div>
                        )}

                        {/* Organization & Location & Period */}
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2.5 text-xs sm:text-sm text-purple-200 font-medium">
                          <span className="text-white font-semibold">{exp.organization}</span>
                          <span className="flex items-center gap-1 text-zinc-400">
                            <MapPin className="w-3.5 h-3.5 text-purple-400" />
                            <span>{exp.location}</span>
                          </span>
                          <span className="flex items-center gap-1 text-zinc-400">
                            <Calendar className="w-3.5 h-3.5 text-purple-400" />
                            <span>{exp.period}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Highlight Badge */}
                    {exp.highlightMetric && (
                      <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/[0.04] border border-purple-500/30 text-xs font-semibold text-zinc-200 shrink-0 self-start sm:self-auto">
                        <Award className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{exp.highlightMetric}</span>
                      </div>
                    )}
                  </div>

                  {/* Summary Paragraph */}
                  <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-5">
                    {exp.summary}
                  </p>
                </div>
              </ScrollStackItem>
            );
          })}
        </ScrollStack>

        {/* Bottom Proof of Value Banner with Electric Border */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12"
        >
          <ElectricBorder
            color="#A855F7"
            glowColor="#C084FC"
            speed={1.2}
            chaos={0.8}
            thickness={2}
            borderRadius="1.5rem"
            className="rounded-3xl"
          >
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#14082B]/95 via-[#190A34]/95 to-[#100722]/95 border border-purple-500/25 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Pengalaman di Sektor Pemerintahan, Layanan Kesehatan, dan Teknologi
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                    Terbiasa mengelola sistem informasi dan infrastruktur dengan standar keandalan tinggi dan integritas data yang terjaga.
                  </p>
                </div>
              </div>

              <a
                href="#contact"
                className="shrink-0 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs font-bold hover:shadow-[0_0_25px_rgba(217,70,239,0.5)] transition-all flex items-center gap-2"
              >
                <span>Hubungi Saya untuk Kolaborasi</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </ElectricBorder>
        </motion.div>
      </div>
    </section>
  );
}
