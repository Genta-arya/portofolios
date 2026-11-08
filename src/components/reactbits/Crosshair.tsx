import React, { useState, useEffect, useRef } from 'react';

export interface CrosshairProps {
  color?: string;
  containerRef?: React.RefObject<HTMLElement | null> | null;
  thickness?: number;
  opacity?: number;
  showCoordinates?: boolean;
  enableTargetLock?: boolean;
  enableClickPulse?: boolean;
  lineStyle?: 'solid' | 'dashed';
  blendMode?: React.CSSProperties['mixBlendMode'];
  className?: string;
}

interface TargetLockRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ClickPulse {
  id: number;
  x: number;
  y: number;
}

export default function Crosshair({
  color = '#C084FC',
  containerRef = null,
  thickness = 1,
  opacity = 0.85,
  showCoordinates = true,
  enableTargetLock = true,
  enableClickPulse = true,
  lineStyle = 'dashed',
  blendMode = 'screen',
  className = '',
}: CrosshairProps) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const [targetRect, setTargetRect] = useState<TargetLockRect | null>(null);
  const [pulses, setPulses] = useState<ClickPulse[]>([]);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const pulseIdRef = useRef(0);

  // Detect touch-only screen to avoid unwanted overlays on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch =
        window.matchMedia('(hover: none) and (pointer: coarse)').matches ||
        'ontouchstart' in window;
      setIsTouchDevice(isTouch);
    }
  }, []);

  useEffect(() => {
    if (isTouchDevice) return;

    const targetNode = containerRef ? containerRef.current : window;
    if (!targetNode) return;

    let rafId: number | null = null;
    let pendingX = 0;
    let pendingY = 0;

    const handlePointerMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const clientX = mouseEvent.clientX;
      const clientY = mouseEvent.clientY;

      if (containerRef && containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        if (
          clientX < bounds.left ||
          clientX > bounds.right ||
          clientY < bounds.top ||
          clientY > bounds.bottom
        ) {
          setPos(null);
          setTargetRect(null);
          return;
        }
        pendingX = clientX - bounds.left;
        pendingY = clientY - bounds.top;
      } else {
        pendingX = clientX;
        pendingY = clientY;
      }

      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          setPos({ x: pendingX, y: pendingY });

          // Target lock detection for interactive elements
          if (enableTargetLock) {
            const el = document.elementFromPoint(clientX, clientY);
            const interactiveEl = el?.closest(
              'a, button, [role="button"], input, select, textarea, [data-interactive="true"]'
            );

            if (interactiveEl) {
              const r = interactiveEl.getBoundingClientRect();
              if (containerRef && containerRef.current) {
                const cb = containerRef.current.getBoundingClientRect();
                setTargetRect({
                  x: r.left - cb.left,
                  y: r.top - cb.top,
                  width: r.width,
                  height: r.height,
                });
              } else {
                setTargetRect({
                  x: r.left,
                  y: r.top,
                  width: r.width,
                  height: r.height,
                });
              }
            } else {
              setTargetRect(null);
            }
          }

          rafId = null;
        });
      }
    };

    const handleMouseLeave = () => {
      setPos(null);
      setTargetRect(null);
    };

    const handlePointerDown = (e: Event) => {
      if (!enableClickPulse) return;
      const mouseEvent = e as MouseEvent;
      const clientX = mouseEvent.clientX;
      const clientY = mouseEvent.clientY;

      let clickX = clientX;
      let clickY = clientY;
      if (containerRef && containerRef.current) {
        const bounds = containerRef.current.getBoundingClientRect();
        clickX = clientX - bounds.left;
        clickY = clientY - bounds.top;
      }

      const id = ++pulseIdRef.current;
      setPulses((prev) => [...prev.slice(-3), { id, x: clickX, y: clickY }]);

      setTimeout(() => {
        setPulses((prev) => prev.filter((p) => p.id !== id));
      }, 600);
    };

    if (containerRef && containerRef.current) {
      const el = containerRef.current;
      el.addEventListener('mousemove', handlePointerMove, { passive: true });
      el.addEventListener('mouseleave', handleMouseLeave);
      el.addEventListener('mousedown', handlePointerDown);
    } else {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
      document.body.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('mousedown', handlePointerDown);
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (containerRef && containerRef.current) {
        const el = containerRef.current;
        el.removeEventListener('mousemove', handlePointerMove);
        el.removeEventListener('mouseleave', handleMouseLeave);
        el.removeEventListener('mousedown', handlePointerDown);
      } else {
        window.removeEventListener('mousemove', handlePointerMove);
        document.body.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('mousedown', handlePointerDown);
      }
    };
  }, [containerRef, enableClickPulse, enableTargetLock, isTouchDevice]);

  if (isTouchDevice || !pos) return null;

  const isBounded = Boolean(containerRef);
  const positionClass = isBounded ? 'absolute' : 'fixed';

  return (
    <div
      className={`${positionClass} inset-0 pointer-events-none z-[9999] overflow-hidden select-none transition-opacity duration-200 ${className}`}
      style={{
        opacity,
        mixBlendMode: blendMode,
      }}
    >
      {/* Crosshair Lines with Radial Fade Mask to prevent full-screen divider appearance */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: `radial-gradient(circle 360px at ${pos.x}px ${pos.y}px, black 30%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(circle 360px at ${pos.x}px ${pos.y}px, black 30%, transparent 100%)`,
        }}
      >
        {/* Horizontal Crosshair Line */}
        <div
          className="absolute left-0 right-0 pointer-events-none transition-transform duration-75"
          style={{
            top: `${pos.y}px`,
            height: `${thickness}px`,
            backgroundColor: lineStyle === 'solid' ? color : 'transparent',
            backgroundImage:
              lineStyle === 'dashed'
                ? `linear-gradient(90deg, ${color} 50%, transparent 50%)`
                : undefined,
            backgroundSize: '12px 1px',
            boxShadow: `0 0 8px ${color}80`,
          }}
        />

        {/* Vertical Crosshair Line */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none transition-transform duration-75"
          style={{
            left: `${pos.x}px`,
            width: `${thickness}px`,
            backgroundColor: lineStyle === 'solid' ? color : 'transparent',
            backgroundImage:
              lineStyle === 'dashed'
                ? `linear-gradient(180deg, ${color} 50%, transparent 50%)`
                : undefined,
            backgroundSize: '1px 12px',
            boxShadow: `0 0 8px ${color}80`,
          }}
        />
      </div>

      {/* Center Reticle Point with Gap */}
      <div
        className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border flex items-center justify-center transition-all duration-150"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: targetRect ? '28px' : '18px',
          height: targetRect ? '28px' : '18px',
          borderColor: color,
          backgroundColor: targetRect ? `${color}20` : 'transparent',
          boxShadow: `0 0 10px ${color}90`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: `0 0 6px ${color}`,
          }}
        />
      </div>

      {/* Live Coordinates HUD Label */}
      {showCoordinates && (
        <div
          className="absolute pointer-events-none font-mono text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md border shadow-lg transition-transform duration-75"
          style={{
            left: `${pos.x + 14}px`,
            top: `${pos.y + 14}px`,
            color: color,
            backgroundColor: 'rgba(10, 5, 20, 0.85)',
            borderColor: `${color}50`,
            boxShadow: `0 4px 15px rgba(0,0,0,0.6), 0 0 10px ${color}30`,
          }}
        >
          <span>
            X:{Math.round(pos.x)} Y:{Math.round(pos.y)}
          </span>
          {targetRect && (
            <span className="ml-2 text-fuchsia-300">
              LOCK [{Math.round(targetRect.width)}×{Math.round(targetRect.height)}]
            </span>
          )}
        </div>
      )}

      {/* Target Lock Corner Brackets when hovering interactive element */}
      {targetRect && (
        <div
          className="absolute pointer-events-none border border-transparent transition-all duration-200"
          style={{
            left: `${targetRect.x - 4}px`,
            top: `${targetRect.y - 4}px`,
            width: `${targetRect.width + 8}px`,
            height: `${targetRect.height + 8}px`,
          }}
        >
          {/* Top-Left Corner */}
          <div
            className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2"
            style={{ borderColor: color, boxShadow: `0 0 8px ${color}80` }}
          />
          {/* Top-Right Corner */}
          <div
            className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2"
            style={{ borderColor: color, boxShadow: `0 0 8px ${color}80` }}
          />
          {/* Bottom-Left Corner */}
          <div
            className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2"
            style={{ borderColor: color, boxShadow: `0 0 8px ${color}80` }}
          />
          {/* Bottom-Right Corner */}
          <div
            className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2"
            style={{ borderColor: color, boxShadow: `0 0 8px ${color}80` }}
          />
        </div>
      )}

      {/* Click Pulse Ripples */}
      {pulses.map((pulse) => (
        <div
          key={pulse.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none animate-ping"
          style={{
            left: `${pulse.x}px`,
            top: `${pulse.y}px`,
            width: '40px',
            height: '40px',
            border: `1.5px solid ${color}`,
            boxShadow: `0 0 15px ${color}`,
          }}
        />
      ))}
    </div>
  );
}

