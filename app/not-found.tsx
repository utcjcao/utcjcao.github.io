import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen fn-page"
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[220px_1fr] lg:px-14">
        <nav className="h-fit w-full text-[11px] uppercase lg:sticky lg:top-10">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="group inline-flex w-full items-center gap-2 border-l-2 border-transparent px-3 py-2 text-left text-[11px] uppercase text-[color:var(--fn-margin)] transition-colors hover:border-[color:var(--fn-margin)] hover:bg-[color:var(--fn-highlight)] hover:text-[color:var(--fn-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--fn-rule)]"
            >
              ← Back
            </Link>
          </div>
        </nav>
        <div className="grid gap-10">
          <section className="grid gap-6 fn-section p-8">
            <div>
              <h1 className="mt-3 text-4xl font-semibold uppercase text-[color:var(--fn-ink)]">
                Page not found
              </h1>
              <p className="mt-3 text-sm text-[color:var(--fn-ink)]">
                The entry you requested is not found.
              </p>
            </div>
            <div className="fn-rule h-px w-full" />
          </section>
        </div>
      </main>
    </div>
  );
}
