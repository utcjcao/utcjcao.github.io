import Link from "next/link";
import Image from "next/image";
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
            <figure className="polaroid">
              <div className="polaroid-photo">
                <Image
                  src="/photo.webp"
                  alt="Chris Cao"
                  width={480}
                  height={640}
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="about-photo"
                  priority
                />
              </div>
              <figcaption>Me and my friend at North Glenmore Park, Summer 2023</figcaption>
            </figure>
            <p>
              I am currently an incoming Software Engineer Intern at
              Amazon and a web developer team lead with the UofT Computer Science
              Student Union. Before that, I worked on systems security
              and machine learning research at the University of Toronto.
            </p>
            <p className="detail-copy">
              My current interests are mostly about making things faster. I want
              to learn more about databases, optimization, parallelization, and
              infrastructure. I&apos;m currently learning C++ and CUDA.
            </p>
          </article>
          <article className="post-preview">
            <h2>My Current Goals (as of March 2026)</h2>
            <ul className="goal-list">
              <li>
                Reach Specialist on{" "}
                <Link href="https://codeforces.com/profile/chribbers">
                  Codeforces
                </Link>
                {" "}(reached pupil after 6 years)
              </li>
              <li>Write more</li>
              <li>Bench 225</li>
            </ul>
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
