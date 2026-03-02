import { chromium } from "playwright";

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // 1. Admin Settings
    await page.goto("http://localhost:3000/admin/settings");
    await page.waitForTimeout(2000); // let UI load
    // Click FR tab if needed to show lifestyle images
    const frTab = page.locator("button", { hasText: "🇫🇷 Français" });
    if (await frTab.isVisible()) {
        await frTab.click();
        await page.waitForTimeout(500);
    }
    await page.screenshot({ path: "C:/Users/PC88/.gemini/antigravity/brain/cb82af6d-c26c-4b65-bf94-663925e1df99/admin_lifestyle_fields.png", fullPage: true });

    // 2. Product Page Zoom & Lifestyle
    await page.goto("http://localhost:3000/product");
    await page.waitForTimeout(2000);

    // Screenshot top of product page showing magnifier
    await page.screenshot({ path: "C:/Users/PC88/.gemini/antigravity/brain/cb82af6d-c26c-4b65-bf94-663925e1df99/product_gallery_zoom.png" });

    // Scroll to lifestyle grid
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2);
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "C:/Users/PC88/.gemini/antigravity/brain/cb82af6d-c26c-4b65-bf94-663925e1df99/product_lifestyle_grid.png" });

    // Check document title
    const title = await page.title();
    console.log("Document Title:", title);

    await browser.close();
})();
