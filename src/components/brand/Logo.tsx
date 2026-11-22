/* eslint-disable @next/next/no-img-element */
import { asset } from "@/lib/paths";

/**
 * Official NextGen Roofing & Construction logo artwork, extracted from the
 * client's logo sheet (Drive: IMG_0244.png) as transparent PNGs in /public/brand.
 * "on-light" variants are for light backgrounds, "on-dark" for dark ones.
 */
type Tone = "dark" | "light"; // tone = colour of the surrounding UI text: "light" → dark background

export function Logo({ className = "", tone = "dark", priority }: { className?: string; tone?: Tone; priority?: boolean }) {
  const src = tone === "light" ? "/brand/logo-horizontal-on-dark@2x.png" : "/brand/logo-horizontal-on-light@2x.png";
  return (
    <img
      src={asset(src)}
      width={603}
      height={88}
      alt="NextGen Roofing & Construction — Raising the Standard"
      decoding="async"
      loading={priority ? "eager" : "lazy"}
      className={`h-8 w-auto xs:h-9 lg:h-10 ${className}`}
    />
  );
}

export function LogoMark({ className = "", onDark = true, alt = "" }: { className?: string; onDark?: boolean; alt?: string }) {
  return (
    <img
      src={asset(onDark ? "/brand/mark-on-dark-sm.png" : "/brand/mark-on-light-sm.png")}
      width={446}
      height={140}
      alt={alt}
      aria-hidden={alt ? undefined : true}
      decoding="async"
      loading="lazy"
      className={`w-auto ${className}`}
    />
  );
}
