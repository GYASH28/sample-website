import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import BasketToast from "./BasketToast.jsx";
import ScrollDirector from "./ScrollDirector.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";
import EnquiryDrawerLauncher from "./EnquiryDrawerLauncher.jsx";
import CommerceIntro from "./CommerceIntro.jsx";
import DelightLayer from "./DelightLayer.jsx";
import MobileProductDock from "./MobileProductDock.jsx";
import HeaderEnhancer from "./HeaderEnhancer.jsx";
import ConnectionStatus from "./ConnectionStatus.jsx";

function ScrollToTop() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    window.scrollTo(0, 0);
  }, [hash, pathname]);

  return null;
}

function getRouteFamily(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/products") return "catalogue";
  if (pathname.startsWith("/products/")) return "detail";
  if (
    pathname === "/gallery" ||
    pathname === "/about" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/")
  ) {
    return "editorial";
  }
  return "utility";
}

function getRouteLabel(pathname) {
  if (pathname === "/") return "Home";
  if (pathname === "/products") return "Catalogue";
  if (pathname.startsWith("/products/")) return "Product details";
  if (pathname === "/gallery") return "Gallery";
  if (pathname === "/about") return "About";
  if (pathname === "/blog") return "Guides";
  if (pathname.startsWith("/blog/")) return "Guide";
  if (pathname === "/contact") return "Contact";
  if (pathname === "/wishlist") return "Wishlist";
  if (pathname === "/enquiry") return "Enquiry";
  return "Page";
}

function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMessage(`${getRouteLabel(pathname)} page opened`);
    }, 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="route-announcer" role="status" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}

export default function Layout() {
  const location = useLocation();
  const routeFamily = getRouteFamily(location.pathname);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <CommerceIntro />
      <ScrollDirector />
      <ScrollToTop />
      <HeaderEnhancer />
      <Header />
      <RouteAnnouncer />
      <main id="main-content" data-route-family={routeFamily}>
        <div
          key={`thread-${location.pathname}`}
          className="route-thread-transition"
          aria-hidden="true"
        />
        <div
          key={location.pathname}
          className="route-stage"
          data-route-family={routeFamily}
        >
          <Outlet />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BasketToast />
      <EnquiryDrawerLauncher />
      <DelightLayer />
      <MobileProductDock />
      <MobileBottomNav />
      <ConnectionStatus />
    </>
  );
}
