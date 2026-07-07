import { MessageCircle, ShoppingBag, ArrowRight, Trash2, Plus, Minus, Inbox, Heart, Eye } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import EnquiryForm from "../components/EnquiryForm.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { catalogueMessage, createWhatsAppLink, featuredProducts } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

export default function Enquiry() {
  useDocumentMeta({
    title: "Enquiry Basket & Favorites | Fakhri Mart",
    description: "Submit your enquiry basket details or view your favorited yarns and craft supplies.",
  });

  const { basket, remove: removeFromBasket, updateQuantity, clear: clearBasket, count: basketCount } = useEnquiryBasket();
  const { wishlist, remove: removeFromWishlist, count: wishlistCount } = useWishlist();
  
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("basket"); // "basket" or "favorites"

  // Sync tab state with query parameters (e.g. ?tab=favorites)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "favorites" || tab === "wishlist") {
      setActiveTab("favorites");
    } else {
      setActiveTab("basket");
    }
  }, [searchParams]);

  // Load wishlist items full data
  const wishlistProducts = useMemo(() => {
    return wishlist
      .map((slug) => featuredProducts.find((p) => p.slug === slug))
      .filter(Boolean);
  }, [wishlist]);

  // Quick action: Add favorite item to basket
  const { add: addToBasket } = useEnquiryBasket();
  const [addedItemSlugs, setAddedItemSlugs] = useState({});

  const handleAddFavToBasket = (product) => {
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
    setAddedItemSlugs(prev => ({ ...prev, [product.slug]: true }));
    setTimeout(() => {
      setAddedItemSlugs(prev => ({ ...prev, [product.slug]: false }));
    }, 2000);
  };

  return (
    <>
      <PageHero
        eyebrow="My Account List"
        title={activeTab === "basket" ? "Review Your Enquiry Details" : "My Saved Yarns & Tools"}
        text="Review selected craft products, adjust wholesale quantities, manage saved favorites, and submit your list on WhatsApp for exact quotes."
      >
        <ProductVisual palette={["#35b8ad", "#f6a7b8", "#c99b6b"]} />
      </PageHero>

      {/* Tabs Selector Bar */}
      <section className="tabs-navigation-strip" style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.08)", position: "sticky", top: "var(--header-offset, 104px)", zIndex: 40 }}>
        <div className="container" style={{ display: "flex", gap: "24px" }}>
          <button
            type="button"
            className={`tab-toggle-link-btn ${activeTab === "basket" ? "active" : ""}`}
            onClick={() => setActiveTab("basket")}
            style={{
              padding: "16px 8px",
              border: "none",
              background: "none",
              borderBottom: activeTab === "basket" ? "3px solid var(--primary)" : "3px solid transparent",
              color: activeTab === "basket" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <ShoppingBag size={18} />
            Enquiry Basket ({basketCount})
          </button>
          <button
            type="button"
            className={`tab-toggle-link-btn ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
            style={{
              padding: "16px 8px",
              border: "none",
              background: "none",
              borderBottom: activeTab === "favorites" ? "3px solid var(--primary)" : "3px solid transparent",
              color: activeTab === "favorites" ? "var(--primary)" : "var(--text-muted)",
              fontWeight: "600",
              fontSize: "15px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Heart size={18} />
            My Favorites ({wishlistCount})
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {activeTab === "basket" ? (
            /* Tab 1: Enquiry Basket view */
            basket.length > 0 ? (
              <div className="enquiry-page-split-layout">
                {/* Left Column: Basket Items List */}
                <Reveal variant="slide-left" className="enquiry-basket-items-panel">
                  <div className="basket-panel-header">
                    <h2 className="basket-title-flex">
                      <ShoppingBag size={24} />
                      Items in Basket ({basket.length})
                    </h2>
                    <button type="button" className="clear-basket-text-btn font-semibold" onClick={clearBasket}>
                      Clear Basket
                    </button>
                  </div>

                  <div className="basket-items-list-wrapper">
                    {basket.map((item, index) => (
                      <div key={`${item.slug}-${item.shade?.hex || ""}-${item.variant || ""}`} className="basket-item-card-row">
                        {/* Thumbnail Image */}
                        <div className="basket-item-img-container">
                          <img src={item.image} alt={item.name} />
                          {item.shade && (
                            <div
                              className="basket-item-color-indicator"
                              style={{ backgroundColor: item.shade.hex }}
                              title={`Shade: ${item.shade.name}`}
                            />
                          )}
                        </div>

                        {/* Content details */}
                        <div className="basket-item-info-col">
                          <span className="basket-item-category-label">{item.category}</span>
                          <h4 className="basket-item-name-heading">
                            <Link to={`/products/${item.slug}`}>{item.name}</Link>
                          </h4>
                          
                          <div className="basket-item-selected-meta">
                            {item.shade && (
                              <span className="meta-badge-text">
                                Shade: <strong>{item.shade.name}</strong>
                              </span>
                            )}
                            {item.variant && (
                              <span className="meta-badge-text">
                                Option: <strong>{item.variant}</strong>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity control */}
                        <div className="basket-item-qty-col">
                          <div className="custom-stepper-controls stepper-compact">
                            <button
                              type="button"
                              className="stepper-action-btn"
                              onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))}
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="stepper-compact-display">{item.quantity}</span>
                            <button
                              type="button"
                              className="stepper-action-btn"
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="basket-item-unit-label">{item.unit}</span>
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          className="basket-item-remove-icon-btn"
                          onClick={() => removeFromBasket(index)}
                          title="Remove product"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Reveal>

                {/* Right Column: Contact Details Form */}
                <Reveal delay={120} variant="slide-right" className="enquiry-form-panel">
                  <div className="enquiry-form-header-box">
                    <h3>Contact & Shipping Details</h3>
                    <p>Provide your delivery information below to send your enquiry list directly to our team on WhatsApp.</p>
                  </div>
                  <EnquiryForm basket={basket} onClearBasket={clearBasket} />
                </Reveal>
              </div>
            ) : (
              <div className="enquiry-layout">
                {/* Default Empty State Page */}
                <Reveal variant="slide-left">
                  <p className="eyebrow">Fast Response</p>
                  <h2>Send details once, then continue on WhatsApp.</h2>
                  <p>
                    Add yarns and accessories to your quote basket, or fill the general form below. We support both retail and wholesale business buyers.
                  </p>
                  <div className="empty-basket-cta-card">
                    <div className="empty-basket-icon-circle">
                      <Inbox size={32} />
                    </div>
                    <h3>Your Enquiry Basket is Empty</h3>
                    <p>Browse our catalogue of yarns, cords, and craft accessories to compile your bulk list.</p>
                    <Link to="/products" className="btn btn-primary btn-small">
                      Browse Products
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                  <div style={{ marginTop: "24px" }}>
                    <a className="btn btn-whatsapp" href={createWhatsAppLink(catalogueMessage)} target="_blank" rel="noreferrer">
                      <MessageCircle size={18} />
                      WhatsApp Catalogue Request
                    </a>
                  </div>
                </Reveal>
                <Reveal delay={120} variant="slide-right">
                  <EnquiryForm />
                </Reveal>
              </div>
            )
          ) : (
            /* Tab 2: Favorites / Wishlist view */
            wishlistProducts.length > 0 ? (
              <Reveal variant="fade-up" className="favorites-tab-panel" style={{ maxWidth: "800px", marginInline: "auto" }}>
                <div className="basket-panel-header" style={{ marginBottom: "20px" }}>
                  <h2 className="basket-title-flex">
                    <Heart size={24} style={{ fill: "currentColor" }} />
                    My Saved Favorites ({wishlistProducts.length})
                  </h2>
                </div>

                <div className="basket-items-list-wrapper" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {wishlistProducts.map((product) => {
                    const isAdded = addedItemSlugs[product.slug];
                    return (
                      <div key={product.slug} className="basket-item-card-row fav-row-details" style={{ padding: "16px", background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "8px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
                        {/* Image */}
                        <div className="basket-item-img-container" style={{ width: "70px", height: "70px" }}>
                          <img src={product.image} alt={product.name} />
                        </div>

                        {/* Name & details */}
                        <div className="basket-item-info-col" style={{ flexGrow: 1, minWidth: "200px" }}>
                          <span className="basket-item-category-label">{product.category}</span>
                          <h4 className="basket-item-name-heading" style={{ margin: "2px 0 6px" }}>
                            <Link to={`/products/${product.slug}`}>{product.name}</Link>
                          </h4>
                          <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{product.variants}</span>
                        </div>

                        {/* Actions */}
                        <div className="fav-item-actions-flex" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                          <button
                            type="button"
                            className={`btn btn-outline btn-small ${isAdded ? 'btn-success' : ''}`}
                            onClick={() => handleAddFavToBasket(product)}
                          >
                            <ShoppingBag size={14} />
                            {isAdded ? "Added" : "Add to Basket"}
                          </button>
                          
                          <Link to={`/products/${product.slug}`} className="btn btn-outline btn-small" style={{ display: "inline-flex", gap: "4px" }}>
                            <Eye size={14} />
                            Details
                          </Link>

                          <button
                            type="button"
                            className="basket-item-remove-icon-btn"
                            onClick={() => removeFromWishlist(product.slug)}
                            title="Remove from favorites"
                            style={{ padding: "8px", border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Reveal>
            ) : (
              <div className="empty-favorites-view" style={{ textAlign: "center", padding: "60px 20px", maxWidth: "500px", marginInline: "auto" }}>
                <Heart size={48} style={{ color: "var(--accent-rose)", marginBottom: "16px" }} />
                <h3>No favorites saved yet</h3>
                <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
                  Save products you are interested in while browsing our catalogue, and they will show up here for quick actions.
                </p>
                <Link to="/products" className="btn btn-primary">
                  Browse Products
                  <ArrowRight size={16} />
                </Link>
              </div>
            )
          )}
        </div>
      </section>
    </>
  );
}
