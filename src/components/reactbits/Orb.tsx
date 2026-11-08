import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export interface OrbProps extends React.HTMLAttributes<HTMLDivElement> {
  hue?: number; // Hue shift in degrees (default 0)
  hoverIntensity?: number; // Intensity factor when hovered (default 0.6)
  rotateOnHover?: boolean; // Whether to rotate faster on hover (default true)
  forceHoverState?: boolean; // Always keep hover state active (default false)
  className?: string;
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision highp float;

  uniform float iTime;
  uniform vec2 iResolution;
  uniform float hue;
  uniform float hover;
  uniform float rot;
  uniform float hoverIntensity;
  uniform vec2 uMouse;

  varying vec2 vUv;

  vec3 rgb2yiq(vec3 c) {
    float y = dot(c, vec3(0.299, 0.587, 0.114));
    float i = dot(c, vec3(0.596, -0.274, -0.322));
    float q = dot(c, vec3(0.211, -0.523, 0.312));
    return vec3(y, i, q);
  }

  vec3 yiq2rgb(vec3 c) {
    float r = dot(c, vec3(1.0, 0.956, 0.621));
    float g = dot(c, vec3(1.0, -0.272, -0.647));
    float b = dot(c, vec3(1.0, -1.107, 1.704));
    return vec3(r, g, b);
  }

  vec3 rotateHue(vec3 color, float angle) {
    vec3 yiq = rgb2yiq(color);
    float radiansAngle = angle * 0.01745329251;
    float cosA = cos(radiansAngle);
    float sinA = sin(radiansAngle);
    float i = yiq.y * cosA - yiq.z * sinA;
    float q = yiq.y * sinA + yiq.z * cosA;
    return yiq2rgb(vec3(yiq.x, i, q));
  }

  void main() {
    vec2 st = (gl_FragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

    // Mouse interactive deflection
    vec2 mouseOffset = (uMouse - 0.5) * 0.35 * hover;
    st -= mouseOffset;

    float r = length(st);
    float angle = atan(st.y, st.x) + rot + iTime * 0.35;

    // Outer plasma ring
    float ring1 = smoothstep(0.46, 0.52, r) - smoothstep(0.52, 0.76, r);
    float innerGlow = smoothstep(0.68, 0.0, r) * 0.32;

    // Orbiting luminous light trail
    float flare = pow(max(0.0, cos(angle - iTime * 1.6)), 14.0) * ring1 * 2.8;

    // Pulsing energetic ripple
    float ripple = sin(r * 24.0 - iTime * 3.2 + angle * 2.0) * 0.055;
    float ring2 = smoothstep(0.40 + ripple, 0.55 + ripple, r) - smoothstep(0.55 + ripple, 0.88 + ripple, r);

    // Cosmic violet / cyan / magenta gradient palette
    vec3 colViolet = vec3(0.68, 0.18, 0.98);
    vec3 colCyan = vec3(0.08, 0.78, 0.98);
    vec3 colMagenta = vec3(0.96, 0.28, 0.72);

    vec3 col = mix(colViolet, colCyan, sin(angle + iTime) * 0.5 + 0.5) * ring1;
    col += mix(colCyan, colMagenta, cos(angle * 2.0 - iTime * 0.7) * 0.5 + 0.5) * ring2 * 0.8;
    col += vec3(0.92, 0.85, 1.0) * flare;
    col += colViolet * innerGlow;

    // Atmospheric outer corona
    float corona = exp(-r * 2.4) * (0.35 + 0.45 * hover * hoverIntensity);
    col += mix(colViolet, colCyan, 0.5) * corona;

    // Hue rotation
    col = rotateHue(col, hue);

    float alpha = clamp(length(col) * 1.25, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export default function Orb({
  hue = 0,
  hoverIntensity = 0.6,
  rotateOnHover = true,
  forceHoverState = false,
  className = '',
  ...props
}: OrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const hoverRef = useRef(forceHoverState ? 1.0 : 0.0);
  const rotRef = useRef(0.0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Setup Three.js minimal orthographic canvas
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) },
      hue: { value: hue },
      hover: { value: forceHoverState ? 1.0 : 0.0 },
      rot: { value: 0.0 },
      hoverIntensity: { value: hoverIntensity },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationFrameId: number;
    let isCancelled = false;
    const clock = new THREE.Clock();

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      uniforms.iResolution.value.set(width, height);
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height; // WebGL inverted Y
      mouseRef.current.targetX = Math.max(0, Math.min(1, x));
      mouseRef.current.targetY = Math.max(0, Math.min(1, y));
    };

    const handleMouseEnter = () => {
      if (!forceHoverState) hoverRef.current = 1.0;
    };

    const handleMouseLeave = () => {
      if (!forceHoverState) {
        hoverRef.current = 0.0;
        mouseRef.current.targetX = 0.5;
        mouseRef.current.targetY = 0.5;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      if (isCancelled) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Lerp mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.08;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.08;
      uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);

      // Lerp hover
      const targetHover = forceHoverState ? 1.0 : hoverRef.current;
      uniforms.hover.value += (targetHover - uniforms.hover.value) * 0.08;

      // Rotate on hover or subtle idle drift
      if (rotateOnHover && uniforms.hover.value > 0.05) {
        rotRef.current += delta * 0.6 * uniforms.hover.value;
      } else {
        rotRef.current += delta * 0.12;
      }
      uniforms.rot.value = rotRef.current;

      uniforms.iTime.value = elapsedTime;
      uniforms.hue.value = hue;
      uniforms.hoverIntensity.value = hoverIntensity;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden pointer-events-auto ${className}`}
      {...props}
    />
  );
}

