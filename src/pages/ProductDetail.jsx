import {
  ArrowRight,
  ChatCircleDots,
  Check,
  ArrowsOut,
  Heart,
  Info,
  Percent,
  Question,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
} from "@phosphor-icons/react";
import { useMemo, useState, useEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import CatalogueCta from "../components/CatalogueCta.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ShadeCardButton from "../components/ShadeCardButton.jsx";
import ShareButton from "../components/ShareButton.jsx";
import ColorSwatchPicker from "../components/ColorSwatchPicker.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import ProductFaq from "../components/ProductFaq.jsx";
import ShadePreviewStudio, { ShadePreviewTint } from "../components/ShadePreviewStudio.jsx";
import { Lightbox } from "../components/ImageZoom.jsx";
import StickyBreadcrumb from "../components/StickyBreadcrumb.jsx";
import { createWhatsAppLink, featuredProducts, businessInfo } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { useJsonLd, productJsonLd, breadcrumbJsonLd } from "../hooks/useJsonLd.js";
import { useRecentlyViewed, formatTimeAgo } from "../hooks/useRecentlyViewed.js";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = useMemo(() => featuredProducts.find((p) => p.slug === slug), [slug]);

  if (!product) {
    return <Navigate to="/404" replace />;
  }

  useDocumentMeta({
    title: `${product.name} | Fakhri Mart`,
    description: product.description,
  });

  const canonicalUrl = `${businessInfo.url}/products/${product.slug}`;
  useJsonLd(productJsonLd(product, canonicalUrl));
  useJsonLd(
    breadcrumbJsonLd([
      { name: "Home", url: businessInfo.url },
      { name: "Shop", url: `${businessInfo.url}/products` },
      { name: product.name, url: canonicalUrl },
    ]),
  );

  const { add: addToBasket } = useEnquiryBasket();
  const { has: isInWishlist, toggle: toggleWishlist } = useWishlist();
  const isFavorited = isInWishlist(product.slug);
  const [activeColor, setActiveColor] = useState(product.colors?.[0] || null);
  const [previewHex, setPreviewHex] = useState(null);

  // Product choices are rendered only when the verified record explicitly
  // supplies selectable options. Legacy slug-based size guesses are not used.
  const variantOptions = useMemo(
    () => (Array.isArray(product.variantOptions) ? product.variantOptions : []),
    [product.variantOptions],
  );
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    setActiveColor(product.colors?.[0] || null);
    setPreviewHex(null);
    setSelectedVariant(variantOptions[0] || null);
  }, [product.slug, product.colors, variantOptions]);

  const [isBulkMode, setIsBulkMode] = useState(false);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isBulkMode) {
      setQuantity(product.quantityOptions?.presets?.[2] || 50);
    } else {
      setQuantity(product.quantityOptions?.presets?.[0] || 1);
    }
  }, [isBulkMode, product]);

  const baseImageUrl = product.image || "/assets/images/hero_banner.webp";
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setActiveGalleryIndex(0);
    setLightboxOpen(false);
  }, [product.slug]);

  const productImages = useMemo(() => [
    { type: "hero", src: baseImageUrl, label: "Representative product view" },
    ...(product.galleryImages || []).map((img, i) => ({
      type: `gallery-${i + 1}`,
      src: img,
      label: `Representative material view ${i + 1}`,
    })),
  ], [product.galleryImages, baseImageUrl]);

  const relatedProducts = useMemo(() => {
    if (!product.relatedSlugs) return [];
    return product.relatedSlugs
      .map((relSlug) => featuredProducts.find((p) => p.slug === relSlug))
      .filter(Boolean);
  }, [product.relatedSlugs]);

  const bundleProducts = useMemo(() => {
    if (!product.bundleWith || product.bundleWith.length === 0) return [];
    return product.bundleWith
      .map((s) => featuredProducts.find((p) => p.slug === s))
      .filter(Boolean);
  }, [product.bundleWith]);

  const recentItems = useRecentlyViewed(slug, true);
  const recentlyViewedProducts = useMemo(() => recentItems
    .map((item) => {
      const p = featuredProducts.find((fp) => fp.slug === item.slug);
      return p ? { ...p, viewedAt: item.viewedAt } : null;
    })
    .filter(Boolean), [recentItems]);

  const unit = product.quantityOptions?.unit || "units";
  const previewReference = previewHex
    ? ` I used the website's digital colour preview at *${previewHex.toUpperCase()}* as a visual reference only; please show me the nearest currently available supplier shade.`
    : "";

  const whatsappMessage = useMemo(() => {
    const qtyText = `${quantity} ${unit}`;
    const colorText = activeColor ? ` in *${activeColor.name}* supplier-listed shade` : "";
    const variantText = selectedVariant ? ` (${selectedVariant})` : "";
    const modeText = isBulkMode ? " [BULK ENQUIRY]" : "";
    return `Hello Fakhri Mart, I want to enquire about *${product.name}*${colorText}${variantText}, requested quantity *${qtyText}*${modeText}.${previewReference} Please share current availability, shade card/photos, pack details, pricing and delivery information.`;
  }, [product.name, activeColor, quantity, unit, selectedVariant, isBulkMode, previewReference]);

  const whatsappLink = createWhatsAppLink(whatsappMessage);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addedTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(addedTimerRef.current), [product.slug]);

  const handleAddToBasket = () => {
    addToBasket({
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: baseImageUrl,
      shade: activeColor,
      quantity,
      unit,
      variant: selectedVariant,
      note: previewHex
        ? `Digital colour preview ${previewHex.toUpperCase()} is a visual reference only. Please confirm the nearest current supplier shade, pack details and availability.`
        : "Please confirm current shade, pack details and availability.",
    });
    setAddedAnimation(true);
    window.clearTimeout(addedTimerRef.current);
    addedTimerRef.current = window.setTimeout(() => setAddedAnimation(false), 2_000);
  };

  const specs = useMemo(() => [
    { label: "Brand / source", value: product.brand || "Fakhri Mart catalogue" },
    { label: "Category", value: product.category },
    { label: "Catalogue note", value: product.variants || "Current details shared on enquiry" },
    { label: "Availability", value: "Confirmed when you enquire" },
    { label: "Shade guidance", value: "Request the current supplier shade card or live stock photo" },
    { label: "Delivery", value: "Available across India; timing confirmed by location" },
  ], [product]);

  const productFaqs = useMemo(() => {
    const defaultFaqs = [
      {
        q: "Do you provide bulk wholesale pricing?",
        a: "Yes. Quantity-based pricing is confirmed against the exact product, requested quantity, current availability, pack details and delivery requirement. Add the material to your enquiry basket to request a quote.",
      },
      {
        q: "Is shipping available all over India?",
        a: "Fakhri Mart supports delivery across India. Share your delivery city or postcode and the team will confirm timing and applicable charges before the order is finalised.",
      },
      {
        q: "Can I request more than one shade?",
        a: "Yes. Mention the shade names or codes and quantities you need in your enquiry. The digital colour preview is only for visual exploration; the store confirms the nearest current supplier shades before the order is finalised.",
      },
    ];

    if (product.category.includes("Yarn")) {
      return [
        ...defaultFaqs,
        {
          q: "What is the recommended hook or needle size?",
          a: `The best size depends on the current ${product.name} pack specifications, your gauge and the fabric you want. Ask for the current label details before ordering.`,
        },
        {
          q: "How should I wash and care for this yarn?",
          a: "Please follow the care instructions on the supplied pack label. Fakhri Mart can share the current label details before you order.",
        },
      ];
    }

    if (product.category.includes("Macrame")) {
      return [
        ...defaultFaqs,
        {
          q: "Can I comb or fringe this cord?",
          a: "Fringing depends on the actual cord construction. Tell the store the finish you need and ask them to confirm the current construction before ordering.",
        },
      ];
    }

    return defaultFaqs;
  }, [product]);

  return (
    <>
      <StickyBreadcrumb categoryName={product.category} productName={product.name} />

      <section className="section product-detail-section">
        <div className="container">
          <div className="product-detail-grid">
            <div className="product-detail-visual">
              <div className="sticky-visual-wrapper">
                <div
                  className="product-image-container product-detail-image-stage shade-preview-surface group"
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
                  <ShadePreviewTint value={activeGalleryIndex === 0 ? previewHex : null} />
                  <div className="image-zoom-overlay-badge" style={{ position: "absolute", bottom: "16px", right: "16px", zIndex: 5, background: "rgba(0,0,0,0.5)", color: "#fff", padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ArrowsOut size={16} />
                  </div>
                </div>

                <div className="gallery-thumbnail-strip" style={{ marginTop: "16px" }}>
                  <span className="thumbnail-label" style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "var(--text-muted)" }}>Representative material views</span>
                  <div className="thumbnail-grid-row" style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "6px" }}>
                    {productImages.map((img, i) => {
                      const isSelected = activeGalleryIndex === i;
                      return (
                        <button
                          key={img.src}
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
                            background: "#fff",
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

            <div className="product-detail-content">
              <div className="product-badges-row-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div className="product-badges-row" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  <span className="category-tag-pill">{product.category}</span>
                  {(product.badges || []).map((badge) => (
                    <span key={badge} className="feature-tag-pill">{badge}</span>
                  ))}
                </div>

                <div className="detail-header-actions" style={{ display: "flex", gap: "8px" }}>
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
                      cursor: "pointer",
                    }}
                  >
                    <Heart size={16} weight={isFavorited ? "fill" : "regular"} />
                  </button>
                </div>
              </div>

              <h1 className="product-detail-title-new">{product.name}</h1>
              <p className="product-detail-variant-info">{product.variants}</p>
              <p className="product-image-note">{product.imageNote}</p>

              <div className="product-detail-stock-row" style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "20px", padding: "12px 0", borderBottom: "1px solid var(--line)", borderTop: "1px solid var(--line)" }}>
                <ShadeCardButton product={product} shade={activeColor} size="lg" />
              </div>

              <div className="product-trust-badges-bar">
                <span><Truck size={15} /> All-India Delivery</span>
                <span><Percent size={15} /> Wholesale Enquiries</span>
                <span><ShieldCheck size={15} /> Details Confirmed on Enquiry</span>
              </div>

              <div style={{ margin: "16px 0" }}>
                <p style={{ color: "var(--muted, #544C43)", fontSize: "0.9rem" }}>Delivery is supported across India. Confirm exact timing and charges on WhatsApp.</p>
              </div>

              <div className="product-detail-desc-box">
                <p>{product.description}</p>
              </div>

              {variantOptions.length > 0 ? (
                <div className="detail-section-configured">
                  <span className="configure-label">Select verified option:</span>
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
              ) : null}

              {product.colors && product.colors.length > 0 ? (
                <div className="detail-section-configured">
                  <ColorSwatchPicker colors={product.colors} activeColor={activeColor} onSelect={setActiveColor} />
                </div>
              ) : null}

              <div className="detail-section-configured">
                <ShadePreviewStudio
                  value={previewHex}
                  onChange={(hex) => {
                    setPreviewHex(hex);
                    setActiveGalleryIndex(0);
                  }}
                />
              </div>

              <div className="detail-section-configured border-split">
                <div className="mode-toggle-container">
                  <span className="configure-label">Enquiry mode:</span>
                  <div className="mode-toggle-buttons">
                    <button type="button" className={`mode-btn ${!isBulkMode ? "active" : ""}`} onClick={() => setIsBulkMode(false)}>Retail</button>
                    <button type="button" className={`mode-btn ${isBulkMode ? "active" : ""}`} onClick={() => setIsBulkMode(true)}>Bulk / Wholesale</button>
                  </div>
                </div>

                <QuantitySelector
                  options={{
                    ...product.quantityOptions,
                    presets: isBulkMode
                      ? [50, 100, 200, 500].filter((p) => p <= (product.quantityOptions?.max || 500))
                      : (product.quantityOptions?.presets || [1, 6, 12, 24]),
                  }}
                  value={quantity}
                  onChange={setQuantity}
                />

                {isBulkMode ? (
                  <p className="bulk-guidance-text">
                    <strong>Bulk enquiry:</strong> Fakhri Mart will confirm quantity-based pricing, current pack details and the delivery quote for your requirement.
                  </p>
                ) : null}
              </div>

              <div className="detail-section-configured action-buttons-group">
                <div className="main-actions-flex">
                  <a className="btn btn-whatsapp btn-large flex-grow-btn" href={whatsappLink} target="_blank" rel="noreferrer">
                    <ChatCircleDots size={20} /> WhatsApp Enquiry
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

                <div className="utility-buttons-row">
                  <ShareButton
                    url={typeof window !== "undefined" ? window.location.href : ""}
                    title={`${product.name} | Fakhri Mart`}
                    text={`${product.name} from Fakhri Mart`}
                  />
                  <a
                    href={createWhatsAppLink(`Hello Fakhri Mart, I would like a current bulk quotation for *${product.name}*. Please confirm pack details, available shades, quantity pricing and delivery.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="utility-action-link-btn"
                  >
                    <Tag size={14} /> Ask Bulk Price
                  </a>
                </div>
              </div>

              <div className="detail-section-configured border-split best-for-pills-section">
                <span className="configure-label">Ideal for:</span>
                <div className="ideal-uses-chips">
                  {product.suitableFor.split(",").map((use) => (
                    <span key={use} className="ideal-use-chip">{use.trim()}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-tinted border-top-line enquiry-how-it-works-detail">
        <div className="container">
          <div className="section-head text-center" style={{ marginBottom: "40px" }}>
            <p className="eyebrow" style={{ display: "inline-block" }}>Simple steps</p>
            <h2>How Your Enquiry Works</h2>
            <p>Fakhri Mart operates as an enquiry-first digital catalogue. Payment is not taken on this website.</p>
          </div>
          <div className="enquiry-timeline-grid">
            <div className="timeline-step-card">
              <span className="step-num">01</span>
              <h4>Add Your Materials</h4>
              <p>Select the product lines and requested quantities you need. Add a note for shade codes, pack questions or project requirements.</p>
            </div>
            <div className="timeline-step-card">
              <span className="step-num">02</span>
              <h4>Review & Submit</h4>
              <p>Review the enquiry list and send the combined requirement to Fakhri Mart on WhatsApp.</p>
            </div>
            <div className="timeline-step-card">
              <span className="step-num">03</span>
              <h4>Confirm & Complete</h4>
              <p>The store confirms current availability, shade/pack details, final pricing and delivery information directly with you.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-light-details border-top-line">
        <div className="container">
          <div className="tabs-content-grid">
            <div className="detail-info-block shadow-card-premium">
              <h3 className="info-block-title"><Info size={18} /> Specifications</h3>
              <table className="specs-table-design">
                <tbody>
                  {specs.map((spec) => (
                    <tr key={spec.label}><th>{spec.label}</th><td>{spec.value}</td></tr>
                  ))}
                </tbody>
              </table>
              <span className="specs-table-disclaimer">* Exact material specifications, pack details and shade availability are confirmed from the current product information during enquiry.</span>
            </div>

            <div className="detail-info-block shadow-card-premium">
              <h3 className="info-block-title"><Question size={18} /> Product FAQs</h3>
              <ProductFaq productSlug={product.slug} faqs={productFaqs} />
            </div>
          </div>
        </div>
      </section>

      {bundleProducts.length > 0 ? (
        <section className="section bg-light border-top-line">
          <div className="container">
            <div className="section-head text-center" style={{ marginBottom: "32px" }}>
              <p className="eyebrow" style={{ display: "inline-block" }}>Suggested set</p>
              <h2>Catalogue Items to Consider Together</h2>
              <p>These links come from the catalogue relationship data, not from live sales statistics.</p>
            </div>
            <div className="card-grid product-grid">
              {bundleProducts.map((bProduct) => <ProductCard key={bProduct.slug} product={bProduct} compact />)}
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
                    quantity,
                    unit,
                    variant: selectedVariant,
                    note: previewHex ? `Digital colour preview ${previewHex.toUpperCase()} is a visual reference only.` : "",
                  });
                  bundleProducts.forEach((bp) => {
                    addToBasket({
                      slug: bp.slug,
                      name: bp.name,
                      category: bp.category,
                      image: bp.image,
                      quantity: bp.quantityOptions?.min || 1,
                      unit: bp.quantityOptions?.unit || "units",
                    });
                  });
                }}
              >
                <ShoppingBag size={16} aria-hidden="true" /> Add all to Enquiry Basket
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {relatedProducts.length > 0 ? (
        <section className="section bg-light border-top-line">
          <div className="container">
            <div className="section-head text-center" style={{ marginBottom: "32px" }}>
              <p className="eyebrow" style={{ display: "inline-block" }}>Related</p>
              <h2>Related Catalogue Lines</h2>
              <p>Explore nearby options from the same material family.</p>
            </div>
            <div className="card-grid product-grid">
              {relatedProducts.map((relProduct) => <ProductCard key={relProduct.slug} product={relProduct} compact />)}
            </div>
          </div>
        </section>
      ) : null}

      {recentlyViewedProducts.length > 0 ? (
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
                  {recentProduct.viewedAt ? (
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
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {lightboxOpen ? (
        <Lightbox
          images={productImages}
          activeIndex={activeGalleryIndex}
          onIndexChange={setActiveGalleryIndex}
          onClose={() => setLightboxOpen(false)}
          previewHex={previewHex}
        />
      ) : null}

      <section className="container">
        <CatalogueCta />
      </section>
    </>
  );
}
