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
        title="Product Gallery & Shade Collection"
        text="Explore a premium visual catalogue style for thread cones, color shelves, packaging, bulk stock, and embroidery shade selections."
      >
        <ProductVisual palette={["#8338ec", "#ffbe0b", "#3a86ff"]} />
      </PageHero>

      <section className="section">
        <div className="container">
          <Reveal className="section-heading" variant="scale-in">
            <p className="eyebrow">Shade Gallery</p>
            <h2>Product Gallery & Shade Collection</h2>
            <p>Organized visuals for thread stock, shade variety, packing, and wholesale supply.</p>
          </Reveal>
          <div className="gallery-grid">
            {galleryItems.map((item, index) => (
              <Reveal key={item.title} className="gallery-card" delay={(index % 3) * 75} variant="scale-in">
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
