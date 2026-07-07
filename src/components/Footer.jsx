import { Instagram, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { businessInfo, createWhatsAppLink, navItems, productCategories } from "../data/siteData.js";
import Reveal from "./Reveal.jsx";
import SmartLink from "./SmartLink.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Reveal className="container footer-grid" variant="fade-up">
        <div className="footer-brand">
          <Link to="/" className="brand brand-footer">
            <img src="/assets/fakhri-mart-logo.webp" alt="Fakhri Mart logo" />
            <span>
              <strong>{businessInfo.shortName}</strong>
              <small>{businessInfo.tagline}</small>
            </span>
          </Link>
          <p>
            Pune ki yarn store — poore India ke liye. Colourful yarns, crochet threads, macrame
            cords, embroidery threads, beads, bases aur purse-making essentials. Yarns, threads & craft supplies from Pune.
          </p>
          <a className="btn btn-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer" aria-label="Chat with Fakhri Mart on WhatsApp for catalogue">
            <WhatsAppIcon size={18} />
            WhatsApp Catalogue
          </a>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul className="footer-links">
            {navItems.slice(0, 7).map((item) => (
              <li key={item.href}>
                <SmartLink to={item.href}>{item.label}</SmartLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Categories</h3>
          <ul className="footer-links">
            {productCategories.slice(0, 8).map((category) => (
              <li key={category.name}>
                <Link to="/products">{category.shortName}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer-contact">
            <li>{businessInfo.name}</li>
            <li>{businessInfo.delivery}</li>
            <li>{businessInfo.location}</li>
            <li>
              <a href={businessInfo.phoneHref} aria-label={`Call Fakhri Mart at ${businessInfo.phoneDisplay}`}>
                <Phone size={15} aria-hidden="true" />
                {businessInfo.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={businessInfo.instagramUrl} target="_blank" rel="noreferrer" aria-label={`Visit Fakhri Mart on Instagram @${businessInfo.instagram}`}>
                <Instagram size={15} aria-hidden="true" />
                @{businessInfo.instagram}
              </a>
            </li>
          </ul>
        </div>
      </Reveal>
      <Reveal className="footer-bottom" variant="fade-up" delay={90}>
        <p>© 2026 {businessInfo.name}, Pune. All-India delivery.</p>
      </Reveal>
    </footer>
  );
}
