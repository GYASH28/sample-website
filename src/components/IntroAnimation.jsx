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
  material: "material",
  identity: "identity",
  handoff: "handoff",
  exiting: "exiting",
};

const FULL_TIMELINE = {
  material: 720,
  identity: 1_760,
  handoff: 2_780,
  complete: 3_520,
  safety: 4_400,
};

const LITE_TIMELINE = {
  material: 340,
  identity: 760,
  handoff: 1_180,
  complete: 1_720,
  safety: 2_500,
};

export default function IntroAnimation() {
  const [visible, setVisible] = useState(shouldPlayIntro);
  const [phase, setPhase] = useState(INTRO_PHASES.tension);
  const skipRef = useRef(null);
  const finishedRef = useRef(false);
  const timersRef = useRef([]);

  const releaseHero = useCallback(() => {
    document.body.classList.remove("intro-hold-hero");
    document.documentElement.classList.add("intro-handoff");
    window.setTimeout(() => {
      document.documentElement.classList.remove("intro-handoff");
    }, 1_400);
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    rememberIntroPlayback();
    document.body.classList.remove("intro-running", "intro-hold-hero");
    setVisible(false);
  }, []);

  const beginHandoff = useCallback(() => {
    if (finishedRef.current) return;
    setPhase(INTRO_PHASES.handoff);
    releaseHero();
  }, [releaseHero]);

  const skip = useCallback(() => {
    if (finishedRef.current) return;
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];
    setPhase(INTRO_PHASES.exiting);
    releaseHero();
    timersRef.current.push(window.setTimeout(finish, 240));
  }, [finish, releaseHero]);

  useLayoutEffect(() => {
    document.documentElement.classList.remove("intro-booting");
    if (!visible) return undefined;
    document.body.classList.add("intro-running", "intro-hold-hero");
    return () => {
      document.body.classList.remove("intro-running", "intro-hold-hero");
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return undefined;

    rememberIntroPlayback();
    const previousFocus = document.activeElement;
    const focusFrame = window.requestAnimationFrame(() => {
      skipRef.current?.focus({ preventScroll: true });
    });
    const timeline =
      document.documentElement.dataset.motionProfile === "lite"
        ? LITE_TIMELINE
        : FULL_TIMELINE;

    const schedule = (callback, delay) => {
      const timer = window.setTimeout(callback, delay);
      timersRef.current.push(timer);
    };

    schedule(() => setPhase(INTRO_PHASES.material), timeline.material);
    schedule(() => setPhase(INTRO_PHASES.identity), timeline.identity);
    schedule(beginHandoff, timeline.handoff);
    schedule(finish, timeline.complete);
    schedule(finish, timeline.safety);

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        skip();
      }

      if (event.key === "Tab") {
        event.preventDefault();
        skipRef.current?.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [beginHandoff, finish, skip, visible]);

  if (!visible) return null;

  return (
    <div
      className={styles.overlay}
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="Fakhri Mart introduction"
    >
      <div className={styles.paperField} aria-hidden="true" />
      <div className={styles.cinemaGrain} aria-hidden="true" />
      <span className={styles.reelMark} aria-hidden="true">
        Material study · Pune
      </span>

      <svg
        className={styles.threadRig}
        viewBox="0 0 1200 700"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={styles.tensionThread}
          d="M-60 390 C185 382 287 405 486 373 C680 342 832 366 1260 312"
          pathLength="1"
        />
        <path
          className={styles.identityThread}
          d="M-70 448 C175 424 205 198 404 226 C582 252 480 534 692 502 C838 480 718 174 910 198 C1048 214 1036 388 1270 340"
          pathLength="1"
        />
      </svg>

      <div className={styles.editorialCut} aria-hidden="true" />

      <div className={styles.materialStage} aria-hidden="true">
        <figure className={`${styles.shot} ${styles.shadeShot}`}>
          <img
            src="/assets/images/editorial/shade-library-640.webp"
            alt=""
            width="640"
            height="427"
            decoding="async"
          />
          <figcaption>Shade library / 01</figcaption>
        </figure>

        <figure className={`${styles.shot} ${styles.crochetShot}`}>
          <img
            src="/assets/images/editorial/crochet-bag-worktable-640.webp"
            alt=""
            width="640"
            height="960"
            decoding="async"
          />
          <figcaption>Maker’s table / 02</figcaption>
        </figure>

        <figure className={`${styles.shot} ${styles.heroShot}`}>
          <img
            src="/assets/images/editorial/atelier-hero-960.webp"
            alt=""
            width="960"
            height="640"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption>One thread, many beginnings / 03</figcaption>
        </figure>
      </div>

      <div className={styles.identity}>
        <p className={styles.prelude}>From one thread</p>
        <figure className={styles.logo}>
          <img
            src="/assets/brand/fakhri-logo-256.webp"
            alt="Fakhri Mart Yarn Store"
            width="256"
            height="256"
          />
        </figure>
        <div className={styles.wordmark}>
          <span>Fakhri Mart</span>
          <strong>A world of making.</strong>
        </div>
      </div>

      <button ref={skipRef} className={styles.skip} type="button" onClick={skip}>
        <span>Skip intro</span>
        <i aria-hidden="true">↗</i>
      </button>
    </div>
  );
}
