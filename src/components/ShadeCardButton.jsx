import { Palette } from "lucide-react";
import { smartWhatsAppLink } from "../i18n.jsx";

/**
 * ShadeCardButton — "Request Shade Card" CTA.
 * Opens WhatsApp with a pre-filled message asking for digital shade card photos.
 */
export default function ShadeCardButton({ product, shade = null, size = "sm", className = "" }) {
  const link = smartWhatsAppLink({
    type: "shade-card",
    productName: product.name,
    shade: shade?.name || null,
  });

  const isLarge = size === "lg";
  const padding = isLarge ? "12px 18px" : "8px 14px";
  const fontSize = isLarge ? "0.9rem" : "0.78rem";
  const iconSize = isLarge ? 18 : 15;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className={`btn btn-shade-card ${className}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding,
        fontSize,
        fontWeight: "600",
        background: "var(--pink-soft)",
        color: "var(--pink-dark)",
        border: "1px solid rgba(185, 87, 118, 0.25)",
        borderRadius: "var(--radius)",
        textDecoration: "none",
        cursor: "pointer",
        transition: "all var(--duration-quick) var(--ease-soft)",
      }}
      aria-label={`Request digital shade card for ${product.name}`}
    >
      <Palette size={iconSize} aria-hidden="true" />
      {isLarge ? "Request Shade Card" : "Shade Card"}
    </a>
  );
}
