// src/pages/Contact.jsx
// Contact — WhatsApp message-building interaction. NO fake pincode checker.
// Honest static shipping line replaces the old theater.

import { Reveal } from "../components/Reveal.jsx";
import { useDocumentMeta } from "../hooks/useDocumentMeta.js";
import {
  businessInfo,
  createWhatsAppLink,
  DEFAULT_ENQUIRY_MESSAGE,
  SHIPPING_NOTE,
} from "../data/catalogue.js";
import { Phone, Mail, MapPin, Clock, MessageCircle, Instagram, Truck } from "lucide-react";

export default function Contact() {
  useDocumentMeta({
    title: "Contact",
    description: `Get in touch with ${businessInfo.name}. WhatsApp is fastest — we reply with availability and pricing during shop hours.`,
    canonical: `${businessInfo.url}/contact`,
  });

  return (
    <div className="contact-page">
      <div className="container">
        <Reveal>
          <header className="page-header">
            <p className="eyebrow">Get in touch</p>
            <h1>Contact us</h1>
            <p className="page-lede">
              We're a small team — fastest replies come through WhatsApp during shop hours.
            </p>
          </header>
        </Reveal>

        <div className="contact-grid">
          <Reveal>
            <div className="contact-methods">
              <a href={createWhatsAppLink(DEFAULT_ENQUIRY_MESSAGE)} target="_blank" rel="noreferrer noopener" className="contact-method whatsapp">
                <MessageCircle size={24} aria-hidden="true" />
                <div>
                  <strong>WhatsApp</strong>
                  <span>{businessInfo.whatsappDisplay}</span>
                  <small>Tap to start an enquiry</small>
                </div>
              </a>
              <a href={businessInfo.phoneHref} className="contact-method">
                <Phone size={20} aria-hidden="true" />
                <div>
                  <strong>Phone</strong>
                  <span>{businessInfo.phoneDisplay}</span>
                </div>
              </a>
              <a href={`mailto:${businessInfo.email}`} className="contact-method">
                <Mail size={20} aria-hidden="true" />
                <div>
                  <strong>Email</strong>
                  <span>{businessInfo.email}</span>
                </div>
              </a>
              <div className="contact-method">
                <MapPin size={20} aria-hidden="true" />
                <div>
                  <strong>Address</strong>
                  <span>{businessInfo.address}</span>
                </div>
              </div>
              <div className="contact-method">
                <Clock size={20} aria-hidden="true" />
                <div>
                  <strong>Hours</strong>
                  <span>{businessInfo.hours}</span>
                </div>
              </div>
              <a href={businessInfo.instagramUrl} target="_blank" rel="noreferrer noopener" className="contact-method">
                <Instagram size={20} aria-hidden="true" />
                <div>
                  <strong>Instagram</strong>
                  <span>@{businessInfo.instagram}</span>
                </div>
              </a>
            </div>
          </Reveal>

          <Reveal>
            <div className="contact-shipping">
              <Truck size={28} aria-hidden="true" />
              <h3>Shipping</h3>
              <p>{SHIPPING_NOTE}</p>
              <p>
                We ship pan-India. Bulk orders may take longer to dispatch — confirm lead time
                on WhatsApp before placing a wholesale enquiry.
              </p>
              <p className="contact-shipping-note">
                <strong>Note:</strong> This page intentionally has no pincode "delivery checker."
                We ship everywhere in India — the answer is yes, regardless of which pincode you
                enter. If you need exact transit time for your area, ask on WhatsApp.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
