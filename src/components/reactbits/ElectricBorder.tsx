import React, { useRef, useState, useId } from 'react';
import type { CSSProperties } from 'react';

export interface ElectricBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  color?: string; // Main lightning color (default cosmic purple #A855F7)
  glowColor?: string; // Corona glow color (default #C084FC)
  speed?: number; // Speed of turbulence oscillation (default 1.2)
  chaos?: number; // Intensity of jagged crackle / displacement (default 0.9)
  thickness?: number; // Stroke thickness in px (default 2)
  borderRadius?: string; // Optional custom border radius (defaults to inherit)
  interactive?: boolean; // Follow mouse cursor for localized electric surge (default true)
  className?: string;
  style?: CSSProperties;
}

export default function ElectricBorder({
  children,
  color = '#A855F7',
  glowColor,
  speed = 1.2,
  chaos = 0.9,
  thickness = 2,
  borderRadius,
  interactive = true,
  className = '',
  style,
  ...props
}: ElectricBorderProps) {
  const rawId = useId();
  // Sanitize id for valid SVG filter reference in all browsers
  const filterId = `electric-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const resolvedGlow = glowColor || color;
  const radiusValue = borderRadius || 'inherit';

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    if (interactive) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (interactive) setIsHovered(false);
  };

  // Base frequencies calculated from chaos parameter
  const baseFreq = (0.04 * chaos).toFixed(3);
  const highFreqX = (0.07 * chaos).toFixed(3);
  const highFreqY = (0.09 * chaos).toFixed(3);
  const lowFreqX = (0.025 * chaos).toFixed(3);
  const lowFreqY = (0.05 * chaos).toFixed(3);
  const scaleValue = Math.round(14 * chaos);
  const animDuration = (2 / Math.max(0.1, speed)).toFixed(2);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      style={{
        borderRadius: radiusValue,
        ...style,
      }}
      {...props}
    >
      {/* SVG Procedural Filter for Lightning / Turbulence Warping */}
      <svg
        className="absolute w-0 h-0 overflow-hidden pointer-events-none -z-10"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter
            id={filterId}
            x="-40%"
            y="-40%"
            width="180%"
            height="180%"
            colorInterpolationFilters="sRGB"
          >
            {/* Organic fractal noise with perpetual SMIL oscillation */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency={`${baseFreq} ${baseFreq}`}
              numOctaves="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur={`${animDuration}s`}
                values={`${baseFreq} ${baseFreq};${highFreqX} ${highFreqY};${lowFreqX} ${lowFreqY};${highFreqY} ${lowFreqX};${baseFreq} ${baseFreq}`}
                repeatCount="indefinite"
              />
            </feTurbulence>

            {/* Jagged coordinate displacement mapping */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={scaleValue}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Corona Discharge Background Pulse */}
      <div
        className="pointer-events-none absolute -inset-[2px] rounded-[inherit] transition-opacity duration-300 opacity-60"
        style={{
          borderRadius: radiusValue,
          border: `${thickness + 1}px solid ${resolvedGlow}`,
          filter: `url(#${filterId}) blur(3px)`,
          zIndex: 1,
        }}
        aria-hidden="true"
      />

      {/* Layer 2: Main Crackling Electric Border Current */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-[inherit] transition-all duration-200"
        style={{
          borderRadius: radiusValue,
          border: `${thickness}px solid ${color}`,
          filter: `url(#${filterId}) drop-shadow(0 0 6px ${color}) drop-shadow(0 0 14px ${resolvedGlow})`,
          zIndex: 2,
        }}
        aria-hidden="true"
      />

      {/* Layer 3: Interactive Lightning Arc surge towards cursor */}
      {interactive && isHovered && (
        <div
          className="pointer-events-none absolute -inset-[2px] rounded-[inherit] transition-opacity duration-200 opacity-90"
          style={{
            borderRadius: radiusValue,
            border: `${thickness + 1}px solid #FFFFFF`,
            filter: `url(#${filterId}) drop-shadow(0 0 10px ${color}) drop-shadow(0 0 20px ${resolvedGlow})`,
            maskImage: `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 85%)`,
            WebkitMaskImage: `radial-gradient(circle 160px at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 85%)`,
            zIndex: 3,
          }}
          aria-hidden="true"
        />
      )}

      {/* Content wrapper */}
      <div className="relative z-10 w-full h-full rounded-[inherit]">
        {children}
      </div>
    </div>
  );
}
