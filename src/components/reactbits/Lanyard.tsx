import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface LanyardProps {
  photoUrl?: string;
  fullName?: string;
  roleTitle?: string;
  organization?: string;
  subdivision?: string;
  className?: string;
  canvasHeight?: string;
}

export default function Lanyard({
  photoUrl = '/images/gentha-photo.jpg',
  fullName = 'GENTHA ARYA PRATAMA',
  roleTitle = 'Fullstack Software Engineer',
  organization = 'FULLSTACK DEVELOPER',
  subdivision = 'Web & Mobile System Architecture',
  className = '',
  canvasHeight = 'h-[360px] sm:h-[420px] lg:h-[520px]',
}: LanyardProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 520;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.6);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 2. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xd946ef, 2.5);
    keyLight.position.set(4, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8b5cf6, 2.0);
    fillLight.position.set(-4, -2, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x06b6d4, 3.0, 12);
    rimLight.position.set(0, 4, 3);
    scene.add(rimLight);

    // 3. Anchor at the Top (Where lanyard hangs from)
    const anchorY = 3.9;

    // 4. Generate High-Res ID Card Texture on 2D Canvas
    const cardCanvas = document.createElement('canvas');
    cardCanvas.width = 1024;
    cardCanvas.height = 1580;
    const ctx = cardCanvas.getContext('2d');

    const cardTexture = new THREE.CanvasTexture(cardCanvas);
    cardTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Load Gentha's Photo
    const userImg = new Image();
    userImg.crossOrigin = 'anonymous';
    userImg.src = photoUrl;

    const drawCardCanvas = () => {
      if (!ctx) return;
      const w = cardCanvas.width;
      const h = cardCanvas.height;

      // 1. Deep Cosmic Carbon / Acrylic Gradient Background
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, '#150A2E');
      grad.addColorStop(0.3, '#0E0620');
      grad.addColorStop(0.7, '#080315');
      grad.addColorStop(1, '#05020D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 2. High-Tech Dot Matrix Pattern
      ctx.fillStyle = 'rgba(168, 85, 247, 0.07)';
      for (let x = 60; x < w - 60; x += 36) {
        for (let y = 60; y < h - 60; y += 36) {
          ctx.fillRect(x, y, 2.5, 2.5);
        }
      }

      // 3. Ambient Aurora Glow Behind Photo
      const radialGlow = ctx.createRadialGradient(w / 2, 440, 20, w / 2, 440, 280);
      radialGlow.addColorStop(0, 'rgba(217, 70, 239, 0.35)');
      radialGlow.addColorStop(0.5, 'rgba(139, 92, 246, 0.18)');
      radialGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = radialGlow;
      ctx.fillRect(0, 200, w, 480);

      // 4. Double Neon Holographic Border
      ctx.strokeStyle = '#D946EF';
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)';
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, w - 72, h - 72);

      // 5. Four Cybernetic Corner Accents
      const bSize = 42;
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 6;
      // Top-Left
      ctx.beginPath();
      ctx.moveTo(28, 28 + bSize);
      ctx.lineTo(28, 28);
      ctx.lineTo(28 + bSize, 28);
      ctx.stroke();
      // Top-Right
      ctx.beginPath();
      ctx.moveTo(w - 28 - bSize, 28);
      ctx.lineTo(w - 28, 28);
      ctx.lineTo(w - 28, 28 + bSize);
      ctx.stroke();
      // Bottom-Left
      ctx.beginPath();
      ctx.moveTo(28, h - 28 - bSize);
      ctx.lineTo(28, h - 28);
      ctx.lineTo(28 + bSize, h - 28);
      ctx.stroke();
      // Bottom-Right
      ctx.beginPath();
      ctx.moveTo(w - 28 - bSize, h - 28);
      ctx.lineTo(w - 28, h - 28);
      ctx.lineTo(w - 28, h - 28 - bSize);
      ctx.stroke();

      // 6. Header Bar (Futuristic Hologram Strip)
      const headerGrad = ctx.createLinearGradient(40, 0, w - 40, 0);
      headerGrad.addColorStop(0, '#7C3AED');
      headerGrad.addColorStop(0.5, '#D946EF');
      headerGrad.addColorStop(1, '#06B6D4');
      ctx.fillStyle = headerGrad;
      ctx.fillRect(44, 52, w - 88, 100);

      // Header Live Status LED
      ctx.beginPath();
      ctx.arc(88, 102, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#10B981';
      ctx.fill();
      ctx.strokeStyle = '#34D399';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 32px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('ONLINE', 110, 112);

      // Header Main Title
      ctx.font = '900 36px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('VERIFIED DEVELOPER ID', w / 2, 112);

      // Header Right Clearance Level
      ctx.font = 'bold 26px monospace';
      ctx.textAlign = 'right';
      ctx.fillStyle = '#E0F2FE';
      ctx.fillText('ACCESS L4', w - 80, 112);

      // 7. Subheader Tech Track Bar
      ctx.fillStyle = '#C084FC';
      ctx.font = 'bold 28px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('SOFTWARE ENGINEERING CREDENTIAL', w / 2, 195);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.fillText('SYSTEM ARCHITECT · WEB & MOBILE ECOSYSTEM', w / 2, 230);

      // 8. Circular Photo Frame ("FOTO BULATKAN AJA")
      const photoCenterX = w / 2;
      const photoCenterY = 440;
      const photoRadius = 185;

      // Circular Telemetry Degree Ticks
      ctx.save();
      ctx.translate(photoCenterX, photoCenterY);
      for (let a = 0; a < 360; a += 10) {
        ctx.strokeStyle = a % 30 === 0 ? '#06B6D4' : 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = a % 30 === 0 ? 3 : 1.5;
        const len = a % 30 === 0 ? 14 : 7;
        const rad = (a * Math.PI) / 180;
        ctx.beginPath();
        ctx.moveTo(Math.cos(rad) * (photoRadius + 16), Math.sin(rad) * (photoRadius + 16));
        ctx.lineTo(Math.cos(rad) * (photoRadius + 16 + len), Math.sin(rad) * (photoRadius + 16 + len));
        ctx.stroke();
      }
      ctx.restore();

      // Outer Glowing Ring
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius + 10, 0, Math.PI * 2);
      ctx.strokeStyle = '#D946EF';
      ctx.lineWidth = 7;
      ctx.stroke();

      // Inner Cyan Ring
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius + 2, 0, Math.PI * 2);
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 3.5;
      ctx.stroke();

      // Draw Circular Clipped Photo
      ctx.save();
      ctx.beginPath();
      ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();

      if (userImg.complete && userImg.naturalWidth > 0) {
        const aspect = userImg.naturalWidth / userImg.naturalHeight;
        const diam = photoRadius * 2;
        let dw, dh, dx, dy;
        if (aspect > 1) {
          dh = diam;
          dw = diam * aspect;
        } else {
          dw = diam;
          dh = diam / aspect;
        }
        dx = photoCenterX - dw / 2;
        dy = photoCenterY - dh / 2;
        ctx.drawImage(userImg, dx, dy, dw, dh);
      } else {
        ctx.fillStyle = '#2A1850';
        ctx.fill();
      }
      ctx.restore();

      // Verified Holographic Badge on Circular Photo (Bottom Right)
      const badgeX = photoCenterX + 120;
      const badgeY = photoCenterY + 130;
      ctx.fillStyle = '#064E3B';
      ctx.beginPath();
      ctx.arc(badgeX, badgeY, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 30px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('✓', badgeX, badgeY + 10);

      // 9. Identity & Developer Name
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 50px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(fullName.toUpperCase(), w / 2, 690);

      // Role Title
      ctx.fillStyle = '#E879F9';
      ctx.font = 'bold 32px system-ui, sans-serif';
      ctx.fillText('FULLSTACK SOFTWARE ENGINEER', w / 2, 738);

      // Core Stack Badges Strip
      const tags = ['REACT JS', 'REACT NATIVE', 'NODE.JS', 'MYSQL', 'ASTRO 5'];
      const tagTotalW = tags.length * 155;
      const tagStartX = (w - tagTotalW) / 2 + 15;

      tags.forEach((tag, idx) => {
        const tx = tagStartX + idx * 155;
        const ty = 770;
        ctx.fillStyle = '#180B35';
        ctx.fillRect(tx, ty, 140, 44);
        ctx.strokeStyle = idx % 2 === 0 ? '#A855F7' : '#06B6D4';
        ctx.lineWidth = 2;
        ctx.strokeRect(tx, ty, 140, 44);

        ctx.fillStyle = '#E2E8F0';
        ctx.font = 'bold 18px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(tag, tx + 70, ty + 28);
      });

      // 10. Telemetry Metrics Dashboard (3-Column Grid - "BIAR GA KOSONG")
      const dashX = 54;
      const dashY = 845;
      const dashW = w - 108;
      const dashH = 150;

      // Box Background
      ctx.fillStyle = '#0D061E';
      ctx.fillRect(dashX, dashY, dashW, dashH);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(dashX, dashY, dashW, dashH);

      // Column Dividers
      const colW = dashW / 3;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(dashX + colW, dashY);
      ctx.lineTo(dashX + colW, dashY + dashH);
      ctx.moveTo(dashX + colW * 2, dashY);
      ctx.lineTo(dashX + colW * 2, dashY + dashH);
      ctx.stroke();

      // Col 1: Experience
      ctx.textAlign = 'center';
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('EXPERIENCE', dashX + colW * 0.5, dashY + 46);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 40px system-ui';
      ctx.fillText('3+ YEARS', dashX + colW * 0.5, dashY + 105);

      // Col 2: Portfolio Apps
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('PRODUCTION', dashX + colW * 1.5, dashY + 46);
      ctx.fillStyle = '#38BDF8';
      ctx.font = '900 40px system-ui';
      ctx.fillText('15+ APPS', dashX + colW * 1.5, dashY + 105);

      // Col 3: Status
      ctx.fillStyle = '#94A3B8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('STATUS', dashX + colW * 2.5, dashY + 46);
      ctx.fillStyle = '#34D399';
      ctx.font = '900 36px system-ui';
      ctx.fillText('OPEN TO WORK', dashX + colW * 2.5, dashY + 104);

      // 11. Security Status Pill
      const pillY = 1025;
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.fillRect(w / 2 - 320, pillY, 640, 56);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(w / 2 - 320, pillY, 640, 56);

      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('✦ READY FOR FULLSTACK CONTRACTS ✦', w / 2, pillY + 37);

      // 12. Security Barcode
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 56; i++) {
        const barX = 94 + i * 15;
        const barW = i % 4 === 0 ? 8 : i % 2 === 0 ? 4 : 2;
        ctx.fillRect(barX, 1115, barW, 90);
      }

      ctx.fillStyle = '#94A3B8';
      ctx.font = '24px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('DEV-UUID // 7A9F-2026-GAP-FULLSTACK-ARCHITECT', w / 2, 1240);

      // 13. Smart Chip (Left) & Hologram Cryptographic Seal (Right)
      // Gold EMV Smart Microchip
      const chipX = 140;
      const chipY = 1275;
      const chipW = 140;
      const chipH = 95;

      const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
      chipGrad.addColorStop(0, '#F59E0B');
      chipGrad.addColorStop(0.5, '#FBBF24');
      chipGrad.addColorStop(1, '#D97706');
      ctx.fillStyle = chipGrad;
      ctx.fillRect(chipX, chipY, chipW, chipH);
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 4;
      ctx.strokeRect(chipX, chipY, chipW, chipH);

      // Internal Circuit Tracks
      ctx.strokeStyle = '#78350F';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(chipX + 25, chipY + 15, chipW - 50, chipH - 30);
      ctx.beginPath();
      ctx.moveTo(chipX + chipW / 2, chipY);
      ctx.lineTo(chipX + chipW / 2, chipY + chipH);
      ctx.moveTo(chipX, chipY + chipH / 2);
      ctx.lineTo(chipX + chipW, chipY + chipH / 2);
      ctx.stroke();

      // Right: Hologram Verified Security Stamp
      const stampX = w - 380;
      const stampY = 1275;
      const stampW = 240;
      const stampH = 95;

      ctx.fillStyle = '#140A28';
      ctx.fillRect(stampX, stampY, stampW, stampH);
      ctx.strokeStyle = '#C084FC';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(stampX, stampY, stampW, stampH);

      ctx.fillStyle = '#C084FC';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('ENCRYPTED ID', stampX + 18, stampY + 34);
      ctx.fillStyle = '#67E8F9';
      ctx.font = '16px monospace';
      ctx.fillText('AUTH: SHA-256 RSA', stampX + 18, stampY + 60);
      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('STATUS: VERIFIED', stampX + 18, stampY + 82);

      // 14. Bottom Microprint
      ctx.fillStyle = '#64748B';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('PORTFOLIO ACCESS PASS · MGENTAARYA.MY.ID · INDONESIA', w / 2, 1430);

      cardTexture.needsUpdate = true;
    };

    userImg.onload = () => {
      drawCardCanvas();
    };
    drawCardCanvas();

    // 5. Card 3D Geometry & Material
    const cardWidth = 2.4;
    const cardHeight = 3.6;
    const cardDepth = 0.04;
    const cardGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);

    // Front: Custom Texture, Back: Dark Hologram, Sides: Acrylic
    const frontMaterial = new THREE.MeshStandardMaterial({
      map: cardTexture,
      roughness: 0.25,
      metalness: 0.15,
    });

    const backMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0518,
      roughness: 0.3,
      metalness: 0.8,
    });

    const sideMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.1,
      metalness: 0.9,
    });

    const cardMaterials = [
      sideMaterial, // right
      sideMaterial, // left
      sideMaterial, // top
      sideMaterial, // bottom
      frontMaterial, // front
      backMaterial, // back
    ];

    const cardGroup = new THREE.Group();
    const cardMesh = new THREE.Mesh(cardGeometry, cardMaterials);
    cardMesh.castShadow = true;
    cardGroup.add(cardMesh);

    // 6. Metallic Clip on Top of Card
    const clipGeometry = new THREE.CylinderGeometry(0.12, 0.12, 0.35, 16);
    const clipMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4d4d8,
      metalness: 0.95,
      roughness: 0.2,
    });
    const clipMesh = new THREE.Mesh(clipGeometry, clipMaterial);
    clipMesh.position.set(0, cardHeight / 2 + 0.14, 0);
    clipMesh.rotation.z = Math.PI / 2;
    cardGroup.add(clipMesh);

    // Metallic Ring
    const ringGeometry = new THREE.TorusGeometry(0.16, 0.04, 12, 24);
    const ringMesh = new THREE.Mesh(ringGeometry, clipMaterial);
    ringMesh.position.set(0, cardHeight / 2 + 0.32, 0);
    cardGroup.add(ringMesh);

    scene.add(cardGroup);

    // 7. Hanging Lanyard Cord (Smooth 3D Tube connecting Anchor to Card Ring)
    const updateLanyardCurve = (cardClipPos: THREE.Vector3) => {
      const topAnchor = new THREE.Vector3(0, anchorY, 0);
      const midPoint = new THREE.Vector3(
        cardClipPos.x * 0.45,
        (anchorY + cardClipPos.y) / 2 - 0.25,
        cardClipPos.z * 0.45
      );

      const curve = new THREE.CatmullRomCurve3([topAnchor, midPoint, cardClipPos]);
      return new THREE.TubeGeometry(curve, 32, 0.05, 8, false);
    };

    const initialClipPos = new THREE.Vector3(0, 0.8, 0);
    let lanyardGeometry = updateLanyardCurve(initialClipPos);
    const lanyardMaterial = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      roughness: 0.6,
      metalness: 0.2,
    });

    const lanyardMesh = new THREE.Mesh(lanyardGeometry, lanyardMaterial);
    scene.add(lanyardMesh);

    // 8. Physics & Damped Harmonic Spring Simulation
    const restingPos = new THREE.Vector3(0, -0.6, 0);
    const cardPos = new THREE.Vector3(0, -0.6, 0);
    const cardVel = new THREE.Vector3(0, 0, 0);

    const cardRot = new THREE.Euler(0, 0, 0);
    const cardRotVel = new THREE.Vector3(0, 0, 0);

    // Drag Interaction States
    let isDragging = false;
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouse2D = new THREE.Vector2();
    const intersection = new THREE.Vector3();

    const getPointerPos = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      mouse2D.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse2D.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      getPointerPos(e);
      raycaster.setFromCamera(mouse2D, camera);
      const intersects = raycaster.intersectObjects([cardMesh, clipMesh]);

      if (intersects.length > 0) {
        isDragging = true;
        setIsInteracting(true);
        cardVel.set(0, 0, 0);
        cardRotVel.set(0, 0, 0);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      getPointerPos(e);

      if (isDragging) {
        raycaster.setFromCamera(mouse2D, camera);
        if (raycaster.ray.intersectPlane(plane, intersection)) {
          // Clamp dragging bounds
          const targetX = THREE.MathUtils.clamp(intersection.x, -2.8, 2.8);
          const targetY = THREE.MathUtils.clamp(intersection.y, -2.5, 1.2);

          // Card follows pointer with slight inertia
          cardPos.x += (targetX - cardPos.x) * 0.45;
          cardPos.y += (targetY - cardPos.y) * 0.45;

          // Realistic rotational tilt while dragging
          cardRot.z = -(cardPos.x - restingPos.x) * 0.35;
          cardRot.y = (cardPos.x - restingPos.x) * 0.4;
          cardRot.x = -(cardPos.y - restingPos.y) * 0.3;
        }
      }
    };

    const handlePointerUp = () => {
      if (isDragging) {
        isDragging = false;
        setIsInteracting(false);
        // Impart release swing impulse
        cardVel.x += (Math.random() - 0.5) * 0.05;
        cardRotVel.y += (Math.random() - 0.5) * 0.15;
      }
    };

    container.addEventListener('mousedown', handlePointerDown);
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('mouseup', handlePointerUp);

    container.addEventListener('touchstart', handlePointerDown, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
    window.addEventListener('touchend', handlePointerUp);

    // 9. Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 450;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 10. Main Animation & Verlet Swing Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      if (!isDragging) {
        // Natural subtle atmospheric breeze when resting
        const breezeX = Math.sin(time * 1.8) * 0.08;
        const breezeZ = Math.cos(time * 1.4) * 0.04;

        // Spring acceleration towards resting position
        const forceX = (restingPos.x + breezeX - cardPos.x) * 38.0;
        const forceY = (restingPos.y - cardPos.y) * 42.0;
        const forceZ = (restingPos.z + breezeZ - cardPos.z) * 32.0;

        cardVel.x += forceX * dt;
        cardVel.y += forceY * dt;
        cardVel.z += forceZ * dt;

        // Damping resistance
        cardVel.multiplyScalar(0.935);

        cardPos.addScaledVector(cardVel, dt);

        // Rotational spring restoring force
        const rotForceZ = (-cardPos.x * 0.45 - cardRot.z) * 35.0;
        const rotForceY = (-cardRot.y) * 12.0;
        const rotForceX = (-cardPos.y * 0.2 - cardRot.x) * 25.0;

        cardRotVel.z += rotForceZ * dt;
        cardRotVel.y += rotForceY * dt;
        cardRotVel.x += rotForceX * dt;

        cardRotVel.multiplyScalar(0.92);

        cardRot.z += cardRotVel.z * dt;
        cardRot.y += cardRotVel.y * dt;
        cardRot.x += cardRotVel.x * dt;
      }

      // Update Card Position & Rotation
      cardGroup.position.copy(cardPos);
      cardGroup.rotation.set(cardRot.x, cardRot.y, cardRot.z);

      // Re-stitch dynamic lanyard ribbon geometry to top of card clip
      const cardClipWorldPos = new THREE.Vector3(0, cardHeight / 2 + 0.35, 0).applyMatrix4(
        cardGroup.matrixWorld
      );

      lanyardGeometry.dispose();
      lanyardGeometry = updateLanyardCurve(cardClipWorldPos);
      lanyardMesh.geometry = lanyardGeometry;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', handlePointerDown);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      container.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      cardGeometry.dispose();
      clipGeometry.dispose();
      ringGeometry.dispose();
      lanyardGeometry.dispose();
      cardTexture.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
      sideMaterial.dispose();
      clipMaterial.dispose();
      lanyardMaterial.dispose();
      renderer.dispose();
    };
  }, [photoUrl, fullName, roleTitle, organization, subdivision]);

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className={`w-full ${canvasHeight} cursor-grab active:cursor-grabbing touch-none flex items-center justify-center`}
      />
    </div>
  );
}

