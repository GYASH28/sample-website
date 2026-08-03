import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const SCENE_SELECTOR = [
  "#main-content section",
  "#main-content article",
  "#main-content .page-hero",
].join(",");

const CARD_SELECTOR = [
  "#main-content .product-card",
  "#main-content .category-card",
  "#main-content .blog-story-card",
  "#main-content .contact-card",
  "#main-content .gallery-editorial-grid figure",
  "#main-content .store-location",
  "#main-content .yarn-guide-project",
].join(",");

const MEDIA_SELECTOR = [
  "#main-content figure",
  "#main-content .catalogue-hero-photo",
  "#main-content .product-card-media",
  "#main-content .store-location__map",
].join(",");

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

function elementProgress(element, viewportHeight) {
  const rect = element.getBoundingClientRect();
  return clamp((viewportHeight - rect.top) / (viewportHeight + rect.height));
}

export default function ScrollDirector() {
  const { pathname } = useLocation();
  const frameRef = useRef(0);

  useEffect(() => {
    const root = document.documentElement;
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    if (reducedQuery.matches) {
      root.style.setProperty("--page-scroll", "1");
      root.style.setProperty("--thread-offset", "0");
      root.style.setProperty("--scroll-percent", "100%");
      return undefined;
    }

    let scenes = [];
    let cards = [];
    let media = [];
    let collectionTimers = [];

    const markElements = () => {
      scenes = [...document.querySelectorAll(SCENE_SELECTOR)].filter(
        (element, index, collection) =>
          element instanceof HTMLElement && collection.indexOf(element) === index,
      );
      cards = [...document.querySelectorAll(CARD_SELECTOR)].filter(
        (element) => element instanceof HTMLElement,
      );
      media = [...document.querySelectorAll(MEDIA_SELECTOR)].filter(
        (element) =>
          element instanceof HTMLElement &&
          !element.closest("[data-scroll-media='false']"),
      );

      scenes.forEach((element) => {
        element.dataset.scrollScene = "true";
      });
      cards.forEach((element) => {
        element.dataset.scrollCard = "true";
      });
      media.forEach((element) => {
        element.dataset.scrollMedia = "true";
      });
    };

    const update = () => {
      frameRef.current = 0;
      const viewportHeight = Math.max(window.innerHeight, 1);
      const scrollable = Math.max(root.scrollHeight - viewportHeight, 1);
      const pageProgress = clamp(window.scrollY / scrollable);
      const profile = root.dataset.motionProfile;
      const intensity = profile === "lite" ? 0 : profile === "compact" ? 0.56 : 1;

      root.style.setProperty("--page-scroll", pageProgress.toFixed(5));
      root.style.setProperty("--thread-offset", (1 - pageProgress).toFixed(5));
      root.style.setProperty("--scroll-percent", `${(pageProgress * 100).toFixed(3)}%`);

      for (const element of scenes) {
        const progress = elementProgress(element, viewportHeight);
        const shift = (0.5 - progress) * 22 * intensity;
        element.style.setProperty("--scene-progress", progress.toFixed(4));
        element.style.setProperty("--scene-shift", `${shift.toFixed(2)}px`);
        element.style.setProperty(
          "--scene-line",
          clamp(progress * 1.38).toFixed(4),
        );
      }

      for (const element of cards) {
        const progress = elementProgress(element, viewportHeight);
        const lift = (0.5 - progress) * 12 * intensity;
        element.style.setProperty("--scroll-lift", `${lift.toFixed(2)}px`);
      }

      for (const element of media) {
        const progress = elementProgress(element, viewportHeight);
        const distance = Math.abs(0.5 - progress);
        const scale = 1 + distance * 0.032 * intensity;
        const shift = (0.5 - progress) * 10 * intensity;
        element.style.setProperty("--scroll-media-scale", scale.toFixed(4));
        element.style.setProperty("--scroll-media-shift", `${shift.toFixed(2)}px`);
      }
    };

    const scheduleUpdate = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(update);
    };

    const collectAndUpdate = () => {
      markElements();
      scheduleUpdate();
    };

    const handlePointerMove = (event) => {
      if (!finePointerQuery.matches) return;
      root.style.setProperty("--pointer-x", `${event.clientX}px`);
      root.style.setProperty("--pointer-y", `${event.clientY}px`);
    };

    collectAndUpdate();
    collectionTimers = [80, 280, 760].map((delay) =>
      window.setTimeout(collectAndUpdate, delay),
    );

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(document.body);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", collectAndUpdate, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
      collectionTimers.forEach((timer) => window.clearTimeout(timer));
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", collectAndUpdate);
      window.removeEventListener("pointermove", handlePointerMove);

      [...scenes, ...cards, ...media].forEach((element) => {
        delete element.dataset.scrollScene;
        delete element.dataset.scrollCard;
        delete element.dataset.scrollMedia;
        element.style.removeProperty("--scene-progress");
        element.style.removeProperty("--scene-shift");
        element.style.removeProperty("--scene-line");
        element.style.removeProperty("--scroll-lift");
        element.style.removeProperty("--scroll-media-scale");
        element.style.removeProperty("--scroll-media-shift");
      });
    };
  }, [pathname]);

  return (
    <div className="scroll-director" aria-hidden="true">
      <span className="scroll-director__aurora" />
      <span className="scroll-director__rail">
        <i />
      </span>
      <svg
        className="scroll-director__thread"
        viewBox="0 0 72 1000"
        preserveAspectRatio="none"
      >
        <path
          d="M38 0 C8 128 66 236 32 360 C4 470 69 585 35 710 C15 790 57 880 32 1000"
          pathLength="1"
        />
      </svg>
      <span className="scroll-director__needle" />
    </div>
  );
}
