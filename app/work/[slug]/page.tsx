import Link from "next/link";
import { Space_Mono } from "next/font/google";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default async function WorkDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");

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
          <header className="grid gap-6 fn-section p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="fn-label text-xs">
                  <span className="fn-tag">Work entry</span>
                </p>
                <h1 className="mt-3 text-3xl font-semibold uppercase text-[color:var(--fn-ink)]">
                  {title}
                </h1>
              </div>
            </div>
            <p className="text-sm text-[color:var(--fn-ink)]">
              placeholder content for now!
            </p>
          </header>

          <section className="grid gap-6 fn-section p-6">
            <div className="fn-label text-xs">
              <span className="fn-tag">Overview</span>
            </div>
            <p className="text-sm text-[color:var(--fn-ink)]">Summary</p>
            <div className="fn-rule h-px w-full" />
            <div className="grid gap-3 text-[11px] uppercase text-[color:var(--fn-margin)]">
              <span>Role: TBD</span>
              <span>Stack: TBD</span>
              <span>Timeline: TBD</span>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
