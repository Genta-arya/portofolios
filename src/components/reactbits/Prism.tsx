import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface PrismProps {
  speed?: number;
  intensity?: number;
  rainbowSpread?: number;
  className?: string;
}

export default function Prism({
  speed = 0.6,
  intensity = 0.5,
  rainbowSpread = 1.0,
  className = '',
}: PrismProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Prism Geometry (Cylinder with 3 segments creates an elegant triangular prism)
    const prismGeometry = new THREE.CylinderGeometry(1.6, 1.6, 2.6, 3, 1, false);

    // Refractive Glass Shader Material for Prism
    const prismMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uIntensity: { value: intensity },
        uSpread: { value: rainbowSpread },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uIntensity;
        uniform float uSpread;

        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldPosition;

        // Spectral Rainbow Dispersion Function
        vec3 spectralZ(float t) {
          return 0.5 + 0.5 * cos(6.28318 * (vec3(1.0, 0.66, 0.33) * uSpread + t));
        }

        void main() {
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), 2.5);

          // Internal prismatic refraction effect
          float dispersion = sin(vPosition.y * 3.0 + uTime * 1.5 + vNormal.x * 2.0);
          vec3 rainbow = spectralZ(dispersion * 0.5 + uMouse.x * 0.2);

          // Deep cosmic core tint (purple & fuchsia)
          vec3 coreColor = vec3(0.55, 0.15, 0.95);
          vec3 finalColor = mix(coreColor, rainbow, fresnel * 0.85);

          float alpha = (fresnel * 0.7 + 0.18) * uIntensity;
          gl_FragColor = vec4(finalColor * (1.2 + fresnel), alpha);
        }
      `,
    });

    const prismMesh = new THREE.Mesh(prismGeometry, prismMaterial);
    scene.add(prismMesh);

    // Beveled Wireframe Edge Glow
    const edgesGeometry = new THREE.EdgesGeometry(prismGeometry, 20);
    const edgesMaterial = new THREE.LineBasicMaterial({
      color: 0xD946EF,
      transparent: true,
      opacity: 0.65 * intensity,
      blending: THREE.AdditiveBlending,
    });
    const edgesMesh = new THREE.LineSegments(edgesGeometry, edgesMaterial);
    prismMesh.add(edgesMesh);

    // Radiating Spectral Light Beams (Ring of caustic planes)
    const beamCount = 6;
    const beamsGroup = new THREE.Group();
    const beamGeo = new THREE.PlaneGeometry(0.35, 6.0);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x8B5CF6,
      transparent: true,
      opacity: 0.18 * intensity,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < beamCount; i++) {
      const angle = (i / beamCount) * Math.PI * 2;
      const beam = new THREE.Mesh(beamGeo, beamMat);
      beam.position.set(Math.cos(angle) * 1.8, 0, Math.sin(angle) * 1.8);
      beam.rotation.z = Math.PI / 2;
      beam.rotation.y = -angle;
      beamsGroup.add(beam);
    }
    prismMesh.add(beamsGroup);

    // Mouse Interaction
    const mouse = new THREE.Vector2(0, 0);
    const targetRotation = new THREE.Vector2(0, 0);

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.set(x, y);
      targetRotation.set(y * 0.4, x * 0.6);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime() * speed;

      // Update Uniforms
      prismMaterial.uniforms.uTime.value = elapsedTime;
      prismMaterial.uniforms.uMouse.value.lerp(mouse, 0.05);

      // Smooth Rotation with Mouse Parallax
      prismMesh.rotation.y = elapsedTime * 0.45 + targetRotation.y;
      prismMesh.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2 + targetRotation.x;
      prismMesh.rotation.z = Math.cos(elapsedTime * 0.25) * 0.15;

      beamsGroup.rotation.y = -elapsedTime * 0.6;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      prismGeometry.dispose();
      prismMaterial.dispose();
      edgesGeometry.dispose();
      edgesMaterial.dispose();
      beamGeo.dispose();
      beamMat.dispose();
      renderer.dispose();
    };
  }, [speed, intensity, rainbowSpread]);

  return (
    <div
      ref={mountRef}
      className={`pointer-events-none select-none overflow-hidden ${className}`}
      style={{ willChange: 'transform' }}
    />
  );
}

