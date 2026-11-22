// Renders public/og.jpg (1200x630) and public/apple-icon.png (180x180) with Playwright.
// Usage: node scripts/media/brand-images.cjs
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const b64 = (p) => fs.readFileSync(path.join(root, p)).toString("base64");
const mark = `<svg viewBox="0 0 120 50" style="height:100%;width:auto"><g fill="none" stroke="#fff"><polyline points="3,47 24,25 35.5,37" stroke-width="5.5"/><polyline points="12.5,47 24,35 29,40.5" stroke-width="3"/><polyline points="117,47 96,25 84.5,37" stroke-width="5.5"/><polyline points="107.5,47 96,35 91,40.5" stroke-width="3"/><polyline points="24,47 60,7 96,47" stroke-width="6.5"/><polyline points="35,47 60,19.5 85,47" stroke-width="3.5"/></g><g fill="#fff"><rect x="56.4" y="30.5" width="3.2" height="3.2"/><rect x="60.4" y="30.5" width="3.2" height="3.2"/><rect x="56.4" y="34.5" width="3.2" height="3.2"/><rect x="60.4" y="34.5" width="3.2" height="3.2"/><circle cx="24" cy="42" r="1.6"/><circle cx="96" cy="42" r="1.6"/></g></svg>`;
const fonts = `@font-face{font-family:M;src:url(data:font/woff2;base64,${b64("src/fonts/manrope.woff2")}) format("woff2");font-weight:200 800}
@font-face{font-family:I;src:url(data:font/woff2;base64,${b64("src/fonts/inter.woff2")}) format("woff2");font-weight:100 900}`;

const og = `<html><head><style>${fonts}*{margin:0}body{width:1200px;height:630px;background:#111214;font-family:I;color:#fff;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;background:url(data:image/jpeg;base64,${b64("public/media/stills/hip-roof-vents.jpg")}) center/cover;opacity:.55}
.g{position:absolute;inset:0;background:linear-gradient(90deg,#111214 0%,rgba(17,18,20,.85) 45%,rgba(17,18,20,.2) 100%)}
.c{position:absolute;left:72px;top:64px;bottom:64px;display:flex;flex-direction:column;justify-content:space-between}
.logo{display:flex;align-items:center;gap:18px;height:46px}.wm{font-family:M;font-weight:800;letter-spacing:.06em;font-size:28px;line-height:1}.wm small{display:block;font-family:I;font-weight:600;font-size:12px;letter-spacing:.2em;color:#b9bcc1;margin-top:6px}
h1{font-family:M;font-weight:750;font-size:92px;line-height:.95;letter-spacing:-.04em}p{font-size:24px;color:#d9dadd;margin-top:22px}
.f{font-size:18px;color:#b9bcc1;letter-spacing:.04em}.f b{color:#fff;font-weight:600}.bar{width:56px;height:3px;background:#c92e42;margin-bottom:18px}</style></head>
<body><div class=bg></div><div class=g></div><div class=c><div class=logo>${mark}<div class=wm>NEXTGEN<small>ROOFING &amp; CONSTRUCTION</small></div></div>
<div><h1>Raising the<br>Standard.</h1><p>Residential &amp; commercial roofing · Toledo, Ohio</p></div>
<div class=f><div class=bar></div><b>(440) 228-5933</b> &nbsp;·&nbsp; Free inspections &amp; estimates</div></div></body></html>`;

const icon = `<html><body style="margin:0;width:180px;height:180px;background:#111214;display:flex;align-items:center;justify-content:center"><div style="height:62px">${mark}</div></body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(og, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(root, "public/og.jpg"), type: "jpeg", quality: 85 });
  await p.setViewportSize({ width: 180, height: 180 });
  await p.setContent(icon);
  await p.screenshot({ path: path.join(root, "public/apple-icon.png") });
  await b.close();
  console.log("wrote public/og.jpg and public/apple-icon.png");
})();
