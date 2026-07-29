import { ArrowRight } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero.jsx";
import { blogPosts } from "../data/siteData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const guideImages = [
  "/assets/images/editorial/shade-library.webp",
  "/assets/images/cat_macrame.webp",
  "/assets/images/editorial/atelier-hero.webp",
];

export default function Blog() {
  useDocumentMeta({
    title: "Craft Guides | Fakhri Mart",
    description: "Practical guides to yarn, macrame, crochet and choosing craft materials.",
    canonical: "/blog",
  });

  return (
    <>
      <PageHero
        motif="editorial"
        eyebrow="Material notes"
        title="Useful answers before you choose a yarn"
        text="Short, practical guides on fibre, weight, cord, colour and the tools that make a project easier."
      />

      <section className="section">
        <div className="container blog-editorial-list">
          {blogPosts.map((post, index) => (
            <article key={post.slug} className={index === 0 ? "blog-featured" : ""}>
              <Link
                to={`/blog/${post.slug}`}
                className="blog-image-link"
                aria-label={`Read ${post.title}`}
              >
                <img
                  src={guideImages[index % guideImages.length]}
                  alt=""
                  width="900"
                  height="620"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </Link>
              <div>
                <span className="eyebrow">{post.category || "Craft guide"} · {post.readMinutes} min read</span>
                <h2><Link to={`/blog/${post.slug}`}>{post.title}</Link></h2>
                <p>{post.excerpt}</p>
                <Link className="text-link" to={`/blog/${post.slug}`}>
                  Read the guide <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
