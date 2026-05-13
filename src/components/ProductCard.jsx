import { MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "../data/siteData.js";
import ProductVisual from "./ProductVisual.jsx";

export default function ProductCard({ product }) {
  const message = `Hello, I want to ask price for ${product.name}. Please share catalogue and bulk details.`;

  return (
    <article className="product-card">
      <ProductVisual palette={product.palette} compact />
      <div className="product-content">
        <span className="pill">{product.category}</span>
        <h3>{product.name}</h3>
        <p>{product.colors}</p>
        <dl>
          <div>
            <dt>Suitable for</dt>
            <dd>{product.suitableFor}</dd>
          </div>
        </dl>
        <a className="btn btn-outline" href={createWhatsAppLink(message)} target="_blank" rel="noreferrer">
          <MessageCircle size={17} />
          Ask Price
        </a>
      </div>
    </article>
  );
}
