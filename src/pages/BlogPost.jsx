import { ArrowLeft, ShareNetwork } from "@phosphor-icons/react";
import { Link, useParams } from "react-router-dom";
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

  return (
    <article className="article-page">
      <header className="article-header">
        <div className="container article-header-grid">
          <div>
            <Link className="text-link" to="/blog"><ArrowLeft size={17} /> All guides</Link>
            <p className="eyebrow">{post.category || "Craft guide"} · {post.readMinutes} min read</p>
            <h1>{post.title}</h1>
            <p className="large-copy">{post.excerpt}</p>
            <button
              type="button"
              className="btn btn-outline btn-small"
              onClick={() => navigator.share?.({ title: post.title, url: window.location.href })
                ?? navigator.clipboard.writeText(window.location.href)}
            >
              <ShareNetwork size={17} /> Share guide
            </button>
          </div>
          <img
            src={guideImages[postIndex % guideImages.length]}
            alt=""
            width="900"
            height="620"
          />
        </div>
      </header>

      <div className="container article-layout">
        <div className="article-body">
          {post.body.split(/\n\n+/).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <aside>
          <span className="eyebrow">Keep reading</span>
          {related.map((item) => (
            <Link key={item.slug} to={`/blog/${item.slug}`}>
              <strong>{item.title}</strong>
              <small>{item.readMinutes} min read</small>
            </Link>
          ))}
        </aside>
      </div>
    </article>
  );
}
