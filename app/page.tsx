import Link from "next/link";
import Script from "next/script";
import SiteNav from "@/app/site-nav";

export default function Home() {
  return (
    <>
      <main className="site-shell">
        <header className="intro">
          <h1>Chris Cao</h1>
          <p>Computer Science @ University of Toronto</p>
          <SiteNav />
        </header>

        <section className="post-list" aria-label="Home">
          <article className="post-preview">
            <p>
              I am a Computer Science student in the co-op program at the
              University of Toronto. I am currently a Software Development
              Engineer Intern at Amazon and a Research Assistant at Far Data Lab,
              where I work on data systems and LLM-powered query execution.
            </p>
            <p className="detail-copy">
              My current interests are mostly about making things faster and
              more reliable. I want to learn more about databases, optimization,
              distributed systems, and infrastructure.
            </p>
          </article>
          <article className="post-preview">
            <h2>Links</h2>
            <ul className="link-list">
              <li>
                <Link href="mailto:cjcao.work@gmail.com">Email</Link>
              </li>
              <li>
                <Link href="https://github.com/utcjcao">GitHub</Link>
              </li>
              <li>
                <Link href="https://linkedin.com/in/cjao">LinkedIn</Link>
              </li>
            </ul>
          </article>
          <article className="post-preview">
            <div data-webring="ca" data-member="utcjcao" />
          </article>
        </section>
      </main>
      <Script src="https://webring.ca/embed.js" strategy="afterInteractive" />
    </>
  );
}
