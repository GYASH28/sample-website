import { Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/fakhri-mart-logo.webp";
import { announcementItems, businessInfo, createWhatsAppLink, navItems } from "../data/siteData.js";

function NavItem({ item, activePath, onClick }) {
  const isAnchor = item.href.includes("#");
  const isActive = !isAnchor && activePath === item.href;
  const className = isActive ? "active" : undefined;

  if (isAnchor) {
    return (
      <a href={item.href} className={className} onClick={onClick}>
        {item.label}
      </a>
    );
  }

  return (
    <Link to={item.href} className={className} onClick={onClick}>
      {item.label}
    </Link>
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
        <Link to="/" className="brand" aria-label="Fakhri Mart home">
          <img src={logo} alt="Fakhri Mart logo" />
          <span>
            <strong>{businessInfo.shortName}</strong>
            <small>{businessInfo.descriptor}</small>
          </span>
        </Link>

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
            <MessageCircle size={17} />
            WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
