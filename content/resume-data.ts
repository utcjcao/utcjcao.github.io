export type ResumeContent = {
  skills: { label: string; value: string }[];
  projects: {
    title: string;
    role: string;
    summary: string;
    time: string;
    slug: string;
  }[];
  experience: {
    company: string;
    role: string;
    time: string;
    location: string;
    summary: string;
    slug: string;
  }[];
  leadership: {
    title: string;
    org: string;
    time: string;
    summary: string;
    slug: string;
  }[];
  education: {
    school: string;
    program: string;
    time: string;
    detail: string;
  }[];
};

export const resumeContent: ResumeContent = {
  skills: [
    {
      label: "Programming Languages",
      value: "Python, JavaScript/TypeScript, C, C++, Java, SQL, Bash",
    },
    { label: "Web Development", value: "React.js, Next.js, HTML/CSS" },
    { label: "Tools and Technologies", value: "AWS, Git, Docker, Linux/Unix" },
    { label: "Database", value: "PostgreSQL, SQLite, MySQL" },
  ],
  projects: [
    {
      title: "Pack N' Track",
      role: "Python, TypeScript, Express.js, FastAPI, SQLite",
      summary:
        "Built an AI-assisted warehouse inventory platform with box-dimension scanning and packing optimization using FastAPI and an Express gateway with Pydantic/Zod validation.",
      time: "Jul 2025",
      slug: "pack-n-track",
    },
  ],
  experience: [
    {
      company: "UofT Computer Science Student Union",
      role: "Full-Stack Web Developer",
      time: "Jul 2025 - Present",
      location: "Toronto, ON",
      summary:
        "Built and shipped the ASSU website with TypeScript + Next.js, integrating PostgreSQL/Prisma and automated content ingestion.",
      slug: "assu-web",
    },
    {
      company: "UofT Secure Intelligent and Trustworthy Systems Lab",
      role: "Systems Research Intern",
      time: "Mar 2025 - Aug 2025",
      location: "Toronto, ON",
      summary:
        "Built a simulation pipeline for side-channel research and ran large-scale gem5 experiments to validate cache security claims.",
      slug: "systems-research",
    },
    {
      company: "UofT Social, Moral, and Political Psychology Lab",
      role: "Machine Learning Research Intern",
      time: "May 2024 - Aug 2024",
      location: "Toronto, ON",
      summary:
        "Developed an NLP pipeline over 8M articles to quantify moral framing and improved topic coverage with word2vec.",
      slug: "moral-psychology",
    },
  ],
  leadership: [
    {
      title: "Technical Director",
      org: "UofT Computer Science Student Union",
      time: "Jul 2025 - Present",
      summary:
        "Launched a project incubator and led weekly workshops on data structures and algorithms.",
      slug: "csu-leadership",
    },
  ],
  education: [
    {
      school: "University of Toronto",
      program: "Honors BSc, Computer Science",
      time: "2023-2027",
      detail: "GPA: 3.94",
    },
  ],
};
