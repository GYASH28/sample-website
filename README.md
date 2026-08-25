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
- Projects, testimonials, FAQs, and business information
- Search-engine metadata and generated sitemap
- Prerender-capable production output
- Reduced-motion and viewport integrity testing

## Technology Stack

| Area | Technology |
|---|---|
| Frontend | React 19, React Router 8 |
| Build tool | Vite 6 |
| Language | JavaScript |
| Icons | Phosphor Icons |
| Typography | Archivo Variable, Manrope Variable |
| Testing | Playwright, axe-core, jsdom |
| Image processing | Sharp |
| Deployment output | Vite static bundle with optional prerendered public routes |

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

Create the normal Vite production bundle with:

```bash
npm run build
```

That command:

1. Generates the sitemap
2. Creates the Vite production bundle

For a fully prerendered validation/deployment build, use:

```bash
npm run build:prerender
```

That command generates the sitemap, creates the Vite bundle, and prerenders the public routes. The production quality workflows use this stricter build so route-level SEO and rendering failures are caught before merge.

Preview either build with:

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
- Project and showcase content
- Testimonials
- Calls to action

SEO title and meta-description content can be updated in:

```text
index.html
```

## Quality Workflows

```bash
npm run test:deps        # High/critical dependency vulnerability gate
npm run test:smoke       # Core journey smoke test
npm run test:a11y        # Accessibility audit
npm run test:motion      # Motion lifecycle and route-transition checks
npm run test:cinematic   # Opening, hero and scroll regression test
npm run test:faq         # FAQ interaction checks
npm run test:viewports   # Responsive/mobile viewport integrity
npm run test:discovery   # Product discovery and conversion regression
npm run test:seo         # SEO, structured data, sitemap and business identity
npm run test:performance # Bundle and scroll performance budgets
npm run test:theme       # Light/dark visual regression
npm run audit:intro      # Opening-sequence performance diagnostics
npm run audit:motion     # Route scroll/motion performance diagnostics
```

The main production workflow runs the complete quality gate against a persistent preview server and uploads performance/visual diagnostics for inspection.

## Commerce Model

This project intentionally does not include a cart, payment gateway, login, or fixed public prices.

Yarn pricing can depend on quantity, shade, material, size, and current availability. The website therefore works as a high-quality catalogue and enquiry system rather than pretending that every order fits a standard e-commerce checkout.

## Security and Privacy

- Never commit private customer information or credentials
- Keep production contact values in the approved business data file
- Review third-party links before deployment
- Run the production quality gate after major visual or interaction changes

## License

This project was created as a client-focused commercial website. The design, branding, content, and business assets should not be reused without permission.
