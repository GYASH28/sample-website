import {
  Heart,
  House,
  MagnifyingGlass,
  SquaresFour,
  ShoppingBagOpen,
} from "@phosphor-icons/react";
import { Link, useLocation } from "react-router-dom";
import { useEnquiryBasket } from "../hooks/useEnquiryBasket.js";
import { useWishlist } from "../hooks/useWishlist.js";

const OPEN_SEARCH_EVENT = "fakhri:open-search";

function CountBadge({ value }) {
  if (!value) return null;
  return <span className="mobile-bottom-nav__count">{value > 99 ? "99+" : value}</span>;
}

export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const { itemsCount } = useEnquiryBasket();
  const { count: wishlistCount } = useWishlist();

  const items = [
    { to: "/", label: "Home", icon: House, active: pathname === "/" },
    {
      action: "search",
      label: "Search",
      icon: MagnifyingGlass,
      active: false,
    },
    {
      to: "/products",
      label: "Catalogue",
      icon: SquaresFour,
      active: pathname === "/products" || pathname.startsWith("/products/"),
    },
    {
      to: "/enquiry",
      label: "Enquiry",
      icon: ShoppingBagOpen,
      active: pathname === "/enquiry",
      count: itemsCount,
    },
    {
      to: "/wishlist",
      label: "Saved",
      icon: Heart,
      active: pathname === "/wishlist",
      count: wishlistCount,
    },
  ];

  const openSearch = () => {
    window.dispatchEvent(new Event(OPEN_SEARCH_EVENT));
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile quick navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const content = (
          <>
            <span className="mobile-bottom-nav__icon">
              <Icon size={22} weight={item.active ? "fill" : "regular"} />
              <CountBadge value={item.count} />
            </span>
            <span>{item.label}</span>
          </>
        );

        if (item.action === "search") {
          return (
            <button
              key={item.label}
              type="button"
              className="mobile-bottom-nav__button"
              onClick={openSearch}
              aria-label="Search catalogue"
            >
              {content}
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            to={item.to}
            className={item.active ? "is-active" : ""}
            aria-current={item.active ? "page" : undefined}
          >
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
