import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import Hero3DScene from '../three/Hero3DScene';
import Lanyard from '../reactbits/Lanyard';
import ShinyText from '../reactbits/ShinyText';
import Magnet from '../reactbits/Magnet';
import DecryptedText from '../reactbits/DecryptedText';
import AnimatedCounter from '../reactbits/AnimatedCounter';
import MaskedHeading from '../reactbits/MaskedHeading';

interface HeroSectionProps {
  fullName?: string;
  roleTitle?: string;
  availableForHire?: boolean;
}

export default function HeroSection({
  fullName = 'Gentha Arya Pratama',
  roleTitle = 'Fullstack Developer · Web & Mobile',
  availableForHire = true,
}: HeroSectionProps) {
  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 overflow-hidden">
      
      {/* 3D Lanyard ID Card - Absolute hanging from the very top (Desktop) */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="hidden lg:block absolute -top-4 left-4 sm:left-8 lg:left-10 xl:left-16 2xl:left-24 z-20 pointer-events-auto"
      >
        <Lanyard
          photoUrl="/images/gentha-photo.jpg"
          fullName={fullName}
          roleTitle="Fullstack Software Engineer"
          organization="SOFTWARE ENGINEERING CREDENTIAL"
          subdivision="System Architect · Web & Mobile"
          className="w-[300px] xl:w-[340px]"
          canvasHeight="h-[520px] xl:h-[600px]"
        />
      </motion.div>

      {/* Hero Content Container with left padding clearance for the hanging Lanyard on Desktop */}
      <div className="max-w-7xl xl:max-w-[1380px] mx-auto px-4 sm:px-6 w-full lg:pl-72 xl:pl-80 2xl:pl-96">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center">
          
          {/* Left Column: Headlines, Bio, CTAs, Counters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-7 flex flex-col items-start text-left z-10 w-full"
          >
            {/* Availability Badge with React Bits Shiny Text */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#120B24]/90 border border-purple-500/30 text-xs font-medium text-purple-200 shadow-[0_0_20px_rgba(139,92,246,0.2)] mb-5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <ShinyText text="Available for freelance & fulltime" speed={1.6} />
            </motion.div>

            {/* Headline Title with Official React Bits MaskedHeading */}
            <div className="w-full mb-5">
              <MaskedHeading
                text="Membangun Solusi Digital Modern, Cepat & Skalabel"
                tag="h1"
                src="/images/cosmic-nebula.svg"
                mediaType="image"
                fillScale={1.3}
                parallax={32}
                drift={16}
                reveal="rise"
                trigger="view"
                align="left"
                weight={800}
                textScale={0.09}
                spotlight={true}
                spotlightRadius={180}
                outline={true}
                outlineColor="rgba(192, 132, 252, 0.45)"
                outlineWidth={1}
                className="tracking-tight"
              />
            </div>

            {/* Subtitle / Bio with React Bits Decrypted Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed mb-6 max-w-xl"
            >
              Halo! Saya <DecryptedText text={fullName} speed={35} className="text-purple-300 font-semibold" />, pengembang{' '}
              <span className="text-white font-medium">Aplikasi Web Enterprise</span> dan{' '}
              <span className="text-white font-medium">Mobile Android</span>. Berfokus pada arsitektur sistem yang andal, efisien, dan mudah digunakan.
            </motion.p>

            {/* CTAs & Social Quick Links with React Bits Magnet */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-3 w-full mb-8"
            >
              <Magnet magnetStrength={0.22}>
                <a
                  href="#portfolio"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Lihat Portofolio</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Magnet>

              <Magnet magnetStrength={0.22}>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm bg-[#120B24]/80 text-zinc-200 border border-purple-500/30 hover:border-purple-400/60 hover:text-white hover:bg-purple-950/30 transition-all"
                >
                  <Send className="w-3.5 h-3.5 text-purple-400" />
                  <span>Konsultasi Proyek</span>
                </a>
              </Magnet>

              <div className="flex items-center gap-2">
                <a
                  href="https://github.com/Genta-arya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#120B24]/60 border border-purple-500/20 text-zinc-400 hover:text-white hover:border-purple-400 hover:bg-purple-600/20 transition-all"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://linkedin.com/in/mgentaarya"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#120B24]/60 border border-purple-500/20 text-zinc-400 hover:text-white hover:border-purple-400 hover:bg-purple-600/20 transition-all"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            {/* Highlights Bar with React Bits AnimatedCounter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-3 gap-3 pt-6 border-t border-purple-500/15 w-full max-w-lg"
            >
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  <AnimatedCounter value={15} suffix="+" />
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 font-medium">Proyek Sukses</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-gradient-aurora tracking-tight">
                  <AnimatedCounter value={3} suffix="+ Thn" />
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 font-medium">Pengalaman Dev</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-purple-400 tracking-tight">
                  <AnimatedCounter value={100} suffix="%" />
                </div>
                <div className="text-[11px] sm:text-xs text-zinc-400 font-medium">Maintainable Code</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Permanent 3D Interactive Cosmic Core Globe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative flex items-center justify-center w-full"
          >
            <Hero3DScene />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
