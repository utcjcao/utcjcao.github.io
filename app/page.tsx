import Link from "next/link";

export default function Home() {
  return (
    <main className="site-shell">
      <header className="intro">
        <h1>Chris Cao</h1>
        <p>
          Computer Science student @ University of Toronto 
        </p>
        <p>
        </p>
        <div className="intro-links">
          <Link href="/">Home</Link>
          <Link href="/posts">All posts</Link>
          <Link href="/experiences">Experiences</Link>
        </div>
      </header>

      <section className="home-section" aria-label="About">
        <h2>About</h2>
        <p>
          I am currently an incoming Software Development Engineer Intern at
          Amazon and a web developer team lead with the UofT Computer Science
          Student Union. Before that, I worked on systems security research and
          machine learning research at the University of Toronto.
        </p>
      </section>

      <section className="home-section" aria-label="Experience summary">
        <h2>Experience</h2>
        <div className="experience-list">
          <article className="experience-item">
            <h3>Amazon</h3>
            <p className="experience-meta">Incoming SDE Intern</p>
            <p>Financial systems, software engineering.</p>
          </article>

          <article className="experience-item">
            <h3>UofT Computer Science Student Union</h3>
            <p className="experience-meta">Student Web Developer Team Lead</p>
            <p>Next.js, student-facing web systems, team leadership.</p>
          </article>

          <article className="experience-item">
            <h3>Secure Intelligent and Trustworthy Systems Lab</h3>
            <p className="experience-meta">Systems Research Intern</p>
            <p>Computer architecture, reproducibility, side-channel research.</p>
          </article>

          <article className="experience-item">
            <h3>Social, Moral, and Political Psychology Lab</h3>
            <p className="experience-meta">
              Machine Learning Research Intern
            </p>
            <p>NLP pipelines, topic models, large-scale news analysis.</p>
          </article>
        </div>
      </section>
    </main>
  );
}
