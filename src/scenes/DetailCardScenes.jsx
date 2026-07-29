import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line, RoundedBox } from "@react-three/drei";
import { useGlyphTexture } from "./textures.js";

/** Wireframe sphere containing a flat glyph tile — left-hand accent next
 * to the "Every tool, fully indexed" detail card.
 *
 * The glyph is drawn to a canvas texture rather than rendered with drei's
 * <Text>: that component pulls in troika-three-text and, without an explicit
 * `font`, fetches a typeface from Google's CDN at runtime. See textures.js. */
export function GlyphSphere() {
  const wireRef = useRef(null);
  const glyphTexture = useGlyphTexture("a", "#1d3fae", 128);

  useFrame((state, delta) => {
    if (!wireRef.current) return;
    wireRef.current.rotation.y += 0.1 * delta;
  });

  return (
    <Float speed={1.1} rotationIntensity={0.3} floatIntensity={1.2}>
      <group>
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#93c5fd" wireframe transparent opacity={0.4} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial map={glyphTexture} transparent depthWrite={false} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

/** Wireframe sphere containing a solid blue tile with a checkmark — right-
 * hand accent, reads as "verified / included". */
export function CheckSphere() {
  const wireRef = useRef(null);

  useFrame((state, delta) => {
    if (!wireRef.current) return;
    wireRef.current.rotation.y -= 0.09 * delta;
  });

  const checkPoints = [
    [-0.18, -0.02, 0.3],
    [-0.05, -0.16, 0.3],
    [0.22, 0.14, 0.3],
  ];

  return (
    <Float speed={1.3} rotationIntensity={0.3} floatIntensity={1.2}>
      <group>
        <mesh ref={wireRef}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#93c5fd" wireframe transparent opacity={0.4} />
        </mesh>
        <RoundedBox args={[0.72, 0.72, 0.2]} radius={0.1} smoothness={4}>
          <meshStandardMaterial color="#2563eb" roughness={0.25} metalness={0.2} />
        </RoundedBox>
        <Line points={checkPoints} color="#ffffff" lineWidth={4} />
      </group>
    </Float>
  );
}
