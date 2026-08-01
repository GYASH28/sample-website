import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import "../intro-video.css";

const INTRO_STORAGE_KEY = "fakhri_intro_video_v1";
const INTRO_VIDEO_SRC = "/assets/videos/fakhri-intro.mp4";
const LOAD_TIMEOUT_MS = 10000;

function removeBootCover() {
  document.documentElement.classList.remove("intro-boot-pending");
}

export default function IntroAnimation({ onComplete }) {
  const [videoReady, setVideoReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const completedRef = useRef(false);
  const loadTimeoutRef = useRef(null);

  const completeIntro = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    window.sessionStorage.setItem(INTRO_STORAGE_KEY, "true");
    setExiting(true);
  }, []);

  useEffect(() => {
    document.body.classList.add("intro-video-running");

    // Keep the pre-paint cream cover until this full-screen component is mounted.
    window.requestAnimationFrame(removeBootCover);
    loadTimeoutRef.current = window.setTimeout(completeIntro, LOAD_TIMEOUT_MS);

    return () => {
      window.clearTimeout(loadTimeoutRef.current);
      document.body.classList.remove("intro-video-running");
      removeBootCover();
    };
  }, [completeIntro]);

  const handlePlaying = () => {
    setVideoReady(true);
    window.clearTimeout(loadTimeoutRef.current);
  };

  return (
    <motion.div
      className="video-intro-overlay"
      role="dialog"
      aria-label="Fakhri Mart opening animation"
      aria-modal="true"
      initial={{ opacity: 1 }}
      animate={{ opacity: exiting ? 0 : 1, scale: exiting ? 1.008 : 1 }}
      transition={{ duration: exiting ? 0.52 : 0, ease: [0.22, 1, 0.36, 1] }}
      onAnimationComplete={() => {
        if (exiting) onComplete();
      }}
    >
      <div className="video-intro-ambient" aria-hidden="true" />

      <div className={`video-intro-loading ${videoReady ? "is-hidden" : ""}`} aria-hidden="true">
        <img src="/assets/fakhri-mart-logo.webp" alt="" />
        <span />
      </div>

      <video
        className={`video-intro-video ${videoReady ? "is-ready" : ""}`}
        src={INTRO_VIDEO_SRC}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        onPlaying={handlePlaying}
        onEnded={completeIntro}
        onError={completeIntro}
        aria-hidden="true"
      />

      <button
        type="button"
        className="video-intro-skip"
        onClick={completeIntro}
        aria-label="Skip Fakhri Mart opening animation"
      >
        Skip intro
        <span aria-hidden="true">→</span>
      </button>
    </motion.div>
  );
}
