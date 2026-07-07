import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createWhatsAppLink } from "../data/siteData.js";
import IconBadge from "./IconBadge.jsx";

export default function CategoryCard({ category }) {
  const message = `Hello Fakhri Mart, I am interested in ${category.name}. Please share items, availability and catalogue details.`;

  return (
    <article className={`category-card tone-border-${category.tone}`}>
      <span className="card-shine" aria-hidden="true" />
      {category.image && (
        <div className="category-image-wrapper">
          <img src={category.image} alt={category.name} loading="lazy" className="category-image" />
        </div>
      )}
      <div className="category-card-head">
        <IconBadge name={category.icon} tone={category.tone} />
        <span className="category-count">{category.count}</span>
      </div>
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <ul className="mini-list" aria-label={`${category.name} products`}>
        {category.products.slice(0, 3).map((product) => (
          <li key={product}>{product}</li>
        ))}
      </ul>
      <div className="category-actions">
        <Link to="/products" className="text-link">
          View Items
          <ArrowRight size={15} />
        </Link>
        <a href={createWhatsAppLink(message)} target="_blank" rel="noreferrer" className="icon-link" aria-label={`Enquire about ${category.name} on WhatsApp`}>
          <MessageCircle size={17} />
        </a>
      </div>
    </article>
  );
}
