import {
  ArrowRight,
  ChatCircleDots,
  Eye,
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  Trash,
  Tray,
} from "@phosphor-icons/react";
import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import EnquiryForm from "../components/EnquiryForm.jsx";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { catalogueMessage, createWhatsAppLink, featuredProducts } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

export default function Enquiry() {
  useDocumentMeta({
    title: "Enquiry Basket & Favorites | Fakhri Mart",
    description: "Review saved Fakhri Mart material lines, requested quantities and notes, then send one organised WhatsApp enquiry for current shades, pricing and delivery details.",
  });

  const {
    basket,
    remove: removeFromBasket,
    updateQuantity,
    updateItem,
    clear: clearBasket,
    count: basketCount,
  } = useEnquiryBasket();
  const { wishlist, remove: removeFromWishlist, count: wishlistCount } = useWishlist();

  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("basket");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "favorites" || tab === "wishlist") {
      setActiveTab("favorites");
    } else {
      setActiveTab("basket");
    }
  }, [searchParams]);

  const wishlistProducts = useMemo(() => {
    return wishlist
      .map((slug) => featuredProducts.find((p) => p.slug === slug))
      .filter(Boolean);
  }, [wishlist]);

  const { add: addToBasket } = useEnquiryBasket();
  const [addedItemSlugs, setAddedItemSlugs] = useState({});
  const favoriteFeedbackTimerRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(favoriteFeedbackTimerRef.current);
  }, []);

  const handleAddFavToBasket = (product) => {
    const basketItem = {
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.image,
      shade: product.colors?.[0] || null,
      quantity: product.quantityOptions?.presets?.[0] || 1,
      unit: product.quantityOptions?.unit || "units",
      variant: null,
      note: "Please confirm current shade, pack details and availability.",
    };
    addToBasket(basketItem);
    setAddedItemSlugs({ [product.slug]: true });
    window.clearTimeout(favoriteFeedbackTimerRef.current);
    favoriteFeedbackTimerRef.current = window.setTimeout(() => {
      setAddedItemSlugs({});
    }, 2_000);
  };

  return (
    <>
      <PageHero
        motif="focus"
        eyebrow="Your material list"
        title={activeTab === "basket" ? "Review your enquiry details" : "Your saved materials"}
        text="Check the material lines, requested quantities and notes, then send one organised WhatsApp enquiry for current shades, pack details, pricing and delivery."
      >
        <picture className="catalogue-hero-photo">
          <source srcSet="/assets/images/editorial/shade-library.avif" type="image/avif" />
          <img
            src="/assets/images/editorial/shade-library.webp"
            alt="Representative yarn, thread and cord materials arranged by colour"
            width="1536"
            height="1024"
          />
        </picture>
      </PageHero>

      <section className="tabs-navigation-strip" style={{ background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.08)", position: "sticky", top: "var(--header-offset, 104px)", zIndex: 40 }}>
        <div className="container" style={{ display: "flex", gap: "24px" }}>
          <button
            type="button"
            className={`tab-toggle-link-btn ${activeTab === "basket" ? "active" : ""}`}
            onClick={() => setActiveTab("basket")}
            style={{ padding: "16px 8px", border: "none", background: "none", borderBottom: activeTab === "basket" ? "3px solid var(--primary)" : "3px solid transparent", color: activeTab === "basket" ? "var(--primary)" : "var(--text-muted)", fontWeight: "600", fontSize: "15px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <ShoppingBag size={18} />
            Enquiry Basket ({basketCount})
          </button>
          <button
            type="button"
            className={`tab-toggle-link-btn ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
            style={{ padding: "16px 8px", border: "none", background: "none", borderBottom: activeTab === "favorites" ? "3px solid var(--primary)" : "3px solid transparent", color: activeTab === "favorites" ? "var(--primary)" : "var(--text-muted)", fontWeight: "600", fontSize: "15px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <Heart size={18} />
            My Favorites ({wishlistCount})
          </button>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {activeTab === "basket" ? (
            basket.length > 0 ? (
              <div className="enquiry-page-split-layout">
                <Reveal variant="slide-left" className="enquiry-basket-items-panel">
                  <div className="basket-panel-header">
                    <h2 className="basket-title-flex"><ShoppingBag size={24} />Items in Basket ({basket.length})</h2>
                    <button type="button" className="clear-basket-text-btn font-semibold" onClick={clearBasket}>Clear Basket</button>
                  </div>

                  <div className="basket-items-list-wrapper">
                    {basket.map((item, index) => (
                      <div key={`${item.slug}-${item.shade?.hex || ""}-${item.variant || ""}`} className="basket-item-card-row">
                        <div className="basket-item-img-container">
                          <img src={item.image} alt={item.name} />
                          {item.shade ? <div className="basket-item-color-indicator" style={{ backgroundColor: item.shade.hex }} title={`Shade: ${item.shade.name}`} /> : null}
                        </div>

                        <div className="basket-item-info-col">
                          <span className="basket-item-category-label">{item.category}</span>
                          <h4 className="basket-item-name-heading"><Link to={`/products/${item.slug}`}>{item.name}</Link></h4>
                          <div className="basket-item-selected-meta">
                            {item.shade ? <span className="meta-badge-text">Shade: <strong>{item.shade.name}</strong></span> : null}
                            {item.variant ? <span className="meta-badge-text">Option: <strong>{item.variant}</strong></span> : null}
                          </div>
                          <label className="basket-item-note">
                            <span>Note for this item</span>
                            <input
                              type="text"
                              value={item.note || ""}
                              onChange={(event) => updateItem(index, { note: event.target.value })}
                              placeholder="Shade code, pack question or intended use"
                              maxLength={160}
                            />
                          </label>
                        </div>

                        <div className="basket-item-qty-col">
                          <div className="custom-stepper-controls stepper-compact">
                            <button type="button" className="stepper-action-btn" onClick={() => updateQuantity(index, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1} aria-label="Decrease requested quantity"><Minus size={13} /></button>
                            <span className="stepper-compact-display">{item.quantity}</span>
                            <button type="button" className="stepper-action-btn" onClick={() => updateQuantity(index, item.quantity + 1)} aria-label="Increase requested quantity"><Plus size={13} /></button>
                          </div>
                          <span className="basket-item-unit-label">{item.unit || "units"}</span>
                        </div>

                        <button type="button" className="basket-item-remove-icon-btn" onClick={() => removeFromBasket(index)} title="Remove product" aria-label="Remove item"><Trash size={16} /></button>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={120} variant="slide-right" className="enquiry-form-panel">
                  <div className="enquiry-form-header-box">
                    <h3>Contact & Delivery Details</h3>
                    <p>Provide the details below to send your material list to the Fakhri Mart team on WhatsApp. The store will confirm current availability, shades, pack details, pricing and delivery.</p>
                  </div>
                  <EnquiryForm basket={basket} onClearBasket={clearBasket} />
                </Reveal>
              </div>
            ) : (
              <div className="enquiry-layout">
                <Reveal variant="slide-left">
                  <p className="eyebrow">Fast Response</p>
                  <h2>Send the useful details once, then continue on WhatsApp.</h2>
                  <p>Add verified yarn, thread, embroidery, macrame or dori lines to your enquiry basket, or use the general form. Retail and bulk requirements are both welcome.</p>
                  <div className="empty-basket-cta-card">
                    <div className="empty-basket-icon-circle"><Tray size={32} /></div>
                    <h3>Your Enquiry Basket is Empty</h3>
                    <p>Browse the verified catalogue and build a material list for your project, repeat order or wholesale requirement.</p>
                    <Link to="/products" className="btn btn-primary btn-small">Browse Products <ArrowRight size={16} /></Link>
                  </div>
                  <div style={{ marginTop: "24px" }}>
                    <a className="btn btn-whatsapp" href={createWhatsAppLink(catalogueMessage)} target="_blank" rel="noreferrer"><ChatCircleDots size={18} />WhatsApp Catalogue Request</a>
                  </div>
                </Reveal>
                <Reveal delay={120} variant="slide-right"><EnquiryForm /></Reveal>
              </div>
            )
          ) : wishlistProducts.length > 0 ? (
            <Reveal variant="fade-up" className="favorites-tab-panel" style={{ maxWidth: "800px", marginInline: "auto" }}>
              <div className="basket-panel-header" style={{ marginBottom: "20px" }}>
                <h2 className="basket-title-flex"><Heart size={24} style={{ fill: "currentColor" }} />My Saved Favorites ({wishlistProducts.length})</h2>
              </div>

              <div className="basket-items-list-wrapper" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {wishlistProducts.map((product) => {
                  const isAdded = addedItemSlugs[product.slug];
                  return (
                    <div key={product.slug} className="basket-item-card-row fav-row-details" style={{ padding: "16px", background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "8px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
                      <div className="basket-item-img-container" style={{ width: "70px", height: "70px" }}><img src={product.image} alt={product.name} /></div>
                      <div className="basket-item-info-col" style={{ flexGrow: 1, minWidth: "200px" }}>
                        <span className="basket-item-category-label">{product.category}</span>
                        <h4 className="basket-item-name-heading" style={{ margin: "2px 0 6px" }}><Link to={`/products/${product.slug}`}>{product.name}</Link></h4>
                        <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{product.variants}</span>
                      </div>
                      <div className="fav-item-actions-flex" style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button type="button" className={`btn btn-outline btn-small ${isAdded ? "btn-success" : ""}`} onClick={() => handleAddFavToBasket(product)}><ShoppingBag size={14} />{isAdded ? "Added" : "Add to Basket"}</button>
                        <Link to={`/products/${product.slug}`} className="btn btn-outline btn-small" style={{ display: "inline-flex", gap: "4px" }}><Eye size={14} />Details</Link>
                        <button type="button" className="basket-item-remove-icon-btn" onClick={() => removeFromWishlist(product.slug)} title="Remove from favorites" style={{ padding: "8px", border: "none", background: "none", cursor: "pointer", color: "var(--text-muted)" }}><Trash size={16} /></button>
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
              <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Save verified material lines while browsing the catalogue and they will stay here for quick comparison and enquiry building.</p>
              <Link to="/products" className="btn btn-primary">Browse Products <ArrowRight size={16} /></Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
