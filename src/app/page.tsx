import Link from "next/link";
import { ArrowDown, ArrowUpRight, Plus, Gamepad2, Check } from "lucide-react";
import { projects } from "@/lib/projects";
import { ProjectVisual } from "@/components/project-visual";
import { CoffeeStage } from "@/components/coffee-stage";
import { MotionEffects } from "@/components/motion-effects";
import { ExperienceLab } from "@/components/experience-lab";
import { ContactForm } from "@/components/contact-form";
export default function Home() {
  return (
    <main id="main" className="home-page">
      <svg className="page-coffee-spill" aria-hidden="true" focusable="false">
        <path className="spill-river" />
        <path className="spill-crema" />
      </svg>
      <MotionEffects />
      <section className="hero arcade-hero" aria-labelledby="hero-title">
        <div className="hero-topline">
          <span>
            <i className="status-dot" /> PLAYER 01 — ATHARVA
          </span>
          <span>
            INDEPENDENT DESIGNER & DEVELOPER{" "}
            <span className="pixel-heart" aria-hidden="true">
              ♥
            </span>
          </span>
        </div>
        <div className="arcade-hero-grid">
          <div className="hero-copy">
            <p className="hero-kicker">
              <Gamepad2 size={16} /> A NEW LEVEL FOR YOUR BUSINESS
            </p>
            <div className="hero-headline">
              <h1 id="hero-title">
                Small business.
                <br />
                Big website
                <br />
                <em>energy.</em>
                <span className="pixel-burst" aria-hidden="true">
                  ✦
                </span>
              </h1>
            </div>
            <p className="hero-description">
              I build premium websites for cafés, shops, salons, and service
              businesses. Simple to use. Hard to forget.
            </p>
            <div className="hero-actions">
              <Link className="pill-button primary" href="#contact">
                Level up my website <ArrowUpRight size={18} />
              </Link>
              <Link className="hero-secondary" href="#work">
                See the possibilities <ArrowDown size={14} />
              </Link>
            </div>
            <div className="hero-benefits">
              <span>
                <Check size={12} /> Made for your business
              </span>
              <span>
                <Check size={12} /> Built to work beautifully
              </span>
            </div>
          </div>
          <CoffeeStage />
        </div>
        <div className="hero-gamebar">
          <span>
            <i /> CURRENT QUEST: MAKE YOUR BUSINESS STAND OUT
          </span>
          <a href="#work">
            SCROLL TO PLAY <ArrowDown size={13} />
          </a>
        </div>
      </section>
      <div className="spill-runway" aria-hidden="true">
        <span>AN EXTRA SHOT OF POSSIBILITY ↓</span>
      </div>
      <div className="discipline-strip">
        <span>LOCAL BUSINESS</span>
        <Plus />
        <span>PREMIUM WEBSITES</span>
        <Plus />
        <span>PERSONALITY INCLUDED</span>
        <Plus />
        <span>NO BORING BITS</span>
        <Plus />
      </div>
      <section id="work" className="section work-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              <span>LEVEL 01</span> THE POSSIBILITIES
            </p>
            <h2>
              Everyday businesses.
              <br />
              <span className="muted">Anything but ordinary.</span>
            </h2>
          </div>
          <p className="section-aside">
            Your neighbourhood favourites,
            <br />
            reimagined for the web.
            <span className="concept-note">
              Original concept work · Not client commissions
            </span>
          </p>
        </div>
        <div className="project-grid">
          {projects.map((p, i) => (
            <Link
              className={`project ${"demoUrl" in p ? "project-featured" : `project-${i - 1}`}`}
              key={p.slug}
              href={`/work/${p.slug}`}
            >
              <div className="project-window">
                <span>
                  <i />
                  <i />
                  <i />
                </span>
                <span>
                  {p.category.split(" / ")[0].toUpperCase()} / {"demoUrl" in p ? "WORKING DEMO" : "CONCEPT"}
                </span>
                <ArrowUpRight size={14} />
              </div>
              <div className="project-image">
                <ProjectVisual type={p.type} />
                <span className="project-open">
                  <ArrowUpRight size={24} />
                </span>
                <span className="concept-badge">{"demoUrl" in p ? "EXPLORE THE CAFÉ DEMO" : "CONCEPT PROJECT"}</span>
              </div>
              <div className="project-meta">
                <h3>
                  {p.name}
                  <span>{p.category}</span>
                </h3>
                <span>
                  0{i + 1} <ArrowUpRight size={19} />
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
              <span>BONUS LEVEL</span> THE PLAYGROUND
            </p>
            <h2>
              A little play.
              <br />
              <span className="muted">A lot of possibility.</span>
            </h2>
          </div>
          <p className="section-aside">
            Explore the details that make a website
            <br />
            feel like your business. Pick a colour.
            <br />
            Press a button. See what happens.
          </p>
        </div>
        <ExperienceLab />
        <p className="lab-business-note">
          <span>✳</span> Your website can be as simple or as expressive as your
          business needs.
        </p>
      </section>
      <section id="services" className="section services-section">
        <div>
          <p className="eyebrow">
            <span>LEVEL 02</span> YOUR POWER-UPS
          </p>
          <h2>
            Good looks.
            <br />
            <span className="muted">Real-world purpose.</span>
          </h2>
          <p className="services-intro">
            Help people find you, understand what
            <br />
            you offer, and take the next step.
          </p>
          <div className="power-meter" aria-hidden="true">
            <span>BUSINESS POTENTIAL</span>
            <div>
              {Array.from({ length: 10 }, (_, i) => (
                <i key={i} />
              ))}
            </div>
            <span>LET’S UNLOCK IT ↗</span>
          </div>
        </div>
        <div className="services-list">
          {[
            [
              "01",
              "A website that feels like you",
              "Give your café, salon, shop, or service business a distinctive home online. Clear information, thoughtful design, and a great experience on every phone.",
              "Custom design / Mobile-ready pages / Search-friendly structure",
            ],
            [
              "02",
              "Fewer steps. More ways to connect.",
              "Make it easy to view your menu, explore your services, request a quote, or book an appointment. The right features, built around how your business actually works.",
              "Menus & catalogs / Booking integrations / Inquiry forms",
            ],
            [
              "03",
              "That extra bit of “wow”",
              "A playful product view, an unexpected transition, or a detail worth remembering. Add personality where it helps your story and keeps the next step clear.",
              "Product experiences / Thoughtful animation / Interactive details",
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
          <span>PLAYER PROFILE</span> MEET YOUR DESIGNER
        </p>
        <div className="studio-statement">
          <span className="studio-star" aria-hidden="true">
            ✳
          </span>
          <h2>
            Hi, I’m Atharva.
            <br />
            Your business’s next teammate.
          </h2>
        </div>
        <div className="studio-copy">
          <p>
            I’m the designer and developer behind Arvion Studios. I believe a great
            local business deserves a website with just as much care, character,
            and ambition as the people running it.
          </p>
          <p>
            You bring the business. I bring the design, the code, and a playful
            point of view. We’ll turn what makes you special into something your
            customers can see—and use.
          </p>
        </div>
        <div className="process-line">
          {[
            ["01", "Say hello", "Tell me about your business."],
            ["02", "Find your style", "Shape the look and the journey."],
            ["03", "Build it right", "Bring the details to life."],
            ["04", "Go live", "Test, polish, and press start."],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span>STAGE {n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="contact" className="section contact-section">
        <p className="eyebrow">
          <span>READY, PLAYER ONE?</span> LET’S BUILD YOUR NEXT LEVEL
        </p>
        <h2>
          Your business.
          <br />
          <span>A fresh start online.</span>
          <ArrowUpRight className="contact-arrow" />
        </h2>
        <div className="contact-layout">
          <div className="contact-intro">
            <p>
              A café around the corner.
              <br />A shop with a story.
              <br />A service people should know about.
              <br />
              <strong>Let’s make your website work for you.</strong>
            </p>
            <span className="contact-token">
              <Gamepad2 size={22} /> START A CONVERSATION
              <br />
              NO TECH TALK REQUIRED
            </span>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
