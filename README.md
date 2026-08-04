<div align="center">

# Fakhri Mart Catalogue Website

### A premium product-discovery and WhatsApp enquiry experience for a yarn and craft-material business

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Playwright](https://img.shields.io/badge/Playwright-Tested-2EAD33?style=for-the-badge&logo=playwright&logoColor=white)](https://playwright.dev)
[![Accessibility](https://img.shields.io/badge/Accessibility-Audited-0EA5E9?style=for-the-badge)](#quality-workflows)

</div>

## Overview

This repository contains a production-style catalogue website created for **Fakhri Mart**, a yarn store and craft-material supplier.

The experience is designed around how the business actually sells: customers explore categories and featured products, understand the store's range, and continue the conversation through WhatsApp for current pricing, shades, quantities, wholesale requirements, and availability.

## Business Goals

- Present the company as a modern and trustworthy supplier
- Make a large catalogue easier to explore on mobile and desktop
- Generate high-intent enquiries without forcing fixed online pricing
- Support retail and wholesale customer journeys
- Keep business content easy to update without rebuilding components
- Deliver a polished experience with SEO, motion, accessibility, and performance checks

## Experience Highlights

- Premium opening and visual storytelling
- Responsive catalogue navigation
- Category and product filtering
- Featured products and new-arrival sections
- WhatsApp-focused enquiry calls to action
- Gallery, testimonials, FAQs, and business information
- Search-engine metadata and generated sitemap
- Prerendered production output
- Reduced-motion and viewport integrity testing

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React 19, React Router 7 |
| Build tool | Vite 6 |
| Language | JavaScript |
| Icons | Phosphor Icons |
| Typography | Archivo Variable, Manrope Variable |
| Testing | Playwright, axe-core, jsdom |
| Image processing | Sharp |
| Deployment output | Prerendered static website |

## Quick Start

```bash
git clone https://github.com/GYASH28/sample-website.git
cd sample-website
npm install
npm run dev
```

The development server runs on the local URL shown in the terminal, usually:

```text
http://127.0.0.1:5173/
```

## Production Build

```bash
npm run build
```

The build workflow:

1. Generates the sitemap
2. Creates the Vite production bundle
3. Prerenders the website for deployment

Preview the result with:

```bash
npm run preview
```

## Content Management

Most business content is centralized in:

```text
src/data/siteData.js
```

Update this file to change:

- Business name and tagline
- Phone and WhatsApp details
- Email, address, Instagram, and opening hours
- Product categories
- Featured products and filter tags
- New arrivals
- Gallery cards
- Testimonials
- Calls to action

SEO title and meta-description content can be updated in:

```text
index.html
```

## Quality Workflows

```bash
npm run test:smoke       # Core journey smoke test
npm run test:a11y        # Accessibility audit
npm run test:motion      # Motion lifecycle checks
npm run test:cinematic   # Cinematic experience regression test
npm run test:faq         # FAQ interaction checks
npm run test:viewports   # Responsive viewport integrity
npm run audit:intro      # Intro performance audit
npm run audit:motion     # Motion implementation audit
```

## Commerce Model

This project intentionally does not include a cart, payment gateway, login, or fixed public prices.

Yarn pricing can depend on quantity, shade, material, size, and current availability. The website therefore works as a high-quality catalogue and enquiry system rather than pretending that every order fits a standard e-commerce checkout.

## Security and Privacy

- Never commit private customer information or credentials
- Keep production contact values in the approved business data file
- Review third-party links before deployment
- Run the accessibility and viewport checks after major visual changes

## License

This project was created as a client-focused commercial website. The design, branding, content, and business assets should not be reused without permission.
