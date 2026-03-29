export type Post = {
  slug: string;
  title: string;
  date: string;
  summary: string;
  body: string[];
};

export const posts: Post[] = [
  {
    slug: "starting-over",
    title: "Starting Over With a Smaller Website",
    date: "2026-03-28",
    summary:
      "A note on why I wanted something quieter than a portfolio app and what I want this site to be for.",
    body: [
      "I wanted a website that felt more like a notebook than a product. The old structure worked as a resume, but it pushed everything into sections and UI patterns before there was much writing to support them.",
      "This version is intentionally smaller. It has a homepage, a list of posts, and pages for each post. That keeps the maintenance cost low and makes it easy to publish short notes without redesigning the site every time.",
      "If this structure holds up, the next step is moving the post content into Markdown or MDX so writing feels even lighter.",
    ],
  },

];
