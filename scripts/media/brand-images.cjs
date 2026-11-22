// Renders public/og.jpg (1200x630) and public/apple-icon.png (180x180) with Playwright.
// Usage: node scripts/media/brand-images.cjs
const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../..");
const b64 = (p) => fs.readFileSync(path.join(root, p)).toString("base64");
const markImg = (h) => `<img src="data:image/png;base64,${b64("public/brand/mark-on-dark.png")}" style="height:${h}px;width:auto;display:block">`;
const lockup = `<img src="data:image/png;base64,${b64("public/brand/logo-horizontal-on-dark.png")}" style="height:64px;width:auto;display:block">`;
const fonts = `@font-face{font-family:M;src:url(data:font/woff2;base64,${b64("src/fonts/manrope.woff2")}) format("woff2");font-weight:200 800}
@font-face{font-family:I;src:url(data:font/woff2;base64,${b64("src/fonts/inter.woff2")}) format("woff2");font-weight:100 900}`;

const og = `<html><head><style>${fonts}*{margin:0}body{width:1200px;height:630px;background:#111214;font-family:I;color:#fff;position:relative;overflow:hidden}
.bg{position:absolute;inset:0;background:url(data:image/jpeg;base64,${b64("public/media/stills/hip-roof-vents.jpg")}) center/cover;opacity:.55}
.g{position:absolute;inset:0;background:linear-gradient(90deg,#111214 0%,rgba(17,18,20,.85) 45%,rgba(17,18,20,.2) 100%)}
.c{position:absolute;left:72px;top:64px;bottom:64px;display:flex;flex-direction:column;justify-content:space-between}
.logo{display:flex;align-items:center;gap:18px;height:46px}.wm{font-family:M;font-weight:800;letter-spacing:.06em;font-size:28px;line-height:1}.wm small{display:block;font-family:I;font-weight:600;font-size:12px;letter-spacing:.2em;color:#b9bcc1;margin-top:6px}
h1{font-family:M;font-weight:750;font-size:92px;line-height:.95;letter-spacing:-.04em}p{font-size:24px;color:#d9dadd;margin-top:22px}
.f{font-size:18px;color:#b9bcc1;letter-spacing:.04em}.f b{color:#fff;font-weight:600}.bar{width:56px;height:3px;background:#bf2a39;margin-bottom:18px}</style></head>
<body><div class=bg></div><div class=g></div><div class=c><div class=logo style="height:auto">${lockup}</div>
<div><h1>Raising the<br>Standard.</h1><p>Residential &amp; commercial roofing · Toledo, Ohio</p></div>
<div class=f><div class=bar></div><b>(440) 228-5933</b> &nbsp;·&nbsp; Free inspections &amp; estimates</div></div></body></html>`;

const icon = (size) => `<html><body style="margin:0;width:${size}px;height:${size}px;background:#111214;display:flex;align-items:center;justify-content:center">${markImg(Math.round(size * 0.27))}</body></html>`;

(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(og, { waitUntil: "load" });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: path.join(root, "public/og.jpg"), type: "jpeg", quality: 85 });
  for (const [size, file] of [[180, "public/apple-icon.png"], [512, "public/icon.png"], [48, "public/favicon-48.png"]]) {
    await p.setViewportSize({ width: size, height: size });
    await p.setContent(icon(size), { waitUntil: "load" });
    await p.screenshot({ path: path.join(root, file) });
  }
  await b.close();
  console.log("wrote og.jpg, apple-icon.png, icon.png, favicon-48.png");
})();
