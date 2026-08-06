import { Eye } from "@phosphor-icons/react";
import { useCallback, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import ProductQuickView from "./ProductQuickView.jsx";

export default function ProductShowcaseCard({ product }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="product-showcase-card">
      <ProductCard product={product} />
      <button className="product-showcase-card__quick" type="button" onClick={() => setOpen(true)}>
        <Eye size={17} /> Quick view
      </button>
      <ProductQuickView product={product} open={open} onClose={close} />
    </div>
  );
}
