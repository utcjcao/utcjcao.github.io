import { Space_Mono } from "next/font/google";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExperienceSection from "@/components/sections/experience-section";
import ProjectsSection from "@/components/sections/projects-section";
import LeadershipSection from "@/components/sections/leadership-section";
import { resumeContent } from "@/content/resume-data";
import AboutSection from "@/components/sections/about-section";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
});

const tabs = ["about", "experience", "projects", "leadership"] as const;

export default function Home({
  searchParams,
}: {
  searchParams?: { tab?: string };
}) {
  const activeTab = tabs.includes(
    (searchParams?.tab ?? "") as (typeof tabs)[number]
  )
    ? (searchParams?.tab as (typeof tabs)[number])
    : "about";

  return (
    <div
      className="min-h-screen fn-page"
      style={{
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-14">
        <Tabs defaultValue={activeTab}>
          <TabsList>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="leadership">Leadership</TabsTrigger>
          </TabsList>
          <TabsContent value="about">
            <AboutSection
              educationItems={resumeContent.education}
              skillsItems={resumeContent.skills}
              monoClassName={spaceMono.className}
            />
          </TabsContent>
          <TabsContent value="experience">
            <ExperienceSection
              items={resumeContent.experience}
              monoClassName={spaceMono.className}
            />
          </TabsContent>
          <TabsContent value="projects">
            <ProjectsSection
              items={resumeContent.projects}
              monoClassName={spaceMono.className}
            />
          </TabsContent>
          <TabsContent value="leadership">
            <LeadershipSection
              items={resumeContent.leadership}
              monoClassName={spaceMono.className}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
