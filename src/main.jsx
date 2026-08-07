import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { applyMotionProfile } from "./lib/motionProfile.js";
import "@fontsource-variable/archivo";
import "@fontsource-variable/manrope";
import "./styles.css";
import "./atelier.css";
import "./motion.css";
import "./atelier-growth.css";
import "./scroll-cinema.css";
import "./commerce-upgrade.css";
import "./product-first-v2.css";
import "./delight-v3.css";
import "./delight-v3-fixes.css";
import "./production-hardening-v4.css";
import "./production-a11y-fixes.css";
import "./motion-performance-v5.css";
import "./hero-v6.css";
import "./hero-cinematic-v7.css";
import "./site-experience-v8.css";

applyMotionProfile();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);
