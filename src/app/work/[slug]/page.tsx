import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects";
import { ProjectVisual } from "@/components/project-visual";
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = projects.find((p) => p.slug === slug);
  return { title: p?.name ?? "Project not found", description: p?.description };
}
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index < 0) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];
  return (
    <main id="main" className="case-page">
      <section className="section case-intro">
        <Link href="/#work" className="text-link">
          <ArrowLeft size={16} /> Back to explorations
        </Link>
        <p className="eyebrow">SELF-INITIATED CONCEPT / {p.year}</p>
        <h1>
          {p.name}
          <span>®</span>
        </h1>
        <div className="case-heading">
          <h2>{p.title}</h2>
          <p>
            {p.description}
            <br />
            <span className="muted">
              This is an original concept, not a client commission.
            </span>
          </p>
        </div>
      </section>
      <ProjectVisual type={p.type} large />
      <section className="section case-story">
        {[
          ["01 / THE BRIEF", p.brief],
          ["02 / THE RESPONSE", p.response],
          ["03 / INTENDED VALUE", p.value],
        ].map(([label, text]) => (
          <div key={label}>
            <p className="eyebrow">{label}</p>
            <h2>{text}</h2>
          </div>
        ))}
        <p className="concept-disclaimer">
          Design exploration only. No commercial launch, customer relationship,
          or measured business outcomes are claimed. Any interface data is
          illustrative.
        </p>
      </section>
      <section className="section next-project">
        <p className="eyebrow">NEXT EXPLORATION</p>
        <Link href={`/work/${next.slug}`}>
          {next.name}
          <ArrowUpRight />
        </Link>
        <Link className="pill-button primary" href="/#contact">
          Let’s make something yours <ArrowUpRight size={18} />
        </Link>
      </section>
    </main>
  );
}
