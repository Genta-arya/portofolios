import React, { useRef, useCallback } from 'react';
import { useDisplayMode } from '../../lib/displayModeStore';

export interface TiltCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxTilt?: number;
  scale?: number;
  glareColor?: string;
  glareSize?: number;
  perspective?: number;
  containerClassName?: string;
}

export function TiltCard({
  children,
  maxTilt = 12,
  scale = 1.02,
  glareColor = 'rgba(217, 70, 239, 0.25)',
  glareSize = 65,
  perspective = 1000,
  containerClassName = '',
  className = '',
  style,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
  ...props
}: TiltCardProps) {
  const { isLite } = useDisplayMode();
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isLite) return;
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;

      // Calculate 3D tilt angles: max tilt reached at borders
      const rotX = -yPct * maxTilt * 2;
      const rotY = xPct * maxTilt * 2;

      // Calculate spotlight glare position in percent
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;

      // Hardware-accelerated direct DOM style manipulation for 120fps+ silky smoothness
      card.style.transform = `perspective(${perspective}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale})`;
      card.style.transition = 'transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

      if (glareRef.current) {
        glareRef.current.style.background = `radial-gradient(circle at ${glareX.toFixed(1)}% ${glareY.toFixed(1)}%, ${glareColor}, transparent ${glareSize}%)`;
        glareRef.current.style.opacity = '1';
      }

      onMouseMove?.(e);
    },
    [isLite, maxTilt, scale, glareColor, glareSize, perspective, onMouseMove]
  );

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isLite) return;
      const card = cardRef.current;
      if (card) {
        card.style.transition = 'transform 0.15s ease-out';
      }
      if (glareRef.current) {
        glareRef.current.style.opacity = '1';
      }
      onMouseEnter?.(e);
    },
    [isLite, onMouseEnter]
  );

  const handleMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isLite) return;
      const card = cardRef.current;
      if (card) {
        card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)';
      }
      if (glareRef.current) {
        glareRef.current.style.opacity = '0';
      }
      onMouseLeave?.(e);
    },
    [isLite, perspective, onMouseLeave]
  );

  // Pure 2D Flat Card in Lite Mode (Zero 3D calculations, zero frame drops)
  if (isLite) {
    return (
      <div className={`w-full ${containerClassName}`}>
        <div className={`relative transition-all duration-200 hover:-translate-y-1 ${className}`} style={style} {...props}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`[perspective:${perspective}px] ${containerClassName}`}
      style={{ perspective: `${perspective}px` }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative will-change-transform [transform-style:preserve-3d] ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          ...style,
        }}
        {...props}
      >
        {/* Specular Glare / Spotlight Layer */}
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] z-20 opacity-0 transition-opacity duration-300"
          style={{
            willChange: 'background, opacity',
          }}
        />

        {/* Card Content with 3D Depth capability */}
        {children}
      </div>
    </div>
  );
}

export interface TiltItemProps extends React.HTMLAttributes<HTMLDivElement> {
  translateZ?: number | string;
  className?: string;
  children: React.ReactNode;
}

export function TiltItem({
  translateZ = 25,
  className = '',
  children,
  style,
  ...props
}: TiltItemProps) {
  const { isLite } = useDisplayMode();

  if (isLite) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  const zValue = typeof translateZ === 'number' ? `${translateZ}px` : translateZ;

  return (
    <div
      className={`[transform-style:preserve-3d] will-change-transform ${className}`}
      style={{
        transform: `translateZ(${zValue})`,
        transformStyle: 'preserve-3d',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export default TiltCard;
