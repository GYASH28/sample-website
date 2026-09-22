const FEATURED_ORDER = [
  "Desire",
  "Cotone",
  "Blankie Multi",
  "Superstitch",
  "Macrame Cord",
  "Glace Cotton Thread Art 545",
  "Baby Soft",
  "Anchor Embroidery Thread",
];

function uniqueProducts(products) {
  const seen = new Set();
  return products.filter((product) => {
    if (!product?.slug || seen.has(product.slug)) return false;
    seen.add(product.slug);
    return true;
  });
}

function pickByNames(products, names) {
  const byName = new Map(products.map((product) => [product.name, product]));
  return names.map((name) => byName.get(name)).filter(Boolean);
}

export function getFeaturedHomeProducts(products, limit = 8) {
  return uniqueProducts([
    ...pickByNames(products, FEATURED_ORDER),
    ...products,
  ]).slice(0, limit);
}

export function getBrandOptions(products) {
  const counts = new Map();
  products.forEach((product) => {
    const brand = product.brand?.trim();
    if (!brand) return;
    counts.set(brand, (counts.get(brand) || 0) + 1);
  });

  const preferred = ["Ganga", "Vardhaman", "Taj", "Anchor", "Ambica", "Dolly", "Bliss", "Fakhri Mart"];
  return [...counts.entries()]
    .sort(([a], [b]) => {
      const ai = preferred.indexOf(a);
      const bi = preferred.indexOf(b);
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      }
      return a.localeCompare(b);
    })
    .map(([name, count]) => ({ name, count }));
}
