// src/components/Header.jsx
// Site header — brand, primary nav (with Yarns/Threads/Accessories as first-class departments),
// i18n toggle, dark mode toggle, enquiry basket shortcut. Sticky, single subtle blur (not stacked).

import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Globe, Sun, Moon, Menu, X } from "lucide-react";
import { businessInfo, MASTER_CATEGORIES } from "../data/catalogue.js";
import { useI18n } from "../lib/i18n.jsx";
import { useTheme } from "../lib/theme.jsx";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { buttonTap } from "../lib/motion.js";
import { motion } from "framer-motion";

export function Header() {
  const { lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const basket = useEnquiryBasket();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label={`${businessInfo.name} home`}>
          <span className="brand-mark">FM</span>
          <span className="brand-text">
            <span className="brand-name">{businessInfo.shortName}</span>
            <span className="brand-tag">{businessInfo.descriptor}</span>
          </span>
        </Link>

        <nav className="primary-nav" aria-label="Primary">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          <NavLink to="/products" className="nav-link">Shop</NavLink>
          {MASTER_CATEGORIES.map((mc) => (
            <NavLink
              key={mc}
              to={`/products?department=${mc}`}
              className="nav-link nav-link-dept"
            >
              {mc}
            </NavLink>
          ))}
          <NavLink to="/about" className="nav-link">About</NavLink>
          <NavLink to="/contact" className="nav-link">Contact</NavLink>
        </nav>

        <div className="header-tools">
          <button
            type="button"
            className="header-toggle"
            onClick={() => setLang(lang === "en" ? "hi" : "en")}
            aria-label={lang === "en" ? "हिंदी में देखें" : "View in English"}
            whileTap={buttonTap}
          >
            <Globe size={15} />
            <span>{lang === "en" ? "EN" : "हि"}</span>
          </button>

          <button
            type="button"
            className="header-toggle"
            onClick={toggle}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            whileTap={buttonTap}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <button
            type="button"
            className="header-toggle basket-toggle"
            onClick={() => navigate("/enquiry")}
            aria-label={`Enquiry basket, ${basket.count} items`}
          >
            <ShoppingBag size={15} />
            {basket.count > 0 && <span className="basket-count">{basket.count}</span>}
          </button>

          <button
            type="button"
            className="header-toggle mobile-menu-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <motion.div
          className="mobile-nav"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container">
            <NavLink to="/" end className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Home</NavLink>
            <NavLink to="/products" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>All Products</NavLink>
            {MASTER_CATEGORIES.map((mc) => (
              <NavLink
                key={mc}
                to={`/products?department=${mc}`}
                className="mobile-nav-link"
                onClick={() => setMobileOpen(false)}
              >
                {mc}
              </NavLink>
            ))}
            <NavLink to="/about" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>About</NavLink>
            <NavLink to="/contact" className="mobile-nav-link" onClick={() => setMobileOpen(false)}>Contact</NavLink>
          </div>
        </motion.div>
      )}
    </header>
  );
}
