import { ArrowLeft, ShareNetwork } from "@phosphor-icons/react";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import Reveal from "../components/Reveal.jsx";
import { blogPosts, businessInfo } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import { useJsonLd } from "../hooks/useJsonLd.js";

const guideImages = [
  "/assets/images/editorial/shade-library.webp",
  "/assets/images/cat_macrame.webp",
  "/assets/images/editorial/atelier-hero.webp",
];

export default function BlogPost() {
  const { slug } = useParams();
  const postIndex = blogPosts.findIndex((item) => item.slug === slug);
  const post = blogPosts[postIndex];
  const [shareStatus, setShareStatus] = useState("");

  useDocumentMeta({
    title: post ? `${post.title} | Fakhri Mart` : "Guide not found | Fakhri Mart",
    description: post?.excerpt || "Browse practical craft-material guides from Fakhri Mart.",
    canonical: post ? `/blog/${post.slug}` : "/blog",
  });

  useJsonLd(post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: new URL(guideImages[postIndex % guideImages.length], businessInfo.url).href,
    datePublished: post.date,
    author: { "@type": "Organization", name: businessInfo.name },
    publisher: { "@type": "Organization", name: businessInfo.name },
    mainEntityOfPage: `${businessInfo.url}/blog/${post.slug}`,
  } : null);

  if (!post) {
    return (
      <main className="empty-page-state">
        <h1>This guide could not be found.</h1>
        <Link className="btn btn-primary" to="/blog">Browse all guides</Link>
      </main>
    );
  }

  const related = blogPosts.filter((item) => item.slug !== post.slug).slice(0, 2);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: post.title, url: window.location.href });
        setShareStatus("Shared");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareStatus("Link copied");
      }
    } catch (error) {
      if (error?.name !== "AbortError") setShareStatus("Share unavailable");
    }
  };

  return (
    <article className="article-page">
      <header className="article-header">
        <div className="container article-header-grid">
          <Reveal className="article-heading-copy" variant="slide-left">
            <Link className="text-link" to="/blog"><ArrowLeft size={17} /> All guides</Link>
            <p className="eyebrow">{post.category || "Craft guide"} · {post.readMinutes} min read</p>
            <h1>{post.title}</h1>
            <p className="large-copy">{post.excerpt}</p>
            <button
              type="button"
              className="btn btn-outline btn-small"
              data-confirmed={shareStatus === "Shared" || shareStatus === "Link copied"}
              onClick={handleShare}
            >
              <ShareNetwork size={17} /> {shareStatus || "Share guide"}
            </button>
            <span className="sr-only" role="status" aria-live="polite">{shareStatus}</span>
          </Reveal>
          <Reveal className="article-hero-media" delay={90} variant="scale-in">
            <img
              src={guideImages[postIndex % guideImages.length]}
              alt=""
              width="900"
              height="620"
            />
          </Reveal>
        </div>
      </header>

      <div className="container article-layout">
        <Reveal className="article-body reading-surface" variant="fade-up">
          {post.body.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </Reveal>
        <Reveal as="aside" delay={80} variant="slide-right">
          <span className="eyebrow">Keep reading</span>
          {related.map((item) => (
            <Link key={item.slug} to={`/blog/${item.slug}`}>
              <strong>{item.title}</strong>
              <small>{item.readMinutes} min read</small>
            </Link>
          ))}
        </Reveal>
      </div>
    </article>
  );
}
