import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRadialTexture } from "./textures.js";

const GLOW_STOPS = [
  [0, "rgba(245,158,11,0.6)"],
  [0.5, "rgba(245,158,11,0.2)"],
  [1, "rgba(245,158,11,0)"],
];

const ORBIT_DOTS = [
  { radius: 1.1, speed: 0.4, offset: 0, size: 0.05 },
  { radius: 1.3, speed: 0.28, offset: 2.6, size: 0.04 },
];

function OrbitDot({ radius, speed, offset, size }) {
  const ref = useRef(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(t) * radius, 0.35 + 0.35 * radius * Math.sin(0.7 * t), Math.sin(t) * radius);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size, 14, 14]} />
      <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.7} roughness={0.3} />
    </mesh>
  );
}

/** The glowing amber orb used beside the FAQ — matches the original's
 * radial-glow sprite + wireframe icosahedron + distorted core. */
export default function FreeOrbScene() {
  const coreRef = useRef(null);
  const spriteRef = useRef(null);
  const wireRef = useRef(null);

  const glowTexture = useRadialTexture(GLOW_STOPS, 128);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const pulse = 0.75 + 0.2 * Math.sin(1.1 * t);
    if (coreRef.current) coreRef.current.material.emissiveIntensity = pulse;
    if (spriteRef.current) {
      const s = 1 + 0.15 * Math.sin(1.1 * t);
      spriteRef.current.scale.set(2.2 * s, 2.2 * s, 1);
    }
    if (wireRef.current) {
      wireRef.current.rotation.y -= 0.12 * delta;
      wireRef.current.rotation.x += 0.05 * delta;
    }
  });

  return (
    <group position={[0, 0.15, 0]} scale={1.2}>
      <sprite ref={spriteRef} scale={[2.2, 2.2, 1]} position={[0, 0, -0.1]}>
        <spriteMaterial map={glowTexture} transparent depthWrite={false} opacity={0.95} />
      </sprite>
      <mesh ref={wireRef} scale={1.55} position={[0, 0.35, 0]}>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshBasicMaterial color="#f59e0b" wireframe transparent opacity={0.4} />
      </mesh>
      <mesh ref={coreRef} position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <MeshDistortMaterial
          color="#fde68a"
          emissive="#f59e0b"
          emissiveIntensity={0.6}
          distort={0.2}
          speed={1.5}
          roughness={0.15}
          metalness={0.05}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.32, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.16, 0.2, 0.1, 16]} />
        <meshStandardMaterial color="#64748b" roughness={0.6} metalness={0.4} />
      </mesh>
      {ORBIT_DOTS.map((dot, i) => (
        <OrbitDot key={i} {...dot} />
      ))}
    </group>
  );
}
