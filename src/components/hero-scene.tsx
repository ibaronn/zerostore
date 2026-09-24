"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import type { Group } from "three";

// مجموعة أشكال تتمايل وتتفاعل مع حركة الماوس والتمرير.
function Shapes() {
  const group = useRef<Group>(null);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    // ميلان ناعم يتبع مؤشر الماوس
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.45, 1.6, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.28, 1.6, delta);

    // ترتفع الأشكال وتتلاشى مع نزول الصفحة
    const scroll = Math.min(1, window.scrollY / Math.max(1, window.innerHeight));
    g.position.y = THREE.MathUtils.damp(g.position.y, -scroll * 130, 4, delta);
    const fade = Math.max(0.05, 1 - scroll * 1.1);
    g.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.material && !Array.isArray(mesh.material)) {
        const mat = mesh.material as THREE.Material & { opacity: number; transparent: boolean };
        if (mat.transparent) mat.opacity = fade;
      }
    });
  });

  return (
    <group ref={group}>
      <Float speed={1.7} rotationIntensity={0.7} floatIntensity={1.4}>
        <mesh position={[-2.6, 0.9, 0.2]}>
          <icosahedronGeometry args={[1.55, 1]} />
          <MeshDistortMaterial
            color="#0e776e"
            distort={0.38}
            speed={1.7}
            metalness={0.45}
            roughness={0.22}
            emissive="#052f2b"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={1} floatIntensity={1.8}>
        <mesh position={[2.9, -1.3, -0.4]}>
          <torusKnotGeometry args={[0.62, 0.2, 90, 14]} />
          <meshPhysicalMaterial
            color="#f2b544"
            metalness={0.55}
            roughness={0.28}
            emissive="#7a4a05"
            emissiveIntensity={0.25}
          />
        </mesh>
      </Float>

      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1}>
        <mesh position={[-3.3, -1.6, -0.8]}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshPhysicalMaterial
            color="#7ad0bf"
            metalness={0.85}
            roughness={0.12}
            emissive="#0b4a42"
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>

      <Float speed={1.1} rotationIntensity={0.6} floatIntensity={1.2}>
        <mesh position={[1.8, 1.8, -1.2]}>
          <octahedronGeometry args={[0.85, 0]} />
          <meshStandardMaterial
            color="#0e776e"
            wireframe
            transparent
            opacity={0.35}
            emissive="#0e776e"
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.5} />
      <pointLight position={[-4, -3, 2]} intensity={1.3} color="#2f9e8f" />
      <pointLight position={[4, -2, 3]} intensity={0.9} color="#f2b544" />
      <Shapes />
    </>
  );
}

export default function HeroScene() {
  const [canRun, setCanRun] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (!window.matchMedia("(min-width: 768px)").matches) return;
      setCanRun(true);
    } catch {
      return;
    }
  }, []);

  if (!canRun) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: "none" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}