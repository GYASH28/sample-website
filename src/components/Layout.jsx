import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import BasketToast from "./BasketToast.jsx";
import ScrollDirector from "./ScrollDirector.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";
import EnquiryDrawerLauncher from "./EnquiryDrawerLauncher.jsx";

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

export default function Layout() {
  const location = useLocation();
  const routeFamily = getRouteFamily(location.pathname);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollDirector />
      <ScrollToTop />
      <Header />
      <main id="main-content">
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
      <MobileBottomNav />
    </>
  );
}
