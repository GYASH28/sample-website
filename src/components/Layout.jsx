import { Suspense, lazy, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import BasketToast from "./BasketToast.jsx";
import MobileBottomNav from "./MobileBottomNav.jsx";
import EnquiryDrawerLauncher from "./EnquiryDrawerLauncher.jsx";
import ConnectionStatus from "./ConnectionStatus.jsx";
import AnalyticsBridge from "./AnalyticsBridge.jsx";

const ShoppingWorkspace = lazy(() => import("./ShoppingWorkspace.jsx"));
const ProductRouteEnhancements = lazy(() => import("./ProductRouteEnhancements.jsx"));
const MobileProductDock = lazy(() => import("./MobileProductDock.jsx"));
const CommerceIntro = lazy(() => import("./CommerceIntro.jsx"));
const HeaderEnhancer = lazy(() => import("./HeaderEnhancer.jsx"));
const ScrollDirector = lazy(() => import("./ScrollDirector.jsx"));

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
  if (pathname === "/products" || pathname === "/projects" || pathname.startsWith("/collections/")) return "catalogue";
  if (pathname.startsWith("/products/")) return "detail";
  if (pathname === "/about" || pathname === "/blog" || pathname.startsWith("/blog/")) return "editorial";
  return "utility";
}

function getRouteLabel(pathname) {
  if (pathname === "/") return "Home";
  if (pathname === "/products") return "Catalogue";
  if (pathname.startsWith("/products/")) return "Product details";
  if (pathname === "/projects") return "Shop by project";
  if (pathname.startsWith("/collections/")) return "Material collection";
  if (pathname === "/compare") return "Material comparison";
  if (pathname === "/about") return "About";
  if (pathname === "/blog") return "Guides";
  if (pathname.startsWith("/blog/")) return "Guide";
  if (pathname === "/contact") return "Contact";
  if (pathname === "/wishlist") return "Wishlist";
  if (pathname === "/enquiry") return "Enquiry";
  if (pathname === "/yarn-guide") return "Material finder";
  return "Page";
}

function RouteAnnouncer() {
  const { pathname } = useLocation();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setMessage(`${getRouteLabel(pathname)} page opened`), 120);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return <div className="route-announcer" role="status" aria-live="polite" aria-atomic="true">{message}</div>;
}

export default function Layout() {
  const location = useLocation();
  const routeFamily = getRouteFamily(location.pathname);
  const isProductDetail = location.pathname.startsWith("/products/");
  const [nonCriticalReady, setNonCriticalReady] = useState(false);

  useEffect(() => {
    // The shortlist is useful, but it is not needed to paint a product or the
    // first interaction. Let low-end browsers reach an interactive homepage first.
    const schedule = window.requestIdleCallback
      ? window.requestIdleCallback(() => setNonCriticalReady(true), { timeout: 1600 })
      : window.setTimeout(() => setNonCriticalReady(true), 700);
    return () => {
      if (window.cancelIdleCallback) window.cancelIdleCallback(schedule);
      else window.clearTimeout(schedule);
    };
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <AnalyticsBridge />
      <Suspense fallback={null}><CommerceIntro /></Suspense>
      <ScrollToTop />
      <Suspense fallback={null}><HeaderEnhancer /></Suspense>
      <Header />
      <RouteAnnouncer />
      <Suspense fallback={null}><ScrollDirector /></Suspense>
      <main id="main-content" data-route-family={routeFamily}>
        <div key={`thread-${location.pathname}`} className="route-thread-transition" aria-hidden="true" />
        <div key={location.pathname} className="route-stage" data-route-family={routeFamily}>
          <Outlet />
        </div>
        {isProductDetail ? (
          <Suspense fallback={null}>
            <ProductRouteEnhancements />
          </Suspense>
        ) : null}
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BasketToast />
      <EnquiryDrawerLauncher />
      {nonCriticalReady ? <Suspense fallback={null}><ShoppingWorkspace /></Suspense> : null}
      {isProductDetail ? <Suspense fallback={null}><MobileProductDock /></Suspense> : null}
      <MobileBottomNav />
      <ConnectionStatus />
    </>
  );
}
