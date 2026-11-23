import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/residential-roofing", "/commercial-roofing", "/roof-repair", "/flat-roofing", "/projects",
  "/projects/full-roof-replacement", "/projects/hip-roof-shingle-installation", "/projects/farmhouse-re-roof",
  "/projects/gable-roof-replacement-step-by-step", "/projects/gray-hip-roof", "/projects/brown-shingle-ranch", "/projects/charcoal-shingle-roof",
  "/roof-inspection", "/about", "/contact", "/estimate", "/privacy", "/terms"];
const WIDTHS = [320, 375, 390, 430, 768, 1024, 1440];

for (const path of PAGES) {
  test(`renders ${path}: one h1, title, canonical, no console errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(String(e)));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    expect((await page.title()).length).toBeGreaterThan(10);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveCount(1);
    expect(errors).toEqual([]);
  });

  test(`no horizontal overflow on ${path}`, async ({ page }) => {
    for (const w of WIDTHS) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `overflow at ${w}px`).toBeLessThanOrEqual(0);
    }
  });

  test(`axe WCAG 2.2 AA on ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(path);
    await page.evaluate(() => document.querySelectorAll("[data-reveal]").forEach((e) => e.classList.add("is-revealed")));
    const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    const v = r.violations.map((x) => `${x.id} (${x.impact}): ${x.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
    expect(v).toEqual([]);
  });
}

test("every internal link resolves", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const p of PAGES) {
    await page.goto(p);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!.split("#")[0]));
    hrefs.forEach((h) => h && seen.add(h));
  }
  for (const h of seen) {
    const r = await request.get(h);
    expect(r.status(), h).toBe(200);
  }
});

test("sitemap, robots and structured data", async ({ page, request }) => {
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  await page.goto("/");
  const ld = await page.$$eval('script[type="application/ld+json"]', (s) => s.map((x) => JSON.parse(x.textContent!)));
  const nodes = ld.flatMap((d) => d["@graph"] ?? [d]);
  expect(nodes.some((d) => d["@type"] === "RoofingContractor" && d.telephone === "+14402285933")).toBe(true);
  expect(nodes.some((d) => d["@type"] === "WebSite")).toBe(true);
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/roof-inspection");
});

test("unknown routes return 404", async ({ page }) => {
  const r = await page.goto("/does-not-exist");
  expect(r?.status()).toBe(404);
});
