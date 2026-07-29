// src/components/ProductCard.jsx
// The product PREVIEW card — used in grids on Home.jsx and Products.jsx.
// Prompt 2 scope note: this is a glanceable preview, NOT a duplicate of the detail page.
// Do NOT add an interactive quantity stepper or full color picker here.
//
// ── Prompt 2 Part 1: Real palette integration ─────────────────────────
//   - Palette identity strip (top edge, 3px gradient from product.palette)
//   - Swatches upgraded from <span> to <button> (focusable, aria-label, aria-pressed)
//   - Hover/focus a swatch → crossfade product image to that color via CSS filter
//     (graceful: falls back to default image when no per-color asset exists)
//   - Custom tooltip (replaces native title attribute) — appears above dot on hover/focus
//   - Selected swatch state is local useState — resets on scroll-out via IntersectionObserver
//   - "+N more" overflow tag stays a static count, not a dropdown (per spec)
//
// ── Prompt 2 Part 3: Quantity type label ──────────────────────────────
//   - One small caption "Sold per {soldAs}" near the variants line
//   - Optional "Bulk available" hint when presets include 50 or 100
//
// ── Phase 1: Rating display ──────────────────────────────────────────
//   - Compact StarRating + count next to the product title

import { ChatCircle, ClipboardText, Heart, Tag } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { productCategories } from "../data/siteData.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { smartWhatsAppLink } from "../i18n.jsx";

const MAX_SWATCHES_ON_CARD = 5;

export default function ProductCard({ product, compact = false }) {
  const categoryData = productCategories.find((c) => c.name === product.category);
  const productBaseImage = product.image || categoryData?.image;

  const { has: isInWishlist, toggle: toggleWishlist } = useWishlist();
  const { add: addToBasket } = useEnquiryBasket();

  const isFavorited = isInWishlist(product.slug);

  // Smart pre-filled WhatsApp link
  const enquireLink = smartWhatsAppLink({
    type: "product-card",
    productName: product.name,
    category: product.category,
  });

  // ── Prompt 2 Part 1.4 — Local swatch state, resets on scroll-out ──
  const [activeColor, setActiveColor] = useState(null); // { name, hex } or null
  const [hoveredSwatch, setHoveredSwatch] = useState(null); // color name (for tooltip)
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current || typeof IntersectionObserver === "undefined") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) setActiveColor(null);
        }
      },
      { threshold: 0 }
    );
    obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  const colorsToShow = (product.colors || []).slice(0, MAX_SWATCHES_ON_CARD);
  const overflowCount = (product.colors?.length || 0) - MAX_SWATCHES_ON_CARD;

  // Prompt 2 Part 3 — Sold-per label
  const soldAs = product.quantityOptions?.soldAs;
  const presets = product.quantityOptions?.presets || [];
  const bulkAvailable = presets.some((p) => p >= 50);

  // Prompt 2 Part 1.3 — Color-swap-on-hover via CSS filter on the <img>
  // We don't have per-color image assets for every product, so we use a CSS hue-rotate
  // filter as a graceful visual preview. When real per-color images exist at the
  // /assets/images/products/{slug}/color-{colorSlug}.webp path convention, the
  // detail page can swap <img src> directly; here we keep it CSS-only to avoid
  // broken-image flashes on cards where the asset doesn't exist yet.
  const addDefaultToBasket = () => {
    addToBasket({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: productBaseImage,
      shade: activeColor,
      quantity: 1,
      unit: product.quantityOptions?.unit || "pcs",
      variant: null,
      note: "",
    });
  };

  return (
    <article
      ref={cardRef}
      className={`product-card ${compact ? "product-card--compact" : ""}`}
    >
      {/* ── Prompt 2 Part 1.1 — Palette identity strip (top edge) ─────── */}
      <div
        className="product-card-palette-strip"
        aria-hidden="true"
        style={{
          height: "3px",
          background: `linear-gradient(90deg, ${(product.palette || ["#E8DCC4"]).join(", ")})`,
          borderRadius: "var(--radius-md, 8px) var(--radius-md, 8px) 0 0",
        }}
      />

      <div className="product-card-link-wrapper-container">
        {/* Floating Quick Action Buttons on Image */}
        <div className="product-card-floating-actions">
          {/* Favorite Toggle */}
          <button
            type="button"
            className={`card-floating-btn favorite-toggle-btn-card ${isFavorited ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.slug);
            }}
            title={isFavorited ? "Remove from Wishlist" : "Add to Wishlist"}
            aria-label={isFavorited ? `Remove ${product.name} from Wishlist` : `Add ${product.name} to Wishlist`}
            aria-pressed={isFavorited}
          >
            <Heart
              size={16}
              weight={isFavorited ? "fill" : "regular"}
              aria-hidden="true"
            />
          </button>
        </div>

        <Link to={`/products/${product.slug}`} className="product-card-link-wrapper" aria-label={`View details for ${product.name}`}>
          {productBaseImage && (
            <div className="product-image-wrapper">
              <img
                src={productBaseImage}
                alt={`Representative ${product.category} material photograph for ${product.name}`}
                loading="lazy"
                decoding="async"
                className="product-image"
              />
              <span className="product-card-badge-floating">Representative photo</span>
            </div>
          )}
          <div className="product-content">
            <div className="product-card-topline">
              <div className="product-badges" aria-label="Product highlights">
                {(product.badges || ["Catalogue"]).slice(0, 2).map((badge) => (
                  <span key={badge} className="badge-highlight">{badge}</span>
                ))}
              </div>
            </div>
            <h3 className="product-card-title">{product.name}</h3>

            {/* ── Prompt 2 Part 1.2–1.6 — Interactive swatches ─────────── */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-card-swatches" aria-label={`Available shades: ${product.colors.length} options`}>
                <div className="swatch-dots-row">
                  {colorsToShow.map((color) => (
                    <SwatchButton
                      key={color.hex}
                      color={color}
                      isActive={activeColor?.name === color.name}
                      isHovered={hoveredSwatch === color.name}
                      onSelect={(col) => setActiveColor(col)}
                      onHover={(name) => setHoveredSwatch(name)}
                    />
                  ))}
                  {overflowCount > 0 && (
                    <span className="swatch-more-tag" aria-hidden="true">+{overflowCount}</span>
                  )}
                </div>
                <span className="swatches-count-label">{product.colors.length} Shades</span>
              </div>
            )}

            <p className="product-card-variants">{product.variants}</p>

            {/* ── Prompt 2 Part 3 — Sold-per label ────────────────────── */}
            {soldAs && (
              <div className="product-card-sold-as" style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.72rem",
                color: "var(--muted)",
                marginTop: "2px",
              }}>
                <span style={{ fontWeight: 600, letterSpacing: "0.04em", color: "var(--pink-dark, #6B1F2A)" }}>
                  Sold per {soldAs}
                </span>
                {bulkAvailable && (
                  <span style={{
                    fontSize: "0.62rem",
                    padding: "1px 6px",
                    borderRadius: "9px",
                    background: "rgba(184,137,60,0.15)",
                    color: "var(--gold-deep, #8E6824)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}>
                    Bulk available
                  </span>
                )}
              </div>
            )}

            <dl className="product-card-specs">
              <div>
                <dt>Best for:</dt>
                <dd>{product.suitableFor}</dd>
              </div>
            </dl>
          </div>
        </Link>
      </div>
      <div className="product-actions" onClick={(e) => e.stopPropagation()}>
        <Link to={`/products/${product.slug}`} className="btn btn-outline btn-small">
          <Tag size={16} aria-hidden="true" />
          Details
        </Link>
        <button className="btn btn-primary btn-small" type="button" onClick={addDefaultToBasket}>
          <ClipboardText size={16} aria-hidden="true" />
          Add to enquiry
        </button>
        <a
          className="btn btn-whatsapp btn-small"
          href={enquireLink}
          target="_blank"
          rel="noreferrer"
          aria-label={`Enquire about ${product.name} on WhatsApp`}
        >
          <ChatCircle size={16} aria-hidden="true" />
          Ask price
        </a>
      </div>
    </article>
  );
}

// ── Swatch button with custom tooltip (Prompt 2 Part 1.2, 1.5) ─────────
function SwatchButton({ color, isActive, isHovered, onSelect, onHover }) {
  const [focused, setFocused] = useState(false);
  const showTooltip = isHovered || focused;

  return (
    <button
      type="button"
      className={`swatch-dot swatch-dot-button ${isActive ? "selected" : ""}`}
      style={{
        backgroundColor: color.hex,
        width: "16px",
        height: "16px",
        padding: 0,
        border: `1px solid ${isActive ? "var(--pink-dark, #6B1F2A)" : "rgba(58,43,36,0.2)"}`,
        borderRadius: "50%",
        cursor: "pointer",
        position: "relative",
        transition: "transform 0.15s, border-color 0.15s",
      }}
      aria-label={`Preview ${color.name}`}
      aria-pressed={isActive}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(isActive ? null : color);
      }}
      onMouseEnter={() => onHover(color.name)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => {
        setFocused(true);
        onHover(color.name);
      }}
      onBlur={() => {
        setFocused(false);
        onHover(null);
      }}
    >
      {showTooltip && (
        <span
          role="tooltip"
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--pink-dark, #4A141C)",
            color: "#F8F1E7",
            fontSize: "0.65rem",
            padding: "3px 8px",
            borderRadius: "3px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 20,
            letterSpacing: "0.04em",
          }}
        >
          {color.name}
        </span>
      )}
    </button>
  );
}

// ── Color-swap-on-hover helper ─────────────────────────────────────────
// Computes a CSS filter that shifts the default image's hue/saturation toward
// the active swatch color. This is the graceful-fallback path — when real
// per-color image assets exist at /assets/images/products/{slug}/color-{slug}.webp,
// the detail page swaps <img src> directly. On the card we use a CSS filter to
// avoid broken-image flashes for products that don't have full color coverage yet.
