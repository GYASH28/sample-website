import { ArrowRight, CubeFocus, Sparkle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LOGO_MODEL_DATA_URL from "../data/logo3dHighlight.js";

const MODEL_VIEWER_SRC = "https://unpkg.com/@google/model-viewer@4.1.0/dist/model-viewer.min.js";
let modelViewerPromise;

function ensureModelViewer() {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.customElements?.get("model-viewer")) return Promise.resolve(true);
  if (modelViewerPromise) return modelViewerPromise;

  modelViewerPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[data-fakhri-model-viewer="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.customElements?.get("model-viewer"))), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = MODEL_VIEWER_SRC;
    script.dataset.fakhriModelViewer = "true";
    script.addEventListener("load", () => resolve(Boolean(window.customElements?.get("model-viewer"))), { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.appendChild(script);
  });

  return modelViewerPromise;
}

export default function BrandModelHighlight() {
  const [requested, setRequested] = useState(false);
  const [ready, setReady] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    if (!requested || ready || loadFailed) return undefined;
    let active = true;

    ensureModelViewer().then((available) => {
      if (!active) return;
      if (available) setReady(true);
      else setLoadFailed(true);
    });

    return () => {
      active = false;
    };
  }, [requested, ready, loadFailed]);

  return (
    <section className="brand-model-highlight" aria-labelledby="brand-model-title">
      <div className="container brand-model-highlight__grid">
        <div className="brand-model-highlight__copy">
          <p className="eyebrow">A mark made to feel tactile</p>
          <h2 id="brand-model-title">Meet the Fakhri Mart mark in three dimensions.</h2>
          <p>
            The identity takes the same material-first idea as the catalogue: soft craft character,
            dimensional detail and a modern finish without losing the warmth of a local yarn store.
          </p>
          <div className="brand-model-highlight__notes" aria-label="3D brand highlight details">
            <span><CubeFocus size={18} weight="duotone" /> Drag to inspect</span>
            <span><Sparkle size={18} weight="duotone" /> Loads only when you choose</span>
          </div>
          <Link className="text-link" to="/products">
            Explore the materials behind the brand <ArrowRight size={18} />
          </Link>
        </div>

        <div className="brand-model-highlight__stage">
          <div className="brand-model-highlight__halo" aria-hidden="true" />
          {ready ? (
            <model-viewer
              className="brand-model-highlight__viewer"
              src={LOGO_MODEL_DATA_URL}
              alt="Interactive three-dimensional Fakhri Mart yarn store logo"
              camera-controls
              camera-orbit="0deg 78deg 3.15m"
              min-camera-orbit="auto 58deg 2.7m"
              max-camera-orbit="auto 96deg 4m"
              interaction-prompt="none"
              shadow-intensity="0.7"
              shadow-softness="0.9"
              exposure="1.05"
              environment-image="neutral"
              touch-action="pan-y"
            />
          ) : (
            <div className="brand-model-highlight__poster" aria-label="Fakhri Mart 3D logo preview">
              <span className="brand-model-highlight__poster-ring" aria-hidden="true" />
              <img
                src="/assets/brand/fakhri-logo-256.webp"
                alt="Fakhri Mart logo"
                width="256"
                height="256"
                loading="lazy"
                decoding="async"
              />
              <button
                type="button"
                onClick={() => {
                  setLoadFailed(false);
                  setRequested(true);
                }}
                disabled={requested && !loadFailed}
              >
                <CubeFocus size={18} />
                {requested && !loadFailed ? "Loading 3D…" : loadFailed ? "Retry interactive 3D" : "Explore in 3D"}
              </button>
              {loadFailed ? (
                <span className="brand-model-highlight__fallback-note" role="status">
                  Interactive view is unavailable right now. The page remains fully usable.
                </span>
              ) : null}
            </div>
          )}
          <span className="brand-model-highlight__caption">Fakhri Mart · Pune</span>
        </div>
      </div>
    </section>
  );
}
