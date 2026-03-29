import Link from "next/link";

export default function ExperiencePage() {
  return (
    <main className="site-shell">
      <header className="intro">
        <h1>Chris Cao</h1>
        <p>Computer Science @ University of Toronto</p>
        <div className="intro-links">
          <Link href="/">Home</Link>
          <Link href="/posts">All Posts</Link>
          <Link href="/experience">Experiences</Link>
        </div>
      </header>

      <section className="post-list" aria-label="Experience">
        <article className="post-preview">
          <h2>Experiences</h2>
          <p>Amazon (Summer 2026): Incoming SDE Intern</p>
          <p>
            Secure Intelligent and Trustworthy Systems Lab (Summer 2025): Research Assistant
          </p>
          <p>
            Social, Moral, and Political Psychology Lab (Summer 2024): Research Assistant
          </p>
        </article>

        <article className="post-preview">
          <h2>Community Leadership</h2>
          <p>UofT Open Source Students: Outreach VP</p>
          <p>UofT Computer Science Student Union: Director of Technology</p>
        </article>
      </section>
    </main>
  );
}
