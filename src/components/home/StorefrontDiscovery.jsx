import { ArrowRight, ClockCounterClockwise, Eye, Swatches } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { featuredProducts } from "../../data/siteData.js";
import { useRecentlyViewed } from "../../hooks/useRecentlyViewed.js";
import ProductShowcaseCard from "../ProductShowcaseCard.jsx";
import Reveal from "../Reveal.jsx";

export function ShadeDiscovery() {
  return (
    <section className="commerce-section shade-discovery shade-discovery--support" aria-labelledby="shade-discovery-title">
      <div className="container shade-discovery__support-grid">
        <Reveal className="commerce-heading" variant="fade-up">
          <div>
            <p className="eyebrow"><Swatches size={15} /> Colour preview + shade-card support</p>
            <h2 id="shade-discovery-title">Use digital colour as direction. Confirm the real supplier shade before ordering.</h2>
            <p>The browser preview helps you explore a direction without creating fake inventory. Current supplier shade cards, pack labels and live product photos remain the source of truth.</p>
          </div>
        </Reveal>

        <div className="shade-discovery__support-actions">
          <Link className="shade-discovery__support-card" to="/yarn-guide">
            <Eye size={22} aria-hidden="true" />
            <span>
              <strong>Choose the right material</strong>
              <small>Start with your project and compare verified catalogue families.</small>
            </span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="shade-discovery__support-card" to="/blog#shade-checklist">
            <Swatches size={22} aria-hidden="true" />
            <span>
              <strong>Check a shade properly</strong>
              <small>See what to confirm from the current shade card or live stock photo.</small>
            </span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
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
