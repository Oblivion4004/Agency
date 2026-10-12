import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus } from "lucide-react";
import { projects } from "@/lib/projects";
import { ProjectVisual } from "@/components/project-visual";
import { Sculpture } from "@/components/sculpture";
import { MotionEffects } from "@/components/motion-effects";
import { ExperienceLab } from "@/components/experience-lab";
import { ContactForm } from "@/components/contact-form";
export default function Home() {
  return (
    <main id="main">
      <MotionEffects />
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span>
            <i className="status-dot" /> OPEN TO NEW POSSIBILITIES
          </span>
          <span>DESIGN-LED. FUTURE-FOCUSED.</span>
        </div>
        <div className="hero-headline">
          <h1 id="hero-title">
            Digital experiences,
            <br />
            <span className="hero-last">
              beyond <em>ordinary.</em>
              <span className="headline-star">✳</span>
            </span>
          </h1>
        </div>
        <div className="hero-art">
          <Sculpture />
        </div>
        <div className="hero-bottom">
          <div>
            <p>
              We turn ambitious ideas into
              <br />
              websites you don’t just see.
              <br />
              <strong>You feel.</strong>
            </p>
            <Link className="pill-button primary" href="#work">
              Explore our work <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="hero-coordinate">
            <span>FORM / FUNCTION / FEELING</span>
            <span>EXPERIMENT 001 — DIGITAL MATTER</span>
          </div>
          <a className="scroll-cue" href="#work">
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown size={18} />
          </a>
        </div>
      </section>
      <div className="discipline-strip">
        <span>CREATIVE DEVELOPMENT</span>
        <Plus />
        <span>IMMERSIVE EXPERIENCES</span>
        <Plus />
        <span>DIGITAL DESIGN</span>
        <Plus />
        <span>BUILT WITH INTENTION</span>
        <Plus />
      </div>
      <section id="work" className="section work-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span>01 /</span> SELECTED EXPLORATIONS
            </p>
            <h2>
              Good design gets noticed.
              <br />
              <span className="muted">Great experiences stay.</span>
            </h2>
          </div>
          <p className="section-aside">
            A glimpse of what’s possible.
            <br />
            Original concepts. Real craft.
            <br />
            <span className="concept-note">
              Self-initiated work · Not client commissions
            </span>
          </p>
        </div>
        <div className="project-grid">
          {projects.map((p, i) => (
            <Link
              className={`project project-${i}`}
              key={p.slug}
              href={`/work/${p.slug}`}
            >
              <div className="project-image">
                <ProjectVisual type={p.type} />
                <span className="project-open">
                  <ArrowUpRight size={24} />
                </span>
                <span className="concept-badge">CONCEPT PROJECT</span>
              </div>
              <div className="project-meta">
                <h3>
                  {p.name}
                  <span>{p.category}</span>
                </h3>
                <span>
                  {p.year} <ArrowUpRight size={19} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <section id="lab" className="section lab-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span>02 /</span> THE EXPERIENCE LAB
            </p>
            <h2>
              Less expected.
              <br />
              <span className="muted">More experienced.</span>
            </h2>
          </div>
          <p className="section-aside">
            A playground for the possibilities
            <br />
            between design and technology.
            <br />
            Go on. Get curious.
          </p>
        </div>
        <ExperienceLab />
      </section>
      <section id="services" className="section services-section">
        <div>
          <p className="eyebrow">
            <span>03 /</span> WHAT WE BRING
          </p>
          <h2>
            Made to move
            <br />
            <span className="muted">your business.</span>
          </h2>
          <p className="services-intro">
            Beautiful is the beginning.
            <br />
            Useful is what makes it matter.
          </p>
        </div>
        <div className="services-list">
          {[
            [
              "01",
              "Websites with a point of view",
              "A distinctive digital presence that tells your story clearly and turns interest into meaningful inquiries.",
              "Strategy & positioning / UI & UX / Custom development",
            ],
            [
              "02",
              "Experiences that invite interaction",
              "Bring a product, space, or idea to life. Give your audience a reason to explore—and a clearer understanding of what makes you different.",
              "Interactive 3D / Product visualization / Creative development",
            ],
            [
              "03",
              "Digital products that feel effortless",
              "Make complex workflows clear, help people find their next step, and build interfaces that grow with your business.",
              "Product design / Commerce / Systems & integrations",
            ],
          ].map(([n, title, body, detail]) => (
            <details key={n} open={n === "01"}>
              <summary>
                <span>{n}</span>
                <h3>{title}</h3>
                <Plus size={20} />
              </summary>
              <div className="service-body">
                <p>{body}</p>
                <span>{detail}</span>
              </div>
            </details>
          ))}
        </div>
      </section>
      <section id="studio" className="section studio-section">
        <p className="eyebrow">
          <span>04 /</span> THE STUDIO
        </p>
        <div className="studio-statement">
          <span className="studio-star">✳</span>
          <h2>
            Small by choice.
            <br />
            Ambitious by nature.
          </h2>
        </div>
        <div className="studio-copy">
          <p>
            ATRIXX is an independent creative development studio founded by
            Atharva. A place where thoughtful design meets a restless curiosity
            for what the web can be.
          </p>
          <p>
            We connect the big picture to the smallest interaction. From the
            first conversation to the final line of code, the intention stays
            the same: make something worth experiencing.
          </p>
        </div>
        <div className="process-line">
          {[
            ["01", "Discover", "Find the right problem."],
            ["02", "Design", "Give the idea a point of view."],
            ["03", "Develop", "Make every detail work."],
            ["04", "Refine", "Test, tune, and launch."],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span>{n} /</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="contact" className="section contact-section">
        <p className="eyebrow">
          <span>05 /</span> SOMETHING GOOD STARTS HERE
        </p>
        <h2>
          Have a bold idea?
          <br />
          <span>Let’s give it form.</span>
          <ArrowUpRight className="contact-arrow" />
        </h2>
        <div className="contact-layout">
          <p>
            A new beginning. A better website.
            <br />
            Something no one’s done before.
            <br />
            <strong>We’d love to hear it.</strong>
          </p>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
