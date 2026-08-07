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
      [PHASES.materials, 650],
      [PHASES.making, 1_850],
      [PHASES.creation, 3_050],
      [PHASES.brand, 4_250],
      [PHASES.reveal, 5_350],
    ],
    finishAt: 6_200,
    exitMs: 620,
  },
  compact: {
    steps: [
      [PHASES.materials, 560],
      [PHASES.making, 1_650],
      [PHASES.creation, 2_730],
      [PHASES.brand, 3_800],
      [PHASES.reveal, 4_820],
    ],
    finishAt: 5_650,
    exitMs: 560,
  },
  lite: {
    steps: [
      [PHASES.materials, 500],
      [PHASES.making, 1_450],
      [PHASES.creation, 2_400],
      [PHASES.brand, 3_350],
      [PHASES.reveal, 4_250],
    ],
    finishAt: 5_000,
    exitMs: 480,
  },
};

const PHASE_META = {
  thread: ["01", "Thread"],
  materials: ["02", "Colour"],
  making: ["03", "Making"],
  creation: ["04", "Possibility"],
  brand: ["05", "Fakhri Mart"],
  reveal: ["05", "Fakhri Mart"],
  exit: ["05", "Fakhri Mart"],
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

  const [phaseNumber, phaseLabel] = PHASE_META[phase] || PHASE_META.thread;

  return (
    <div
      className="commerce-intro"
      data-phase={phase}
      data-duration={timeline.finishAt}
      role="dialog"
      aria-modal="true"
      aria-label="Fakhri Mart opening sequence"
    >
      <div className="commerce-intro__wash" aria-hidden="true" />
      <div className="commerce-intro__grain" aria-hidden="true" />
      <svg className="commerce-intro__thread" viewBox="0 0 1400 700" preserveAspectRatio="none" aria-hidden="true">
        <path d="M-80 500 C220 230 410 630 700 350 C910 145 1100 425 1480 140" pathLength="1" />
      </svg>

      <div className="commerce-intro__materials" aria-hidden="true">
        <figure>
          <picture>
            <source srcSet="/assets/images/editorial/shade-library-640.avif" type="image/avif" />
            <img src="/assets/images/editorial/shade-library-640.webp" alt="" width="640" height="427" decoding="async" fetchPriority="high" />
          </picture>
          <figcaption><span>01 · Colour</span><strong>Every project starts with a shade.</strong></figcaption>
        </figure>
        <figure>
          <picture>
            <source srcSet="/assets/images/editorial/atelier-hero-640.avif" type="image/avif" />
            <img src="/assets/images/editorial/atelier-hero-640.webp" alt="" width="640" height="427" decoding="async" />
          </picture>
          <figcaption><span>02 · Material</span><strong>Texture changes how an idea feels.</strong></figcaption>
        </figure>
        <figure>
          <picture>
            <source srcSet="/assets/images/editorial/crochet-bag-worktable-640.avif" type="image/avif" />
            <img src="/assets/images/editorial/crochet-bag-worktable-640.webp" alt="" width="640" height="427" decoding="async" />
          </picture>
          <figcaption><span>03 · Making</span><strong>Good materials make making easier.</strong></figcaption>
        </figure>
      </div>

      <div className="commerce-intro__brand" aria-hidden="true">
        <img src="/assets/brand/fakhri-logo-256.webp" alt="" width="256" height="256" decoding="async" />
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

      <div className="commerce-intro__meta" aria-hidden="true">
        <span>{phaseNumber}</span>
        <i />
        <strong>{phaseLabel}</strong>
      </div>

      <div className="commerce-intro__progress" aria-hidden="true"><i /></div>

      <button ref={skipRef} className="commerce-intro__skip" type="button" onClick={finish}>
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
