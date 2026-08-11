import { ChatCircleDots, Check, Copy, Printer, ShareNetwork } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { createWhatsAppLink } from "../data/siteData.js";
import { trackEngagement } from "../lib/engagementAnalytics.js";

function buildSummary(basket, context) {
  const lines = ["FAKHRI MART MATERIAL ENQUIRY", ""];
  if (context.mode) lines.push(`Buying mode: ${context.mode}`);
  if (context.project.trim()) lines.push(`Project / purpose: ${context.project.trim()}`);
  if (context.location.trim()) lines.push(`Delivery city / postcode: ${context.location.trim()}`);
  if (context.note.trim()) lines.push(`Overall note: ${context.note.trim()}`);
  lines.push("", "Materials:");

  basket.forEach((item, index) => {
    const parts = [`${index + 1}. ${item.name}`];
    if (item.variant) parts.push(`Option: ${item.variant}`);
    if (item.shade?.name) parts.push(`Shade: ${item.shade.name}`);
    parts.push(`Quantity: ${item.quantity} ${item.unit || "pcs"}`);
    if (item.note) parts.push(`Item note: ${item.note}`);
    lines.push(parts.join(" | "));
  });

  lines.push("", "Please confirm current availability, shade/batch photos where relevant, pack details, quantity-based pricing and delivery timing.");
  return lines.join("\n");
}

export default function EnquirySummaryTools({ basket = [] }) {
  const [mode, setMode] = useState("Retail / personal project");
  const [project, setProject] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const [copied, setCopied] = useState(false);
  const context = { mode, project, location, note };
  const summary = useMemo(() => buildSummary(basket, context), [basket, mode, project, location, note]);

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      trackEngagement("enquiry_summary_copy", { count: basket.length, source: "enquiry-builder" });
    } catch {
      // Clipboard may be blocked; the visible preview remains selectable.
    }
  };

  const shareSummary = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Fakhri Mart material enquiry", text: summary });
        trackEngagement("enquiry_summary_share", { count: basket.length, source: "enquiry-builder" });
        return;
      } catch (error) {
        if (error?.name === "AbortError") return;
      }
    }
    await copySummary();
  };

  const printSummary = () => {
    trackEngagement("enquiry_summary_print", { count: basket.length, source: "enquiry-builder" });
    window.print();
  };

  return (
    <section className="enquiry-summary-tools" aria-labelledby="enquiry-summary-tools-title">
      <div className="enquiry-summary-tools__head">
        <div>
          <p className="eyebrow">Enquiry builder</p>
          <h3 id="enquiry-summary-tools-title">Turn your basket into one clear material brief</h3>
          <p>Useful for WhatsApp, copying into another chat, sharing with a project partner or printing as a purchase list.</p>
        </div>
        <span>{basket.length} {basket.length === 1 ? "line" : "lines"}</span>
      </div>

      <div className="enquiry-summary-context">
        <label>
          Buying mode
          <select value={mode} onChange={(event) => setMode(event.target.value)}>
            <option>Retail / personal project</option>
            <option>Bulk / wholesale</option>
            <option>Repeat supply / reseller</option>
          </select>
        </label>
        <label>
          Project / purpose
          <input value={project} onChange={(event) => setProject(event.target.value)} placeholder="e.g. 4 crochet bags" maxLength={100} />
        </label>
        <label>
          Delivery city / postcode
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Pune 411028" maxLength={80} />
        </label>
        <label className="enquiry-summary-context__wide">
          Overall note
          <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="e.g. Prefer one matching dye/shade lot where possible" maxLength={180} />
        </label>
      </div>

      <div className="enquiry-summary-preview">
        <span>Preview</span>
        <pre>{summary}</pre>
      </div>

      <div className="enquiry-summary-actions">
        <a
          className="btn btn-whatsapp"
          href={createWhatsAppLink(summary)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEngagement("whatsapp_click", { count: basket.length, source: "enquiry-builder" })}
        >
          <ChatCircleDots size={17} /> Send this brief on WhatsApp
        </a>
        <button type="button" className="btn btn-outline" onClick={copySummary}>
          {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy brief"}
        </button>
        <button type="button" className="btn btn-outline" onClick={shareSummary}>
          <ShareNetwork size={16} /> Share
        </button>
        <button type="button" className="btn btn-outline" onClick={printSummary}>
          <Printer size={16} /> Print / save PDF
        </button>
      </div>
    </section>
  );
}
