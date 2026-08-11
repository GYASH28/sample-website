import { Camera, ChatCircleDots, Heart } from "@phosphor-icons/react";
import { CUSTOMER_CREATIONS } from "../data/discoveryData.js";
import { createWhatsAppLink } from "../data/siteData.js";
import { trackEngagement } from "../lib/engagementAnalytics.js";

export default function MadeWithFakhri({ compact = false }) {
  const submissionMessage = "Hello Fakhri Mart, I made something using material bought from you and would like to share a photo for your ‘Made with Fakhri Mart’ showcase. Please let me know how to send it and confirm permission before publishing.";

  return (
    <section className={`made-with-fakhri ${compact ? "made-with-fakhri--compact" : ""}`} aria-labelledby="made-with-fakhri-title">
      <div className="made-with-fakhri__intro">
        <span className="made-with-fakhri__icon" aria-hidden="true"><Heart size={22} weight="fill" /></span>
        <div>
          <p className="eyebrow">Real maker stories</p>
          <h2 id="made-with-fakhri-title">Made with Fakhri Mart</h2>
          <p>Customer work is shown here only after the maker and material are verified and permission to publish is confirmed. No stock photos or invented testimonials.</p>
        </div>
      </div>

      {CUSTOMER_CREATIONS.length ? (
        <div className="made-with-fakhri__grid">
          {CUSTOMER_CREATIONS.map((creation) => (
            <article key={creation.id} className="maker-card">
              <img src={creation.image} alt={creation.alt} loading="lazy" decoding="async" />
              <div>
                <strong>{creation.project}</strong>
                <span>{creation.material}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="made-with-fakhri__empty">
          <Camera size={28} aria-hidden="true" />
          <div>
            <strong>The showcase starts with verified customer submissions.</strong>
            <p>If you made something with Fakhri Mart material, you can send it to the team for review. Nothing is published automatically.</p>
          </div>
        </div>
      )}

      <a
        className="btn btn-whatsapp"
        href={createWhatsAppLink(submissionMessage)}
        target="_blank"
        rel="noreferrer"
        onClick={() => trackEngagement("creation_submission_click", { source: "made-with-fakhri" })}
      >
        <ChatCircleDots size={17} aria-hidden="true" />
        Share your creation
      </a>
    </section>
  );
}
