// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { I18nProvider } from "./lib/i18n.jsx";
import { ThemeProvider } from "./lib/theme.jsx";
import Lenis from "lenis";
import { prefersReducedMotion } from "./lib/motion.js";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";

// Smooth scroll (Lenis) — disabled under reduced motion.
if (!prefersReducedMotion()) {
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <App />
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>
);
