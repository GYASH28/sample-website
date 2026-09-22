const { chromium } = require("playwright");

const BASE_URL = process.env.PRODUCT_MEDIA_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function openPage(context, route) {
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForFunction(() => document.readyState === "complete" && document.querySelector("#main-content"));
  await page.evaluate(() => document.fonts.ready);
  return { page, errors };
}

async function auditRoute(context, route) {
  const { page, errors } = await openPage(context, route);
  try {
    const cards = page.locator(".product-card");
    const count = Math.min(await cards.count(), 4);
    assert(count > 0, `${route}: no product cards rendered`);

    for (let index = 0; index < count; index += 1) {
      const card = cards.nth(index);
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(180);
    }

    await page.waitForFunction(() => {
      const images = [...document.querySelectorAll(".product-card .product-image-wrapper img")].slice(0, 4);
      return images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0);
    }, null, { timeout: 10_000 });

    const audit = await page.evaluate((limit) => {
      const parseAlpha = (value) => {
        const match = String(value).match(/rgba?\([^)]*?(?:[,/ ]([\d.]+))?\)$/i);
        if (!match) return 1;
        const alpha = Number(match[1]);
        return Number.isFinite(alpha) ? alpha : 1;
      };

      const pseudoState = (node, pseudo) => {
        if (!node) return null;
        const style = getComputedStyle(node, pseudo);
        const content = style.content;
        const hasContent = content && content !== "none" && content !== "normal" && content !== '""';
        const painted = style.backgroundImage !== "none" ||
          (style.backgroundColor !== "transparent" && parseAlpha(style.backgroundColor) > 0.03) ||
          (style.backdropFilter && style.backdropFilter !== "none") ||
          (style.webkitBackdropFilter && style.webkitBackdropFilter !== "none") ||
          (style.filter && style.filter !== "none");
        return {
          display: style.display,
          content,
          background: style.backgroundColor,
          backgroundImage: style.backgroundImage,
          backdropFilter: style.backdropFilter || style.webkitBackdropFilter || "none",
          filter: style.filter,
          blocksMedia: style.display !== "none" && hasContent && painted,
        };
      };

      return [...document.querySelectorAll(".product-card")].slice(0, limit).map((card, index) => {
        const wrapper = card.querySelector(".product-image-wrapper");
        const link = card.querySelector(".product-card-image-link");
        const shell = card.querySelector(".native-product-image-shell");
        const image = wrapper?.querySelector("img");
        const showcase = card.closest(".product-showcase-card");
        const quick = showcase?.querySelector(".product-card-quick-view") || null;
        const wrapperRect = wrapper?.getBoundingClientRect();
        const imageRect = image?.getBoundingClientRect();
        const quickRect = quick?.getBoundingClientRect();
        const imageStyle = image ? getComputedStyle(image) : null;
        const shellStyle = shell ? getComputedStyle(shell) : null;
        const centerHit = wrapperRect
          ? document.elementFromPoint(wrapperRect.left + wrapperRect.width / 2, wrapperRect.top + wrapperRect.height / 2)
          : null;

        const obstructionCandidates = wrapperRect
          ? [...card.querySelectorAll("*")].flatMap((element) => {
              if (!(element instanceof HTMLElement) && !(element instanceof SVGElement)) return [];
              if (element === wrapper || element === link || element === shell || element === image) return [];
              if (element.classList?.contains("product-card-badge-floating")) return [];
              const rect = element.getBoundingClientRect();
              const left = Math.max(rect.left, wrapperRect.left);
              const right = Math.min(rect.right, wrapperRect.right);
              const top = Math.max(rect.top, wrapperRect.top);
              const bottom = Math.min(rect.bottom, wrapperRect.bottom);
              const intersection = Math.max(0, right - left) * Math.max(0, bottom - top);
              const mediaArea = wrapperRect.width * wrapperRect.height;
              if (!mediaArea || intersection / mediaArea < 0.18) return [];
              const style = getComputedStyle(element);
              const bg = style.backgroundColor;
              const bgImage = style.backgroundImage;
              const shadow = style.boxShadow;
              const painted = (bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent") ||
                (bgImage && bgImage !== "none") ||
                (shadow && shadow !== "none");
              if (!painted || style.display === "none" || style.visibility === "hidden" || Number(style.opacity || 1) < 0.05) return [];
              return [{
                tag: element.tagName,
                className: String(element.className?.baseVal || element.className || ""),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                overlapRatio: Number((intersection / mediaArea).toFixed(3)),
                background: bg,
                backgroundImage: bgImage,
                boxShadow: shadow,
              }];
            })
          : [];

        const centerStack = wrapperRect
          ? document.elementsFromPoint(wrapperRect.left + wrapperRect.width / 2, wrapperRect.top + wrapperRect.height / 2)
              .filter((element) => card.contains(element))
              .slice(0, 8)
              .map((element) => ({
                tag: element.tagName,
                className: String(element.className?.baseVal || element.className || ""),
              }))
          : [];

        return {
          index,
          name: card.querySelector(".product-card-title")?.textContent?.trim() || `card-${index}`,
          wrapper: wrapperRect ? { width: wrapperRect.width, height: wrapperRect.height } : null,
          image: imageRect ? { width: imageRect.width, height: imageRect.height } : null,
          imageOpacity: imageStyle ? Number(imageStyle.opacity || 1) : 0,
          imageFilter: imageStyle?.filter || "none",
          imageBlend: imageStyle?.mixBlendMode || "normal",
          shellBackdrop: shellStyle?.backdropFilter || shellStyle?.webkitBackdropFilter || "none",
          centerHitClass: centerHit ? String(centerHit.className || centerHit.tagName) : "",
          centerStack,
          obstructionCandidates,
          quick: quickRect ? { width: quickRect.width, height: quickRect.height, insideActions: Boolean(quick?.closest(".product-card-floating-actions")) } : null,
          pseudo: {
            cardBefore: pseudoState(card, "::before"),
            cardAfter: pseudoState(card, "::after"),
            linkBefore: pseudoState(link, "::before"),
            linkAfter: pseudoState(link, "::after"),
            wrapperBefore: pseudoState(wrapper, "::before"),
            wrapperAfter: pseudoState(wrapper, "::after"),
            shellBefore: pseudoState(shell, "::before"),
            shellAfter: pseudoState(shell, "::after"),
          },
        };
      });
    }, count);

    const closedOverlayLeaks = await page.evaluate(() => {
      const selectors = [
        ".drawer-backdrop",
        ".search-dialog-backdrop",
        ".enquiry-drawer-backdrop",
        ".shopping-workspace-backdrop",
        ".catalogue-filter-backdrop",
        ".quick-view-backdrop",
      ];
      return selectors.flatMap((selector) => [...document.querySelectorAll(selector)])
        .filter((element) => !element.classList.contains("is-open"))
        .flatMap((element) => {
          const style = getComputedStyle(element);
          const opacity = Number(style.opacity || 0);
          if (opacity <= 0.01 && style.visibility === "hidden" && style.pointerEvents === "none") return [];
          return [{
            className: element.className,
            opacity,
            visibility: style.visibility,
            pointerEvents: style.pointerEvents,
            backdropFilter: style.backdropFilter || style.webkitBackdropFilter || "none",
          }];
        });
    });

    for (const item of audit) {
      assert(item.wrapper && item.image, `${route} ${item.name}: product media is missing`);
      assert(item.image.width >= item.wrapper.width * 0.96, `${route} ${item.name}: image does not fill wrapper width: ${JSON.stringify(item)}`);
      assert(item.image.height >= item.wrapper.height * 0.96, `${route} ${item.name}: image does not fill wrapper height: ${JSON.stringify(item)}`);
      assert(item.imageOpacity >= 0.98, `${route} ${item.name}: product image opacity is ${item.imageOpacity}`);
      assert(item.imageFilter === "none", `${route} ${item.name}: product image has visual filter ${item.imageFilter}`);
      assert(item.imageBlend === "normal", `${route} ${item.name}: product image blend mode is ${item.imageBlend}`);
      assert(item.shellBackdrop === "none", `${route} ${item.name}: native image shell has backdrop filter ${item.shellBackdrop}`);

      const blockingPseudo = Object.entries(item.pseudo).find(([, state]) => state?.blocksMedia);
      assert(!blockingPseudo, `${route} ${item.name}: painted pseudo-layer can obscure product media: ${JSON.stringify(blockingPseudo)}`);
      assert(item.obstructionCandidates.length === 0,
        `${route} ${item.name}: painted element covers a significant part of product media: ${JSON.stringify({ candidates: item.obstructionCandidates, centerStack: item.centerStack })}`);

      if (item.quick) {
        assert(item.quick.insideActions, `${route} ${item.name}: Quick View is not owned by the compact product action cluster`);
        assert(item.quick.width <= 64, `${route} ${item.name}: Quick View stretched to ${item.quick.width.toFixed(1)}px wide`);
        assert(item.quick.height <= 64, `${route} ${item.name}: Quick View stretched to ${item.quick.height.toFixed(1)}px tall`);
        assert(item.quick.width * item.quick.height < item.wrapper.width * item.wrapper.height * 0.25,
          `${route} ${item.name}: Quick View covers too much of the product photo: ${JSON.stringify(item)}`);
      }
    }

    assert(closedOverlayLeaks.length === 0,
      `${route}: closed UI backdrops are still painted over the page: ${JSON.stringify(closedOverlayLeaks)}`);

    assert(errors.length === 0, `${route}: browser errors detected: ${errors.join(" | ")}`);
    console.log(`✓ ${route}: ${audit.length} product cards keep photography unobstructed and Quick View compact`);
  } finally {
    await page.close();
  }
}

(async () => {
  const browser = await chromium.launch({ ...(executablePath ? { executablePath } : {}) });
  try {
    for (const viewport of [
      { name: "desktop", width: 1440, height: 960 },
      { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true },
    ]) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        isMobile: Boolean(viewport.isMobile),
        hasTouch: Boolean(viewport.hasTouch),
      });
      await context.addInitScript(() => {
        sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
        sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
        localStorage.setItem("fakhri_theme", "light");
      });

      for (const route of ["/", "/products"]) await auditRoute(context, route);
      await context.close();
      console.log(`✓ ${viewport.name}: product media integrity passed`);
    }
  } finally {
    await browser.close();
  }

  console.log("Product media obstruction regression passed.");
})().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
