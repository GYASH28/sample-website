import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { announcementItems, businessInfo, createWhatsAppLink, navItems } from "../data/siteData.js";
import SmartLink from "./SmartLink.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

function NavItem({ item, activePath, onClick }) {
  const isAnchor = item.href.includes("#");
  const isActive = !isAnchor && activePath === item.href;
  const className = isActive ? "active" : undefined;

  return (
    <SmartLink to={item.href} className={className} onClick={onClick}>
      {item.label}
    </SmartLink>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-lock", menuOpen);
    return () => document.body.classList.remove("menu-lock");
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  return (
    <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
      <div className="announcement-bar" aria-label="Store highlights">
        <div className="announcement-track">
          {[...announcementItems, ...announcementItems].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>

      <div className="container nav-shell">
        <SmartLink to="/" className="brand" aria-label="Fakhri Mart home">
          <img id="navbar-logo" src="/assets/fakhri-mart-logo.webp" alt="Fakhri Mart logo" />
          <span>
            <strong>{businessInfo.shortName}</strong>
            <small>{businessInfo.descriptor}</small>
          </span>
        </SmartLink>

        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <nav className={`main-nav ${menuOpen ? "main-nav--open" : ""}`} aria-label="Primary navigation">
          <div className="mobile-nav-header">
            <img src="/assets/fakhri-mart-logo.webp" alt="Fakhri Mart logo" className="mobile-nav-logo" />
            <div className="mobile-nav-text">
              <strong>{businessInfo.shortName}</strong>
              <small>{businessInfo.descriptor}</small>
            </div>
          </div>

          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              activePath={location.pathname}
              onClick={() => setMenuOpen(false)}
            />
          ))}
          <a
            className="btn btn-small btn-whatsapp"
            href={createWhatsAppLink()}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
          >
            <WhatsAppIcon size={17} />
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
