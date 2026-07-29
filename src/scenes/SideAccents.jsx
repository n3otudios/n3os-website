import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { useDisposableGeometry } from "./textures.js";

const CORNERS = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
];

/** A small rotating wireframe tesseract (hypercube projection): an outer
 * cube and a smaller inner cube with straight lines connecting each pair
 * of corresponding corners, the whole assembly turning slowly. Used as a
 * decorative side accent (e.g. flanking the "Completely free" heading). */
export function TesseractAccent({ compact = false, seed = 0, color = "#3572e0" }) {
  const scale = compact ? 0.62 : 1;
  const groupRef = useRef(null);

  const edgesGeometry = useDisposableGeometry(() => {
    const outerR = 0.9;
    const innerR = 0.45;
    const positions = [];
    CORNERS.forEach(([x, y, z]) => {
      positions.push(x * outerR, y * outerR, z * outerR, x * innerR, y * innerR, z * innerR);
    });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.2 + seed;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18 + seed) * 0.35;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.2} floatIntensity={1.1}>
      <group ref={groupRef} scale={scale}>
        <lineSegments geometry={edgesGeometry}>
          <lineBasicMaterial color={color} transparent opacity={0.45} />
        </lineSegments>
        <mesh>
          <boxGeometry args={[1.8, 1.8, 1.8]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.9, 0.9, 0.9]} />
          <meshBasicMaterial color={color} wireframe transparent opacity={0.32} />
        </mesh>
      </group>
    </Float>
  );
}
