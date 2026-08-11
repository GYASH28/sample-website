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
  "#main-content .store-location",
  "#main-content .yarn-guide-project",
  "#main-content .about-value-card",
  "#main-content .about-process-card",
].join(",");

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

function uniqueElements(selector) {
  return [...document.querySelectorAll(selector)].filter(
    (element, index, collection) =>
      element instanceof HTMLElement && collection.indexOf(element) === index,
  );
}

export default function ScrollDirector() {
  const { pathname } = useLocation();
  const progressFrameRef = useRef(0);
  const collectionFrameRef = useRef(0);
  const progressRef = useRef(null);
  const ringRef = useRef(null);
  const hubRef = useRef(null);
  const labelRef = useRef(null);
  const lastPercentRef = useRef(-1);
  const scrollableRef = useRef(1);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const main = document.querySelector("#main-content");
    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const markedElements = new Set();

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-scroll-revealed");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "140px 0px -6% 0px", threshold: 0.02 },
    );

    const prepareReveal = (element, index = 0) => {
      if (element.dataset.scrollPrepared === "true") return;
      element.dataset.scrollPrepared = "true";
      element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 28}ms`);
      markedElements.add(element);

      if (reducedQuery.matches) {
        element.classList.add("is-scroll-revealed");
      } else {
        revealObserver.observe(element);
      }
    };

    const markElements = () => {
      collectionFrameRef.current = 0;
      const scenes = uniqueElements(SCENE_SELECTOR);
      const cards = uniqueElements(CARD_SELECTOR);

      scenes.forEach((element, index) => {
        if (element.dataset.scrollScene !== "true") {
          element.dataset.scrollScene = "true";
          markedElements.add(element);
        }
        if (index === 0) element.classList.add("is-scroll-revealed");
        else prepareReveal(element, index);
      });

      cards.forEach((element, index) => {
        if (element.dataset.scrollCard !== "true") {
          element.dataset.scrollCard = "true";
          markedElements.add(element);
        }
        prepareReveal(element, index);
      });
    };

    const scheduleCollection = () => {
      if (!collectionFrameRef.current) {
        collectionFrameRef.current = window.requestAnimationFrame(markElements);
      }
    };

    const measureScrollRange = () => {
      const viewportHeight = Math.max(window.innerHeight, 1);
      scrollableRef.current = Math.max(root.scrollHeight - viewportHeight, 1);
    };

    const updateProgress = () => {
      progressFrameRef.current = 0;
      const progress = clamp(window.scrollY / scrollableRef.current);
      const percent = Math.round(progress * 100);

      if (ringRef.current) ringRef.current.style.strokeDashoffset = `${100 - progress * 100}`;
      if (hubRef.current && !reducedQuery.matches) {
        hubRef.current.style.transform = `rotate(${(progress * 240).toFixed(1)}deg)`;
      }

      if (percent !== lastPercentRef.current) {
        lastPercentRef.current = percent;
        if (labelRef.current) labelRef.current.textContent = `${percent}`;
      }

      progressRef.current?.classList.toggle(
        "is-active",
        window.scrollY > 22 && scrollableRef.current > 90,
      );
    };

    const scheduleProgress = () => {
      if (!progressFrameRef.current) {
        progressFrameRef.current = window.requestAnimationFrame(updateProgress);
      }
    };

    const onResize = () => {
      measureScrollRange();
      scheduleProgress();
    };

    markElements();
    measureScrollRange();
    updateProgress();

    const mutationObserver = main
      ? new MutationObserver(scheduleCollection)
      : null;
    mutationObserver?.observe(main, { childList: true, subtree: true });

    // Body resize happens when lazy content, fonts or responsive sections alter
    // document height. Recalculate only then — never from the scroll callback.
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(onResize)
      : null;
    if (resizeObserver && body) resizeObserver.observe(body);

    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (progressFrameRef.current) window.cancelAnimationFrame(progressFrameRef.current);
      if (collectionFrameRef.current) window.cancelAnimationFrame(collectionFrameRef.current);
      revealObserver.disconnect();
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", scheduleProgress);
      window.removeEventListener("resize", onResize);

      markedElements.forEach((element) => {
        delete element.dataset.scrollScene;
        delete element.dataset.scrollCard;
        delete element.dataset.scrollPrepared;
        element.classList.remove("is-scroll-revealed");
        element.style.removeProperty("--reveal-delay");
      });
    };
  }, [pathname]);

  return (
    <div className="scroll-director">
      <button
        ref={progressRef}
        className="scroll-spool-progress"
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top. Circular spool shows page scroll progress."
        title="Back to top"
      >
        <svg className="scroll-spool-progress__svg" viewBox="0 0 40 40" aria-hidden="true">
          <defs>
            <linearGradient id="spool-progress-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="var(--app-rose, #b95776)" />
              <stop offset="0.5" stopColor="var(--app-gold, #8a6b25)" />
              <stop offset="1" stopColor="var(--app-teal, #2a8c82)" />
            </linearGradient>
          </defs>
          <circle className="scroll-spool-progress__track" cx="20" cy="20" r="16" pathLength="100" />
          <circle ref={ringRef} className="scroll-spool-progress__ring" cx="20" cy="20" r="16" pathLength="100" />
        </svg>
        <span ref={hubRef} className="scroll-spool-progress__hub" aria-hidden="true">
          <small ref={labelRef}>0</small>
        </span>
        <span className="scroll-spool-progress__thread" aria-hidden="true" />
        <span className="scroll-spool-progress__shine" aria-hidden="true" />
      </button>
    </div>
  );
}
