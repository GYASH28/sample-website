import Reveal from "./Reveal.jsx";

export default function PageHero({
  eyebrow,
  title,
  text,
  children,
  className = "",
  motif = "editorial",
}) {
  const copyVariant = motif === "weave" ? "slide-left" : "fade-up";
  const mediaVariant = motif === "shutter" ? "clip-reveal-left" : "scale-in";

  return (
    <section className={`page-hero ${className}`} data-hero-motif={motif}>
      <div className="container page-hero-grid">
        <Reveal variant={copyVariant}>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-text">{text}</p>
        </Reveal>
        {children ? <Reveal className="page-hero-side" delay={120} variant={mediaVariant}>{children}</Reveal> : null}
      </div>
    </section>
  );
}
