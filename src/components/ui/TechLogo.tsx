import React from 'react';
import {
  siReact,
  siTypescript,
  siAstro,
  siNextdotjs,
  siTailwindcss,
  siNodedotjs,
  siExpress,
  siDrizzle,
  siMysql,
  siKotlin,
  siCloudinary,
  siAndroid,
  siFlutter,
  siJavascript,
  siPython,
  siPostgresql,
  siMongodb,
  siDocker,
  siGit,
  siFigma,
  siVite,
} from 'simple-icons';

export interface TechLogoProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  color?: string;
  size?: number | string;
  className?: string;
}

export function getTechLogoInfo(name: string): { path: string; color: string } | null {
  const n = (name || '').toLowerCase().trim();
  if (n.includes('react native')) return { path: siReact.path, color: '#00D8FF' };
  if (n.includes('react')) return { path: siReact.path, color: '#61DAFB' };
  if (n.includes('typescript') || n === 'ts') return { path: siTypescript.path, color: '#3178C6' };
  if (n.includes('astro')) return { path: siAstro.path, color: '#FF5D01' };
  if (n.includes('next')) return { path: siNextdotjs.path, color: '#FFFFFF' };
  if (n.includes('tailwind')) return { path: siTailwindcss.path, color: '#38BDF8' };
  if (n.includes('node')) return { path: siNodedotjs.path, color: '#5FA04E' };
  if (n.includes('express')) return { path: siExpress.path, color: '#A855F7' };
  if (n.includes('drizzle')) return { path: siDrizzle.path, color: '#C5F74F' };
  if (n.includes('mysql')) return { path: siMysql.path, color: '#4479A1' };
  if (n.includes('kotlin')) return { path: siKotlin.path, color: '#7F52FF' };
  if (n.includes('cloudinary')) return { path: siCloudinary.path, color: '#3448C5' };
  if (n.includes('android')) return { path: siAndroid.path, color: '#3DDC84' };
  if (n.includes('flutter')) return { path: siFlutter.path, color: '#02569B' };
  if (n.includes('javascript') || n === 'js') return { path: siJavascript.path, color: '#F7DF1E' };
  if (n.includes('python')) return { path: siPython.path, color: '#3776AB' };
  if (n.includes('postgre')) return { path: siPostgresql.path, color: '#4169E1' };
  if (n.includes('mongo')) return { path: siMongodb.path, color: '#47A248' };
  if (n.includes('docker')) return { path: siDocker.path, color: '#2496ED' };
  if (n.includes('git')) return { path: siGit.path, color: '#F05032' };
  if (n.includes('figma')) return { path: siFigma.path, color: '#F24E1E' };
  if (n.includes('vite')) return { path: siVite.path, color: '#646CFF' };
  return null;
}

export default function TechLogo({
  name,
  color,
  size = 24,
  className = '',
  ...props
}: TechLogoProps) {
  const info = getTechLogoInfo(name);
  const resolvedColor = color || info?.color || '#A855F7';

  if (info) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        fill="currentColor"
        width={size}
        height={size}
        className={`shrink-0 ${className}`}
        style={{ color: resolvedColor, ...props.style }}
        aria-label={`${name} logo`}
        {...props}
      >
        <path d={info.path} />
      </svg>
    );
  }

  // Fallback monogram
  return (
    <span
      className={`font-black text-xs font-mono uppercase shrink-0 ${className}`}
      style={{ color: resolvedColor }}
    >
      {name.slice(0, 3)}
    </span>
  );
}

