import Link from "next/link";
import { Space_Mono } from "next/font/google";
import { headerLinks } from "@/content/header-data";
import EducationSection from "@/components/sections/education-section";
import SkillsSection from "@/components/sections/skills-section";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

type AboutSectionProps = {
  educationItems: {
    school: string;
    program: string;
    detail: string;
    time: string;
  }[];
  skillsItems: { label: string; value: string }[];
  monoClassName: string;
};

export default function AboutSection({
  educationItems,
  skillsItems,
  monoClassName,
}: AboutSectionProps) {
  return (
    <div className="grid gap-6 fn-section p-6">
      <div className="min-w-0">
        <h1 className="mt-3 text-4xl font-semibold uppercase text-[color:var(--fn-ink)]">
          Chris Cao
        </h1>
        <div className="mt-4 flex min-w-0 flex-wrap gap-3 text-[11px] uppercase text-[color:var(--fn-margin)]">
          {headerLinks.map((link, index) => (
            <span key={link.label} className="flex min-w-0 items-center gap-3">
              <Link
                href={link.href}
                className={`${spaceMono.className} fn-link break-all`}
              >
                {link.value}
              </Link>
              {index < headerLinks.length - 1 && (
                <span className="text-[color:var(--fn-rule)]">|</span>
              )}
            </span>
          ))}
        </div>
        <p className="mt-3  text-[color:var(--fn-ink)]">
          Full-Stack Developer - Toronto, ON
        </p>
      </div>
      <EducationSection
        items={educationItems}
        monoClassName={monoClassName}
        variant="embedded"
      />
      <SkillsSection items={skillsItems} variant="embedded" />
    </div>
  );
}
