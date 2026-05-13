import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import IconBadge from "../components/IconBadge.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { industries } from "../data/siteData.js";

export default function Industries() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Thread supply for local shops, boutiques, and production buyers"
        text="The catalogue is designed for customers who need clarity, range, and fast enquiry support before placing retail or bulk orders."
      >
        <ProductVisual palette={["#2a9d8f", "#e76f51", "#14213d"]} />
      </PageHero>

      <section className="section">
        <div className="container">
          <Reveal className="section-heading">
            <p className="eyebrow">Who We Serve</p>
            <h2>Customers across textile and stitching businesses</h2>
          </Reveal>
          <div className="card-grid industry-grid">
            {industries.map((industry, index) => (
              <Reveal key={industry.name} className="industry-card" delay={(index % 4) * 60}>
                <IconBadge name={industry.icon} tone={index % 2 === 0 ? "gold" : "teal"} />
                <h3>{industry.name}</h3>
                <p>{industry.description}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tinted">
        <div className="container support-band">
          <Reveal>
            <p className="eyebrow">Bulk Enquiry</p>
            <h2>Need thread supply for repeated orders?</h2>
            <p>
              Share your requirement, preferred shade, thread type, and approximate quantity. The
              team can respond with catalogue options and availability.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <Link className="btn btn-primary" to="/enquiry">
              Send Enquiry
              <ArrowRight size={18} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
