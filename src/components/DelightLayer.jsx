import { ArrowUp, Sparkle, X } from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "fakhri_delight_hint_dismissed";

export default function DelightLayer() {
  const { pathname } = useLocation();
  const [showTop, setShowTop] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);

  const shouldOfferHint = useMemo(
    () => pathname === "/" && typeof window !== "undefined" && window.sessionStorage.getItem(STORAGE_KEY) !== "yes",
    [pathname],
  );

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setShowTop(window.scrollY > 760);
        frame = 0;
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!shouldOfferHint) {
      setHintVisible(false);
      return undefined;
    }
    const timer = window.setTimeout(() => setHintVisible(true), 4200);
    return () => window.clearTimeout(timer);
  }, [shouldOfferHint]);

  const dismissHint = () => {
    window.sessionStorage.setItem(STORAGE_KEY, "yes");
    setHintVisible(false);
  };

  return (
    <>
      {hintVisible ? (
        <aside className="delight-hint" aria-live="polite">
          <span className="delight-hint__icon" aria-hidden="true"><Sparkle size={16} weight="fill" /></span>
          <p><strong>Shopping tip:</strong> use Quick view to choose a shade and quantity without leaving the page.</p>
          <button type="button" onClick={dismissHint} aria-label="Dismiss shopping tip"><X size={15} /></button>
        </aside>
      ) : null}
      <button
        type="button"
        className={`back-to-top ${showTop ? "is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}
