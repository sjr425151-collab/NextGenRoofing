// Smoke test for sub-path deployments: loads every page under BASE and fails on any failed request.
// Usage: BASE=http://localhost:3000/preview/nextgenroofing node scripts/check-subpath.cjs
const { chromium } = require("playwright");
const BASE = (process.env.BASE || "http://localhost:3000").replace(/\/$/, "");
const pages = ["/", "/residential-roofing", "/commercial-roofing", "/roof-repair", "/flat-roofing", "/projects",
  "/projects/full-roof-replacement", "/projects/hip-roof-shingle-installation", "/projects/farmhouse-re-roof", "/projects/gable-roof-replacement-step-by-step", "/projects/gray-hip-roof", "/projects/brown-shingle-ranch", "/projects/charcoal-shingle-roof",
  "/about", "/contact", "/estimate", "/privacy", "/terms", "/hero-concepts?c=stills"];
(async () => {
  const b = await chromium.launch();
  let failures = 0;
  for (const path of pages) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    const bad = [];
    p.on("response", (r) => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`); });
    p.on("requestfailed", (r) => { if (!/ERR_ABORTED/.test(r.failure()?.errorText ?? "")) bad.push(`FAILED ${r.url()} ${r.failure()?.errorText}`); });
    p.on("pageerror", (e) => bad.push("JS " + e.message));
    const res = await p.goto(BASE + path, { waitUntil: "networkidle" });
    // scroll through to trigger lazy images and the hero's second video
    const h = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 700) { await p.evaluate((y) => window.scrollTo(0, y), y); await p.waitForTimeout(80); }
    await p.waitForLoadState("networkidle");
    const extra = {};
    if (path === "/") extra.video = await p.$eval("[data-layer=a] video", (v) => v.currentSrc);
    if (path === "/projects/farmhouse-re-roof") {
      await p.getByRole("button", { name: /Watch the project/ }).click();
      await p.waitForTimeout(1500);
      extra.film = await p.$eval("video", (v) => `${v.currentSrc} readyState=${v.readyState}`);
    }
    console.log(res.status(), path, bad.length ? "✗ " + bad.join(" | ") : "✓", Object.keys(extra).length ? JSON.stringify(extra) : "");
    failures += bad.length + (res.status() === 200 ? 0 : 1);
    await p.close();
  }
  await b.close();
  process.exit(failures ? 1 : 0);
})();
