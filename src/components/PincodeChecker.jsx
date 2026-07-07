import { useState } from "react";
import { MapPin, Check, Loader2, Truck } from "lucide-react";
import { businessInfo } from "../data/siteData.js";

/**
 * PincodeChecker — "Check delivery to your area" widget.
 * Amazon-style: user types pincode, gets instant confirmation.
 * Since Fakhri Mart ships all-India, the answer is always yes —
 * but the INTERACTION builds more trust than a static line.
 */
export default function PincodeChecker() {
  const [pincode, setPincode] = useState("");
  const [status, setStatus] = useState("idle"); // idle | checking | yes | invalid

  function check(e) {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setStatus("invalid");
      return;
    }
    setStatus("checking");
    // Simulate brief network check for UX realism
    setTimeout(() => {
      setStatus("yes");
    }, 800);
  }

  if (status === "yes") {
    return (
      <div className="pincode-result pincode-yes" style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-2)",
        padding: "var(--space-2) var(--space-3)",
        background: "rgba(73, 136, 94, 0.1)",
        border: "1px solid rgba(73, 136, 94, 0.25)",
        borderRadius: "var(--radius)",
        fontSize: "0.85rem",
        color: "var(--charcoal)",
      }}>
        <Check size={16} style={{ color: "#49885E" }} aria-hidden="true" />
        <span>
          <strong style={{ color: "#49885E" }}>Yes, we deliver to {pincode}!</strong>{" "}
          <span style={{ color: "var(--muted)" }}>Typical transit: 3–5 business days.</span>
        </span>
        <button
          type="button"
          onClick={() => { setStatus("idle"); setPincode(""); }}
          style={{
            marginLeft: "auto",
            background: "none",
            border: "none",
            color: "var(--muted)",
            cursor: "pointer",
            fontSize: "0.8rem",
            textDecoration: "underline",
          }}
          aria-label="Check another pincode"
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={check} className="pincode-checker" style={{ display: "flex", gap: "var(--space-2)" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <MapPin
          size={16}
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted)",
          }}
        />
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="Enter pincode (e.g. 411001)"
          value={pincode}
          onChange={(e) => {
            setPincode(e.target.value.replace(/[^0-9]/g, ""));
            setStatus("idle");
          }}
          aria-label="Enter your pincode to check delivery"
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            border: `1px solid ${status === "invalid" ? "var(--pink-dark)" : "var(--line)"}`,
            borderRadius: "var(--radius)",
            background: "var(--surface)",
            fontSize: "0.85rem",
            color: "var(--ink)",
            fontFamily: "var(--font-body)",
            outline: "none",
            transition: "border-color var(--duration-quick) var(--ease-soft)",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={status === "checking" || pincode.length !== 6}
        style={{
          padding: "10px 16px",
          background: "var(--teal)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius)",
          fontSize: "0.85rem",
          fontWeight: "600",
          cursor: status === "checking" ? "wait" : "pointer",
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          opacity: status === "checking" || pincode.length !== 6 ? 0.6 : 1,
          transition: "opacity var(--duration-quick) var(--ease-soft)",
          whiteSpace: "nowrap",
        }}
      >
        {status === "checking" ? (
          <Loader2 size={14} className="spin" aria-hidden="true" />
        ) : (
          <Truck size={14} aria-hidden="true" />
        )}
        Check
      </button>
      {status === "invalid" && (
        <span style={{ alignSelf: "center", fontSize: "0.75rem", color: "var(--pink-dark)" }}>
          6-digit pincode only
        </span>
      )}
    </form>
  );
}
