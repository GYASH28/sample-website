const { chromium } = require("playwright");

const baseUrl = process.env.FAQ_BASE_URL || "http://127.0.0.1:4173";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;

function check(condition, message) {
  if (!condition) throw new Error(message);
}

function faqGroupSelector(productSlug) {
  return `[data-product-faq][data-product-slug="${productSlug}"]`;
}

async function waitForProductFaq(page, productSlug) {
  const selector = faqGroupSelector(productSlug);
  await page.locator(selector).waitFor({ state: "visible", timeout: 5_000 });
  await page.waitForFunction(
    ({ groupSelector }) => {
      const group = document.querySelector(groupSelector);
      if (!group) return false;
      const buttons = [...group.querySelectorAll(".faq-question-toggle-btn")];
      return buttons.length >= 3 && buttons.every((button) => button.getAttribute("aria-expanded") === "false");
    },
    { groupSelector: selector },
  );
}

async function waitForFaqState(page, index, expanded) {
  await page.waitForFunction(
    ({ itemIndex, shouldExpand }) => {
      const button = document.querySelectorAll(".faq-question-toggle-btn")[itemIndex];
      if (!button) return false;
      return button.getAttribute("aria-expanded") === String(shouldExpand);
    },
    { itemIndex: index, shouldExpand: expanded },
  );
}

async function waitForPanelState(page, index, open) {
  await page.waitForFunction(
    ({ itemIndex, shouldOpen }) => {
      const panel = document.querySelectorAll(".faq-answer-collapsible")[itemIndex];
      if (!panel) return false;
      const style = getComputedStyle(panel);
      const height = panel.getBoundingClientRect().height;
      return shouldOpen
        ? panel.getAttribute("aria-hidden") === "false" &&
            !panel.hasAttribute("inert") &&
            style.visibility === "visible" &&
            height > 0
        : panel.getAttribute("aria-hidden") === "true" &&
            panel.hasAttribute("inert") &&
            style.visibility === "hidden" &&
            height === 0;
    },
    { itemIndex: index, shouldOpen: open },
  );
}

async function verifyInitialState(page, productSlug = "makhhi-thread") {
  await waitForProductFaq(page, productSlug);
  const selector = faqGroupSelector(productSlug);
  const faqState = await page.locator(selector).evaluate((group) => {
    const buttons = [...group.querySelectorAll(".faq-question-toggle-btn")];
    const answers = [...group.querySelectorAll(".faq-answer-collapsible")];
    return {
      buttons: buttons.map((button) => ({
        id: button.id,
        expanded: button.getAttribute("aria-expanded"),
        controls: button.getAttribute("aria-controls"),
      })),
      answers: answers.map((answer) => ({
        id: answer.id,
        role: answer.getAttribute("role"),
        labelledBy: answer.getAttribute("aria-labelledby"),
        ariaHidden: answer.getAttribute("aria-hidden"),
        inert: answer.hasAttribute("inert"),
        height: answer.getBoundingClientRect().height,
        visibility: getComputedStyle(answer).visibility,
      })),
    };
  });

  check(faqState.buttons.length >= 3, "expected at least three FAQ buttons");
  check(
    faqState.buttons.every(
      (button) => button.id && button.expanded === "false" && button.controls,
    ),
    "FAQ buttons are missing stable closed-state relationships",
  );
  check(
    faqState.answers.every(
      (answer) =>
        answer.id &&
        answer.role === "region" &&
        answer.labelledBy &&
        answer.ariaHidden === "true" &&
        answer.inert &&
        answer.visibility === "hidden" &&
        answer.height === 0,
    ),
    "closed FAQ answers remain rendered or exposed to assistive technology",
  );

  return faqState;
}

(async () => {
  const browser = await chromium.launch({
    ...(executablePath ? { executablePath } : {}),
  });
  const failures = [];

  async function run(name, options, task) {
    const context = await browser.newContext({
      viewport: options.viewport,
      reducedMotion: options.reduced ? "reduce" : "no-preference",
      isMobile: Boolean(options.mobile),
      hasTouch: Boolean(options.mobile),
    });
    await context.addInitScript(() => {
      sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
      sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
      window.__faqCls = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__faqCls += entry.value;
        }
      }).observe({ type: "layout-shift", buffered: true });
    });

    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });

    try {
      await page.goto(`${baseUrl}/products/makhhi-thread`, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });
      await waitForProductFaq(page, "makhhi-thread");
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      await page.evaluate(() => { window.__faqCls = 0; });
      await task(page);
      check(errors.length === 0, `console errors: ${errors.join(" | ")}`);
      if (!options.routeNavigation) {
        check(
          (await page.evaluate(() => window.__faqCls)) === 0,
          "FAQ interaction introduced unexpected CLS",
        );
      }
      console.log(`PASS ${name}`);
    } catch (error) {
      failures.push({ name, error: error.message });
      console.error(`FAIL ${name}: ${error.message}`);
    } finally {
      await context.close();
    }
  }

  await run(
    "desktop semantics, pointer and keyboard behavior",
    { viewport: { width: 1440, height: 960 } },
    async (page) => {
      await verifyInitialState(page);
      const buttons = page.locator(".faq-question-toggle-btn");
      const answers = page.locator(".faq-answer-collapsible");

      const firstButton = buttons.nth(0);
      await firstButton.click();
      await waitForFaqState(page, 0, true);
      await waitForPanelState(page, 0, true);
      check(
        await firstButton.evaluate((node) => node === document.activeElement),
        "pointer activation moved focus away from the FAQ question",
      );
      check(
        (await answers.nth(0).getAttribute("aria-hidden")) === "false",
        "first answer did not open",
      );

      const secondButton = buttons.nth(1);
      await secondButton.focus();
      await page.keyboard.press("Enter");
      await waitForFaqState(page, 1, true);
      await waitForPanelState(page, 0, false);
      await waitForPanelState(page, 1, true);
      check(
        (await firstButton.getAttribute("aria-expanded")) === "false",
        "opening the second answer did not close the first",
      );
      check(
        (await answers.nth(0).getAttribute("aria-hidden")) === "true",
        "first answer remained exposed",
      );
      check(
        await secondButton.evaluate((node) => node === document.activeElement),
        "Enter activation moved focus unexpectedly",
      );

      await page.keyboard.press("Space");
      await waitForFaqState(page, 1, false);
      await waitForPanelState(page, 1, false);
    },
  );

  await run(
    "product navigation and browser history reset state",
    {
      viewport: { width: 1440, height: 960 },
      routeNavigation: true,
    },
    async (page) => {
      const firstButton = page.locator(".faq-question-toggle-btn").first();
      await firstButton.click();
      await waitForFaqState(page, 0, true);
      await waitForPanelState(page, 0, true);

      const currentUrl = page.url();
      const currentPath = new URL(currentUrl).pathname;
      const href = await page
        .locator('.card-grid.product-grid a[href^="/products/"]')
        .evaluateAll((links, activePath) => {
          return links
            .map((link) => link.getAttribute("href"))
            .find((value) => value && value !== activePath);
        }, currentPath);
      check(Boolean(href), "no related product route was available");
      const relatedSlug = href.split("/").filter(Boolean).at(-1);
      check(Boolean(relatedSlug), "related product route did not contain a slug");

      const relatedLink = page.locator(`.card-grid.product-grid a[href="${href}"]`).first();
      await relatedLink.click();
      await page.waitForURL(`**${href}`);
      await verifyInitialState(page, relatedSlug);

      await page.goBack();
      await page.waitForURL(currentUrl);
      await verifyInitialState(page, "makhhi-thread");

      await page.goForward();
      await page.waitForURL(`**${href}`);
      await verifyInitialState(page, relatedSlug);
    },
  );

  await run(
    "mobile accordion behavior",
    {
      viewport: { width: 390, height: 844 },
      mobile: true,
    },
    async (page) => {
      await verifyInitialState(page);
      const button = page.locator(".faq-question-toggle-btn").nth(2);
      await button.tap();
      await waitForFaqState(page, 2, true);
      await waitForPanelState(page, 2, true);
      check(
        (await button.getAttribute("aria-expanded")) === "true",
        "mobile tap did not open the expected answer",
      );
      check(
        (await page.locator("body").evaluate((node) => node.scrollWidth)) <= 390,
        "mobile FAQ introduced horizontal overflow",
      );
    },
  );

  await run(
    "reduced-motion accordion behavior",
    {
      viewport: { width: 1440, height: 960 },
      reduced: true,
    },
    async (page) => {
      await verifyInitialState(page);
      const button = page.locator(".faq-question-toggle-btn").first();
      await button.click();
      await waitForFaqState(page, 0, true);
      await waitForPanelState(page, 0, true);
      const durations = await page
        .locator(".faq-answer-collapsible")
        .first()
        .evaluate((node) => {
          const style = getComputedStyle(node);
          return {
            transitionDuration: style.transitionDuration,
            animationDuration: style.animationDuration,
          };
        });
      check(
        durations.transitionDuration === "0s" ||
          durations.transitionDuration === "0.001s",
        `reduced-motion transition remained ${durations.transitionDuration}`,
      );
    },
  );

  await browser.close();
  if (failures.length) {
    console.error(JSON.stringify({ failures }, null, 2));
    process.exit(1);
  }
  console.log("\nFAQ interaction suite passed.");
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
