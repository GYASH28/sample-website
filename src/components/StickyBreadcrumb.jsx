import { CaretRight, House } from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";

export default function StickyBreadcrumb({ categoryName, productName }) {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);
  const isProductDetail = pathParts[0] === "products" && pathParts[1];

  const crumbs = [{ label: "Home", href: "/", icon: House }];

  if (isProductDetail) {
    crumbs.push({ label: "Products", href: "/products" });
    if (categoryName) {
      crumbs.push({
        label: categoryName,
        href: `/products?category=${encodeURIComponent(categoryName)}`,
      });
    }
    if (productName) {
      crumbs.push({
        label: productName,
        href: location.pathname,
        active: true,
      });
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
  }

  if (crumbs.length <= 1) return null;

  return (
    <nav className="sticky-breadcrumb" aria-label="Breadcrumb">
      <div className="container sticky-breadcrumb__inner">
        {crumbs.map((crumb, index) => {
          const Icon = crumb.icon;
          const isLast = index === crumbs.length - 1;

          return (
            <span key={`${crumb.href}-${crumb.label}`}>
              {Icon && index === 0 ? (
                <Link to={crumb.href} aria-label="Home">
                  <Icon size={14} aria-hidden="true" />
                </Link>
              ) : isLast ? (
                <span aria-current="page">{crumb.label}</span>
              ) : (
                <Link to={crumb.href}>{crumb.label}</Link>
              )}
              {!isLast && <CaretRight size={12} aria-hidden="true" />}
            </span>
          );
        })}
      </div>
    </nav>
  );
}
