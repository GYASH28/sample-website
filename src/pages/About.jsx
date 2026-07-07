import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import IconBadge from "../components/IconBadge.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import StaggerReveal, { staggerChild } from "../components/StaggerReveal.jsx";
import { aboutCopy, aboutPoints, businessInfo, whyChooseUs } from "../data/siteData.js";
import { ease, duration } from "../motion-tokens.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

export default function About() {
  useDocumentMeta({
    title: "About Us — Fakhri Mart",
    description: "Pune-based yarn and craft supply store shipping across India. Learn about our story and range.",
    canonical: "/about",
  });
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
            <StaggerReveal className="about-point-grid">
              {aboutPoints.map((point) => (
                <motion.span key={point} variants={staggerChild}>
                  <CheckCircle2 size={17} aria-hidden="true" />
                  {point}
                </motion.span>
              ))}
            </StaggerReveal>
          </Reveal>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Why Buyers Choose Us</p>
            <h2>Premium catalogue support for regular and bulk craft needs.</h2>
          </Reveal>
          <StaggerReveal className="card-grid why-card-grid">
            {whyChooseUs.map((item) => (
              <motion.div key={item.title} className="highlight-card" variants={staggerChild}>
                <IconBadge name={item.icon} tone={item === whyChooseUs[0] ? "teal" : "pink"} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </section>
    </>
  );
}
