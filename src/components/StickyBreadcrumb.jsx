import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

/**
 * StickyBreadcrumb — slim breadcrumb bar that sticks to the top of the viewport
 * when scrolling past the product header. Becomes invisible at the top.
 *
 * Builds: Home > Category > Product (or current page name)
 *
 * A1 fix: scroll listener was previously attached during render (not inside useEffect),
 * which leaked a new listener on every render. Now properly hooked in useEffect with
 * cleanup, and uses a ref-free state update only when the visibility threshold crosses.
 */
export default function StickyBreadcrumb({ categoryName, productName }) {
  const location = useLocation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let lastVisible = window.scrollY > 300;
    setVisible(lastVisible);
    const onScroll = () => {
      const nowVisible = window.scrollY > 300;
      if (nowVisible !== lastVisible) {
        lastVisible = nowVisible;
        setVisible(nowVisible);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Derive category from path if not provided
  const pathParts = location.pathname.split("/").filter(Boolean);
  const isProductDetail = pathParts[0] === "products" && pathParts[1];

  const crumbs = [{ label: "Home", href: "/", icon: Home }];
  if (isProductDetail) {
    crumbs.push({ label: "Products", href: "/products" });
    if (categoryName) {
      crumbs.push({ label: categoryName, href: `/products?category=${encodeURIComponent(categoryName)}` });
    }
    if (productName) {
      crumbs.push({ label: productName, href: location.pathname, active: true });
    }
  } else if (pathParts[0] === "products") {
    crumbs.push({ label: "Products", href: "/products", active: true });
  } else if (pathParts[0] === "gallery") {
    crumbs.push({ label: "Gallery", href: "/gallery", active: true });
  } else if (pathParts[0] === "about") {
    crumbs.push({ label: "About", href: "/about", active: true });
  } else if (pathParts[0] === "contact") {
    crumbs.push({ label: "Contact", href: "/contact", active: true });
  } else if (pathParts[0] === "enquiry") {
    crumbs.push({ label: "Enquiry", href: "/enquiry", active: true });
  } else if (pathParts[0] === "wishlist") {
    crumbs.push({ label: "Wishlist", href: "/wishlist", active: true });
  } else if (pathParts[0] === "blog") {
    crumbs.push({ label: "Guides", href: "/blog", active: true });
  } else if (pathParts[0] === "yarn-calculator") {
    crumbs.push({ label: "Yarn Calculator", href: "/yarn-calculator", active: true });
  }

  if (crumbs.length <= 1) return null;

  return (
    <div
      className="sticky-breadcrumb"
      style={{
        position: "sticky",
        top: "var(--header-offset, 104px)",
        zIndex: 40,
        background: "rgba(255, 247, 236, 0.92)",
        // A6/B6 perf: reduced from blur(10px) to blur(4px) — this thin bar sits directly
        // below the header which already has blur(12px); stacking two heavy blurs causes
        // scroll jank on mid-range phones. 4px is enough for legibility.
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        borderTop: "1px solid var(--line)",
        borderBottom: "1px solid var(--line)",
        padding: "8px 0",
        opacity: visible ? 1 : 0.85,
        transition: "opacity var(--duration-quick) var(--ease-soft)",
      }}
      aria-label="Breadcrumb navigation"
    >
      <div className="container" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", fontSize: "0.8rem" }}>
        {crumbs.map((crumb, i) => {
          const Icon = crumb.icon;
          const isLast = i === crumbs.length - 1;
          return (
            <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              {Icon && i === 0 ? (
                <Link
                  to={crumb.href}
                  style={{
                    color: "var(--muted)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Icon size={13} aria-hidden="true" />
                  <span className="sr-only">Home</span>
                </Link>
              ) : isLast ? (
                <span style={{ color: "var(--ink)", fontWeight: 600, maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {crumb.label}
                </span>
              ) : (
                <>
                  <Link
                    to={crumb.href}
                    style={{ color: "var(--muted)", textDecoration: "none" }}
                  >
                    {crumb.label}
                  </Link>
                  <ChevronRight size={12} style={{ color: "var(--muted)", opacity: 0.6 }} aria-hidden="true" />
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}
