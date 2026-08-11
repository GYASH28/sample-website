import {
  ArrowRight,
  ChatCircleDots,
  Heart,
  Trash,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useWishlist } from "../hooks/useWishlist.js";
import { featuredProducts } from "../data/siteData.js";
import { smartWhatsAppLink } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import ProductCard from "../components/ProductCard.jsx";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

export default function Wishlist() {
  useDocumentMeta({
    title: "Wishlist | Fakhri Mart",
    description: "Your saved favourite yarns and craft products.",
    canonical: "/wishlist",
    robots: "noindex, follow",
  });
  const { wishlist, add, remove, clear, count } = useWishlist();
  const [recovery, setRecovery] = useState(null);
  const recoveryTimerRef = useRef(null);

  useEffect(() => {
    return () => window.clearTimeout(recoveryTimerRef.current);
  }, []);

  const offerRecovery = (slugs, message) => {
    window.clearTimeout(recoveryTimerRef.current);
    setRecovery({ slugs, message });
    recoveryTimerRef.current = window.setTimeout(() => setRecovery(null), 5_000);
  };

  const removeWithRecovery = (product) => {
    remove(product.slug);
    offerRecovery([product.slug], `${product.name} removed from your wishlist.`);
  };

  const clearWithRecovery = () => {
    const removedSlugs = [...wishlist];
    clear();
    offerRecovery(removedSlugs, "Wishlist cleared.");
  };

  const undoRecovery = () => {
    for (const slug of recovery?.slugs || []) add(slug);
    window.clearTimeout(recoveryTimerRef.current);
    setRecovery(null);
  };

  const wishlistProducts = wishlist
    .map((slug) => featuredProducts.find((p) => p.slug === slug))
    .filter(Boolean);

  const enquireAllLink = smartWhatsAppLink({
    type: "wishlist",
    items: wishlistProducts,
  });

  return (
    <>
      <section className="page-hero" style={{ padding: "120px 0 40px" }}>
        <div className="container">
          <Reveal variant="fade-up">
            <p className="eyebrow">Your Wishlist</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "12px" }}>
              Wishlist
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: "560px" }}>
              {wishlistProducts.length > 0
                ? "Your saved favourites are ready. Enquire all at once on WhatsApp, or open a product detail page."
                : "Your wishlist is empty. Browse products and save your favourites."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "20px" }}>
        <div className="container">
          {wishlistProducts.length === 0 ? (
            <Reveal variant="scale-in" className="empty-wishlist">
              <div style={{ textAlign: "center", padding: "60px 20px", maxWidth: "480px", margin: "0 auto" }}>
                <div style={{
                  width: 80, height: 80, borderRadius: "50%",
                  background: "var(--pink-soft)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  margin: "0 auto 20px",
                }}>
                  <Heart size={36} style={{ color: "var(--pink-dark)" }} aria-hidden="true" />
                </div>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", marginBottom: "10px" }}>
                  No favourites yet
                </h2>
                <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
                  Your wishlist is empty. Browse products and save your favourites.
                </p>
                <Link to="/products" className="btn btn-primary">
                  Browse Products
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ) : (
            <>
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                flexWrap: "wrap", gap: "16px", marginBottom: "24px",
                padding: "16px 20px", background: "var(--surface)",
                borderRadius: "var(--radius-lg)", border: "1px solid var(--line)",
              }}>
                <div>
                  <strong style={{ fontSize: "1.1rem", color: "var(--charcoal)" }}>
                    {count} {count === 1 ? "product" : "products"} saved
                  </strong>
                  <p style={{ fontSize: "0.85rem", color: "var(--muted)", margin: "2px 0 0" }}>
                    Enquire all on WhatsApp in one message.
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href={enquireAllLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp btn-small"
                    aria-label="Enquire about all wishlist items on WhatsApp"
                  >
                    <ChatCircleDots size={16} aria-hidden="true" />
                    Enquire About All
                  </a>
                  <button
                    type="button"
                    onClick={clearWithRecovery}
                    className="btn btn-outline btn-small"
                    style={{ color: "var(--pink-dark)" }}
                    aria-label="Clear all wishlist items"
                  >
                    <Trash size={14} aria-hidden="true" />
                    Clear All
                  </button>
                </div>
              </div>

              <div className="card-grid product-grid">
                {wishlistProducts.map((product) => (
                  <div key={product.slug} className="wishlist-card-shell">
                    <ProductCard product={product} showWishlistAction={false} />
                    <button
                      type="button"
                      className="wishlist-remove-action"
                      onClick={() => removeWithRecovery(product)}
                      aria-label={`Remove ${product.name} from wishlist`}
                    >
                      <Trash size={15} aria-hidden="true" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      {recovery ? (
        <div className="wishlist-recovery-toast" role="status" aria-live="polite">
          <span>{recovery.message}</span>
          <button type="button" onClick={undoRecovery}>Undo</button>
        </div>
      ) : null}
    </>
  );
}
