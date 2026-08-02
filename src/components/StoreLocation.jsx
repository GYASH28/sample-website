import { ExternalLink, MapPinned, Navigation, Store } from "lucide-react";
import { businessInfo } from "../data/siteData.js";
import { googlePresence } from "../data/businessProfile.js";

export default function StoreLocation({ compact = false }) {
  return (
    <section className={`store-location ${compact ? "store-location--compact" : ""}`} aria-labelledby="store-location-title">
      <div className="store-location__map">
        <iframe
          src={googlePresence.mapsEmbedUrl}
          title="Google Map showing Fakhri Mart in Pune"
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="store-location__content">
        <p className="eyebrow">Visit Fakhri Mart</p>
        <h2 id="store-location-title">Find the store on Google</h2>
        <p>
          Use the official listing for directions and the latest Google business information. For catalogue,
          product availability or shade enquiries, message before visiting.
        </p>

        <address className="store-location__address">
          <MapPinned size={20} aria-hidden="true" />
          <span>
            <strong>{businessInfo.name}</strong>
            <small>{businessInfo.location}</small>
          </span>
        </address>

        <div className="store-location__facts" aria-label="Store information">
          <span><Store size={17} aria-hidden="true" /> {businessInfo.descriptor}</span>
          <span>{businessInfo.hours}</span>
          <span>{businessInfo.delivery}</span>
        </div>

        <div className="store-location__actions">
          <a
            className="btn btn-primary"
            href={googlePresence.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Fakhri Mart directions in Google Maps"
          >
            <Navigation size={18} aria-hidden="true" />
            Get Directions
          </a>
          <a
            className="btn btn-outline"
            href={googlePresence.businessProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open the Fakhri Mart Google Business Profile"
          >
            <ExternalLink size={18} aria-hidden="true" />
            Google Business Profile
          </a>
        </div>
      </div>
    </section>
  );
}
