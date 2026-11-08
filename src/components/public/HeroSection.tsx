import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Send, CheckCircle2, ShieldCheck, Sparkles, Layers, Cpu } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';
import Hero3DScene from '../three/Hero3DScene';
import Lanyard from '../reactbits/Lanyard';
import ShinyText from '../reactbits/ShinyText';
import Magnet from '../reactbits/Magnet';
import DecryptedText from '../reactbits/DecryptedText';
import AnimatedCounter from '../reactbits/AnimatedCounter';
import MaskedHeading from '../reactbits/MaskedHeading';
import { useDisplayMode } from '../../lib/displayModeStore';

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
  const { isLite } = useDisplayMode();

  return (
    <section id="hero" className="relative min-h-0 lg:min-h-[90vh] flex items-center justify-center pt-24 sm:pt-28 pb-8 sm:pb-12 overflow-hidden overflow-x-clip max-w-full">
      
      {/* 3D Lanyard ID Card - Only on 3D Mode (Desktop) */}
      {!isLite && (
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
      )}

      {/* Hero Content Container - Generous padding on tablet and mobile to prevent text from touching screen edges */}
      <div className={`max-w-4xl lg:max-w-7xl xl:max-w-[1380px] mx-auto px-8 sm:px-16 md:px-24 lg:px-12 w-full ${!isLite ? 'lg:pl-72 xl:pl-80 2xl:pl-96' : 'lg:pl-10'}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Bio, CTAs, Counters */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10 w-full"
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
            <div className="w-full max-w-xl mx-auto lg:mx-0 px-2 sm:px-4 md:px-6 lg:px-0 mb-6">
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
                align="center"
                weight={800}
                textScale={0.065}
                spotlight={true}
                spotlightRadius={180}
                outline={true}
                outlineColor="rgba(192, 132, 252, 0.45)"
                outlineWidth={1}
                className="tracking-tight lg:text-left [&_.masked-heading\_\_measure]:text-center lg:[&_.masked-heading\_\_measure]:text-left"
              />
            </div>

            {/* Subtitle / Bio with React Bits Decrypted Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm sm:text-base text-zinc-300 font-normal leading-relaxed mb-6 max-w-lg mx-auto lg:mx-0 text-center lg:text-left px-2 sm:px-4 lg:px-0"
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
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full mb-5 sm:mb-6"
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
              className="grid grid-cols-3 gap-3 pt-4 sm:pt-5 border-t border-purple-500/15 w-full max-w-lg mx-auto lg:mx-0"
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

          {/* Right Column: 3D Globe on 3D Mode, or Sleek 2D Identity Card on Lite Mode */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 relative flex items-center justify-center w-full"
          >
            {!isLite ? (
              <Hero3DScene />
            ) : (
              /* Lightweight 2D Developer Identity Card (0% Three.js / WebGL load) */
              <div className="w-full max-w-md p-7 rounded-3xl bg-gradient-to-b from-[#150B28]/90 via-[#0E071D]/90 to-[#070310]/90 border border-purple-500/30 shadow-[0_15px_40px_rgba(139,92,246,0.18)]">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-cyan-400 shrink-0">
                    <img
                      src="/images/gentha-photo.jpg"
                      alt={fullName}
                      className="w-full h-full object-cover object-[50%_10%] rounded-full"
                    />
                    <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0D0818] flex items-center justify-center">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-extrabold text-white tracking-tight">{fullName}</h3>
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-xs text-purple-300 font-medium">{roleTitle}</div>
                    <div className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold mt-0.5">
                      <span>● Active &amp; Ready for Projects</span>
                    </div>
                  </div>
                </div>

                {/* Telemetry Metrics in 2D Lite Mode */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#120B24]/90 border border-purple-500/20 mb-5 text-center">
                  <div>
                    <div className="text-sm font-bold text-white">15+</div>
                    <div className="text-[10px] text-zinc-400">Proyek</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gradient-aurora">3+ Thn</div>
                    <div className="text-[10px] text-zinc-400">Pengalaman</div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-cyan-400">100%</div>
                    <div className="text-[10px] text-zinc-400">Commitment</div>
                  </div>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 pt-4 border-t border-purple-500/15">
                  {['React.js', 'Astro 5', 'Express.js', 'MySQL', 'React Native', 'Tailwind CSS'].map((stack) => (
                    <span
                      key={stack}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-purple-600/15 text-purple-300 border border-purple-500/25"
                    >
                      {stack}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
