import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/fakhri-mart-logo.webp";
import CatalogueCta from "../components/CatalogueCta.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import EnquiryForm from "../components/EnquiryForm.jsx";
import GalleryVisual from "../components/GalleryVisual.jsx";
import IconBadge from "../components/IconBadge.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
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
  trustBadges,
  whyChooseUs,
} from "../data/siteData.js";

const heroWords = "Colourful Yarns, Threads & Accessories Delivered Across India".split(" ");

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("All");

  const visibleProducts = useMemo(() => {
    if (activeFilter === "All") return featuredProducts;
    return featuredProducts.filter((product) => product.filters.includes(activeFilter));
  }, [activeFilter]);

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
            <h1 className="hero-title" aria-label="Colourful Yarns, Threads and Accessories Delivered Across India">
              {heroWords.map((word, index) => (
                <span key={`${word}-${index}`} style={{ "--word-index": index }}>
                  {word}
                </span>
              ))}
            </h1>
            <p className="hero-subtitle hero-sequence hero-sequence-subtitle">
              Explore quality yarns, crochet threads, macrame cords, embroidery threads, beads,
              purse accessories, bases, handles, hooks and craft essentials for makers, boutiques,
              resellers and wholesale buyers.
            </p>
            <div className="button-row hero-sequence hero-sequence-actions">
              <a className="btn btn-primary" href="#categories">
                Explore Products
                <ArrowRight size={18} />
              </a>
              <a className="btn btn-whatsapp" href={createWhatsAppLink(bulkMessage)} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                Get Bulk Price on WhatsApp
              </a>
              <Link className="btn btn-outline" to="/enquiry">
                <FileText size={18} />
                Request Catalogue
              </Link>
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
            <div className="hero-logo-medallion">
              <img src={logo} alt="Fakhri Mart logo with yarn basket" />
            </div>
            <ProductVisual palette={["#35b8ad", "#f6a7b8", "#f3c65f"]} />
            <div className="stock-card stock-card-one">
              <strong>12+ Categories</strong>
              <span>Yarns, threads, beads, bases</span>
            </div>
            <div className="stock-card stock-card-two">
              <strong>All India Delivery</strong>
              <span>Catalogue and bulk support</span>
            </div>
            <div className="floating-material-card">
              <Sparkles size={18} />
              <span>Shade details on request</span>
            </div>
          </Reveal>
        </div>
      </section>

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
            {productCategories.map((category, index) => (
              <Reveal key={category.name} delay={(index % 4) * 65} variant="fade-up">
                <CategoryCard category={category} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted" id="products">
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
        </div>
      </section>

      <section className="section" id="new-arrivals">
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
              <MessageCircle size={18} />
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
              <MessageCircle size={18} />
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
