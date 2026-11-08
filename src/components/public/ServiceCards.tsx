import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Smartphone, Sparkles, ArrowUpRight } from 'lucide-react';
import PixelCard from '../reactbits/PixelCard';
import DepthCarousel from '../reactbits/DepthCarousel';
import ShinyText from '../reactbits/ShinyText';

interface ServiceItem {
  id?: number;
  title: string;
  subtitle: string;
  description: string;
  iconName?: string | null;
  tags?: string[] | null;
  ctaUrl?: string | null;
  isPopular?: boolean;
}

interface ServiceCardsProps {
  services?: ServiceItem[];
}

export default function ServiceCards({ services }: ServiceCardsProps) {
  // Susun 3 layanan utama: Landing Page (kiri), Web Application (tengah - PALING DIMINATI), Mobile Application (kanan)
  const defaultServices: ServiceItem[] = [
    {
      title: 'Landing Page & Profile',
      subtitle: 'High-Converting & Responsive Website',
      description: 'Perancangan landing page profil bisnis, UMKM, institusi pendidikan, dan e-commerce dengan visual cosmic/aurora modern, animasi halus, serta SEO teroptimasi.',
      iconName: 'Sparkles',
      tags: ['Astro', 'React', 'Framer Motion', 'Tailwind CSS', 'SEO Friendly'],
      ctaUrl: 'https://fastwork.id/user/babfpfzm/web-development-28040514?source=seller-center_my-service',
      isPopular: false,
    },
    {
      title: 'Web Application',
      subtitle: 'Custom Web App & Sistem Informasi',
      description: 'Membangun aplikasi web enterprise, sistem inventori, portal manajemen, dan dashboard interaktif dengan arsitektur modern, proteksi role-based auth, serta REST API cepat.',
      iconName: 'LayoutDashboard',
      tags: ['React JS', 'Express JS', 'MySQL', 'Tailwind CSS', 'REST API'],
      ctaUrl: 'https://fastwork.id/user/babfpfzm/web-development-97660045?source=seller-center_my-service',
      isPopular: true,
    },
    {
      title: 'Mobile Application',
      subtitle: 'Android & Cross-Platform App Development',
      description: 'Pengembangan aplikasi mobile responsif untuk Android menggunakan React Native & Kotlin, terintegrasi real-time geolocation, push notification, dan offline storage.',
      iconName: 'Smartphone',
      tags: ['React Native', 'Kotlin', 'Android APK', 'Expo', 'REST API'],
      ctaUrl: 'https://fastwork.id/user/babfpfzm/mobile-application-82102967?source=seller-center_my-service',
      isPopular: false,
    },
  ];

  // Pastikan urutan item: index 0 = Landing Page, index 1 = Web Application (tengah / paling diminati), index 2 = Mobile Application
  const rawList = services && services.length > 0 ? services : defaultServices;
  const items = [...rawList].sort((a, b) => {
    const getOrder = (title: string) => {
      if (title.toLowerCase().includes('landing')) return 1;
      if (title.toLowerCase().includes('web')) return 2;
      return 3;
    };
    return getOrder(a.title) - getOrder(b.title);
  });

  const [currentActiveIndex, setCurrentActiveIndex] = useState(1); // Default fokus pada Web Application di tengah

  return (
    <section id="services" className="py-24 relative overflow-hidden max-w-full">
      {/* Ambient Aurora Glow behind Services - Clipped for mobile overflow safety */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] max-w-none h-[520px] bg-gradient-to-r from-fuchsia-600/30 via-purple-600/25 to-indigo-600/25 blur-[130px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-fuchsia-600/10 border border-fuchsia-500/25 text-fuchsia-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
            <ShinyText text="Layanan Profesional" speed={1.6} />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Solusi Rekayasa Perangkat Lunak Terintegrasi
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-3">
            Layanan komprehensif mulai dari rancang bangun sistem web, aplikasi mobile, hingga optimasi performa digital Anda.
          </p>
        </motion.div>

        {/* 3D Depth Carousel Container with Purple PixelCards */}
        <DepthCarousel
          initialIndex={1}
          autoplay={false}
          autoplayInterval={5500}
          onIndexChange={(idx) => setCurrentActiveIndex(idx)}
        >
          {items.map((svc, idx) => {
            const isFeatured = svc.isPopular || svc.title.toLowerCase().includes('web') || idx === 1;
            const isCurrentActive = idx === currentActiveIndex;

            // Resolusi icon berdasarkan title atau iconName
            const renderIcon = () => {
              if (svc.title.toLowerCase().includes('web') || svc.iconName === 'LayoutDashboard') {
                return <LayoutDashboard className="w-6 h-6" />;
              }
              if (svc.title.toLowerCase().includes('mobile') || svc.iconName === 'Smartphone') {
                return <Smartphone className="w-6 h-6" />;
              }
              return <Sparkles className="w-6 h-6" />;
            };

            return (
              <div key={svc.title} className="h-full">
                {/* React Bits PixelCard with Purple Particles */}
                <PixelCard
                  colors="#A855F7,#C084FC,#E879F9,#9333EA,#D946EF,#7E22CE,#F472B6"
                  gap={5}
                  pixelSize={3.5}
                  speed={45}
                  alwaysSparkle={true}
                  className={`relative group rounded-3xl p-7 sm:p-8 flex flex-col justify-between h-[510px] sm:h-[530px] transition-all duration-300 ${
                    isCurrentActive
                      ? 'bg-gradient-to-b from-[#180E30]/95 via-[#110A24]/95 to-[#0D0818]/95 border-2 border-purple-500/50 shadow-[0_20px_60px_rgba(139,92,246,0.35)]'
                      : 'bg-[#0D0818]/90 border border-purple-500/25 hover:border-purple-400/50 shadow-[0_12px_40px_rgba(0,0,0,0.6)]'
                  }`}
                >
                  {/* Popular Pill untuk kartu tengah Web Application */}
                  {isFeatured && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                      <div className="px-3.5 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-purple-600/50 uppercase tracking-wider border border-white/20 whitespace-nowrap">
                        Paling Diminati
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col flex-1 justify-start">
                    {/* Icon Box */}
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600/25 to-fuchsia-600/15 border border-purple-500/30 flex items-center justify-center text-purple-300 mb-6 group-hover:scale-110 group-hover:bg-purple-600/35 group-hover:text-purple-200 shadow-md shadow-purple-900/30 transition-all duration-300">
                      {renderIcon()}
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 group-hover:text-purple-200 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-purple-300 font-medium mb-4">
                      {svc.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                      {svc.description}
                    </p>

                    {/* Tech Tags */}
                    {svc.tags && svc.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                        {svc.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-purple-950/70 text-purple-200 border border-purple-500/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Order CTA Button */}
                  <div className="pt-4 border-t border-purple-500/20 mt-auto">
                    <a
                      href={svc.ctaUrl || '#contact'}
                      target={svc.ctaUrl?.startsWith('http') ? '_blank' : '_self'}
                      rel="noopener noreferrer"
                      className={`w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isCurrentActive
                          ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-lg shadow-purple-600/40 hover:shadow-purple-500/60 hover:brightness-110 active:scale-[0.98]'
                          : 'bg-[#150D2A] text-zinc-200 border border-purple-500/30 hover:border-purple-400 hover:text-white hover:bg-purple-900/50 shadow-md active:scale-[0.98]'
                      }`}
                    >
                      <span>Pesan Layanan / Konsultasi</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </PixelCard>
              </div>
            );
          })}
        </DepthCarousel>

      </div>
    </section>
  );
}
