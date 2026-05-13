import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import CatalogueCta from "../components/CatalogueCta.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import {
  businessInfo,
  createWhatsAppLink,
  featuredProducts,
  productCategories,
  trustBadges,
  whyChooseUs,
} from "../data/siteData.js";

const heroWords = "Premium Quality Threads for Every Stitch".split(" ");

export default function Home() {
  const heroVisualRef = useRef(null);

  useEffect(() => {
    const visual = heroVisualRef.current;
    if (!visual) return undefined;

    let frame = 0;
    const updateParallax = () => {
      frame = 0;
      const shift = Math.min(34, window.scrollY * 0.055);
      visual.style.setProperty("--hero-shift", `${shift}px`);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateParallax);
    };

    updateParallax();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="thread-bg" aria-hidden="true" />
        <div className="hero-thread-field" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="container hero-grid">
          <Reveal className="hero-copy" variant="fade-up">
            <p className="eyebrow hero-kicker">{businessInfo.tagline}</p>
            <h1 className="hero-title" aria-label="Premium Quality Threads for Every Stitch">
              {heroWords.map((word, index) => (
                <span key={`${word}-${index}`} style={{ "--word-index": index }}>
                  {word}
                </span>
              ))}
            </h1>
            <p className="hero-subtitle hero-sequence hero-sequence-subtitle">
              We supply sewing, embroidery, industrial, cotton, polyester, nylon, and zari threads
              for tailors, boutiques, garment units, wholesalers, and textile businesses.
            </p>
            <div className="button-row hero-sequence hero-sequence-actions">
              <Link className="btn btn-primary" to="/products">
                View Products
                <ArrowRight size={18} />
              </Link>
              <a className="btn btn-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                Get Bulk Enquiry on WhatsApp
              </a>
            </div>
            <div className="trust-badges hero-sequence hero-sequence-badges">
              {trustBadges.map((badge, index) => (
                <span key={badge} style={{ "--badge-index": index }}>
                  <CheckCircle2 size={16} />
                  {badge}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal className="hero-visual-card" delay={140} variant="scale-in">
            <div ref={heroVisualRef} className="hero-parallax-layer">
              <ProductVisual palette={["#14213d", "#e0a800", "#e76f51"]} />
            </div>
            <div className="stock-card stock-card-one">
              <strong>120+ Shades</strong>
              <span>Color range support</span>
            </div>
            <div className="stock-card stock-card-two">
              <strong>Retail + Bulk</strong>
              <span>Catalogue enquiries</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Product Range</p>
            <h2>Popular Thread Categories</h2>
            <p>Core thread options for everyday stitching, boutique work, and production needs.</p>
          </Reveal>
          <div className="card-grid category-grid">
            {productCategories.slice(0, 4).map((category, index) => (
              <Reveal key={category.name} delay={index * 70} variant="fade-up">
                <CategoryCard category={category} />
              </Reveal>
            ))}
          </div>
          <div className="center-action">
            <Link className="btn btn-outline" to="/products">
              Explore All Products
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Featured Catalogue</p>
            <h2>Featured Products</h2>
            <p>No fixed prices are shown because retail and wholesale rates may vary by quantity.</p>
          </Reveal>
          <div className="card-grid product-grid">
            {featuredProducts.slice(0, 3).map((product, index) => (
              <Reveal key={product.name} delay={index * 75} variant="scale-in">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section why-section">
        <div className="container why-grid">
          <Reveal variant="slide-left">
            <p className="eyebrow">Why Choose Us</p>
            <h2>Reliable thread supply for growing textile businesses.</h2>
            <p>
              From tailoring counters to garment production, this catalogue experience helps buyers
              browse thread options and send clear enquiries quickly.
            </p>
          </Reveal>
          <div className="why-list">
            {whyChooseUs.map((reason, index) => (
              <Reveal key={reason} className="why-item" delay={index * 60} variant="slide-right">
                <CheckCircle2 size={20} />
                <span>{reason}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <CatalogueCta />
      </div>
    </>
  );
}
