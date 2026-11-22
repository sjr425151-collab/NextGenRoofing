"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ArrowRight, Close, Menu, Phone } from "@/components/ui/Icons";
import { business } from "@/content/business";
import { services } from "@/content/services";

const primary = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Pages whose top section is light; the header is solid there from the start. */
const LIGHT_TOP = ["/privacy", "/terms", "/estimate", "/contact"];

export function Header() {
  const pathname = usePathname();
  const overlay = !LIGHT_TOP.includes(pathname);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const servicesRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 24);
        setHidden(y > 480 && y > last + 4);
        if (y < last - 4) setHidden(false);
        last = y;
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMenuOpen(false);
    servicesRef.current?.removeAttribute("open");
  }, [pathname]);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (menuOpen && !d.open) d.showModal();
    if (!menuOpen && d.open) d.close();
  }, [menuOpen]);

  // Close the services disclosure on outside click / Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) servicesRef.current.removeAttribute("open");
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && servicesRef.current?.open) {
        servicesRef.current.removeAttribute("open");
        servicesRef.current.querySelector("summary")?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, []);

  const solid = scrolled || !overlay;
  const light = !solid; // light text over media

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "bg-paper/92 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md" : "bg-transparent"} ${light ? "on-dark" : ""}`}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-3 sm:gap-6 lg:h-20">
          <Link href="/" className="shrink-0">
            <Logo tone={light ? "light" : "dark"} priority />
          </Link>

          <nav aria-label="Primary" className={`hidden items-center gap-1 lg:flex ${light ? "text-white" : "text-ink"}`}>
            <details ref={servicesRef} className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-1.5 px-4 py-2 text-[0.9375rem] font-medium [&::-webkit-details-marker]:hidden">
                Services
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5 transition-transform group-open:rotate-180" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.6"><path d="m2 4 4 4 4-4" /></svg>
              </summary>
              <div className="absolute left-0 top-full mt-2 w-[22rem] border border-line bg-white p-2 text-ink shadow-[0_24px_60px_-20px_rgb(0_0_0/0.35)]">
                {services.map((s) => (
                  <Link key={s.slug} href={`/${s.slug}`} className="group/item flex items-start justify-between gap-4 px-4 py-3 transition-colors hover:bg-paper">
                    <span>
                      <span className="block font-semibold">{s.title}</span>
                      <span className="mt-0.5 block text-sm leading-snug text-steel-2">{s.lede.split("—")[0].split(".")[0]}</span>
                    </span>
                    <ArrowRight className="mt-1 h-4 w-4 shrink-0 opacity-0 transition-all group-hover/item:translate-x-1 group-hover/item:opacity-100" />
                  </Link>
                ))}
              </div>
            </details>
            {primary.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={pathname.startsWith(l.href) ? "page" : undefined}
                className="relative px-4 py-2 text-[0.9375rem] font-medium after:absolute after:inset-x-4 after:bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`tel:${business.phone.e164}`}
              className={`hidden items-center gap-2 px-3 py-2 text-[0.9375rem] font-semibold md:inline-flex ${light ? "text-white" : "text-ink"}`}
            >
              <Phone className="h-4 w-4" />
              {business.phone.display}
            </a>
            <Link href="/estimate" className="btn hidden min-h-11 px-5 py-2.5 text-sm sm:inline-flex">
              Free Estimate
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`-mr-2 inline-flex h-11 w-11 shrink-0 items-center justify-center lg:hidden ${light ? "text-white" : "text-ink"}`}
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        onClose={() => setMenuOpen(false)}
        onClick={(e) => { if (e.target === dialogRef.current) setMenuOpen(false); }}
        aria-label="Site menu"
        className="on-dark m-0 h-dvh max-h-none w-full max-w-none bg-ink p-0 text-white backdrop:bg-black/60 open:flex open:flex-col"
      >
        <div className="container-x flex h-[4.5rem] shrink-0 items-center justify-between">
          <Logo tone="light" />
          <button type="button" onClick={() => setMenuOpen(false)} className="inline-flex h-11 w-11 items-center justify-center" aria-label="Close menu">
            <Close className="h-6 w-6" />
          </button>
        </div>
        <nav aria-label="Mobile" className="container-x flex-1 overflow-y-auto pb-8 pt-6">
          <p className="eyebrow text-mist">Services</p>
          <ul className="mt-4 border-t border-line-dark">
            {services.map((s) => (
              <li key={s.slug} className="border-b border-line-dark">
                <Link href={`/${s.slug}`} className="flex items-center justify-between py-4 font-display text-2xl font-semibold">
                  {s.title}
                  <ArrowRight className="h-5 w-5 text-mist" />
                </Link>
              </li>
            ))}
          </ul>
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4">
            {[{ href: "/", label: "Home" }, ...primary, { href: "/estimate", label: "Roof Estimate" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-lg font-medium text-mist hover:text-white">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="container-x grid shrink-0 grid-cols-2 gap-3 border-t border-line-dark py-5">
          <a href={`tel:${business.phone.e164}`} className="btn btn-ghost text-white"><Phone /> Call</a>
          <Link href="/estimate" className="btn">Free Estimate</Link>
        </div>
      </dialog>
    </>
  );
}
