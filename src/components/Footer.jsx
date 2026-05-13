import { MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { businessInfo, createWhatsAppLink, navItems, productCategories } from "../data/siteData.js";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="brand brand-footer">
            <span className="brand-mark">ST</span>
            <span>
              <strong>{businessInfo.shortName}</strong>
              <small>Textile Supplies</small>
            </span>
          </Link>
          <p>
            Premium sewing, embroidery, industrial, cotton, polyester, nylon, and zari threads.
          </p>
          <a className="btn btn-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
            <MessageCircle size={18} />
            WhatsApp Catalogue
          </a>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul className="footer-links">
            {navItems.filter((item) => item.label !== "Enquiry").map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Products</h3>
          <ul className="footer-links">
            {productCategories.slice(0, 4).map((category) => (
              <li key={category.name}>
                <Link to="/products">{category.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Contact</h3>
          <ul className="footer-contact">
            <li>{businessInfo.name}</li>
            <li>
              <a href={businessInfo.phoneHref}>
                <Phone size={15} />
                {businessInfo.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={businessInfo.emailHref}>{businessInfo.email}</a>
            </li>
            <li>{businessInfo.address}</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>Copyright (c) 2026 {businessInfo.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
