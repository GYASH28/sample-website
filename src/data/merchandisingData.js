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

function withLimit(products, limit = 8) {
  return uniqueProducts(products).slice(0, limit);
}

export function getBrandOptions(products) {
  const counts = new Map();
  products.forEach((product) => {
    const brand = product.brand?.trim();
    if (!brand) return;
    counts.set(brand, (counts.get(brand) || 0) + 1);
  });

  const preferred = ["Ganga", "Vardhaman", "Taj", "Anchor", "Ambika", "Dolly", "Fakhri Mart"];
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

export function buildHomeMerchandisingShelves(products) {
  const featured = withLimit([
    ...pickByNames(products, FEATURED_ORDER),
    ...products,
  ], 8);

  const ganga = withLimit(products.filter((product) => product.brand === "Ganga"), 9);

  const softAndTexture = withLimit(products.filter((product) =>
    /blankie|plush|faux fur|velvet|baby soft|souffle|caramel/i.test(product.name),
  ), 8);

  const cottonAndSummer = withLimit(products.filter((product) =>
    /cotton|cotone|summer/i.test([product.name, product.variants, product.category].filter(Boolean).join(" ")),
  ), 8);

  const threads = withLimit(products.filter((product) => product.masterCategory === "Threads"), 8);
  const macrame = withLimit(products.filter((product) => product.masterCategory === "Macrame & Cords"), 8);
  const taj = withLimit(products.filter((product) => product.brand === "Taj"), 8);
  const vardhaman = withLimit(products.filter((product) => product.brand === "Vardhaman"), 8);

  return [
    {
      id: "catalogue-highlights",
      eyebrow: "Start with the catalogue",
      title: "Real materials, ready to shortlist",
      text: "Browse verified lines immediately, open Quick View for details, and add what you need to one organised enquiry.",
      href: "/products",
      products: featured,
      priority: true,
    },
    {
      id: "ganga-yarns",
      eyebrow: "Ganga yarns",
      title: "Explore the Ganga range",
      text: "Move through the current Ganga yarn families in one shelf, then confirm live shades, packaging and availability on enquiry.",
      href: "/products?brand=Ganga",
      products: ganga,
      priority: true,
    },
    {
      id: "soft-textured-yarns",
      eyebrow: "Soft & textured",
      title: "Blanket, plush, velvet and soft-touch yarns",
      text: "A quicker way to compare cosy and texture-led yarn families without searching product names one by one.",
      href: "/products?q=soft",
      products: softAndTexture,
      priority: true,
    },
    {
      id: "cotton-summer",
      eyebrow: "Cotton & lighter makes",
      title: "Cotton-led and warm-weather materials",
      text: "Shortlist cotton and summer-oriented lines for crochet, knitting and handmade projects.",
      href: "/products?material=Cotton",
      products: cottonAndSummer,
    },
    {
      id: "threads",
      eyebrow: "Threads",
      title: "Crochet, embroidery and decorative threads",
      text: "Compare the verified thread families, then ask for the current supplier shade card before finalising colour.",
      href: "/products?department=Threads",
      products: threads,
    },
    {
      id: "macrame-dori",
      eyebrow: "Macrame & dori",
      title: "Cord and dori for bags, décor and knotting",
      text: "Browse the listed Malai Dori sizes and Macrame Cord together, then confirm construction and current shade availability.",
      href: "/products?department=Macrame%20%26%20Cords",
      products: macrame,
    },
    {
      id: "taj-yarns",
      eyebrow: "Taj",
      title: "Explore Taj yarn lines",
      text: "Faux Fur, Kiddos, Metallic T-Shirt Yarn, Caramel and Velvet Taj in one brand shelf.",
      href: "/products?brand=Taj",
      products: taj,
    },
    {
      id: "vardhaman-yarns",
      eyebrow: "Vardhaman",
      title: "Vardhaman yarns",
      text: "Compare the verified Vardhaman lines currently represented in the catalogue.",
      href: "/products?brand=Vardhaman",
      products: vardhaman,
    },
  ].filter((shelf) => shelf.products.length);
}
