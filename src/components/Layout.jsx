import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
  const [introActive, setIntroActive] = useState(false);

  useEffect(() => {
    const isPlayed = sessionStorage.getItem("fakhri_intro_v3") === "true";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isPlayed && !prefersReducedMotion) {
      setIntroActive(true);
    }
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {introActive && <IntroAnimation onComplete={() => setIntroActive(false)} />}
      <ScrollToTop />
      <Header />
      <main
        id="main-content"
        style={{
          opacity: introActive ? 0 : 1,
          transition: "opacity 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
            exit={{ opacity: 0, y: -8, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingWhatsApp />
      <BasketToast />
    </>
  );
}
