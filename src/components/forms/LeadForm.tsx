"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChoiceGroup, TextArea, TextField } from "@/components/forms/Choice";
import { ArrowRight, Check, Phone } from "@/components/ui/Icons";
import { business } from "@/content/business";

export type ContactValues = {
  name: string;
  phone: string;
  email: string;
  address: string;
  preferredContact: "phone" | "text" | "email";
  notes: string;
};

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success"; id: string } | { kind: "error"; message: string; unavailable?: boolean };

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, o: { sitekey: string; callback: (t: string) => void; "expired-callback"?: () => void }) => string } }
}

function useTurnstile() {
  const ref = useRef<HTMLDivElement>(null);
  const [token, setToken] = useState<string>();
  useEffect(() => {
    if (!TURNSTILE_KEY || !ref.current) return;
    const render = () => window.turnstile && ref.current && window.turnstile.render(ref.current, { sitekey: TURNSTILE_KEY, callback: setToken, "expired-callback": () => setToken(undefined) });
    if (window.turnstile) { render(); return; }
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = render;
    document.head.appendChild(s);
  }, []);
  return { ref, token, enabled: Boolean(TURNSTILE_KEY) };
}

export function LeadForm({
  source,
  buildPayload,
  initial,
  requireAddress,
  submitLabel = "Request My Free Inspection",
  extraFields,
  successTitle = "Request received.",
  onSuccess,
}: {
  source: "estimator" | "contact";
  buildPayload: (contact: ContactValues) => object;
  initial?: Partial<ContactValues>;
  requireAddress?: boolean;
  submitLabel?: string;
  extraFields?: React.ReactNode;
  successTitle?: string;
  onSuccess?: () => void;
}) {
  const [v, setV] = useState<ContactValues>({ name: "", phone: "", email: "", address: "", preferredContact: "phone", notes: "", ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [startedAt] = useState(() => Date.now());
  const [available, setAvailable] = useState<boolean | null>(null);
  const honeypot = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const turnstile = useTurnstile();

  useEffect(() => {
    if (initial?.address) setV((s) => (s.address ? s : { ...s, address: initial.address! }));
  }, [initial?.address]);

  useEffect(() => {
    fetch("/api/leads").then((r) => r.json()).then((d) => setAvailable(Boolean(d.enabled))).catch(() => setAvailable(null));
  }, []);

  const set = <K extends keyof ContactValues>(k: K, val: ContactValues[K]) => {
    setV((s) => ({ ...s, [k]: val }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  function validate() {
    const e: Record<string, string> = {};
    if (v.name.trim().length < 2) e.name = "Enter your full name";
    const digits = v.phone.replace(/\D/g, "");
    if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1")))) e.phone = "Enter a 10-digit phone number";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Enter a valid email address";
    if (requireAddress && v.address.trim().length < 5) e.address = "Enter the property address";
    return e;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (status.kind === "submitting") return;
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => (document.querySelector<HTMLElement>(`[data-lead-form="${source}"] [aria-invalid="true"]`))?.focus());
      return;
    }
    if (turnstile.enabled && !turnstile.token) {
      setStatus({ kind: "error", message: "Please complete the verification check." });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          payload: buildPayload(v),
          guard: { website: honeypot.current?.value ?? "", startedAt, turnstileToken: turnstile.token },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string; issues?: { path: string; message: string }[] };
      if (res.ok && data.ok && data.id) {
        setStatus({ kind: "success", id: data.id });
        onSuccess?.();
      } else {
        if (data.issues?.length) {
          const fe: Record<string, string> = {};
          for (const i of data.issues) { const k = i.path.replace(/^contact\./, ""); if (k in v) fe[k] = i.message; }
          setErrors(fe);
        }
        setStatus({ kind: "error", message: data.error ?? "We couldn't send your request.", unavailable: res.status === 503 });
      }
    } catch {
      setStatus({ kind: "error", message: "We couldn't reach our server. Check your connection and try again." });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.kind === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="border border-ink bg-white p-6 outline-none sm:p-8">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white"><Check className="h-5 w-5" /></span>
        <h3 className="mt-5 font-display text-2xl font-bold">{successTitle}</h3>
        <p className="mt-3 max-w-prose text-steel-2">
          Thank you, {v.name.split(" ")[0]}. Your request was delivered to NextGen Roofing &amp; Construction. We’ll reach out by your preferred method — {v.preferredContact === "email" ? "email" : v.preferredContact === "text" ? "text message" : "phone call"} — to schedule your free inspection.
        </p>
        <p className="mt-2 text-sm text-steel-2">Reference: <span className="font-mono">{status.id.slice(0, 8).toUpperCase()}</span></p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`tel:${business.phone.e164}`} className="btn btn-dark"><Phone /> Call {business.phone.display}</a>
          <Link href="/projects" className="btn btn-ghost">See our recent work</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate data-lead-form={source} className="space-y-5" aria-busy={status.kind === "submitting"}>
      {available === false ? (
        <div className="border-l-2 border-red bg-white p-4 text-sm">
          <p className="font-semibold">Online requests are temporarily unavailable.</p>
          <p className="mt-1 text-steel-2">Please call <a className="font-semibold text-ink underline" href={`tel:${business.phone.e164}`}>{business.phone.display}</a> to schedule your free inspection.</p>
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <TextField label="Full name" name="name" autoComplete="name" required value={v.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
        <TextField label="Phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" required value={v.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
        <TextField label="Email" name="email" type="email" autoComplete="email" required value={v.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
        <TextField label="Property address" name="address" autoComplete="street-address" required={requireAddress} optional={!requireAddress} value={v.address} onChange={(e) => set("address", e.target.value)} error={errors.address} />
      </div>

      <ChoiceGroup
        legend="Preferred contact method"
        name={`${source}-preferred`}
        columns={3}
        value={v.preferredContact}
        onChange={(val) => set("preferredContact", val)}
        options={[{ value: "phone", label: "Phone call" }, { value: "text", label: "Text message" }, { value: "email", label: "Email" }]}
      />

      {extraFields}

      <TextArea label="Project notes" optional name="notes" maxLength={2000} value={v.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Leaks, timing, access, anything we should know." />

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Leave this field empty<input ref={honeypot} type="text" name="hp_field_x" tabIndex={-1} autoComplete="new-password" defaultValue="" /></label>
      </div>

      {turnstile.enabled ? <div ref={turnstile.ref} /> : null}

      <div ref={statusRef} tabIndex={-1} aria-live="assertive" className="outline-none">
        {status.kind === "error" ? (
          <div role="alert" className="border-l-2 border-red-deep bg-white p-4 text-sm">
            <p className="font-semibold text-red-deep">{status.message}</p>
            <p className="mt-1 text-steel-2">
              {status.unavailable ? "Nothing was sent. " : "Your request was not sent. "}
              You can call us directly at <a className="font-semibold text-ink underline" href={`tel:${business.phone.e164}`}>{business.phone.display}</a>.
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn w-full sm:w-auto" disabled={status.kind === "submitting" || available === false}>
          {status.kind === "submitting" ? "Sending…" : submitLabel}
          {status.kind === "submitting" ? null : <ArrowRight className="btn-arrow h-4 w-4" />}
        </button>
        <p className="text-xs leading-relaxed text-steel-2 sm:max-w-xs">
          We use your details only to respond to this request. See our <Link className="underline" href="/privacy">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}
