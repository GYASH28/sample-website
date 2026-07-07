// src/components/Footer.jsx
// Site footer — brand, quick links, contact, social. Real content, no decorative filler.

import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";
import { businessInfo, MASTER_CATEGORIES } from "../data/catalogue.js";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-brand">
          <div className="footer-brand-name">{businessInfo.name}</div>
          <div className="footer-brand-tag">{businessInfo.tagline}</div>
          <p className="footer-blurb">
            Yarns, crochet threads, macrame cords, embroidery floss, beads, bases and
            purse-making essentials. Pan-India delivery. WhatsApp enquiry catalogue.
          </p>
        </div>

        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/products">All Products</Link></li>
            {MASTER_CATEGORIES.map((mc) => (
              <li key={mc}><Link to={`/products?department=${mc}`}>{mc}</Link></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Pages</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/enquiry">Enquiry Basket</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul className="footer-contact">
            <li><Phone size={14} /> <a href={businessInfo.phoneHref}>{businessInfo.phoneDisplay}</a></li>
            <li><Mail size={14} /> <a href={`mailto:${businessInfo.email}`}>{businessInfo.email}</a></li>
            <li><MapPin size={14} /> {businessInfo.address}</li>
            <li><Clock size={14} /> {businessInfo.hours}</li>
          </ul>
          <a
            href={businessInfo.instagramUrl}
            className="footer-social"
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Instagram"
          >
            <Instagram size={16} />
          </a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} {businessInfo.name}. All rights reserved.</span>
        <span className="footer-quote">{businessInfo.delivery}</span>
      </div>
    </footer>
  );
}
