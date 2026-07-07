import { Globe } from "lucide-react";
import { useLangControls } from "../i18n.jsx";

/**
 * HindiToggle — switches UI language between English and Hindi (CTAs only).
 * Product names and descriptions stay in English.
 */
export default function HindiToggle() {
  const { lang, toggle } = useLangControls();

  return (
    <button
      type="button"
      onClick={toggle}
      className="hindi-toggle"
      aria-label={lang === "en" ? "हिंदी में देखें" : "Switch to English"}
      title={lang === "en" ? "हिंदी में देखें" : "Switch to English"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "5px 10px",
        background: lang === "hi" ? "var(--gold)" : "transparent",
        color: lang === "hi" ? "#fff" : "var(--muted)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-pill, 999px)",
        fontSize: "0.78rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all var(--duration-quick) var(--ease-soft)",
        fontFamily: "var(--font-body)",
      }}
    >
      <Globe size={13} aria-hidden="true" />
      {lang === "en" ? "हिंदी" : "EN"}
    </button>
  );
}
