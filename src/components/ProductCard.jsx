import { Camera, ChatCircle, ClipboardText, Heart, Tag } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { createWhatsAppLink, productCategories } from "../data/siteData.js";
import { useWishlist } from "../hooks/useWishlist.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { smartWhatsAppLink } from "../i18n.jsx";
import { trackEngagement } from "../lib/engagementAnalytics.js";
import CompareButton from "./CompareButton.jsx";

const MAX_SWATCHES_ON_CARD = 5;

function getDefaultVariant(product) {
  if (product.slug === "t-shirt-yarn") return "250gm";
  if (product.slug.includes("macrame-cord")) return "3MM";
  if (product.slug === "crochet-hook") return "2.0mm";
  return null;
}

export default function ProductCard({ product, compact = false, showWishlistAction = true }) {
  const categoryData = productCategories.find((category) => category.name === product.category);
  const productBaseImage = product.image || categoryData?.image || null;
  const [imageSrc, setImageSrc] = useState(productBaseImage);
  const [activeColor, setActiveColor] = useState(null);
  const [hoveredSwatch, setHoveredSwatch] = useState(null);
  const [added, setAdded] = useState(false);
  const { has: isInWishlist, toggle: toggleWishlist } = useWishlist();
  const { add: addToBasket } = useEnquiryBasket();
  const isFavorited = isInWishlist(product.slug);

  useEffect(() => {
    setImageSrc(productBaseImage);
    setActiveColor(null);
    setHoveredSwatch(null);
    setAdded(false);
  }, [product.slug, productBaseImage]);

  const enquireLink = smartWhatsAppLink({
    type: "product-card",
    productName: product.name,
    category: product.category,
    shade: activeColor?.name,
  });

  const photoLink = createWhatsAppLink(
    `Hello Fakhri Mart, I am interested in *${product.name}*${activeColor ? `, especially the *${activeColor.name}* shade` : ""}. Please send me a current product/batch photo and the latest available shade photo/card before I decide. Thank you!`,
  );

  const colorsToShow = (product.colors || []).slice(0, MAX_SWATCHES_ON_CARD);
  const overflowCount = Math.max(0, (product.colors?.length || 0) - MAX_SWATCHES_ON_CARD);
  const soldAs = product.quantityOptions?.soldAs;
  const presets = product.quantityOptions?.presets || [];
  const bulkAvailable = presets.some((preset) => preset >= 50) || (product.tags || []).includes("Bulk Orders");

  const addDefaultToBasket = () => {
    addToBasket({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: productBaseImage || "",
      shade: activeColor || product.colors?.[0] || null,
      quantity: product.quantityOptions?.min || 1,
      unit: product.quantityOptions?.unit || "pcs",
      variant: getDefaultVariant(product),
      note: activeColor ? `Selected ${activeColor.name} from catalogue card; please confirm current shade.` : "Please confirm current shade and availability.",
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
    trackEngagement("enquiry_added", { product: product.slug, category: product.category, shade: activeColor?.name || "default", source: "product-card" });
  };

  const handleImageError = () => {
    if (categoryData?.image && imageSrc !== categoryData.image) {
      setImageSrc(categoryData.image);
      return;
    }
    setImageSrc(null);
  };

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleWishlist(product.slug);
    trackEngagement(isFavorited ? "wishlist_removed" : "wishlist_saved", { product: product.slug, category: product.category, source: "product-card" });
  };

  return (
    <article className={`product-card ${compact ? "product-card--compact" : ""}`}>
      <div className="product-card-palette-strip" aria-hidden="true" style={{ background: `linear-gradient(90deg, ${(product.palette || ["#E8DCC4"]).join(", ")})` }} />

      <div className="product-card-link-wrapper-container">
        <div className="product-card-floating-actions">
          {showWishlistAction ? (
            <button
              type="button"
              className={`card-floating-btn favorite-toggle-btn-card ${isFavorited ? "active" : ""}`}
              onClick={handleWishlist}
              aria-label={isFavorited ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              aria-pressed={isFavorited}
            >
              <Heart size={16} weight={isFavorited ? "fill" : "regular"} aria-hidden="true" />
            </button>
          ) : null}
          <CompareButton product={product} compact />
        </div>

        <div className="product-card-link-wrapper">
          <Link
            to={`/products/${product.slug}`}
            className="product-card-image-link"
            aria-label={`View details for ${product.name}`}
            onClick={() => trackEngagement("product_view_click", { product: product.slug, category: product.category, source: "product-card" })}
          >
            <div className={`product-image-wrapper ${!imageSrc ? "is-missing-image" : ""}`}>
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={`Representative ${product.category} material photograph for ${product.name}`}
                  width="640"
                  height="640"
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="product-image"
                  onError={handleImageError}
                />
              ) : <span className="product-image-placeholder" aria-hidden="true">FM</span>}
              <span className="product-card-badge-floating">Representative photo</span>
            </div>
          </Link>

          <div className="product-content">
            <div className="product-card-topline">
              <div className="product-badges" aria-label="Product highlights">
                {(product.badges || ["Catalogue"]).slice(0, 2).map((badge) => <span key={badge} className="badge-highlight">{badge}</span>)}
              </div>
            </div>

            <h3 className="product-card-title"><Link to={`/products/${product.slug}`}>{product.name}</Link></h3>

            {product.colors?.length ? (
              <div className="product-card-swatches" aria-label={`Representative shades: ${product.colors.length} options`}>
                <div className="swatch-dots-row">
                  {colorsToShow.map((color) => (
                    <SwatchButton
                      key={`${product.slug}-${color.name}`}
                      color={color}
                      isActive={activeColor?.name === color.name}
                      isHovered={hoveredSwatch === color.name}
                      onSelect={(next) => {
                        setActiveColor(next);
                        if (next) trackEngagement("shade_selected", { product: product.slug, shade: next.name, source: "product-card" });
                      }}
                      onHover={setHoveredSwatch}
                    />
                  ))}
                  {overflowCount > 0 ? <span className="swatch-more-tag" aria-hidden="true">+{overflowCount}</span> : null}
                </div>
                <span className="swatches-count-label">{activeColor?.name || `${product.colors.length} representative shades`}</span>
              </div>
            ) : null}

            <p className="product-card-variants">{product.variants}</p>
            {soldAs ? <div className="product-card-sold-as"><span>Listed as {soldAs}</span>{bulkAvailable ? <em>Bulk enquiries welcome</em> : null}</div> : null}
            <dl className="product-card-specs"><div><dt>Best for:</dt><dd>{product.suitableFor}</dd></div></dl>
          </div>
        </div>
      </div>

      <div className="product-actions">
        <Link to={`/products/${product.slug}`} className="btn btn-outline btn-small"><Tag size={16} aria-hidden="true" /> Details</Link>
        <button className={`btn btn-primary btn-small ${added ? "btn-success" : ""}`} type="button" onClick={addDefaultToBasket}><ClipboardText size={16} aria-hidden="true" /> {added ? "Added" : "Add to enquiry"}</button>
        <a
          className="btn btn-whatsapp btn-small"
          href={enquireLink}
          target="_blank"
          rel="noreferrer"
          aria-label={`Ask about ${product.name}${activeColor ? ` in ${activeColor.name}` : ""} on WhatsApp`}
          onClick={() => trackEngagement("whatsapp_click", { product: product.slug, category: product.category, shade: activeColor?.name || "none", source: "product-card" })}
        >
          <ChatCircle size={16} aria-hidden="true" /> {activeColor ? `Ask about ${activeColor.name}` : "Ask price & availability"}
        </a>
      </div>

      <div className="product-card-secondary-actions">
        <a
          href={photoLink}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEngagement("current_photo_request", { product: product.slug, shade: activeColor?.name || "none", source: "product-card" })}
        >
          <Camera size={14} aria-hidden="true" /> {activeColor ? `Request current ${activeColor.name} photo` : "Request current photos"}
        </a>
      </div>
    </article>
  );
}

function SwatchButton({ color, isActive, isHovered, onSelect, onHover }) {
  const [focused, setFocused] = useState(false);
  const showTooltip = isHovered || focused;
  return (
    <button
      type="button"
      className={`swatch-dot swatch-dot-button ${isActive ? "selected" : ""}`}
      style={{ backgroundColor: color.hex }}
      aria-label={`${isActive ? "Deselect" : "Select"} representative ${color.name} shade for enquiry`}
      aria-pressed={isActive}
      onClick={(event) => { event.preventDefault(); event.stopPropagation(); onSelect(isActive ? null : color); }}
      onMouseEnter={() => onHover(color.name)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => { setFocused(true); onHover(color.name); }}
      onBlur={() => { setFocused(false); onHover(null); }}
    >
      {showTooltip ? <span role="tooltip" className="swatch-tooltip">{color.name} · confirm current shade</span> : null}
    </button>
  );
}
