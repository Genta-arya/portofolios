import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface AccordionGalleryItem {
  num: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  glowColor: string;
  badgeColor: string;
  image?: string;
  bgGradient?: string;
}

export interface AccordionGalleryProps {
  items: AccordionGalleryItem[];
  defaultIndex?: number;
  tilt?: number;
  className?: string;
}

export default function AccordionGallery({
  items,
  defaultIndex = 2,
  tilt = 6,
  className = '',
}: AccordionGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Desktop View: Horizontal Smooth Accordion with 3D Tilt Dynamics */}
      <div className="hidden md:flex flex-row w-full h-[420px] gap-3 items-stretch perspective-[1200px]">
        {items.map((item, idx) => {
          const isActive = activeIndex === idx;
          const Icon = item.icon;

          // Calculate subtle 3D tilt based on position relative to active card
          let rotateY = 0;
          if (!isActive) {
            rotateY = idx < activeIndex ? tilt : -tilt;
          }

          return (
            <motion.div
              key={item.num}
              onClick={() => setActiveIndex(idx)}
              onMouseEnter={() => setActiveIndex(idx)}
              tabIndex={0}
              onFocus={() => setActiveIndex(idx)}
              role="button"
              aria-expanded={isActive}
              layout
              transition={{
                layout: { duration: 0.55, ease: [0.25, 1, 0.5, 1] },
              }}
              style={{
                transform: `perspective(1000px) rotateY(${rotateY}deg)`,
                transformOrigin: idx < activeIndex ? 'right center' : 'left center',
                borderColor: isActive ? `${item.accentColor}80` : 'rgba(168, 85, 247, 0.18)',
                boxShadow: isActive
                  ? `0 20px 45px -10px ${item.glowColor}, 0 0 25px ${item.accentColor}30`
                  : '0 8px 25px rgba(0, 0, 0, 0.6)',
              }}
              className={`relative cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 ease-out flex flex-col justify-between p-6 border focus:outline-none ${
                isActive
                  ? 'flex-[3.5] lg:flex-[4] bg-gradient-to-b from-[#140B28]/95 via-[#0F0820]/95 to-[#0A0516]/98 z-10 scale-[1.01]'
                  : 'flex-[1] bg-[#0D071A]/85 hover:bg-[#120A24]/90 hover:scale-[1.005] opacity-85 hover:opacity-100 z-0'
              }`}
            >
              {/* Background Parallax Image */}
              {item.image && (
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out pointer-events-none ${
                    isActive ? 'scale-105 opacity-30' : 'scale-100 opacity-12'
                  }`}
                  style={{
                    backgroundImage: `url(${item.image})`,
                  }}
                />
              )}

              {/* Dark Gradient Overlay for Readability */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0B0517]/95 via-[#0D071A]/70 to-[#0A0516]/40" />

              {/* Active Ambient Radial Glow */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
                  isActive ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background: `radial-gradient(circle 300px at 50% 20%, ${item.glowColor}, transparent 70%)`,
                }}
              />

              {/* Glowing Top Accent Border */}
              <div
                className={`absolute top-0 left-0 right-0 h-[2.5px] transition-opacity duration-500 ${
                  isActive ? 'opacity-100' : 'opacity-30'
                }`}
                style={{
                  background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
                }}
              />

              {/* Card Header: Step Pill & Icon */}
              <div className="relative z-10 flex items-center justify-between w-full">
                <span
                  className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border transition-all duration-300 shadow-sm ${
                    isActive
                      ? item.badgeColor
                      : 'text-zinc-400 border-purple-500/20 bg-purple-950/20'
                  }`}
                  style={{
                    boxShadow: isActive ? `0 0 15px ${item.accentColor}40` : undefined,
                  }}
                >
                  {item.num}
                </span>

                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-md'
                      : 'text-zinc-400 bg-white/[0.03]'
                  }`}
                  style={{
                    color: isActive ? item.accentColor : undefined,
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Card Body: Title & Expanding Description */}
              <div className="relative z-10 flex flex-col justify-end w-full mt-auto pt-6">
                {/* Active Expanded View */}
                {isActive ? (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-xs lg:text-sm text-zinc-300 leading-relaxed max-w-md">
                      {item.desc}
                    </p>
                  </motion.div>
                ) : (
                  /* Collapsed View: Compact Title */
                  <div className="flex flex-col items-start">
                    <h3 className="text-sm font-bold text-zinc-300 line-clamp-2 tracking-tight group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile View: Vertical Smooth Interactive Accordion with Image Showcase */}
      <div className="flex md:hidden flex-col w-full gap-3">
        {items.map((item, idx) => {
          const isActive = activeIndex === idx;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.num}
              layout
              transition={{ layout: { duration: 0.35, ease: [0.25, 1, 0.5, 1] } }}
              onClick={() => setActiveIndex(isActive ? -1 : idx)}
              className={`relative rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-b from-[#150B2A]/98 via-[#0F0820]/98 to-[#0B0616]/98 p-4 sm:p-5'
                  : 'bg-[#0E071A]/90 hover:bg-[#120A24]/90 p-4'
              }`}
              style={{
                borderColor: isActive ? `${item.accentColor}80` : 'rgba(168, 85, 247, 0.18)',
                boxShadow: isActive
                  ? `0 12px 35px -8px ${item.glowColor}, 0 0 20px ${item.accentColor}25`
                  : '0 4px 15px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Glowing Top Accent Border on Active */}
              {isActive && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2.5px]"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
                  }}
                />
              )}

              {/* Ambient Radial Glow */}
              {isActive && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle 250px at 50% 15%, ${item.glowColor}, transparent 70%)`,
                  }}
                />
              )}

              {/* Header Row */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg border shrink-0 transition-all ${
                      isActive
                        ? item.badgeColor
                        : 'text-zinc-400 border-purple-500/20 bg-purple-950/20'
                    }`}
                    style={{
                      boxShadow: isActive ? `0 0 12px ${item.accentColor}35` : undefined,
                    }}
                  >
                    {item.num}
                  </span>
                  <h3
                    className={`text-sm sm:text-base font-bold tracking-tight truncate transition-colors ${
                      isActive ? 'text-white' : 'text-zinc-300'
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isActive
                        ? 'bg-white/10 text-white shadow-sm'
                        : 'text-zinc-400 bg-white/[0.03]'
                    }`}
                    style={{
                      color: isActive ? item.accentColor : undefined,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${
                      isActive ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Collapsible Content with Full-Width Artwork & Description */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3.5 relative z-10 flex flex-col gap-3">
                      {/* Image Preview Banner */}
                      {item.image && (
                        <div className="relative w-full aspect-[16/9] sm:h-48 rounded-xl overflow-hidden border border-purple-500/20 shadow-md">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          {/* Subtle Bottom & Top Vignette Gradients */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0616] via-transparent to-black/20" />

                          {/* Step Tag overlay in image corner */}
                          <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-mono font-medium text-white/90">
                            Fase {item.num}
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
