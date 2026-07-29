import { Float, RoundedBox } from "@react-three/drei";

const CUBES = [
  { color: "#2563eb", position: [-0.1, 0.85, 0], rotation: [0.4, 0.5, 0.1], size: 0.62, floatSpeed: 1.4 },
  { color: "#f59e0b", position: [0.15, 0, 0.15], rotation: [0.3, -0.4, 0.2], size: 0.7, floatSpeed: 1.9 },
  { color: "#94a3b8", position: [-0.05, -0.9, -0.1], rotation: [0.5, 0.3, -0.15], size: 0.58, floatSpeed: 1.1 },
];

/** Three stacked cubes — blue, amber, grey — each bobbing independently,
 * one per roadmap phase (Discover / Use / Build). */
export default function RoadmapCubesScene() {
  return (
    <group>
      {CUBES.map((cube, i) => (
        <Float key={i} speed={cube.floatSpeed} rotationIntensity={0.5} floatIntensity={1.6}>
          <RoundedBox
            args={[cube.size, cube.size, cube.size]}
            radius={0.08}
            smoothness={4}
            position={cube.position}
            rotation={cube.rotation}
          >
            <meshStandardMaterial color={cube.color} roughness={0.3} metalness={0.15} />
          </RoundedBox>
        </Float>
      ))}
    </group>
  );
}
