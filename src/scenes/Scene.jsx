import { Suspense, lazy, useEffect, useState } from "react";
import useNearViewport from "../hooks/useNearViewport.js";
import SceneBoundary from "./SceneBoundary.jsx";

/**
 * The single entry point for every 3D visual on the site.
 *
 * Everything Three.js-shaped lives behind this dynamic import, so the entire
 * WebGL payload (three + fiber + drei + all the scenes) is a separate async
 * chunk that is never fetched on pages — or screen sizes — that don't reach a
 * scene. Nothing above this line pulls Three.js into the initial bundle.
 */
const SceneStage = lazy(() => import("./SceneStage.jsx"));

/** How long a scene stays mounted after scrolling away, before its WebGL
 *  context is released. Long enough that scrolling back is seamless, short
 *  enough that a long page never holds ten live contexts at once. */
const IDLE_UNMOUNT_MS = 10000;

export default function Scene({ name, camera, sceneProps, className = "", style }) {
  const [ref, near] = useNearViewport("300px 0px");
  const [mounted, setMounted] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  // Mount on approach; release the context once it's been away a while.
  useEffect(() => {
    if (near) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    const timer = window.setTimeout(() => setMounted(false), IDLE_UNMOUNT_MS);
    return () => window.clearTimeout(timer);
  }, [near, mounted]);

  // A background tab shouldn't be spinning a render loop.
  useEffect(() => {
    const onVisibilityChange = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const running = near && pageVisible;

  const classes = ["scene", className].filter(Boolean).join(" ");

  return (
    <div ref={ref} className={classes} style={style} aria-hidden="true">
      {mounted ? (
        <SceneBoundary>
          <Suspense fallback={null}>
            <SceneStage name={name} camera={camera} sceneProps={sceneProps} running={running} />
          </Suspense>
        </SceneBoundary>
      ) : null}
    </div>
  );
}
