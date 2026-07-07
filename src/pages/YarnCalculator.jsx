// src/pages/YarnCalculator.jsx
// Phase 3.1 — Yarn quantity calculator. No competitor template has this.
// User picks project + size → tool estimates grams/balls → offers an "Enquire with this
// estimate" button that opens WhatsApp via the existing createWhatsAppLink helper.
//
// This page is code-split (lazy in App.jsx) per Phase 4 — kept out of the main bundle.

import { useState, useMemo } from "react";
import { MessageCircle } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import { businessInfo, createWhatsAppLink } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

// Each project type has a base grams-per-unit-area and a list of size options.
// Numbers are conservative estimates for DK/worsted weight; calculator communicates the
// approximate nature clearly in the UI copy.
const PROJECTS = [
  {
    id: "scarf",
    label: "Scarf",
    emoji: "🧣",
    baseGramsPer100sqcm: 4.2,
    sizes: [
      { id: "small", label: "Small (15×120 cm)", area: 1800 },
      { id: "medium", label: "Medium (20×150 cm)", area: 3000 },
      { id: "large", label: "Large (25×180 cm)", area: 4500 },
    ],
  },
  {
    id: "amigurumi",
    label: "Amigurumi",
    emoji: "🧸",
    baseGramsPer100sqcm: 5.0,
    sizes: [
      { id: "tiny", label: "Tiny (5 cm tall)", area: 200 },
      { id: "small", label: "Small (10 cm tall)", area: 600 },
      { id: "medium", label: "Medium (15 cm tall)", area: 1200 },
    ],
  },
  {
    id: "bag",
    label: "Bag",
    emoji: "👜",
    baseGramsPer100sqcm: 6.0,
    sizes: [
      { id: "small", label: "Small (20×20 cm)", area: 800 },
      { id: "medium", label: "Medium (30×30 cm)", area: 1800 },
      { id: "large", label: "Large Market (40×40 cm)", area: 3200 },
    ],
  },
  {
    id: "wall-hanging",
    label: "Macrame Wall Hanging",
    emoji: "🪢",
    baseGramsPer100sqcm: 3.5,
    sizes: [
      { id: "small", label: "Small (30×50 cm)", area: 1500 },
      { id: "medium", label: "Medium (50×80 cm)", area: 4000 },
      { id: "large", label: "Large (80×120 cm)", area: 9600 },
    ],
  },
  {
    id: "blanket",
    label: "Blanket",
    emoji: "🛏️",
    baseGramsPer100sqcm: 4.5,
    sizes: [
      { id: "baby", label: "Baby (60×80 cm)", area: 4800 },
      { id: "throw", label: "Throw (100×130 cm)", area: 13000 },
      { id: "queen", label: "Queen (150×200 cm)", area: 30000 },
    ],
  },
];

// Average grams per ball across the catalogue — for the "balls needed" estimate
const AVG_GRAMS_PER_BALL = 80;

export default function YarnCalculator() {
  useDocumentMeta({
    title: "Yarn Calculator | Fakhri Mart",
    description: "Estimate how much yarn you need for your next scarf, amigurumi, bag, wall hanging or blanket — then enquire on WhatsApp.",
  });

  const [projectId, setProjectId] = useState(null);
  const [sizeId, setSizeId] = useState(null);

  const project = PROJECTS.find((p) => p.id === projectId);
  const size = project?.sizes.find((s) => s.id === sizeId);

  const estimate = useMemo(() => {
    if (!project || !size) return null;
    const grams = Math.round((size.area / 100) * project.baseGramsPer100sqcm);
    const balls = Math.max(1, Math.ceil(grams / AVG_GRAMS_PER_BALL));
    return { grams, balls };
  }, [project, size]);

  const enquireMessage = useMemo(() => {
    if (!estimate || !project || !size) return "";
    return `Hello ${businessInfo.shortName}, I used your yarn calculator and estimated I need approximately ${estimate.grams}g (${estimate.balls} balls) for a ${project.label} in size ${size.label}. Can you help me pick the right yarn and confirm availability? Thank you!`;
  }, [estimate, project, size]);

  return (
    <>
      <PageHero
        eyebrow="Tool"
        title="Yarn Calculator"
        text="Tell us what you're making and the size — we'll estimate how much yarn you need, then connect you to WhatsApp to enquire."
      >
        <ProductVisual palette={["#35b8ad", "#f6a7b8", "#f3c65f"]} />
      </PageHero>

      <section className="section">
        <div className="container" style={{ maxWidth: 760, margin: "0 auto" }}>
          <Reveal variant="fade-up">
            {/* Stage 1: pick project */}
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.05)",
                borderRadius: "12px",
                padding: "24px",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ marginBottom: "16px", fontSize: "1.1rem" }}>1. What are you making?</h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                  gap: "12px",
                }}
              >
                {PROJECTS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setProjectId(p.id);
                      setSizeId(null);
                    }}
                    aria-pressed={projectId === p.id}
                    style={{
                      padding: "12px",
                      background: projectId === p.id ? "#fff" : "var(--bg-tint, #faf6f0)",
                      border: `2px solid ${projectId === p.id ? "var(--pink-dark, #6B1F2A)" : "transparent"}`,
                      borderRadius: "8px",
                      textAlign: "center",
                      cursor: "pointer",
                      transition: "all 0.18s",
                    }}
                  >
                    <div style={{ fontSize: "2rem" }} aria-hidden="true">{p.emoji}</div>
                    <div style={{ fontWeight: 600, color: "var(--pink-dark, #6B1F2A)", fontSize: "0.9rem" }}>{p.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          {project && (
            <Reveal variant="fade-up">
              {/* Stage 2: pick size */}
              <div
                style={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.05)",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "16px",
                }}
              >
                <h3 style={{ marginBottom: "16px", fontSize: "1.1rem" }}>2. Pick your size</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {project.sizes.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSizeId(s.id)}
                      aria-pressed={sizeId === s.id}
                      style={{
                        padding: "12px",
                        background: sizeId === s.id ? "#fff" : "var(--bg-tint, #faf6f0)",
                        border: `2px solid ${sizeId === s.id ? "var(--pink-dark, #6B1F2A)" : "transparent"}`,
                        borderRadius: "8px",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.18s",
                      }}
                    >
                      <div style={{ fontWeight: 600, color: "var(--pink-dark, #6B1F2A)", fontSize: "0.9rem" }}>{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {estimate && (
            <Reveal variant="fade-up">
              {/* Stage 3: result */}
              <div
                style={{
                  background: "linear-gradient(135deg, var(--pink-dark, #6B1F2A), var(--pink-darker, #4A141C))",
                  color: "#F8F1E7",
                  borderRadius: "12px",
                  padding: "32px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "0.78rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--gold-soft, #D4B47A)",
                    marginBottom: "8px",
                  }}
                >
                  Estimated yarn needed
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display, 'Playfair Display', serif)",
                    fontSize: "3rem",
                    fontWeight: 800,
                    color: "var(--gold-soft, #D4B47A)",
                    lineHeight: 1,
                  }}
                >
                  {estimate.grams}
                  <span style={{ fontSize: "1.1rem", color: "#F8F1E7", opacity: 0.85 }}> g</span>
                </div>
                <div style={{ marginTop: "8px", fontSize: "0.95rem" }}>
                  ≈ {estimate.balls} balls × {AVG_GRAMS_PER_BALL}g
                </div>
                <p
                  style={{
                    marginTop: "16px",
                    fontSize: "0.78rem",
                    opacity: 0.85,
                    maxWidth: "40ch",
                    margin: "16px auto 0",
                  }}
                >
                  Estimates assume DK / worsted weight. Bulky yarn needs less, fingering needs more. Final amount varies with stitch tension.
                </p>
                <a
                  href={createWhatsAppLink(enquireMessage)}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn btn-whatsapp"
                  style={{
                    marginTop: "20px",
                    background: "var(--gold, #B8893C)",
                    borderColor: "var(--gold-deep, #8E6824)",
                    color: "#fff",
                  }}
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Enquire with this estimate
                </a>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
