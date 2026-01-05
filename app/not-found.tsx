import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen fn-page"
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 py-16 sm:px-10 lg:px-14">
        <section className="grid gap-6 fn-section p-8">
          <div>
            <p className="fn-label text-xs">
              <span className="fn-tag">Field notes</span>
            </p>
            <h1 className="mt-3 text-4xl font-semibold uppercase text-[color:var(--fn-ink)]">
              Page not found
            </h1>
            <p className="mt-3 text-sm text-[color:var(--fn-ink)]">
              The entry you requested is missing from the log.
            </p>
          </div>
          <div className="fn-rule h-px w-full" />
          <div className="flex flex-wrap gap-4 text-xs uppercase">
            <Link href="/" className="fn-link">
              Back to home
            </Link>
            <Link href="/work" className="fn-link">
              Browse work
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
