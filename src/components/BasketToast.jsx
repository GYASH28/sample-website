import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ease, duration } from "../motion-tokens.js";

/**
 * BasketToast — slides in when items are added to the enquiry basket.
 * Auto-dismisses after 3.5 seconds. Doesn't block. Clicking goes to /enquiry.
 *
 * Listens to the "enquiry-basket-updated" window event (fired by useEnquiryBasket).
 *
 * Phase 3 item 6: adds body.toast-visible class so FloatingWhatsApp can bump up.
 * Phase 6 item 9: useEffect dependency fixed — was [prevCount] (re-bound on every
 * basket update), now [] with a ref for prevCount.
 */
export default function BasketToast() {
  const [toast, setToast] = useState(null); // { itemName, count }
  const prevCountRef = useRef(0);
  const dismissTimerRef = useRef(null);

  useEffect(() => {
    // Initialize prevCount from current basket
    try {
      const basket = JSON.parse(localStorage.getItem("fakhri_enquiry_basket") || "[]");
      prevCountRef.current = basket.length;
    } catch {
      prevCountRef.current = 0;
    }

    function handleUpdate() {
      try {
        const basket = JSON.parse(localStorage.getItem("fakhri_enquiry_basket") || "[]");
        const count = basket.length;
        if (count > prevCountRef.current && count > 0) {
          // Item was added (count increased)
          const lastItem = basket[basket.length - 1];
          setToast({
            itemName: lastItem?.name || "Item",
            count,
          });
          // Add body class so FloatingWhatsApp bumps up
          document.body.classList.add("toast-visible");
          // Clear any existing timer, then auto-dismiss after 3.5s
          if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
          dismissTimerRef.current = setTimeout(() => {
            setToast(null);
            document.body.classList.remove("toast-visible");
          }, 3500);
        }
        prevCountRef.current = count;
      } catch {}
    }

    window.addEventListener("enquiry-basket-updated", handleUpdate);
    return () => {
      window.removeEventListener("enquiry-basket-updated", handleUpdate);
      if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
      document.body.classList.remove("toast-visible");
    };
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          className="basket-toast"
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ duration: duration.standard, ease: ease.soft }}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            maxWidth: "340px",
            background: "var(--surface)",
            borderRadius: "var(--radius-lg, 14px)",
            boxShadow: "0 12px 40px rgba(67, 52, 43, 0.22)",
            border: "1px solid var(--line)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          {/* Check icon */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "rgba(73, 136, 94, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Check size={18} style={{ color: "#49885E" }} aria-hidden="true" />
          </div>

          {/* Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--charcoal)" }}>
              {toast.itemName} added to enquiry
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
              {toast.count} {toast.count === 1 ? "item" : "items"} in basket
            </div>
          </div>

          {/* Review link */}
          <Link
            to="/enquiry"
            style={{
              padding: "6px 14px",
              background: "var(--gold)",
              color: "#fff",
              borderRadius: "var(--radius-pill, 999px)",
              fontSize: "0.78rem",
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Review
          </Link>

          {/* Close button */}
          <button
            type="button"
            onClick={() => {
              setToast(null);
              document.body.classList.remove("toast-visible");
            }}
            aria-label="Dismiss notification"
            style={{
              background: "none",
              border: "none",
              color: "var(--muted)",
              cursor: "pointer",
              padding: "4px",
              flexShrink: 0,
            }}
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
