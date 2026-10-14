"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sculpture } from "./sculpture";
const finishes = [
  { name: "Peach", color: "#ff9669" },
  { name: "Lilac", color: "#b99aff" },
  { name: "Mint", color: "#b8ddaf" },
];
export function CoffeeStage() {
  const stage = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 701px)",
        motion: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        if (!context.conditions?.motion || !stage.current) return;
        const desktop = context.conditions.desktop;
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: desktop ? ".arcade-hero-grid" : stage.current,
            start: desktop ? "top top" : "top 55%",
            end: desktop ? "+=850" : "bottom 15%",
            pin: desktop ? ".arcade-hero-grid" : false,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
        timeline.to(progress, { current: 1, duration: 1, ease: "none" }, 0);
        timeline.to(
          stage.current,
          { "--cup-turn": "180deg", duration: 1, ease: "none" },
          0,
        );
        timeline.set(
          stage.current,
          { "--face-show": 0, "--globe-show": 1 },
          0.5,
        );
        return () => {
          progress.current = 0;
        };
      },
    );
    return () => media.revert();
  }, []);
  const [finish, setFinish] = useState(0);
  return (
    <div ref={stage} className="coffee-experience">
      <div className="coffee-orbit" aria-hidden="true" />
      <span className="arcade-spark spark-one" aria-hidden="true">
        ✦
      </span>
      <span className="arcade-spark spark-two" aria-hidden="true">
        +
      </span>
      <div className="coffee-sticker">
        FRESH IDEAS.
        <br />
        <strong>EXTRA SHOT.</strong>
        <span>✳</span>
      </div>
      <div className="hero-art">
        <Sculpture color={finishes[finish].color} progress={progress} />
      </div>
      <div className="coffee-controls">
        <span>CHOOSE YOUR CUP</span>
        <div role="group" aria-label="Coffee cup color">
          {finishes.map((f, i) => (
            <button
              key={f.name}
              aria-label={`${f.name} cup`}
              aria-pressed={finish === i}
              onClick={() => setFinish(i)}
              style={{ "--swatch": f.color } as React.CSSProperties}
            >
              <i />
            </button>
          ))}
        </div>
        <span className="cup-color" aria-live="polite">
          {finishes[finish].name}
        </span>
      </div>
      <span className="coffee-coordinate">
        SCROLL TO TURN. YOUR WORLD, ONLINE.
      </span>
    </div>
  );
}
