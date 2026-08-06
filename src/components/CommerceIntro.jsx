import { ArrowRight } from "@phosphor-icons/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { COMMERCE_INTRO_SESSION_KEY } from "../lib/commerceIntro.js";

function shouldShowIntro(pathname) {
  if (pathname !== "/" || typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "1") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return window.sessionStorage.getItem(COMMERCE_INTRO_SESSION_KEY) !== "played";
}

export default function CommerceIntro() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => shouldShowIntro(pathname));
  const [phase, setPhase] = useState("thread");
  const skipRef = useRef(null);
  const timersRef = useRef([]);
  const finishingRef = useRef(false);

  const finish = useCallback(() => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current = [];
    window.sessionStorage.setItem(COMMERCE_INTRO_SESSION_KEY, "played");
    setPhase("exit");
    window.setTimeout(() => setVisible(false), 420);
  }, []);

  useEffect(() => {
    if (!visible) return undefined;

    document.body.classList.add("commerce-intro-open");
    skipRef.current?.focus({ preventScroll: true });

    timersRef.current = [
      window.setTimeout(() => setPhase("materials"), 360),
      window.setTimeout(() => setPhase("brand"), 980),
      window.setTimeout(() => setPhase("reveal"), 1_540),
      window.setTimeout(finish, 2_120),
    ];

    const onKeyDown = (event) => {
      if (event.key === "Escape" || event.key === "Enter") finish();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("commerce-intro-open");
      document.removeEventListener("keydown", onKeyDown);
      timersRef.current.forEach((timer) => window.clearTimeout(timer));
      timersRef.current = [];
    };
  }, [finish, visible]);

  useEffect(() => {
    if (pathname !== "/") setVisible(false);
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="commerce-intro" data-phase={phase} role="dialog" aria-modal="true" aria-label="Fakhri Mart opening sequence">
      <div className="commerce-intro__wash" aria-hidden="true" />
      <svg className="commerce-intro__thread" viewBox="0 0 1400 700" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-80 500 C220 230 410 630 700 350 C910 145 1100 425 1480 140" pathLength="1" />
      </svg>

      <div className="commerce-intro__materials" aria-hidden="true">
        <figure><img src="/assets/images/editorial/shade-library-640.webp" alt="" width="640" height="427" /></figure>
        <figure><img src="/assets/images/editorial/atelier-hero-640.webp" alt="" width="640" height="427" /></figure>
        <figure><img src="/assets/images/editorial/crochet-bag-worktable-640.webp" alt="" width="640" height="427" /></figure>
      </div>

      <div className="commerce-intro__brand" aria-hidden="true">
        <img src="/assets/brand/fakhri-logo-256.webp" alt="" width="256" height="256" />
        <div>
          <span>From thread to finished piece</span>
          <strong>Fakhri Mart</strong>
          <small>Yarns · craft materials · Pune</small>
        </div>
      </div>

      <div className="commerce-intro__reveal" aria-hidden="true">
        <span>Explore the collection</span>
        <ArrowRight size={22} />
      </div>

      <button ref={skipRef} className="commerce-intro__skip" type="button" onClick={finish}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
