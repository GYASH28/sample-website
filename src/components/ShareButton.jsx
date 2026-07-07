import { useEffect, useState } from "react";
import { Share2, Check, Link2 } from "lucide-react";

/**
 * ShareButton — uses native Web Share API on mobile, falls back to copy-link on desktop.
 * Replaces the old "Copy Page Link" button.
 */
export default function ShareButton({ url, title, text, className = "" }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const shareData = {
    title: title || "Fakhri Mart",
    text: text || "Check out this product from Fakhri Mart",
    url: url || (typeof window !== "undefined" ? window.location.href : ""),
  };

  async function handleShare() {
    if (canShare) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled — no action needed
        if (err.name !== "AbortError") {
          // Fallback to copy
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  }

  function handleCopy() {
    try {
      navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available — try legacy
      const textarea = document.createElement("textarea");
      textarea.value = shareData.url;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {}
      document.body.removeChild(textarea);
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`btn btn-outline btn-small share-btn ${className}`}
      aria-label={canShare ? `Share ${title}` : `Copy link for ${title}`}
    >
      {copied ? (
        <>
          <Check size={14} aria-hidden="true" />
          Copied!
        </>
      ) : canShare ? (
        <>
          <Share2 size={14} aria-hidden="true" />
          Share
        </>
      ) : (
        <>
          <Link2 size={14} aria-hidden="true" />
          Copy Link
        </>
      )}
    </button>
  );
}
