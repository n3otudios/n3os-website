import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";

/** Interlocking torus-knot pair — a wireframe outer knot with a smaller
 * solid glossy knot nested inside, evoking "connection". Used flanking the
 * notify-me form. `mirror` flips rotation direction for visual variety
 * between the left/right copies. */
export default function NotifyLinkScene({ mirror = false }) {
  const groupRef = useRef(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += (mirror ? -1 : 1) * 0.12 * delta;
    groupRef.current.rotation.x += 0.04 * delta;
  });

  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={1}>
      <group ref={groupRef} scale={0.62}>
        <mesh>
          <torusKnotGeometry args={[0.85, 0.22, 100, 16]} />
          <meshBasicMaterial color="#93c5fd" wireframe transparent opacity={0.5} />
        </mesh>
        <mesh scale={0.55}>
          <torusKnotGeometry args={[0.85, 0.3, 100, 16]} />
          <meshStandardMaterial color="#2563eb" roughness={0.2} metalness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}
