import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal-on-scroll wrapper — rebuilt after a real bug: the previous version
 * baked Framer Motion's `initial={{opacity:0}}` directly into the
 * prerendered/SSR HTML. If hydration was ever slow, blocked, or failed,
 * content stayed invisible permanently (this is exactly what happened on
 * the Netlify test — the whole page looked blank).
 *
 * Fix: render a plain, fully-visible element by default (this is what SSR
 * and the very first client paint both use — never hidden). Only after
 * mount do we check whether the element is already on-screen:
 *  - already in view (e.g. hero content) -> stays visible, no animation,
 *    no motion wrapper at all. Nothing to break.
 *  - below the fold -> swap to a motion.div with whileInView, so it fades
 *    in once actually scrolled to. This swap happens off-screen, so it's
 *    never visible to the user.
 * Net effect: content can never be stuck invisible, with or without JS.
 */
export default function Reveal({ children, delay = 0, className = "", as = "div", ...rest }) {
  const ref = useRef(null);
  const [mode, setMode] = useState("static"); // "static" | "animate"
  const shouldReduceMotion = useReducedMotion();
  const Tag = as;

  useEffect(() => {
    if (shouldReduceMotion) return; // stays "static" — fully visible, no motion
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const alreadyInView = rect.top < window.innerHeight && rect.bottom > 0;
    if (!alreadyInView) setMode("animate");
  }, [shouldReduceMotion]);

  if (mode === "static") {
    return (
      <Tag ref={ref} className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay, ease: [0, 0, 0.2, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
