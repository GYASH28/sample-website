import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { businessInfo, createWhatsAppLink } from "../data/siteData.js";

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Connect for catalogue, shade card, and bulk supply details"
        text="Reach out for product catalogue details, shade card options, and retail or wholesale supply enquiries."
      >
        <ProductVisual palette={["#264653", "#e9c46a", "#e76f51"]} />
      </PageHero>

      <section className="section">
        <div className="container contact-layout">
          <Reveal className="contact-details" variant="slide-left">
            <div className="contact-card">
              <MapPin size={24} />
              <div>
                <h3>Business Name</h3>
                <p>{businessInfo.name}</p>
              </div>
            </div>
            <div className="contact-card">
              <Phone size={24} />
              <div>
                <h3>Phone</h3>
                <a href={businessInfo.phoneHref}>{businessInfo.phoneDisplay}</a>
              </div>
            </div>
            <div className="contact-card">
              <MessageCircle size={24} />
              <div>
                <h3>WhatsApp</h3>
                <a href={createWhatsAppLink()} target="_blank" rel="noreferrer">
                  {businessInfo.whatsappDisplay}
                </a>
              </div>
            </div>
            <div className="contact-card">
              <Mail size={24} />
              <div>
                <h3>Email</h3>
                <a href={businessInfo.emailHref}>{businessInfo.email}</a>
              </div>
            </div>
            <div className="contact-card">
              <Clock size={24} />
              <div>
                <h3>Business Hours</h3>
                <p>{businessInfo.hours}</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="map-placeholder" delay={130} variant="slide-right">
            <div className="map-pin">
              <MapPin size={28} />
            </div>
            <h3>Location Map</h3>
            <p>{businessInfo.address}</p>
            <span>Shop location map can be added here once the final address is confirmed.</span>
          </Reveal>
        </div>
      </section>
    </>
  );
}
