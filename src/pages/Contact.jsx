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
      "Contact Fakhri Mart in Pune by WhatsApp, phone or email for current yarn shades, quantity pricing, bulk requirements and India-wide delivery enquiries.",
    pathname: "/contact",
  });
  useJsonLd(contactPageJsonLd());

  return (
    <>
      <PageHero
        motif="line"
        eyebrow="Contact"
        title="Talk through the material before you order"
        text="Ask about current shades, quantities, delivery, sample cards or repeat supply. We will help you turn a shortlist into a clear enquiry."
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
            <div className="contact-card contact-card--identity">
              <MapPin size={24} aria-hidden="true" />
              <div>
                <h3>{businessInfo.name}</h3>
                <p>{businessInfo.tagline}</p>
              </div>
            </div>
            <div className="contact-card">
              <Phone size={24} aria-hidden="true" />
              <div>
                <h3>Primary phone</h3>
                <a href={businessInfo.phoneHref} aria-label={`Call Fakhri Mart at ${businessInfo.phoneDisplay}`}>
                  {businessInfo.phoneDisplay}
                </a>
              </div>
            </div>
            {businessInfo.secondaryPhoneDisplay ? (
              <div className="contact-card">
                <Phone size={24} aria-hidden="true" />
                <div>
                  <h3>Second phone</h3>
                  <a
                    href={businessInfo.secondaryPhoneHref}
                    aria-label={`Call Fakhri Mart at ${businessInfo.secondaryPhoneDisplay}`}
                  >
                    {businessInfo.secondaryPhoneDisplay}
                  </a>
                </div>
              </div>
            ) : null}
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
            <p className="eyebrow">Before you travel or order</p>
            <h3>Confirm the exact material first</h3>
            <p>{businessInfo.location}</p>
            <span>
              Send the product name, shade or colour family, quantity and delivery city. We can then confirm the current material, quote and visit details before you make the trip.
            </span>
            <div className="button-row contact-direct-actions">
              <a className="btn btn-whatsapp btn-small" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                <ChatCircleDots size={17} /> WhatsApp enquiry
              </a>
              <a className="btn btn-outline btn-small" href={businessInfo.phoneHref}>
                <Phone size={17} /> Call now
              </a>
            </div>
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
