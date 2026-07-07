import { X, ShoppingBag, MessageCircle } from "lucide-react";
import { createWhatsAppLink } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useCompare } from "../hooks/useCompare.js";
import { useState } from "react";

export default function CompareModal({ products, onClose }) {
  const { add: addToBasket } = useEnquiryBasket();
  const { remove } = useCompare();
  const [addedSlugs, setAddedSlugs] = useState({});

  const handleAddToBasket = (product) => {
    const basketItem = {
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      shade: product.colors?.[0] || null,
      quantity: product.quantityOptions?.presets[0] || 1,
      unit: product.quantityOptions?.unit || "pcs",
      variant: null
    };
    addToBasket(basketItem);
    setAddedSlugs(prev => ({ ...prev, [product.slug]: true }));
    setTimeout(() => {
      setAddedSlugs(prev => ({ ...prev, [product.slug]: false }));
    }, 2000);
  };

  return (
    <div className="compare-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Product Comparison">
      <div className="compare-modal-content animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="compare-modal-header">
          <h3>Compare Products ({products.length})</h3>
          <button type="button" className="compare-modal-close" onClick={onClose} aria-label="Close Comparison">
            <X size={20} />
          </button>
        </div>

        <div className="compare-modal-body">
          <div className="compare-table-wrapper">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Product Details</th>
                  {products.map((product) => (
                    <th key={product.slug} className="compare-col-header">
                      <div className="compare-th-content">
                        <button
                          type="button"
                          className="compare-remove-col-btn"
                          onClick={() => {
                            remove(product.slug);
                            if (products.length <= 1) onClose();
                          }}
                          title="Remove from comparison"
                        >
                          <X size={14} />
                        </button>
                        <div className="compare-th-img-wrapper">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <h4>{product.name}</h4>
                        <span className="compare-cat-badge">{product.category}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Brand</strong></td>
                  {products.map((product) => (
                    <td key={product.slug}>{product.brand || "Fakhri Mart"}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Product Type</strong></td>
                  {products.map((product) => (
                    <td key={product.slug} className="capitalize">{product.type?.replace("-", " ") || "Craft Supply"}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Ideal Use Cases</strong></td>
                  {products.map((product) => (
                    <td key={product.slug}>
                      <div className="compare-tags-flex">
                        {product.tags?.map(t => (
                          <span key={t} className="compare-tag-pill">{t}</span>
                        )) || product.suitableFor.split(',').map(use => (
                          <span key={use} className="compare-tag-pill">{use.trim()}</span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Options / Variants</strong></td>
                  {products.map((product) => (
                    <td key={product.slug}>{product.variants || "Standard packaging"}</td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Shades Available</strong></td>
                  {products.map((product) => (
                    <td key={product.slug}>
                      {product.colors && product.colors.length > 0 ? (
                        <div>
                          <strong>{product.colors.length} Shades</strong>
                          <div className="compare-colors-preview">
                            {product.colors.slice(0, 5).map(c => (
                              <span
                                key={c.hex}
                                className="compare-color-dot"
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              />
                            ))}
                            {product.colors.length > 5 && <span>+{product.colors.length - 5}</span>}
                          </div>
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Wholesale Presets</strong></td>
                  {products.map((product) => (
                    <td key={product.slug}>
                      {product.quantityOptions?.presets?.map(p => `${p} ${product.quantityOptions.unit || 'pcs'}`).join(', ') || "Custom enquiry only"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td><strong>Bulk Orders</strong></td>
                  {products.map((product) => (
                    <td key={product.slug}>
                      {product.tags?.includes("Bulk Orders") || product.category.includes("Yarn") || product.category.includes("Cord") ? (
                        <span className="text-success font-semibold">✓ Yes (Reseller Friendly)</span>
                      ) : (
                        "On Request"
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="compare-actions-row">
                  <td><strong>Actions</strong></td>
                  {products.map((product) => {
                    const waMessage = `Hello Fakhri Mart, I am interested in comparing and placing an enquiry for *${product.name}* (Category: ${product.category}). Please share availability and bulk pricing details.`;
                    const isAdded = addedSlugs[product.slug];

                    return (
                      <td key={product.slug}>
                        <div className="compare-actions-flex">
                          <button
                            type="button"
                            className={`btn btn-outline btn-small w-full ${isAdded ? 'btn-success' : ''}`}
                            onClick={() => handleAddToBasket(product)}
                          >
                            <ShoppingBag size={14} />
                            {isAdded ? "Added" : "Add to Basket"}
                          </button>
                          <a
                            href={createWhatsAppLink(waMessage)}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-whatsapp btn-small w-full"
                          >
                            <MessageCircle size={14} />
                            Enquire
                          </a>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
