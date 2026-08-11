import { Question } from "@phosphor-icons/react";
import { useId, useState } from "react";
import { findGlossaryTerm } from "../data/discoveryData.js";

export default function GlossaryTerm({ term, children }) {
  const entry = findGlossaryTerm(term);
  const [open, setOpen] = useState(false);
  const id = useId();
  if (!entry) return children || term;

  return (
    <span className="glossary-term-wrap">
      <button
        type="button"
        className="glossary-term"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
        onBlur={(event) => {
          if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) setOpen(false);
        }}
      >
        <span>{children || term}</span>
        <Question size={13} aria-hidden="true" />
      </button>
      {open ? (
        <span id={id} className="glossary-popover" role="tooltip" tabIndex={-1}>
          <strong>{entry.term}</strong>
          <span>{entry.definition}</span>
        </span>
      ) : null}
    </span>
  );
}
