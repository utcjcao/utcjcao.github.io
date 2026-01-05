import Link from "next/link";

type ExperienceItem = {
  company: string;
  role: string;
  time: string;
  location: string;
  summary: string;
  slug: string;
};

type ExperienceSectionProps = {
  items: ExperienceItem[];
  monoClassName: string;
};

export default function ExperienceSection({
  items,
  monoClassName,
}: ExperienceSectionProps) {
  return (
    <section className="grid gap-6 fn-section p-6">
      <div className="fn-label text-xs">
        <span className="fn-tag">Experience</span>
      </div>
      <div className="fn-item grid gap-3 text-sm text-[color:var(--fn-ink)]">
        {items.map((role) => (
          <div key={role.company} className="bg-transparent px-3 py-2">
            <div className="flex items-center justify-between text-[11px] uppercase">
              <span className="font-semibold">{role.company}</span>
              <span className={monoClassName}>{role.time}</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] uppercase text-[color:var(--fn-margin)]">
              <span>{role.role}</span>
              <span>{role.location}</span>
            </div>
            <p className="mt-2 text-sm text-[color:var(--fn-ink)]">
              {role.summary}
            </p>
            <div className="mt-2 text-[11px] uppercase">
              <Link className="fn-link" href={`/work/${role.slug}`}>
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
