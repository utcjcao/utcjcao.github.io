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
              <span>
                Amazon - Software Development Engineer Intern (June 2026 -
                August 2026)
              </span>
            </summary>
            <div className="expand-body">
              <ul>
                <li>
                  Designed a declarative rule engine for Amazon&apos;s financial
                  reconciliation pipeline, representing source-specific
                  reconciliation logic as typed abstract syntax trees to
                  classify transactions and generate traceability metadata
                  across 1B+ daily financial transactions.
                </li>
                <li>
                  Built typed abstract syntax tree infrastructure for
                  declarative reconciliation rules, normalizing predicates and
                  enforcing deterministic precedence, conflict detection, and
                  ambiguity checks in Java.
                </li>
                <li>
                  Implemented versioned rule deployment with stage and region
                  gates, release blocking, CloudWatch alarm integration, and
                  rollback paths using AWS CDK, S3/AppConfig, Lambda, and
                  CloudWatch.
                </li>
              </ul>
            </div>
          </details>

          <details className="expand-item">
            <summary>
              <span>Far Data Lab - Research Assistant (May 2026 - August 2026)</span>
            </summary>
            <div className="expand-body">
              <ul>
                <li>
                  Building C++ and Python data-processing infrastructure for
                  LLM-powered query execution in DuckDB, integrating semantic
                  filters, joins, aggregations, and top-k operators into
                  analytical database workflows.
                </li>
                <li>
                  Optimizing model-call latency and inference cost through
                  batching, adaptive execution, and cost-aware query planning.
                </li>
              </ul>
            </div>
          </details>

          <details className="expand-item">
            <summary>
              <span>
                SITH Lab - Research Assistant (March 2025 - August 2025)
              </span>
            </summary>
            <div className="expand-body">
              <ul>
                <li>
                  First-authored an IEEE Computer Architecture Letters paper on
                  GPU cache security, identifying a reproducibility flaw in a
                  reported side-channel attack.
                </li>
                <li>
                  Debugged low-level accelerator security simulations in gem5 by
                  rerunning attack traces, analyzing simulation logs, and
                  tracing false positives to a trace-counting bug and fixed RNG
                  seed using C++, Python, and Bash.
                </li>
                <li>
                  Containerized architecture-simulation dependencies with Docker
                  to improve reproducibility across hardware and software
                  security experiments.
                </li>
              </ul>
            </div>
          </details>
        </article>

        <article className="post-preview">
          <h2>Education</h2>
          <details className="expand-item">
            <summary>
              <span>University of Toronto - BSc Computer Science</span>
            </summary>
            <div className="expand-body">
              <ul>
                <li>Co-op Program, expected May 2027.</li>
                <li>GPA: 3.94</li>
                <li>
                  University of Toronto Excellence Award, Dean&apos;s List,
                  Undergraduate Student Research Award.
                </li>
                <li>
                  Courses: Data Structures and Algorithms, Operating Systems,
                  Databases, Parallel Programming.
                </li>
              </ul>
            </div>
          </details>
        </article>
      </section>
    </main>
  );
}
