// src/pages/ProductDetail.jsx
// Product detail — real photography with color-accurate shade previews, quantity info,
// related/bundle suggestions, wishlist/compare, WhatsApp enquiry-basket flow.
// Reuses real per-color images from public/assets/images/products/{slug}/color-*.webp.

import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle, ShoppingBag, Bell, Heart, GitCompare, Check } from "lucide-react";
import { ProductCard } from "../components/ProductCard.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { useJsonLd, productJsonLd, breadcrumbJsonLd } from "../hooks/useJsonLd.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { useCompare } from "../hooks/useCompare.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";
import {
  getProductBySlug,
  featuredProducts,
  businessInfo,
  createWhatsAppLink,
} from "../data/catalogue.js";
import { buttonTap } from "../lib/motion.js";
import { motion } from "framer-motion";

function StarRating({ value = 0, count }) {
  const rounded = Math.round(value * 2) / 2;
  const full = Math.floor(rounded);
  const half = rounded - full >= 0.5;
  return (
    <span className="star-rating" role="img" aria-label={`Rated ${value} out of 5 from ${count} reviews`} style={{ display: "inline-flex", alignItems: "center", gap: "0.15em" }}>
      {[0,1,2,3,4].map((i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        return (
          <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={isFull || isHalf ? "var(--gold)" : "none"} stroke="var(--gold)" strokeWidth="1.5" style={{ clipPath: isHalf ? "inset(0 50% 0 0)" : "none" }}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
      {count != null && <span style={{ marginLeft: "0.4em", fontSize: "0.85em", color: "var(--muted)" }}>({count})</span>}
    </span>
  );
}

export default function ProductDetail() {
  const { slug } = useParams();
  const product = useMemo(() => getProductBySlug(slug), [slug]);
  const basket = useEnquiryBasket();
  const wishlist = useWishlist();
  const compare = useCompare();
  const recentlyViewed = useRecentlyViewed();

  useDocumentMeta({
    title: product ? product.name : "Product not found",
    description: product?.description,
    canonical: product ? `${businessInfo.url}/products/${product.slug}` : undefined,
    type: "product",
  });

  const canonicalUrl = product ? `${businessInfo.url}/products/${product.slug}` : "";
  useJsonLd(product ? productJsonLd(product, canonicalUrl) : null);
  useJsonLd(
    breadcrumbJsonLd([
      { name: "Home", url: businessInfo.url },
      { name: "Shop", url: `${businessInfo.url}/products` },
      { name: product?.name, url: canonicalUrl },
    ])
  );

  const [activeColor, setActiveColor] = useState(product?.colors?.[0] || null);
  const [quantity, setQuantity] = useState(product?.quantityOptions?.min || 1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  useEffect(() => {
    if (product) recentlyViewed.push(product.slug);
  }, [product?.slug]);

  useEffect(() => {
    setActiveColor(product?.colors?.[0] || null);
    setQuantity(product?.quantityOptions?.min || 1);
    setActiveImageIdx(0);
  }, [product]);

  if (!product) {
    return (
      <div className="container" style={{ padding: "var(--space-20) 0", textAlign: "center" }}>
        <h1>Product not found</h1>
        <Link to="/products" className="btn btn-primary">Back to shop</Link>
      </div>
    );
  }

  // Build image gallery: hero + gallery images + per-color images
  const galleryImages = [
    { src: product.images.hero, label: product.name },
    ...(product.images.gallery || []).map((g, i) => ({ src: g, label: `${product.name} — view ${i + 1}` })),
  ];
  // Override with active color image if available
  const activeColorSlug = activeColor?.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const activeImage =
    activeColorSlug && product.images.colorImages?.[activeColorSlug]
      ? product.images.colorImages[activeColorSlug]
      : galleryImages[activeImageIdx]?.src;

  const inBasket = basket.has(product.slug);
  const isOutOfStock = product.stock === "out";

  const enquireMessage = `Hello ${businessInfo.shortName}, I'd like to enquire about:\n\n• ${product.name}\n${activeColor ? `   Shade: ${activeColor.name}\n` : ""}   Qty: ${quantity} ${product.quantityOptions?.unit || "pcs"}\n\nPlease share availability and pricing. Thank you!`;
  const notifyMessage = `Hello ${businessInfo.shortName}, I'd like to be notified when "${product.name}"${activeColor ? ` (shade: ${activeColor.name})` : ""} is back in stock. Thank you!`;

  // Related + bundle products
  const relatedProducts = (product.relatedSlugs || [])
    .map((s) => getProductBySlug(s))
    .filter(Boolean)
    .slice(0, 4);
  const bundleProducts = (product.bundleWith || [])
    .map((s) => getProductBySlug(s))
    .filter(Boolean);

  // Recently viewed (exclude self)
  const recentlyViewedProducts = recentlyViewed
    .others(product.slug)
    .map((s) => getProductBySlug(s))
    .filter(Boolean)
    .filter((p) => p.slug !== product.slug)
    .slice(-4);

  return (
    <div className="product-detail-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">›</span>
          <Link to="/products">Shop</Link>
          <span aria-hidden="true">›</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-grid">
          {/* Gallery */}
          <div className="product-gallery">
            <div className="product-gallery-main">
              <img
                src={activeImage}
                alt={`${product.name}${activeColor ? ` in ${activeColor.name}` : ""}`}
                className="product-gallery-hero-img"
                fetchPriority="high"
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="product-gallery-thumbs">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`gallery-thumb ${activeImageIdx === i && !activeColorSlug ? "active" : ""}`}
                    onClick={() => { setActiveImageIdx(i); setActiveColor(null); }}
                    aria-label={`View image ${i + 1}`}
                  >
                    <img src={img.src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-info">
            <div className="product-info-header">
              <span className="product-master-cat">{product.masterCategory}</span>
              <h1>{product.name}</h1>
              <div className="product-meta">
                {product.rating > 0 && <StarRating value={product.rating} count={product.reviewCount} />}
                <span className="product-brand">· {product.brand}</span>
              </div>
            </div>

            <p className="product-long-desc">{product.description}</p>

            {/* Honest stock indicator */}
            <div className="product-stock" data-stock={product.stock}>
              {product.stock === "out" ? "Currently out of stock" : product.stock === "low" ? "Low stock — enquire to confirm" : "In stock — enquire to confirm"}
            </div>

            {/* Color picker — real per-color image swap */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-section">
                <h3 className="product-section-title">
                  Shade: <strong>{activeColor?.name || "Select"}</strong>
                </h3>
                <div className="color-picker" role="radiogroup" aria-label="Select shade">
                  {product.colors.map((c) => {
                    const colorSlug = c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                    const hasImage = !!product.images.colorImages?.[colorSlug];
                    return (
                      <button
                        key={c.hex}
                        type="button"
                        className={`color-swatch ${activeColor?.hex === c.hex ? "selected" : ""}`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => setActiveColor(c)}
                        role="radio"
                        aria-checked={activeColor?.hex === c.hex}
                        aria-label={`${c.name}${hasImage ? " (preview available)" : ""}`}
                        title={c.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="product-section">
              <h3 className="product-section-title">
                Quantity: <strong>{quantity} {product.quantityOptions?.unit || "pcs"}</strong>
              </h3>
              <div className="quantity-stepper">
                <button type="button" onClick={() => setQuantity((q) => Math.max(product.quantityOptions?.min || 1, q - 1))} disabled={quantity <= (product.quantityOptions?.min || 1)} aria-label="Decrease quantity">−</button>
                <input
                  type="text"
                  inputMode="numeric"
                  value={quantity}
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^0-9]/g, "");
                    setQuantity(v ? Math.max(product.quantityOptions?.min || 1, parseInt(v, 10)) : product.quantityOptions?.min || 1);
                  }}
                  aria-label="Quantity"
                />
                <button type="button" onClick={() => setQuantity((q) => q + 1)} aria-label="Increase quantity">+</button>
              </div>
              <div className="quantity-presets">
                {(product.quantityOptions?.presets || []).map((p) => (
                  <button key={p} type="button" className={`qty-preset ${quantity === p ? "active" : ""}`} onClick={() => setQuantity(p)}>
                    {p}
                  </button>
                ))}
              </div>
              <p className="sold-as-note">Sold per {product.quantityOptions?.soldAs}</p>
            </div>

            {/* CTA row */}
            <div className="product-cta-row">
              <a href={createWhatsAppLink(enquireMessage)} target="_blank" rel="noreferrer noopener" className="btn btn-whatsapp btn-large">
                <MessageCircle size={18} /> Enquire on WhatsApp
              </a>
              <button
                type="button"
                className={`btn btn-outline btn-large ${inBasket ? "btn-success" : ""}`}
                onClick={() => basket.add({ slug: product.slug, name: product.name, colorName: activeColor?.name, quantity })}
                whileTap={buttonTap}
              >
                {inBasket ? <Check size={18} /> : <ShoppingBag size={18} />}
                {inBasket ? "In basket" : "Add to enquiry"}
              </button>
              <button
                type="button"
                className={`btn-icon ${wishlist.has(product.slug) ? "active" : ""}`}
                onClick={() => wishlist.toggle(product.slug)}
                aria-pressed={wishlist.has(product.slug)}
                aria-label={wishlist.has(product.slug) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={wishlist.has(product.slug) ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                className={`btn-icon ${compare.has(product.slug) ? "active" : ""}`}
                onClick={() => compare.toggle(product.slug)}
                aria-pressed={compare.has(product.slug)}
                aria-label={compare.has(product.slug) ? "Remove from compare" : "Add to compare"}
              >
                <GitCompare size={18} />
              </button>
            </div>

            {/* Notify-me for out-of-stock */}
            {isOutOfStock && (
              <div className="notify-me">
                <Bell size={18} />
                <div>
                  <strong>Notify me on WhatsApp</strong>
                  <small>We'll personally follow up when this shade is back. Manual follow-up, not automated.</small>
                </div>
                <a href={createWhatsAppLink(notifyMessage)} target="_blank" rel="noreferrer noopener" className="btn btn-secondary btn-small">Notify me</a>
              </div>
            )}

            {/* Honest shipping note (replaces fake PincodeChecker) */}
            <p className="shipping-note">We ship pan-India. Typical transit 3–5 business days. Confirm exact timing for your area on WhatsApp.</p>
          </div>
        </div>

        {/* Bundle suggestions */}
        {bundleProducts.length > 0 && (
          <Reveal>
            <section className="related-section">
              <h2>Frequently enquired together</h2>
              <p>Makers often pair these — add them all to your enquiry at once.</p>
              <div className="related-grid">
                {bundleProducts.map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  basket.add({ slug: product.slug, name: product.name, colorName: activeColor?.name, quantity });
                  bundleProducts.forEach((bp) => basket.add({ slug: bp.slug, name: bp.name, quantity: bp.quantityOptions?.min || 1 }));
                }}
              >
                <ShoppingBag size={16} /> Add all to enquiry basket
              </button>
            </section>
          </Reveal>
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <Reveal>
            <section className="related-section">
              <h2>People also enquired</h2>
              <div className="related-grid">
                {relatedProducts.map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
            </section>
          </Reveal>
        )}

        {/* Recently viewed */}
        {recentlyViewedProducts.length > 0 && (
          <Reveal>
            <section className="related-section">
              <h2>Recently viewed</h2>
              <div className="related-grid">
                {recentlyViewedProducts.map((p) => <ProductCard key={p.slug} product={p} />)}
              </div>
            </section>
          </Reveal>
        )}
      </div>
    </div>
  );
}
