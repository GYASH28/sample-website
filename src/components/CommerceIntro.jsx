import { ArrowRight } from "@phosphor-icons/react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { verifiedBusiness } from "../data/verifiedBusiness.js";
import { COMMERCE_INTRO_SESSION_KEY } from "../lib/commerceIntro.js";

const PHASES = {
  thread: "thread",
  materials: "materials",
  brand: "brand",
  tagline: "tagline",
  reveal: "reveal",
  exit: "exit",
};

const TIMELINES = {
  full: {
    steps: [
      [PHASES.materials, 220],
      [PHASES.brand, 1_080],
      [PHASES.tagline, 1_900],
      [PHASES.reveal, 3_250],
    ],
    finishAt: 5_100,
    exitMs: 680,
  },
  compact: {
    steps: [
      [PHASES.materials, 180],
      [PHASES.brand, 820],
      [PHASES.tagline, 1_480],
      [PHASES.reveal, 2_650],
    ],
    finishAt: 4_400,
    exitMs: 560,
  },
  lite: {
    steps: [
      [PHASES.materials, 120],
      [PHASES.brand, 600],
      [PHASES.tagline, 1_080],
      [PHASES.reveal, 1_850],
    ],
    finishAt: 3_200,
    exitMs: 420,
  },
};

const PHASE_STATUS = {
  thread: ["Drawing the thread", "01"],
  materials: ["Gathering colour", "02"],
  brand: ["Fakhri Mart", "03"],
  tagline: [verifiedBusiness.tagline, "04"],
  reveal: ["Catalogue ready", "05"],
  exit: ["Welcome in", "05"],
};

function safeSessionGet(key) {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSessionSet(key, value) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    // Storage can be blocked in privacy modes. The intro must still close.
  }
}

function shouldShowIntro(pathname) {
  if (pathname !== "/" || typeof window === "undefined") return false;
  const params = new URLSearchParams(window.location.search);
  if (params.get("intro") === "1") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return safeSessionGet(COMMERCE_INTRO_SESSION_KEY) !== "played";
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

  const finalize = useCallback(() => {
    clearTimers();
    safeSessionSet(COMMERCE_INTRO_SESSION_KEY, "played");
    document.body.classList.remove("commerce-intro-open");
    setVisible(false);
  }, [clearTimers]);

  const finishImmediately = useCallback(() => {
    finishingRef.current = true;
    finalize();
  }, [finalize]);

  const finish = useCallback(() => {
    if (finishingRef.current) return;
    finishingRef.current = true;
    clearTimers();
    safeSessionSet(COMMERCE_INTRO_SESSION_KEY, "played");
    setPhase(PHASES.exit);

    // Guaranteed cleanup if the clip-path handoff is interrupted by a hidden tab.
    schedule(finalize, timeline.exitMs + 120);
  }, [clearTimers, finalize, schedule, timeline.exitMs]);

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

  const [status, index] = PHASE_STATUS[phase] || PHASE_STATUS.thread;

  return (
    <div
      className="commerce-intro commerce-intro--v18 commerce-intro--v19"
      data-phase={phase}
      data-duration={timeline.finishAt}
      style={{ "--intro-duration": `${timeline.finishAt}ms` }}
      role="dialog"
      aria-modal="true"
      aria-label="Fakhri Mart opening sequence"
      onTransitionEnd={(event) => {
        if (
          phase === PHASES.exit &&
          event.target === event.currentTarget &&
          (event.propertyName === "clip-path" || event.propertyName === "opacity")
        ) {
          finalize();
        }
      }}
    >
      <div className="commerce-intro__wash" aria-hidden="true" />
      <div className="commerce-intro__grain" aria-hidden="true" />

      <div className="commerce-intro__mast" aria-hidden="true">
        <span className="commerce-intro__mast-brand">
          <img src="/assets/brand/fakhri-logo-256.webp" alt="" width="48" height="48" />
          <strong>Fakhri Mart</strong>
        </span>
        <span>Yarn · Thread · Craft</span>
        <span>Pune, India</span>
      </div>

      <svg
        className="commerce-intro__thread"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-80 720 C180 666 250 790 470 650 C650 535 676 330 865 355 C1060 382 1125 180 1520 116"
          pathLength="1"
        />
        <circle cx="865" cy="355" r="5" />
      </svg>

      <div className="commerce-intro__stage">
        <div className="commerce-intro__copy">
          <span className="commerce-intro__eyebrow">Yarn &amp; craft materials · Pune</span>

          <div className="commerce-intro__brand">
            <span className="commerce-intro__logo-ring" aria-hidden="true" />
            <img
              src="/assets/brand/fakhri-logo-256.webp"
              alt="Fakhri Mart"
              width="256"
              height="256"
            />
            <div>
              <small>Made for makers</small>
              <strong>Fakhri Mart</strong>
            </div>
          </div>

          <p className="commerce-intro__tagline">
            <span>Colorful Threads,</span>
            <strong>Endless Creation</strong>
          </p>

          <p className="commerce-intro__note">
            Find the colour. Feel the texture. Make something unmistakably yours.
          </p>

          <div className="commerce-intro__palette" aria-hidden="true">
            <i /><i /><i /><i /><i />
            <span>A spectrum for every idea</span>
          </div>
        </div>

        <div className="commerce-intro__materials" aria-hidden="true">
          <figure>
            <picture>
              <source srcSet="/assets/images/editorial/shade-library-640.avif" type="image/avif" />
              <img
                src="/assets/images/editorial/shade-library-640.webp"
                alt=""
                width="640"
                height="427"
                decoding="async"
                fetchPriority="high"
              />
            </picture>
            <figcaption><span>01</span><strong>Shade library</strong></figcaption>
          </figure>
          <figure>
            <picture>
              <source srcSet="/assets/images/editorial/atelier-hero-640.avif" type="image/avif" />
              <img
                src="/assets/images/editorial/atelier-hero-640.webp"
                alt=""
                width="640"
                height="427"
                decoding="async"
              />
            </picture>
            <figcaption><span>02</span><strong>Material study</strong></figcaption>
          </figure>
          <figure>
            <picture>
              <source srcSet="/assets/images/editorial/crochet-bag-worktable-640.avif" type="image/avif" />
              <img
                src="/assets/images/editorial/crochet-bag-worktable-640.webp"
                alt=""
                width="640"
                height="427"
                decoding="async"
              />
            </picture>
            <figcaption><span>03</span><strong>Made by hand</strong></figcaption>
          </figure>
        </div>
      </div>

      <div className="commerce-intro__progress" aria-hidden="true">
        <span>{status}</span>
        <i><b /></i>
        <strong>{index} / 05</strong>
      </div>

      <button
        ref={skipRef}
        className="commerce-intro__skip"
        type="button"
        onClick={finish}
        aria-label="Skip intro and enter Fakhri Mart catalogue"
      >
        <span>{phase === PHASES.reveal ? "Enter store" : "Skip intro"}</span>
        <ArrowRight size={17} aria-hidden="true" />
      </button>
    </div>
  );
}
