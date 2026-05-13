import Reveal from "./Reveal.jsx";

export default function PageHero({ eyebrow, title, text, children }) {
  return (
    <section className="page-hero">
      <div className="container page-hero-grid">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="page-hero-text">{text}</p>
        </Reveal>
        {children ? <Reveal className="page-hero-side" delay={120}>{children}</Reveal> : null}
      </div>
    </section>
  );
}
