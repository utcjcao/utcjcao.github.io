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
        <a href="mailto:cjcao.work@gmail.com">Email</a>
        <a href="https://github.com/utcjcao">GitHub</a>
        <a href="https://linkedin.com/in/cjao">LinkedIn</a>
      </div>
    </>}
  </section>;
}
