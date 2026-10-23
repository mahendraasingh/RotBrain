/**
 * RotBrain 3D Web Experience Scene (Three.js WebGL)
 *
 * Implements the 3d-web-experience skill:
 * - Real Three.js WebGL canvas with interactive 3D neural core
 * - Dynamic scroll-driven rotation (responds to window / ScrollView scroll)
 * - Interactive pointer drag with smooth inertial damping
 * - Orbiting particle cloud with Two26 flame (#FF5400) point lights
 * - Full WebGL detection with high-fidelity graceful fallback
 * - Memory leak prevention with explicit Three.js resource disposal
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import * as THREE from 'three';
import { BrainState } from '../../types/brain';
import { colors } from '../../theme/colors';

interface ThreeDBrainSceneProps {
  state: BrainState;
  size?: number;
  interactive?: boolean;
}

export const ThreeDBrainScene: React.FC<ThreeDBrainSceneProps> = ({
  state,
  size = 240,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);

  // Brain state colors based on Two26 palette
  const getBrainAccentColor = () => {
    switch (state) {
      case 'fresh':
        return '#FF5400'; // Two26 Flame
      case 'tired':
        return '#F59E0B'; // Amber
      case 'very_tired':
        return '#FF7A33'; // Flame Soft
      case 'exhausted':
        return '#DC2626'; // Crimson
      default:
        return '#FF5400';
    }
  };

  useEffect(() => {
    // Check if running on web and if WebGL is available
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      setWebGLSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    let canvas: HTMLCanvasElement;
    try {
      canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = size;
    const height = size;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    container.appendChild(renderer.domElement);

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const accentColor = new THREE.Color(getBrainAccentColor());

    const pointLight = new THREE.PointLight(accentColor, 4, 15);
    pointLight.position.set(2, 3, 3);
    scene.add(pointLight);

    const rimLight = new THREE.PointLight(0xffd3bf, 2, 10);
    rimLight.position.set(-3, -2, -2);
    scene.add(rimLight);

    // 3. Central Neural Core (Icosahedron with glowing wireframe & particles)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner organic sphere
    const sphereGeo = new THREE.SphereGeometry(1.05, 32, 32);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x1e1b19,
      roughness: 0.25,
      metalness: 0.8,
      emissive: accentColor,
      emissiveIntensity: 0.18,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    coreGroup.add(sphereMesh);

    // Neural wireframe cage
    const cageGeo = new THREE.IcosahedronGeometry(1.22, 2);
    const cageMat = new THREE.MeshStandardMaterial({
      color: accentColor,
      wireframe: true,
      wireframeLinewidth: 1.5,
      emissive: accentColor,
      emissiveIntensity: 0.45,
      transparent: true,
      opacity: 0.75,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // Neural Synapse Nodes (Points at vertices)
    const pointsGeo = new THREE.IcosahedronGeometry(1.22, 2);
    const pointsMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      transparent: true,
      opacity: 0.9,
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    coreGroup.add(pointsMesh);

    // 4. Orbiting Synapse Particle Cloud
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.45 + Math.random() * 0.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi);
      particlePositions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      particleSpeeds[i] = 0.2 + Math.random() * 0.8;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // Dynamic Pulsing Ring
    const ringGeo = new THREE.TorusGeometry(1.6, 0.015, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    coreGroup.add(ringMesh);

    // 5. Interactive Drag & Motion Physics
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.15;
    let targetRotationY = 0;
    let currentRotationX = 0.15;
    let currentRotationY = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      targetRotationY += deltaX * 0.008;
      targetRotationX += deltaY * 0.008;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Scroll-Driven 3D Interaction: rotates model based on page scroll offset
    const onScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
      targetRotationY += (scrollY * 0.0002);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    if (interactive) {
      container.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    }

    // 6. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth inertial interpolation
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      // Base idle oscillation + interactive rotation
      coreGroup.rotation.x = currentRotationX + Math.sin(elapsedTime * 1.2) * 0.05;
      coreGroup.rotation.y = currentRotationY + elapsedTime * 0.35;

      // Pulse breathing scale
      const pulseScale = 1 + Math.sin(elapsedTime * 2.4) * 0.035;
      sphereMesh.scale.set(pulseScale, pulseScale, pulseScale);
      cageMesh.scale.set(pulseScale * 1.02, pulseScale * 1.02, pulseScale * 1.02);

      // Ring counter-rotation
      ringMesh.rotation.z += 0.005;

      renderer.render(scene, camera);
    };

    animate();

    // 7. Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('scroll', onScroll);

      if (interactive) {
        container.removeEventListener('pointerdown', onPointerDown);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);
      }

      // Dispose Three.js objects
      sphereGeo.dispose();
      sphereMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [state, size, interactive]);

  if (!webGLSupported) {
    // WebGL Fallback: high-res brain asset with 3D shadow
    return (
      <View style={[styles.fallbackContainer, { width: size, height: size }]}>
        <Image
          source={require('../../../assets/images/freshBrain.png')}
          style={{ width: size * 0.85, height: size * 0.85 }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View style={[styles.canvasWrapper, { width: size, height: size }]}>
      {/* HTML container for Three.js WebGL canvas */}
      <div
        ref={containerRef}
        style={{
          width: size,
          height: size,
          cursor: interactive ? 'grab' : 'default',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          touchAction: 'none',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  canvasWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  fallbackContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
