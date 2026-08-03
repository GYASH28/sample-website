import {
  ArrowSquareOut,
  MapPin,
  NavigationArrow,
  Storefront,
} from "@phosphor-icons/react";
import { businessInfo } from "../data/siteData.js";
import { googlePresence } from "../data/businessProfile.js";
import Reveal from "./Reveal.jsx";

export default function StoreLocation({ compact = false }) {
  return (
    <Reveal
      className={`store-location ${compact ? "store-location--compact" : ""}`}
      variant="fade-up"
    >
      <div className="store-location__copy">
        <span className="eyebrow">Visit Fakhri Mart</span>
        <h2>Find the store through the official Google listing</h2>
        <p>
          Open the verified Maps result for directions, or view the supplied Google
          Business Profile before visiting. For live stock and shade availability,
          message the store first.
        </p>

        <div className="store-location__identity">
          <Storefront size={24} aria-hidden="true" />
          <div>
            <strong>{businessInfo.name}</strong>
            <span>
              <MapPin size={16} aria-hidden="true" /> {businessInfo.location}
            </span>
          </div>
        </div>

        <div className="store-location__actions">
          <a
            className="btn btn-primary"
            href={googlePresence.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <NavigationArrow size={18} aria-hidden="true" />
            Get directions
          </a>
          <a
            className="btn btn-secondary"
            href={googlePresence.businessProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Business
            <ArrowSquareOut size={18} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="store-location__map">
        <iframe
          title="Fakhri Mart location on Google Maps"
          src={googlePresence.mapsEmbedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </Reveal>
  );
}
