import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts } from "@/lib/posts";

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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

        <section className="blog-post-body">
          <div dangerouslySetInnerHTML={{ __html: post.body }} />
        </section>
      </article>
    </main>
  );
}
