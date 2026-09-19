import CommerceHero from "../components/home/CommerceHero.jsx";
import MakerHelpStrip from "../components/home/MakerHelpStrip.jsx";
import GuideHelpSection from "../components/home/GuideHelpSection.jsx";
import DeferredSection from "../components/DeferredSection.jsx";
import {
  CommerceBenefits,
  CommerceBrandNav,
  CommerceCategoryGrid,
  CommerceCategoryNav,
  CommerceCraftFinder,
  CommerceOrderFlow,
  CommerceProductRail,
  CommerceWholesaleCta,
} from "../components/home/CommerceHomeSections.jsx";
import { RecentlyViewedHome, ShadeDiscovery } from "../components/home/StorefrontDiscovery.jsx";
import {
  businessInfo,
  featuredProducts,
  productCategories,
} from "../data/siteData.js";
import {
  buildHomeMerchandisingShelves,
  getBrandOptions,
} from "../data/merchandisingData.js";
import useDocumentMeta from "../hooks/useDocumentMeta.js";
import {
  localBusinessJsonLd,
  useJsonLd,
  websiteJsonLd,
} from "../hooks/useJsonLd.js";

export default function Home() {
  useDocumentMeta({
    title: "Fakhri Mart | Shop Yarn, Threads & Craft Materials",
    description:
      "Browse verified yarn collections, crochet and decorative threads, embroidery threads, macrame cord and Malai Dori. Build a retail or wholesale WhatsApp enquiry for current shades and pricing.",
  });
  useJsonLd(localBusinessJsonLd(businessInfo));
  useJsonLd(websiteJsonLd());

  const shelves = buildHomeMerchandisingShelves(featuredProducts);
  const priorityShelves = shelves.filter((shelf) => shelf.priority);
  const remainingShelves = shelves.filter((shelf) => !shelf.priority);
  const brands = getBrandOptions(featuredProducts);

  return (
    <div className="fm-home commerce-home product-first-home">
      <CommerceHero />
      <CommerceCategoryNav categories={productCategories} />
      <CommerceBrandNav brands={brands} />

      <section className="home-product-first-stack" aria-label="Featured catalogue collections">
        {priorityShelves.map((shelf) => (
          <CommerceProductRail
            key={shelf.id}
            eyebrow={shelf.eyebrow}
            title={shelf.title}
            text={shelf.text}
            products={shelf.products}
            href={shelf.href}
            priority
          />
        ))}
      </section>

      <MakerHelpStrip />

      <DeferredSection label="More product collections" minHeight={1450}>
        <div className="home-product-first-stack home-product-first-stack--secondary">
          {remainingShelves.map((shelf) => (
            <CommerceProductRail
              key={shelf.id}
              eyebrow={shelf.eyebrow}
              title={shelf.title}
              text={shelf.text}
              products={shelf.products}
              href={shelf.href}
            />
          ))}
        </div>
      </DeferredSection>

      <DeferredSection label="Project finder" minHeight={720}>
        <CommerceCraftFinder products={featuredProducts} />
        <CommerceCategoryGrid categories={productCategories} />
      </DeferredSection>

      <GuideHelpSection />

      <DeferredSection label="Shade-card support" minHeight={520}>
        <ShadeDiscovery />
        <RecentlyViewedHome />
      </DeferredSection>

      <DeferredSection label="Ordering information" minHeight={620}>
        <CommerceBenefits />
        <CommerceOrderFlow />
        <CommerceWholesaleCta />
      </DeferredSection>
    </div>
  );
}
