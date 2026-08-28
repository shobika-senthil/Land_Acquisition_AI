import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface GeographicTerrainSceneProps {
  className?: string;
}

export const GeographicTerrainScene: React.FC<GeographicTerrainSceneProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const container = containerRef.current;
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 200;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, -22, 18);
    camera.lookAt(0, 0, 0);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Terrain Grid Geometry with Contour Waves
    const geometry = new THREE.PlaneGeometry(24, 20, 32, 28);
    const position = geometry.attributes.position;

    // Displace vertices to form natural cadastral terrain elevation
    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = Math.sin(x * 0.45) * 1.2 + Math.cos(y * 0.5) * 1.1 + Math.sin((x + y) * 0.3) * 0.8;
      position.setZ(i, z);
    }
    geometry.computeVertexNormals();

    // 4. Warm Sandal Wireframe & Mesh
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x8c5a3c,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const terrainMesh = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(terrainMesh);

    // Add glowing risk beacon node
    const beaconGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const beaconMaterial = new THREE.MeshBasicMaterial({ color: 0xb65a3c });
    const beacon = new THREE.Mesh(beaconGeometry, beaconMaterial);
    beacon.position.set(2, 1, 2.8);
    scene.add(beacon);

    // Subtle beacon ring
    const ringGeometry = new THREE.RingGeometry(0.8, 1.1, 24);
    const ringMaterial = new THREE.MeshBasicMaterial({ color: 0xb65a3c, side: THREE.DoubleSide, transparent: true, opacity: 0.6 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(2, 1, 2.7);
    scene.add(ring);

    // 5. Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      terrainMesh.rotation.z = elapsedTime * 0.04;
      beacon.rotation.z = elapsedTime * 0.04;
      ring.rotation.z = elapsedTime * 0.04;
      ring.scale.setScalar(1 + Math.sin(elapsedTime * 2) * 0.2);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // 6. Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      geometry.dispose();
      wireframeMaterial.dispose();
      beaconGeometry.dispose();
      beaconMaterial.dispose();
      ringGeometry.dispose();
      ringMaterial.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full min-h-[220px] relative pointer-events-none ${className}`}
    />
  );
};
