import {
  Heart,
  List,
  MagnifyingGlass,
  MapPin,
  Phone,
  ShoppingBagOpen,
  X,
} from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext.jsx";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";
import {
  businessInfo,
  createWhatsAppLink,
  productCategories,
} from "../data/siteData.js";
import SearchDialog from "./SearchDialog.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import WhatsAppIcon from "./WhatsAppIcon.jsx";

const OPEN_SEARCH_EVENT = "fakhri:open-search";

const primaryLinks = [
  { to: "/products", key: "catalogue" },
  { to: "/about", key: "about" },
  { to: "/blog", key: "guides" },
  { to: "/contact", key: "contact" },
];

function Counter({ value }) {
  return value > 0 ? (
    <span key={value} className="nav-count" aria-hidden="true">{value}</span>
  ) : null;
}

function isEditableTarget(target) {
  return target instanceof HTMLElement && Boolean(
    target.closest('input, textarea, select, [contenteditable="true"]'),
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [shortcutLabel, setShortcutLabel] = useState("Ctrl K");
  const menuButtonRef = useRef(null);
  const drawerRef = useRef(null);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const { itemsCount } = useEnquiryBasket();
  const { count: wishlistCount } = useWishlist();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openSearch = useCallback(() => {
    setMenuOpen(false);
    setMegaOpen(false);
    setSearchOpen(true);
  }, []);

  useEffect(() => {
    const platform = navigator.userAgentData?.platform || navigator.platform || "";
    setShortcutLabel(/Mac|iPhone|iPad|iPod/i.test(platform) ? "⌘K" : "Ctrl K");
  }, []);

  useEffect(() => {
    closeMenu();
    setMegaOpen(false);
    setSearchOpen(false);
  }, [location.pathname, closeMenu]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === "k") {
        event.preventDefault();
        openSearch();
        return;
      }

      if (event.key === "/" && !isEditableTarget(event.target)) {
        event.preventDefault();
        openSearch();
        return;
      }

      if (event.key === "Escape") setMegaOpen(false);
    };
    const onOpenSearch = () => openSearch();

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_SEARCH_EVENT, onOpenSearch);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_SEARCH_EVENT, onOpenSearch);
    };
  }, [openSearch]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    document.body.classList.add("menu-lock");
    const previous = document.activeElement;
    window.requestAnimationFrame(() => drawerRef.current?.querySelector("button, a")?.focus());

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
      if (event.key !== "Tab") return;
      const focusable = drawerRef.current?.querySelectorAll(
        'a, button, input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("menu-lock");
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus?.();
    };
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header className="site-header">
        <div className="announcement-bar" aria-label="Store information">
          <div className="container announcement-bar__inner">
            <span>{t("allIndia")}</span>
            <span>{t("wholesale")}</span>
            <span>{t("shades")}</span>
          </div>
        </div>

        <div className="container nav-shell">
          <Link className="brand" to="/" aria-label="Fakhri Mart home">
            <span className="brand-mark" aria-hidden="true">
              <img
                src="/assets/brand/fakhri-logo-96.webp"
                alt=""
                width="96"
                height="96"
              />
            </span>
            <span>
              <strong>Fakhri Mart</strong>
              <small>Yarn & craft materials</small>
            </span>
          </Link>

          <nav className="desktop-nav" aria-label="Primary navigation">
            <div
              className="catalogue-nav-item"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <NavLink to="/products" onFocus={() => setMegaOpen(true)}>
                {t("catalogue")}
              </NavLink>
              <button
                type="button"
                className="mega-toggle"
                onClick={() => setMegaOpen((value) => !value)}
                aria-expanded={megaOpen}
                aria-label="Show catalogue categories"
              >
                <span aria-hidden="true">⌄</span>
              </button>
              {megaOpen && (
                <div
                  className="category-mega-menu"
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setMegaOpen(false);
                  }}
                >
                  <div className="mega-intro">
                    <span className="eyebrow">Material library</span>
                    <strong>Find the right fibre, finish and hardware.</strong>
                    <Link to="/products">Browse all {productCategories.length} categories</Link>
                  </div>
                  <div className="mega-category-grid">
                    {productCategories.slice(0, 8).map((category) => (
                      <Link
                        key={category.name}
                        to={`/products?category=${encodeURIComponent(category.name)}`}
                      >
                        <span>{category.shortName}</span>
                        <small>{category.products?.length || 0} material lines</small>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {primaryLinks.slice(1).map((item) => (
              <NavLink key={item.to} to={item.to}>{t(item.key)}</NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="header-search-trigger"
              type="button"
              onClick={openSearch}
              aria-label={t("search")}
              aria-keyshortcuts="Control+K Meta+K /"
              title={`Search (${shortcutLabel} or /)`}
            >
              <MagnifyingGlass size={19} />
              <span>{t("search")}</span>
              <kbd>{shortcutLabel}</kbd>
            </button>

            <div className="language-control" aria-label="Language">
              <button
                type="button"
                className={language === "en" ? "active" : ""}
                onClick={() => setLanguage("en")}
                aria-pressed={language === "en"}
              >
                EN
              </button>
              <button
                type="button"
                className={language === "hi" ? "active" : ""}
                onClick={() => setLanguage("hi")}
                aria-pressed={language === "hi"}
              >
                हिं
              </button>
            </div>

            <ThemeToggle compact />

            <Link className="icon-button desktop-icon-action" to="/wishlist" aria-label={`${t("wishlist")}: ${wishlistCount}`}>
              <Heart size={21} />
              <Counter value={wishlistCount} />
            </Link>
            <Link className="icon-button desktop-icon-action" to="/enquiry" aria-label={`${t("enquiry")}: ${itemsCount}`}>
              <ShoppingBagOpen size={22} />
              <Counter value={itemsCount} />
            </Link>
            <a className="header-whatsapp" href={createWhatsAppLink()} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={17} />
              <span>{t("whatsapp")}</span>
            </a>

            <button
              ref={menuButtonRef}
              className="menu-toggle"
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("menu")}
              aria-expanded={menuOpen}
            >
              <List size={25} />
            </button>
          </div>
        </div>
      </header>

      <button
        className={`drawer-backdrop ${menuOpen ? "is-open" : ""}`}
        type="button"
        onClick={closeMenu}
        aria-label="Close navigation"
        aria-hidden={!menuOpen}
        disabled={!menuOpen}
        tabIndex={menuOpen ? 0 : -1}
      />
      <aside
        ref={drawerRef}
        className={`mobile-nav-drawer ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-drawer-header">
          <Link className="brand" to="/" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true">
              <img
                src="/assets/brand/fakhri-logo-96.webp"
                alt=""
                width="96"
                height="96"
              />
            </span>
            <span><strong>Fakhri Mart</strong><small>Pune · all-India delivery</small></span>
          </Link>
          <button className="icon-button" type="button" onClick={closeMenu} aria-label={t("close")}>
            <X size={24} />
          </button>
        </div>

        <div className="mobile-drawer-utilities">
          <button className="mobile-search-button" type="button" onClick={openSearch}>
            <MagnifyingGlass size={20} />
            <span>{t("searchHint")}</span>
          </button>
          <ThemeToggle />
        </div>

        <nav className="mobile-primary-links" aria-label="Mobile primary">
          {primaryLinks.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={closeMenu}>
              {t(item.key)}
            </NavLink>
          ))}
        </nav>

        <div className="mobile-category-group">
          <span className="eyebrow">{t("discover")}</span>
          <div>
            {productCategories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                onClick={closeMenu}
              >
                {category.shortName}
              </Link>
            ))}
          </div>
        </div>

        <div className="mobile-saved-actions">
          <Link to="/wishlist" onClick={closeMenu}><Heart size={20} /> {t("wishlist")} <Counter value={wishlistCount} /></Link>
          <Link to="/enquiry" onClick={closeMenu}><ShoppingBagOpen size={20} /> {t("enquiry")} <Counter value={itemsCount} /></Link>
        </div>

        <address className="mobile-business-details">
          <span><MapPin size={18} /> {businessInfo.location}</span>
          <a href={businessInfo.phoneHref}><Phone size={18} /> {businessInfo.phoneDisplay}</a>
        </address>
      </aside>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
