import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import StoreLocation from "../components/StoreLocation.jsx";
import { businessInfo, createWhatsAppLink } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { contactPageJsonLd, localBusinessJsonLd, useJsonLd } from "../hooks/useJsonLd.js";

export default function Contact() {
  useDocumentMeta({
    title: "Contact & Store Location — Fakhri Mart Pune",
    description:
      "Contact Fakhri Mart in Pune for yarn, crochet thread, macrame cord, craft accessories, catalogue, shades, bulk enquiries and all-India delivery. Get Google Maps directions.",
    pathname: "/contact",
  });
  useJsonLd(localBusinessJsonLd(businessInfo));
  useJsonLd(contactPageJsonLd());

  return (
    <>
      <PageHero
        eyebrow="Contact & Location"
        title="Catalogue support, product guidance and Google Maps directions"
        text="Reach out for yarns, crochet threads, macrame cords, embroidery threads, beads, bases, purse accessories, delivery details and product availability."
      >
        <ProductVisual palette={["#35b8ad", "#f6a7b8", "#c99b6b"]} />
      </PageHero>

      <section className="section">
        <div className="container contact-layout">
          <Reveal className="contact-details" variant="slide-left">
            <div className="contact-card">
              <MapPin size={24} aria-hidden="true" />
              <div>
                <h3>Store</h3>
                <p>{businessInfo.name}, {businessInfo.location}</p>
              </div>
            </div>
            <div className="contact-card">
              <Phone size={24} aria-hidden="true" />
              <div>
                <h3>Phone</h3>
                <a href={businessInfo.phoneHref} aria-label={`Call Fakhri Mart at ${businessInfo.phoneDisplay}`}>{businessInfo.phoneDisplay}</a>
              </div>
            </div>
            <div className="contact-card">
              <MessageCircle size={24} aria-hidden="true" />
              <div>
                <h3>WhatsApp</h3>
                <a href={createWhatsAppLink()} target="_blank" rel="noreferrer" aria-label={`Message Fakhri Mart on WhatsApp at ${businessInfo.whatsappDisplay}`}>
                  {businessInfo.whatsappDisplay}
                </a>
              </div>
            </div>
            <div className="contact-card">
              <Mail size={24} aria-hidden="true" />
              <div>
                <h3>Email</h3>
                <a href={businessInfo.emailHref} aria-label={`Email Fakhri Mart at ${businessInfo.email}`}>{businessInfo.email}</a>
              </div>
            </div>
            <div className="contact-card">
              <Instagram size={24} aria-hidden="true" />
              <div>
                <h3>Instagram</h3>
                <a href={businessInfo.instagramUrl} target="_blank" rel="noreferrer" aria-label={`Visit Fakhri Mart on Instagram @${businessInfo.instagram}`}>
                  @{businessInfo.instagram}
                </a>
              </div>
            </div>
            <div className="contact-card">
              <Clock size={24} aria-hidden="true" />
              <div>
                <h3>Business Hours</h3>
                <p>{businessInfo.hours}</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="map-panel" delay={130} variant="slide-right">
            <p className="eyebrow">Before You Message</p>
            <h2>Get a faster, more useful reply</h2>
            <p>Include the product or project, shade or colour family, approximate quantity and delivery city.</p>
            <ul className="enquiry-checklist">
              <li>Product name, category or reference photo</li>
              <li>Preferred shades or colour family</li>
              <li>Single item, bulk order or reseller quantity</li>
              <li>Delivery city and required timing</li>
            </ul>
            <a className="btn btn-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
              <MessageCircle size={18} aria-hidden="true" />
              Start WhatsApp Enquiry
            </a>
          </Reveal>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container">
          <StoreLocation />
        </div>
      </section>
    </>
  );
}
