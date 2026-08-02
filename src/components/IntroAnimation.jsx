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

const VIDEO_SRC = "/assets/videos/fakhri-intro.mp4";

function clearIntroClasses() {
  document.body.classList.remove("intro-running", "intro-hold-hero");
  document.documentElement.classList.remove("intro-booting", "intro-handoff");
}

export default function IntroAnimation() {
  const [visible, setVisible] = useState(shouldPlayIntro);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const videoRef = useRef(null);
  const skipRef = useRef(null);
  const previousFocusRef = useRef(null);
  const finishedRef = useRef(false);
  const exitTimerRef = useRef(null);

  const releaseHero = useCallback(() => {
    document.documentElement.classList.add("intro-handoff");
    const heroFrame = document.querySelector("[data-home-hero-frame]");
    for (const animation of heroFrame?.getAnimations() || []) {
      try {
        animation.finish();
      } catch {
        // The animation may disappear between collection and completion.
      }
    }
  }, []);

  const finishImmediately = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    rememberIntroPlayback();
    clearIntroClasses();
    setVisible(false);
  }, []);

  const finish = useCallback(() => {
    if (finishedRef.current || exiting) return;
    setExiting(true);
    releaseHero();
    exitTimerRef.current = window.setTimeout(finishImmediately, 360);
  }, [exiting, finishImmediately, releaseHero]);

  const handleReady = useCallback(() => {
    setReady(true);
    const playback = videoRef.current?.play();
    playback?.catch(() => finishImmediately());
  }, [finishImmediately]);

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

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish();
      }
      if (event.key === "Tab") {
        event.preventDefault();
        skipRef.current?.focus({ preventScroll: true });
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) finishImmediately();
    };
    const safetyTimer = window.setTimeout(finishImmediately, 12000);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearTimeout(safetyTimer);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearIntroClasses();
    };
  }, [finish, finishImmediately, visible]);

  if (!visible) return null;

  return (
    <div
      className={`${styles.overlay} ${exiting ? styles.exiting : ""}`}
      data-ready={ready ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-label="Fakhri Mart introduction"
    >
      <div className={styles.ambient} aria-hidden="true" />

      <video
        ref={videoRef}
        className={`${styles.video} ${ready ? styles.videoReady : ""}`}
        src={VIDEO_SRC}
        muted
        playsInline
        autoPlay
        preload="auto"
        onCanPlay={handleReady}
        onEnded={finish}
        onError={finishImmediately}
        aria-hidden="true"
      />

      <div className={`${styles.loading} ${ready ? styles.loadingHidden : ""}`} aria-hidden="true">
        <img
          src="/assets/brand/fakhri-logo-256.webp"
          alt=""
          width="256"
          height="256"
        />
        <span />
      </div>

      <button ref={skipRef} className={styles.skip} type="button" onClick={finish}>
        <span>Skip intro</span>
        <i aria-hidden="true">↗</i>
      </button>
    </div>
  );
}
