"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChoiceGroup, TextField, type ChoiceOption } from "@/components/forms/Choice";
import { LeadForm } from "@/components/forms/LeadForm";
import { ArrowLeft, ArrowRight, Info, Phone } from "@/components/ui/Icons";
import { business } from "@/content/business";
import type { EstimateInput, EstimateResult } from "@/lib/estimator/schema";

type Sector = "residential" | "commercial";
type Scope = "replacement" | "repair" | "new";
type AreaMethod = "roof" | "home" | "bucket";

type State = {
  sector?: Sector;
  scope?: Scope;
  material?: string;
  system?: string;
  zip: string;
  address: string;
  areaMethod: AreaMethod;
  areaSqft: string;
  bucket?: "s" | "m" | "l" | "xl";
  pitch?: string;
  stories?: string;
  complexity?: string;
  tearOff?: string;
  slope?: string;
  condition?: string;
  access?: string;
  cComplexity?: string;
  cTearOff?: string;
  issues: string[];
};

const STEPS = ["Project", "Roof details", "Your estimate"] as const;

const U = { value: "unsure", label: "I’m not sure" } as const;

const resMaterials: ChoiceOption<string>[] = [
  { value: "architectural", label: "Architectural shingle", hint: "Most common, dimensional asphalt" },
  { value: "premium", label: "Premium shingle", hint: "Designer / high-profile lines" },
  { value: "metal", label: "Standing-seam metal" },
  { value: "low-slope", label: "Low-slope membrane", hint: "Flat porches, additions" },
  { ...U, hint: "We’ll price the most common option" },
];
const comSystems: ChoiceOption<string>[] = [
  { value: "epdm", label: "EPDM", hint: "Rubber membrane" },
  { value: "tpo", label: "TPO", hint: "Reflective, heat-welded" },
  { value: "self-adhering", label: "Self-adhering", hint: "Flame-free modified bitumen" },
  { value: "torch-down", label: "Torch-down", hint: "Heat-fused modified bitumen" },
  { value: "spf", label: "Spray foam (SPF)", hint: "Seamless, insulating" },
  { value: "coating", label: "Roof coating", hint: "Restores a sound roof" },
  { ...U, hint: "We’ll show a range across common systems" },
];
const issueOptions = ["Active leak", "Missing or damaged shingles", "Flashing / chimney", "Storm damage", "Flat roof ponding or blistering", "Other"];

function initialState(preset?: { sector?: Sector; scope?: Scope }): State {
  return { sector: preset?.sector, scope: preset?.scope, zip: "", address: "", areaMethod: "home", areaSqft: "", issues: [] };
}

const money = (n: number) => "$" + n.toLocaleString("en-US");

export function RoofEstimator({ preset, headingLevel = 2 }: { preset?: { sector?: Sector; scope?: Scope }; headingLevel?: 2 | 3 }) {
  const [s, setS] = useState<State>(() => initialState(preset));
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [mode, setMode] = useState<string>();
  const [disclaimer, setDisclaimer] = useState<string>("");
  const [apiError, setApiError] = useState<string>();
  const [submitted, setSubmitted] = useState(false);
  const stepHeading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const H = (headingLevel === 2 ? "h3" : "h4") as "h3";

  const set = <K extends keyof State>(k: K, v: State[K]) => {
    setS((p) => ({ ...p, [k]: v }));
    if (errors[k as string]) setErrors((e) => ({ ...e, [k as string]: "" }));
  };

  useEffect(() => {
    fetch("/api/estimate").then((r) => r.json()).then((d) => { setMode(d.mode); setDisclaimer(d.disclaimer); }).catch(() => {});
  }, []);

  // Move focus to the step heading on step change (not on first render)
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    stepHeading.current?.focus({ preventScroll: true });
    const top = stepHeading.current?.closest("[data-estimator]")?.getBoundingClientRect().top;
    if (top !== undefined && top < 0) stepHeading.current?.closest("[data-estimator]")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const isRepair = s.scope === "repair";

  function validateStep(i: number) {
    const e: Record<string, string> = {};
    if (i === 0) {
      if (!s.sector) e.sector = "Choose a property type";
      if (!s.scope) e.scope = "Choose the type of work";
      if (!isRepair && s.sector === "residential" && !s.material) e.material = "Choose a material, or “I’m not sure”";
      if (!isRepair && s.sector === "commercial" && !s.system) e.system = "Choose a system, or “I’m not sure”";
      if (!/^\d{5}$/.test(s.zip)) e.zip = "Enter a 5-digit ZIP code";
    }
    if (i === 1 && !isRepair) {
      if (s.areaMethod === "bucket" ? !s.bucket : !(Number(s.areaSqft) > 0)) e.area = s.areaMethod === "bucket" ? "Choose a size range" : "Enter an approximate square footage";
      const n = Number(s.areaSqft);
      if (s.areaMethod !== "bucket" && n > 0) {
        if (s.areaMethod === "roof" && (n < 100 || n > 1_000_000)) e.area = "Enter a roof area between 100 and 1,000,000 sq ft";
        if (s.areaMethod === "home" && s.sector === "residential" && (n < 300 || n > 20_000)) e.area = "Enter a home size between 300 and 20,000 sq ft";
        if (s.areaMethod === "home" && s.sector === "commercial" && (n < 100 || n > 1_000_000)) e.area = "Enter a footprint between 100 and 1,000,000 sq ft";
      }
      if (s.sector === "residential") {
        if (!s.pitch) e.pitch = "Choose a pitch, or “I’m not sure”";
        if (!s.stories) e.stories = "Choose the number of stories";
        if (!s.complexity) e.complexity = "Choose a roof shape";
        if (s.scope !== "new" && !s.tearOff) e.tearOff = "Choose an option";
      } else {
        if (!s.slope) e.slope = "Choose an option";
        if (!s.condition) e.condition = "Choose an option";
        if (s.scope !== "new" && s.system !== "coating" && !s.cTearOff) e.cTearOff = "Choose an option";
        if (!s.access) e.access = "Choose an option";
        if (!s.cComplexity) e.cComplexity = "Choose an option";
      }
    }
    setErrors(e);
    if (Object.keys(e).length) {
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[data-estimator] [aria-invalid='true'] input, [data-estimator] input[aria-invalid='true']")?.focus());
      return false;
    }
    return true;
  }

  const input = useMemo<EstimateInput | null>(() => {
    if (!s.sector || !s.scope) return null;
    const n = Number(s.areaSqft);
    const area =
      s.areaMethod === "bucket" ? { method: "bucket" as const, bucket: s.bucket ?? "m" } : { method: s.areaMethod, sqft: n > 0 ? n : 2000 };
    if (s.sector === "residential") {
      return {
        sector: "residential", scope: s.scope, zip: s.zip, address: s.address, area,
        material: (s.material ?? "unsure") as never, pitch: (s.pitch ?? "unsure") as never, stories: (s.stories ?? "unsure") as never,
        complexity: (s.complexity ?? "unsure") as never, tearOff: (s.scope === "new" ? "none" : s.tearOff ?? "unsure") as never,
      };
    }
    return {
      sector: "commercial", scope: s.scope, zip: s.zip, address: s.address, area,
      system: (s.system ?? "unsure") as never, slope: (s.slope ?? "unsure") as never, condition: (s.condition ?? "unsure") as never,
      tearOff: (s.cTearOff ?? "unsure") as never, access: (s.access ?? "unsure") as never, complexity: (s.cComplexity ?? "unsure") as never,
    };
  }, [s]);

  async function next() {
    if (!validateStep(step)) return;
    if (step === 0 && isRepair) return calculate(); // repairs skip roof measurements
    if (step === 1) return calculate();
    setStep((x) => x + 1);
  }

  async function calculate() {
    if (!input) return;
    setLoading(true);
    setApiError(undefined);
    try {
      const res = await fetch("/api/estimate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setResult(data.result);
      setMode(data.mode);
      setDisclaimer(data.disclaimer);
      setStep(2);
    } catch (err) {
      setApiError((err as Error).message || "We couldn't calculate an estimate right now.");
    } finally {
      setLoading(false);
    }
  }

  function back() {
    setErrors({});
    setStep((x) => (x === 2 && isRepair ? 0 : Math.max(0, x - 1)));
  }

  function restart() {
    setS(initialState(preset));
    setResult(null);
    setSubmitted(false);
    setStep(0);
  }

  const areaLabel =
    s.sector === "commercial"
      ? { roof: "Roof area", home: "Building footprint", bucket: "Size range" }
      : { roof: "Roof area", home: "Home living space", bucket: "Not sure" };

  return (
    <div data-estimator className="relative scroll-mt-24 border border-line bg-paper-2/60">
      {/* Stepper */}
      <ol className="grid grid-cols-3 border-b border-line bg-white" aria-label="Estimate progress">
        {STEPS.map((label, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li key={label} aria-current={state === "current" ? "step" : undefined} className="relative px-3 py-4 sm:px-6">
              <span className={`absolute inset-x-0 top-0 h-0.5 origin-left bg-red transition-transform duration-700 ease-[var(--ease-out-expo)] ${state === "todo" ? "scale-x-0" : "scale-x-100"}`} />
              <span className={`block text-[0.6875rem] font-semibold uppercase tracking-[0.16em] ${state === "todo" ? "text-steel-2" : "text-red-deep"}`}>Step {i + 1}<span className="sr-only"> of 3{state === "done" ? ", completed" : ""}</span></span>
              <span className={`mt-1 block text-sm font-semibold sm:text-base ${state === "todo" ? "text-steel-2" : "text-ink"}`}>{label}</span>
            </li>
          );
        })}
      </ol>

      <div className="p-5 sm:p-8 lg:p-10">
        {/* STEP 1 */}
        {step === 0 ? (
          <div className="space-y-8">
            <H ref={stepHeading} tabIndex={-1} className="font-display text-2xl font-bold tracking-tight outline-none sm:text-3xl">Tell us about the project</H>
            <ChoiceGroup legend="Property type" name="sector" value={s.sector} error={errors.sector}
              onChange={(v) => { set("sector", v); set("material", undefined); set("system", undefined); }}
              options={[{ value: "residential", label: "Residential", hint: "Houses, garages, townhomes" }, { value: "commercial", label: "Commercial", hint: "Business, industrial, multi-unit" }]} />
            <ChoiceGroup legend="Type of work" name="scope" columns={3} value={s.scope} error={errors.scope} onChange={(v) => set("scope", v)}
              options={[{ value: "replacement", label: "Replacement", hint: "Remove & replace the roof" }, { value: "repair", label: "Repair", hint: "Leaks, damage, flashing" }, { value: "new", label: "New installation", hint: "New build or addition" }]} />
            {s.sector === "residential" && s.scope && !isRepair ? (
              <ChoiceGroup legend="Roofing material" name="material" columns={3} value={s.material} error={errors.material} onChange={(v) => set("material", v)} options={resMaterials} />
            ) : null}
            {s.sector === "commercial" && s.scope && !isRepair ? (
              <ChoiceGroup legend="Roof system" name="system" columns={4} value={s.system} error={errors.system} onChange={(v) => set("system", v)} options={comSystems} />
            ) : null}
            <div className="grid gap-5 sm:grid-cols-[minmax(0,12rem)_1fr]">
              <TextField label="Property ZIP code" name="zip" inputMode="numeric" autoComplete="postal-code" maxLength={5} value={s.zip} onChange={(e) => set("zip", e.target.value.replace(/\D/g, "").slice(0, 5))} error={errors.zip} />
              <TextField label="Property address" optional name="est-address" autoComplete="street-address" value={s.address} onChange={(e) => set("address", e.target.value)} hint="Helps us prepare for your inspection." />
            </div>
          </div>
        ) : null}

        {/* STEP 2 */}
        {step === 1 ? (
          <div className="space-y-8">
            <H ref={stepHeading} tabIndex={-1} className="font-display text-2xl font-bold tracking-tight outline-none sm:text-3xl">
              {s.sector === "commercial" ? "About the roof" : "About your roof"}
            </H>

            <fieldset className="min-w-0">
              <legend className="field-label">Approximate size</legend>
              <div className="mb-4 inline-flex w-full flex-wrap gap-1 border border-line bg-white p-1 sm:w-auto" role="radiogroup" aria-label="How would you like to describe the size?">
                {(["home", "roof", "bucket"] as AreaMethod[]).map((m) => (
                  <button key={m} type="button" role="radio" aria-checked={s.areaMethod === m}
                    onClick={() => { set("areaMethod", m); setErrors((e) => ({ ...e, area: "" })); }}
                    className={`min-h-11 flex-1 px-4 text-sm font-semibold transition-colors sm:flex-none ${s.areaMethod === m ? "bg-ink text-white" : "text-steel-2 hover:text-ink"}`}>
                    {areaLabel[m]}
                  </button>
                ))}
              </div>
              {s.areaMethod === "bucket" ? (
                <ChoiceGroup legend={s.sector === "commercial" ? "Approximate building size" : "Approximate home size (living space)"} name="bucket" columns={4} value={s.bucket} error={errors.area} onChange={(v) => set("bucket", v)}
                  options={s.sector === "commercial"
                    ? [{ value: "s", label: "Under 5,000 sq ft" }, { value: "m", label: "5,000–15,000 sq ft" }, { value: "l", label: "15,000–40,000 sq ft" }, { value: "xl", label: "Over 40,000 sq ft" }]
                    : [{ value: "s", label: "Under 1,500 sq ft" }, { value: "m", label: "1,500–2,500 sq ft" }, { value: "l", label: "2,500–3,500 sq ft" }, { value: "xl", label: "Over 3,500 sq ft" }]} />
              ) : (
                <div className="max-w-xs">
                  <TextField
                    label={s.areaMethod === "roof" ? "Roof surface area (sq ft)" : s.sector === "commercial" ? "Building footprint (sq ft)" : "Home living space (sq ft)"}
                    name="area" inputMode="numeric" value={s.areaSqft}
                    onChange={(e) => { set("areaSqft", e.target.value.replace(/[^\d]/g, "").slice(0, 7)); setErrors((x) => ({ ...x, area: "" })); }}
                    error={errors.area}
                    hint={s.areaMethod === "roof" ? "1 roofing “square” = 100 sq ft." : undefined}
                  />
                </div>
              )}
              {s.sector === "residential" && s.areaMethod !== "roof" ? (
                <p className="mt-4 flex max-w-2xl gap-3 border-l-2 border-ink/20 bg-white/70 p-4 text-sm leading-relaxed text-steel-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                  <span><strong className="text-ink">Your home’s square footage isn’t your roof area.</strong> A two-story home has a smaller footprint than its living space, while overhangs and pitch make the roof larger than the footprint. We convert for you and widen the range to reflect that uncertainty.</span>
                </p>
              ) : null}
            </fieldset>

            {s.sector === "residential" ? (
              <>
                <ChoiceGroup legend="Roof pitch" name="pitch" columns={3} value={s.pitch} error={errors.pitch} onChange={(v) => set("pitch", v)} description="How steep is the roof?"
                  options={[{ value: "low", label: "Low", hint: "Nearly flat; easy to walk" }, { value: "medium", label: "Moderate", hint: "Typical; walkable with care" }, { value: "steep", label: "Steep", hint: "Hard to stand on" }, { value: "very-steep", label: "Very steep", hint: "Near-vertical sections" }, U]} />
                <ChoiceGroup legend="Number of stories" name="stories" columns={4} value={s.stories} error={errors.stories} onChange={(v) => set("stories", v)}
                  options={[{ value: "1", label: "One" }, { value: "2", label: "Two" }, { value: "3", label: "Three +" }, U]} />
                <ChoiceGroup legend="Roof shape" name="complexity" columns={4} value={s.complexity} error={errors.complexity} onChange={(v) => set("complexity", v)}
                  options={[{ value: "simple", label: "Simple", hint: "One or two planes" }, { value: "moderate", label: "Moderate", hint: "Some hips or valleys" }, { value: "complex", label: "Complex", hint: "Many angles, dormers" }, U]} />
                {s.scope !== "new" ? (
                  <ChoiceGroup legend="Existing layers to remove" name="tearOff" columns={4} value={s.tearOff} error={errors.tearOff} onChange={(v) => set("tearOff", v)}
                    options={[{ value: "one", label: "One layer" }, { value: "two", label: "Two layers" }, { value: "none", label: "None", hint: "Deck already bare" }, U]} />
                ) : null}
              </>
            ) : (
              <>
                <ChoiceGroup legend="Roof configuration" name="slope" columns={3} value={s.slope} error={errors.slope} onChange={(v) => set("slope", v)}
                  options={[{ value: "flat", label: "Flat" }, { value: "low-slope", label: "Low-slope" }, U]} />
                <ChoiceGroup legend="Existing roof condition" name="condition" columns={4} value={s.condition} error={errors.condition} onChange={(v) => set("condition", v)}
                  options={[{ value: "good", label: "Good", hint: "Aging, no leaks" }, { value: "fair", label: "Fair", hint: "Minor leaks or wear" }, { value: "poor", label: "Poor", hint: "Active leaks, damage" }, U]} />
                {s.scope !== "new" && s.system !== "coating" ? (
                  <ChoiceGroup legend="Tear-off or overlay" name="cTearOff" columns={3} value={s.cTearOff} error={errors.cTearOff} onChange={(v) => set("cTearOff", v)}
                    options={[{ value: "tear-off", label: "Tear-off", hint: "Remove existing roof" }, { value: "overlay", label: "Overlay", hint: "Recover over existing" }, U]} />
                ) : null}
                <ChoiceGroup legend="Roof access" name="access" columns={4} value={s.access} error={errors.access} onChange={(v) => set("access", v)}
                  options={[{ value: "easy", label: "Easy", hint: "Low, open site" }, { value: "moderate", label: "Moderate" }, { value: "difficult", label: "Difficult", hint: "Tall, tight, or occupied" }, U]} />
                <ChoiceGroup legend="Rooftop complexity" name="cComplexity" columns={4} value={s.cComplexity} error={errors.cComplexity} onChange={(v) => set("cComplexity", v)}
                  options={[{ value: "low", label: "Low", hint: "Few penetrations" }, { value: "moderate", label: "Moderate" }, { value: "high", label: "High", hint: "Many units, curbs, drains" }, U]} />
              </>
            )}
          </div>
        ) : null}

        {/* Repair: issues on step 1 */}
        {step === 0 && isRepair ? (
          <fieldset className="mt-8 min-w-0">
            <legend className="field-label">What are you seeing? <span className="font-normal text-steel-2">(optional)</span></legend>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {issueOptions.map((o) => (
                <label key={o} className="option-card">
                  <input type="checkbox" checked={s.issues.includes(o)} onChange={(e) => set("issues", e.target.checked ? [...s.issues, o] : s.issues.filter((x) => x !== o))} />
                  <span className="pr-5 font-semibold">{o}</span>
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        {/* STEP 3 */}
        {step === 2 && result ? (
          <div className="space-y-10">
            <div aria-live="polite">
              <H ref={stepHeading} tabIndex={-1} className="font-display text-2xl font-bold tracking-tight outline-none sm:text-3xl">
                {result.kind === "estimate" ? "Your preliminary estimate" : "Let’s look at it in person"}
              </H>
              {result.kind === "estimate" ? (
                <EstimateReveal result={result} demo={mode === "demo"} />
              ) : (
                <div className="mt-6 border border-line bg-white p-6 sm:p-8">
                  <p className="eyebrow text-red-deep">Free inspection recommended</p>
                  <p className="lede mt-4 max-w-2xl">{result.reason}</p>
                </div>
              )}
            </div>

            <ProjectSummary s={s} />

            {result.kind === "estimate" ? (
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">Assumptions</h4>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                    {result.assumptions.map((a) => <li key={a} className="flex gap-2"><span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-ink" />{a}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">What can change the price</h4>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                    {result.variationFactors.map((a) => <li key={a} className="flex gap-2"><span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-red" />{a}</li>)}
                  </ul>
                </div>
              </div>
            ) : null}

            <p className="border-t border-line pt-5 text-xs leading-relaxed text-steel-2">{disclaimer}</p>

            <div className="border-t-2 border-ink pt-8">
              <h4 className="font-display text-2xl font-bold tracking-tight">{submitted ? "" : "Request your free inspection"}</h4>
              {!submitted ? <p className="mt-2 max-w-xl text-steel-2">We’ll look at the roof in person and give you an estimate based on actual measurements. Your selections above are included with your request.</p> : null}
              <div className="mt-6">
                <LeadForm
                  source="estimator"
                  requireAddress
                  initial={{ address: s.address }}
                  onSuccess={() => setSubmitted(true)}
                  buildPayload={(contact) => ({ source: "estimator", contact, estimate: input, issues: s.issues })}
                />
              </div>
            </div>
          </div>
        ) : null}

        {apiError ? (
          <div role="alert" className="mt-6 border-l-2 border-red-deep bg-white p-4 text-sm">
            <p className="font-semibold text-red-deep">{apiError}</p>
            <p className="mt-1 text-steel-2">You can also call <a className="font-semibold text-ink underline" href={`tel:${business.phone.e164}`}>{business.phone.display}</a>.</p>
          </div>
        ) : null}

        {/* Nav */}
        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 && !submitted ? (
            <button type="button" onClick={back} className="btn btn-ghost"><ArrowLeft /> Back</button>
          ) : step === 2 ? (
            <button type="button" onClick={restart} className="btn btn-ghost">Start a new estimate</button>
          ) : (
            <a href={`tel:${business.phone.e164}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-steel-2 hover:text-ink"><Phone /> Prefer to talk? {business.phone.display}</a>
          )}
          {step < 2 ? (
            <button type="button" onClick={next} className="btn" disabled={loading}>
              {loading ? "Calculating…" : step === 1 || isRepair ? "See my estimate" : "Continue"}
              {loading ? null : <ArrowRight className="btn-arrow h-4 w-4" />}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function EstimateReveal({ result, demo }: { result: Extract<EstimateResult, { kind: "estimate" }>; demo: boolean }) {
  const [shown, setShown] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(t); }, []);
  const anim = (d: number) => ({ transitionDelay: `${d}ms` });
  const base = "inline-block transition-[transform,opacity] duration-[1100ms] ease-[var(--ease-out-expo)]";
  return (
    <div className="on-dark relative mt-6 overflow-hidden bg-ink p-6 text-white sm:p-10">
      <div className="arch-lines-dark pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="eyebrow text-mist">Estimated project range</p>
          {demo ? (
            <span className="inline-flex items-center gap-2 border border-amber-300/50 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
              Demonstration pricing — not NextGen rates
            </span>
          ) : null}
        </div>
        <p className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display font-bold tracking-[-0.04em]">
          <span className="overflow-hidden"><span className={`${base} text-[clamp(2.5rem,8vw,5rem)] leading-none ${shown ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`} style={anim(0)}>{money(result.low)}</span></span>
          <span className={`${base} text-3xl text-mist ${shown ? "opacity-100" : "opacity-0"}`} style={anim(200)} aria-hidden>–</span>
          <span className="sr-only"> to </span>
          <span className="overflow-hidden"><span className={`${base} text-[clamp(2.5rem,8vw,5rem)] leading-none ${shown ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`} style={anim(120)}>{money(result.high)}</span></span>
        </p>
        <div className="mt-8 h-px w-full bg-white/15">
          <div className={`h-px origin-left bg-red transition-transform duration-[1400ms] ease-[var(--ease-out-expo)] ${shown ? "scale-x-100" : "scale-x-0"}`} style={anim(300)} />
        </div>
        <p className="mt-4 text-sm text-mist">
          Based on roughly {result.roofAreaSqft.low === result.roofAreaSqft.high
            ? `${result.roofAreaSqft.low.toLocaleString()} sq ft`
            : `${result.roofAreaSqft.low.toLocaleString()}–${result.roofAreaSqft.high.toLocaleString()} sq ft`} of roof surface. A preliminary range, not a quote.
        </p>
      </div>
    </div>
  );
}

function ProjectSummary({ s }: { s: State }) {
  const rows: [string, string][] = [
    ["Property", s.sector === "commercial" ? "Commercial" : "Residential"],
    ["Work", s.scope === "new" ? "New installation" : s.scope === "repair" ? "Repair" : "Replacement"],
  ];
  if (s.scope !== "repair") {
    if (s.sector === "residential") rows.push(["Material", resMaterials.find((o) => o.value === s.material)?.label ?? "—"]);
    else rows.push(["System", comSystems.find((o) => o.value === s.system)?.label ?? "—"]);
  }
  rows.push(["ZIP", s.zip]);
  if (s.issues.length) rows.push(["Reported", s.issues.join(", ")]);
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-steel-2">Your selections</h4>
      <dl className="mt-3 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4">
        {rows.map(([k, v]) => (
          <div key={k} className="bg-white p-4">
            <dt className="text-xs text-steel-2">{k}</dt>
            <dd className="mt-1 font-semibold">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
