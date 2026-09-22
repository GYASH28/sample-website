const VERIFIED_PRODUCT_DIRECTORY = "/assets/images/products/verified-web/";
const CARD_PRODUCT_DIRECTORY = "/assets/images/products/card-web/";

export function getCardOptimizedImage(src) {
  if (typeof src !== "string" || !src.includes(VERIFIED_PRODUCT_DIRECTORY)) return src;
  return src.replace(VERIFIED_PRODUCT_DIRECTORY, CARD_PRODUCT_DIRECTORY);
}

export function getResponsiveProductImageProps(src, sizes) {
  const cardSource = getCardOptimizedImage(src);
  if (!src || cardSource === src) return { src, sizes };
  return {
    src: cardSource,
    srcSet: `${cardSource} 720w, ${src} 1254w`,
    sizes,
  };
}
