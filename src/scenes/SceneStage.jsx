import { Canvas } from "@react-three/fiber";
import HeroParticleScene from "./HeroParticleScene.jsx";
import VisionOrbScene from "./VisionOrbScene.jsx";
import RoadmapCubesScene from "./RoadmapCubesScene.jsx";
import FreeOrbScene from "./FreeOrbScene.jsx";
import NotifyLinkScene from "./NotifyLinkScene.jsx";
import UnlockScene from "./UnlockScene.jsx";
import { TesseractAccent } from "./SideAccents.jsx";
import { GlyphSphere, CheckSphere } from "./DetailCardScenes.jsx";

/**
 * Loaded on demand by Scene.jsx. This module — and everything it imports —
 * is the site's WebGL chunk.
 *
 * One shared Canvas so every scene gets the same lighting, transparency and
 * pixel-ratio policy without repeating boilerplate at nine call sites.
 */
const SCENES = {
  hero: HeroParticleScene,
  vision: VisionOrbScene,
  roadmap: RoadmapCubesScene,
  detailGlyph: GlyphSphere,
  detailCheck: CheckSphere,
  faqOrb: FreeOrbScene,
  tesseract: TesseractAccent,
  notifyLink: NotifyLinkScene,
  unlock: UnlockScene,
};

const DEFAULT_CAMERA = { position: [0, 0, 5], fov: 40 };

/** Cap the pixel ratio: these are soft, low-contrast decorations, so rendering
 *  them at a 3x retina ratio costs a lot of fill rate for no visible gain. */
const DPR_RANGE = [1, 1.75];

const GL_OPTIONS = {
  alpha: true,
  antialias: true,
  // Decorative ambience is not worth waking a discrete GPU for.
  powerPreference: "low-power",
};

export default function SceneStage({ name, camera = DEFAULT_CAMERA, sceneProps, running = true }) {
  const Content = SCENES[name];
  if (!Content) return null;

  return (
    <Canvas
      camera={camera}
      dpr={DPR_RANGE}
      gl={GL_OPTIONS}
      // "never" fully parks the render loop while the scene is off-screen or
      // the tab is hidden, instead of animating pixels nobody is looking at.
      frameloop={running ? "always" : "never"}
      style={{ pointerEvents: "none" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 5]} intensity={0.8} />
      <pointLight position={[-4, -2, 2]} intensity={0.4} color="#60a5fa" />
      <Content {...sceneProps} />
    </Canvas>
  );
}
