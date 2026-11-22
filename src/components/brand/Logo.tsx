/**
 * PROVISIONAL vector reconstruction of the NextGen roofline mark, traced from
 * the company yard sign visible in the supplied drone footage (three nested
 * gables, central gable window). Replace with the original logo artwork once
 * the client's logo files are supplied — see docs/OPEN-ITEMS.md.
 */
type Props = { className?: string; title?: string; variant?: "full" | "mark"; tone?: "dark" | "light" };

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 120 50" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {title ? <title>{title}</title> : null}
      <g fill="none" stroke="currentColor" strokeLinejoin="miter" strokeLinecap="butt">
        {/* side gables (behind) */}
        <polyline points="3,47 24,25 35.5,37" strokeWidth="5.5" />
        <polyline points="12.5,47 24,35 29,40.5" strokeWidth="3" />
        <polyline points="117,47 96,25 84.5,37" strokeWidth="5.5" />
        <polyline points="107.5,47 96,35 91,40.5" strokeWidth="3" />
        {/* central gable */}
        <polyline points="24,47 60,7 96,47" strokeWidth="6.5" />
        <polyline points="35,47 60,19.5 85,47" strokeWidth="3.5" />
      </g>
      <g fill="currentColor">
        <rect x="56.4" y="30.5" width="3.2" height="3.2" />
        <rect x="60.4" y="30.5" width="3.2" height="3.2" />
        <rect x="56.4" y="34.5" width="3.2" height="3.2" />
        <rect x="60.4" y="34.5" width="3.2" height="3.2" />
        <circle cx="24" cy="42" r="1.6" />
        <circle cx="96" cy="42" r="1.6" />
      </g>
    </svg>
  );
}

export function Logo({ className, variant = "full", tone = "dark" }: Props) {
  const fg = tone === "light" ? "text-white" : "text-ink";
  if (variant === "mark") return <LogoMark className={`${fg} ${className ?? ""}`} title="NextGen Roofing & Construction" />;
  return (
    <span className={`inline-flex items-center gap-3 ${fg} ${className ?? ""}`}>
      <LogoMark className="h-8 w-auto shrink-0 sm:h-9" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] font-extrabold tracking-[0.06em] sm:text-[1.3rem]">
          NEXTGEN
        </span>
        <span className={`mt-1 text-[0.56rem] font-semibold tracking-[0.2em] sm:text-[0.6rem] ${tone === "light" ? "text-mist" : "text-steel-2"}`}>
          ROOFING &amp; CONSTRUCTION
        </span>
      </span>
    </span>
  );
}
