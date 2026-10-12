import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="section legal-page">
      <p className="eyebrow">404 / UNEXPLORED TERRITORY</p>
      <h1>A little off course.</h1>
      <p>
        This page doesn’t exist. There’s plenty to explore back at the studio.
      </p>
      <Link className="pill-button primary" href="/">
        Back to ATRIXX ↗
      </Link>
    </main>
  );
}
