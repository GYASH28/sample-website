import { ArrowRight, Check } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { aboutCopy, aboutPoints, businessInfo } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

export default function About() {
  useDocumentMeta({
    title: "About Fakhri Mart — Yarn & Craft Supplier in Pune",
    description: "Meet Fakhri Mart, a Pune-based yarn and craft-material supplier serving makers, boutiques, resellers and wholesale buyers across India.",
    canonical: "/about",
  });

  return (
    <>
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div>
            <p className="eyebrow">Pune based · India wide</p>
            <h1>A material partner for makers who need more than a pretty shade.</h1>
            <p className="large-copy">
              We help individual crafters, small labels, resellers and craft stores find workable
              yarns, cords, threads and finishing supplies—then confirm the practical details on WhatsApp.
            </p>
            <Link className="text-link" to="/products">Explore the material library <ArrowRight size={18} /></Link>
          </div>
          <picture className="about-hero-image">
            <source srcSet="/assets/images/editorial/craft-stock-room.avif" type="image/avif" />
            <img
              src="/assets/images/editorial/craft-stock-room.webp"
              alt="Organised yarn, cord, embroidery thread, beads and bag hardware in a warm craft stock room"
              width="1536"
              height="1024"
            />
          </picture>
        </div>
      </section>

      <section className="section">
        <div className="container about-story-grid">
          <div>
            <p className="eyebrow">{businessInfo.tagline}</p>
            <h2>Range when you are exploring. Specific answers when you are ordering.</h2>
          </div>
          <div>
            <p className="large-copy">{aboutCopy}</p>
            <div className="about-point-list">
              {aboutPoints.map((point) => (
                <span key={point}><Check size={18} weight="bold" /> {point}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="about-principles">
        <div className="container">
          <p className="eyebrow">How we work</p>
          <div className="principle-list">
            <article><span>01</span><h3>Show the range honestly</h3><p>Catalogue images explain the material family. Live photos confirm the current stock and exact shade.</p></article>
            <article><span>02</span><h3>Quote for the real requirement</h3><p>Quantity, size, shade and delivery location all affect a useful quote, so prices are confirmed personally.</p></article>
            <article><span>03</span><h3>Support retail and repeat buying</h3><p>One project, a boutique run or a reseller restock can start from the same structured enquiry list.</p></article>
          </div>
        </div>
      </section>
    </>
  );
}
