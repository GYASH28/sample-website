import { X, ArrowUpDown, Trash2 } from "lucide-react";
import { useCompare } from "../hooks/useCompare.js";
import { featuredProducts } from "../data/siteData.js";
import { useState } from "react";
import CompareModal from "./CompareModal.jsx";

export default function CompareTray() {
  const { compareList, remove, clear, count, maxItems } = useCompare();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (count === 0) return null;

  const comparedProducts = compareList
    .map((slug) => featuredProducts.find((p) => p.slug === slug))
    .filter(Boolean);

  return (
    <>
      <div className="compare-tray-floating animate-slide-up" role="complementary" aria-label="Compare Tray">
        <div className="container compare-tray-inner">
          <div className="compare-tray-info">
            <span className="compare-count-badge">{count}</span>
            <div>
              <h4>Compare Products</h4>
              <p className="hide-mobile">Compare up to {maxItems} items side-by-side</p>
            </div>
          </div>
          
          <div className="compare-tray-items">
            {comparedProducts.map((product) => (
              <div key={product.slug} className="compare-tray-item-thumb">
                <img src={product.image} alt={product.name} />
                <button
                  type="button"
                  className="compare-item-remove-btn"
                  onClick={() => remove(product.slug)}
                  aria-label={`Remove ${product.name} from comparison`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {Array.from({ length: maxItems - count }).map((_, i) => (
              <div key={i} className="compare-tray-item-thumb empty hide-mobile" title="Add another product to compare">
                <span>+</span>
              </div>
            ))}
          </div>

          <div className="compare-tray-actions">
            <button
              type="button"
              className="btn btn-outline btn-small text-danger-hover"
              onClick={clear}
            >
              <Trash2 size={14} className="hide-mobile" />
              Clear
            </button>
            <button
              type="button"
              className="btn btn-primary btn-small font-semibold"
              disabled={count < 2}
              onClick={() => setIsModalOpen(true)}
              title={count < 2 ? "Select at least 2 products to compare" : "Compare selected products"}
            >
              <ArrowUpDown size={14} />
              Compare Now
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CompareModal
          products={comparedProducts}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
