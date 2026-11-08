import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import TechLogo from '../ui/TechLogo';

// Dynamic point light that follows the mouse cursor with smooth lerp
function MouseTrackingLight() {
  const lightRef = useRef<THREE.PointLight>(null!);
  const secondaryLightRef = useRef<THREE.PointLight>(null!);

  useFrame((state, delta) => {
    // Primary cursor light (fuchsia/magenta glow)
    if (lightRef.current) {
      const targetX = state.pointer.x * 3.5;
      const targetY = state.pointer.y * 3.5;
      lightRef.current.position.x = THREE.MathUtils.lerp(lightRef.current.position.x, targetX, delta * 4);
      lightRef.current.position.y = THREE.MathUtils.lerp(lightRef.current.position.y, targetY, delta * 4);
    }
    // Counter-balance cursor light (cyan/electric indigo glow on opposite side)
    if (secondaryLightRef.current) {
      const oppX = -state.pointer.x * 2.8;
      const oppY = -state.pointer.y * 2.8;
      secondaryLightRef.current.position.x = THREE.MathUtils.lerp(secondaryLightRef.current.position.x, oppX, delta * 3);
      secondaryLightRef.current.position.y = THREE.MathUtils.lerp(secondaryLightRef.current.position.y, oppY, delta * 3);
    }
  });

  return (
    <>
      <pointLight ref={lightRef} position={[0, 0, 3]} intensity={2.6} distance={9} color="#E879F9" />
      <pointLight ref={secondaryLightRef} position={[0, 0, -2]} intensity={2.0} distance={8} color="#06B6D4" />
    </>
  );
}

// 3D Cosmic Core with interactive mouse rotation, dynamic rings, and orbiting satellite nodes
function CosmicCore() {
  const coreGroupRef = useRef<THREE.Group>(null!);
  const innerSphereRef = useRef<THREE.Mesh>(null!);
  const wireframeCageRef = useRef<THREE.Mesh>(null!);
  const outerHaloRef = useRef<THREE.Mesh>(null!);
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const ring3Ref = useRef<THREE.Mesh>(null!);
  const node1Ref = useRef<THREE.Mesh>(null!);
  const node2Ref = useRef<THREE.Mesh>(null!);
  const node3Ref = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // 1. Mouse pointer tracking with smooth lerp on the entire core group
    if (coreGroupRef.current) {
      const targetRotX = -state.pointer.y * 0.45;
      const targetRotY = state.pointer.x * 0.55;
      coreGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        coreGroupRef.current.rotation.x,
        targetRotX,
        delta * 3.5
      );
      coreGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        coreGroupRef.current.rotation.y,
        targetRotY,
        delta * 3.5
      );
    }

    // 2. Inner Obsidian/Violet Core Rotation
    if (innerSphereRef.current) {
      innerSphereRef.current.rotation.y += delta * 0.35;
      innerSphereRef.current.rotation.x += delta * 0.15;
    }

    // 3. Middle Holographic Fuchsia Wireframe Cage Counter-Rotation
    if (wireframeCageRef.current) {
      wireframeCageRef.current.rotation.y -= delta * 0.25;
      wireframeCageRef.current.rotation.z += delta * 0.2;
    }

    // 4. Outer Cyan Geometric Halo Rotation
    if (outerHaloRef.current) {
      outerHaloRef.current.rotation.x += delta * 0.12;
      outerHaloRef.current.rotation.y -= delta * 0.18;
    }

    // 5. Dynamic Orbiting Rings with smooth oscillatory tilts
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.32;
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.7) * 0.12;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z -= delta * 0.26;
      ring2Ref.current.rotation.y = -Math.PI / 3.2 + Math.cos(t * 0.6) * 0.12;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.28;
      ring3Ref.current.rotation.z = Math.PI / 5 + Math.sin(t * 0.5) * 0.15;
    }

    // 6. Orbiting Satellite Energy Nodes
    const r1 = 1.48;
    const a1 = t * 1.3;
    if (node1Ref.current) {
      const x = Math.cos(a1) * r1;
      const y = Math.sin(a1) * r1 * Math.cos(Math.PI / 3);
      const z = Math.sin(a1) * r1 * Math.sin(Math.PI / 3);
      node1Ref.current.position.set(x, y, z);
    }

    const r2 = 1.72;
    const a2 = -t * 1.1 + 1.5;
    if (node2Ref.current) {
      const x = Math.cos(a2) * r2 * Math.cos(-Math.PI / 3.2);
      const y = Math.sin(a2) * r2;
      const z = Math.cos(a2) * r2 * Math.sin(-Math.PI / 3.2);
      node2Ref.current.position.set(x, y, z);
    }

    const r3 = 1.92;
    const a3 = t * 0.9 + 3.0;
    if (node3Ref.current) {
      const x = Math.cos(a3) * r3;
      const y = Math.sin(a3) * r3 * Math.sin(Math.PI / 5);
      const z = Math.sin(a3) * r3 * Math.cos(Math.PI / 5);
      node3Ref.current.position.set(x, y, z);
    }
  });

  return (
    <group ref={coreGroupRef}>
      {/* 1. Deep Obsidian / Royal Violet Inner Core */}
      <mesh ref={innerSphereRef}>
        <icosahedronGeometry args={[0.82, 4]} />
        <meshStandardMaterial
          color="#6D28D9"
          emissive="#2E1065"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* 2. Middle Holographic Fuchsia Wireframe Lattice Cage */}
      <mesh ref={wireframeCageRef}>
        <icosahedronGeometry args={[1.02, 2]} />
        <meshStandardMaterial
          color="#D946EF"
          emissive="#A21CAF"
          emissiveIntensity={0.85}
          wireframe
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 3. Outer Geometric Cyber Shell (Cyan Accent) */}
      <mesh ref={outerHaloRef}>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#0891B2"
          emissiveIntensity={0.6}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* 4. Orbiting Rings (Fitted with safe margin to avoid edge clipping) */}
      {/* Ring 1 - Fuchsia Aurora */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.48, 0.02, 24, 100]} />
        <meshStandardMaterial
          color="#D946EF"
          emissive="#D946EF"
          emissiveIntensity={1.1}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Ring 2 - Electric Indigo / Purple */}
      <mesh ref={ring2Ref} rotation={[-Math.PI / 3.2, 0.4, 0]}>
        <torusGeometry args={[1.72, 0.016, 24, 100]} />
        <meshStandardMaterial
          color="#818CF8"
          emissive="#6366F1"
          emissiveIntensity={1.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Ring 3 - Northern Light Cyan */}
      <mesh ref={ring3Ref} rotation={[0.4, 0, Math.PI / 5]}>
        <torusGeometry args={[1.92, 0.012, 20, 100]} />
        <meshStandardMaterial
          color="#22D3EE"
          emissive="#06B6D4"
          emissiveIntensity={1.3}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* 5. Glowing Orbiting Satellite Energy Nodes */}
      <mesh ref={node1Ref}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#F472B6" emissive="#EC4899" emissiveIntensity={2.5} />
      </mesh>

      <mesh ref={node2Ref}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial color="#A78BFA" emissive="#8B5CF6" emissiveIntensity={2.5} />
      </mesh>

      <mesh ref={node3Ref}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#67E8F9" emissive="#06B6D4" emissiveIntensity={2.5} />
      </mesh>

      {/* 6. Surrounding Cosmic Sparkles in 3 Rich Accent Tiers */}
      <Sparkles count={40} scale={3.4} size={3.0} speed={0.4} opacity={0.8} color="#D946EF" />
      <Sparkles count={40} scale={3.8} size={2.5} speed={0.3} opacity={0.7} color="#8B5CF6" />
      <Sparkles count={30} scale={4.2} size={2.2} speed={0.5} opacity={0.65} color="#06B6D4" />
    </group>
  );
}

export default function Hero3DScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[440px] sm:max-w-[480px] lg:max-w-[520px] flex items-center justify-center mx-auto select-none">
      {/* Background radial cosmic glow */}
      <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-purple-600/20 via-fuchsia-600/15 to-cyan-500/15 blur-3xl pointer-events-none -z-10 animate-pulse" />

      {mounted ? (
        <Canvas
          camera={{ position: [0, 0, 6.0], fov: 44 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={0.7} color="#4C1D95" />
          <directionalLight position={[6, 8, 5]} intensity={1.8} color="#F472B6" />
          <directionalLight position={[-6, -6, -4]} intensity={1.2} color="#06B6D4" />

          {/* Interactive Mouse Lights */}
          <MouseTrackingLight />

          {/* Floating Smooth Physics enclosing the Cosmic Core */}
          <Float
            speed={2.2}
            rotationIntensity={0.5}
            floatIntensity={0.7}
            floatingRange={[-0.1, 0.1]}
          >
            <CosmicCore />
          </Float>
        </Canvas>
      ) : (
        /* SSR Fallback Placeholder with Glowing Cyber Orb */
        <div className="w-52 h-52 rounded-full bg-gradient-to-tr from-purple-600/40 via-fuchsia-500/30 to-cyan-500/30 blur-2xl animate-pulse" />
      )}

      {/* Floating Badges Overlay (Framing outside the 3D Cosmic Ball) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Badge 1: React JS */}
        <div className="absolute top-3 left-1 sm:left-3 px-3.5 py-1.5 rounded-full bg-[#0D071E]/90 backdrop-blur-md border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-[0_0_20px_rgba(6,182,212,0.35)] animate-float hover:scale-105 pointer-events-auto transition-transform flex items-center gap-2">
          <TechLogo name="React JS" color="#61DAFB" size={15} />
          <span>React JS</span>
        </div>

        {/* Badge 2: Express JS & MySQL */}
        <div
          className="absolute top-1/4 -right-1 sm:right-2 px-3.5 py-1.5 rounded-full bg-[#0D071E]/90 backdrop-blur-md border border-purple-500/40 text-purple-300 text-xs font-semibold shadow-[0_0_20px_rgba(139,92,246,0.35)] animate-float hover:scale-105 pointer-events-auto transition-transform flex items-center gap-2"
          style={{ animationDelay: '1.5s' }}
        >
          <div className="flex items-center -space-x-0.5">
            <TechLogo name="Express JS" color="#A855F7" size={14} />
            <TechLogo name="MySQL" color="#38BDF8" size={14} />
          </div>
          <span>Express &amp; MySQL</span>
        </div>

        {/* Badge 3: React Native & Android */}
        <div
          className="absolute bottom-10 left-1 sm:left-3 px-3.5 py-1.5 rounded-full bg-[#0D071E]/90 backdrop-blur-md border border-fuchsia-500/40 text-fuchsia-300 text-xs font-semibold shadow-[0_0_20px_rgba(217,70,239,0.35)] animate-float hover:scale-105 pointer-events-auto transition-transform flex items-center gap-2"
          style={{ animationDelay: '2.5s' }}
        >
          <div className="flex items-center -space-x-0.5">
            <TechLogo name="React Native" color="#00D8FF" size={14} />
            <TechLogo name="Android" color="#3DDC84" size={14} />
          </div>
          <span>React Native &amp; Android</span>
        </div>

        {/* Badge 4: Astro 5 & Tailwind CSS */}
        <div
          className="absolute bottom-3 right-1 sm:right-3 px-3.5 py-1.5 rounded-full bg-[#0D071E]/90 backdrop-blur-md border border-indigo-500/40 text-indigo-300 text-xs font-semibold shadow-[0_0_20px_rgba(99,102,241,0.35)] animate-float hover:scale-105 pointer-events-auto transition-transform flex items-center gap-2"
          style={{ animationDelay: '0.8s' }}
        >
          <div className="flex items-center -space-x-0.5">
            <TechLogo name="Astro" color="#FF5D01" size={14} />
            <TechLogo name="Tailwind CSS" color="#38BDF8" size={14} />
          </div>
          <span>Astro 5 &amp; Tailwind</span>
        </div>
      </div>
    </div>
  );
}
