import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  rememberIntroPlayback,
  shouldPlayIntro,
} from "../lib/introPlayback.js";
import styles from "./IntroAnimation.module.css";

const INTRO_PHASES = {
  tension: "tension",
  materialOne: "material-one",
  materialTwo: "material-two",
  identity: "identity",
  handoff: "handoff",
  exiting: "exiting",
};

const TIMELINES = {
  full: {
    initialPhase: INTRO_PHASES.tension,
    steps: [
      [INTRO_PHASES.materialOne, 420],
      [INTRO_PHASES.materialTwo, 840],
      [INTRO_PHASES.identity, 1_280],
      [INTRO_PHASES.handoff, 2_380],
    ],
    complete: 2_450,
    safety: 3_000,
  },
  compact: {
    initialPhase: INTRO_PHASES.tension,
    steps: [
      [INTRO_PHASES.materialOne, 240],
      [INTRO_PHASES.identity, 610],
      [INTRO_PHASES.handoff, 1_080],
    ],
    complete: 1_480,
    safety: 1_950,
  },
  lite: {
    initialPhase: INTRO_PHASES.identity,
    steps: [[INTRO_PHASES.handoff, 420]],
    complete: 780,
    safety: 1_200,
  },
};

function readMotionProfile() {
  if (typeof document === "undefined") return "full";
  const profile = document.documentElement.dataset.motionProfile;
  return profile === "compact" || profile === "lite" ? profile : "full";
}

function clearIntroClasses() {
  document.body.classList.remove("intro-running", "intro-hold-hero");
  document.documentElement.classList.remove(
    "intro-booting",
    "intro-handoff",
  );
}

export default function IntroAnimation() {
  const [profile] = useState(readMotionProfile);
  const timeline = TIMELINES[profile];
  const [visible, setVisible] = useState(shouldPlayIntro);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState(timeline.initialPhase);
  const skipRef = useRef(null);
  const previousFocusRef = useRef(null);
  const finishedRef = useRef(false);
  const heroReleasedRef = useRef(false);
  const timersRef = useRef(new Set());
  const rafIdsRef = useRef(new Set());

  const clearTimers = useCallback(() => {
    for (const timer of timersRef.current) window.clearTimeout(timer);
    timersRef.current.clear();
  }, []);

  const clearRafs = useCallback(() => {
    for (const id of rafIdsRef.current) window.cancelAnimationFrame(id);
    rafIdsRef.current.clear();
  }, []);

  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const releaseHero = useCallback(() => {
    if (heroReleasedRef.current) return;
    heroReleasedRef.current = true;
    document.documentElement.classList.add("intro-handoff");
    const heroFrame = document.querySelector("[data-home-hero-frame]");
    for (const animation of heroFrame?.getAnimations() || []) {
      try {
        animation.finish();
      } catch {
        // A cancelled CSS animation can disappear between query and finish.
      }
    }
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimers();
    clearRafs();
    rememberIntroPlayback();
    clearIntroClasses();
    setVisible(false);
  }, [clearRafs, clearTimers]);

  const beginHandoff = useCallback(() => {
    if (finishedRef.current) return;
    setPhase(INTRO_PHASES.handoff);
    releaseHero();
  }, [releaseHero]);

  const skip = useCallback(() => {
    if (finishedRef.current) return;
    clearTimers();
    setPhase(INTRO_PHASES.exiting);
    releaseHero();
    schedule(finish, 180);
  }, [clearTimers, finish, releaseHero, schedule]);

  useLayoutEffect(() => {
    document.documentElement.classList.remove("intro-booting");
    if (!visible) {
      clearIntroClasses();
      return undefined;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    document.body.classList.add("intro-running", "intro-hold-hero");

    // Refs are committed before layout effects, so focus ownership is
    // deterministic before the browser paints the dialog.
    skipRef.current?.focus({ preventScroll: true });

    return () => {
      clearIntroClasses();
      const previousFocus = previousFocusRef.current;
      if (
        previousFocus instanceof HTMLElement &&
        previousFocus.isConnected &&
        previousFocus !== document.body
      ) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;

    let previous = performance.now();
    const startedAt = previous;
    let stableFrames = 0;

    const sample = (now) => {
      const gap = now - previous;
      previous = now;
      stableFrames = gap <= 34 ? stableFrames + 1 : 0;
      if (stableFrames >= 2 || now - startedAt >= 700) {
        setReady(true);
        return;
      }
      const id = window.requestAnimationFrame(sample);
      rafIdsRef.current.add(id);
    };

    const id = window.requestAnimationFrame(sample);
    rafIdsRef.current.add(id);
    return clearRafs;
  }, [clearRafs, visible]);

  useEffect(() => {
    if (!visible) return undefined;

    rememberIntroPlayback();

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        skip();
        return;
      }

      if (event.key === "Tab") {
        event.preventDefault();
        skipRef.current?.focus({ preventScroll: true });
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) finish();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearTimers();
      clearRafs();
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearIntroClasses();
    };
  }, [
    beginHandoff,
    clearRafs,
    clearTimers,
    finish,
    schedule,
    skip,
    timeline,
    visible,
  ]);

  useEffect(() => {
    if (!visible || !ready) return undefined;

    for (const [nextPhase, at] of timeline.steps) {
      schedule(
        nextPhase === INTRO_PHASES.handoff
          ? beginHandoff
          : () => setPhase(nextPhase),
        at,
      );
    }
    schedule(finish, timeline.complete);
    schedule(finish, timeline.safety);

    return clearTimers;
  }, [
    beginHandoff,
    clearTimers,
    finish,
    ready,
    schedule,
    timeline,
    visible,
  ]);

  if (!visible) return null;

  const showMaterialCut = profile === "full";
  const showSharedMedia = profile !== "lite";

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      data-profile={profile}
      data-ready={ready ? "true" : "false"}
      data-cut-duration={timeline.complete}
      role="dialog"
      aria-modal="true"
      aria-label="Fakhri Mart introduction"
    >
      <div className={styles.paperField} aria-hidden="true" />
      <span className={styles.reelMark} aria-hidden="true">
        The maker’s cut · Pune
      </span>

      <svg
        className={styles.threadRig}
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={styles.tensionThread}
          d="M-80 392 C216 378 346 414 554 374 C738 338 934 372 1280 308"
          pathLength="1"
        />
      </svg>

      {showSharedMedia && (
        <div className={styles.mediaStage} aria-hidden="true">
          <figure className={styles.mediaFrame}>
            {showMaterialCut && (
              <img
                className={`${styles.mediaImage} ${styles.materialImage}`}
                src="/assets/images/editorial/shade-library-640.webp"
                alt=""
                width="640"
                height="427"
                loading="eager"
                decoding="async"
              />
            )}
            <img
              className={`${styles.mediaImage} ${styles.heroImage}`}
              src="/assets/images/editorial/atelier-hero-960.webp"
              alt=""
              width="960"
              height="640"
              fetchPriority="high"
              decoding="async"
            />
            <figcaption>
              <span className={styles.cutLabel}>Material study / 01</span>
              <span className={styles.cutCopy}>
                Thread, colour, and the hands that make.
              </span>
            </figcaption>
          </figure>
        </div>
      )}

      <div className={styles.identity}>
        <p className={styles.prelude}>From one thread</p>
        <div className={styles.sealLockup}>
          <span className={styles.sealHalo} aria-hidden="true" />
          <figure className={styles.logo}>
            <img
              src="/assets/brand/fakhri-logo-256.webp"
              alt="Fakhri Mart Yarn Store"
              width="256"
              height="256"
            />
          </figure>
        </div>
        <div className={styles.wordmark}>
          <span className={styles.wordmarkLine}>
            <strong>Fakhri Mart</strong>
          </span>
          <span className={styles.wordmarkLine}>
            <em>A world of making.</em>
          </span>
        </div>
      </div>

      <button ref={skipRef} className={styles.skip} type="button" onClick={skip}>
        <span>Skip intro</span>
        <i aria-hidden="true">↗</i>
      </button>
    </div>
  );
}
