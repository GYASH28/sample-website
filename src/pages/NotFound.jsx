import { Home, Search } from "lucide-react";
import { Link } from "react-router-dom";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";

export default function NotFound() {
  return (
    <>
      <section className="page-hero">
        <div className="container page-hero-grid">
          <Reveal variant="slide-left">
            <p className="eyebrow">Page Not Found</p>
            <h1>Oops! This page doesn't exist.</h1>
            <p className="page-hero-text">
              The page you're looking for may have been moved or doesn't exist.
              Let's get you back to exploring yarns, threads and craft essentials.
            </p>
            <div className="button-row" style={{ marginTop: "24px" }}>
              <Link className="btn btn-primary" to="/">
                <Home size={18} />
                Back to Home
              </Link>
              <Link className="btn btn-outline" to="/products">
                <Search size={18} />
                Browse Products
              </Link>
            </div>
          </Reveal>
          <Reveal className="page-hero-side" delay={120} variant="scale-in">
            <ProductVisual palette={["#35b8ad", "#f6a7b8", "#f3c65f"]} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
