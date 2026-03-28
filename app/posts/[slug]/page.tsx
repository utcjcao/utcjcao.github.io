import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/content/posts";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = posts.find((entry) => entry.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <main className="post-page">
      <Link href="/" className="back-link">
        Back home
      </Link>

      <article>
        <header className="post-header">
          <h1>{post.title}</h1>
          <p className="post-date">{post.date}</p>
        </header>

        <section className="post-body">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      </article>
    </main>
  );
}
