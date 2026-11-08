import React, { useEffect, useRef, useState } from 'react';

export interface FuzzyTextProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  text?: string;
  fontSize?: string | number;
  fontWeight?: string | number;
  fontFamily?: string;
  color?: string;
  enableHover?: boolean;
  baseIntensity?: number;
  hoverIntensity?: number;
  className?: string;
}

export default function FuzzyText({
  children,
  text: propText,
  fontSize = 'clamp(3rem, 12vw, 9rem)',
  fontWeight = 900,
  fontFamily = 'inherit',
  color = '#FFFFFF',
  enableHover = true,
  baseIntensity = 0.18,
  hoverIntensity = 0.55,
  className = '',
  ...props
}: FuzzyTextProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const rawText = propText || (typeof children === 'string' ? children : String(children || '404'));

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    let animationFrameId: number;
    let isCancelled = false;

    // Current interpolated intensity
    let currentIntensity = baseIntensity;
    let targetIntensity = baseIntensity;

    // Create offscreen canvas for crisp base text rendering
    const offscreen = document.createElement('canvas');
    const offCtx = offscreen.getContext('2d');
    if (!offCtx) return;

    // Resolve font size in px
    const dummy = document.createElement('span');
    dummy.style.fontSize = typeof fontSize === 'number' ? `${fontSize}px` : fontSize;
    dummy.style.fontFamily = fontFamily === 'inherit' ? getComputedStyle(document.body).fontFamily : fontFamily;
    dummy.style.fontWeight = String(fontWeight);
    dummy.style.position = 'absolute';
    dummy.style.visibility = 'hidden';
    dummy.textContent = rawText;
    document.body.appendChild(dummy);
    const computedFontSize = parseFloat(getComputedStyle(dummy).fontSize) || 72;
    const computedFontFamily = getComputedStyle(dummy).fontFamily;
    document.body.removeChild(dummy);

    const fontString = `${fontWeight} ${computedFontSize}px ${computedFontFamily}`;

    // Measure text dimensions
    offCtx.font = fontString;
    const metrics = offCtx.measureText(rawText);
    const textWidth = Math.ceil(metrics.width);
    const textHeight = Math.ceil(computedFontSize * 1.3);

    // Padding around text to allow fuzz displacement without clipping
    const padX = Math.ceil(computedFontSize * 0.4);
    const padY = Math.ceil(computedFontSize * 0.3);

    const logicalWidth = textWidth + padX * 2;
    const logicalHeight = textHeight + padY * 2;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    ctx.scale(dpr, dpr);

    // Render static text to offscreen canvas
    offscreen.width = logicalWidth * dpr;
    offscreen.height = logicalHeight * dpr;
    offCtx.scale(dpr, dpr);

    offCtx.font = fontString;
    offCtx.fillStyle = color;
    offCtx.textBaseline = 'middle';
    offCtx.textAlign = 'center';

    offCtx.fillText(rawText, logicalWidth / 2, logicalHeight / 2);

    const sliceHeight = 2; // Pixel height of each horizontal slice

    const render = () => {
      if (isCancelled) return;

      // Smoothly interpolate current fuzz intensity
      targetIntensity = isHovered && enableHover ? hoverIntensity : baseIntensity;
      currentIntensity += (targetIntensity - currentIntensity) * 0.12;

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const maxDisplacement = computedFontSize * 0.22 * currentIntensity;

      // Draw sliced, jittering text bands
      for (let y = 0; y < logicalHeight; y += sliceHeight) {
        // Pseudo-random offset for this horizontal band
        const noise = (Math.random() - 0.5) * 2;
        const offset = noise * maxDisplacement;

        // Occasional static tearing on random lines
        const isGlitchBand = Math.random() < currentIntensity * 0.15;
        const extraGlitch = isGlitchBand ? (Math.random() - 0.5) * maxDisplacement * 2.2 : 0;

        ctx.drawImage(
          offscreen,
          0,
          y * dpr,
          logicalWidth * dpr,
          sliceHeight * dpr,
          offset + extraGlitch,
          y,
          logicalWidth,
          sliceHeight
        );
      }

      // Chromatic RGB aberration during hover/high intensity
      if (currentIntensity > 0.3) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = (currentIntensity - 0.3) * 0.45;

        // Cyan / Blue channel shift
        ctx.drawImage(
          offscreen,
          0,
          0,
          logicalWidth * dpr,
          logicalHeight * dpr,
          maxDisplacement * 0.4,
          0,
          logicalWidth,
          logicalHeight
        );

        // Red / Magenta channel shift
        ctx.drawImage(
          offscreen,
          0,
          0,
          logicalWidth * dpr,
          logicalHeight * dpr,
          -maxDisplacement * 0.4,
          0,
          logicalWidth,
          logicalHeight
        );
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
    };
  }, [rawText, fontSize, fontWeight, fontFamily, color, enableHover, baseIntensity, hoverIntensity, isHovered]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => enableHover && setIsHovered(true)}
      onMouseLeave={() => enableHover && setIsHovered(false)}
      className={`inline-flex items-center justify-center select-none cursor-default ${className}`}
      {...props}
    >
      <canvas ref={canvasRef} className="block pointer-events-auto" />
    </div>
  );
}

