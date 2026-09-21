import { useCallback, useState } from "react";
import ProductCard from "./ProductCard.jsx";
import ProductQuickView from "./ProductQuickView.jsx";

export default function ProductShowcaseCard({ product }) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  return (
    <div className="product-showcase-card">
      <ProductCard
        product={product}
        onQuickView={() => setOpen(true)}
        quickViewOpen={open}
      />
      <ProductQuickView product={product} open={open} onClose={close} />
    </div>
  );
}
