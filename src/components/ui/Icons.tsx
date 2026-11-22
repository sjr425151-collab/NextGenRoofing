type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

export const ArrowRight = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
);
export const ArrowLeft = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M20 12H5M11 6l-6 6 6 6" /></svg>
);
export const ArrowUpRight = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M7 17 17 7M8 7h9v9" /></svg>
);
export const Phone = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}>
    <path d="M5 4h3.5l1.7 4.3-2.2 1.4a11 11 0 0 0 6.3 6.3l1.4-2.2L20 15.5V19a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1Z" />
  </svg>
);
export const Menu = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M3 7h18M3 12h18M3 17h12" /></svg>
);
export const Close = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const Check = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
);
export const Play = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M8 5.5v13l11-6.5z" /></svg>
);
export const Pause = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>
);
export const Star = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </svg>
);
export const Shield = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z" /><path d="m9 12 2 2 4-4" /></svg>
);
export const Info = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></svg>
);
