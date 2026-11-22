import "server-only";
import { createHmac, randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import type { EstimateResult } from "@/lib/estimator/schema";
import type { LeadPayload } from "@/lib/leads/schema";
import { business } from "@/content/business";

export type StoredLead = LeadPayload & {
  id: string;
  createdAt: string;
  /** Server-recalculated estimate (client numbers are never trusted). */
  estimateResult?: EstimateResult;
};

type Sink = { name: string; deliver: (lead: StoredLead) => Promise<void> };

/* ─────────── Sinks ─────────── */

const fileSink = (dir: string): Sink => ({
  name: "file",
  async deliver(lead) {
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "leads.jsonl"), JSON.stringify(lead) + "\n", { encoding: "utf8", mode: 0o600 });
  },
});

const webhookSink = (url: string, secret?: string): Sink => ({
  name: "webhook",
  async deliver(lead) {
    const body = JSON.stringify({ type: "lead.created", lead });
    const headers: Record<string, string> = { "content-type": "application/json" };
    if (secret) headers["x-nextgen-signature"] = "sha256=" + createHmac("sha256", secret).update(body).digest("hex");
    const res = await fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`webhook responded ${res.status}`);
  },
});

const resendSink = (apiKey: string, from: string, to: string[]): Sink => ({
  name: "email",
  async deliver(lead) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: lead.contact.email,
        subject: subjectFor(lead),
        text: renderText(lead),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`email provider responded ${res.status}`);
  },
});

/* ─────────── Configuration ─────────── */

export function configuredSinks(): Sink[] {
  const sinks: Sink[] = [];
  const isProd = process.env.NODE_ENV === "production";
  const list = (process.env.LEAD_SINKS ?? (isProd ? "" : "file")).split(",").map((s) => s.trim()).filter(Boolean);

  for (const name of list) {
    if (name === "file") {
      // Serverless file systems are ephemeral: in production the file sink
      // requires an explicit, persistent directory.
      const dir = process.env.LEAD_FILE_DIR ?? (isProd ? "" : path.join(process.cwd(), "data"));
      if (dir) sinks.push(fileSink(dir));
    } else if (name === "webhook" && process.env.LEAD_WEBHOOK_URL) {
      sinks.push(webhookSink(process.env.LEAD_WEBHOOK_URL, process.env.LEAD_WEBHOOK_SECRET));
    } else if (name === "email" && process.env.RESEND_API_KEY && process.env.LEAD_EMAIL_TO && process.env.LEAD_EMAIL_FROM) {
      sinks.push(resendSink(process.env.RESEND_API_KEY, process.env.LEAD_EMAIL_FROM, process.env.LEAD_EMAIL_TO.split(",").map((s) => s.trim())));
    }
  }
  return sinks;
}

export function leadsEnabled() {
  return configuredSinks().length > 0;
}

/**
 * Delivers to every configured sink. Succeeds only if at least one sink
 * accepted the lead; otherwise throws so the API can report failure honestly.
 */
export async function submitLead(payload: LeadPayload, estimateResult?: EstimateResult) {
  const sinks = configuredSinks();
  if (sinks.length === 0) throw new LeadUnavailableError();
  const lead: StoredLead = { ...payload, id: randomUUID(), createdAt: new Date().toISOString(), estimateResult };
  const results = await Promise.allSettled(sinks.map((s) => s.deliver(lead)));
  const delivered = sinks.filter((_, i) => results[i].status === "fulfilled").map((s) => s.name);
  results.forEach((r, i) => {
    // Log the failure reason only — never the lead's personal data.
    if (r.status === "rejected") console.error(`[leads] sink "${sinks[i].name}" failed for ${lead.id}:`, (r.reason as Error)?.message);
  });
  if (delivered.length === 0) throw new LeadDeliveryError();
  return { id: lead.id, delivered };
}

export class LeadUnavailableError extends Error { constructor() { super("No lead delivery channel is configured"); } }
export class LeadDeliveryError extends Error { constructor() { super("All lead delivery channels failed"); } }

/* ─────────── Rendering ─────────── */

const money = (n: number) => "$" + n.toLocaleString("en-US");

function subjectFor(lead: StoredLead) {
  if (lead.source === "contact") return `New website inquiry — ${lead.contact.name}`;
  const kind = lead.estimate.sector === "commercial" ? "Commercial" : "Residential";
  return `New ${kind} ${lead.estimate.scope} request — ${lead.contact.name}`;
}

export function renderText(lead: StoredLead) {
  const c = lead.contact;
  const lines = [
    `${business.shortName} — new website lead`,
    `Lead ID: ${lead.id}`,
    `Received: ${lead.createdAt}`,
    "",
    `Name: ${c.name}`,
    `Phone: ${c.phone}`,
    `Email: ${c.email}`,
    `Preferred contact: ${c.preferredContact}`,
    `Property address: ${c.address || "—"}`,
    `Notes: ${c.notes || "—"}`,
  ];
  if (lead.source === "contact") lines.push(`Topic: ${lead.topic}`);
  if (lead.source === "estimator") {
    lines.push("", "Estimator inputs:", JSON.stringify(lead.estimate, null, 2));
    if (lead.issues?.length) lines.push(`Reported issues: ${lead.issues.join(", ")}`);
    const r = lead.estimateResult;
    if (r?.kind === "estimate") {
      lines.push("", `Preliminary range shown: ${money(r.low)} – ${money(r.high)} (${r.pricingStatus} pricing, ${r.pricingVersion})`, "Assumptions:", ...r.assumptions.map((a) => `- ${a}`));
    } else if (r) {
      lines.push("", `Result shown: inspection required — ${r.reason}`);
    }
  }
  return lines.join("\n");
}
