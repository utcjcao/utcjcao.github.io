import Link from "next/link";
import SiteNav from "@/app/site-nav";
import { getPosts } from "@/lib/posts";

export default async function PostsIndex() {
  const posts = await getPosts();

  return (
    <main className="site-shell">
      <header className="intro">
        <h1>Chris Cao</h1>
        <p>Computer Science @ University of Toronto</p>
        <SiteNav />
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
