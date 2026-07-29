import { MARQUEE_ITEMS } from "../data/content.js";

export default function Marquee() {
  // Rendered 3x back-to-back so the CSS animation (which shifts by exactly
  // one set's width) loops seamlessly with no visible seam.
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((item, i) => (
          <span className="marquee__item" key={i}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
