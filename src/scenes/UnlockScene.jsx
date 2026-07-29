import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";

/** Soft frosted-glass blob with a dark blue accent shape inside — matches
 * the blurred, translucent look from the reference screenshots rather
 * than a literal padlock render. */
export default function UnlockScene() {
  const blobRef = useRef(null);
  const accentRef = useRef(null);

  useFrame((state, delta) => {
    if (blobRef.current) blobRef.current.rotation.y += 0.06 * delta;
    if (accentRef.current) accentRef.current.rotation.y -= 0.1 * delta;
  });

  return (
    <Float speed={1.3} rotationIntensity={0.3} floatIntensity={1.3}>
      <group rotation={[0.2, 0.4, 0.1]}>
        <mesh ref={blobRef} scale={[0.85, 1.15, 0.85]}>
          <icosahedronGeometry args={[0.75, 3]} />
          <MeshDistortMaterial
            color="#dbeafe"
            distort={0.35}
            speed={1.4}
            roughness={0.1}
            metalness={0.1}
            transparent
            opacity={0.55}
          />
        </mesh>
        <mesh ref={accentRef} scale={0.4} position={[0.05, 0, 0.15]}>
          <torusKnotGeometry args={[0.5, 0.16, 64, 12, 1, 2]} />
          <meshStandardMaterial color="#1d3fae" roughness={0.3} metalness={0.4} />
        </mesh>
      </group>
    </Float>
  );
}
