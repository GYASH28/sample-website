import { ArrowRight } from "@phosphor-icons/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { COMMERCE_INTRO_SESSION_KEY } from "../lib/commerceIntro.js";

const PHASES = {
  thread: "thread",
  materials: "materials",
  making: "making",
  creation: "creation",
  brand: "brand",
  reveal: "reveal",
  exit: "exit",
};

const TIMELINES = {
  full: {
    steps: [
      [PHASES.materials, 360],
      [PHASES.making, 1_050],
      [PHASES.creation, 1_760],
      [PHASES.brand, 2_480],
      [PHASES.reveal, 3_180],
    ],
    finishAt: 3_850,
    exitMs: 520,
  },
  compact: {
    steps: [
      [PHASES.materials, 300],
      [PHASES.making, 880],
      [PHASES.creation, 1_480],
      [PHASES.brand, 2_080],
      [PHASES.reveal, 2_650],
    ],
    finishAt: 3_200,
    exitMs: 460,
  },
  lite: {
    steps: [
      [PHASES.materials, 220],
      [PHASES.making, 720],
      [PHASES.creation, 1_180],
      [PHASES.brand, 1_650],
      [PHASES.reveal, 2_080],
    ],
    finishAt: 2_550,
    exitMs: 360,
  },
};

const PHASE_META = {
  thread: ["Find", "the colour"],
  materials: ["Find", "the colour"],
  making: ["Feel", "the texture"],
  creation: ["Make", "the idea"],
  brand: ["Fakhri", "Mart"],
  reveal: ["Fakhri", "Mart"],
  exit: ["Fakhri", "Mart"],
};

function shouldShowIntro(pathname) {
  if (pathname !== "/" || typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "1") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return window.sessionStorage.getItem(COMMERCE_INTRO_SESSION_KEY) !== "played";
}

function readTimeline() {
  if (typeof document === "undefined") return TIMELINES.full;
  const profile = document.documentElement.dataset.motionProfile;
  if (profile === "lite") return TIMELINES.lite;
  if (profile === "compact") return TIMELINES.compact;
  return TIMELINES.full;
}

export default function CommerceIntro() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(() => shouldShowIntro(pathname));
  const [phase, setPhase] = useState(PHASES.thread);
  const [timeline] = useState(readTimeline);
  const skipRef = useRef(null);
  const timersRef = useRef(new Set());
  const finishingRef = useRef(false);
  const previousFocusRef = useRef(null);

  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const finishImmediately = useCallback(() => {
    clearTimers();
    finishingRef.current = true;
    window.sessionStorage.setItem(COMMERCE_INTRO_SESSION_KEY, "played");
    document.body.classList.remove("commerce-intro-open");
    setVisible(false);
  }, [clearTimers]);

  const finish = useCallback(() => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    clearTimers();
    window.sessionStorage.setItem(COMMERCE_INTRO_SESSION_KEY, "played");
    setPhase(PHASES.exit);
    schedule(() => {
      document.body.classList.remove("commerce-intro-open");
      setVisible(false);
    }, timeline.exitMs);
  }, [clearTimers, schedule, timeline.exitMs]);

  useLayoutEffect(() => {
    if (!visible) return undefined;
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("commerce-intro-open");
    skipRef.current?.focus({ preventScroll: true });

    return () => {
      document.body.classList.remove("commerce-intro-open");
      const previousFocus = previousFocusRef.current;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected && previousFocus !== document.body) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;

    timeline.steps.forEach(([nextPhase, delay]) => {
      schedule(() => {
        if (!finishingRef.current) setPhase(nextPhase);
      }, delay);
    });
    schedule(finish, timeline.finishAt);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish();
      } else if (event.key === "Tab") {
        event.preventDefault();
        skipRef.current?.focus({ preventScroll: true });
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) finishImmediately();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearTimers();
    };
  }, [clearTimers, finish, finishImmediately, schedule, timeline, visible]);

  useEffect(() => {
    if (pathname !== "/" && visible) finishImmediately();
  }, [finishImmediately, pathname, visible]);

  if (!visible) return null;

  const [verb, subject] = PHASE_META[phase] || PHASE_META.thread;
  const enterLabel = phase === PHASES.reveal || phase === PHASES.exit ? "Enter catalogue" : "Skip intro";

  return (
    <div
      className="commerce-intro commerce-intro--v17"
      data-phase={phase}
      data-duration={timeline.finishAt}
      style={{ "--intro-duration": `${timeline.finishAt}ms` }}
      role="dialog"
      aria-modal="true"
      aria-label="Fakhri Mart opening sequence"
    >
      <div className="commerce-intro__wash" aria-hidden="true" />
      <div className="commerce-intro__grain" aria-hidden="true" />

      <div className="commerce-intro__mast" aria-hidden="true">
        <span className="commerce-intro__mast-brand">
          <img src="/assets/brand/fakhri-logo-256.webp" alt="" width="48" height="48" decoding="async" />
          <strong>FAKHRI MART</strong>
        </span>
        <span>Yarn · thread · craft materials</span>
        <span>Pune</span>
      </div>

      <div key={phase} className="commerce-intro__statement" aria-hidden="true">
        <span>{verb}</span>
        <strong>{subject}</strong>
      </div>

      <div className="commerce-intro__materials" aria-hidden="true">
        <figure>
          <picture>
            <source srcSet="/assets/images/editorial/shade-library-640.avif" type="image/avif" />
            <img src="/assets/images/editorial/shade-library-640.webp" alt="" width="640" height="427" decoding="async" fetchPriority="high" />
          </picture>
          <figcaption><span>Colour</span><strong>Choose the shade first.</strong></figcaption>
        </figure>
        <figure>
          <picture>
            <source srcSet="/assets/images/editorial/atelier-hero-640.avif" type="image/avif" />
            <img src="/assets/images/editorial/atelier-hero-640.webp" alt="" width="640" height="427" decoding="async" />
          </picture>
          <figcaption><span>Texture</span><strong>Then find the right feel.</strong></figcaption>
        </figure>
        <figure>
          <picture>
            <source srcSet="/assets/images/editorial/crochet-bag-worktable-640.avif" type="image/avif" />
            <img src="/assets/images/editorial/crochet-bag-worktable-640.webp" alt="" width="640" height="427" decoding="async" />
          </picture>
          <figcaption><span>Make</span><strong>Turn material into something real.</strong></figcaption>
        </figure>
      </div>

      <div className="commerce-intro__brand" aria-hidden="true">
        <img src="/assets/brand/fakhri-logo-256.webp" alt="" width="256" height="256" decoding="async" />
        <div>
          <span>For makers, studios and resellers</span>
          <strong>Fakhri Mart</strong>
          <small>Find the material. Pick the shade. Start making.</small>
        </div>
      </div>

      <div className="commerce-intro__reveal" aria-hidden="true">
        <span>Enter the catalogue</span>
        <ArrowRight size={21} />
      </div>

      <div className="commerce-intro__progress" aria-hidden="true"><i /></div>

      <button ref={skipRef} className="commerce-intro__skip" type="button" onClick={finish}>
        {enterLabel} <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
