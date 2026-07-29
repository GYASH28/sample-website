import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import BasketToast from "./BasketToast.jsx";
import IntroAnimation from "./IntroAnimation.jsx";

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

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <IntroAnimation />
      <ScrollToTop />
      <Header />
      <main id="main-content">
        <div key={location.pathname} className="route-stage">
          <Outlet />
        </div>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BasketToast />
    </>
  );
}
