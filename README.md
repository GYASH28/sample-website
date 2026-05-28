# Fakhri Mart Catalogue Website

Premium React catalogue and WhatsApp enquiry website for Fakhri Mart, a yarn store and craft material supplier.

## Run the project

```bash
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://127.0.0.1:5173/`.

## Where to edit business details

- Business name, tagline, phone, WhatsApp number, email, address, Instagram, and hours: `src/data/siteData.js`
- Product categories: `productCategories` in `src/data/siteData.js`
- Featured products and filter tags: `featuredProducts` in `src/data/siteData.js`
- New arrivals, gallery cards, testimonials, and CTA copy: `src/data/siteData.js`
- SEO title and meta description: `index.html`

## Notes

- No backend is included.
- No cart, payment gateway, login, or signup is included.
- Product prices are intentionally hidden because retail and wholesale rates vary by quantity, shade, size, and availability.
