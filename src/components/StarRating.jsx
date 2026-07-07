// src/components/StarRating.jsx
// Phase 1 — reusable compact star rating display.
// Used by ProductCard and ProductDetail header.
// Renders: ★★★★½ (38)  — accessible (aria-label), no interactivity.

import { Star } from "lucide-react";

export default function StarRating({ value = 0, count, size = 14, className = "" }) {
  const rounded = Math.round(value * 2) / 2;
  const full = Math.floor(rounded);
  const half = rounded - full >= 0.5;
  const ariaLabel = count
    ? `Rated ${value} out of 5 from ${count} reviews`
    : `Rated ${value} out of 5`;

  return (
    <span
      className={`star-rating ${className}`}
      role="img"
      aria-label={ariaLabel}
      style={{ display: "inline-flex", alignItems: "center", gap: "0.15em" }}
    >
      {[0, 1, 2, 3, 4].map((i) => {
        const isFull = i < full;
        const isHalf = i === full && half;
        return (
          <span
            key={i}
            style={{ position: "relative", display: "inline-block", width: size, height: size }}
          >
            <Star
              size={size}
              strokeWidth={1.5}
              style={{ color: "var(--gold-deep, #8E6824)", fill: "none", position: "absolute", inset: 0 }}
              aria-hidden="true"
            />
            {(isFull || isHalf) && (
              <Star
                size={size}
                strokeWidth={0}
                style={{
                  color: "var(--gold, #B8893C)",
                  fill: "var(--gold, #B8893C)",
                  position: "absolute",
                  inset: 0,
                  clipPath: isHalf ? "inset(0 50% 0 0)" : "none",
                }}
                aria-hidden="true"
              />
            )}
          </span>
        );
      })}
      {count != null && (
        <span style={{ marginLeft: "0.4em", fontSize: "0.78em", color: "var(--text-soft, #6B5749)" }}>
          ({count})
        </span>
      )}
    </span>
  );
}
