import {
  ArrowRight,
  ChatCircleDots,
  CheckCircle,
  Package,
  Swatches,
  Truck,
} from "@phosphor-icons/react";
import { lazy, Suspense, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";
import SmartLink from "../components/SmartLink.jsx";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";
import {
  businessInfo,
  catalogueMessage,
  createWhatsAppLink,
  featuredProducts,
  productCategories,
} from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import {
  localBusinessJsonLd,
  useJsonLd,
  websiteJsonLd,
} from "../hooks/useJsonLd.js";

const YarnAtelier3D = lazy(
  () => import("../components/YarnAtelier3D.jsx"),
);

const categoryNames = [
  "Bliss Threads",
  "T-Shirt Yarn",
  "Macrame Cord",
  "Embroidery Threads",
  "Beads",
  "Purse Materials",
];

const shadeSlugs = [
  "cotton-dreamz",
  "makhhi-thread",
  "single-macrame-cord",
];

const featuredSlugs = [
  "makhhi-thread",
  "cotton-dreamz",
  "single-macrame-cord",
  "purse-handles",
];

export default function Home() {
  const shadeProducts = useMemo(
    () =>
      shadeSlugs
        .map((slug) => featuredProducts.find((product) => product.slug === slug))
        .filter(Boolean),
    [],
  );
  const featuredEdit = useMemo(
    () =>
      featuredSlugs
        .map((slug) => featuredProducts.find((product) => product.slug === slug))
        .filter(Boolean),
    [],
  );
  const categoryEdit = useMemo(
    () =>
      categoryNames
        .map((name) => productCategories.find((category) => category.name === name))
        .filter(Boolean),
    [],
  );
  const [activeShadeSlug, setActiveShadeSlug] = useState(shadeProducts[0]?.slug);
  const activeShadeProduct =
    shadeProducts.find((product) => product.slug === activeShadeSlug) ||
    shadeProducts[0];

  useDocumentMeta({
    title: "Fakhri Mart | Yarn, Threads & Craft Materials from Pune",
    description:
      "Browse yarn, crochet thread, macrame cord and bag-making supplies. Ask Fakhri Mart for current shades, pack sizes and quantity-based prices.",
  });
  useJsonLd(localBusinessJsonLd(businessInfo));
  useJsonLd(websiteJsonLd());

  return (
    <div className="fm-home">
      <section className="fm-hero" aria-labelledby="home-title">
        <div className="container fm-hero__grid">
          <div className="fm-hero__copy">
            <p className="fm-kicker">A yarn store for joyful making</p>
            <h1 id="home-title">
              <span>Colour you can feel.</span>
              <span>Craft you can build.</span>
            </h1>
            <p className="fm-hero__intro">
              Explore yarn, cord, thread and bag-making materials, then confirm
              live shades with Fakhri Mart.
            </p>
            <div className="fm-hero__actions">
              <SmartLink to="/products" className="btn btn-primary">
                Browse catalogue
                <ArrowRight size={18} aria-hidden="true" />
              </SmartLink>
              <a
                className="btn btn-outline"
                href={createWhatsAppLink(catalogueMessage)}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={18} />
                Ask for live shades
              </a>
            </div>
            <div className="fm-hero__proof" aria-label="Store benefits">
              <span><strong>15+</strong> material families</span>
              <span><strong>India-wide</strong> delivery</span>
              <span><strong>Live</strong> shade confirmation</span>
            </div>
          </div>

          <div className="fm-hero__media">
            <Suspense
              fallback={
                <picture className="yarn-atelier yarn-atelier--loading">
                  <source
                    srcSet="/assets/brand/fakhri-logo-640.avif"
                    type="image/avif"
                  />
                  <img
                    src="/assets/brand/fakhri-logo-640.webp"
                    alt="Fakhri Mart Yarn Store logo"
                    width="640"
                    height="640"
                    fetchPriority="high"
                  />
                </picture>
              }
            >
              <YarnAtelier3D />
            </Suspense>
            <span className="fm-hero__orbit-label" aria-hidden="true">
              Yarn · thread · cord · craft
            </span>
          </div>
        </div>
      </section>

      <div
        className="fm-material-loop"
        aria-label="Material categories"
        tabIndex="0"
      >
        <div className="fm-material-loop__track">
          {[
            "Cotton yarn",
            "Crochet thread",
            "Macrame cord",
            "Embroidery floss",
            "Bag handles",
            "Beads and findings",
            "Cotton yarn",
            "Crochet thread",
            "Macrame cord",
            "Embroidery floss",
            "Bag handles",
            "Beads and findings",
          ].map((label, index) => (
            <span key={`${label}-${index}`} aria-hidden={index > 5}>
              {label}
              <i />
            </span>
          ))}
        </div>
      </div>

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
              />
            </picture>
            <span className="fm-image-note">Built for makers, boutiques and resale shelves</span>
          </Reveal>

          <div className="fm-category-index" aria-label="Featured material categories">
            {categoryEdit.map((category, index) => (
              <Reveal
                key={category.name}
                delay={(index % 3) * 55}
                variant="fade-up"
              >
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

      {activeShadeProduct && (
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
                {shadeProducts.map((product) => (
                  <button
                    key={product.slug}
                    type="button"
                    role="tab"
                    aria-selected={activeShadeProduct.slug === product.slug}
                    className={
                      activeShadeProduct.slug === product.slug ? "is-active" : ""
                    }
                    onClick={() => setActiveShadeSlug(product.slug)}
                  >
                    {product.name}
                  </button>
                ))}
              </div>

              <div
                key={activeShadeProduct.slug}
                className="fm-shade-panel"
                role="tabpanel"
                aria-live="polite"
              >
                <div>
                  <span>{activeShadeProduct.category}</span>
                  <h3>{activeShadeProduct.name}</h3>
                  <p>{activeShadeProduct.variants}</p>
                </div>
                <div
                  className="fm-shade-swatches"
                  aria-label={`${activeShadeProduct.name} listed shades`}
                >
                  {activeShadeProduct.colors.map((color) => (
                    <span key={color.name}>
                      <i
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      {color.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="fm-shade-desk__actions">
                <Link
                  className="btn btn-light"
                  to={`/products/${activeShadeProduct.slug}`}
                >
                  View material
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <a
                  className="fm-inline-link"
                  href={createWhatsAppLink(
                    `Hello Fakhri Mart, please share current shade photos and availability for ${activeShadeProduct.name}.`,
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
      )}

      <section className="fm-home-section fm-featured-edit" aria-labelledby="featured-title">
        <div className="container">
          <Reveal className="fm-section-heading" variant="fade-up">
            <div>
              <p className="fm-kicker">The material edit</p>
              <h2 id="featured-title">Four tactile ways to begin</h2>
            </div>
            <p>
              Useful starting points across thread, yarn, cord and bag
              hardware, selected to make browsing feel effortless.
            </p>
          </Reveal>
          <div className="fm-featured-grid">
            {featuredEdit.map((product, index) => (
              <Reveal
                key={product.slug}
                delay={(index % 4) * 55}
                variant="fade-up"
              >
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

      <section className="fm-trade-panel" aria-labelledby="trade-title">
        <div className="container fm-trade-panel__grid">
          <Reveal className="fm-trade-panel__media" variant="slide-left">
            <picture>
              <source
                srcSet="/assets/images/editorial/craft-stock-room.avif"
                type="image/avif"
              />
              <img
                src="/assets/images/editorial/craft-stock-room.webp"
                alt="Organised shelves of yarn and craft materials in a stock room"
                width="1536"
                height="1024"
                loading="lazy"
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
    </div>
  );
}
