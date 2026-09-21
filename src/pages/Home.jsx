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
import { ShadeDiscovery } from "../components/home/StorefrontDiscovery.jsx";
import {
  businessInfo,
  featuredProducts,
  productCategories,
} from "../data/siteData.js";
import {
  getBrandOptions,
  getFeaturedHomeProducts,
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

  const featured = getFeaturedHomeProducts(featuredProducts);
  const brands = getBrandOptions(featuredProducts);

  return (
    <div className="fm-home commerce-home product-first-home">
      <CommerceHero />

      <CommerceCategoryNav categories={productCategories} />
      <MakerHelpStrip />

      <CommerceProductRail
        eyebrow="Featured catalogue"
        title="A useful starting point, not the whole warehouse."
        text="Eight representative material lines across yarn, thread, embroidery and macrame. Use Quick View to compare, then move into the full catalogue when you want depth."
        products={featured}
        href="/products"
        priority
      />

      <DeferredSection label="Browse by material and brand" minHeight={840}>
        <CommerceCategoryGrid categories={productCategories} />
        <CommerceBrandNav brands={brands} />
      </DeferredSection>

      <DeferredSection label="Project finder" minHeight={620}>
        <CommerceCraftFinder products={featuredProducts} />
      </DeferredSection>

      <GuideHelpSection />

      <DeferredSection label="Shade-card support" minHeight={360}>
        <ShadeDiscovery />
      </DeferredSection>

      <DeferredSection label="Ordering information" minHeight={620}>
        <CommerceBenefits />
        <CommerceOrderFlow />
        <CommerceWholesaleCta />
      </DeferredSection>
    </div>
  );
}
