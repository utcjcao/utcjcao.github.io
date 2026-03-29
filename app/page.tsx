import Link from "next/link";

export default function Home() {
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

      <section className="post-list" aria-label="Home">
          <p>
            I am currently an incoming Software Development Engineer Intern at
            Amazon and a web developer team lead with the UofT Computer Science
            Student Union. Before that, I worked on systems security research
            and machine learning research at the University of Toronto.
          </p>
      </section>
    </main>
  );
}
