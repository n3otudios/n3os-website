import Reveal from "./Reveal.jsx";

/**
 * The eyebrow / heading / lede trio that opens most sections. Previously each
 * section rebuilt it inline with hand-tuned `style={{ marginTop: "1rem" }}`
 * props, so the vertical rhythm drifted section by section and lived outside
 * the stylesheet. One component, one set of spacing rules.
 */
export default function SectionHead({ eyebrow, title, lede, align = "center", width = "narrow", delay = 0 }) {
  const classes = [
    "section-head",
    align === "center" ? "section-head--center" : "section-head--start",
    `section-head--${width}`,
  ].join(" ");

  return (
    <Reveal className={classes} delay={delay}>
      {eyebrow ? (
        <span className={align === "center" ? "eyebrow eyebrow--center" : "eyebrow"}>{eyebrow}</span>
      ) : null}
      <h2 className="h2">{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </Reveal>
  );
}
