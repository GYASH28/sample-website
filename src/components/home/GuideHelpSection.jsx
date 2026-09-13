import { ArrowRight, Calculator, Compass, Palette } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const helpPaths = [
  {
    icon: Compass,
    eyebrow: "Not sure what to buy?",
    title: "Match material to your project",
    text: "Start with what you are making and get a catalogue shortlist without pretending live stock is known.",
    to: "/yarn-guide",
  },
  {
    icon: Calculator,
    eyebrow: "Already have a pattern?",
    title: "Calculate how many packs you need",
    text: "Turn a known gram, metre or yard requirement into whole balls, cones or packs with a safety buffer.",
    to: "/blog#quantity-planner",
  },
  {
    icon: Palette,
    eyebrow: "Choosing colour?",
    title: "Check a shade before ordering",
    text: "Use digital preview for direction, then learn exactly what to confirm from the current shade card or stock photo.",
    to: "/blog#shade-checklist",
  },
];

export default function GuideHelpSection() {
  return (
    <section className="section home-guide-help" aria-labelledby="home-guide-help-title">
      <div className="container">
        <div className="section-heading guides-section-heading">
          <div>
            <p className="eyebrow">Useful before you buy</p>
            <h2 id="home-guide-help-title">Need help choosing? Use a tool, not guesswork.</h2>
            <p>Practical material, quantity and shade guidance now lives inside the store instead of being buried in generic articles.</p>
          </div>
          <Link className="btn btn-outline" to="/blog">Open all guides <ArrowRight size={17} /></Link>
        </div>

        <div className="guides-start-grid">
          {helpPaths.map(({ icon: Icon, eyebrow, title, text, to }) => (
            <article className="guides-start-card" key={title}>
              <Link to={to}>
                <span className="guides-start-card__icon"><Icon size={24} weight="duotone" /></span>
                <span className="guides-start-card__copy">
                  <small>{eyebrow}</small>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </span>
                <ArrowRight size={18} />
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
