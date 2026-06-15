import { MessageCircle, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { createWhatsAppLink, productCategories } from "../data/siteData.js";

export default function ProductCard({ product, compact = false }) {
  const message = `Hello Fakhri Mart, I want to ask price for *${product.name}*. Please share availability, shade options and bulk pricing details.`;
  const categoryData = productCategories.find((c) => c.name === product.category);
  const productBaseImage = product.image || categoryData?.image;

  return (
    <article className={`product-card ${compact ? "product-card--compact" : ""}`}>
      <Link to={`/products/${product.slug}`} className="product-card-link-wrapper">
        {productBaseImage && (
          <div className="product-image-wrapper">
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
      <div className="product-actions" onClick={(e) => e.stopPropagation()}>
        <Link to={`/products/${product.slug}`} className="btn btn-outline btn-small">
          <Tags size={16} />
          View Details
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

