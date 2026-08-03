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

const VIDEO_SRC = "/assets/videos/fakhri-intro-premium.mp4";
const POSTER_SRC = "/assets/videos/fakhri-intro-poster.webp";

function clearIntroClasses() {
  document.body.classList.remove("intro-running", "intro-hold-hero");
  document.documentElement.classList.remove("intro-booting", "intro-handoff");
}

export default function IntroAnimation() {
  const [visible, setVisible] = useState(shouldPlayIntro);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState("loading");
  const [fallback, setFallback] = useState(false);
  const overlayRef = useRef(null);
  const videoRef = useRef(null);
  const skipRef = useRef(null);
  const previousFocusRef = useRef(null);
  const finishedRef = useRef(false);
  const startedRef = useRef(false);
  const phaseRef = useRef("loading");
  const durationRef = useRef(8.04);
  const timersRef = useRef(new Set());
  const frameRef = useRef(0);

  const setIntroPhase = useCallback((nextPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }, []);

  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer);
      callback();
    }, delay);
    timersRef.current.add(timer);
    return timer;
  }, []);

  const clearScheduled = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer));
    timersRef.current.clear();
    if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
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
    clearScheduled();
    rememberIntroPlayback();
    clearIntroClasses();
    setVisible(false);
  }, [clearScheduled]);

  const finish = useCallback(() => {
    if (finishedRef.current || phaseRef.current === "exiting") return;
    setIntroPhase("exiting");
    releaseHero();
    schedule(finishImmediately, 720);
  }, [finishImmediately, releaseHero, schedule, setIntroPhase]);

  const startFallback = useCallback(() => {
    if (finishedRef.current || fallback) return;
    videoRef.current?.pause();
    setFallback(true);
    setReady(true);
    setIntroPhase("fallback");
    overlayRef.current?.style.setProperty("--intro-progress", "0.12");

    schedule(() => {
      setIntroPhase("brand");
      overlayRef.current?.style.setProperty("--intro-progress", "0.62");
    }, 620);
    schedule(() => {
      setIntroPhase("handoff");
      overlayRef.current?.style.setProperty("--intro-progress", "1");
      releaseHero();
    }, 2050);
    schedule(finish, 2800);
  }, [fallback, finish, releaseHero, schedule, setIntroPhase]);

  const updateTimeline = useCallback(() => {
    const video = videoRef.current;
    if (!video || finishedRef.current || fallback) return;

    const duration = Number.isFinite(video.duration) && video.duration > 0
      ? video.duration
      : durationRef.current;
    durationRef.current = duration;
    const progress = Math.min(1, Math.max(0, video.currentTime / duration));
    overlayRef.current?.style.setProperty("--intro-progress", progress.toFixed(5));

    if (video.currentTime >= Math.max(0, duration - 1.72) && phaseRef.current === "playing") {
      setIntroPhase("brand");
    }
    if (
      video.currentTime >= Math.max(0, duration - 0.42) &&
      phaseRef.current !== "handoff" &&
      phaseRef.current !== "exiting"
    ) {
      setIntroPhase("handoff");
      releaseHero();
    }

    if (!video.paused && !video.ended) {
      frameRef.current = window.requestAnimationFrame(updateTimeline);
    }
  }, [fallback, releaseHero, setIntroPhase]);

  const handleReady = useCallback(() => {
    if (startedRef.current || finishedRef.current) return;
    startedRef.current = true;
    setReady(true);
    setIntroPhase("playing");
    rememberIntroPlayback();

    const video = videoRef.current;
    if (!video) {
      startFallback();
      return;
    }

    if (Number.isFinite(video.duration) && video.duration > 0) {
      durationRef.current = video.duration;
    }

    const playback = video.play();
    playback
      ?.then(() => {
        if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
        frameRef.current = window.requestAnimationFrame(updateTimeline);
      })
      .catch(startFallback);
  }, [setIntroPhase, startFallback, updateTimeline]);

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

    const safetyTimer = schedule(startFallback, 5200);
    const absoluteSafetyTimer = schedule(finishImmediately, 15000);

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.clearTimeout(safetyTimer);
      window.clearTimeout(absoluteSafetyTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      clearScheduled();
      clearIntroClasses();
    };
  }, [clearScheduled, finish, finishImmediately, schedule, startFallback, visible]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.overlay}
      data-phase={phase}
      data-ready={ready ? "true" : "false"}
      data-fallback={fallback ? "true" : "false"}
      role="dialog"
      aria-modal="true"
      aria-label="Fakhri Mart cinematic introduction"
    >
      <div
        className={styles.backdrop}
        style={{ backgroundImage: `url(${POSTER_SRC})` }}
        aria-hidden="true"
      />
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.reelMeta} aria-hidden="true">
        <span>Fakhri Mart</span>
        <i />
        <span>The maker&apos;s opening</span>
      </div>
      <span className={styles.locationMeta} aria-hidden="true">Pune · India</span>

      <div className={styles.cinemaFrame} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          src={VIDEO_SRC}
          poster={POSTER_SRC}
          muted
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload noplaybackrate nofullscreen"
          onLoadedMetadata={(event) => {
            if (Number.isFinite(event.currentTarget.duration)) {
              durationRef.current = event.currentTarget.duration;
            }
          }}
          onCanPlay={handleReady}
          onPlaying={updateTimeline}
          onEnded={finish}
          onError={startFallback}
        />
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

      <div className={styles.loading} aria-hidden="true">
        <img
          src="/assets/brand/fakhri-logo-256.webp"
          alt=""
          width="256"
          height="256"
        />
        <p>Preparing the atelier</p>
        <span />
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
