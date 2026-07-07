import { Heart, Trash2, MessageCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "../hooks/useWishlist.js";
import { featuredProducts, createWhatsAppLink } from "../data/siteData.js";
import { smartWhatsAppLink } from "../i18n.jsx";
import Reveal from "../components/Reveal.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { ease, duration } from "../motion-tokens.js";

export default function Wishlist() {
  const { wishlist, remove, clear, count } = useWishlist();

  const wishlistProducts = wishlist
    .map((slug) => featuredProducts.find((p) => p.slug === slug))
    .filter(Boolean);

  const enquireAllLink = smartWhatsAppLink({
    type: "wishlist",
    items: wishlistProducts,
  });

  return (
    <>
      {/* Hero */}
      <section className="page-hero" style={{ padding: "120px 0 40px" }}>
        <div className="container">
          <Reveal variant="fade-up">
            <p className="eyebrow">Aapki Pasand</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "12px" }}>
              Wishlist
            </h1>
            <p style={{ fontSize: "1.05rem", color: "var(--muted)", maxWidth: "560px" }}>
              {/* A2 fix: hero copy was unconditionally showing empty-state text.
                  Now state-dependent — shows "saved favourites" copy when populated. */}
              {wishlistProducts.length > 0
                ? "Yahan aapke saved favourites hain — sab ko ek WhatsApp message mein enquire karo, ya individual products ke liye detail page kholo."
                : "Abhi tak koi favourite nahi — heart icon dabao aur save karo."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "20px" }}>
        <div className="container">
          {wishlistProducts.length === 0 ? (
            /* Empty state */
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
                  Abhi tak koi favourite nahi
                </h2>
                <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
                  {"Abhi tak koi favourite nahi — heart icon dabao aur save karo."} Har product pe heart icon dabao aur yahan save karo.
                </p>
                <Link to="/products" className="btn btn-primary">
                  Products Browse Karo
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
          ) : (
            <>
              {/* Wishlist header bar */}
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
                    Sab ko ek WhatsApp message mein enquire karo — fast aur easy.
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
                    <MessageCircle size={16} aria-hidden="true" />
                    Enquire About All
                  </a>
                  <button
                    type="button"
                    onClick={clear}
                    className="btn btn-outline btn-small"
                    style={{ color: "var(--pink-dark)" }}
                    aria-label="Clear all wishlist items"
                  >
                    <Trash2 size={14} aria-hidden="true" />
                    Clear All
                  </button>
                </div>
              </div>

              {/* Product grid */}
              <div className="card-grid product-grid">
                <AnimatePresence>
                  {wishlistProducts.map((product, index) => (
                    <motion.div
                      key={product.slug}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: duration.standard, ease: ease.soft, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
