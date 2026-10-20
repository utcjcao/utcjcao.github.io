import Link from "next/link";
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
              I am a Computer Science student at the University of Toronto and
              an incoming intern at Stripe. Previously, I was a Software
              Development Engineer Intern at Amazon and a Research Assistant at
              Far Data Lab.
            </p>
            <p className="detail-copy">
            </p>
            <p>
              My favorite artist is OutKast. My favorite game is Clash Royale.
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
        </section>
      </main>
    </>
  );
}
