import { Instagram, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/fakhri-mart-logo.webp";
import { businessInfo, createWhatsAppLink, navItems, productCategories } from "../data/siteData.js";
import Reveal from "./Reveal.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Reveal className="container footer-grid" variant="fade-up">
        <div className="footer-brand">
          <Link to="/" className="brand brand-footer">
            <img src={logo} alt="Fakhri Mart logo" />
            <span>
              <strong>{businessInfo.shortName}</strong>
              <small>{businessInfo.tagline}</small>
            </span>
          </Link>
          <p>
            Yarn store and craft material supplier for colourful yarns, crochet threads, macrame
            cords, embroidery threads, beads, bases and purse-making essentials.
          </p>
          <a className="btn btn-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={18} />
            WhatsApp Catalogue
          </a>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul className="footer-links">
            {navItems.slice(0, 7).map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
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
              <a href={businessInfo.phoneHref}>
                <Phone size={15} />
                {businessInfo.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={businessInfo.instagramUrl} target="_blank" rel="noreferrer">
                <Instagram size={15} />
                @{businessInfo.instagram}
              </a>
            </li>
          </ul>
        </div>
      </Reveal>
      <Reveal className="footer-bottom" variant="fade-up" delay={90}>
        <p>Copyright (c) 2026 {businessInfo.name}. All rights reserved.</p>
      </Reveal>
    </footer>
  );
}
