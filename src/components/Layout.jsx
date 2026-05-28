import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hash, pathname]);

  return null;
}

export default function Layout() {
  const [introActive, setIntroActive] = useState(false);

  useEffect(() => {
    const isPlayed = sessionStorage.getItem("fakhri_intro_played") === "true";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!isPlayed && !prefersReducedMotion) {
      setIntroActive(true);
    }
  }, []);

  return (
    <>
      {introActive && <IntroAnimation onComplete={() => setIntroActive(false)} />}
      <ScrollToTop />
      <Header />
      <main style={{ opacity: introActive ? 0 : 1, transition: "opacity 600ms cubic-bezier(0.25, 1, 0.5, 1)" }}>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
