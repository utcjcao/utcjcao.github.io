import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export type Post = PostMeta & {
  body: string;
};

const postsDirectory = path.join(process.cwd(), "content", "posts");

function parseFrontmatter(fileContent: string) {
  const { data, content } = matter(fileContent);
  const normalizedDate =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : typeof data.date === "string"
        ? data.date
        : String(data.date ?? "");

  return {
    title: typeof data.title === "string" ? data.title : "",
    date: normalizedDate,
    summary: typeof data.summary === "string" ? data.summary : "",
    body: content.trim(),
  };
}

async function renderMarkdown(markdown: string) {
  const rendered = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(markdown);

  return rendered.toString();
}

export async function getPosts(): Promise<PostMeta[]> {
  const filenames = await fs.readdir(postsDirectory);

  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md"))
      .map(async (filename) => {
        const slug = filename.replace(/\.md$/, "");
        const filePath = path.join(postsDirectory, filename);
        const fileContent = await fs.readFile(filePath, "utf8");
        const { title, date, summary } = parseFrontmatter(fileContent);

        return { slug, title, date, summary };
      })
  );

  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContent = await fs.readFile(filePath, "utf8");
    const { title, date, summary, body } = parseFrontmatter(fileContent);
    const renderedBody = await renderMarkdown(body);

    return { slug, title, date, summary, body: renderedBody };
  } catch {
    return null;
  }
}
