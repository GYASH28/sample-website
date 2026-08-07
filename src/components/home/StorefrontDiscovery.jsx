import { ArrowRight, ClockCounterClockwise, Palette } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { featuredProducts } from "../../data/siteData.js";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed.js";
import ProductShowcaseCard from "../ProductShowcaseCard.jsx";
import Reveal from "../Reveal.jsx";

const shadeMoods = [
  { name: "Ocean", match: /blue|teal|sky|ocean|seafoam/i, swatches: ["#2a8c82", "#68b7c8", "#87ceeb"] },
  { name: "Rose", match: /pink|rose|blush|coral/i, swatches: ["#d889a1", "#ed7fa2", "#f28b82"] },
  { name: "Earth", match: /brown|gold|yellow|peach|cream|ivory|beige/i, swatches: ["#c78d52", "#f3c65f", "#f5f0e8"] },
  { name: "Garden", match: /green|mint|seafoam/i, swatches: ["#7ecdb5", "#94d4c9", "#4f8b62"] },
  { name: "Lavender", match: /lavender|violet|purple/i, swatches: ["#c4a8e0", "#9b7bc1", "#d8c7ea"] },
  { name: "Monochrome", match: /black|charcoal|grey|gray|white/i, swatches: ["#292929", "#757575", "#f5f0e8"] },
];

function productSearchText(product) {
  return (product.colors || []).map((shade) => shade.name).join(" ");
}

export function ShadeDiscovery() {
  const [activeMood, setActiveMood] = useState(shadeMoods[0]);
  const products = useMemo(() => {
    const matches = featuredProducts.filter((product) => activeMood.match.test(productSearchText(product)));
    return (matches.length ? matches : featuredProducts).slice(0, 4);
  }, [activeMood]);

  return (
    <section className="commerce-section shade-discovery" aria-labelledby="shade-discovery-title">
      <div className="container">
        <Reveal className="commerce-heading" variant="fade-up">
          <div>
            <p className="eyebrow"><Palette size={15} /> Shop by colour mood</p>
            <h2 id="shade-discovery-title">Start with the colour in your head.</h2>
            <p>Online yarn shopping is easier when colour comes first. Pick a mood to surface products that list similar shade families, then ask for current stock photos before ordering.</p>
          </div>
          <Link to="/products">Explore all shades <ArrowRight size={17} /></Link>
        </Reveal>

        <div className="shade-mood-tabs" role="tablist" aria-label="Colour moods">
          {shadeMoods.map((mood) => (
            <button
              key={mood.name}
              type="button"
              className={activeMood.name === mood.name ? "is-active" : ""}
              onClick={() => setActiveMood(mood)}
              role="tab"
              aria-selected={activeMood.name === mood.name}
            >
              <span className="shade-mood-tabs__dots" aria-hidden="true">
                {mood.swatches.map((shade) => <i key={shade} style={{ backgroundColor: shade }} />)}
              </span>
              {mood.name}
            </button>
          ))}
        </div>

        <div className="shade-discovery__grid" key={activeMood.name}>
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
            <p>Your recently viewed materials stay close so comparing shades and alternatives takes fewer taps.</p>
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
