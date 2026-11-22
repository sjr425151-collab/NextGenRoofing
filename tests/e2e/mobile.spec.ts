import { expect, test } from "@playwright/test";

test("mobile menu opens, traps focus, closes on Escape", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const dlg = page.getByRole("dialog", { name: "Site menu" });
  await expect(dlg).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dlg).toBeHidden();
  await page.getByRole("button", { name: "Open menu" }).click();
  await dlg.getByRole("link", { name: "Commercial Roofing" }).click();
  await expect(page).toHaveURL(/commercial-roofing/);
  await expect(page.getByRole("dialog", { name: "Site menu" })).toBeHidden();
});

test("sticky call bar appears after scrolling with a tel: link", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile only");
  await page.goto("/about");
  await page.mouse.wheel(0, 1500);
  await expect(page.locator('a[href="tel:+14402285933"]', { hasText: "Call (440) 228-5933" })).toBeInViewport();
});
