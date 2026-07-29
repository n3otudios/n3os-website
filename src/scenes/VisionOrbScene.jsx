import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useRadialTexture } from "./textures.js";

const GLOW_STOPS = [
  [0, "rgba(37,99,235,0.5)"],
  [0.4, "rgba(37,99,235,0.22)"],
  [0.75, "rgba(37,99,235,0.06)"],
  [1, "rgba(37,99,235,0)"],
];

const PARTICLES = [
  { radius: 1.7, speed: 0.3, offset: 0, size: 0.07, color: "#60a5fa" },
  { radius: 1.95, speed: -0.22, offset: 1.8, size: 0.055, color: "#2563eb" },
  { radius: 1.5, speed: 0.35, offset: 3.4, size: 0.05, color: "#93c5fd" },
  { radius: 2.1, speed: 0.18, offset: 5.1, size: 0.045, color: "#bfdbfe" },
];

const SPARK_SEEDS = [1, 2, 3, 4, 5, 6];

function Particle({ radius, speed, offset, size, color }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, Math.sin(t * 0.6) * radius * 0.5, Math.sin(t) * radius);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} toneMapped={false} />
    </mesh>
  );
}

/** A small blue spark that sits invisible most of the time, then randomly
 * re-positions itself somewhere in the surrounding space and flashes
 * briefly — the "sparks that spawn randomly" scattered behind the orb. */
function RandomSpark({ seed }) {
  const ref = useRef(null);
  const cycle = 2.6 + (seed % 5) * 0.7;
  const lastCycle = useRef(-1);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime + seed * 13.7;
    const cycleIndex = Math.floor(t / cycle);
    const localT = (t % cycle) / cycle;
    if (cycleIndex !== lastCycle.current) {
      lastCycle.current = cycleIndex;
      ref.current.position.set((Math.random() - 0.5) * 6.5, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2 - 0.6);
    }
    const flashWindow = 0.22;
    ref.current.material.opacity = localT < flashWindow ? Math.sin((localT / flashWindow) * Math.PI) : 0;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshBasicMaterial color="#60a5fa" transparent opacity={0} toneMapped={false} />
    </mesh>
  );
}

/** The "Every tool, one connected index" centerpiece — a dark, matte blue
 * core wrapped in a slowly rotating grey wireframe shell, sitting in a
 * soft glow with a few orbiting particles connected by faint lines (a
 * small constellation), plus random blue sparks flashing in the space
 * around it. No flat specular-highlight mesh is layered on the core —
 * that used to render as a hard white disc ("hole") on its surface. */
export default function VisionOrbScene() {
  const wireRef = useRef(null);
  const coreRef = useRef(null);
  const lineGeoRef = useRef(null);

  const glowTexture = useRadialTexture(GLOW_STOPS, 256);
  const linePositions = useMemo(() => new Float32Array(PARTICLES.length * 2 * 3), []);

  useFrame((state, delta) => {
    if (wireRef.current) {
      wireRef.current.rotation.y += 0.09 * delta;
      wireRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.2;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y += 0.05 * delta;
    }

    const t = state.clock.elapsedTime;
    const points = PARTICLES.map((p) => {
      const pt = t * p.speed + p.offset;
      return [Math.cos(pt) * p.radius, Math.sin(pt * 0.6) * p.radius * 0.5, Math.sin(pt) * p.radius];
    });

    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];
      const idx = i * 6;
      linePositions[idx] = a[0];
      linePositions[idx + 1] = a[1];
      linePositions[idx + 2] = a[2];
      linePositions[idx + 3] = b[0];
      linePositions[idx + 4] = b[1];
      linePositions[idx + 5] = b[2];
    }

    if (lineGeoRef.current) {
      lineGeoRef.current.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <sprite scale={[5.2, 5.2, 1]} position={[0, 0, -0.3]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} opacity={1} />
      </sprite>

      <mesh ref={wireRef} scale={1.35}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color="#6b7280" wireframe transparent opacity={0.45} />
      </mesh>

      <mesh ref={coreRef}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshStandardMaterial color="#152a63" emissive="#152a63" emissiveIntensity={0.18} roughness={0.4} metalness={0.3} />
      </mesh>

      <lineSegments>
        <bufferGeometry ref={lineGeoRef}>
          <bufferAttribute attach="attributes-position" count={PARTICLES.length * 2} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#64748b" transparent opacity={0.28} />
      </lineSegments>

      {PARTICLES.map((p, i) => (
        <Particle key={i} {...p} />
      ))}
      {SPARK_SEEDS.map((seed) => (
        <RandomSpark key={seed} seed={seed} />
      ))}
    </group>
  );
}
