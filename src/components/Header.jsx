import { Menu, X, ShoppingBag, Heart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { announcementItems, businessInfo, createWhatsAppLink, navItems } from "../data/siteData.js";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";
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
  const hamburgerRef = useRef(null);
  const navDrawerRef = useRef(null);
  const { itemsCount } = useEnquiryBasket();
  const { count: wishlistCount } = useWishlist();

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

  // Phase 3 item 4: Mobile nav drawer accessibility — focus trap + Escape close + focus restore
  useEffect(() => {
    if (!menuOpen) return;

    const drawer = navDrawerRef.current;
    if (!drawer) return;

    // Move focus to the first focusable link in the drawer
    const focusable = drawer.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];
    if (firstFocusable) firstFocusable.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key === "Tab") {
        // Focus trap: wrap from last to first, and first to last on Shift+Tab
        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            if (lastFocusable) lastFocusable.focus();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            if (firstFocusable) firstFocusable.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // Restore focus to the hamburger button when drawer closes
      if (hamburgerRef.current) hamburgerRef.current.focus();
    };
  }, [menuOpen]);

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

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Mobile Favorites Shortcut */}
          <SmartLink to="/wishlist" className="mobile-basket-btn" aria-label="Wishlist">
            <Heart size={21} />
            {wishlistCount > 0 && <span className="basket-badge-floating bg-rose">{wishlistCount}</span>}
          </SmartLink>

          {/* Mobile-only Enquiry Basket Shortcut */}
          <SmartLink to="/enquiry" className="mobile-basket-btn" aria-label="Enquiry Basket">
            <ShoppingBag size={21} />
            {itemsCount > 0 && <span className="basket-badge-floating">{itemsCount}</span>}
          </SmartLink>

          <button
            ref={hamburgerRef}
            className="menu-toggle"
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <nav
          ref={navDrawerRef}
          className={`main-nav ${menuOpen ? "main-nav--open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Main navigation"
        >
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

          {/* Desktop Favorites Link → Wishlist page */}
          <SmartLink
            to="/wishlist"
            className="favorites-nav-link"
            onClick={() => setMenuOpen(false)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <Heart size={16} />
            <span>Wishlist</span>
            {wishlistCount > 0 && <span className="basket-badge wishlist-badge">{wishlistCount}</span>}
          </SmartLink>

          {/* Desktop Enquiry Basket Link */}
          <SmartLink
            to="/enquiry"
            className={location.pathname === "/enquiry" ? "active enquiry-basket-nav" : "enquiry-basket-nav"}
            onClick={() => setMenuOpen(false)}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            <span>Enquiry</span>
            {itemsCount > 0 && <span className="basket-badge">{itemsCount}</span>}
          </SmartLink>

          {/* Phase 2: Compare indicator + ThemeToggle removed */}

          {/* Header toggles area — kept for spacing, ThemeToggle removed in Phase 2 */}
          <div className="header-toggles" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
          </div>

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

