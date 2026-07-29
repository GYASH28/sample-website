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
import { businessInfo, createWhatsAppLink } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

export default function Contact() {
  useDocumentMeta({
    title: "Contact Fakhri Mart",
    description: "Reach Fakhri Mart on WhatsApp, phone, or Instagram. Pune, Maharashtra. Monday to Saturday, 10 AM to 8 PM.",
    canonical: "/contact",
  });
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
                <h3>Business Name</h3>
                <p>{businessInfo.name}</p>
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
              <ChatCircleDots size={24} aria-hidden="true" />
              <div>
                <h3>WhatsApp</h3>
                <a href={createWhatsAppLink()} target="_blank" rel="noreferrer" aria-label={`Message Fakhri Mart on WhatsApp at ${businessInfo.whatsappDisplay}`}>
                  {businessInfo.whatsappDisplay}
                </a>
              </div>
            </div>
            <div className="contact-card">
              <Envelope size={24} aria-hidden="true" />
              <div>
                <h3>Email</h3>
                <a href={businessInfo.emailHref} aria-label={`Email Fakhri Mart at ${businessInfo.email}`}>{businessInfo.email}</a>
              </div>
            </div>
            <div className="contact-card">
              <InstagramLogo size={24} aria-hidden="true" />
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
            <div className="map-pin" aria-hidden="true">
              <MapPin size={28} />
            </div>
            <h3>{businessInfo.location}</h3>
            <p>{businessInfo.address}</p>
            <span>Visit or message us to request catalogue, shade details and delivery support.</span>
            <div className="delivery-chip">
              <Truck size={18} aria-hidden="true" />
              {businessInfo.delivery}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
