import { MessageCircle, Tags, Heart, ArrowUpDown, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { createWhatsAppLink, productCategories } from "../data/siteData.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { useCompare } from "../hooks/useCompare.js";

export default function ProductCard({ product, compact = false }) {
  const message = `Hello Fakhri Mart, I want to ask price for *${product.name}*. Please share availability, shade options and bulk pricing details.`;
  const categoryData = productCategories.find((c) => c.name === product.category);
  const productBaseImage = product.image || categoryData?.image;

  const { has: isInWishlist, toggle: toggleWishlist } = useWishlist();
  const { has: isInCompare, toggle: toggleCompare } = useCompare();

  const isFavorited = isInWishlist(product.slug);
  const isCompared = isInCompare(product.slug);

  return (
    <article className={`product-card ${compact ? "product-card--compact" : ""} ${isCompared ? "product-card--compared" : ""}`}>
      <div className="product-card-link-wrapper-container" style={{ position: "relative" }}>
        {/* Floating Quick Action Buttons on Image */}
        <div className="product-card-floating-actions" style={{ position: "absolute", top: "10px", left: "10px", right: "10px", zIndex: 10, display: "flex", justifyContent: "space-between", pointerEvents: "auto" }}>
          {/* Compare Toggle */}
          <button
            type="button"
            className={`card-floating-btn compare-toggle-btn-card ${isCompared ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product.slug);
            }}
            title={isCompared ? "Remove from comparison" : "Add to comparison"}
            aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer", transition: "all 0.2s ease" }}
          >
            {isCompared ? <Check size={15} /> : <ArrowUpDown size={15} />}
          </button>

          {/* Favorite Toggle */}
          <button
            type="button"
            className={`card-floating-btn favorite-toggle-btn-card ${isFavorited ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product.slug);
            }}
            title={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={isFavorited ? "Remove from Favorites" : "Add to Favorites"}
            style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "32px", height: "32px", borderRadius: "50%", border: "none", cursor: "pointer", transition: "all 0.2s ease" }}
          >
            <Heart size={16} fill={isFavorited ? "var(--accent-rose, #e05c75)" : "none"} stroke={isFavorited ? "var(--accent-rose, #e05c75)" : "currentColor"} />
          </button>
        </div>

        <Link to={`/products/${product.slug}`} className="product-card-link-wrapper">
          {productBaseImage && (
            <div className="product-image-wrapper" style={{ position: "relative" }}>
              <img src={productBaseImage} alt={product.name} loading="lazy" className="product-image" />
              <span className="product-card-badge-floating">{product.category}</span>
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
            
            {/* Color swatches preview row */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-card-swatches" aria-label="Available shades preview">
                <div className="swatch-dots-row">
                  {product.colors.slice(0, 5).map((color) => (
                    <span
                      key={color.hex}
                      className="swatch-dot"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                  {product.colors.length > 5 && (
                    <span className="swatch-more-tag">+{product.colors.length - 5}</span>
                  )}
                </div>
                <span className="swatches-count-label">{product.colors.length} Shades</span>
              </div>
            )}

            <p className="product-card-variants">{product.variants}</p>
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
          <Tags size={16} />
          Details
        </Link>
        <a 
          className="btn btn-whatsapp btn-small" 
          href={createWhatsAppLink(message)} 
          target="_blank" 
          rel="noreferrer"
        >
          <MessageCircle size={16} />
          Enquire
        </a>
      </div>
    </article>
  );
}

