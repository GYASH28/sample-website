import { MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "../data/siteData.js";
import IconBadge from "./IconBadge.jsx";

export default function CategoryCard({ category }) {
  const message = `Hello, I am interested in ${category.name}. Please share catalogue and pricing details.`;

  return (
    <article className={`category-card tone-border-${category.tone}`}>
      <IconBadge name={category.icon} tone={category.tone} />
      <h3>{category.name}</h3>
      <p>{category.description}</p>
      <a href={createWhatsAppLink(message)} target="_blank" rel="noreferrer" className="text-link">
        Enquire Now
        <MessageCircle size={15} />
      </a>
    </article>
  );
}
