import { useEffect, useRef, useState } from "react";

/**
 * Reports whether the returned ref is at (or near) the viewport.
 *
 * Unlike a one-shot "has it ever been seen" observer, this keeps observing
 * after the first intersection, so callers can *pause* work when the element
 * scrolls away again — not just defer it until first sight.
 *
 * Returns `[ref, near]`. `near` stays false until the element is within
 * `margin` of the viewport. Elements that are `display: none` (e.g. the
 * decorative scenes hidden on small screens) never intersect, so their work
 * never starts at all.
 */
export default function useNearViewport(margin = "300px 0px") {
  const ref = useRef(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Very old browsers: no observer, so just opt in rather than never render.
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        setNear(entry.isIntersecting);
      },
      { rootMargin: margin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [margin]);

  return [ref, near];
}
