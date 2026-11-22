import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";

async function step1(page: Page, sector: "Residential" | "Commercial", scope: string) {
  const est = page.locator("[data-estimator]").first();
  await est.getByText(sector, { exact: true }).click();
  await est.getByText(scope, { exact: true }).click();
  return est;
}

test("residential estimate → range → lead submitted and stored", async ({ page }) => {
  await page.goto("/estimate");
  const est = await step1(page, "Residential", "Replacement");
  await est.getByText("Architectural shingle").click();
  await est.getByLabel("Property ZIP code").fill("43604");
  await est.getByRole("button", { name: "Continue" }).click();

  await expect(est.getByRole("heading", { name: "About your roof" })).toBeFocused();
  await est.getByLabel("Home living space (sq ft)").fill("2000");
  await est.locator("fieldset", { hasText: "Roof pitch" }).getByText("Moderate").click();
  await est.locator("fieldset", { hasText: "Number of stories" }).getByText("Two").click();
  await est.locator("fieldset", { hasText: "Roof shape" }).getByText("I’m not sure").click();
  await est.locator("fieldset", { hasText: "Existing layers" }).getByText("One layer").click();
  await est.getByRole("button", { name: "See my estimate" }).click();

  await expect(est.getByRole("heading", { name: "Your preliminary estimate" })).toBeVisible();
  await expect(est.getByText("Demonstration pricing — not NextGen rates")).toBeVisible();
  await expect(est.getByText(/\$\d{1,3},\d{3}/).first()).toBeVisible();
  await expect(est.getByText(/not a binding quote/)).toBeVisible();

  const unique = `E2E Tester ${Date.now()}`;
  await est.getByRole("textbox", { name: "Full name" }).fill(unique);
  await est.getByRole("textbox", { name: "Phone" }).fill("(419) 555-0100");
  await est.getByRole("textbox", { name: "Email" }).fill("e2e@example.com");
  await est.getByLabel("Property address").fill("123 Test St, Toledo, OH");
  await page.waitForTimeout(3100); // minimum fill time guard
  await est.getByRole("button", { name: "Request My Free Inspection" }).click();
  await expect(est.getByRole("status")).toContainText("Request received.");

  const stored = await readFile("data/e2e/leads.jsonl", "utf8");
  const lead = stored.trim().split("\n").map((l) => JSON.parse(l)).find((l) => l.contact.name === unique);
  expect(lead).toBeTruthy();
  expect(lead.estimate.area).toEqual({ method: "home", sqft: 2000 });
  expect(lead.estimateResult.kind).toBe("estimate");
  expect(lead.estimateResult.assumptions.length).toBeGreaterThan(0);
});

test("validation blocks empty steps and explains errors", async ({ page }) => {
  await page.goto("/estimate");
  const est = page.locator("[data-estimator]");
  await est.getByRole("button", { name: "Continue" }).click();
  await expect(est.getByText("Choose a property type")).toBeVisible();
  await expect(est.getByText("Enter a 5-digit ZIP code")).toBeVisible();
});

test("repair routes to inspection without a price", async ({ page }) => {
  await page.goto("/estimate");
  const est = await step1(page, "Residential", "Repair");
  await est.getByText("Active leak").click();
  await est.getByLabel("Property ZIP code").fill("43604");
  await est.getByRole("button", { name: "See my estimate" }).click();
  await expect(est.getByRole("heading", { name: "Let’s look at it in person" })).toBeVisible();
  await expect(est.getByText(/\$\d/)).toHaveCount(0);
});

test("commercial coating over poor roof requires inspection", async ({ page }) => {
  await page.goto("/estimate");
  const est = await step1(page, "Commercial", "Replacement");
  await est.getByText("Roof coating").click();
  await est.getByLabel("Property ZIP code").fill("43604");
  await est.getByRole("button", { name: "Continue" }).click();
  await est.getByRole("radio", { name: "Roof area" }).click();
  await est.getByLabel("Roof surface area (sq ft)").fill("12000");
  await est.locator("fieldset", { hasText: "Roof configuration" }).getByText("Flat", { exact: true }).click();
  await est.locator("fieldset", { hasText: "Existing roof condition" }).getByText("Poor").click();
  await est.locator("fieldset", { hasText: "Roof access" }).getByText("Easy").click();
  await est.locator("fieldset", { hasText: "Rooftop complexity" }).getByText("Low", { exact: true }).click();
  await est.getByRole("button", { name: "See my estimate" }).click();
  await expect(est.getByText(/requires a sound, dry existing roof/)).toBeVisible();
});

test("backend failure never shows success", async ({ page }) => {
  await page.route("**/api/leads", (route) =>
    route.request().method() === "POST" ? route.fulfill({ status: 502, contentType: "application/json", body: JSON.stringify({ ok: false, error: "We couldn't send your request." }) }) : route.continue(),
  );
  await page.goto("/contact");
  await page.getByRole("textbox", { name: "Full name" }).fill("Fail Case");
  await page.getByRole("textbox", { name: "Phone" }).fill("4195550100");
  await page.getByRole("textbox", { name: "Email" }).fill("fail@example.com");
  await page.getByRole("button", { name: "Schedule My Free Inspection" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "send your request" })).toBeVisible();
  await expect(page.getByText("Request received.")).toHaveCount(0);
});

test("lead API rejects bots and bad input server-side", async ({ request }) => {
  const contact = { name: "Bot", phone: "4195550100", email: "b@example.com", address: "", preferredContact: "phone", notes: "" };
  const fast = await request.post("/api/leads", { data: { payload: { source: "contact", contact, topic: "other" }, guard: { startedAt: Date.now() } } });
  expect(fast.status()).toBe(400);
  const honeypot = await request.post("/api/leads", { data: { payload: { source: "contact", contact, topic: "other" }, guard: { website: "spam", startedAt: Date.now() - 10000 } } });
  expect(honeypot.status()).toBe(422);
  const bad = await request.post("/api/leads", { data: { payload: { source: "contact", contact: { ...contact, email: "nope" }, topic: "other" }, guard: { startedAt: Date.now() - 10000 } } });
  expect(bad.status()).toBe(422);
});

test("contact form submits successfully", async ({ page }) => {
  await page.goto("/contact");
  await page.getByRole("textbox", { name: "Full name" }).fill("Contact Tester");
  await page.getByRole("textbox", { name: "Phone" }).fill("4195550100");
  await page.getByRole("textbox", { name: "Email" }).fill("c@example.com");
  await page.getByText("Commercial roof", { exact: true }).click();
  await page.waitForTimeout(3100);
  await page.getByRole("button", { name: "Schedule My Free Inspection" }).click();
  await expect(page.getByRole("status")).toContainText("Request received.");
});
