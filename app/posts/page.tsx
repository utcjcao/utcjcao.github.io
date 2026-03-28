import Link from "next/link";
import { posts } from "@/content/posts";

export default function PostsIndex() {
  return (
    <main className="site-shell">
      <header className="intro">
        <p>
          <Link href="/">Home</Link>
        </p>
        <h1>Posts</h1>
      </header>

      <section className="post-list" aria-label="All posts">
        {posts.map((post) => (
          <article key={post.slug} className="post-preview">
            <h2>
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </h2>
            <p className="post-date">{post.date}</p>
            <p>{post.summary}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
