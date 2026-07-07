import { getStockStatus } from "../i18n.jsx";

/**
 * StockBadge — colored stock status indicator.
 * Green (In Stock) / Amber (Limited) / Gray (On Request).
 */
export default function StockBadge({ product, size = "sm" }) {
  const status = getStockStatus(product);

  const config = {
    "in-stock": { label: "In Stock", labelHi: "स्टॉक में", color: "#49885E", bg: "rgba(73, 136, 94, 0.12)", dot: "#49885E" },
    "limited": { label: "Limited Stock", labelHi: "सीमित स्टॉक", color: "#B38F46", bg: "rgba(179, 143, 70, 0.12)", dot: "#B38F46" },
    "on-request": { label: "On Request", labelHi: "माँग पर", color: "#6B6258", bg: "rgba(107, 98, 88, 0.12)", dot: "#6B6258" },
  };

  const c = config[status] || config["in-stock"];
  const fontSize = size === "lg" ? "0.8rem" : "0.7rem";
  const padding = size === "lg" ? "6px 12px" : "4px 8px";

  return (
    <span
      className="stock-badge"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding,
        background: c.bg,
        color: c.color,
        borderRadius: "var(--radius-pill, 999px)",
        fontSize,
        fontWeight: "600",
        border: `1px solid ${c.color}30`,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: c.dot,
          flexShrink: 0,
        }}
      />
      {c.label}
    </span>
  );
}
