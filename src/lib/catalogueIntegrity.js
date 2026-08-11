import { businessInfo, featuredProducts } from "../data/siteData.js";
import { verifiedBusiness } from "../data/verifiedBusiness.js";

export function applyCatalogueIntegrity() {
  Object.assign(businessInfo, verifiedBusiness);

  // Catalogue content is enquiry-led. These fields were placeholders and can
  // imply live commercial facts that the website does not verify in real time.
  // Keep all visible availability/pricing language confirmation-based instead.
  for (const product of featuredProducts) {
    delete product.rating;
    delete product.reviewCount;
    delete product.stock;
  }
}
