// src/pages/Wishlist.jsx
// Wishlist — persisted client-side (localStorage). Simple, fast, state-dependent copy.

import { Link } from "react-router-dom";
import { Heart, Trash2, ArrowRight, MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useWishlist } from "../hooks/useWishlist.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { ProductCard } from "../components/ProductCard.jsx";
import { Reveal } from "../components/Reveal.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import { featuredProducts, createWhatsAppLink } from "../data/catalogue.js";

export default function Wishlist() {
  useDocumentMeta({
    title: "Wishlist",
    description: "Your saved Fakhri Mart products. Enquire about all of them in one WhatsApp message.",
  });

  const { items, clear, count } = useWishlist();
  const basket = useEnquiryBasket();
  const wishlistProducts = items
    .map((slug) => featuredProducts.find((p) => p.slug === slug))
    .filter(Boolean);

  const enquireAllMessage = `Hello Fakhri Mart, I'd like to enquire about my wishlist:\n\n${wishlistProducts.map((p, i) => `${i + 1}. ${p.name}`).join("\n")}\n\nPlease share availability and pricing. Thank you!`;

  return (
    <div className="wishlist-page">
      <div className="container">
        <Reveal>
          <header className="page-header">
            <p className="eyebrow">Your saves</p>
            <h1>Wishlist</h1>
            <p className="page-lede">
              {wishlistProducts.length > 0
                ? `${count} ${count === 1 ? "product" : "products"} saved — enquire about all of them in one WhatsApp message.`
                : "Tap the heart icon on any product to save it here."}
            </p>
          </header>
        </Reveal>

        {wishlistProducts.length === 0 ? (
          <Reveal>
            <div className="empty-state">
              <Heart size={48} className="empty-icon" aria-hidden="true" />
              <h2>No favourites yet</h2>
              <p>Browse the catalogue and tap the heart on any product to save it here.</p>
              <Link to="/products" className="btn btn-primary">
                Browse products <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        ) : (
          <>
            <div className="wishlist-actions">
              <a href={createWhatsAppLink(enquireAllMessage)} target="_blank" rel="noreferrer noopener" className="btn btn-whatsapp">
                <MessageCircle size={16} /> Enquire about all
              </a>
              <button type="button" onClick={clear} className="btn btn-outline">
                <Trash2 size={14} /> Clear all
              </button>
            </div>
            <div className="product-grid">
              <AnimatePresence>
                {wishlistProducts.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                  >
                    <ProductCard product={p} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
