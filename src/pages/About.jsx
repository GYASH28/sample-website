import { CheckCircle2 } from "lucide-react";
import IconBadge from "../components/IconBadge.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { aboutCopy, aboutPoints, businessInfo, whyChooseUs } from "../data/siteData.js";

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Fakhri Mart"
        title="A colourful yarn and craft material store for creators"
        text="Fakhri Mart supports makers, boutiques, resellers and craft businesses with yarns, crochet threads, macrame cords, embroidery threads, beads, bases, handles and handmade essentials."
      >
        <ProductVisual palette={["#35b8ad", "#f6a7b8", "#f3c65f"]} />
      </PageHero>

      <section className="section">
        <div className="container split-grid">
          <Reveal variant="slide-left">
            <p className="eyebrow">{businessInfo.tagline}</p>
            <h2>Built for craft buyers who need range, clarity and quick support.</h2>
          </Reveal>
          <Reveal delay={100} variant="slide-right">
            <p className="large-copy">{aboutCopy}</p>
            <div className="about-point-grid">
              {aboutPoints.map((point) => (
                <span key={point}>
                  <CheckCircle2 size={17} />
                  {point}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Why Buyers Choose Us</p>
            <h2>Premium catalogue support for regular and bulk craft needs.</h2>
          </Reveal>
          <div className="card-grid why-card-grid">
            {whyChooseUs.map((item, index) => (
              <Reveal key={item.title} className="highlight-card" delay={(index % 3) * 70} variant="fade-up">
                <IconBadge name={item.icon} tone={index % 2 === 0 ? "teal" : "pink"} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
