import { createServer, type Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { LeadDeliveryError, submitLead } from "@/server/leads";
import type { LeadPayload } from "@/lib/leads/schema";

// Mimics a Google Apps Script web app: POST → 302 → GET returns JSON (HTTP 200 even on errors).
let server: Server; let url = ""; const received: any[] = [];
beforeAll(async () => {
  let last: any = null;
  server = createServer((req, res) => {
    if (req.method === "POST") {
      let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => {
        const body = JSON.parse(b);
        last = body.token === "good-token" ? { ok: true, id: body.lead.id } : { ok: false, error: "unauthorized" };
        if (last.ok) received.push(body);
        res.writeHead(302, { location: "/echo" }); res.end();
      });
    } else { res.writeHead(200, { "content-type": "application/json" }); res.end(JSON.stringify(last)); }
  });
  await new Promise<void>((r) => server.listen(0, r));
  url = `http://127.0.0.1:${(server.address() as any).port}/exec`;
});
afterAll(() => server.close());

const lead: LeadPayload = { source: "contact", topic: "repair", contact: { name: "Sheet Test", phone: "4195550100", email: "t@example.com", address: "", preferredContact: "phone", notes: "" } };

describe("google-sheet (Apps Script) sink", () => {
  it("delivers when the script answers ok:true (following the redirect)", async () => {
    Object.assign(process.env, { LEAD_SINKS: "google-sheet", LEAD_SHEET_WEBHOOK_URL: url, LEAD_SHEET_TOKEN: "good-token" });
    const r = await submitLead(lead);
    expect(r.delivered).toEqual(["google-sheet"]);
    expect(received[0].lead.contact.name).toBe("Sheet Test");
    expect(received[0].text).toContain("Phone: 4195550100");
  });
  it("fails honestly when the script returns HTTP 200 with ok:false", async () => {
    Object.assign(process.env, { LEAD_SINKS: "google-sheet", LEAD_SHEET_WEBHOOK_URL: url, LEAD_SHEET_TOKEN: "wrong" });
    await expect(submitLead(lead)).rejects.toBeInstanceOf(LeadDeliveryError);
  });
});
