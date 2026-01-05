type EducationItem = {
  school: string;
  program: string;
  detail: string;
  time: string;
};

type EducationSectionProps = {
  items: EducationItem[];
  monoClassName: string;
  variant?: "card" | "embedded";
};

export default function EducationSection({
  items,
  monoClassName,
  variant = "card",
}: EducationSectionProps) {
  const wrapperClassName =
    variant === "card" ? "grid gap-6 fn-section p-6" : "grid gap-6";

  return (
    <section className={wrapperClassName}>
      <div className="fn-label text-xs">
        <span className="fn-tag">Education</span>
      </div>
      <div className="grid gap-3 text-[11px] uppercase">
        {items.map((edu) => (
          <div
            key={edu.school}
            className="fn-item flex items-center justify-between gap-6 bg-transparent px-3 py-2 first:border-t-0"
          >
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase">{edu.school}</p>
              <p className="text-[10px] uppercase text-[color:var(--fn-margin)]">
                {edu.program}
              </p>
            </div>
            <div className="text-right">
              <p className={`${monoClassName} text-[color:var(--fn-margin)]`}>
                {edu.time}
              </p>
              <p className="text-[10px] uppercase text-[color:var(--fn-margin)]">
                {edu.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
