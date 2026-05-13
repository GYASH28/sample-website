# Shree Threads & Textile Supplies Demo Website

Premium multi-page React catalogue website for a thread-selling business. This is a frontend-only demo for client presentation.

## Run the project

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://127.0.0.1:5173/`.

## Where to edit business details

- Business name, tagline, phone, WhatsApp number, email, address, and hours: `src/data/siteData.js`
- Product categories: `productCategories` in `src/data/siteData.js`
- Featured/sample products and filter tags: `featuredProducts` in `src/data/siteData.js`
- Gallery placeholders: `galleryItems` in `src/data/siteData.js`
- SEO title and meta description: `index.html`

## Replacing placeholder visuals

The current website uses CSS-created thread cones, rolls, shelves, and catalogue placeholders so the demo does not depend on external images. When real product photos are available, replace the visual components or add image URLs in `src/data/siteData.js` and render them inside the product/gallery cards.

## Notes

- No backend is included.
- No payment gateway is included.
- No login or signup is included.
- Product prices are intentionally hidden because retail and wholesale rates can vary by quantity and shade.
