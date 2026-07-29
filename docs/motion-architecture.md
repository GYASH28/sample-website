# Fakhri Mart motion architecture

## Baseline and root causes

The production build was profiled on 2026-07-29 with a repeatable Playwright
scroll probe. Each route was loaded with the intro already played, then scrolled
from top to bottom over 2.2 seconds while `requestAnimationFrame`, Long Tasks,
LCP, CLS, overflow, broken images, and console errors were recorded.

| Viewport | Route | Frame p95 | Maximum gap | Frames over 33 ms | LCP | CLS |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 390 × 844 | `/` | 16.8 ms | 50.0 ms | 1 | 1,796 ms | 0 |
| 390 × 844 | `/products` | 16.8 ms | 66.7 ms | 4 | 2,720 ms | 0 |
| 390 × 844 | `/products/makhhi-thread` | 16.8 ms | 33.4 ms | 3 | 1,704 ms | 0 |
| 390 × 844 | `/enquiry` | 16.7 ms | 16.8 ms | 0 | 2,296 ms | 0 |
| 390 × 844 | `/gallery` | 16.7 ms | 16.8 ms | 0 | 1,748 ms | 0 |
| 1440 × 960 | `/` | 66.6 ms | 66.8 ms | 16 | 2,096 ms | 0 |
| 1440 × 960 | `/products` | 50.0 ms | 83.5 ms | 8 | 2,964 ms | 0 |
| 1440 × 960 | `/products/makhhi-thread` | 50.0 ms | 133.3 ms | 7 | 2,640 ms | 0 |
| 1440 × 960 | `/enquiry` | 16.8 ms | 83.3 ms | 4 | 3,120 ms | 0 |
| 1440 × 960 | `/gallery` | 49.9 ms | 50.1 ms | 11 | 2,864 ms | 0 |

The audit found these implementation causes:

1. `styles.css` and `atelier.css` contain 336 cross-file duplicate selectors.
   `.reveal` is defined in `styles.css:1687`, forced visible in
   `atelier.css:272`, and reintroduced with a third timing model in
   `atelier.css:3763`. The cascade therefore decides the animation instead of
   the component.
2. `motion-tokens.js` is not imported. Meanwhile `styles.css` and
   `atelier.css` each declare different duration and easing tokens, and both
   component modules hardcode additional curves.
3. The sticky header, catalogue controls, search backdrop, mobile enquiry bar,
   and enquiry tabs use persistent `backdrop-filter` on large surfaces
   (`atelier.css:364`, `828`, `1509`, `1812`, and `1819`). These layers repaint
   while long image-heavy pages scroll.
4. Every catalogue result is wrapped in an independent scale reveal while the
   card also translates, scales its image, animates a large shadow, and animates
   image filters (`Products.jsx:594`, `atelier.css:4114-4150`). Multiple motion
   systems compete on the same card and image.
5. The product-detail gallery swaps immediately and carries inline transition
   styles, while its large visual column is sticky. Mobile also combines the
   sticky enquiry bar, reveal rules, gallery updates, and blurred surfaces.
6. Route motion is one generic fade-and-rise on every page. Drawer and search
   backdrops mount or unmount abruptly, so their lifecycle differs from the
   panel lifecycle.

The baseline report is generated at `output/motion-audit-baseline.json`.

## Ownership model

- `src/motion.css` is the canonical owner of motion tokens, progressive motion
  profiles, route transitions, shared reveal motifs, FLIP result motion, and
  shared overlay/card interaction timing.
- `styles.css` remains the legacy layout and compatibility layer. It must not
  define `.route-stage` or `.reveal` motion.
- `atelier.css` owns the current global brand layout and surfaces. It must not
  redefine shared reveal or route choreography.
- CSS modules own choreography that is unique to a component. The intro and
  home hero use the global tokens but keep their timelines in their modules.
- JavaScript is used only for lifecycle, focus, one-shot observation, FLIP
  measurement, and fine-pointer intent. Continuous visual motion stays in CSS,
  SVG, or the Web Animations API.

## Motion vocabulary

- **Thread handoff:** a non-blocking strand sweeps across route changes and is
  replaced on every location key, so rapid navigation cannot leave stale state.
- **Editorial rise:** copy and ordinary content enter with short opacity and
  vertical transform.
- **Lateral weave:** page-hero copy and selected supporting panels enter from
  opposite horizontal directions.
- **Image shutter:** isolated media reveals once through a short inset mask.
- **Line draw:** small dividers and SVG thread paths draw once.
- **Measured reorder:** catalogue result changes use a measure-once FLIP
  transform. Long product grids remain visible instead of cascading for
  several seconds.

## Cinematic opening: “The maker’s cut”

1. **Tension:** an ivory strand pulls taut across a deep-plum editorial field
   and opens a narrow first cut.
2. **Material:** three woven apertures reveal macro crops of the existing
   atelier, shade-library, and crochet-worktable photography. Their different
   scales create camera rhythm without video or continuous parallax.
3. **Identity:** the strand loops around the real Fakhri Mart seal while the
   name and the line “From one thread, a world of making” assemble in measured
   typographic cuts.
4. **Handoff:** the atelier crop resolves to the same aspect, image, and frame
   geometry as the home hero. The overlay becomes transparent while the paused
   hero choreography resumes underneath.

The lifecycle uses named phases and retains session-only playback, `?intro=1`,
Skip, Escape, focus containment, return focus, reduced motion, and a safety
completion timer.

## Progressive profiles

- `reduced`: skip the cinematic overlay and show all content in its stable state.
- `compact`: use shorter distances and no pointer parallax on coarse pointers or
  narrow screens.
- `lite`: selected for save-data or constrained hardware; disables masks,
  fixed grain, and nonessential route flourishes while keeping state feedback.
- `full`: enables the complete one-shot choreography on capable fine-pointer
  devices.

## Final verification

The same bounded probe was rerun against the final production build, one job at
a time to avoid test-runner contention.

| Measure across 10 route/viewport runs | Baseline | Final |
| --- | ---: | ---: |
| Average LCP | 2,395 ms | 1,363 ms |
| Worst animation frame gap | 133.3 ms | 33.4 ms |
| Frames over 33 ms | 54 | 10 |
| Frames over 50 ms | 23 | 0 |
| Worst long task | 50 ms | 0 ms |
| Maximum CLS | 0 | 0 |

Every final sample reported no horizontal overflow, broken images, or console
errors. The production build prerendered all 25 routes. The focused motion
lifecycle suite passed six end-to-end scenarios, and the WCAG 2 A/AA and 2.1
A/AA Axe audit passed 14 routes at both desktop and mobile sizes.
