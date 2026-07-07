// src/pages/Home.jsx
// Home — one signature hero moment (multi-thread weave, load-time, reduced-motion safe),
// shop-by-department, featured products (real photography), trust signals (real ratings).

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Truck, ShieldCheck, MessageCircle } from "lucide-react";
import { Reveal, StaggerReveal, StaggerItem } from "../components/Reveal.jsx";
import { ProductCard } from "../components/ProductCard.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import {
  businessInfo,
  MASTER_CATEGORIES,
  featuredProducts,
  createWhatsAppLink,
} from "../data/catalogue.js";
import {
  threadDrawVariants,
  usePrefersReducedMotion,
  isTouchDevice,
  buttonTap,
} from "../lib/motion.js";

const heroWords = ["Colourful", "yarns,", "threads", "&", "craft", "essentials."];
const threadColors = ["#2A8C82", "#D9A5B3", "#8F7422", "#B95776"];

const departmentBlurbs = {
  Yarns: "Acrylic, cotton & blended yarns by the ball.",
  Threads: "Crochet cottons, embroidery silks & trims.",
  Accessories: "Beads, bases, handles, rings, hooks & kits.",
};

export default function Home() {
  useDocumentMeta({
    title: "Fakhri Mart — Yarns, Threads & Craft Accessories",
    description:
      "Premium yarns, crochet threads, macrame cords, embroidery floss, beads, bases and purse-making essentials. Pan-India delivery. WhatsApp enquiry catalogue.",
  });

  const reduced = usePrefersReducedMotion();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "15%"]);
  const heroCopyY = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "-10%"]);

  return (
    <div className="home">
      {/* ── SIGNATURE HERO ─────────────────────────────────────────── */}
      <section className="hero" ref={heroRef}>
        <div className="hero-bg" aria-hidden="true" />

        {/* Multi-thread weave — THE signature moment. Load-time, one-shot. */}
        {!reduced && (
          <svg
            className="hero-thread-weave"
            viewBox="0 0 1200 800"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            {threadColors.map((c, i) => (
              <motion.path
                key={i}
                d={`M ${-50 + i * 30},${120 + i * 120} Q 400,${40 + i * 90} 700,${200 + i * 80} T 1250,${120 + i * 90}`}
                fill="none"
                stroke={c}
                strokeWidth="1.4"
                strokeLinecap="round"
                variants={threadDrawVariants(0.4 + i * 0.18)}
                initial="hidden"
                animate="show"
              />
            ))}
            {threadColors.map((c, i) => (
              <motion.path
                key={`x-${i}`}
                d={`M ${200 + i * 250},${320 + (i % 2) * 60} L ${220 + i * 250},${340 + (i % 2) * 60} M ${220 + i * 250},${320 + (i % 2) * 60} L ${200 + i * 250},${340 + (i % 2) * 60}`}
                fill="none"
                stroke={c}
                strokeWidth="1.2"
                variants={threadDrawVariants(1.0 + i * 0.15)}
                initial="hidden"
                animate="show"
              />
            ))}
          </svg>
        )}

        <div className="container hero-content">
          <motion.div style={{ y: heroCopyY }} className="hero-copy">
            <span className="hero-eyebrow">
              <span className="hero-eyebrow-line" aria-hidden="true" />
              {businessInfo.descriptor} · {businessInfo.location}
            </span>
            <h1 className="hero-title">
              {heroWords.map((word, i) => (
                <motion.span
                  key={i}
                  className="hero-word"
                  initial={reduced ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    delay: reduced ? 0 : 0.4 + i * 0.08,
                    duration: reduced ? 0 : 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{
                    display: "inline-block",
                    marginRight: "0.18em",
                    color: word === "&" || word === "yarns," ? "var(--gold)" : "inherit",
                    fontStyle: word === "&" ? "italic" : "normal",
                  }}
                >
                  {word}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="hero-subtitle"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 1.0, duration: 0.5 }}
            >
              A small, hand-curated catalogue of yarns, crochet threads, macrame cords and
              bag-making hardware. Enquire by WhatsApp — no accounts, no checkout.
            </motion.p>
            <motion.div
              className="hero-cta-row"
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : 1.2, duration: 0.5 }}
            >
              <Link to="/products" className="btn btn-primary" whileTap={buttonTap}>
                Browse Catalogue
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href={createWhatsAppLink(`Hello ${businessInfo.shortName}, I'd like to enquire about your products.`)}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-whatsapp"
                whileTap={buttonTap}
              >
                <MessageCircle size={16} aria-hidden="true" />
                WhatsApp Us
              </a>
            </motion.div>
          </motion.div>

          <motion.div style={{ y: heroImageY }} className="hero-image-frame">
            <img
              src="/assets/images/products/cotton-dreamz/hero.webp"
              alt="Fakhri Mart yarn collection — cotton dreamz in seafoam, hot pink, and butter yellow"
              fetchPriority="high"
              className="hero-image"
            />
          </motion.div>
        </div>
      </section>

      {/* ── SHOP BY DEPARTMENT ─────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow centered">Three specialties</p>
            <h2 className="centered">Shop by Department</h2>
          </Reveal>
          <StaggerReveal as="div" className="department-grid">
            {MASTER_CATEGORIES.map((mc) => (
              <StaggerItem key={mc}>
                <Link to={`/products?department=${mc}`} className="department-card" whileTap={buttonTap}>
                  <div className="department-card-icon" aria-hidden="true">
                    {mc === "Yarns" && <YarnIcon />}
                    {mc === "Threads" && <ThreadIcon />}
                    {mc === "Accessories" && <AccessoryIcon />}
                  </div>
                  <h3>{mc}</h3>
                  <p>{departmentBlurbs[mc]}</p>
                  <span className="department-card-cta">
                    Browse {mc.toLowerCase()} <ArrowRight size={12} />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS (real photography) ───────────────────── */}
      <section className="section section-tinted">
        <div className="container">
          <Reveal>
            <p className="eyebrow centered">Bestsellers</p>
            <h2 className="centered">Featured this week</h2>
          </Reveal>
          <StaggerReveal as="div" className="product-grid">
            {featuredProducts.slice(0, 8).map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard product={p} />
              </StaggerItem>
            ))}
          </StaggerReveal>
          <div className="centered" style={{ marginTop: "var(--space-8)" }}>
            <Link to="/products" className="btn btn-secondary">
              View all products <ArrowRight size={14} style={{ display: "inline", marginLeft: 6 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS (real, not fabricated) ───────────────────── */}
      <section className="section">
        <div className="container">
          <Reveal>
            <p className="eyebrow centered">Why makers trust us</p>
            <h2 className="centered">Real craft, real service</h2>
          </Reveal>
          <StaggerReveal as="div" className="trust-grid">
            <StaggerItem>
              <div className="trust-card">
                <Truck size={28} className="trust-icon" aria-hidden="true" />
                <h3>Pan-India delivery</h3>
                <p>We ship across India. Typical transit 3–5 business days. Confirm exact timing for your area on WhatsApp.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="trust-card">
                <ShieldCheck size={28} className="trust-icon" aria-hidden="true" />
                <h3>Wholesale & retail</h3>
                <p>Retail, repeat, reseller, boutique and bulk enquiries all supported. Flexible pricing for trade buyers.</p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="trust-card">
                <MessageCircle size={28} className="trust-icon" aria-hidden="true" />
                <h3>WhatsApp-first</h3>
                <p>No accounts, no checkout. Build an enquiry basket, send one pre-filled WhatsApp message, we reply with availability and pricing.</p>
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>
    </div>
  );
}

// Inline SVG icons for departments — no icon library bloat for 3 simple shapes
function YarnIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--teal)" strokeWidth="1.5">
      <circle cx="20" cy="20" r="14" />
      <path d="M8 14 Q20 8 32 14 M6 20 Q20 12 34 20 M8 26 Q20 20 32 26" />
    </svg>
  );
}
function ThreadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--pink-dark)" strokeWidth="1.5">
      <path d="M10 6 Q14 14 10 22 Q6 30 10 38" />
      <path d="M20 6 Q24 14 20 22 Q16 30 20 38" />
      <path d="M30 6 Q34 14 30 22 Q26 30 30 38" />
    </svg>
  );
}
function AccessoryIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="var(--gold)" strokeWidth="1.5">
      <circle cx="14" cy="14" r="6" />
      <circle cx="26" cy="26" r="6" />
      <path d="M20 4 L20 12 M4 20 L12 20 M28 20 L36 20 M20 28 L20 36" />
    </svg>
  );
}
