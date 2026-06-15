import { MessageCircle, Tags } from "lucide-react";
import { Link } from "react-router-dom";
import { createWhatsAppLink, productCategories } from "../data/siteData.js";

export default function ProductCard({ product, compact = false }) {
  const message = `Hello Fakhri Mart, I want to ask price for ${product.name}. Please share availability, shade options and bulk pricing details.`;
  const categoryData = productCategories.find((c) => c.name === product.category);
  const imageUrl = categoryData?.image;

  return (
    <article className={`product-card ${compact ? "product-card--compact" : ""}`}>
      <Link to={`/products/${product.slug}`} className="product-card-link-wrapper">
        {(() => {
          const productBaseImage = product.image || categoryData?.image;
          if (productBaseImage) {
            return (
              <div className="product-image-wrapper">
                <img src={productBaseImage} alt={product.name} loading="lazy" className="product-image" />
              </div>
            );
          }
          return null;
        })()}
        <div className="product-content">
          <div className="product-card-topline">
            <span className="pill">{product.category}</span>
            <div className="product-badges" aria-label="Product highlights">
              {(product.badges || ["Catalogue"]).slice(0, 2).map((badge) => (
                <span key={badge}>{badge}</span>
              ))}
            </div>
          </div>
          <h3>{product.name}</h3>
          <p>{product.variants}</p>
          <dl>
            <div>
              <dt>Best for</dt>
              <dd>{product.suitableFor}</dd>
            </div>
          </dl>
        </div>
      </Link>
      <div className="product-actions" onClick={(e) => e.stopPropagation()}>
        <Link to={`/products/${product.slug}`} className="btn btn-outline">
          <Tags size={17} />
          View Details
        </Link>
        <a className="btn btn-whatsapp" href={createWhatsAppLink(message)} target="_blank" rel="noreferrer">
          <MessageCircle size={17} />
          WhatsApp Enquiry
        </a>
      </div>
    </article>
  );
}
