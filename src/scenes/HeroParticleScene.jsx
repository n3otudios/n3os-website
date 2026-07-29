import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useRadialTexture, useDisposableGeometry } from "./textures.js";

const SHAPES = [
  { pos: [-4.2, 1.4, -1], geo: "octahedron", size: 0.42, color: "#3b82f6", opacity: 0.35, speed: 1.1 },
  { pos: [-2.6, 2.3, -2], geo: "icosahedron", size: 0.3, color: "#60a5fa", opacity: 0.3, speed: 1.6 },
  { pos: [0.5, 2.6, -1.5], geo: "octahedron", size: 0.36, color: "#93c5fd", opacity: 0.3, speed: 0.9 },
  { pos: [3.2, 1.8, -1], geo: "octahedron", size: 0.5, color: "#2563eb", opacity: 0.4, speed: 1.3 },
  { pos: [4.4, 0.2, -2], geo: "icosahedron", size: 0.34, color: "#3b82f6", opacity: 0.32, speed: 1.5 },
  { pos: [-4.6, -1.2, -1.5], geo: "octahedron", size: 0.32, color: "#60a5fa", opacity: 0.28, speed: 1.2 },
  { pos: [4.8, -1.6, -1], geo: "octahedron", size: 0.4, color: "#2563eb", opacity: 0.32, speed: 1.0 },
];

const GLOW_STOPS = [
  [0, "rgba(59,130,246,0.45)"],
  [0.5, "rgba(59,130,246,0.16)"],
  [1, "rgba(59,130,246,0)"],
];

const SPARK_SEEDS = [1, 2, 3, 4, 5];

function FloatingShape({ pos, geo, size, color, opacity, speed }) {
  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={1.4} position={pos}>
      <mesh>
        {geo === "icosahedron" ? <icosahedronGeometry args={[size, 0]} /> : <octahedronGeometry args={[size, 0]} />}
        <meshBasicMaterial color={color} wireframe transparent opacity={opacity} />
      </mesh>
    </Float>
  );
}

/** A small blue spark that sits invisible most of the time, then randomly
 * re-positions itself somewhere in the hero's background space and
 * flashes briefly. Same pattern used in VisionOrbScene. */
function RandomSpark({ seed }) {
  const ref = useRef(null);
  const cycle = 3 + (seed % 5) * 0.8;
  const lastCycle = useRef(-1);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + seed * 11.3;
    const cycleIndex = Math.floor(t / cycle);
    const localT = (t % cycle) / cycle;
    if (cycleIndex !== lastCycle.current) {
      lastCycle.current = cycleIndex;
      ref.current.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5.5, -1 - Math.random() * 1.5);
    }
    const flashWindow = 0.22;
    ref.current.material.opacity = localT < flashWindow ? Math.sin((localT / flashWindow) * Math.PI) : 0;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

/** Scattered wireframe polyhedra drifting behind the hero copy, connected
 * by a sparse constellation of lines (each node linked to its nearest
 * neighbour), a soft glow blob, and a few random blue sparks — matching
 * the network/constellation look of the original background. Kept low
 * -opacity so it never competes with the headline. */
export default function HeroParticleScene() {
  const shapes = useMemo(() => SHAPES, []);
  const glowTexture = useRadialTexture(GLOW_STOPS, 256);

  const lineGeometry = useDisposableGeometry(() => {
    const points = SHAPES.map((s) => s.pos);
    const seen = new Set();
    const positions = [];

    points.forEach((p, i) => {
      let best = -1;
      let bestDist = Infinity;
      points.forEach((q, j) => {
        if (i === j) return;
        const d = (p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2 + (p[2] - q[2]) ** 2;
        if (d < bestDist) {
          bestDist = d;
          best = j;
        }
      });
      const key = [Math.min(i, best), Math.max(i, best)].join("-");
      if (!seen.has(key)) {
        seen.add(key);
        positions.push(p[0], p[1], p[2], points[best][0], points[best][1], points[best][2]);
      }
    });

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  return (
    <group>
      <sprite scale={[4.5, 4.5, 1]} position={[-4, 0.3, -2.5]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} opacity={0.9} />
      </sprite>
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial color="#64748b" transparent opacity={0.22} />
      </lineSegments>
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
      {SPARK_SEEDS.map((seed) => (
        <RandomSpark key={seed} seed={seed} />
      ))}
    </group>
  );
}
