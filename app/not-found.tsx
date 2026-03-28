import Link from "next/link";

export default function NotFound() {
  return (
    <main className="post-page not-found">
      <h1>Not found</h1>
      <p>The page you requested does not exist.</p>
      <p>
        <Link href="/">Back home</Link>
      </p>
    </main>
  );
}
