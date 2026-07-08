import {
  ArrowRight,
  CheckCircle2,
  Instagram,
  MapPin,
  Phone,
  Scissors,
  Wand2,
  Sparkles,
  ShoppingBag,
  Heart
} from "lucide-react";
import { useMemo, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import SmartLink from "../components/SmartLink.jsx";
import CatalogueCta from "../components/CatalogueCta.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import GalleryVisual from "../components/GalleryVisual.jsx";
import IconBadge from "../components/IconBadge.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import StaggerReveal, { staggerChild } from "../components/StaggerReveal.jsx";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";
import { ease, duration, prefersReducedMotion, isTouchDevice, spring } from "../motion-tokens.js";
import { smartWhatsAppLink } from "../i18n.jsx";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { useJsonLd, localBusinessJsonLd, websiteJsonLd } from "../hooks/useJsonLd.js";
import {
  aboutCopy,
  aboutPoints,
  bulkMessage,
  bulkOrderCards,
  businessInfo,
  catalogueMessage,
  createWhatsAppLink,
  featuredProducts,
  galleryItems,
  newArrivals,
  productCategories,
  productFilters,
  testimonials,
  whyChooseUs,
} from "../data/siteData.js";

const heroWords = ["Colourful", "Yarns", "&", "Craft", "Essentials"];

const CRAFT_USE_CASES = [
  { name: "Crochet", tag: "Crochet", desc: "Hooks, yarns, cotton threads, and amigurumi supplies.", icon: "Sparkles" },
  { name: "Knitting", tag: "Knitting", desc: "Soft Vardhaman wools, Cool Knit, and acrylic yarns.", icon: "Wand2" },
  { name: "Macrame", tag: "Macrame", desc: "Single & twisted cotton ropes, rings, and wall decor.", icon: "Scissors" },
  { name: "Embroidery", tag: "Embroidery", desc: "Anchor & Doli lacchi threads for fine needlework.", icon: "Sparkles" },
  { name: "Bag Making", tag: "Bag Making", desc: "T-Shirt yarns, leather bases, and wooden purse handles.", icon: "ShoppingBag" },
  { name: "Accessories", tag: "Accessories", desc: "Steel rings, handles, purse locks, and starter kits.", icon: "Wand2" }
];

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");
  const heroRef = useRef(null);
  const heroSectionRef = useRef(null); // for cursor-needle hit-testing
  const reduce = prefersReducedMotion();
  const touch = isTouchDevice();

  // Phase 1 + Phase 5 — LocalBusiness JSON-LD on the home page
  useDocumentMeta({
    title: "Fakhri Mart | Colourful Yarns, Crochet Threads & Craft Essentials",
    description:
      "Premium yarns, crochet threads, macrame cords, beads, bases and purse-making essentials. All-India delivery, WhatsApp enquiry catalogue for resellers and crafters.",
  });
  useJsonLd(localBusinessJsonLd(businessInfo));
  useJsonLd(websiteJsonLd());

  // Scroll-driven hero parallax + opacity fade
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : 150]);
  const heroImageScale = useTransform(heroScroll, [0, 1], [1, reduce ? 1 : 1.15]);
  const heroCopyY = useTransform(heroScroll, [0, 1], [0, reduce ? 0 : -80]);
  const heroCopyOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);
  const scrollCueOpacity = useTransform(heroScroll, [0, 0.15], [1, 0]);

  // ── Phase 2.1 secondary — Cursor-as-needle (spring-lagged, hero only) ──
  // Disable on touch devices and under reduced motion (per spec).
  const [needleActive, setNeedleActive] = useState(false);
  const needleX = useSpring(0, spring.soft);
  const needleY = useSpring(0, spring.soft);
  const trailX = useSpring(0, { ...spring.soft, stiffness: 80, damping: 18 });
  const trailY = useSpring(0, { ...spring.soft, stiffness: 80, damping: 18 });

  useEffect(() => {
    if (touch || reduce) return;
    const hero = heroSectionRef.current;
    if (!hero) return;
    const onMove = (e) => {
      const rect = hero.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        needleX.set(x);
        needleY.set(y);
        trailX.set(x);
        trailY.set(y);
        setNeedleActive(true);
      } else {
        setNeedleActive(false);
      }
    };
    hero.addEventListener("mousemove", onMove);
    return () => hero.removeEventListener("mousemove", onMove);
  }, [touch, reduce, needleX, needleY, trailX, trailY]);

  // ── Phase 2.1 tertiary — Stitched headline reveal ──
  // A small needle SVG travels L→R above the headline, timed so each word's
  // existing hero-cinematic-word entrance appears to be "triggered" by the needle.
  const [stitchProgress, setStitchProgress] = useState(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) {
      setStitchProgress(1);
      return;
    }
    let raf;
    const start = performance.now();
    const dur = 1800;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      setStitchProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  // Multi-thread weave colors (drawn from real yarn palette colors already in catalogue)
  const threadColors = ["#35b8ad", "#f6a7b8", "#f3c65f", "#7B2D26"];

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") return featuredProducts.slice(0, 8);
    return featuredProducts.filter((product) => product.filters.includes(activeFilter)).slice(0, 8);
  }, [activeFilter]);

  const bestSellers = useMemo(() => {
    return [
      featuredProducts.find(p => p.slug === "makhhi-thread"),
      featuredProducts.find(p => p.slug === "cotton-dreamz"),
      featuredProducts.find(p => p.slug === "single-macrame-cord"),
      featuredProducts.find(p => p.slug === "purse-handles")
    ].filter(Boolean);
  }, []);

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          CINEMATIC HERO — Full viewport, massive type, single subtle thread
          ═══════════════════════════════════════════════════════════════ */}
      <section className="hero-cinematic" id="home" ref={(el) => { heroRef.current = el; heroSectionRef.current = el; }}>
        {/* Layer 0: Background gradient */}
        <div className="hero-cinematic-bg" aria-hidden="true" />

        {/* Layer 0.5: Loom/weave SVG texture (Phase 2.3) — very faint, slow drift */}
        {!reduce && (
          <div
            className="hero-loom-texture"
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 0,
              opacity: 0.05,
              backgroundImage:
                "linear-gradient(90deg, transparent 49.5%, var(--pink-dark, #4A141C) 49.5%, var(--pink-dark, #4A141C) 50.5%, transparent 50.5%), linear-gradient(0deg, transparent 49.5%, var(--gold-deep, #8E6824) 49.5%, var(--gold-deep, #8E6824) 50.5%, transparent 50.5%)",
              backgroundSize: "28px 28px",
              animation: "loom-drift 60s linear infinite",
            }}
          />
        )}
        <style>{`@keyframes loom-drift { from { background-position: 0 0; } to { background-position: 28px 28px; } }`}</style>

        {/* Layer 1: Multi-thread weave (Phase 2.1 primary) — replaces single thread */}
        <svg
          className="hero-cinematic-thread-accent"
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {threadColors.map((c, i) => (
            <motion.path
              key={i}
              d={`M ${-50 + i * 30}, ${120 + i * 120} Q 400, ${40 + i * 90}, 700, ${200 + i * 80} T 1250, ${120 + i * 90}`}
              fill="none"
              stroke={c}
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.55"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{
                pathLength: { duration: 1.8, ease: ease.soft, delay: 0.4 + i * 0.18 },
                opacity: { duration: 0.3, ease: ease.soft, delay: 0.4 + i * 0.18 },
              }}
            />
          ))}
          {/* Cross-stitch accents — small X marks along the weave */}
          {threadColors.map((c, i) => (
            <motion.path
              key={`x-${i}`}
              d={`M ${200 + i * 250}, ${320 + (i % 2) * 60} L ${220 + i * 250}, ${340 + (i % 2) * 60} M ${220 + i * 250}, ${320 + (i % 2) * 60} L ${200 + i * 250}, ${340 + (i % 2) * 60}`}
              fill="none"
              stroke={c}
              strokeWidth="1.2"
              opacity="0.4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, ease: ease.soft, delay: 1.0 + i * 0.15 }}
            />
          ))}
        </svg>

        {/* Layer 1.5: Cursor-as-needle (Phase 2.1 secondary) — hero only, spring-lagged */}
        {!touch && !reduce && needleActive && (
          <>
            <motion.svg
              className="cursor-needle"
              style={{ x: needleX, y: needleY, translateX: "-50%", translateY: "-50%", position: "fixed", pointerEvents: "none", zIndex: 60, mixBlendMode: "multiply" }}
              width="36"
              height="36"
              viewBox="0 0 36 36"
              aria-hidden="true"
            >
              <path d="M18 4 L22 18 L18 32 L14 18 Z" fill="var(--gold, #B8893C)" stroke="var(--pink-dark, #4A141C)" strokeWidth="0.8" />
              <circle cx="18" cy="18" r="2" fill="var(--pink-dark, #4A141C)" />
            </motion.svg>
            <motion.svg
              className="cursor-needle-trail"
              style={{ x: trailX, y: trailY, translateX: "-50%", translateY: "-50%", position: "fixed", pointerEvents: "none", zIndex: 59, opacity: 0.55 }}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="3" fill="var(--gold, #B8893C)" />
            </motion.svg>
          </>
        )}

        {/* Layer 2: Hero content — massive type + parallax image */}
        <motion.div
          className="hero-cinematic-content"
          style={{ y: heroCopyY, opacity: heroCopyOpacity }}
        >
          <div className="container">
            <motion.p
              className="hero-cinematic-eyebrow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.standard, ease: ease.soft, delay: 0.2 }}
            >
              <span className="hero-cinematic-eyebrow-line" aria-hidden="true" />
              {"Yarns, threads & craft supplies — Pune se, poore India ke liye."}
            </motion.p>

            <h1 className="hero-cinematic-title" aria-label="Colourful Yarns and Craft Essentials" style={{ position: "relative" }}>
              {/* Phase 2.1 tertiary — Stitched headline needle traveling L→R */}
              {!reduce && (
                <motion.span
                  className="stitch-needle"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: `${stitchProgress * 92}%`,
                    top: "-12px",
                    width: "28px",
                    height: "28px",
                    color: "var(--gold, #B8893C)",
                    pointerEvents: "none",
                    zIndex: 3,
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 2 L17 14 L14 26 L11 14 Z" fill="currentColor" />
                  </svg>
                </motion.span>
              )}
              {heroWords.map((word, index) => {
                // Sync word visibility to stitchProgress — word i appears when needle passes its position
                const wordThreshold = (index + 1) / heroWords.length;
                const visible = reduce || stitchProgress >= wordThreshold * 0.85;
                return (
                  <motion.span
                    key={`${word}-${index}`}
                    className="hero-cinematic-word"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 60 }}
                    transition={{
                      delay: reduce ? 0.4 + index * 0.1 : 0,
                      duration: reduce ? 0.9 : 0.6,
                      ease: ease.soft,
                    }}
                    style={{ display: "inline-block" }}
                  >
                    {word === "&" ? (
                      <span className="hero-cinematic-amp">&amp;</span>
                    ) : word}
                  </motion.span>
                );
              })}
            </h1>

            <motion.p
              className="hero-cinematic-subtitle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.standard, ease: ease.soft, delay: 1.2 }}
            >
              {"12+ categories, 70+ shades — aapke next project ka starting point."} Explore quality yarns, crochet threads, macrame cords, beads, bases and accessories
              with all-India delivery and easy WhatsApp enquiry.
            </motion.p>

            <motion.div
              className="hero-cinematic-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: duration.standard, ease: ease.soft, delay: 1.4 }}
            >
              <SmartLink to="/products" className="btn btn-primary btn-cinematic">
                Explore Catalogue
                <ArrowRight size={18} aria-hidden="true" />
              </SmartLink>
              <a
                href={smartWhatsAppLink({ type: "bulk" })}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp btn-cinematic"
                aria-label="Send a bulk enquiry message on WhatsApp"
              >
                <WhatsAppIcon size={18} />
                WhatsApp Enquiry
              </a>
            </motion.div>

            <motion.div
              className="hero-cinematic-trust"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: duration.standard, ease: ease.soft, delay: 1.7 }}
            >
              {[
                "All India Delivery",
                "12+ Categories",
                "Wholesale Friendly",
                "WhatsApp Catalogue",
              ].map((badge) => (
                <span key={badge}>
                  <CheckCircle2 size={14} aria-hidden="true" />
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Hero image — Ken Burns + parallax */}
          <motion.div
            className="hero-cinematic-image-wrap"
            style={{ y: heroImageY, scale: heroImageScale }}
          >
            <div className="hero-cinematic-image">
              <img
                src="/assets/images/hero_banner.webp"
                alt="Vibrant yarn balls and craft accessories"
                fetchPriority="high"
              />
            </div>
            {/* Floating accent card */}
            <motion.div
              className="hero-cinematic-accent-card"
              initial={{ opacity: 0, x: 30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              transition={{ duration: duration.slow, ease: ease.emphasis, delay: 1.6 }}
            >
              <strong>12+ Categories</strong>
              <span>Yarns, threads, beads, bases &amp; more</span>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="hero-cinematic-scroll-cue"
          style={{ opacity: scrollCueOpacity }}
          aria-hidden="true"
        >
          <span>Scroll to explore</span>
          <motion.span
            className="hero-cinematic-scroll-cue-line"
            animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: ease.soft }}
          />
        </motion.div>
      </section>

      {/* Thread divider into next section */}
      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      {/* Category Section */}
      <section className="section" id="categories">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Product Categories</p>
            <h2>Shop by category — har project ke liye sahi yarn</h2>
            <p>
              Browse yarns, crochet threads, macrame cords, embroidery threads, beads, bases,
              handles, purse accessories and craft essentials.
            </p>
          </Reveal>
          <div className="card-grid category-grid">
            {productCategories.slice(0, 8).map((category, index) => (
              <Reveal key={category.name} delay={(index % 4) * 65} variant="fade-up">
                <CategoryCard category={category} />
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/products" className="btn btn-outline">
              View All Categories
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      {/* Shop by Craft / Use Case Section */}
      <section className="section section-tinted" id="shop-by-craft">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Shop by Craft</p>
            <h2>Find materials for your specific project</h2>
            <p>Select your favorite needlework or weaving hobby and browse tailored supplies.</p>
          </Reveal>
          <StaggerReveal className="card-grid use-cases-grid">
            {CRAFT_USE_CASES.map((craft) => (
              <motion.div key={craft.name} variants={staggerChild}>
                <Link to={`/products?tag=${craft.tag}`} className="craft-discovery-card">
                  <div className="craft-card-icon">
                    {craft.name === "Bag Making" ? <ShoppingBag size={28} aria-hidden="true" /> : craft.name === "Macrame" ? <Scissors size={28} aria-hidden="true" /> : <Sparkles size={28} aria-hidden="true" />}
                  </div>
                  <h3>{craft.name}</h3>
                  <p>{craft.desc}</p>
                  <span className="craft-browse-link">
                    Browse {craft.name} <ArrowRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      {/* Curated Best Sellers Row */}
      <section className="section" id="best-sellers">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Best Sellers</p>
            <h2>Most enquired products — resellers ki regular picks</h2>
            <p>Our top-enquired yarns and accessories ready for immediate catalogue orders.</p>
          </Reveal>
          <div className="card-grid product-grid">
            {bestSellers.map((product, index) => (
              <Reveal key={`best-${product.slug}`} delay={index * 80} variant="scale-in">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      {/* How Enquiry Works Stepper */}
      <section className="section bg-dark text-light enquiry-how-it-works-home">
        <div className="container">
          <Reveal className="section-heading text-center" variant="scale-in">
            <p className="eyebrow">Order Flow</p>
            <h2>How enquiry works — 4 simple steps</h2>
            <p>
              Since Fakhri Mart supplies custom wholesale orders and shade varieties, we process final payments and deliveries manually on WhatsApp.
            </p>
          </Reveal>

          <StaggerReveal className="how-it-works-timeline">
            <motion.div className="timeline-step" variants={staggerChild}>
              <span className="step-badge">1</span>
              <h3>Add to Basket</h3>
              <p>Browse our range of 12+ categories. Choose your desired shades and quantities, and add them to your client-side Enquiry Basket.</p>
            </motion.div>
            <motion.div className="timeline-step" variants={staggerChild}>
              <span className="step-badge">2</span>
              <h3>Aggregate Quote</h3>
              <p>View your basket checklist on the Enquiry tab. Adjust quantities, review selected shades, and click "Submit Enquiry".</p>
            </motion.div>
            <motion.div className="timeline-step" variants={staggerChild}>
              <span className="step-badge">3</span>
              <h3>WhatsApp Connect</h3>
              <p>Your browser compiles a clean summarized message with all products, quantities, and color codes, opening a direct chat with our team.</p>
            </motion.div>
            <motion.div className="timeline-step" variants={staggerChild}>
              <span className="step-badge">4</span>
              <h3>Confirm & Deliver</h3>
              <p>We will confirm exact stock availability, share verified digital shade cards on request, calculate final shipping quotes, and complete the order.</p>
            </motion.div>
          </StaggerReveal>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      {/* Featured Catalogue Grid */}
      <section className="section" id="products">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Featured Catalogue</p>
            <h2>Featured products — enquire on WhatsApp</h2>
            <p>
              Prices are shared on enquiry because quantity, shade, size, packaging and availability
              can change the final bulk or retail rate.
            </p>
          </Reveal>

          <Reveal className="filter-bar" variant="fade-up">
            <img
              src="/assets/fakhri-mart-logo.webp"
              alt="Fakhri Mart brand mark"
              className="hero-logo-medallion"
            />
            {productFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={activeFilter === filter ? "filter-chip active" : "filter-chip"}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </Reveal>

          <div key={activeFilter} className="card-grid product-grid product-grid--filtered" aria-live="polite">
            {visibleProducts.map((product, index) => (
              <Reveal key={`${activeFilter}-${product.name}`} delay={(index % 6) * 45} variant="scale-in">
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/products" className="btn btn-outline">
              Browse Entire Catalogue
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      {/* New Arrivals Section */}
      <section className="section section-tinted" id="new-arrivals">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">New Arrivals</p>
            <h2>New arrivals this month — fresh stock, naye shades</h2>
            <p>New product lines and accessories can be checked quickly through WhatsApp.</p>
          </Reveal>
          <div className="card-grid arrivals-grid">
            {newArrivals.map((item, index) => (
              <Reveal key={item.name} className="arrival-card" delay={(index % 3) * 75} variant="fade-up">
                <span className="new-badge">New</span>
                <ProductVisual palette={item.palette} compact />
                <div>
                  <p className="eyebrow">{item.category}</p>
                  <h3>{item.name}</h3>
                  <p>{item.note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      <section className="section bulk-section" id="bulk-orders">
        <div className="container bulk-layout">
          <Reveal className="bulk-copy" variant="slide-left">
            <p className="eyebrow">Bulk Orders</p>
            <h2>Bulk orders — wholesale pricing on enquiry</h2>
            <p>
              Share your required product, quantity, colour, shade, size and delivery location. Our
              team will help you with availability and bulk pricing.
            </p>
            <a className="btn btn-primary" href={createWhatsAppLink(bulkMessage)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} />
              Get Bulk Price on WhatsApp
            </a>
          </Reveal>
          <div className="bulk-card-grid">
            {bulkOrderCards.map((item, index) => (
              <Reveal key={item.title} className="highlight-card" delay={(index % 2) * 75} variant="slide-right">
                <IconBadge name={item.icon} tone={index % 2 === 0 ? "teal" : "pink"} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="container" id="catalogue">
        <CatalogueCta />
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      <section className="section section-tinted" id="gallery">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Gallery</p>
            <h2>Gallery — projects made with our yarns</h2>
            <p>Organized views of yarns, cords, embroidery threads, accessories, beads and purse materials.</p>
          </Reveal>
          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <Reveal key={item.title} className="gallery-card" delay={(index % 4) * 60} variant="scale-in">
                <GalleryVisual item={item} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      <section className="section about-band" id="about">
        <div className="container split-grid">
          <Reveal variant="slide-left">
            <p className="eyebrow">About Fakhri Mart</p>
            <h2>For creators, boutiques, and resellers — sab ke liye</h2>
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

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      <section className="section section-tinted" id="why-choose">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Why Choose Fakhri Mart</p>
            <h2>Why shop with us — quick WhatsApp replies, all-India delivery</h2>
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

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      <section className="section testimonials-section">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Customer Notes</p>
            <h2>Customer notes — WhatsApp pe aaye hue feedback</h2>
          </Reveal>
          <div className="testimonial-grid">
            {testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.quote} className="testimonial-card" delay={index * 75} variant="fade-up">
                <p>"{testimonial.quote}"</p>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.detail}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <hr style={{ border: 'none', borderTop: '1px solid #826E33', opacity: 0.2, margin: '2rem 0' }} />

      <section className="section enquiry-section" id="enquiry">
        <div className="container enquiry-layout">
          <Reveal variant="slide-left">
            <p className="eyebrow">Send Enquiry</p>
            <h2>Ready to start your next project? Enquire on WhatsApp</h2>
            <p>
              Share your product, quantity, shade, city and business type. For faster support, the
              WhatsApp button stays available after submission.
            </p>
            <a className="btn btn-whatsapp" href={createWhatsAppLink(catalogueMessage)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} />
              WhatsApp Catalogue
            </a>
          </Reveal>
          <Reveal delay={120} variant="slide-right">
            <EnquiryForm compact />
          </Reveal>
        </div>
      </section>

      <section className="section contact-strip" id="contact">
        <div className="container contact-strip-grid">
          <Reveal className="contact-strip-card" variant="fade-up">
            <MapPin size={23} />
            <span>
              <strong>{businessInfo.location}</strong>
              <small>{businessInfo.delivery}</small>
            </span>
          </Reveal>
          <Reveal className="contact-strip-card" delay={70} variant="fade-up">
            <Phone size={23} />
            <span>
              <strong>{businessInfo.phoneDisplay}</strong>
              <small>Call or WhatsApp for catalogue</small>
            </span>
          </Reveal>
          <Reveal className="contact-strip-card" delay={140} variant="fade-up">
            <Instagram size={23} />
            <span>
              <strong>@{businessInfo.instagram}</strong>
              <small>Instagram handle to confirm before publishing</small>
            </span>
          </Reveal>
        </div>
      </section>
    </>
  );
}
