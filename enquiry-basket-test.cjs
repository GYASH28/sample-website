const { chromium } = require("playwright");

const BASE_URL = process.env.ENQUIRY_BASKET_BASE_URL || "http://127.0.0.1:4173";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function goto(page, route) {
  await page.goto(`${BASE_URL}${route}`, { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForFunction(() => document.querySelector("#main-content"));
  await page.evaluate(() => document.fonts.ready);
}

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: "reduce" });
  await context.addInitScript(() => {
    sessionStorage.setItem("fakhri_intro_cinematic_v2", "played");
    sessionStorage.setItem("fakhri_commerce_intro_v3", "played");
    if (!sessionStorage.getItem("fakhri_enquiry_regression_initialized")) {
      localStorage.removeItem("fakhri_enquiry_basket");
      sessionStorage.setItem("fakhri_enquiry_regression_initialized", "1");
    }
    window.open = (url) => {
      window.__lastEnquiryPopup = String(url || "");
      return null;
    };
  });

  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  try {
    await goto(page, "/products");

    const cards = page.locator(".product-showcase-card");
    assert(await cards.count() >= 2, "catalogue needs at least two products for enquiry regression");

    // First item: exercise the exact wholesale path customers use from Quick View.
    const first = cards.nth(0);
    const firstName = (await first.locator(".product-card-title").textContent()).trim();
    await first.locator(".product-card-quick-view").click();
    const quick = page.locator(".quick-view");
    await quick.waitFor({ state: "visible" });
    await quick.getByRole("button", { name: "Bulk / wholesale" }).click();
    const hundred = quick.locator(".quick-view__quantity-presets button").filter({ hasText: /^100$/ });
    assert(await hundred.count() === 1, "bulk 100 preset missing");
    await hundred.click();
    await quick.getByRole("button", { name: /^Add to enquiry$/ }).click();
    await page.keyboard.press("Escape");

    // Second item: normal catalogue-card add path.
    const second = cards.nth(1);
    const secondName = (await second.locator(".product-card-title").textContent()).trim();
    await second.getByRole("button", { name: /Add to enquiry/i }).click();

    let basket = await page.evaluate(() => JSON.parse(localStorage.getItem("fakhri_enquiry_basket") || "[]"));
    assert(basket.length === 2, `expected 2 enquiry lines, found ${basket.length}`);
    assert(basket[0].name === firstName && basket[0].quantity === 100, `bulk item was not stored correctly: ${JSON.stringify(basket[0])}`);
    assert(basket[0].note.includes("Enquiry mode: Bulk"), `bulk mode was lost: ${JSON.stringify(basket[0])}`);
    assert(basket[1].name === secondName, `second catalogue item was not stored: ${JSON.stringify(basket[1])}`);

    // Drawer must reflect the same state and build a truthful WhatsApp URL.
    const launcher = page.locator(".enquiry-launcher");
    await launcher.click();
    const drawer = page.locator(".enquiry-drawer.is-open");
    await drawer.waitFor({ state: "visible" });
    assert(await drawer.locator(".enquiry-drawer__item").count() === 2, "drawer did not render both enquiry lines");
    const drawerHref = await drawer.locator(".enquiry-drawer__actions a").filter({ hasText: /Send on WhatsApp/i }).getAttribute("href");
    const drawerMessage = decodeURIComponent(new URL(drawerHref).searchParams.get("text") || "");
    assert(drawerMessage.includes(firstName) && drawerMessage.includes(secondName), "drawer WhatsApp message omitted a product");
    assert(drawerMessage.includes("100"), "drawer WhatsApp message lost bulk quantity");
    await drawer.getByRole("button", { name: "Close enquiry basket" }).click();

    // Full enquiry screen: update quantity and note, then prove persistence on reload.
    await goto(page, "/enquiry");
    const rows = page.locator(".basket-item-card-row");
    assert(await rows.count() === 2, "full enquiry page did not restore basket");
    const firstRow = rows.nth(0);
    const beforeQuantity = Number((await firstRow.locator(".stepper-compact-display").innerText()).trim());
    await firstRow.getByRole("button", { name: "Increase requested quantity" }).click();
    await firstRow.locator(".basket-item-note input").fill("Need current shade card before confirming.");
    await page.waitForTimeout(80);

    await page.reload({ waitUntil: "networkidle" });
    await page.waitForFunction(() => document.querySelector(".basket-item-card-row"));
    const reloadedFirst = page.locator(".basket-item-card-row").nth(0);
    const reloadedQuantity = Number((await reloadedFirst.locator(".stepper-compact-display").innerText()).trim());
    assert(reloadedQuantity === beforeQuantity + 1, `quantity did not persist across refresh: ${beforeQuantity} -> ${reloadedQuantity}`);
    assert((await reloadedFirst.locator(".basket-item-note input").inputValue()) === "Need current shade card before confirming.", "item note did not persist across refresh");

    // Submit through the actual form and inspect the generated WhatsApp message.
    await page.locator('input[name="name"]').fill("Regression Test");
    await page.locator('input[name="phone"]').fill("9999999999");
    await page.locator('select[name="businessType"]').selectOption({ index: 1 });
    await page.locator('input[name="city"]').fill("Pune");
    await page.getByRole("button", { name: /Send Enquiry on WhatsApp/i }).click();
    await page.waitForTimeout(60);
    const opened = await page.evaluate(() => window.__lastEnquiryPopup || "");
    assert(opened, "enquiry submit did not generate WhatsApp URL");
    const message = decodeURIComponent(new URL(opened).searchParams.get("text") || "");
    assert(message.includes(firstName) && message.includes(secondName), "submitted WhatsApp message omitted a basket product");
    assert(message.includes(`Quantity: ${reloadedQuantity}`), "submitted WhatsApp message lost edited quantity");
    assert(message.includes("Need current shade card before confirming."), "submitted WhatsApp message lost item note");
    assert(message.includes("Pune"), "submitted WhatsApp message lost city");

    // Submit clears the basket after the success transition by design.
    await page.waitForTimeout(300);
    basket = await page.evaluate(() => JSON.parse(localStorage.getItem("fakhri_enquiry_basket") || "[]"));
    assert(basket.length === 0, "successful enquiry did not clear basket");

    // Rebuild quickly to exercise remove and explicit clear independently.
    await goto(page, "/products");
    await page.locator(".product-showcase-card").nth(0).getByRole("button", { name: /Add to enquiry/i }).click();
    await page.locator(".product-showcase-card").nth(1).getByRole("button", { name: /Add to enquiry/i }).click();
    await goto(page, "/enquiry");
    assert(await page.locator(".basket-item-card-row").count() === 2, "basket rebuild failed");
    await page.locator(".basket-item-card-row").nth(1).getByRole("button", { name: "Remove item" }).click();
    assert(await page.locator(".basket-item-card-row").count() === 1, "remove item did not update basket");
    await page.getByRole("button", { name: /Clear Basket/i }).click();
    await page.waitForFunction(() => document.querySelectorAll(".basket-item-card-row").length === 0);
    assert((await page.locator("body").innerText()).includes("Your Enquiry Basket is Empty"), "clear basket did not restore empty state");

    assert(errors.length === 0, `browser errors: ${errors.join(" | ")}`);
    console.log("✓ enquiry basket persistence, editing, WhatsApp message, removal and clear flows");
  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
})().catch((error) => {
  console.error(error.stack || error.message || error);
  process.exit(1);
});
