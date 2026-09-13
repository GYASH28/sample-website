import { ArrowRight, ClockCounterClockwise, Swatches } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { featuredProducts } from "../../data/siteData.js";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed.js";
import ProductShowcaseCard from "../ProductShowcaseCard.jsx";
import Reveal from "../Reveal.jsx";

export function ShadeDiscovery() {
  const products = featuredProducts.slice(0, 4);

  return (
    <section className="commerce-section shade-discovery" aria-labelledby="shade-discovery-title">
      <div className="container">
        <Reveal className="commerce-heading" variant="fade-up">
          <div>
            <p className="eyebrow"><Swatches size={15} /> Shade-card support</p>
            <h2 id="shade-discovery-title">Choose the material first. Confirm the exact shade second.</h2>
            <p>The website no longer guesses live colours. Open a verified product line, shortlist it, then request the current supplier shade card or a live stock photo before finalising your order.</p>
          </div>
          <Link to="/products">Browse verified materials <ArrowRight size={17} /></Link>
        </Reveal>

        <div className="shade-discovery__grid">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={index * 45} variant="fade-up">
              <ProductShowcaseCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RecentlyViewedHome() {
  const recentSlugs = useRecentlyViewed(null);
  const products = recentSlugs
    .map((slug) => featuredProducts.find((product) => product.slug === slug))
    .filter(Boolean)
    .slice(0, 4);

  if (!products.length) return null;

  return (
    <section className="commerce-section recently-viewed-home" aria-labelledby="recent-home-title">
      <div className="container">
        <Reveal className="commerce-heading" variant="fade-up">
          <div>
            <p className="eyebrow"><ClockCounterClockwise size={15} /> Continue browsing</p>
            <h2 id="recent-home-title">Pick up where you left off.</h2>
            <p>Your recently viewed materials stay close so comparing product lines and alternatives takes fewer taps.</p>
          </div>
          <Link to="/products">Browse catalogue <ArrowRight size={17} /></Link>
        </Reveal>
        <div className="recently-viewed-home__grid">
          {products.map((product) => <ProductShowcaseCard key={product.slug} product={product} />)}
        </div>
      </div>
    </section>
  );
}
