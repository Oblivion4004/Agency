"use client";
import { useState } from "react";
import { Sculpture } from "./sculpture";
const finishes = [
  { name: "Peach", color: "#ff9669" },
  { name: "Lilac", color: "#b99aff" },
  { name: "Mint", color: "#b8ddaf" },
];
export function CoffeeStage() {
  const [finish, setFinish] = useState(0);
  return (
    <div className="coffee-experience">
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
        <Sculpture color={finishes[finish].color} />
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
      <span className="coffee-coordinate">GOOD COFFEE. BETTER WEBSITES.</span>
    </div>
  );
}
