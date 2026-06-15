import {
  ArrowRight,
  ChevronRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  Percent,
  Copy,
  Check,
  ShoppingBag,
  Plus,
  Minus,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Tags
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import CatalogueCta from "../components/CatalogueCta.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { createWhatsAppLink, featuredProducts, productCategories } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { useRecentlyViewed } from "../hooks/useRecentlyViewed.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = useMemo(() => featuredProducts.find((p) => p.slug === slug), [slug]);

  // If product not found, redirect to 404
  if (!product) {
    return <Navigate to="/404" replace />;
  }

  useDocumentMeta({
    title: `${product.name} | Fakhri Mart`,
    description: product.description,
  });

  const { add: addToBasket } = useEnquiryBasket();
  const [activeColor, setActiveColor] = useState(product.colors?.[0] || null);
  
  // Extract variants from product.variants
  const variantOptions = useMemo(() => {
    if (product.slug === "t-shirt-yarn") {
      return ["250gm", "500gm"];
    }
    if (product.slug.includes("macrame-cord")) {
      return ["3MM", "4MM"];
    }
    if (product.slug === "crochet-hook") {
      return ["2.0mm", "3.0mm", "4.0mm", "5.0mm"];
    }
    return null;
  }, [product.slug]);

  const [selectedVariant, setSelectedVariant] = useState(null);

  // Set initial variant when product loads
  useEffect(() => {
    if (variantOptions) {
      setSelectedVariant(variantOptions[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [variantOptions]);

  // Order mode state (Retail vs Bulk)
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Reset quantity when shifting mode or product
  useEffect(() => {
    if (isBulkMode) {
      // Set to a sensible bulk minimum
      setQuantity(product.quantityOptions?.presets[2] || 50);
    } else {
      setQuantity(product.quantityOptions?.presets[0] || 1);
    }
  }, [isBulkMode, product]);

  // Handle color-specific image swapping
  const baseImageUrl = product.image || productCategories.find((c) => c.name === product.category)?.image;
  const [imgSrc, setImgSrc] = useState(baseImageUrl);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (activeColor) {
      const colorSlug = activeColor.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      setImgSrc(`/assets/images/products/${product.slug}-${colorSlug}.webp`);
      setImgError(false);
    } else {
      setImgSrc(baseImageUrl);
    }
  }, [activeColor, product, baseImageUrl]);

  const isBaseImage = imgSrc === baseImageUrl || imgError;

  // Share link feedback
  const [copied, setCopied] = useState(false);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Derive related products
  const relatedProducts = useMemo(() => {
    if (!product.relatedSlugs) return [];
    return product.relatedSlugs
      .map((relSlug) => featuredProducts.find((p) => p.slug === relSlug))
      .filter(Boolean);
  }, [product.relatedSlugs]);

  const recentSlugs = useRecentlyViewed(slug);
  const recentlyViewedProducts = useMemo(() => {
    return recentSlugs
      .map((recentSlug) => featuredProducts.find((p) => p.slug === recentSlug))
      .filter(Boolean);
  }, [recentSlugs]);

  // Build the dynamic WhatsApp messages
  const whatsappMessage = useMemo(() => {
    const qtyText = `${quantity} ${product.quantityOptions?.unit || "pcs"}`;
    const colorText = activeColor ? ` in *${activeColor.name}* shade` : "";
    const variantText = selectedVariant ? ` (${selectedVariant})` : "";
    const modeText = isBulkMode ? " [BULK ENQUIRY]" : "";
    
    return `Hello Fakhri Mart, I want to enquire about *${product.name}*${colorText}${variantText}, quantity *${qtyText}*${modeText}. Please share availability, pricing and catalogue.`;
  }, [product, activeColor, quantity, selectedVariant, isBulkMode]);

  const whatsappLink = createWhatsAppLink(whatsappMessage);

  // Handle add to enquiry basket
  const [addedAnimation, setAddedAnimation] = useState(false);
  const handleAddToBasket = () => {
    const basketItem = {
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: baseImageUrl,
      shade: activeColor,
      quantity: quantity,
      unit: product.quantityOptions?.unit || "pcs",
      variant: selectedVariant
    };
    addToBasket(basketItem);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  // Specs Generator
  const specs = useMemo(() => {
    const defaultSpecs = [
      { label: "Category", value: product.category },
      { label: "Availability", value: "Ready Stock (Confirm on Enquiry)" },
      { label: "Shipping Support", value: "All India Shipping Available" }
    ];

    if (product.category === "Bliss Threads") {
      return [
        { label: "Material Composition", value: "Premium Soft Cotton" },
        { label: "Texture Feel", value: "Extremely Soft, non-fraying" },
        { label: "Recommended Crochet Hooks", value: "1.0mm - 2.5mm" },
        ...defaultSpecs
      ];
    }
    if (product.category === "Vardhaman Products") {
      return [
        { label: "Brand", value: "Vardhaman (Genuine Quality)" },
        { label: "Primary Use", value: "Wearables, Baby garments, amigurumi, and craft work" },
        { label: "Care Instructions", value: "Gentle hand wash cold, dry flat in shade" },
        ...defaultSpecs
      ];
    }
    if (product.category === "Ganga Products") {
      return [
        { label: "Brand", value: "Ganga Yarns" },
        { label: "Texture Feel", value: "Plush, high durability threads" },
        ...defaultSpecs
      ];
    }
    if (product.category === "Macrame Cord") {
      return [
        { label: "Material Composition", value: "100% Natural Organic Cotton" },
        { label: "Structure", value: product.slug.includes("twisted") ? "Multi-strand twisted rope" : "Single-strand twist cord" },
        { label: "Recommended Craft", value: "Macrame wall hanger, plant holder, woven bags" },
        ...defaultSpecs
      ];
    }
    if (product.category === "T-Shirt Yarn") {
      return [
        { label: "Material", value: "Jersey Fabric Strips (Cotton Blend)" },
        { label: "Recommended Crochet Hooks", value: "6.0mm - 9.0mm" },
        { label: "Structure", value: "Chunky, flat structure for quick knitting" },
        ...defaultSpecs
      ];
    }
    return defaultSpecs;
  }, [product]);

  // FAQ state
  const [openFaq, setOpenFaq] = useState(null);
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const productFaqs = [
    {
      q: "Do you provide bulk wholesale pricing?",
      a: "Yes! While we do not display prices publicly on the website, we offer competitive wholesale prices for bulk quantities. Click the 'WhatsApp Enquiry' or 'Add to Basket' buttons to discuss pricing options directly."
    },
    {
      q: "Is shipping available all over India?",
      a: "Absolutely. We ship yarns, cords, handles, and accessories all across India. Delivery times typically range between 3 to 7 business days depending on your delivery location."
    },
    {
      q: "Can I mix different shades in a single bulk order?",
      a: "Yes, you can enquire about and order mixed shades in a single wholesale delivery. Simply add the individual shades and quantities to your enquiry basket and submit."
    },
    {
      q: "How do I choose the exact shade numbers?",
      a: "Since digital screens can shift colours slightly, you can ask for our verified digital shade cards on WhatsApp. We will help you select the exact colour codes for your project."
    }
  ];

  return (
    <>
      <div className="container breadcrumb-nav">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products">Products</Link>
        <ChevronRight size={14} />
        <span className="current-page">{product.name}</span>
      </div>

      <section className="section product-detail-section">
        <div className="container">
          <div className="product-detail-grid">
            {/* Left Column: Visual (Sticky on desktop) */}
            <div className="product-detail-visual">
              <div className="sticky-visual-wrapper">
                <div className="product-image-container" style={{ position: "relative", display: "flex", width: "100%", aspectRatio: "1/1", borderRadius: "var(--radius)", overflow: "hidden", backgroundColor: "#faf6f0", border: "1px solid rgba(50, 48, 45, 0.05)" }}>
                  <img
                    src={imgSrc}
                    alt={product.name}
                    className="product-detail-hero-image"
                    style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    onError={() => {
                      setImgError(true);
                      setImgSrc(baseImageUrl);
                    }}
                  />
                  {activeColor && isBaseImage && (
                    <div
                      className="product-color-overlay"
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: activeColor.hex,
                        mixBlendMode: "multiply",
                        opacity: 0.75,
                        pointerEvents: "none",
                        zIndex: 2,
                        transition: "background-color 0.3s ease"
                      }}
                    />
                  )}
                </div>

                {/* Color swatches thumbnail strip */}
                {product.colors && product.colors.length > 0 && (
                  <div className="gallery-thumbnail-strip">
                    <span className="thumbnail-label">Select Color Shade:</span>
                    <div className="thumbnail-grid-row">
                      {product.colors.map((color) => {
                        const isSelected = activeColor?.hex === color.hex;
                        return (
                          <button
                            key={color.hex}
                            type="button"
                            className={`thumbnail-circle-btn ${isSelected ? "active" : ""}`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            onClick={() => setActiveColor(color)}
                            aria-label={`Select ${color.name} shade`}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="product-detail-content">
              {/* Category & Badges */}
              <div className="product-badges-row" style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                <span className="category-tag-pill">{product.category}</span>
                {product.badges.map((badge) => (
                  <span key={badge} className="feature-tag-pill">{badge}</span>
                ))}
              </div>

              <h1 className="product-detail-title-new">{product.name}</h1>
              <p className="product-detail-variant-info">{product.variants}</p>

              {/* Trust badges row */}
              <div className="product-trust-badges-bar">
                <span>
                  <Truck size={15} /> All-India Delivery
                </span>
                <span>
                  <Percent size={15} /> Wholesale Friendly
                </span>
                <span>
                  <ShieldCheck size={15} /> Verified Quality
                </span>
              </div>

              <div className="product-detail-desc-box">
                <p>{product.description}</p>
              </div>

              {/* Interactive Variant Options (e.g. thickness, weight) */}
              {variantOptions && (
                <div className="detail-section-configured">
                  <span className="configure-label">Select Options:</span>
                  <div className="variant-options-pills">
                    {variantOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        className={`variant-pill-btn ${selectedVariant === opt ? "active" : ""}`}
                        onClick={() => setSelectedVariant(opt)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive Color Selector with labels */}
              {product.colors && product.colors.length > 0 && (
                <div className="detail-section-configured">
                  <div className="swatch-picker-box">
                    <span className="configure-label">
                      Active Shade: <strong>{activeColor?.name || "Select Color"}</strong>
                    </span>
                    <div className="swatch-selector-circles">
                      {product.colors.map((color) => {
                        const isSelected = activeColor?.hex === color.hex;
                        return (
                          <button
                            key={color.hex}
                            type="button"
                            className={`swatch-circle-selector ${isSelected ? "selected" : ""}`}
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                            onClick={() => setActiveColor(color)}
                            aria-label={`Choose ${color.name} shade`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Retail / Bulk Mode Selector Toggle */}
              <div className="detail-section-configured border-split">
                <div className="mode-toggle-container">
                  <span className="configure-label">Enquiry Order Mode:</span>
                  <div className="mode-toggle-buttons">
                    <button
                      type="button"
                      className={`mode-btn ${!isBulkMode ? "active" : ""}`}
                      onClick={() => setIsBulkMode(false)}
                    >
                      Retail
                    </button>
                    <button
                      type="button"
                      className={`mode-btn ${isBulkMode ? "active" : ""}`}
                      onClick={() => setIsBulkMode(true)}
                    >
                      Bulk / Wholesale
                    </button>
                  </div>
                </div>

                {/* Quantity input stepper & preset suggestions */}
                <div className="quantity-stepper-config">
                  <span className="configure-label">
                    Quantity: <strong>{quantity} {product.quantityOptions?.unit || "pcs"}</strong>
                  </span>
                  
                  {/* Stepper controls */}
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBlock: "10px" }}>
                    <div className="custom-stepper-controls">
                      <button
                        type="button"
                        className="stepper-action-btn"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={quantity}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setQuantity(val ? Math.max(1, parseInt(val)) : 1);
                        }}
                        className="stepper-numeric-input"
                      />
                      <button
                        type="button"
                        className="stepper-action-btn"
                        onClick={() => setQuantity(prev => prev + 1)}
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <span className="qty-unit-label">{product.quantityOptions?.unit || "pcs"}</span>
                  </div>

                  {/* Quantity Presets */}
                  <div className="qty-presets-chips">
                    {(isBulkMode ? [50, 100, 200, 500] : (product.quantityOptions?.presets || [1, 6, 12, 24])).map((presetVal) => (
                      <button
                        key={presetVal}
                        type="button"
                        className={`qty-preset-chip-btn ${quantity === presetVal ? "active" : ""}`}
                        onClick={() => setQuantity(presetVal)}
                      >
                        {presetVal} {product.quantityOptions?.unit || "pcs"}
                      </button>
                    ))}
                  </div>

                  {isBulkMode && (
                    <p className="bulk-guidance-text">
                      💡 <strong>Bulk Mode active:</strong> Special wholesale rates and custom shipping quotes will be calculated for this order.
                    </p>
                  )}
                </div>
              </div>

              {/* Actions Section */}
              <div className="detail-section-configured action-buttons-group">
                <div className="main-actions-flex">
                  <a
                    className="btn btn-whatsapp btn-large flex-grow-btn"
                    href={whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={20} />
                    WhatsApp Enquiry
                  </a>

                  <button
                    type="button"
                    className={`btn btn-outline btn-large flex-grow-btn basket-add-btn-style ${addedAnimation ? "btn-success" : ""}`}
                    onClick={handleAddToBasket}
                  >
                    {addedAnimation ? <Check size={20} /> : <ShoppingBag size={20} />}
                    {addedAnimation ? "Added to Basket" : "Add to Enquiry Basket"}
                  </button>
                </div>

                {/* Utility action links */}
                <div className="utility-buttons-row">
                  <button type="button" className="utility-action-link-btn" onClick={handleShare}>
                    <Copy size={14} />
                    {copied ? "Link Copied!" : "Copy Page Link"}
                  </button>
                  <a
                    href={createWhatsAppLink(`Hello Fakhri Mart, I would like to ask for bulk price quotation for *${product.name}*`)}
                    target="_blank"
                    rel="noreferrer"
                    className="utility-action-link-btn"
                  >
                    <Tags size={14} />
                    Ask Bulk Price
                  </a>
                </div>
              </div>

              {/* Best For section */}
              <div className="detail-section-configured border-split best-for-pills-section">
                <span className="configure-label">Ideal For:</span>
                <div className="ideal-uses-chips">
                  {product.suitableFor.split(",").map((use) => (
                    <span key={use} className="ideal-use-chip">
                      {use.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Structured modules below the fold */}
      <section className="section bg-light-details border-top-line">
        <div className="container">
          <div className="tabs-content-grid">
            {/* Specs Table */}
            <div className="detail-info-block shadow-card-premium">
              <h3 className="info-block-title">
                <Info size={18} /> Specifications
              </h3>
              <table className="specs-table-design">
                <tbody>
                  {specs.map((spec) => (
                    <tr key={spec.label}>
                      <th>{spec.label}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <span className="specs-table-disclaimer">
                * Note: Material specifications and shade ranges can be confirmed with our team during WhatsApp discussions.
              </span>
            </div>

            {/* Wholesale Info / FAQ */}
            <div className="detail-info-block shadow-card-premium">
              <h3 className="info-block-title">
                <HelpCircle size={18} /> Product FAQs
              </h3>
              <div className="faq-accordions-group">
                {productFaqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div key={index} className="faq-item-accordion">
                      <button
                        type="button"
                        className="faq-question-toggle-btn"
                        onClick={() => toggleFaq(index)}
                        aria-expanded={isOpen}
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      <div className={`faq-answer-collapsible ${isOpen ? "open" : ""}`}>
                        <div className="faq-answer-content-inner">
                          <p>{faq.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section bg-light border-top-line">
          <div className="container">
            <div className="section-head text-center" style={{ marginBottom: "32px" }}>
              <p className="eyebrow" style={{ display: "inline-block" }}>Matching Yarns</p>
              <h2>You May Also Like</h2>
              <p>Complementary yarns and materials that fit this craft project.</p>
            </div>
            <div className="card-grid product-grid">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.slug} product={relProduct} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewedProducts.length > 0 && (
        <section className="section border-top-line" style={{ paddingTop: "82px" }}>
          <div className="container">
            <div className="section-head text-center" style={{ marginBottom: "32px" }}>
              <p className="eyebrow" style={{ display: "inline-block" }}>History</p>
              <h2>Recently Viewed</h2>
            </div>
            <div className="card-grid product-grid">
              {recentlyViewedProducts.map((recentProduct) => (
                <ProductCard key={recentProduct.slug} product={recentProduct} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="container">
        <CatalogueCta />
      </section>
    </>
  );
}
