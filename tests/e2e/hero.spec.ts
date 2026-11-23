import { expect, test } from "@playwright/test";

test("hero video loads after first paint and plays", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Raising the");
  const v = page.locator("[data-layer=a] video");
  await expect.poll(async () => v.evaluate((el: HTMLVideoElement) => el.currentSrc), { timeout: 15000 }).toMatch(/hero-arrival-v2-1600\.(webm|mp4)/);
  await expect.poll(async () => v.evaluate((el: HTMLVideoElement) => !el.paused && el.readyState >= 2), { timeout: 15000 }).toBe(true);
  await page.getByRole("button", { name: "Pause background video" }).click();
  expect(await v.evaluate((el: HTMLVideoElement) => el.paused)).toBe(true);
});

test("scroll choreography reaches the heritage scene and releases scroll", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator("section.cine");
  const h = await hero.evaluate((el) => el.getBoundingClientRect().height);
  expect(h).toBeGreaterThan(2000);
  await page.evaluate((y) => window.scrollTo(0, y), h - 900);
  await expect(page.getByRole("heading", { name: /A legacy built to last/ }).first()).toBeInViewport();
  await page.evaluate((y) => window.scrollTo(0, y), h - 300);
  await expect(page.locator("section[aria-label=Credentials]")).toBeInViewport();
});

test("reduced motion: no pinned sequence, no autoplay", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const h = await page.locator("section.cine").evaluate((el) => el.getBoundingClientRect().height);
  expect(h).toBeLessThan(1000);
  await page.waitForTimeout(2500);
  expect(await page.locator("[data-layer=a] video").evaluate((el: HTMLVideoElement) => el.currentSrc)).toBe("");
});

test("concept B (stills) renders", async ({ page }) => {
  await page.goto("/hero-concepts?c=stills");
  await expect(page.locator("section.cine[data-concept=stills]")).toBeVisible();
  await expect(page.locator("[data-layer=a] video")).toHaveCount(0);
});
