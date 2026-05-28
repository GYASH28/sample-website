import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import FloatingWhatsApp from "./FloatingWhatsApp.jsx";
import Footer from "./Footer.jsx";
import Header from "./Header.jsx";

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
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
