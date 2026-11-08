import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TechLogo from '../ui/TechLogo';

export interface BounceCardItem {
  name: string;
  roleLabel?: string | null;
  category: string;
  glowColor?: string | null;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

interface BounceCardsProps {
  items: BounceCardItem[];
  selectedItem?: BounceCardItem | null;
  onSelectItem?: (item: BounceCardItem) => void;
  className?: string;
}

export default function BounceCards({
  items,
  selectedItem,
  onSelectItem,
  className = '',
}: BounceCardsProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // Pre-calculated organic fan transforms
  const getCardTransform = (index: number, total: number, isHovered: boolean, anyHovered: boolean) => {
    const center = (total - 1) / 2;
    const offset = index - center;

    if (isHovered) {
      return {
        x: offset * 45,
        y: -35,
        rotate: 0,
        scale: 1.18,
        zIndex: 40,
      };
    }

    if (anyHovered) {
      // Fan spreads open wider when any card is hovered
      const push = offset < (hoveredIdx ?? 0) - center ? -28 : 28;
      return {
        x: offset * 52 + push,
        y: Math.abs(offset) * 8 - 5,
        rotate: offset * 7,
        scale: 0.96,
        zIndex: 10 + index,
      };
    }

    // Default resting fan-out posture
    return {
      x: offset * 38,
      y: Math.pow(Math.abs(offset), 1.5) * 6,
      rotate: offset * 6,
      scale: 1,
      zIndex: 10 + index,
    };
  };

  return (
    <div className={`relative w-full py-16 flex items-center justify-center select-none overflow-visible ${className}`}>
      <div className="relative flex items-center justify-center min-h-[260px] sm:min-h-[290px] w-full max-w-4xl px-4">
        {items.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const isSelected = selectedItem?.name === item.name;
          const anyHovered = hoveredIdx !== null;
          const target = getCardTransform(idx, items.length, isHovered, anyHovered);
          const color = item.glowColor || '#8B5CF6';
          const Icon = item.icon;

          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 60, scale: 0.8, rotate: target.rotate * 1.5 }}
              animate={{
                opacity: 1,
                x: target.x,
                y: target.y,
                rotate: target.rotate,
                scale: isSelected ? 1.15 : target.scale,
                zIndex: isSelected ? 50 : target.zIndex,
              }}
              transition={{
                type: 'spring',
                stiffness: 280,
                damping: 20,
                mass: 0.8,
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => onSelectItem?.(item)}
              className="absolute w-36 sm:w-44 h-48 sm:h-56 rounded-3xl p-4 sm:p-5 flex flex-col justify-between cursor-pointer backdrop-blur-xl border transition-colors duration-300"
              style={{
                backgroundColor: 'rgba(14, 8, 28, 0.92)',
                borderColor: isHovered || isSelected ? color : 'rgba(139, 92, 246, 0.25)',
                boxShadow:
                  isHovered || isSelected
                    ? `0 15px 40px -10px ${color}80, 0 0 25px ${color}50`
                    : '0 10px 30px rgba(0, 0, 0, 0.6)',
              }}
            >
              {/* Top Row: Category Pill & Glow Dot */}
              <div className="flex items-center justify-between">
                <span
                  className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold tracking-wider uppercase"
                  style={{
                    backgroundColor: `${color}25`,
                    color: color,
                    border: `1px solid ${color}45`,
                  }}
                >
                  {item.category}
                </span>

                <span
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}`,
                  }}
                />
              </div>

              {/* Center: Large Tech Icon with Radial Glow */}
              <div className="my-auto flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-2 transition-transform duration-300"
                  style={{
                    backgroundColor: `${color}18`,
                    border: `1px solid ${color}40`,
                    boxShadow: isHovered ? `0 0 20px ${color}40` : undefined,
                    transform: isHovered ? 'scale(1.1) rotate(-5deg)' : 'scale(1)',
                  }}
                >
                  <TechLogo name={item.name} color={color} size={28} className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  {item.name}
                </h4>
                <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5 line-clamp-1">
                  {item.roleLabel || 'Tech Stack'}
                </p>
              </div>

              {/* Bottom: Clean metadata */}
              <div className="pt-2 border-t border-purple-500/15 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                <span>TECH</span>
                <span style={{ color: isHovered ? color : undefined }}>
                  {item.category.toUpperCase()}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

