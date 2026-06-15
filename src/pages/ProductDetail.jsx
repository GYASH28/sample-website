import { ArrowRight, ChevronRight, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import CatalogueCta from "../components/CatalogueCta.jsx";
import ColorSwatchPicker from "../components/ColorSwatchPicker.jsx";
import IconBadge from "../components/IconBadge.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import QuantitySelector from "../components/QuantitySelector.jsx";
import Reveal from "../components/Reveal.jsx";
import WhatsAppIcon from "../components/WhatsAppIcon.jsx";
import { createWhatsAppLink, featuredProducts } from "../data/siteData.js";
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
    title: product.name,
    description: product.description,
  });

  const [activeColor, setActiveColor] = useState(product.colors?.[0] || null);
  const [quantity, setQuantity] = useState(product.quantityOptions?.presets[0] || 1);

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

  // Build the dynamic WhatsApp message
  const whatsappMessage = useMemo(() => {
    const qtyText = `${quantity} ${product.quantityOptions?.unit || "pcs"}`;
    const colorText = activeColor ? ` in *${activeColor.name}* shade` : "";
    return `Hello Fakhri Mart, I want to enquire about *${product.name}*${colorText}, quantity *${qtyText}*. Please share availability, pricing and bulk options.`;
  }, [product, activeColor, quantity]);

  const whatsappLink = createWhatsAppLink(whatsappMessage);

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
                <ProductVisual
                  palette={product.palette}
                  activeColor={activeColor?.hex}
                />
              </div>
            </div>

            {/* Right Column: Details & Actions */}
            <div className="product-detail-content">
              <div className="product-badges" style={{ justifyContent: "flex-start", marginBottom: "16px" }}>
                <span className="category-pill">{product.category}</span>
                {product.badges.map((badge) => (
                  <span key={badge}>{badge}</span>
                ))}
              </div>

              <h1 className="product-detail-title">{product.name}</h1>
              <p className="product-detail-tagline">{product.variants}</p>

              <div className="product-detail-desc">
                <p>{product.description}</p>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div className="detail-section">
                  <ColorSwatchPicker
                    colors={product.colors}
                    activeColor={activeColor}
                    onSelect={setActiveColor}
                  />
                </div>
              )}

              {product.quantityOptions && (
                <div className="detail-section">
                  <QuantitySelector
                    options={product.quantityOptions}
                    value={quantity}
                    onChange={setQuantity}
                  />
                </div>
              )}

              <div className="detail-section detail-action-section">
                <a
                  className="btn btn-whatsapp btn-large"
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon size={20} />
                  Enquire on WhatsApp
                </a>
                <p className="action-hint">
                  Clicking this will open WhatsApp with your selected colour and quantity ready to send.
                </p>
              </div>

              <div className="detail-section best-for-section">
                <h3>Best For</h3>
                <p>{product.suitableFor}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="section bg-light">
          <div className="container">
            <Reveal variant="fade-up">
              <div className="section-head text-center" style={{ marginBottom: "32px" }}>
                <h2>You May Also Like</h2>
                <p>Explore related products from our collection.</p>
              </div>
              <div className="card-grid product-grid">
                {relatedProducts.map((relProduct) => (
                  <ProductCard key={relProduct.slug} product={relProduct} compact />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewedProducts.length > 0 && (
        <section className="section" style={{ paddingTop: relatedProducts.length ? "0" : "82px" }}>
          <div className="container">
            <Reveal variant="fade-up">
              <div className="section-head text-center" style={{ marginBottom: "32px" }}>
                <h2>Recently Viewed</h2>
              </div>
              <div className="card-grid product-grid">
                {recentlyViewedProducts.map((recentProduct) => (
                  <ProductCard key={recentProduct.slug} product={recentProduct} compact />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="container">
        <Reveal variant="fade-up">
          <CatalogueCta />
        </Reveal>
      </section>
    </>
  );
}
