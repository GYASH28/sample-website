import { CheckCircle2 } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";

const highlights = [
  {
    title: "Quality Threads",
    text: "Selected thread options focused on strength, finish, and consistent stitching performance.",
  },
  {
    title: "Wide Shade Range",
    text: "A broad color-led catalogue for matching garments, embroidery work, and decorative finishes.",
  },
  {
    title: "Bulk Supply Support",
    text: "Retail, boutique, and production buyers can enquire for cones, rolls, sets, and bundles.",
  },
];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Shree Threads"
        title="Trusted Thread Supplier for Retail & Wholesale Needs"
        text="A professional supplier profile for an Indian thread business serving tailors, boutiques, garment units, textile traders, and industrial stitching buyers."
      >
        <ProductVisual palette={["#2a9d8f", "#e9c46a", "#264653"]} />
      </PageHero>

      <section className="section">
        <div className="container split-grid">
          <Reveal variant="slide-left">
            <p className="eyebrow">Our Business</p>
            <h2>Built around reliable supply and practical product selection.</h2>
          </Reveal>
          <Reveal delay={100} variant="slide-right">
            <p className="large-copy">
              Shree Threads & Textile Supplies provides high-quality threads for tailoring, garment
              production, embroidery, boutiques, textile traders, and industrial stitching
              requirements. We focus on strength, smooth finish, color variety, and reliable supply.
            </p>
            <p>
              The website presents the business as a clean catalogue, helping customers browse
              categories, understand available thread types, and enquire quickly through WhatsApp,
              phone, or a simple contact form.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Highlights</p>
            <h2>What buyers can expect</h2>
          </Reveal>
          <div className="card-grid highlight-grid">
            {highlights.map((item, index) => (
              <Reveal key={item.title} className="highlight-card" delay={index * 80} variant="fade-up">
                <CheckCircle2 size={26} />
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
