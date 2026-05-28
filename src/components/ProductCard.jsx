import { MessageCircle, Tags } from "lucide-react";
import { createWhatsAppLink } from "../data/siteData.js";
import ProductVisual from "./ProductVisual.jsx";

export default function ProductCard({ product, compact = false }) {
  const message = `Hello Fakhri Mart, I want to ask price for ${product.name}. Please share availability, shade options and bulk pricing details.`;

  return (
    <article className={`product-card ${compact ? "product-card--compact" : ""}`}>
      <ProductVisual palette={product.palette} compact />
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
        <div className="product-actions">
          <a className="btn btn-outline" href={createWhatsAppLink(message)} target="_blank" rel="noreferrer">
            <Tags size={17} />
            Ask Price
          </a>
          <a className="btn btn-whatsapp" href={createWhatsAppLink(message)} target="_blank" rel="noreferrer">
            <MessageCircle size={17} />
            WhatsApp Enquiry
          </a>
        </div>
      </div>
    </article>
  );
}
