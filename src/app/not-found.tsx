import Link from "next/link";
import { ArrowRight } from "@/components/ui/Icons";
import { business } from "@/content/business";

export default function NotFound() {
  return (
    <section className="on-dark flex min-h-[80svh] items-center bg-ink pt-24 text-white">
      <div className="container-x">
        <p className="eyebrow text-mist">404</p>
        <h1 className="display-lg mt-5 max-w-2xl">This page isn’t here.</h1>
        <p className="lede mt-6 max-w-xl text-mist">It may have moved. Head home, or call us at {business.phone.display}.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn">Back to home <ArrowRight className="btn-arrow h-4 w-4" /></Link>
          <Link href="/estimate" className="btn btn-ghost text-white">Get an estimate</Link>
        </div>
      </div>
    </section>
  );
}
