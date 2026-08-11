import {
  ArrowSquareOut,
  ArrowUpRight,
  Envelope,
  InstagramLogo,
  MapPin,
  Phone,
} from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { businessInfo, createWhatsAppLink } from "../data/siteData.js";
import { googlePresence } from "../data/businessProfile.js";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-statement">
          <img
            className="footer-brand-seal"
            src="/assets/brand/fakhri-logo-256.webp"
            alt="Fakhri Mart Yarn Store"
            width="256"
            height="256"
            loading="lazy"
          />
          <span className="eyebrow">Fakhri Mart · Pune</span>
          <h2>{businessInfo.tagline}</h2>
          <p>Yarn, thread, cord and craft supplies for makers, boutiques, resellers and wholesale buyers across India.</p>
          <a className="btn btn-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={18} /> Ask on WhatsApp
          </a>
        </div>

        <nav className="footer-navigation" aria-label="Footer navigation">
          <div>
            <span>Explore</span>
            <Link to="/products">Catalogue</Link>
            <Link to="/yarn-guide">Yarn & project guide</Link>
            <Link to="/blog">Craft guides</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
          <div>
            <span>Information</span>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/delivery-enquiries">Delivery & enquiries</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </nav>

        <address className="footer-contact">
          <span>Contact</span>
          <p><MapPin size={18} /> {businessInfo.location}</p>
          <a href={businessInfo.phoneHref}><Phone size={18} /> {businessInfo.phoneDisplay}</a>
          {businessInfo.secondaryPhoneDisplay ? (
            <a href={businessInfo.secondaryPhoneHref}><Phone size={18} /> {businessInfo.secondaryPhoneDisplay}</a>
          ) : null}
          <a href={businessInfo.emailHref}><Envelope size={18} /> {businessInfo.email}</a>
          <a href={businessInfo.instagramUrl} target="_blank" rel="noreferrer">
            <InstagramLogo size={18} /> @{businessInfo.instagram} <ArrowUpRight size={14} />
          </a>
          <small>{businessInfo.hours}</small>
          <div className="footer-google-links">
            <a href={googlePresence.mapsUrl} target="_blank" rel="noopener noreferrer">
              <MapPin size={17} /> Google Maps <ArrowSquareOut size={14} />
            </a>
            <a href={googlePresence.businessProfileUrl} target="_blank" rel="noopener noreferrer">
              Google Business Profile <ArrowSquareOut size={14} />
            </a>
          </div>
        </address>
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Fakhri Mart. {businessInfo.tagline}</p>
        <p>Prices, shades and availability are confirmed against your requirement.</p>
      </div>
    </footer>
  );
}
