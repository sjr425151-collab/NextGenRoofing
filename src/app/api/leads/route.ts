import { NextResponse } from "next/server";
import { runEstimate } from "@/lib/estimator/engine";
import { leadRequest } from "@/lib/leads/schema";
import { clientKey, rateLimit, sameOrigin, tooFast, verifyTurnstile } from "@/server/guard";
import { LeadUnavailableError, leadsEnabled, submitLead } from "@/server/leads";
import { loadPricing, resolveMode } from "@/server/pricing";

export const dynamic = "force-dynamic";

const fail = (status: number, error: string, extra: object = {}) =>
  NextResponse.json({ ok: false, error, ...extra }, { status, headers: { "cache-control": "no-store" } });

/** Lets the UI know in advance whether online requests can be accepted. */
export async function GET() {
  return NextResponse.json({ enabled: leadsEnabled() }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail(403, "Forbidden");
  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > 32_000) return fail(413, "Request too large");
  if (!rateLimit("lead:" + clientKey(req))) return fail(429, "Too many submissions. Please call us instead.");

  let body: unknown;
  try { body = await req.json(); } catch { return fail(400, "Invalid request"); }
  const parsed = leadRequest.safeParse(body);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .filter((i) => i.path[0] === "payload")
      .map((i) => ({ path: i.path.slice(1).join("."), message: i.message }));
    return fail(422, "Please check the highlighted fields.", { issues });
  }
  const { payload, guard } = parsed.data;
  if (tooFast(guard.startedAt)) return fail(400, "We couldn't verify this submission. Please try again or call us.");
  if (!(await verifyTurnstile(guard.turnstileToken, req))) return fail(400, "Verification failed. Please try again or call us.");

  // Never trust a client-side price: recalculate on the server.
  let estimateResult;
  if (payload.source === "estimator") {
    const cfg = await loadPricing();
    estimateResult = runEstimate(cfg, payload.estimate, resolveMode(cfg));
  }

  try {
    const { id } = await submitLead(payload, estimateResult);
    return NextResponse.json({ ok: true, id }, { status: 201, headers: { "cache-control": "no-store" } });
  } catch (err) {
    if (err instanceof LeadUnavailableError) return fail(503, "Online requests aren't available right now.");
    return fail(502, "We couldn't send your request.");
  }
}
