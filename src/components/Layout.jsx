import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import BasketToast from "./BasketToast.jsx";
import IntroAnimation from "./IntroAnimation.jsx";

const INTRO_STORAGE_KEY = "fakhri_intro_video_v1";

function shouldPlayIntro(pathname) {
  if (typeof window === "undefined") return false;
  if (pathname !== "/") return false;

  const params = new URLSearchParams(window.location.search);
  if (params.has("__prerender")) return false;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;

  return window.sessionStorage.getItem(INTRO_STORAGE_KEY) !== "true";
}

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
  const [introActive, setIntroActive] = useState(() => shouldPlayIntro(location.pathname));

  const finishIntro = useCallback(() => {
    setIntroActive(false);
  }, []);

  useEffect(() => {
    if (!introActive) {
      document.documentElement.classList.remove("intro-boot-pending");
    }
  }, [introActive]);

  if (introActive) {
    return <IntroAnimation onComplete={finishIntro} />;
  }

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <ScrollToTop />
      <Header />
      <main id="main-content">
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
