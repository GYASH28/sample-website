// src/pages/Enquiry.jsx
// Enquiry basket review + send-to-WhatsApp. The ONLY conversion path — no checkout, no payment.

import { Link } from "react-router-dom";
import { Trash2, MessageCircle, ShoppingBag } from "lucide-react";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { Reveal } from "../components/Reveal.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";

export default function Enquiry() {
  useDocumentMeta({
    title: "Enquiry Basket",
    description: "Review your enquiry basket and send the whole list to Fakhri Mart on WhatsApp in one message.",
  });

  const { items, remove, clear, whatsappLink, count } = useEnquiryBasket();

  return (
    <div className="enquiry-page">
      <div className="container">
        <Reveal>
          <header className="page-header">
            <p className="eyebrow">Review</p>
            <h1>Enquiry basket</h1>
            <p className="page-lede">
              {count > 0
                ? `${count} ${count === 1 ? "item" : "items"} ready — send the whole list to us on WhatsApp in one message. We'll reply with availability and pricing.`
                : "Your basket is empty. Browse the catalogue and add items to enquire about them."}
            </p>
          </header>
        </Reveal>

        {items.length === 0 ? (
          <Reveal>
            <div className="empty-state">
              <ShoppingBag size={48} className="empty-icon" aria-hidden="true" />
              <h2>Your basket is empty</h2>
              <p>Add products from the catalogue and they'll appear here.</p>
              <Link to="/products" className="btn btn-primary">Browse products</Link>
            </div>
          </Reveal>
        ) : (
          <>
            <ul className="enquiry-list">
              {items.map((item) => (
                <li key={item.slug} className="enquiry-item">
                  <div className="enquiry-item-info">
                    <strong>{item.name}</strong>
                    {item.colorName && <span className="enquiry-item-shade">Shade: {item.colorName}</span>}
                    {item.quantity && <span className="enquiry-item-qty">Qty: {item.quantity}</span>}
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.slug)}
                    className="enquiry-item-remove"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>

            <div className="enquiry-actions">
              <a href={whatsappLink()} target="_blank" rel="noreferrer noopener" className="btn btn-whatsapp btn-large">
                <MessageCircle size={18} /> Send enquiry on WhatsApp
              </a>
              <button type="button" onClick={clear} className="btn btn-outline">Clear basket</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
