import Link from "next/link";

type LeadershipItem = {
  title: string;
  org: string;
  time: string;
  summary: string;
  slug: string;
};

type LeadershipSectionProps = {
  items: LeadershipItem[];
  monoClassName: string;
};

export default function LeadershipSection({
  items,
  monoClassName,
}: LeadershipSectionProps) {
  return (
    <section className="grid gap-6 fn-section p-6">
      <div className="fn-label text-xs">
        <span className="fn-tag">Leadership</span>
      </div>
      <div className="grid gap-3 text-sm text-[color:var(--fn-ink)]">
        {items.map((lead) => (
          <div key={lead.title} className="fn-item bg-transparent px-3 py-2">
            <div className="flex items-center justify-between text-[11px] uppercase">
              <span className="font-semibold">{lead.title}</span>
              <span className={monoClassName}>{lead.time}</span>
            </div>
            <p className="mt-2 text-[11px] uppercase text-[color:var(--fn-margin)]">
              {lead.org}
            </p>
            <p className="mt-2 text-sm text-[color:var(--fn-ink)]">
              {lead.summary}
            </p>
            <div className="mt-2 text-[11px] uppercase">
              <Link className="fn-link" href={`/work/${lead.slug}`}>
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
