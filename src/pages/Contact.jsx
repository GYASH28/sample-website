import { Clock, Instagram, Mail, MapPin, MessageCircle, Phone, Truck } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { businessInfo, createWhatsAppLink } from "../data/siteData.js";

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Connect for catalogue, shade card and bulk order support"
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
