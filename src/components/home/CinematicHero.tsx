"use client";

import { getImageProps } from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "@/components/ui/Icons";
import Image from "@/components/ui/Img";
import { business } from "@/content/business";
import { asset } from "@/lib/paths";

export type HeroConcept = "video" | "stills";

const SCENES = ["Arrival", "Craft", "Legacy"] as const;
const GABLE_START = "polygon(50% 70%, 50% 70%, 50% 70%, 50% 70%, 50% 70%)"; // collapsed to a point
const GABLE_MID = "polygon(50% 52%, 64% 66%, 64% 84%, 36% 84%, 36% 66%)";
const GABLE_END = "polygon(50% -60%, 160% 50%, 160% 160%, -60% 160%, -60% 50%)";

/** Art-directed poster/still: desktop 16:9 and mobile portrait crops, AVIF/WebP via next/image. */
function ArtImage({
  desktop,
  mobile,
  alt,
  priority,
  className,
}: { desktop: string; mobile?: string; alt: string; priority?: boolean; className?: string }) {
  const common = { alt, fill: true, quality: 75, priority, sizes: "100vw" } as const;
  const { props: d } = getImageProps({ ...common, src: asset(desktop) });
  const m = mobile ? getImageProps({ ...common, src: asset(mobile), sizes: "100vw" }).props : null;
  return (
    <picture>
      {m ? <source media="(max-width: 767px)" srcSet={m.srcSet} sizes="100vw" /> : null}
      <source media="(min-width: 768px)" srcSet={d.srcSet} sizes="100vw" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img {...d} alt={alt} fetchPriority={priority ? "high" : undefined} className={`absolute inset-0 h-full w-full object-cover ${className ?? ""}`} />
    </picture>
  );
}

type VideoSrc = { base: string };

function pickVariant() {
  return window.matchMedia("(max-width: 767px)").matches ? "540" : "1280";
}

function shouldSkipVideo() {
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  return Boolean(c?.saveData) || (c?.effectiveType ? /(^|-)2g$/.test(c.effectiveType) : false);
}

export function CinematicHero({ concept = "video" }: { concept?: HeroConcept }) {
  const root = useRef<HTMLElement>(null);
  const vidA = useRef<HTMLVideoElement>(null);
  const vidB = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState({ a: false, b: false });
  const [paused, setPaused] = useState(false);
  const [scene, setScene] = useState(0);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const pausedRef = useRef(false);

  // ── Video loading (after first paint; skipped on Save-Data / 2G / reduced motion)
  useEffect(() => {
    if (concept !== "video") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || shouldSkipVideo()) {
      setPaused(true);
      pausedRef.current = true;
      return;
    }
    const load = () => setVideoEnabled(true);
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (document.readyState === "complete") (w.requestIdleCallback ?? setTimeout)(load, { timeout: 1200 });
    else window.addEventListener("load", () => (w.requestIdleCallback ?? setTimeout)(load, { timeout: 1200 }), { once: true });
  }, [concept]);

  useEffect(() => {
    if (!videoEnabled) return;
    const v = pickVariant();
    const set = (el: HTMLVideoElement | null, src: VideoSrc, key: "a" | "b", autoplay: boolean) => {
      if (!el || el.dataset.loaded) return;
      el.dataset.loaded = "1";
      el.innerHTML = `<source src="${asset(src.base)}-${v}.webm" type='video/webm; codecs="av01.0.05M.08"'><source src="${asset(src.base)}-${v}.mp4" type="video/mp4">`;
      el.load();
      el.addEventListener("playing", () => setVideoReady((s) => ({ ...s, [key]: true })), { once: true });
      if (autoplay && !pausedRef.current) el.play().catch(() => {});
    };
    set(vidA.current, { base: "/media/video/hero-arrival" }, "a", true);
    // Scene 2 footage loads only once the visitor starts scrolling.
    const onScroll = () => {
      set(vidB.current, { base: "/media/video/hero-detail" }, "b", false);
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [videoEnabled]);

  // ── Play only what is visible (saves battery/CPU)
  const syncPlayback = useCallback((activeScene: number) => {
    const a = vidA.current, b = vidB.current;
    if (pausedRef.current) { a?.pause(); b?.pause(); return; }
    if (a?.dataset.loaded) (activeScene === 0 ? a.play().catch(() => {}) : a.pause());
    if (b?.dataset.loaded) (activeScene === 1 ? b.play().catch(() => {}) : b.pause());
  }, []);

  const togglePause = () => {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncPlayback(scene);
  };

  // ── Scroll choreography (GSAP ScrollTrigger, scrubbed, no scroll hijacking)
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);
      const q = gsap.utils.selector(el);
      ctx = gsap.context(() => {
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom bottom",
            scrub: mobile ? 0.35 : 0.6,
            onUpdate: (self) => {
              const p = self.progress;
              const s = p < 0.36 ? 0 : p < 0.66 ? 1 : 2;
              setScene((prev) => (prev === s ? prev : s));
              syncPlayback(s);
            },
          },
        });

        // Scene 1 → out
        tl.to(q("[data-layer=a]"), { scale: 1.14, duration: 0.45 }, 0)
          .to(q("[data-s1] > *"), { yPercent: -40, opacity: 0, stagger: 0.02, duration: 0.14 }, 0.16)
          .to(q("[data-scroll-cue]"), { opacity: 0, duration: 0.05 }, 0.02);

        // Scene 2 ← in
        // Gable-shaped reveal, drawn from the roofline in the NextGen mark.
        tl.fromTo(
          q("[data-layer=b]"),
          { clipPath: GABLE_START },
          { clipPath: GABLE_MID, duration: 0.07, ease: "power2.out" },
          0.2,
        ).to(q("[data-layer=b]"), { clipPath: GABLE_END, duration: 0.2, ease: "power2.inOut" }, 0.27);
        tl.fromTo(q("[data-layer=b] [data-inner]"), { scale: 1.18 }, { scale: 1, duration: 0.42 }, 0.26)
          .fromTo(q("[data-s2] > *"), { yPercent: 50, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.03, duration: 0.12 }, 0.38)
          .to(q("[data-s2] > *"), { yPercent: -30, opacity: 0, stagger: 0.02, duration: 0.08 }, 0.6);

        // Scene 3 ← heritage panel wipes up
        tl.fromTo(q("[data-layer=c]"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2, ease: "power2.inOut" }, 0.62)
          .fromTo(q("[data-s3] [data-line]"), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.025, duration: 0.12 }, 0.72)
          .fromTo(q("[data-lineage-bar]"), { scaleX: 0 }, { scaleX: 1, duration: 0.14 }, 0.78)
          .to({}, { duration: 0.08 }, 0.92); // hold

        tl.fromTo(q("[data-progress]"), { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
      }, el);
      ScrollTrigger.refresh();
    })();

    const onChange = () => window.location.reload();
    reduce.addEventListener?.("change", onChange);
    return () => {
      cancelled = true;
      ctx?.revert();
      reduce.removeEventListener?.("change", onChange);
    };
  }, [concept, syncPlayback]);

  const stillsA = { desktop: "/media/stills/hip-roof-vents.jpg", mobile: undefined };
  const stillsB = { desktop: "/media/stills/farmhouse-ridge-detail.jpg", mobile: undefined };

  return (
    <section ref={root} aria-label="Introduction" className="cine on-dark relative bg-ink text-white" data-concept={concept}>
      <div className="cine-stage sticky top-0 h-svh min-h-[34rem] overflow-hidden">
        {/* ── Layer A: arrival */}
        <div data-layer="a" className="absolute inset-0 will-change-transform">
          {concept === "video" ? (
            <ArtImage desktop="/media/stills/hero-arrival-poster.jpg" mobile="/media/stills/hero-arrival-poster-540.jpg" alt="" priority className="cine-kenburns" />
          ) : (
            <ArtImage desktop={stillsA.desktop} alt="" priority className="cine-kenburns" />
          )}
          {concept === "video" ? (
            <video
              ref={vidA}
              muted
              playsInline
              loop
              preload="none"
              aria-hidden
              tabIndex={-1}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoReady.a ? "opacity-100" : "opacity-0"}`}
            />
          ) : null}
        </div>

        {/* ── Layer B: craftsmanship */}
        <div data-layer="b" className="absolute inset-0" style={{ clipPath: GABLE_START }}>
          <div data-inner className="absolute inset-0 will-change-transform">
            {concept === "video" ? (
              <>
                <ArtImage desktop="/media/stills/hero-detail-poster.jpg" mobile="/media/stills/hero-detail-poster-540.jpg" alt="" />
                <video
                  ref={vidB}
                  muted
                  playsInline
                  loop
                  preload="none"
                  aria-hidden
                  tabIndex={-1}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoReady.b ? "opacity-100" : "opacity-0"}`}
                />
              </>
            ) : (
              <ArtImage desktop={stillsB.desktop} alt="" />
            )}
          </div>
        </div>

        {/* Atmosphere */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_100%,rgb(17_18_20/0.88)_0%,rgb(17_18_20/0.55)_45%,rgb(17_18_20/0.15)_100%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink/70 to-transparent" aria-hidden />
        <div className="arch-lines-dark pointer-events-none absolute inset-0 opacity-60" aria-hidden />

        {/* ── Scene 1 copy */}
        <div className="container-x relative flex h-full flex-col justify-end pb-[max(5.5rem,12vh)] pt-28 md:pb-[14vh]">
          <div data-s1 className="max-w-4xl">
            <p className="eyebrow cine-in text-white/80" style={{ ["--d" as string]: "100ms" }}>
              Toledo, Ohio · Residential &amp; Commercial Roofing
            </p>
            <h1 className="display-xl cine-rise mt-5" style={{ ["--d" as string]: "180ms" }}>
              Raising the<br /> Standard.
            </h1>
            <p className="lede cine-in mt-6 max-w-xl text-white/85" style={{ ["--d" as string]: "300ms" }}>
              Built on experience. Driven by the next generation.
            </p>
            <div className="cine-in mt-9 flex flex-col gap-3 xs:flex-row" style={{ ["--d" as string]: "420ms" }}>
              <Link href="/estimate" className="btn">
                Get Your Roof Estimate <ArrowRight className="btn-arrow h-4 w-4" />
              </Link>
              <Link href="/projects" className="btn btn-ghost text-white">
                Explore Our Work
              </Link>
            </div>
          </div>
        </div>

        {/* ── Scene 2 copy */}
        <div className="cine-scene2 pointer-events-none absolute inset-0 flex items-end md:items-center">
          <div className="container-x pb-[max(6rem,14vh)] md:pb-0">
            <div data-s2 className="ml-auto max-w-xl md:mr-[4vw]">
              <p className="eyebrow text-white/80 opacity-0">Craftsmanship</p>
              <h2 className="display-lg mt-5 opacity-0">Precision in<br /> every detail.</h2>
              <p className="lede mt-5 max-w-md text-white/85 opacity-0">
                Straight courses, sealed ridges, clean flashing. The details you see from the air are the ones that keep water out.
              </p>
            </div>
          </div>
        </div>

        {/* ── Layer C / Scene 3: heritage */}
        <div data-layer="c" className="cine-scene3 absolute inset-0 bg-paper text-ink" style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
          <div className="arch-lines pointer-events-none absolute inset-0 opacity-70" aria-hidden />
          <div data-s3 className="container-x relative grid h-full content-center gap-10 pb-10 pt-20 md:grid-cols-12 md:gap-12 md:py-24">
            <div className="md:col-span-7">
              <p data-line className="eyebrow text-red-deep">Second generation</p>
              <h2 data-line className="display-lg mt-4 md:mt-5">A legacy built<br /> to last.</h2>
              <p data-line className="lede mt-5 max-w-xl text-steel-2 md:mt-6">
                NextGen founder {business.founder.name} learned roofing from his father, {business.family.fatherName}, who has run {business.family.fatherCompany} for {business.family.fatherYears}. The name says the rest: the next generation of that work, under a new company.
              </p>
              <div data-line className="mt-8 flex flex-wrap gap-3">
                <Link href="/about" className="btn btn-dark">Our story <ArrowRight className="btn-arrow h-4 w-4" /></Link>
                <Link href="#estimator" className="btn btn-ghost">Start an estimate</Link>
              </div>
            </div>
            <div className="hidden md:col-span-5 md:block md:pl-6">
              {business.familyPhoto ? (
                <figure data-line className="ml-auto max-w-sm">
                  <div className="relative aspect-[3/4] max-h-[58vh] overflow-hidden bg-paper-2">
                    <Image src={business.familyPhoto.src} alt={business.familyPhoto.alt} fill sizes="(min-width: 768px) 24rem, 0px" className="object-cover" />
                  </div>
                  <span data-lineage-bar aria-hidden className="mt-4 block h-0.5 w-16 origin-left bg-red" />
                  <figcaption className="mt-3 text-sm leading-relaxed text-steel-2">
                    <span className="font-semibold text-ink">{business.founder.name} &amp; {business.family.fatherName}.</span> First generation: {business.family.fatherCompany}. Next generation: NextGen.
                  </figcaption>
                </figure>
              ) : null}
            </div>
          </div>
        </div>

        {/* ── Chrome: progress, scene labels, pause */}
        <div className="cine-chrome pointer-events-none absolute bottom-6 left-0 right-0 z-10 hidden md:block" aria-hidden>
          <div className="container-x flex items-end justify-between">
            <div className={`flex items-center gap-6 text-xs font-semibold uppercase tracking-[0.18em] transition-colors duration-500 ${scene === 2 ? "text-ink/60" : "text-white/60"}`}>
              {SCENES.map((s, i) => (
                <span key={s} className={`transition-colors duration-500 ${scene === i ? (scene === 2 ? "text-ink" : "text-white") : ""}`}>
                  0{i + 1} {s}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="cine-chrome absolute bottom-0 left-0 top-0 z-10 hidden w-px bg-white/10 md:block" aria-hidden>
          <span data-progress className="block h-full w-px origin-top scale-y-0 bg-red" />
        </div>
        <div data-scroll-cue aria-hidden className="cine-chrome pointer-events-none absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/70 md:flex">
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-white/20"><span className="cine-cue absolute inset-x-0 top-0 h-4 bg-white" /></span>
        </div>

        {concept === "video" ? (
          <button
            type="button"
            onClick={togglePause}
            className={`absolute right-4 top-[5.5rem] z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border backdrop-blur transition-opacity duration-500 md:right-8 lg:top-28 ${
              scene === 2 ? "pointer-events-none opacity-0" : "opacity-100"
            } border-white/30 bg-black/20 text-white hover:bg-black/40`}
            aria-label={paused ? "Play background video" : "Pause background video"}
            aria-pressed={paused}
            tabIndex={scene === 2 ? -1 : 0}
          >
            {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
          </button>
        ) : null}
      </div>
    </section>
  );
}
