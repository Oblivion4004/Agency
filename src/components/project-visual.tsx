import type { Project } from "@/lib/projects";
import { SculptureFallback } from "./sculpture-fallback";
export function ProjectVisual({
  type,
  large = false,
}: {
  type: Project["type"];
  large?: boolean;
}) {
  return (
    <div
      className={`project-art ${type} ${large ? "large" : ""}`}
      aria-hidden="true"
    >
      {type === "atharva" ? (
        <>
          <div className="atharva-preview-copy">
            <span className="atharva-preview-label">ATHARVA COFFEE · CAFÉ CONCEPT</span>
            <span className="atharva-preview-title">A little pause.<br /><em>A lovely coffee.</em></span>
            <span className="atharva-preview-note">Slow mornings, warm cups, and something sweet.</span>
            <span className="atharva-preview-link">TAKE A LOOK INSIDE ↗</span>
          </div>
          {/* Original artwork from the café demo; no image processing needed. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="atharva-preview-art" src="/demos/atharva-coffee/assets/coffee-hero.svg" alt="" loading="lazy" width="1000" height="1200" />
        </>
      ) : type === "coffee" ? (
        <>
          <span className="art-brand">
            daybreak<span>COFFEE & GOOD COMPANY</span>
          </span>
          <span className="coffee-art-sun">✳</span>
          <div className="project-coffee">
            <SculptureFallback color="#fff0cf" />
          </div>
          <span className="coffee-art-copy">
            A GOOD DAY
            <br />
            STARTS HERE.
          </span>
          <span className="art-bottom">YOUR NEIGHBOURHOOD PICK-ME-UP ↗</span>
        </>
      ) : type === "salon" ? (
        <>
          <span className="art-brand">
            GOODFORM<span>HAIR WITH PERSONALITY.</span>
          </span>
          <div className="salon-mirror">
            <div className="salon-wave" />
            <div className="salon-wave second" />
            <span>
              G<span>f</span>
            </span>
          </div>
          <div className="salon-comb" />
          <span className="salon-copy">
            Look good.
            <br />
            <em>Feel like you.</em>
          </span>
          <span className="art-bottom">CUT / COLOUR / A LITTLE CONFIDENCE</span>
        </>
      ) : (
        <>
          <span className="art-brand">
            homebase<span>GOOD PEOPLE. PROPER WORK.</span>
          </span>
          <div className="service-browser">
            <div className="service-browser-nav">
              <span>homebase.</span>
              <span>Let’s fix it ↗</span>
            </div>
            <div className="service-browser-body">
              <div>
                <span className="tiny-label">YOUR LOCAL HELPING HAND</span>
                <h3>
                  Home feels
                  <br />
                  better here.
                </h3>
                <p>Little fixes. Big peace of mind.</p>
                <span className="mock-button">Find your service ↗</span>
              </div>
              <div className="mini-house">
                <div className="house-roof" />
                <div className="house-wall" />
                <div className="house-window" />
                <div className="house-door" />
                <div className="house-tree" />
              </div>
            </div>
            <div className="service-browser-footer">
              <span>Repairs + Maintenance + Care</span>
              <span>CONCEPT DESIGN</span>
            </div>
          </div>
          <span className="art-bottom">
            A BETTER FIRST IMPRESSION, BUILT IN.
          </span>
        </>
      )}
    </div>
  );
}
