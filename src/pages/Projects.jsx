import { ArrowRight, ChatCircleDots } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import ProductCard from "../components/ProductCard.jsx";
import MadeWithFakhri from "../components/MadeWithFakhri.jsx";
import { PROJECTS, productsForProject } from "../data/discoveryData.js";
import { featuredProducts } from "../data/siteData.js";
import { trackEngagement } from "../lib/engagementAnalytics.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

export default function Projects() {
  useDocumentMeta({
    title: "Shop by Project | Fakhri Mart",
    description: "Start with what you want to make—crochet bags, baby blankets, amigurumi, macrame décor, purse making and more—then shortlist suitable Fakhri Mart materials.",
    canonical: "/projects",
  });

  return (
    <>
      <PageHero
        motif="weave"
        eyebrow="Shop by project"
        title="Start with what you want to make"
        text="You should not need to know every yarn or cord name before you begin. Pick a project and see the materials that best match the existing catalogue information."
      />

      <section className="section project-browser">
        <div className="container">
          <div className="project-grid">
            {PROJECTS.map((project) => {
              const matches = productsForProject(featuredProducts, project.slug).slice(0, 4);
              return (
                <article key={project.slug} id={project.slug} className="project-card">
                  <div className="project-card__head">
                    <span className="project-card__number">{String(PROJECTS.indexOf(project) + 1).padStart(2, "0")}</span>
                    <div>
                      <h2>{project.name}</h2>
                      <p>{project.description}</p>
                    </div>
                  </div>

                  <div className="project-card__matches">
                    {matches.length ? matches.map(({ product }) => (
                      <Link
                        key={product.slug}
                        to={`/products/${product.slug}`}
                        className="project-material-chip"
                        onClick={() => trackEngagement("project_product_click", {
                          project: project.slug,
                          product: product.slug,
                          source: "projects-page",
                        })}
                      >
                        <img src={product.image} alt="" width="52" height="52" loading="lazy" decoding="async" />
                        <span>{product.name}</span>
                      </Link>
                    )) : <p>No matching catalogue products yet.</p>}
                  </div>

                  <Link
                    className="btn btn-outline"
                    to={`/products?project=${encodeURIComponent(project.slug)}`}
                    onClick={() => trackEngagement("project_selected", { project: project.slug, source: "projects-page" })}
                  >
                    Explore all matches <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-tinted project-helper-strip">
        <div className="container project-helper-strip__inner">
          <div>
            <p className="eyebrow">Not sure what to choose?</p>
            <h2>Use the guided material finder</h2>
            <p>Answer a few practical questions about the project and finish you want. The guide recommends catalogue options without pretending to know current stock or price.</p>
          </div>
          <Link className="btn btn-primary" to="/yarn-guide">
            <ChatCircleDots size={17} aria-hidden="true" /> Open material finder
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <MadeWithFakhri />
        </div>
      </section>
    </>
  );
}
