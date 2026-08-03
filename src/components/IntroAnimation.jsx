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

const PHASES = {
  opening: "opening",
  materials: "materials",
  making: "making",
  collection: "collection",
  brand: "brand",
  handoff: "handoff",
  exiting: "exiting",
};

const TIMELINES = {
  full: {
    steps: [
      [PHASES.materials, 620],
      [PHASES.making, 2_000],
      [PHASES.collection, 3_420],
      [PHASES.brand, 4_850],
      [PHASES.handoff, 6_080],
    ],
    complete: 6_820,
    safety: 8_500,
  },
  compact: {
    steps: [
      [PHASES.materials, 380],
      [PHASES.making, 1_350],
      [PHASES.collection, 2_350],
      [PHASES.brand, 3_340],
      [PHASES.handoff, 4_360],
    ],
    complete: 5_000,
    safety: 6_500,
  },
};

function readTimeline() {
  if (typeof document === "undefined") return TIMELINES.full;
  return document.documentElement.dataset.motionProfile === "compact"
    ? TIMELINES.compact
    : TIMELINES.full;
}

function clearIntroClasses() {
  document.body.classList.remove("intro-running", "intro-hold-hero");
  document.documentElement.classList.remove("intro-booting", "intro-handoff");
}

export default function IntroAnimation() {
  const [visible, setVisible] = useState(shouldPlayIntro);
  const [phase, setPhase] = useState(PHASES.opening);
  const [timeline] = useState(readTimeline);
  const skipRef = useRef(null);
  const previousFocusRef = useRef(null);
  const finishedRef = useRef(false);
  const timersRef = useRef(new Set());

  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    timersRef.current.add(timer);
  }, []);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
  }, []);

  const releaseHero = useCallback(() => {
    document.documentElement.classList.add("intro-handoff");
    const heroFrame = document.querySelector("[data-home-hero-frame]");
    for (const animation of heroFrame?.getAnimations() || []) {
      try {
        animation.finish();
      } catch {
        // A cancelled CSS animation can disappear between collection and finish.
      }
    }
  }, []);

  const finishImmediately = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    clearTimers();
    rememberIntroPlayback();
    clearIntroClasses();
    setVisible(false);
  }, [clearTimers]);

  const finish = useCallback(() => {
    if (finishedRef.current || phase === PHASES.exiting) return;
    clearTimers();
    setPhase(PHASES.exiting);
    releaseHero();
    schedule(finishImmediately, 720);
  }, [clearTimers, finishImmediately, phase, releaseHero, schedule]);

  useLayoutEffect(() => {
    document.documentElement.classList.remove("intro-booting");
    if (!visible) {
      clearIntroClasses();
      return undefined;
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("intro-running", "intro-hold-hero");
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
    rememberIntroPlayback();

    timeline.steps.forEach(([nextPhase, delay]) => {
      schedule(() => {
        setPhase(nextPhase);
        if (nextPhase === PHASES.handoff) releaseHero();
      }, delay);
    });
    schedule(finish, timeline.complete);
    schedule(finishImmediately, timeline.safety);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish();
        return;
      }
      if (event.key === "Tab") {
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
      clearIntroClasses();
    };
  }, [clearTimers, finish, finishImmediately, releaseHero, schedule, timeline, visible]);

  if (!visible) return null;

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      data-duration={timeline.complete}
      role="dialog"
      aria-modal="true"
      aria-label="Fakhri Mart cinematic introduction"
    >
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.reelMeta} aria-hidden="true">
        <span>Fakhri Mart</span>
        <i />
        <span>The maker&apos;s opening</span>
      </div>
      <span className={styles.locationMeta} aria-hidden="true">Pune · India</span>

      <svg
        className={styles.threadRig}
        viewBox="0 0 1200 760"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={styles.threadPath}
          d="M-80 520 C150 430 258 566 438 438 C618 308 760 510 918 352 C1030 240 1120 282 1280 196"
          pathLength="1"
        />
        <circle className={styles.threadNeedleEye} cx="918" cy="352" r="6" />
      </svg>

      <div className={styles.cinemaStage} aria-hidden="true">
        <figure className={`${styles.scene} ${styles.sceneMaterials}`}>
          <picture>
            <source srcSet="/assets/images/editorial/shade-library-960.avif" type="image/avif" />
            <img
              src="/assets/images/editorial/shade-library-960.webp"
              alt=""
              width="960"
              height="640"
              decoding="async"
              fetchPriority="high"
            />
          </picture>
          <figcaption>
            <span>01 · Material</span>
            <strong>Colour begins the story.</strong>
          </figcaption>
        </figure>

        <figure className={`${styles.scene} ${styles.sceneMaking}`}>
          <picture>
            <source srcSet="/assets/images/editorial/atelier-hero-960.avif" type="image/avif" />
            <img
              src="/assets/images/editorial/atelier-hero-960.webp"
              alt=""
              width="960"
              height="640"
              decoding="async"
            />
          </picture>
          <figcaption>
            <span>02 · Making</span>
            <strong>One thread. A hundred possibilities.</strong>
          </figcaption>
        </figure>

        <figure className={`${styles.scene} ${styles.sceneCollection}`}>
          <picture>
            <source srcSet="/assets/images/editorial/crochet-bag-worktable-960.avif" type="image/avif" />
            <img
              src="/assets/images/editorial/crochet-bag-worktable-960.webp"
              alt=""
              width="960"
              height="640"
              decoding="async"
            />
          </picture>
          <figcaption>
            <span>03 · Creation</span>
            <strong>Good materials make making easier.</strong>
          </figcaption>
        </figure>

        <span className={styles.frameGlow} />
        <span className={styles.frameVignette} />
      </div>

      <div className={styles.brandCurtain} aria-hidden="true">
        <div className={styles.brandLockup}>
          <span className={styles.brandHalo} />
          <img
            src="/assets/brand/fakhri-logo-256.webp"
            alt=""
            width="256"
            height="256"
          />
          <div>
            <p>From one thread</p>
            <strong>Fakhri Mart</strong>
            <span>Yarn & craft materials · Pune</span>
          </div>
          <i className={styles.brandThread} />
          <small>Enter the atelier</small>
        </div>
      </div>

      <div className={styles.progress} aria-hidden="true">
        <span>Opening film</span>
        <i><b /></i>
        <span>01 / 01</span>
      </div>

      <button ref={skipRef} className={styles.skip} type="button" onClick={finish}>
        <span>Skip intro</span>
        <i aria-hidden="true">↗</i>
      </button>
    </div>
  );
}
