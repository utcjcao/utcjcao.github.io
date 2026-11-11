import CityLoader from './city/city-loader';
import Intro from './city/intro';
import styles from './city/city.module.css';

export default function Home() {
  return <main className={styles.page}>
    <link rel="preload" as="image" href="/city-brick.webp" fetchPriority="low" />
    <link rel="preload" as="image" href="/city-painted-brick.webp" fetchPriority="low" />
    <link rel="preload" as="image" href="/moon.webp" fetchPriority="low" />
    <link rel="preload" as="image" href="/scenery/tree.webp" fetchPriority="low" />
    <CityLoader />
    <Intro />
  </main>;
}
