"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Play } from "@/components/ui/Icons";

/**
 * Click-to-play drone film. Nothing is downloaded until the visitor presses
 * play, so project videos never compete with page load.
 */
export function ProjectFilm({
  base,
  poster,
  title,
  duration,
  sizes = "(min-width: 1024px) 66vw, 100vw",
  className = "",
}: { base: string; poster: string; title: string; duration?: string; sizes?: string; className?: string }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);

  return (
    <div className={`group relative aspect-video overflow-hidden bg-ink ${className}`}>
      {playing ? (
        <video
          ref={ref}
          className="absolute inset-0 h-full w-full object-cover"
          controls
          autoPlay
          muted
          playsInline
          preload="metadata"
          poster={poster}
          aria-label={`${title} — drone film`}
        >
          <source src={`${base}.webm`} type='video/webm; codecs="av01.0.05M.08"' />
          <source src={`${base}.mp4`} type="video/mp4" />
        </video>
      ) : (
        <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0 h-full w-full text-left">
          <Image src={poster} alt="" fill sizes={sizes} className="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.03]" />
          <span className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" aria-hidden />
          <span className="absolute bottom-5 left-5 flex items-center gap-4 text-white sm:bottom-7 sm:left-7">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-110 sm:h-16 sm:w-16">
              <Play className="ml-0.5 h-5 w-5" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Drone film{duration ? ` · ${duration}` : ""}</span>
              <span className="mt-1 block font-semibold">Watch the project<span className="sr-only">: {title}</span></span>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
