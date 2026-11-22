"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Close } from "@/components/ui/Icons";

type Item = { src: string; alt: string; caption?: string };

/** Image grid with a native <dialog> lightbox: focus-trapped, Esc to close, arrow-key navigation. */
export function Gallery({ items }: { items: Item[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [index, setIndex] = useState(0);

  const open = (i: number, el: HTMLButtonElement) => {
    opener.current = el;
    setIndex(i);
    dialog.current?.showModal();
  };
  const close = () => dialog.current?.close();
  const go = useCallback((d: number) => setIndex((i) => (i + d + items.length) % items.length), [items.length]);

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const onKey = (e: KeyboardEvent) => {
      if (!d.open) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    const onClose = () => opener.current?.focus();
    d.addEventListener("keydown", onKey);
    d.addEventListener("close", onClose);
    return () => { d.removeEventListener("keydown", onKey); d.removeEventListener("close", onClose); };
  }, [go]);

  const cur = items[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {items.map((it, i) => (
          <li key={it.src} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 70}ms` }} className={i === 0 ? "col-span-2 row-span-2" : ""}>
            <button type="button" onClick={(e) => open(i, e.currentTarget)} className="group block w-full text-left">
              <span className="sr-only">View larger: </span>
              <span className="zoom-media relative block aspect-[4/3]">
                <Image src={it.src} alt={it.alt} fill sizes={i === 0 ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 50vw"} className="object-cover" />
              </span>
              {it.caption ? <span className="mt-2 block text-sm text-steel-2">{it.caption}</span> : null}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label="Project image viewer"
        onClick={(e) => { if (e.target === dialog.current) close(); }}
        className="on-dark m-auto h-dvh max-h-none w-full max-w-none bg-ink/97 p-0 text-white backdrop:bg-black/80"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 sm:px-8">
            <p className="text-sm text-mist" aria-live="polite">{index + 1} / {items.length}{cur?.caption ? ` — ${cur.caption}` : ""}</p>
            <button type="button" onClick={close} className="inline-flex h-11 w-11 items-center justify-center" aria-label="Close image viewer"><Close className="h-6 w-6" /></button>
          </div>
          <div className="relative flex-1">
            {cur ? <Image key={cur.src} src={cur.src} alt={cur.alt} fill sizes="100vw" className="object-contain" /> : null}
          </div>
          <div className="flex items-center justify-center gap-3 py-4">
            <button type="button" onClick={() => go(-1)} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 hover:bg-white/10" aria-label="Previous image"><ArrowLeft className="h-5 w-5" /></button>
            <button type="button" onClick={() => go(1)} className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 hover:bg-white/10" aria-label="Next image"><ArrowRight className="h-5 w-5" /></button>
          </div>
        </div>
      </dialog>
    </>
  );
}
