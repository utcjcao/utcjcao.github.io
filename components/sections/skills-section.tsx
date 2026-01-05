type SkillItem = {
  label: string;
  value: string;
};

type SkillsSectionProps = {
  items: SkillItem[];
  variant?: "card" | "embedded";
};

export default function SkillsSection({
  items,
  variant = "card",
}: SkillsSectionProps) {
  const wrapperClassName =
    variant === "card" ? "grid gap-6 fn-section p-6" : "grid gap-6";

  return (
    <section className={wrapperClassName}>
      <div className="fn-label text-xs">
        <span className="fn-tag">Skills</span>
      </div>
      <div className="grid gap-3 text-sm text-[color:var(--fn-ink)]">
        {items.map((skill) => (
          <div
            key={skill.label}
            className="fn-item bg-transparent px-3 py-2 first:border-t-0"
          >
            <p className="text-[11px] uppercase text-[color:var(--fn-margin)]">
              {skill.label}
            </p>
            <p className="mt-2 text-[11px] text-[color:var(--fn-ink)] ">
              {skill.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
