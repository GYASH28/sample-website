// src/pages/BlogPost.jsx
// Phase 6 — single blog post page.

import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { useJsonLd } from "../hooks/useJsonLd.js";
import { blogPosts, businessInfo } from "../data/siteData.js";

export default function BlogPost() {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  useDocumentMeta({
    title: post ? `${post.title} | Fakhri Mart` : "Post not found",
    description: post ? post.excerpt : "",
  });

  // Phase 5 — Article JSON-LD
  useJsonLd(
    post
      ? {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.excerpt,
          datePublished: post.date,
          author: { "@type": "Organization", name: businessInfo.name },
          publisher: { "@type": "Organization", name: businessInfo.name },
          mainEntityOfPage: `${businessInfo.url}/blog/${post.slug}`,
        }
      : null
  );

  if (!post) {
    return (
      <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
        <h1>Post not found</h1>
        <Link to="/blog">← Back to guides</Link>
      </div>
    );
  }

  const paragraphs = post.body.split(/\n\n+/);

  return (
    <>
      <section className="section">
        <div className="container" style={{ maxWidth: 720, margin: "0 auto" }}>
          <Reveal variant="fade-up">
            <Link
              to="/blog"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.82rem",
                color: "var(--muted, #6B5749)",
                marginBottom: "16px",
                textDecoration: "none",
              }}
            >
              <ArrowLeft size={14} /> All guides
            </Link>
            <div
              style={{
                fontSize: "0.78rem",
                color: "var(--gold-deep, #8E6824)",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {post.readMinutes} min read ·{" "}
              {new Date(post.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
            <h1 style={{ marginBottom: "16px" }}>{post.title}</h1>
          </Reveal>
          <Reveal variant="fade-up">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                style={{ marginBottom: "16px", color: "var(--text, #3A2B24)", lineHeight: 1.75 }}
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>
    </>
  );
}
