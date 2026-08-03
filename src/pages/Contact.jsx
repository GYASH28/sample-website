import {
  ChatCircleDots,
  Clock,
  Envelope,
  InstagramLogo,
  MapPin,
  Phone,
  Truck,
} from "@phosphor-icons/react";
import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import StoreLocation from "../components/StoreLocation.jsx";
import { businessInfo, createWhatsAppLink } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { contactPageJsonLd, useJsonLd } from "../hooks/useJsonLd.js";

export default function Contact() {
  useDocumentMeta({
    title: "Contact Fakhri Mart",
    description:
      "Reach Fakhri Mart on WhatsApp, phone, Instagram or the official Google listing. Pune, Maharashtra. Monday to Saturday, 10 AM to 8 PM.",
    pathname: "/contact",
  });
  useJsonLd(contactPageJsonLd());

  return (
    <>
      <PageHero
        motif="line"
        eyebrow="Contact"
        title="Talk through the material before you order"
        text="Ask about current shades, quantities, delivery, sample cards or a repeat supply requirement."
      >
        <picture className="catalogue-hero-photo">
          <source srcSet="/assets/images/editorial/craft-stock-room.avif" type="image/avif" />
          <img
            src="/assets/images/editorial/craft-stock-room.webp"
            alt="Organised yarn, cord, thread and bag-making supplies in the Fakhri Mart stock room"
            width="1536"
            height="1024"
          />
        </picture>
      </PageHero>

      <section className="section">
        <div className="container contact-layout">
          <Reveal className="contact-details" variant="slide-left">
            <div className="contact-card">
              <MapPin size={24} aria-hidden="true" />
              <div>
                <h3>Business name</h3>
                <p>{businessInfo.name}</p>
              </div>
            </div>
            <div className="contact-card">
              <Phone size={24} aria-hidden="true" />
              <div>
                <h3>Phone</h3>
                <a href={businessInfo.phoneHref} aria-label={`Call Fakhri Mart at ${businessInfo.phoneDisplay}`}>
                  {businessInfo.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="contact-card">
              <ChatCircleDots size={24} aria-hidden="true" />
              <div>
                <h3>WhatsApp</h3>
                <a
                  href={createWhatsAppLink()}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Message Fakhri Mart on WhatsApp at ${businessInfo.whatsappDisplay}`}
                >
                  {businessInfo.whatsappDisplay}
                </a>
              </div>
            </div>
            <div className="contact-card">
              <Envelope size={24} aria-hidden="true" />
              <div>
                <h3>Email</h3>
                <a href={businessInfo.emailHref} aria-label={`Email Fakhri Mart at ${businessInfo.email}`}>
                  {businessInfo.email}
                </a>
              </div>
            </div>
            <div className="contact-card">
              <InstagramLogo size={24} aria-hidden="true" />
              <div>
                <h3>Instagram</h3>
                <a
                  href={businessInfo.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Visit Fakhri Mart on Instagram @${businessInfo.instagram}`}
                >
                  @{businessInfo.instagram}
                </a>
              </div>
            </div>
            <div className="contact-card">
              <Clock size={24} aria-hidden="true" />
              <div>
                <h3>Business hours</h3>
                <p>{businessInfo.hours}</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="map-panel" delay={130} variant="slide-right">
            <div className="map-pin" aria-hidden="true">
              <MapPin size={28} />
            </div>
            <h3>Confirm before travelling</h3>
            <p>{businessInfo.location}</p>
            <span>
              Message the store for live stock, shade and visit details, then use the official Google listing below for navigation.
            </span>
            <div className="delivery-chip">
              <Truck size={18} aria-hidden="true" />
              {businessInfo.delivery}
            </div>
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
