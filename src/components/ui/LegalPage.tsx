export function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <section className="bg-paper pb-24 pt-32 sm:pb-32 sm:pt-40">
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow text-red-deep">Legal</p>
          <h1 className="display-lg mt-5">{title}</h1>
          <p className="mt-4 text-sm text-steel-2">Last updated {updated}</p>
          <div className="prose-legal mt-10">{children}</div>
        </div>
      </div>
    </section>
  );
}
