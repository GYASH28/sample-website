// src/components/Layout.jsx
// App shell — Header + main (with AnimatePresence route transition) + Footer + floating WhatsApp.
// NO dead AnimatedRoutes function (the old site had one). NO ScrollProgressThread (cut for motion budget).

import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "./Header.jsx";
import { Footer } from "./Footer.jsx";
import { FloatingWhatsApp } from "./FloatingWhatsApp.jsx";
import { LoadingFallback } from "./LoadingFallback.jsx";
import { pageVariants, usePrefersReducedMotion } from "../lib/motion.js";

export function Layout() {
  const location = useLocation();
  const reduced = usePrefersReducedMotion();

  return (
    <div className="layout">
      <a href="#main" className="skip-link">Skip to main content</a>
      <Header />
      <main id="main" className="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={reduced ? false : "initial"}
            animate="enter"
            exit={reduced ? false : "exit"}
            variants={pageVariants}
          >
            <Suspense fallback={<LoadingFallback />}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
