import CatalogueCta from "../components/CatalogueCta.jsx";
import GalleryVisual from "../components/GalleryVisual.jsx";
import PageHero from "../components/PageHero.jsx";
import ProductVisual from "../components/ProductVisual.jsx";
import Reveal from "../components/Reveal.jsx";
import { galleryItems } from "../data/siteData.js";

export default function Gallery() {
  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Yarns, Threads, Accessories & Purse Materials"
        text="A polished product-range gallery for yarn collection, crochet threads, macrame cords, embroidery threads, accessories, beads, purse materials and organized stock."
      >
        <ProductVisual palette={["#e86f9e", "#35b8ad", "#f4cf6a"]} />
      </PageHero>

      <section className="section">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Product Gallery</p>
            <h2>Explore the Fakhri Mart material range.</h2>
            <p>Organized views for product range, shade discovery, bulk stock and catalogue enquiries.</p>
          </Reveal>
          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <Reveal key={item.title} className="gallery-card" delay={(index % 4) * 60} variant="scale-in">
                <GalleryVisual item={item} />
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <div className="container">
        <CatalogueCta />
      </div>
    </>
  );
}
