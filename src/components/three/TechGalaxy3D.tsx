import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import TechLogo from '../ui/TechLogo';

export interface TechItem {
  id?: number;
  name: string;
  roleLabel?: string | null;
  category: 'frontend' | 'backend' | 'mobile' | 'database' | 'devops';
  glowColor?: string | null;
}

interface TechGalaxy3DProps {
  techs?: TechItem[];
  activeCategory?: string;
  selectedTech?: TechItem | null;
  onSelectTech?: (tech: TechItem) => void;
}

// Brand color resolver
function getBrandColor(tech: TechItem): string {
  if (tech.glowColor) return tech.glowColor;
  const name = tech.name.toLowerCase();
  if (name.includes('react native')) return '#00D8FF';
  if (name.includes('react')) return '#61DAFB';
  if (name.includes('next')) return '#FFFFFF';
  if (name.includes('astro')) return '#FF5D01';
  if (name.includes('typescript')) return '#3178C6';
  if (name.includes('tailwind')) return '#38BDF8';
  if (name.includes('node')) return '#22C55E';
  if (name.includes('express')) return '#A855F7';
  if (name.includes('drizzle')) return '#C5F74F';
  if (name.includes('mysql')) return '#38BDF8';
  if (name.includes('kotlin')) return '#7F52FF';
  if (name.includes('cloudinary')) return '#3448C5';
  return '#8B5CF6';
}

// Tech Icon Glyph component (SVG vector icons)
function TechGlyph({ name, color }: { name: string; color: string }) {
  const n = name.toLowerCase();

  if (n.includes('react native') || n.includes('react')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(0 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.5" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="2" fill={color} />
      </svg>
    );
  }

  if (n.includes('astro')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
        <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
        <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
      </svg>
    );
  }

  if (n.includes('next')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.3 14.8-5.7-7.4v7.4H8V7.2h1.6l5.7 7.4V7.2h1.6v9.6h-1.6z" />
      </svg>
    );
  }

  if (n.includes('typescript')) {
    return (
      <span className="font-mono text-xs font-black tracking-tighter" style={{ color }}>
        TS
      </span>
    );
  }

  if (n.includes('tailwind')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color}>
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
      </svg>
    );
  }

  if (n.includes('node')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" />
        <circle cx="12" cy="12" r="3" fill={color} />
      </svg>
    );
  }

  if (n.includes('express')) {
    return (
      <span className="font-mono text-xs font-black tracking-tight" style={{ color }}>
        ex
      </span>
    );
  }

  if (n.includes('drizzle')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill={color}>
        <path d="M12 2.5c-4.5 6-7 9.5-7 13.5a7 7 0 0 0 14 0c0-4-2.5-7.5-7-13.5z" />
      </svg>
    );
  }

  if (n.includes('mysql')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    );
  }

  if (n.includes('kotlin')) {
    return (
      <span className="font-mono text-xs font-bold" style={{ color }}>
        KT
      </span>
    );
  }

  if (n.includes('cloudinary')) {
    return (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    );
  }

  // Fallback
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

// 1. Central Cyber Sun / Galaxy Core
function CyberSunCore({ onSelectCore }: { onSelectCore?: () => void }) {
  const sunMeshRef = useRef<THREE.Mesh>(null!);
  const coronaCageRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.4;
      sunMeshRef.current.rotation.x = Math.sin(t * 0.8) * 0.15;
      const scale = 1 + Math.sin(t * 2.5) * 0.05;
      sunMeshRef.current.scale.set(scale, scale, scale);
    }

    if (coronaCageRef.current) {
      coronaCageRef.current.rotation.y -= delta * 0.3;
      coronaCageRef.current.rotation.z += delta * 0.2;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.5;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.4;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Intense Aurora Point Light radiating from the sun */}
      <pointLight color="#D946EF" intensity={4} distance={18} decay={1.8} />
      <pointLight color="#8B5CF6" intensity={2.5} distance={12} decay={1.8} />

      {/* Sun Inner Glowing Core */}
      <mesh ref={sunMeshRef} onClick={onSelectCore} className="cursor-pointer">
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshStandardMaterial
          color="#9333EA"
          emissive="#D946EF"
          emissiveIntensity={1.4}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Pulsating Holographic Wireframe Shell */}
      <mesh ref={coronaCageRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial
          color="#E879F9"
          emissive="#C084FC"
          emissiveIntensity={0.8}
          wireframe
          transparent
          opacity={0.65}
        />
      </mesh>

      {/* Inner Mini Equatorial Rings */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.45, 0.02, 16, 64]} />
        <meshBasicMaterial color="#E879F9" transparent opacity={0.7} />
      </mesh>

      <mesh ref={ring2Ref} rotation={[-Math.PI / 3, 0.4, 0]}>
        <torusGeometry args={[1.65, 0.015, 16, 64]} />
        <meshBasicMaterial color="#818CF8" transparent opacity={0.6} />
      </mesh>

      {/* Core HTML Badge Overlay */}
      <Html center distanceFactor={14} position={[0, -1.5, 0]}>
        <div className="pointer-events-none select-none flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D0818]/90 backdrop-blur-md border border-fuchsia-500/40 shadow-[0_0_15px_rgba(217,70,239,0.35)] whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-fuchsia-400 animate-ping" />
          <span className="text-[10px] sm:text-xs font-bold text-fuchsia-200 tracking-wider">
            GENTHA // CORE
          </span>
        </div>
      </Html>
    </group>
  );
}

// 2. Individual 3D Orbit Track
function OrbitTrack({
  radius,
  tilt,
  color = '#8B5CF6',
  opacity = 0.25,
}: {
  radius: number;
  tilt: [number, number, number];
  color?: string;
  opacity?: number;
}) {
  return (
    <group rotation={tilt}>
      <mesh>
        <torusGeometry args={[radius, 0.018, 16, 120]} />
        <meshBasicMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

// 3. Planet Tech Node
function TechPlanetNode({
  tech,
  radius,
  baseAngle,
  orbitTilt,
  speed,
  isHighlighted,
  isDimmed,
  isSelected,
  onSelect,
}: {
  tech: TechItem;
  radius: number;
  baseAngle: number;
  orbitTilt: [number, number, number];
  speed: number;
  isHighlighted: boolean;
  isDimmed: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const planetGroupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const haloRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);

  const brandColor = useMemo(() => getBrandColor(tech), [tech]);

  // Compute tilt rotation matrix once
  const tiltEuler = useMemo(() => new THREE.Euler(orbitTilt[0], orbitTilt[1], orbitTilt[2], 'XYZ'), [orbitTilt]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    // Orbital rotation
    const currentAngle = baseAngle + t * speed;
    const x = Math.cos(currentAngle) * radius;
    const z = Math.sin(currentAngle) * radius;
    const y = Math.sin(t * 1.8 + baseAngle) * 0.18; // Vertical oscillation

    // Apply orbit plane tilt to position
    const pos = new THREE.Vector3(x, y, z).applyEuler(tiltEuler);

    if (planetGroupRef.current) {
      planetGroupRef.current.position.copy(pos);
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.8;
      meshRef.current.rotation.x += delta * 0.4;
    }

    if (haloRef.current) {
      haloRef.current.rotation.z += delta * 1.2;
    }
  });

  const active = hovered || isSelected;

  return (
    <group ref={planetGroupRef}>
      {/* Glowing 3D Tech Sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        scale={active ? 1.35 : isHighlighted ? 1.15 : isDimmed ? 0.75 : 1}
        className="cursor-pointer"
      >
        <sphereGeometry args={[0.3, 24, 24]} />
        <meshStandardMaterial
          color={brandColor}
          emissive={brandColor}
          emissiveIntensity={active ? 2.0 : isHighlighted ? 1.4 : isDimmed ? 0.3 : 0.85}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Orbiting Halo Ring */}
      <mesh ref={haloRef} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[0.45, 0.015, 12, 32]} />
        <meshBasicMaterial
          color={brandColor}
          transparent
          opacity={active ? 0.9 : isHighlighted ? 0.6 : isDimmed ? 0.15 : 0.4}
        />
      </mesh>

      {/* Localized Glow Light for Active/Highlighted nodes */}
      {(active || isHighlighted) && (
        <pointLight color={brandColor} intensity={active ? 2.5 : 1.2} distance={4} />
      )}

      {/* Interactive 3D HTML Badge */}
      <Html
        center
        distanceFactor={14}
        position={[0, 0.55, 0]}
        style={{
          transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
          transform: active ? 'scale(1.15)' : isDimmed ? 'scale(0.85)' : 'scale(1)',
          opacity: isDimmed ? 0.45 : 1,
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-xl backdrop-blur-md transition-all duration-200 select-none cursor-pointer whitespace-nowrap ${
            active
              ? 'bg-[#120B24]/95 border-2 text-white shadow-lg'
              : isHighlighted
              ? 'bg-[#0D0818]/90 border text-zinc-100 shadow-md'
              : 'bg-[#0D0818]/80 border border-purple-500/30 text-zinc-300 hover:text-white hover:border-purple-400/60'
          }`}
          style={{
            borderColor: active
              ? brandColor
              : isHighlighted
              ? `${brandColor}99`
              : 'rgba(139, 92, 246, 0.3)',
            boxShadow: active
              ? `0 0 20px ${brandColor}70, 0 4px 12px rgba(0,0,0,0.5)`
              : isHighlighted
              ? `0 0 12px ${brandColor}40`
              : 'none',
          }}
        >
          {/* Brand Icon */}
          <div
            className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
            style={{
              backgroundColor: `${brandColor}22`,
              border: `1px solid ${brandColor}55`,
            }}
          >
            <TechLogo name={tech.name} color={brandColor} size={14} className="w-3.5 h-3.5" />
          </div>

          {/* Text Labels */}
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-bold leading-tight flex items-center gap-1">
              {tech.name}
              {isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </span>
            <span className="text-[9px] text-zinc-400 font-medium leading-none mt-0.5">
              {tech.roleLabel || tech.category}
            </span>
          </div>
        </button>
      </Html>
    </group>
  );
}

// 4. Galaxy System Assembly
function GalaxySystem({
  techs,
  activeCategory,
  selectedTech,
  onSelectTech,
}: {
  techs: TechItem[];
  activeCategory: string;
  selectedTech: TechItem | null;
  onSelectTech?: (tech: TechItem) => void;
}) {
  // Define 3 cosmic orbit tiers
  const orbit1Radius = 3.3;
  const orbit1Tilt: [number, number, number] = [Math.PI / 8, 0, Math.PI / 16];
  const orbit1Speed = 0.16;

  const orbit2Radius = 5.1;
  const orbit2Tilt: [number, number, number] = [-Math.PI / 10, 0.2, -Math.PI / 14];
  const orbit2Speed = 0.11;

  const orbit3Radius = 6.9;
  const orbit3Tilt: [number, number, number] = [Math.PI / 12, -0.25, Math.PI / 10];
  const orbit3Speed = 0.07;

  // Distribute items across the 3 orbits
  const distributedTechs = useMemo(() => {
    return techs.map((tech, index) => {
      let orbitTier = 0;
      let totalInTier = 1;
      let indexInTier = 0;

      // Grouping logic: divide into 3 orbits
      const tierIndex = index % 3;
      if (tierIndex === 0) {
        orbitTier = 1;
      } else if (tierIndex === 1) {
        orbitTier = 2;
      } else {
        orbitTier = 3;
      }

      // Count items in this tier
      const allInTier = techs.filter((_, i) => i % 3 === tierIndex);
      totalInTier = allInTier.length;
      indexInTier = allInTier.indexOf(tech);

      const baseAngle = (indexInTier / (totalInTier || 1)) * Math.PI * 2 + (tierIndex * 1.1);

      return {
        tech,
        orbitTier,
        baseAngle,
      };
    });
  }, [techs]);

  return (
    <group>
      {/* Central Cyber Sun */}
      <CyberSunCore />

      {/* Orbit 1: Inner Orbit Track */}
      <OrbitTrack
        radius={orbit1Radius}
        tilt={orbit1Tilt}
        color="#D946EF"
        opacity={0.3}
      />

      {/* Orbit 2: Middle Orbit Track */}
      <OrbitTrack
        radius={orbit2Radius}
        tilt={orbit2Tilt}
        color="#8B5CF6"
        opacity={0.25}
      />

      {/* Orbit 3: Outer Orbit Track */}
      <OrbitTrack
        radius={orbit3Radius}
        tilt={orbit3Tilt}
        color="#6366F1"
        opacity={0.2}
      />

      {/* Orbiting Tech Planets */}
      {distributedTechs.map(({ tech, orbitTier, baseAngle }) => {
        const radius = orbitTier === 1 ? orbit1Radius : orbitTier === 2 ? orbit2Radius : orbit3Radius;
        const orbitTilt = orbitTier === 1 ? orbit1Tilt : orbitTier === 2 ? orbit2Tilt : orbit3Tilt;
        const speed = orbitTier === 1 ? orbit1Speed : orbitTier === 2 ? orbit2Speed : orbit3Speed;

        const isCategoryMatch = activeCategory === 'all' || tech.category === activeCategory;
        const isHighlighted = activeCategory !== 'all' && isCategoryMatch;
        const isDimmed = activeCategory !== 'all' && !isCategoryMatch;
        const isSelected = selectedTech?.name === tech.name;

        return (
          <TechPlanetNode
            key={tech.name}
            tech={tech}
            radius={radius}
            baseAngle={baseAngle}
            orbitTilt={orbitTilt}
            speed={speed}
            isHighlighted={isHighlighted}
            isDimmed={isDimmed}
            isSelected={isSelected}
            onSelect={() => onSelectTech?.(tech)}
          />
        );
      })}
    </group>
  );
}

// Default Tech Stack definition
const defaultTechStack: TechItem[] = [
  { name: 'React JS', roleLabel: 'Frontend UI', category: 'frontend', glowColor: '#61DAFB' },
  { name: 'TypeScript', roleLabel: 'Type Safety', category: 'frontend', glowColor: '#3178C6' },
  { name: 'Astro 5', roleLabel: 'Meta-Framework', category: 'frontend', glowColor: '#FF5D01' },
  { name: 'Next.js', roleLabel: 'Fullstack React', category: 'frontend', glowColor: '#FFFFFF' },
  { name: 'Tailwind CSS', roleLabel: 'Modern Styling', category: 'frontend', glowColor: '#38BDF8' },
  { name: 'Node.js', roleLabel: 'Runtime Engine', category: 'backend', glowColor: '#22C55E' },
  { name: 'Express JS', roleLabel: 'REST API', category: 'backend', glowColor: '#A855F7' },
  { name: 'Drizzle ORM', roleLabel: 'High-Speed ORM', category: 'backend', glowColor: '#C5F74F' },
  { name: 'MySQL', roleLabel: 'Relational DB', category: 'database', glowColor: '#00758F' },
  { name: 'React Native', roleLabel: 'Mobile Android', category: 'mobile', glowColor: '#00D8FF' },
  { name: 'Kotlin', roleLabel: 'Native Android', category: 'mobile', glowColor: '#7F52FF' },
  { name: 'Cloudinary', roleLabel: 'Media CDN', category: 'devops', glowColor: '#3448C5' },
];

export default function TechGalaxy3D({
  techs = defaultTechStack,
  activeCategory = 'all',
  selectedTech = null,
  onSelectTech,
}: TechGalaxy3DProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const items = techs && techs.length > 0 ? techs : defaultTechStack;

  return (
    <div className="relative w-full h-[540px] sm:h-[620px] lg:h-[680px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#070312]/60 via-[#0B0618]/90 to-[#070312]/60 border border-purple-500/20 backdrop-blur-xl shadow-[0_0_50px_rgba(139,92,246,0.12)]">
      {mounted ? (
        <Canvas
          camera={{ position: [0, 8, 14], fov: 48 }}
          dpr={[1, 1.5]}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          {/* Lighting */}
          <ambientLight intensity={0.9} />
          <directionalLight position={[12, 18, 10]} intensity={1.5} color="#D946EF" />
          <pointLight position={[-12, -10, -8]} intensity={1.2} color="#38BDF8" />

          {/* Deep Space Dust & Stars */}
          <Stars radius={60} depth={40} count={1200} factor={3.5} saturation={0.5} fade speed={1.2} />

          {/* 3D Orbit & Galaxy Core */}
          <GalaxySystem
            techs={items}
            activeCategory={activeCategory}
            selectedTech={selectedTech}
            onSelectTech={onSelectTech}
          />

          {/* Interactive Camera Orbit Controls */}
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={true}
            autoRotateSpeed={0.6}
            minPolarAngle={Math.PI / 4.2}
            maxPolarAngle={Math.PI / 1.75}
            dampingFactor={0.06}
          />
        </Canvas>
      ) : (
        /* SSR Fallback Placeholder */
        <div className="w-full h-full flex flex-col items-center justify-center gap-4">
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-violet-900/30 blur-2xl animate-pulse" />
            <div className="w-20 h-20 rounded-full bg-violet-600 hover:bg-violet-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_30px_rgba(217,70,239,0.5)]">
              <span className="text-2xl">🌌</span>
            </div>
          </div>
          <span className="text-xs font-semibold tracking-wider text-purple-300 uppercase">
            Memuat Tech Galaxy Orbit...
          </span>
        </div>
      )}

      {/* Visual Ambient Vignette & Gradient Edges */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#070312_95%)]" />

      {/* Top Left Status Badge */}
      <div className="pointer-events-none absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D0818]/85 backdrop-blur-md border border-purple-500/30 text-purple-300 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>Galaxy Orbit Engine</span>
      </div>
    </div>
  );
}
