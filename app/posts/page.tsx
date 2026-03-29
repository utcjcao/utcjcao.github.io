import Link from "next/link";
import { posts } from "@/content/posts";

export default function PostsIndex() {
  return (
    <main className="site-shell">
      <header className="intro">
        <h1>Chris Cao</h1>
        <p>
          Computer Science @ University of Toronto 
        </p>
        <div className="intro-links">
          <Link href="/">Home</Link>
          <Link href="/posts">All Posts</Link>
          <Link href="/experience">Experiences</Link>
        </div>
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
