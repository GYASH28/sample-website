import { MessageCircle, ShoppingBag, ArrowRight, Trash2, Plus, Minus, Inbox } from "lucide-react";
import { Link } from "react-router-dom";
import EnquiryForm from "../components/EnquiryForm.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { catalogueMessage, createWhatsAppLink } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

export default function Enquiry() {
  useDocumentMeta({
    title: "Enquiry & Quote Basket | Fakhri Mart",
    description: "Submit your enquiry basket details or request a catalogue from Fakhri Mart.",
  });

  const { basket, remove, updateQuantity, clear, count } = useEnquiryBasket();

  return (
    <>
      <PageHero
        eyebrow="Enquiry Basket"
        title={basket.length > 0 ? "Review Your Enquiry Details" : "Request catalogue or bulk pricing"}
        text="Review your selected yarns and craft accessories, adjust quantities, and submit your request. We will assist you with pricing and shade availability on WhatsApp."
      >
        <ProductVisual palette={["#35b8ad", "#f6a7b8", "#c99b6b"]} />
      </PageHero>

      <section className="section">
        <div className="container">
          {basket.length > 0 ? (
            <div className="enquiry-page-split-layout">
              {/* Left Column: Basket Items List */}
              <Reveal variant="slide-left" className="enquiry-basket-items-panel">
                <div className="basket-panel-header">
                  <h2 className="basket-title-flex">
                    <ShoppingBag size={24} />
                    Items in Basket ({count})
                  </h2>
                  <button type="button" className="clear-basket-text-btn" onClick={clear}>
                    Clear All Items
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
                        onClick={() => remove(index)}
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
                <EnquiryForm basket={basket} onClearBasket={clear} />
              </Reveal>
            </div>
          ) : (
            <div className="enquiry-layout">
              {/* Default Empty State Page */}
              <Reveal variant="slide-left">
                <p className="eyebrow">Fast Response</p>
                <h2>Send the details once, then continue on WhatsApp.</h2>
                <p>
                  Mention product name, quantity, colour or shade, size, packaging needs and delivery
                  city. The team can then guide you with catalogue, availability and bulk order support.
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
          )}
        </div>
      </section>
    </>
  );
}
