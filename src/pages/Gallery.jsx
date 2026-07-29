import { Link } from "react-router-dom";
import CatalogueCta from "../components/CatalogueCta.jsx";
import PageHero from "../components/PageHero.jsx";
import useDocumentMeta from "../hooks/useDocumentMeta.js";

const gallery = [
  {
    src: "/assets/images/editorial/crochet-bag-worktable.webp",
    alt: "A floral crochet bag in progress with yarn, hook, beads and wooden handle",
    title: "From yarn to a finished bag",
    note: "Crochet · Bag making",
    className: "gallery-feature",
  },
  {
    src: "/assets/images/cat_ganga.webp",
    alt: "Colourful yarn balls arranged in a craft shop",
    title: "Colour-rich yarn ranges",
    note: "Crochet · Knitting",
  },
  {
    src: "/assets/images/cat_macrame.webp",
    alt: "Natural cotton macrame cord in several twists and colours",
    title: "Cord, knots and structure",
    note: "Macrame",
  },
  {
    src: "/assets/images/cat_embroidery.webp",
    alt: "Organised embroidery thread skeins in vivid colours",
    title: "Lacchi and embroidery colour",
    note: "Embroidery",
  },
  {
    src: "/assets/images/cat_purse_acc.webp",
    alt: "Purse locks, rings and decorative metal hardware on a worktable",
    title: "Hardware that finishes the piece",
    note: "Bag making",
  },
  {
    src: "/assets/images/editorial/craft-stock-room.webp",
    alt: "Organised craft stock room with yarn, cord, embroidery thread, beads and hardware",
    title: "Materials ready for retail and wholesale",
    note: "In-store stock",
    className: "gallery-wide",
  },
];

export default function Gallery() {
  useDocumentMeta({
    title: "Craft Material Gallery | Fakhri Mart",
    description: "Yarn, crochet, macrame, embroidery and bag-making material inspiration from Fakhri Mart.",
    canonical: "/gallery",
  });

  return (
    <>
      <PageHero
        eyebrow="Made with the materials"
        title="Colour, fibre and the work in between"
        text="A closer look at the yarns, cords, threads, tools and bag-making details that move through our catalogue."
      />

      <section className="section gallery-page-section">
        <div className="container">
          <div className="gallery-editorial-grid">
            {gallery.map((item) => (
              <figure key={item.title} className={item.className || ""}>
                <img src={item.src} alt={item.alt} loading="lazy" width="900" height="720" />
                <figcaption>
                  <span>{item.note}</span>
                  <h2>{item.title}</h2>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="gallery-disclaimer">
            Editorial images show material families and project inspiration. For exact packaging and current shades,
            <Link to="/contact"> request live photos</Link>.
          </p>
        </div>
      </section>

      <div className="container"><CatalogueCta /></div>
    </>
  );
}
