import Link from "next/link";
import SiteNav from "@/app/site-nav";

export default function ExperiencePage() {
  return (
    <main className="site-shell">
      <header className="intro">
        <h1>Chris Cao</h1>
        <p>Computer Science @ University of Toronto</p>
        <SiteNav />
      </header>

      <section className="experience-page" aria-label="Experience">
        <article className="post-preview">
          <h2>Experiences</h2>
          <details className="expand-item">
            <summary>
              <span>Amazon - Incoming SDE Intern (Summer 2026)</span>
            </summary>
            <div className="expand-body">
              <ul>
                <li>
                  Joining Amazon as a Software Engineer Intern in Summer 2026.
                </li>
              </ul>
            </div>
          </details>

          <details className="expand-item">
            <summary>
              <span>
                Secure Intelligent and Trustworthy Systems Lab - Research
                Assistant (Summer 2025)
              </span>
            </summary>
            <div className="expand-body">
              <ul>
                <li>
                  Disproved a reported side-channel attack on MIRAGE caches by
                  rerunning the simulation in gem5 with controlled inputs and
                  fixed seeds.
                </li>
                <li>
                  Parsed experiment logs into CSV for guessing-entropy analysis
                  and traced the issue to a trace-counting bug and fixed RNG
                  seed using Bash, Python, and C++.
                </li>
              </ul>
            </div>
          </details>

          <details className="expand-item">
            <summary>
              <span>
                Social, Moral, and Political Psychology Lab - Research
                Assistant (Summer 2024)
              </span>
            </summary>
            <div className="expand-body">
              <ul>
                <li>
                  Built a Python NLP pipeline to analyze how political leaning
                  influences morality in news coverage.
                </li>
                <li>
                  Analyzed 8 million articles across 100+ outlets and scored 10
                  moral categories at scale.
                </li>
              </ul>
            </div>
          </details>
        </article>
        <article className="post-preview">
          <h2>Community Leadership</h2>
          <details className="expand-item">
            <summary>
              <span>UofT Open Source Students - Outreach VP</span>
            </summary>
            <div className="expand-body">
              <ul>
                <li>Led redevelopment of the UTOSS website.</li>
              </ul>
            </div>
          </details>
          <details className="expand-item">
            <summary>
              <span>
                UofT Computer Science Student Union - Director of Technology
              </span>
            </summary>
            <div className="expand-body">
              <ul>
                <li>Led redevelopment of ASSU website and calendar.</li>
              </ul>
            </div>
          </details>
        </article>
      </section>
    </main>
  );
}
