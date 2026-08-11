import { ArrowsLeftRight } from "@phosphor-icons/react";
import { useState } from "react";
import { useCompare } from "../hooks/useCompare.js";
import { trackEngagement } from "../lib/engagementAnalytics.js";

export default function CompareButton({ product, className = "", compact = false }) {
  const { has, toggle, count, max } = useCompare();
  const [feedback, setFeedback] = useState("");
  const selected = has(product.slug);

  const onToggle = () => {
    const result = toggle(product.slug);
    if (result.reason === "full") {
      setFeedback(`Compare up to ${max} materials`);
      window.setTimeout(() => setFeedback(""), 1800);
      return;
    }
    trackEngagement(result.added ? "compare_added" : "compare_removed", {
      product: product.slug,
      category: product.category,
      count: result.compare.length,
    });
    setFeedback(result.added ? "Added to compare" : "Removed from compare");
    window.setTimeout(() => setFeedback(""), 1200);
  };

  return (
    <span className={`compare-action-wrap ${className}`}>
      <button
        type="button"
        className={`compare-action ${compact ? "compare-action--compact" : ""} ${selected ? "is-selected" : ""}`}
        onClick={onToggle}
        aria-pressed={selected}
        aria-label={`${selected ? "Remove" : "Add"} ${product.name} ${selected ? "from" : "to"} comparison`}
        title={selected ? "Remove from comparison" : `Compare this material (${count}/${max})`}
      >
        <ArrowsLeftRight size={compact ? 15 : 17} aria-hidden="true" />
        {compact ? null : <span>{selected ? "Comparing" : "Compare"}</span>}
      </button>
      {feedback ? <span className="compare-feedback" role="status">{feedback}</span> : null}
    </span>
  );
}
