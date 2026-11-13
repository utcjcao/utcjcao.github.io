'use client';

import { useState } from 'react';
import styles from './city.module.css';

export default function Intro() {
  const [tab, setTab] = useState<'home' | 'blog'>('home');

  return <section className={styles.intro} aria-label="About Chris Cao">
    <header className={styles.introHeader}>
      <h1>Chris Cao</h1>
      <p>Computer Science @ University of Toronto</p>
    </header>
    <nav className={styles.introNav} aria-label="Page sections">
      <button type="button" aria-pressed={tab === 'home'} onClick={() => setTab('home')}>Home</button>
      <button type="button" aria-pressed={tab === 'blog'} onClick={() => setTab('blog')}>Blog</button>
    </nav>
    {tab === 'home' && <>
      <div className={styles.introCopy}>
        <ul>
          <li>Incoming Intern at Stripe</li>
          <li>Previous Intern at Amazon</li>
          <li>Likes: Clash Royale, Outkast</li>
        </ul>
      </div>
      <div className={styles.introLinks}>
        <h2>Links</h2>
        <a href="mailto:cjcao.work@gmail.com">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M2 6.5v11A2.5 2.5 0 0 0 4.5 20H6V9.7l6 4.5 6-4.5V20h1.5a2.5 2.5 0 0 0 2.5-2.5v-11a2.5 2.5 0 0 0-4-2l-6 4.6-6-4.6a2.5 2.5 0 0 0-4 2Z" /></svg>
          Email
        </a>
        <a href="https://github.com/utcjcao">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.12.68-3.78-1.32-3.78-1.32-.51-1.3-1.25-1.64-1.25-1.64-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.63 1.22 3.27.93.1-.73.39-1.22.7-1.5-2.49-.28-5.11-1.24-5.11-5.54 0-1.23.44-2.23 1.15-3.02-.12-.28-.5-1.42.11-2.97 0 0 .94-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.14-1.45 3.08-1.15 3.08-1.15.61 1.55.23 2.69.11 2.97.72.79 1.15 1.79 1.15 3.02 0 4.31-2.62 5.25-5.12 5.53.4.35.76 1.03.76 2.08v3.09c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z" /></svg>
          GitHub
        </a>
        <a href="https://linkedin.com/in/cjao">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 2H3.55C2.69 2 2 2.68 2 3.52v16.96c0 .84.69 1.52 1.55 1.52h16.9c.86 0 1.55-.68 1.55-1.52V3.52C22 2.68 21.31 2 20.45 2ZM7.93 18.75H4.97V9.2h2.96v9.55ZM6.45 7.9a1.72 1.72 0 1 1 0-3.44 1.72 1.72 0 0 1 0 3.44Zm12.3 10.85h-2.96V14.1c0-1.1-.02-2.52-1.54-2.52-1.54 0-1.77 1.2-1.77 2.44v4.73H9.52V9.2h2.84v1.3h.04a3.11 3.11 0 0 1 2.8-1.54c3 0 3.55 1.97 3.55 4.53v5.26Z" /></svg>
          LinkedIn
        </a>
      </div>
    </>}
  </section>;
}
