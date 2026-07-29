import { House, MagnifyingGlass } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

export default function NotFound() {
  useDocumentMeta({
    title: "Page not found",
    description:
      "The requested Fakhri Mart page could not be found. Browse the yarn and craft materials catalogue.",
  });

  return (
    <section className="page-hero not-found-hero">
      <div className="container page-hero-grid">
        <Reveal variant="slide-left">
          <p className="eyebrow">404</p>
          <h1>That thread ends here</h1>
          <p className="page-hero-text">
            This page is no longer available. Return home or continue into the
            material catalogue.
          </p>
          <div className="button-row" style={{ marginTop: "24px" }}>
            <Link className="btn btn-primary" to="/">
              <House size={18} aria-hidden="true" />
              Back home
            </Link>
            <Link className="btn btn-outline" to="/products">
              <MagnifyingGlass size={18} aria-hidden="true" />
              Browse catalogue
            </Link>
          </div>
        </Reveal>
        <Reveal className="page-hero-side" delay={100} variant="scale-in">
          <picture>
            <source
              srcSet="/assets/images/editorial/shade-library.avif"
              type="image/avif"
            />
            <img
              src="/assets/images/editorial/shade-library.webp"
              alt="Yarn shades and crochet swatches arranged on a work surface"
              width="1536"
              height="1024"
            />
          </picture>
        </Reveal>
      </div>
    </section>
  );
}
