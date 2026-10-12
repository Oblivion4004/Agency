import type { Project } from "@/lib/projects";
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
      {type === "audio" ? (
        <>
          <span className="art-brand">aura®</span>
          <span className="art-caption">FEEL EVERY FREQUENCY.</span>
          <div className="speaker">
            <div className="speaker-top" />
            <div className="speaker-body" />
            <span className="speaker-led" />
          </div>
          <span className="art-bottom">Sound, thoughtfully shaped.</span>
          <span className="art-number">A—01</span>
        </>
      ) : type === "architecture" ? (
        <>
          <span className="art-brand">
            MONUMENT<span className="brand-dot">®</span>
          </span>
          <div className="building">
            <div className="building-main" />
            <div className="building-side" />
            <div className="building-cut" />
            <div className="building-stair" />
          </div>
          <span className="architecture-copy">
            Built for
            <br />
            <em>what’s next.</em>
          </span>
          <span className="art-bottom">
            SPACES WITH INTENTION — CONCEPT STUDY
          </span>
        </>
      ) : (
        <>
          <span className="art-brand">
            orbit<span className="brand-dot">✳</span>
          </span>
          <div className="dashboard">
            <div className="dash-sidebar">
              ◉<br />
              <br />⌘<br />↗<br />◷
            </div>
            <div className="dash-main">
              <span className="dash-label">Your financial overview</span>
              <h3>A little more clarity.</h3>
              <div className="balance">
                <span>Total balance</span>
                <strong>
                  ₹84,250<span>.00</span>
                </strong>
              </div>
              <div className="chart">
                {[25, 40, 34, 58, 48, 70, 60, 82, 74, 100, 90, 114].map(
                  (height, i) => (
                    <i key={i} style={{ height }} />
                  ),
                )}
              </div>
              <div className="dash-foot">
                <span>Overview</span>
                <span>Illustrative data ↗</span>
              </div>
            </div>
          </div>
          <span className="art-bottom">A CLEARER PICTURE.</span>
        </>
      )}
    </div>
  );
}
