// src/components/ProductCard.jsx
// The product preview card. Real photography (no abstract div-art), palette identity strip,
// accessible interactive swatches with custom tooltip, soldAs label, real rating.
// Used in grids on Home and Catalogue.

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, GitCompare, MessageCircle, Star } from "lucide-react";
import { useWishlist } from "../hooks/useWishlist.js";
import { useCompare } from "../hooks/useCompare.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { cardHover, buttonTap } from "../lib/motion.js";

const MAX_SWATCHES = 5;

export function ProductCard({ product }) {
  const wishlist = useWishlist();
  const compare = useCompare();
  const basket = useEnquiryBasket();
  const isWishlisted = wishlist.has(product.slug);
  const isComparing = compare.has(product.slug);
  const inBasket = basket.has(product.slug);

  // Local swatch state — resets on scroll-out (preview affordance, not a selection)
  const [activeColor, setActiveColor] = useState(null);
  const [hoveredSwatch, setHoveredSwatch] = useState(null);
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

  const colorsToShow = (product.colors || []).slice(0, MAX_SWATCHES);
  const overflowCount = (product.colors?.length || 0) - MAX_SWATCHES;
  const soldAs = product.quantity?.soldAs || product.quantityOptions?.soldAs;
  const presets = product.quantity?.presets || product.quantityOptions?.presets || [];
  const bulkAvailable = presets.some((p) => p >= 50);

  // Active color image override — falls back to hero if no per-color image exists
  const activeColorSlug = activeColor?.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const activeImage =
    activeColorSlug && product.images?.colorImages?.[activeColorSlug]
      ? product.images.colorImages[activeColorSlug]
      : product.images?.hero;

  return (
    <motion.article
      ref={cardRef}
      className="product-card"
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      whileTap={buttonTap}
    >
      {/* Palette identity strip — 3px gradient from product.palette */}
      <div
        className="product-card-palette-strip"
        aria-hidden="true"
        style={{
          background: `linear-gradient(90deg, ${(product.palette || ["#E8DCC4"]).join(", ")})`,
        }}
      />

      {/* Floating action buttons */}
      <div className="product-card-actions">
        <button
          type="button"
          className={`pc-action ${isWishlisted ? "active" : ""}`}
          aria-pressed={isWishlisted}
          aria-label={isWishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); wishlist.toggle(product.slug); }}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
        <button
          type="button"
          className={`pc-action ${isComparing ? "active" : ""}`}
          aria-pressed={isComparing}
          aria-label={isComparing ? `Remove ${product.name} from compare` : `Add ${product.name} to compare`}
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); compare.toggle(product.slug); }}
        >
          <GitCompare size={16} />
        </button>
      </div>

      <Link to={`/products/${product.slug}`} className="product-card-link" aria-label={`View ${product.name}`}>
        <div className="product-card-visual">
          <img
            src={activeImage}
            alt={activeColor ? `${product.name} in ${activeColor.name}` : `${product.name} — ${product.description?.slice(0, 60)}`}
            loading="lazy"
            decoding="async"
            className="product-card-img"
          />
          <span className="product-card-stock" data-stock={product.stock}>
            {product.stock === "out" ? "Out of stock" : product.stock === "low" ? "Low stock" : "In stock"}
          </span>
        </div>

        <div className="product-card-body">
          <div className="product-card-name-row">
            <h3 className="product-card-name">{product.name}</h3>
            {product.rating > 0 && (
              <StarRating value={product.rating} count={product.reviewCount} size={11} />
            )}
          </div>

          <p className="product-card-desc">{product.description}</p>

          {/* Sold-per label (Prompt 2 Part 3) */}
          {soldAs && (
            <div className="product-card-sold-as">
              <span className="sold-as-label">Sold per {soldAs}</span>
              {bulkAvailable && <span className="bulk-hint">Bulk available</span>}
            </div>
          )}

          {/* Accessible interactive swatches with custom tooltip */}
          {colorsToShow.length > 0 && (
            <div className="product-card-swatches" role="group" aria-label={`Preview shades for ${product.name}`}>
              {colorsToShow.map((c) => (
                <SwatchButton
                  key={c.hex}
                  color={c}
                  isActive={activeColor?.name === c.name}
                  isHovered={hoveredSwatch === c.name}
                  onSelect={(col) => setActiveColor(col)}
                  onHover={(name) => setHoveredSwatch(name)}
                />
              ))}
              {overflowCount > 0 && (
                <span className="swatch-more" aria-label={`${overflowCount} more shades`}>+{overflowCount}</span>
              )}
            </div>
          )}
        </div>
      </Link>

      <div className="product-card-footer">
        <button
          type="button"
          className={`pc-enquire ${inBasket ? "in-basket" : ""}`}
          onClick={() =>
            basket.add({
              slug: product.slug,
              name: product.name,
              colorName: activeColor?.name,
              quantity: product.quantityOptions?.min || 1,
            })
          }
          whileTap={buttonTap}
        >
          <MessageCircle size={14} />
          {inBasket ? "In basket" : "Add to enquiry"}
        </button>
      </div>
    </motion.article>
  );
}

function SwatchButton({ color, isActive, isHovered, onSelect, onHover }) {
  const [focused, setFocused] = useState(false);
  const showTooltip = isHovered || focused;
  return (
    <button
      type="button"
      className={`swatch-btn ${isActive ? "selected" : ""}`}
      style={{ backgroundColor: color.hex }}
      aria-label={`Preview ${color.name}`}
      aria-pressed={isActive}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect(isActive ? null : color);
      }}
      onMouseEnter={() => onHover(color.name)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => { setFocused(true); onHover(color.name); }}
      onBlur={() => { setFocused(false); onHover(null); }}
    >
      {showTooltip && <span className="swatch-tooltip" role="tooltip">{color.name}</span>}
    </button>
  );
}

// Inline StarRating — compact, accessible, no interactivity.
function StarRating({ value = 0, count, size = 14 }) {
  const rounded = Math.round(value * 2) / 2;
  const full = Math.floor(rounded);
  const half = rounded - full >= 0.5;
  const ariaLabel = count ? `Rated ${value} out of 5 from ${count} reviews` : `Rated ${value} out of 5`;
  return (
    <span className="star-rating" role="img" aria-label={ariaLabel} style={{ display: "inline-flex", alignItems: "center", gap: "0.15em" }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        return (
          <span key={i} style={{ position: "relative", display: "inline-block", width: size, height: size }}>
            <Star size={size} strokeWidth={1.5} style={{ color: "var(--gold)", fill: "none", position: "absolute", inset: 0 }} aria-hidden="true" />
            {(isFull || isHalf) && (
              <Star size={size} strokeWidth={0} style={{ color: "var(--gold)", fill: "var(--gold)", position: "absolute", inset: 0, clipPath: isHalf ? "inset(0 50% 0 0)" : "none" }} aria-hidden="true" />
            )}
          </span>
        );
      })}
      {count != null && <span style={{ marginLeft: "0.4em", fontSize: "0.78em", color: "var(--muted)" }}>({count})</span>}
    </span>
  );
}
