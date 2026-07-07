// src/pages/Blog.jsx
// Phase 6 — Blog index. 3 evergreen guides (data-driven from siteData.blogPosts).

import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import PageHero from "../components/PageHero.jsx";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { blogPosts } from "../data/siteData.js";

export default function Blog() {
  useDocumentMeta({
    title: "Guides & Reads | Fakhri Mart",
    description: "Short, practical notes for makers — yarn weights, macrame basics, crochet vs knitting and more.",
  });

  return (
    <>
      <PageHero
        eyebrow="Guides"
        title="Guides & Reads"
        text="Short, practical notes for makers of all levels."
      />

      <section className="section">
        <div className="container">
          <div className="card-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
            {blogPosts.map((post, index) => (
              <Reveal key={post.slug} delay={(index % 3) * 80} variant="fade-up">
                <Link
                  to={`/blog/${post.slug}`}
                  style={{
                    display: "block",
                    height: "100%",
                    padding: "20px",
                    background: "#fff",
                    border: "1px solid rgba(0,0,0,0.05)",
                    borderRadius: "12px",
                    color: "inherit",
                    textDecoration: "none",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  className="blog-card"
                >
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--gold-deep, #8E6824)",
                      letterSpacing: "0.16em",
                      textTransform: "uppercase",
                    }}
                  >
                    {post.readMinutes} min read ·{" "}
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <h3 style={{ marginTop: "8px", marginBottom: "8px" }}>{post.title}</h3>
                  <p style={{ color: "var(--muted, #6B5749)", fontSize: "0.9rem", marginBottom: 0 }}>
                    {post.excerpt}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
