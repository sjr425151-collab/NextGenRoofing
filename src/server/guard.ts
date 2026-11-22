import "server-only";
import { createHash } from "node:crypto";

/**
 * Lightweight abuse protection for form endpoints:
 *  - per-IP sliding window rate limit (in-memory; per server instance — use a
 *    shared store such as Upstash/Redis if deployed across many instances)
 *  - minimum fill time (bots submit instantly)
 *  - optional Cloudflare Turnstile verification when TURNSTILE_SECRET_KEY is set
 */
const hits = new Map<string, number[]>();

export function clientKey(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  // Hash so raw IPs are never held in memory longer than needed.
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

export function rateLimit(key: string, limit = Number(process.env.LEAD_RATE_LIMIT ?? 5), windowMs = 10 * 60_000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (arr.length >= limit) { hits.set(key, arr); return false; }
  arr.push(now);
  hits.set(key, arr);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return true;
}

export function tooFast(startedAt: number, minMs = 3000) {
  const elapsed = Date.now() - startedAt;
  return elapsed < minMs || elapsed > 1000 * 60 * 60 * 24;
}

export async function verifyTurnstile(token: string | undefined, req: Request) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured
  if (!token) return false;
  const form = new URLSearchParams({ secret, response: token });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) form.set("remoteip", ip);
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form, signal: AbortSignal.timeout(8000) });
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data.success);
  } catch {
    return false;
  }
}

export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true; // non-browser clients; other checks still apply
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try { return new URL(origin).host === host; } catch { return false; }
}
