"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Phone } from "@/components/ui/Icons";
import { business } from "@/content/business";

/** Sticky mobile call / estimate bar. Hidden on the estimate page (it has its own CTA) and until the visitor scrolls. */
export function MobileActionBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/estimate") return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-500 ease-[var(--ease-out-expo)] md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
      inert={!visible}
    >
      <a href={`tel:${business.phone.e164}`} className="flex h-14 items-center justify-center gap-2 font-semibold text-ink">
        <Phone className="h-4 w-4" /> Call {business.phone.display}
      </a>
      <Link href="/estimate" className="flex h-14 items-center justify-center bg-red font-semibold text-white">
        Free Estimate
      </Link>
    </div>
  );
}
