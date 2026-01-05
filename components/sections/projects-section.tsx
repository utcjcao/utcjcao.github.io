import Link from "next/link";

type ProjectItem = {
  title: string;
  role: string;
  summary: string;
  time: string;
  slug: string;
};

type ProjectsSectionProps = {
  items: ProjectItem[];
  monoClassName: string;
};

export default function ProjectsSection({
  items,
  monoClassName,
}: ProjectsSectionProps) {
  return (
    <section className="grid gap-6 fn-section p-6">
      <div className="fn-label text-xs">
        <span className="fn-tag">Projects</span>
      </div>
      <div className="grid gap-3 text-sm text-[color:var(--fn-ink)]">
        {items.map((project) => (
          <div
            key={project.title}
            className="fn-item bg-transparent px-3 py-2 first:border-t-0"
          >
            <div className="flex items-center justify-between text-[11px] uppercase">
              <span className="font-semibold">{project.title}</span>
              <span
                className={`${monoClassName} text-[color:var(--fn-margin)]`}
              >
                {project.time}
              </span>
            </div>
            <p className="mt-2 text-[11px] uppercase text-[color:var(--fn-margin)]">
              {project.role}
            </p>
            <p className="mt-2 text-sm text-[color:var(--fn-ink)]">
              {project.summary}
            </p>
            <div className="mt-2 text-[11px] uppercase">
              <Link className="fn-link" href={`/work/${project.slug}`}>
                Read more
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
