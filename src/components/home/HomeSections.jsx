import {
  ArrowRight,
  ChatCircleDots,
  CheckCircle,
  Package,
  Swatches,
  Truck,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard.jsx";
import Reveal from "../Reveal.jsx";
import WhatsAppIcon from "../WhatsAppIcon.jsx";
import { catalogueMessage, createWhatsAppLink } from "../../data/siteData.js";

export function MaterialRibbon({ categories }) {
  return (
    <nav className="fm-material-ribbon" aria-label="Popular material categories">
      <div className="container fm-material-ribbon__inner">
        <span>Browse by material</span>
        <div>
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
            >
              {category.shortName || category.name}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}

export function MaterialIndexSection({ categories }) {
  return (
    <section className="fm-home-section fm-material-index" aria-labelledby="material-title">
      <div className="container fm-material-index__grid">
        <Reveal className="fm-material-index__intro" variant="fade-up">
          <p className="fm-kicker">The tactile library</p>
          <h2 id="material-title">Find the material that fits the idea</h2>
          <p>
            Browse by fibre, finish or the part your project still needs.
            Each category opens into the full searchable catalogue.
          </p>
          <picture>
            <source
              srcSet="/assets/images/editorial/crochet-bag-worktable-640.avif 640w, /assets/images/editorial/crochet-bag-worktable-960.avif 960w, /assets/images/editorial/crochet-bag-worktable.avif 1280w"
              sizes="(max-width: 48rem) calc(100vw - 1.25rem), 50vw"
              type="image/avif"
            />
            <img
              src="/assets/images/editorial/crochet-bag-worktable.webp"
              srcSet="/assets/images/editorial/crochet-bag-worktable-640.webp 640w, /assets/images/editorial/crochet-bag-worktable-960.webp 960w, /assets/images/editorial/crochet-bag-worktable.webp 1280w"
              sizes="(max-width: 48rem) calc(100vw - 1.25rem), 50vw"
              alt="Crochet bag in progress beside yarn and wooden purse handles"
              width="1536"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </picture>
          <span className="fm-image-note">Built for makers, boutiques and resale shelves</span>
        </Reveal>

        <div className="fm-category-index" aria-label="Featured material categories">
          {categories.map((category, index) => (
            <Reveal key={category.name} delay={(index % 3) * 55} variant="fade-up">
              <Link
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="fm-category-row"
              >
                <span>
                  <strong>{category.shortName || category.name}</strong>
                  <small>{category.description}</small>
                </span>
                <ArrowRight size={20} aria-hidden="true" />
              </Link>
            </Reveal>
          ))}
          <Link className="fm-text-link" to="/products">
            View every category
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export function ShadeDeskSection({ products }) {
  const [activeSlug, setActiveSlug] = useState(products[0]?.slug);
  const activeProduct =
    products.find((product) => product.slug === activeSlug) || products[0];

  if (!activeProduct) return null;

  return (
    <section className="fm-shade-desk" aria-labelledby="shade-title">
      <div className="container fm-shade-desk__grid">
        <Reveal className="fm-shade-desk__image" variant="slide-left">
          <picture>
            <source
              srcSet="/assets/images/editorial/shade-library-640.avif 640w, /assets/images/editorial/shade-library-960.avif 960w, /assets/images/editorial/shade-library.avif 1280w"
              sizes="(max-width: 48rem) calc(100vw - 1.25rem), 50vw"
              type="image/avif"
            />
            <img
              src="/assets/images/editorial/shade-library.webp"
              srcSet="/assets/images/editorial/shade-library-640.webp 640w, /assets/images/editorial/shade-library-960.webp 960w, /assets/images/editorial/shade-library.webp 1280w"
              sizes="(max-width: 48rem) calc(100vw - 1.25rem), 50vw"
              alt="Yarn balls and crochet swatches arranged as a colour reference"
              width="1536"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </Reveal>

        <Reveal className="fm-shade-desk__content" delay={80} variant="slide-right">
          <p className="fm-kicker">The shade desk</p>
          <h2 id="shade-title">Turn colour decisions into confidence</h2>
          <p>
            Select a material to preview its listed shade family. Current
            stock and dye lots are confirmed on WhatsApp.
          </p>

          <div className="fm-shade-tabs" role="tablist" aria-label="Materials">
            {products.map((product) => (
              <button
                key={product.slug}
                type="button"
                role="tab"
                aria-selected={activeProduct.slug === product.slug}
                className={activeProduct.slug === product.slug ? "is-active" : ""}
                onClick={() => setActiveSlug(product.slug)}
              >
                {product.name}
              </button>
            ))}
          </div>

          <div
            key={activeProduct.slug}
            className="fm-shade-panel"
            role="tabpanel"
            aria-live="polite"
          >
            <div>
              <span>{activeProduct.category}</span>
              <h3>{activeProduct.name}</h3>
              <p>{activeProduct.variants}</p>
            </div>
            <div className="fm-shade-swatches" aria-label={`${activeProduct.name} listed shades`}>
              {activeProduct.colors.map((color) => (
                <span key={color.name}>
                  <i style={{ backgroundColor: color.hex }} aria-hidden="true" />
                  {color.name}
                </span>
              ))}
            </div>
          </div>

          <div className="fm-shade-desk__actions">
            <Link className="btn btn-light" to={`/products/${activeProduct.slug}`}>
              View material
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              className="fm-inline-link"
              href={createWhatsAppLink(
                `Hello Fakhri Mart, please share current shade photos and availability for ${activeProduct.name}.`,
              )}
              target="_blank"
              rel="noreferrer"
            >
              Ask for live shades
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function FeaturedEditSection({ products }) {
  return (
    <section className="fm-home-section fm-featured-edit" aria-labelledby="featured-title">
      <div className="container">
        <Reveal className="fm-section-heading" variant="fade-up">
          <div>
            <p className="fm-kicker">The material edit</p>
            <h2 id="featured-title">Four tactile ways to begin</h2>
          </div>
          <p>
            Useful starting points across thread, yarn, cord and bag hardware,
            selected to make browsing feel effortless.
          </p>
        </Reveal>
        <div className="fm-featured-grid">
          {products.map((product, index) => (
            <Reveal key={product.slug} delay={(index % 4) * 55} variant="fade-up">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
        <Link className="fm-text-link" to="/products">
          Search the full catalogue
          <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="fm-home-section fm-process" aria-labelledby="process-title">
      <div className="container fm-process__grid">
        <Reveal className="fm-process__heading" variant="slide-left">
          <p className="fm-kicker">Simple by design</p>
          <h2 id="process-title">From creative spark to confirmed order</h2>
          <p>
            Prices depend on quantity, shade, size and availability, so every
            order finishes with a direct confirmation.
          </p>
        </Reveal>

        <ol className="fm-process__steps">
          <Reveal as="li" variant="fade-up">
            <Package size={28} aria-hidden="true" />
            <span>
              <strong>Choose materials</strong>
              <small>Browse products and save the shades you want to discuss.</small>
            </span>
            <CheckCircle size={20} aria-hidden="true" />
          </Reveal>
          <Reveal as="li" delay={55} variant="fade-up">
            <Swatches size={28} aria-hidden="true" />
            <span>
              <strong>Build an enquiry</strong>
              <small>Add quantities, shade notes and your delivery city.</small>
            </span>
            <CheckCircle size={20} aria-hidden="true" />
          </Reveal>
          <Reveal as="li" delay={110} variant="fade-up">
            <ChatCircleDots size={28} aria-hidden="true" />
            <span>
              <strong>Confirm on WhatsApp</strong>
              <small>Receive current availability, pricing and delivery details.</small>
            </span>
            <CheckCircle size={20} aria-hidden="true" />
          </Reveal>
        </ol>
      </div>
    </section>
  );
}

export function TradePanelSection() {
  return (
    <section className="fm-trade-panel" aria-labelledby="trade-title">
      <div className="container fm-trade-panel__grid">
        <Reveal className="fm-trade-panel__media" variant="slide-left">
          <picture>
            <source srcSet="/assets/images/editorial/craft-stock-room.avif" type="image/avif" />
            <img
              src="/assets/images/editorial/craft-stock-room.webp"
              alt="Organised shelves of yarn and craft materials in a stock room"
              width="1536"
              height="1024"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </Reveal>
        <Reveal className="fm-trade-panel__copy" delay={80} variant="slide-right">
          <Truck size={34} aria-hidden="true" />
          <p className="fm-kicker">Made to move in volume</p>
          <h2 id="trade-title">Planning a boutique or resale shelf?</h2>
          <p>
            Send the material, quantity, shade and destination. Fakhri Mart
            will reply with current pack details and delivery options.
          </p>
          <div className="fm-trade-panel__actions">
            <Link className="btn btn-primary" to="/enquiry">
              Prepare enquiry
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <a
              className="btn btn-outline"
              href={createWhatsAppLink(catalogueMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={18} />
              Open WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
