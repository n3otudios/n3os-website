import { useEffect, useMemo } from "react";
import * as THREE from "three";

/**
 * The same radial-glow sprite was being hand-rolled in three separate scene
 * files, and none of them released the texture. Now that scenes unmount when
 * you scroll away (see Scene.jsx), leaking a texture per mount would be a real
 * cost rather than a theoretical one — so these hooks own disposal too.
 *
 * Pass `stops` as a module-level constant, not an inline array: the identity
 * of the array is the memo key.
 */
function makeRadialTexture(stops, size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  const centre = size / 2;
  const gradient = ctx.createRadialGradient(centre, centre, 0, centre, centre, centre);
  stops.forEach(([offset, colour]) => gradient.addColorStop(offset, colour));

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

export function useRadialTexture(stops, size = 256) {
  const texture = useMemo(() => makeRadialTexture(stops, size), [stops, size]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/**
 * Draws a single character to a transparent texture.
 *
 * This replaces drei's <Text>, which renders through troika-three-text and —
 * with no `font` prop — silently downloads a default typeface from Google's
 * CDN at runtime. That's a third-party request on an otherwise fully
 * self-hosted site, and it fails outright offline or under a strict CSP. A
 * 2D-canvas glyph needs no font loader, no network, and no extra dependency.
 */
function makeGlyphTexture(character, colour, size) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = colour;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `700 ${Math.round(size * 0.72)}px "JetBrains Mono Variable", ui-monospace, "SF Mono", monospace`;
  ctx.fillText(character, size / 2, size / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 4;
  return texture;
}

export function useGlyphTexture(character, colour, size = 128) {
  const texture = useMemo(() => makeGlyphTexture(character, colour, size), [character, colour, size]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

/** Frees a BufferGeometry that was built by hand rather than by a JSX
 *  `<xGeometry>` element (which react-three-fiber disposes for us). */
export function useDisposableGeometry(factory, deps) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const geometry = useMemo(factory, deps);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return geometry;
}
