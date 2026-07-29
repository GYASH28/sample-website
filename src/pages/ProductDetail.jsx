import {
  ArrowRight,
  Bell,
  CaretDown,
  CaretUp,
  ChatCircleDots,
  Check,
  ArrowsOut,
  Heart,
  Info,
  Minus,
  Percent,
  Plus,
  Question,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
} from "@phosphor-icons/react";
import { useMemo, useState, useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import CatalogueCta from "../components/CatalogueCta.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ShadeCardButton from "../components/ShadeCardButton.jsx";
import ShareButton from "../components/ShareButton.jsx";
import ColorSwatchPicker from "../components/ColorSwatchPicker.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import { Lightbox } from "../components/ImageZoom.jsx";
import StickyBreadcrumb from "../components/StickyBreadcrumb.jsx";
import { createWhatsAppLink, featuredProducts, productCategories, businessInfo } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { useJsonLd, productJsonLd, breadcrumbJsonLd } from "../hooks/useJsonLd.js";
import { useRecentlyViewed, formatTimeAgo } from "../hooks/useRecentlyViewed.js";

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

  // Phase 1 — JSON-LD structured data (Product + BreadcrumbList)
  const canonicalUrl = `${businessInfo.url}/products/${product.slug}`;
  useJsonLd(productJsonLd(product, canonicalUrl));
  useJsonLd(
    breadcrumbJsonLd([
      { name: "Home", url: businessInfo.url },
      { name: "Shop", url: `${businessInfo.url}/products` },
      { name: product.name, url: canonicalUrl },
    ])
  );

  const { add: addToBasket } = useEnquiryBasket();
  const { has: isInWishlist, toggle: toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.slug);

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
      setQuantity(product.quantityOptions?.presets[2] || 50);
    } else {
      setQuantity(product.quantityOptions?.presets[0] || 1);
    }
  }, [isBulkMode, product]);

  // Image Gallery Architecture
  const baseImageUrl = product.image || "/assets/images/hero_banner.webp";
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Use only verified material-family and editorial images. Current shade
  // photos are confirmed on WhatsApp instead of being synthesized.
  const productImages = useMemo(() => {
    return [
      { type: "hero", src: baseImageUrl, label: "Hero View" },
      ...(product.galleryImages || []).map((img, i) => ({
        type: `gallery-${i + 1}`,
        src: img,
        label: `Gallery View ${i + 1}`
      }))
    ];
  }, [product, baseImageUrl]);

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

  // Phase 1.2 — Frequently Enquired Together bundles (uses new bundleWith field)
  const bundleProducts = useMemo(() => {
    if (!product.bundleWith || product.bundleWith.length === 0) return [];
    return product.bundleWith
      .map((s) => featuredProducts.find((p) => p.slug === s))
      .filter(Boolean);
  }, [product.bundleWith]);

  // Phase 3.2 — Notify-me on WhatsApp (for out-of-stock items)
  const isOutOfStock = product.stock === "out";
  const notifyMessage = `Hello ${businessInfo.shortName}, I'd like to be notified when "${product.name}"${activeColor ? ` (shade: ${activeColor.name})` : ""} is back in stock. Thank you!`;
  const notifyLink = createWhatsAppLink(notifyMessage);

  const recentItems = useRecentlyViewed(slug, true);
  const recentlyViewedProducts = useMemo(() => {
    return recentItems
      .map((item) => {
        const p = featuredProducts.find((fp) => fp.slug === item.slug);
        return p ? { ...p, viewedAt: item.viewedAt } : null;
      })
      .filter(Boolean);
  }, [recentItems]);

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
      { label: "Availability", value: "Confirmed when you enquire" },
      { label: "Delivery", value: "Available across India; timing confirmed by location" }
    ];

    if (product.category === "Bliss Threads") {
      return [
        { label: "Product family", value: "Bliss Threads" },
        { label: "Shade guidance", value: "Current shade card available on request" },
        { label: "Needle or hook size", value: "Confirm from the current pack label" },
        ...defaultSpecs
      ];
    }
    if (product.category === "Vardhaman Products") {
      return [
        { label: "Brand", value: "Vardhaman" },
        { label: "Product details", value: "Current pack specifications shared on request" },
        { label: "Care", value: "Follow the instructions on the supplied pack label" },
        ...defaultSpecs
      ];
    }
    if (product.category === "Ganga Products") {
      return [
        { label: "Brand", value: "Ganga Yarns" },
        { label: "Product details", value: "Current pack specifications shared on request" },
        ...defaultSpecs
      ];
    }
    if (product.category === "Macrame Cord") {
      return [
        { label: "Material", value: "Confirm composition from the current product label" },
        { label: "Structure", value: product.slug.includes("twisted") ? "Multi-strand twisted rope" : "Single-strand twist cord" },
        { label: "Project guidance", value: "Ask us about cord structure for your intended project" },
        ...defaultSpecs
      ];
    }
    if (product.category === "T-Shirt Yarn") {
      return [
        { label: "Material", value: "Confirm composition from the current product label" },
        { label: "Needle or hook size", value: "Confirm from the current pack label" },
        { label: "Product details", value: "Current width and weight shared on request" },
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

  // Category-specific FAQs
  const productFaqs = useMemo(() => {
    const defaultFaqs = [
      {
        q: "Do you provide bulk wholesale pricing?",
        a: "Yes. Prices are confirmed against quantity, shade, size, packaging, and current availability. Add the items to your enquiry basket to request a wholesale quote."
      },
      {
        q: "Is shipping available all over India?",
        a: "We support delivery across India. Share your postcode in the enquiry and we will confirm availability, delivery timing, and applicable charges."
      },
      {
        q: "Can I mix different shades in a single bulk order?",
        a: "Yes, you can enquire about and order mixed shades in a single wholesale delivery. Simply add the individual shades and quantities to your enquiry basket and submit."
      }
    ];

    if (product.category === "Bliss Threads" || product.category.includes("Yarn")) {
      return [
        ...defaultFaqs,
        {
          q: "What is the recommended hook or needle size?",
          a: `The best size depends on the current ${product.name} pack specifications, your gauge, and the fabric you want. Ask us to share the current label details before ordering.`
        },
        {
          q: "How should I wash and care for this yarn?",
          a: "Please follow the care instructions on the supplied pack label. We can share a current label photo through WhatsApp before you order."
        }
      ];
    }
    if (product.category.includes("Macrame")) {
      return [
        ...defaultFaqs,
        {
          q: "Can I comb or fringe this macrame cord?",
          a: "Fringing depends on the cord construction. Tell us the finish you need and we will confirm the current cord structure before you order."
        }
      ];
    }
    if (product.category.includes("Handles") || product.category.includes("Accessories")) {
      return [
        ...defaultFaqs,
        {
          q: "Are these handles durable for regular handbag use?",
          a: "Suitability depends on the bag weight, attachment method, and current handle specification. Share your project details so we can help you choose."
        }
      ];
    }
    return defaultFaqs;
  }, [product]);

  // A1 fix: Lightbox keyboard nav + body-scroll lock now handled inside <Lightbox /> component.

  return (
    <>
      {/* A1 fix: replaced inline breadcrumb-nav div with dedicated <StickyBreadcrumb /> */}
      <StickyBreadcrumb categoryName={product.category} productName={product.name} />

      <section className="section product-detail-section">
        <div className="container">
          <div className="product-detail-grid">
            {/* Left Column: Visual (Sticky on desktop) */}
            <div className="product-detail-visual">
              <div className="sticky-visual-wrapper">
                <div 
                  className="product-image-container group" 
                  style={{ position: "relative", display: "flex", width: "100%", aspectRatio: "1/1", borderRadius: "var(--radius)", overflow: "hidden", backgroundColor: "#faf6f0", border: "1px solid rgba(50, 48, 45, 0.05)", cursor: "zoom-in" }}
                  onClick={() => setLightboxOpen(true)}
                >
                  <img
                    key={productImages[activeGalleryIndex]?.src}
                    src={productImages[activeGalleryIndex]?.src}
                    alt={productImages[activeGalleryIndex]?.label || product.name}
                    className="product-detail-hero-image"
                    style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", objectFit: "cover" }}
                  />
                  <div className="image-zoom-overlay-badge" style={{ position: "absolute", bottom: "16px", right: "16px", zIndex: 5, background: "rgba(0,0,0,0.5)", color: "#fff", padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowsOut size={16} />
                  </div>
                </div>

                {/* Gallery Thumbnails Carousel Strip */}
                <div className="gallery-thumbnail-strip" style={{ marginTop: "16px" }}>
                  <span className="thumbnail-label" style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Material and project views</span>
                  <div className="thumbnail-grid-row" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
                    {productImages.map((img, i) => {
                      const isSelected = activeGalleryIndex === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          className={`thumbnail-rect-btn ${isSelected ? "active" : ""}`}
                          onClick={() => setActiveGalleryIndex(i)}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "var(--radius-small, 6px)",
                            border: isSelected ? "2px solid var(--primary)" : "1px solid rgba(0,0,0,0.1)",
                            overflow: "hidden",
                            flexShrink: 0,
                            padding: 0,
                            cursor: "pointer",
                            background: "#fff"
                          }}
                          aria-label={`View ${img.label}`}
                        >
                          <img src={img.src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="product-detail-content">
              {/* Category, Wishlist, Compare Actions */}
              <div className="product-badges-row-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="product-badges-row" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <span className="category-tag-pill">{product.category}</span>
                  {product.badges.map((badge) => (
                    <span key={badge} className="feature-tag-pill">{badge}</span>
                  ))}
                </div>

                <div className="detail-header-actions" style={{ display: "flex", gap: "8px" }}>
                  {/* Phase 2: Compare button removed */}

                  {/* Favorite Toggle */}
                  <button
                    type="button"
                    className={`btn-detail-action-circle ${isFavorited ? "active" : ""}`}
                    onClick={() => toggleWishlist(product.slug)}
                    title={isFavorited ? "Remove from Favorites" : "Save to Favorites"}
                    aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      border: "1px solid rgba(0,0,0,0.1)",
                      background: isFavorited ? "var(--rose-light, #fff0f2)" : "#fff",
                      color: isFavorited ? "var(--accent-rose, #e05c75)" : "currentColor",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer"
                    }}
                  >
                    <Heart size={16} weight={isFavorited ? "fill" : "regular"} />
                  </button>
                </div>
              </div>

              <h1 className="product-detail-title-new">{product.name}</h1>
              <p className="product-detail-variant-info">{product.variants}</p>
              <p className="product-image-note">{product.imageNote}</p>

              {/* Phase 2: StockBadge removed. Shade card request row kept. */}
              <div className="product-detail-stock-row" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "20px", padding: "12px 0", borderBottom: "1px solid var(--line)", borderTop: "1px solid var(--line)" }}>
                <ShadeCardButton product={product} shade={activeColor} size="lg" />
              </div>

              {/* Trust badges row */}
              <div className="product-trust-badges-bar">
                <span>
                  <Truck size={15} /> All-India Delivery
                </span>
                <span>
                  <Percent size={15} /> Wholesale Friendly
                </span>
                <span>
                  <ShieldCheck size={15} /> Details Confirmed on Enquiry
                </span>
              </div>

              {/* Pincode delivery checker */}
              {/* Phase 2: PincodeChecker removed — replaced with honest static shipping line */}
              <div style={{ margin: "16px 0" }}>
                <p style={{ color: 'var(--muted, #544C43)', fontSize: '0.9rem' }}>We deliver across India. Confirm exact timing on WhatsApp.</p>
              </div>

              <div className="product-detail-desc-box">
                <p>{product.description}</p>
              </div>

              {/* Interactive Variant Options */}
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

              {/* A1 fix: replaced inline color-swatch markup with dedicated <ColorSwatchPicker /> */}
              {product.colors && product.colors.length > 0 && (
                <div className="detail-section-configured">
                  <ColorSwatchPicker
                    colors={product.colors}
                    activeColor={activeColor}
                    onSelect={setActiveColor}
                  />
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
                {/* A1 fix: replaced inline quantity-stepper markup with dedicated <QuantitySelector /> */}
                <QuantitySelector
                  options={{
                    ...product.quantityOptions,
                    // Bulk mode swaps in wholesale presets
                    presets: isBulkMode
                      ? [50, 100, 200, 500].filter((p) => p <= (product.quantityOptions?.max || 500))
                      : (product.quantityOptions?.presets || [1, 6, 12, 24]),
                  }}
                  value={quantity}
                  onChange={setQuantity}
                />

                {isBulkMode && (
                  <p className="bulk-guidance-text">
                    💡 <strong>Bulk Mode active:</strong> Special wholesale rates and custom shipping quotes will be calculated for this order.
                  </p>
                )}
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
                    <ChatCircleDots size={20} />
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
                  <ShareButton
                    url={typeof window !== "undefined" ? window.location.href : ""}
                    title={`${product.name} | Fakhri Mart`}
                    text={`${product.name} from Fakhri Mart`}
                  />
                  <a
                    href={createWhatsAppLink(`Hello Fakhri Mart, I would like to ask for bulk price quotation for *${product.name}*`)}
                    target="_blank"
                    rel="noreferrer"
                    className="utility-action-link-btn"
                  >
                    <Tag size={14} />
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

      {/* Timeline Section Explaining How Enquiry Works */}
      <section className="section bg-tinted border-top-line enquiry-how-it-works-detail">
        <div className="container">
          <div className="section-head text-center" style={{ marginBottom: "40px" }}>
            <p className="eyebrow" style={{ display: "inline-block" }}>Simple Steps</p>
            <h2>How Your Enquiry Works</h2>
            <p>Fakhri Mart operates as an enquiry-first digital catalogue. We do not require payment online.</p>
          </div>
          <div className="enquiry-timeline-grid">
            <div className="timeline-step-card">
              <span className="step-num">01</span>
              <h4>Add Your Items</h4>
              <p>Select your favorite shades, weights, or dimensions and add them to your enquiry basket.</p>
            </div>
            <div className="timeline-step-card">
              <span className="step-num">02</span>
              <h4>Verify & Submit</h4>
              <p>Review your basket list on the Enquiry page and submit the aggregated list to WhatsApp.</p>
            </div>
            <div className="timeline-step-card">
              <span className="step-num">03</span>
              <h4>Confirm & Complete</h4>
              <p>Our team verifies actual stock availability, calculates delivery charges, and shares final billing details directly on WhatsApp.</p>
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
                <Question size={18} /> Product FAQs
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
                        {isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}
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

      {/* Phase 1.2 — Frequently Enquired Together bundles */}
      {bundleProducts.length > 0 && (
        <section className="section bg-light border-top-line">
          <div className="container">
            <div className="section-head text-center" style={{ marginBottom: "32px" }}>
              <p className="eyebrow" style={{ display: "inline-block" }}>Bundle</p>
              <h2>Frequently Enquired Together</h2>
              <p>Makers often pair these. Add them all to your enquiry at once.</p>
            </div>
            <div className="card-grid product-grid">
              {bundleProducts.map((bProduct) => (
                <ProductCard key={bProduct.slug} product={bProduct} compact />
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                type="button"
                className="btn btn-whatsapp"
                onClick={() => {
                  addToBasket({
                    slug: product.slug,
                    name: product.name,
                    category: product.category,
                    image: baseImageUrl,
                    shade: activeColor,
                    quantity: quantity,
                    unit: product.quantityOptions?.unit || "pcs",
                    variant: selectedVariant,
                  });
                  bundleProducts.forEach((bp) => {
                    addToBasket({
                      slug: bp.slug,
                      name: bp.name,
                      category: bp.category,
                      image: bp.image,
                      quantity: bp.quantityOptions?.min || 1,
                      unit: bp.quantityOptions?.unit || "pcs",
                    });
                  });
                }}
              >
                <ShoppingBag size={16} aria-hidden="true" />
                Add all to Enquiry Basket
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Phase 3.2 — Notify-me on WhatsApp for out-of-stock items */}
      {isOutOfStock && (
        <section className="section border-top-line" style={{ paddingTop: "40px", paddingBottom: "40px" }}>
          <div className="container">
            <div
              style={{
                maxWidth: "640px",
                margin: "0 auto",
                background: "rgba(107, 31, 42, 0.06)",
                border: "1px dashed var(--pink-dark, #6B1F2A)",
                borderRadius: "var(--radius-md, 8px)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <Bell size={22} style={{ color: "var(--pink-dark, #6B1F2A)", flexShrink: 0 }} aria-hidden="true" />
              <div style={{ flex: "1", minWidth: "200px" }}>
                <strong style={{ color: "var(--pink-dark, #6B1F2A)", display: "block", marginBottom: "4px" }}>
                  Notify me on WhatsApp
                </strong>
                <small style={{ color: "var(--muted)", display: "block", fontSize: "0.78rem" }}>
                  We&apos;ll personally follow up when this shade is back. Manual follow-up, not an automated system.
                </small>
              </div>
              <a
                href={notifyLink}
                target="_blank"
                rel="noreferrer noopener"
                className="btn btn-whatsapp btn-small"
              >
                <ChatCircleDots size={16} aria-hidden="true" />
                Notify Me
              </a>
            </div>
          </div>
        </section>
      )}

      {/* People Also Enquired (Related Products) */}
      {relatedProducts.length > 0 && (
        <section className="section bg-light border-top-line">
          <div className="container">
            <div className="section-head text-center" style={{ marginBottom: "32px" }}>
              <p className="eyebrow" style={{ display: "inline-block" }}>Cross-sell</p>
              <h2>People Also Enquired</h2>
              <p>Explore related materials from the catalogue.</p>
            </div>
            <div className="card-grid product-grid">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct.slug} product={relProduct} compact />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recently Viewed Products — with "viewed X ago" timestamps */}
      {recentlyViewedProducts.length > 0 && (
        <section className="section border-top-line" style={{ paddingTop: "82px" }}>
          <div className="container">
            <div className="section-head text-center" style={{ marginBottom: "32px" }}>
              <p className="eyebrow" style={{ display: "inline-block" }}>History</p>
              <h2>Recently Viewed</h2>
              <p>Return to materials you viewed recently.</p>
            </div>
            <div className="card-grid product-grid">
              {recentlyViewedProducts.map((recentProduct) => (
                <div key={recentProduct.slug} style={{ position: "relative" }}>
                  <ProductCard product={recentProduct} compact />
                  {recentProduct.viewedAt && (
                    <span style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      fontSize: "0.68rem",
                      color: "var(--muted)",
                      background: "rgba(255, 247, 236, 0.85)",
                      padding: "2px 8px",
                      borderRadius: "var(--radius-pill, 999px)",
                      fontWeight: 500,
                      pointerEvents: "none",
                    }}>
                      {formatTimeAgo(recentProduct.viewedAt)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* A1 fix: replaced inline 50-line lightbox markup with dedicated <Lightbox /> component */}
      {lightboxOpen && (
        <Lightbox
          images={productImages}
          activeIndex={activeGalleryIndex}
          onIndexChange={setActiveGalleryIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* Bottom CTA */}
      <section className="container">
        <CatalogueCta />
      </section>
    </>
  );
}
