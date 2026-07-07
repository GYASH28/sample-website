import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
import IntroAnimation from "./IntroAnimation.jsx";
import CompareTray from "./CompareTray.jsx";
import SmoothScroll from "./SmoothScroll.jsx";
import BasketToast from "./BasketToast.jsx";
import ScrollProgressThread from "./ScrollProgressThread.jsx";
import { ease, duration } from "../motion-tokens.js";

function ScrollToTop() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
      return;
    }
    // Instant scroll for pathname-only changes — no janky smooth animation
    window.scrollTo(0, 0);
  }, [hash, pathname]);

  return null;
}

// Route transition variants (used by the inline AnimatePresence block in Layout below)
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.standard, ease: ease.soft },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: duration.quick, ease: ease.exit },
  },
};

export default function Layout() {
  const [introActive, setIntroActive] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Bumped key to v2 so the enhanced intro plays again for returning visitors
    const isPlayed = sessionStorage.getItem("fakhri_intro_played_v2") === "true";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isPlayed && !prefersReducedMotion) {
      setIntroActive(true);
    }
  }, []);

  return (
    <SmoothScroll>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {introActive && <IntroAnimation onComplete={() => setIntroActive(false)} />}
      <ScrollToTop />
      {/* A1 fix: ScrollProgressThread now wired in site-wide (was orphaned). 
          setState-per-scroll bug fixed — uses ref.textContent instead. */}
      <ScrollProgressThread />
      <Header />
      <main
        id="main-content"
        style={{ opacity: introActive ? 0 : 1, transition: "opacity 600ms cubic-bezier(0.25, 1, 0.5, 1)" }}
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
      <CompareTray />
      <BasketToast />
    </SmoothScroll>
  );
}
