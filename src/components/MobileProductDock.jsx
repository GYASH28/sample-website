import { Heart, ShoppingBagOpen } from "@phosphor-icons/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { featuredProducts } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";

function getDefaultVariant(product) {
  if (product.slug === "t-shirt-yarn") return "250gm";
  if (product.slug.includes("macrame-cord")) return "3MM";
  if (product.slug === "crochet-hook") return "2.0mm";
  return null;
}

export default function MobileProductDock() {
  const { pathname } = useLocation();
  const slug = pathname.startsWith("/products/") ? pathname.split("/").filter(Boolean).pop() : null;
  const product = useMemo(() => featuredProducts.find((item) => item.slug === slug), [slug]);
  const { add } = useEnquiryBasket();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);
  const resetTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(resetTimerRef.current), []);

  if (!product) return null;

  const saved = has(product.slug);
  const addDefault = () => {
    add({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      shade: product.colors?.[0] || null,
      quantity: product.quantityOptions?.min || 1,
      unit: product.quantityOptions?.unit || "pcs",
      variant: getDefaultVariant(product),
      note: "Added from mobile product dock",
    });
    setAdded(true);
    window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => setAdded(false), 1400);
  };

  return (
    <aside className="mobile-product-dock" aria-label="Product quick actions">
      <div className="mobile-product-dock__meta">
        <img src={product.image} alt="" width="48" height="48" />
        <span><strong>{product.name}</strong><small>{product.colors?.length || 0} listed shades</small></span>
      </div>
      <button
        className={`mobile-product-dock__save ${saved ? "is-saved" : ""}`}
        type="button"
        onClick={() => toggle(product.slug)}
        aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      >
        <Heart size={19} weight={saved ? "fill" : "regular"} />
      </button>
      <button className="mobile-product-dock__add" type="button" onClick={addDefault} disabled={product.stock === "out"}>
        <ShoppingBagOpen size={18} />
        <span>{product.stock === "out" ? "Unavailable" : added ? "Added" : "Add"}</span>
      </button>
    </aside>
  );
}
