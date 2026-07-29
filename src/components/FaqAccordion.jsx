import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "../data/content.js";

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="faq-list">
      {FAQ_ITEMS.map((item, i) => {
        const isOpen = openIndex === i;
        const panelId = `faq-panel-${i}`;
        const triggerId = `faq-trigger-${i}`;

        return (
          <div className={`faq-item${isOpen ? " is-open" : ""}`} key={item.q}>
            <h3 className="faq-item__heading">
              <button
                id={triggerId}
                className="faq-item__trigger"
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <span>{item.q}</span>
                <ChevronDown size={16} aria-hidden="true" />
              </button>
            </h3>

            {/* Always rendered (not conditionally mounted) so the answer is
                present in the static/prerendered HTML for crawlers and no-JS
                visitors — only the visual collapse is animated.
                `inert` when closed keeps that decision from costing anything
                in accessibility: without it, a collapsed answer is invisible
                but still reachable by Tab and still read out by screen
                readers, which is worse than either state on its own. */}
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="faq-item__panel"
              style={{ overflow: "hidden" }}
              initial={false}
              animate={
                shouldReduceMotion
                  ? { height: isOpen ? "auto" : 0 }
                  : { height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }
              }
              transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0, 0, 0.2, 1] }}
              {...(isOpen ? {} : { inert: "" })}
            >
              <p>{item.a}</p>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
