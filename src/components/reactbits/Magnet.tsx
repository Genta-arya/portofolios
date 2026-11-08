import React, { useRef, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: { type: string; damping: number; stiffness: number; mass: number };
  inactiveTransition?: { type: string; damping: number; stiffness: number; mass: number };
  className?: string;
}

export default function Magnet({
  children,
  padding = 40,
  disabled = false,
  magnetStrength = 0.35,
  activeTransition = { type: 'spring', damping: 15, stiffness: 180, mass: 0.1 },
  inactiveTransition = { type: 'spring', damping: 12, stiffness: 220, mass: 0.2 },
  className = '',
}: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const springX = useSpring(0, inactiveTransition);
  const springY = useSpring(0, inactiveTransition);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = clientX - centerX;
    const distY = clientY - centerY;

    springX.set(distX * magnetStrength);
    springY.set(distY * magnetStrength);
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

