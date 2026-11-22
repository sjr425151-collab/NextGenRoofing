import { NextResponse } from "next/server";
import { runEstimate } from "@/lib/estimator/engine";
import { estimateInput } from "@/lib/estimator/schema";
import { loadPricing, resolveMode } from "@/server/pricing";
import { clientKey, rateLimit, sameOrigin } from "@/server/guard";

export const dynamic = "force-dynamic";

export async function GET() {
  const cfg = await loadPricing();
  const mode = resolveMode(cfg);
  return NextResponse.json({ mode, pricingStatus: cfg.status, disclaimer: cfg.disclaimer }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!rateLimit("est:" + clientKey(req), 60, 10 * 60_000)) {
    return NextResponse.json({ error: "Too many requests. Please wait a few minutes." }, { status: 429 });
  }
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const parsed = estimateInput.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the highlighted fields.", issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })) }, { status: 422 });
  }
  const cfg = await loadPricing();
  const mode = resolveMode(cfg);
  const result = runEstimate(cfg, parsed.data, mode);
  return NextResponse.json({ result, mode, disclaimer: cfg.disclaimer }, { headers: { "cache-control": "no-store" } });
}
