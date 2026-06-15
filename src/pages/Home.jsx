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
  Heart,
  HelpCircle,
  Truck,
  Percent,
  Check
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import SmartLink from "../components/SmartLink.jsx";
import CatalogueCta from "../components/CatalogueCta.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import GalleryVisual from "../components/GalleryVisual.jsx";
import IconBadge from "../components/IconBadge.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";
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

const heroWords = "Colourful Yarns & Craft Essentials".split(" ");

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

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") return featuredProducts.slice(0, 8); // Limit to 8 featured on home
    return featuredProducts.filter((product) => product.filters.includes(activeFilter)).slice(0, 8);
  }, [activeFilter]);

  // Curated Best Sellers List
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
      <section className="hero" id="home">
        <div className="thread-bg" aria-hidden="true" />
        <div className="hero-thread-field" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="container hero-grid">
          <Reveal className="hero-copy" variant="fade-up">
            <p className="eyebrow hero-kicker">{businessInfo.tagline}</p>
            <h1 className="hero-title" aria-label="Colourful Yarns and Craft Essentials">
              {heroWords.map((word, index) => (
                <span key={`${word}-${index}`} style={{ "--word-index": index }}>
                  {word}
                </span>
              ))}
            </h1>
            <p className="hero-subtitle hero-sequence hero-sequence-subtitle">
              Explore quality yarns, crochet threads, macrame cords, beads, bases and accessories
              with all-India delivery and easy WhatsApp enquiry.
            </p>
            <div className="button-row hero-sequence hero-sequence-actions">
              <SmartLink to="/products" className="btn btn-primary">
                Explore Catalogue
                <ArrowRight size={18} />
              </SmartLink>
              <a className="btn btn-whatsapp" href={createWhatsAppLink(bulkMessage)} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={18} />
                WhatsApp Enquiry
              </a>
              <Link className="btn-link-text" to="/enquiry">
                Request Catalogue
              </Link>
            </div>
            <div className="trust-badges hero-sequence hero-sequence-badges">
              {[
                "All India Delivery",
                "12+ Categories",
                "Wholesale Friendly",
                "WhatsApp Catalogue",
              ].map((badge, index) => (
                <span key={badge} style={{ "--badge-index": index }}>
                  <CheckCircle2 size={15} />
                  {badge}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal className="hero-visual-card" delay={140} variant="scale-in">
            <div className="home-hero-visual">
              <img src="/assets/images/hero_banner.webp" alt="Vibrant yarn balls and craft accessories" fetchPriority="high" />
            </div>
            <div className="stock-card stock-card-one">
              <strong>12+ Categories</strong>
              <span>Yarns, threads, beads, bases</span>
            </div>
            <div className="stock-card stock-card-two">
              <strong>All India Delivery</strong>
              <span>Catalogue & bulk support</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Category Section */}
      <section className="section" id="categories">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Product Categories</p>
            <h2>Everything makers need for colourful handmade creations.</h2>
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

      {/* Shop by Craft / Use Case Section */}
      <section className="section section-tinted" id="shop-by-craft">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Shop by Craft</p>
            <h2>Find materials for your specific project</h2>
            <p>Select your favorite needlework or weaving hobby and browse tailored supplies.</p>
          </Reveal>
          <div className="card-grid use-cases-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {CRAFT_USE_CASES.map((craft, idx) => (
              <Reveal key={craft.name} delay={idx * 50} variant="fade-up">
                <Link to={`/products?tag=${craft.tag}`} className="craft-discovery-card" style={{ display: "block", background: "#fff", padding: "24px", borderRadius: "10px", border: "1px solid rgba(0,0,0,0.05)", textDecoration: "none", color: "inherit", transition: "transform 0.2s ease, box-shadow 0.2s ease" }}>
                  <div className="craft-card-icon" style={{ marginBottom: "16px", color: "var(--primary)" }}>
                    {craft.name === "Bag Making" ? <ShoppingBag size={28} /> : craft.name === "Macrame" ? <Scissors size={28} /> : <Sparkles size={28} />}
                  </div>
                  <h3 style={{ fontSize: "18px", marginBottom: "8px", fontWeight: "600" }}>{craft.name}</h3>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>{craft.desc}</p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: "600", color: "var(--primary)" }}>
                    Browse {craft.name} <ArrowRight size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Best Sellers Row */}
      <section className="section" id="best-sellers">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Best Sellers</p>
            <h2>Reseller & maker favorite products</h2>
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

      {/* How Enquiry Works Stepper */}
      <section className="section bg-dark text-light enquiry-how-it-works-home" style={{ background: "#211f1d", color: "#f5f0e8" }}>
        <div className="container">
          <Reveal className="section-heading text-center" variant="scale-in">
            <p className="eyebrow" style={{ color: "var(--primary)" }}>Order Flow</p>
            <h2 style={{ color: "#fff" }}>How the Enquiry Process Works</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", maxWidth: "560px", marginInline: "auto" }}>
              Since Fakhri Mart supplies custom wholesale orders and shade varieties, we process final payments and deliveries manually on WhatsApp.
            </p>
          </Reveal>
          
          <div className="how-it-works-timeline" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px", marginTop: "48px" }}>
            <div className="timeline-step">
              <span className="step-badge" style={{ display: "inline-flex", width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", color: "#fff", alignItems: "center", justifyContent: "center", fontWeight: "700", marginBottom: "16px" }}>1</span>
              <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#fff" }}>Add to Basket</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Browse our range of 12+ categories. Choose your desired shades and quantities, and add them to your client-side Enquiry Basket.</p>
            </div>
            <div className="timeline-step">
              <span className="step-badge" style={{ display: "inline-flex", width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", color: "#fff", alignItems: "center", justifyContent: "center", fontWeight: "700", marginBottom: "16px" }}>2</span>
              <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#fff" }}>Aggregate Quote</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>View your basket checklist on the Enquiry tab. Adjust quantities, review selected shades, and click "Submit Enquiry".</p>
            </div>
            <div className="timeline-step">
              <span className="step-badge" style={{ display: "inline-flex", width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", color: "#fff", alignItems: "center", justifyContent: "center", fontWeight: "700", marginBottom: "16px" }}>3</span>
              <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#fff" }}>WhatsApp Connect</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Your browser compile a clean summarized message with all products, quantities, and color codes, opening a direct chat with our team.</p>
            </div>
            <div className="timeline-step">
              <span className="step-badge" style={{ display: "inline-flex", width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", color: "#fff", alignItems: "center", justifyContent: "center", fontWeight: "700", marginBottom: "16px" }}>4</span>
              <h3 style={{ fontSize: "18px", marginBottom: "10px", color: "#fff" }}>Confirm & Deliver</h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>We will confirm exact stock availability, share verified digital shade cards on request, calculate final shipping quotes, and complete the order.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Catalogue Grid */}
      <section className="section" id="products">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Featured Catalogue</p>
            <h2>Featured products available for enquiry.</h2>
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

      {/* New Arrivals Section */}
      <section className="section section-tinted" id="new-arrivals">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">New Arrivals</p>
            <h2>Fresh craft materials to ask about this season.</h2>
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

      <section className="section bulk-section" id="bulk-orders">
        <div className="container bulk-layout">
          <Reveal className="bulk-copy" variant="slide-left">
            <p className="eyebrow">Bulk Orders</p>
            <h2>Need Yarn or Craft Materials in Bulk?</h2>
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

      <section className="section section-tinted" id="gallery">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Gallery</p>
            <h2>Craft materials organized for easy discovery.</h2>
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

      <section className="section about-band" id="about">
        <div className="container split-grid">
          <Reveal variant="slide-left">
            <p className="eyebrow">About Fakhri Mart</p>
            <h2>Colourful supplies for creators, boutiques, resellers and craft stores.</h2>
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

      <section className="section section-tinted" id="why-choose">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Why Choose Fakhri Mart</p>
            <h2>A catalogue experience built around trust and quick enquiries.</h2>
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

      <section className="section testimonials-section">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Customer Notes</p>
            <h2>Simple feedback from craft buyers.</h2>
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

      <section className="section enquiry-section" id="enquiry">
        <div className="container enquiry-layout">
          <Reveal variant="slide-left">
            <p className="eyebrow">Send Enquiry</p>
            <h2>Tell us what you need for your next creation.</h2>
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
