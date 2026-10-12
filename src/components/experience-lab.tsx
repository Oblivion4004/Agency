"use client";
import { useState, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, RotateCcw, MoveUpRight } from "lucide-react";
import { Sculpture } from "./sculpture";
const tabs = [
  "Product playground",
  "Useful little details",
  "Pixel playground",
];
export function ExperienceLab() {
  const [tab, setTab] = useState(0);
  const [material, setMaterial] = useState(0);
  const [period, setPeriod] = useState("Week");
  const [spread, setSpread] = useState(false);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const reduced = useReducedMotion();
  const colors = ["#adb997", "#c8a079", "#bac0d2"];
  return (
    <div className="experience-lab">
      <div className="lab-tabs" role="tablist" aria-label="Experiments">
        {tabs.map((name, i) => (
          <button
            key={name}
            id={`tab-${i}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            aria-selected={tab === i}
            aria-controls={`panel-${i}`}
            tabIndex={tab === i ? 0 : -1}
            onClick={() => setTab(i)}
            onKeyDown={(e) => {
              let n = i;
              if (e.key === "ArrowRight") n = (i + 1) % 3;
              else if (e.key === "ArrowLeft") n = (i + 2) % 3;
              else if (e.key === "Home") n = 0;
              else if (e.key === "End") n = 2;
              else return;
              e.preventDefault();
              setTab(n);
              refs.current[n]?.focus();
            }}
          >
            <span>0{i + 1}</span>
            {name}
            <ArrowUpRight size={13} />
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        className={`lab-panel panel-${tab}`}
      >
        {tab === 0 ? (
          <>
            <div className="lab-panel-copy">
              <span className="eyebrow">POWER-UP 001 / PRODUCT DISCOVERY</span>
              <h3>
                A closer look.
                <br />A better impression.
              </h3>
              <p>
                Move your cursor. Change the finish.
                <br />
                Let customers explore what makes your product special.
              </p>
              <div
                className="material-options"
                role="group"
                aria-label="Product finish"
              >
                {["Sage chrome", "Warm brass", "Cool silver"].map((name, i) => (
                  <button
                    key={name}
                    onClick={() => setMaterial(i)}
                    aria-pressed={material === i}
                    aria-label={name}
                    style={{ background: colors[i] }}
                  />
                ))}
                <span>
                  {["Sage chrome", "Warm brass", "Cool silver"][material]}
                </span>
              </div>
            </div>
            <div
              className="lab-sculpture"
              style={{
                filter:
                  material === 1
                    ? "sepia(.45)"
                    : material === 2
                      ? "saturate(.15)"
                      : "none",
              }}
            >
              <Sculpture color={colors[material]} product />
            </div>
            <span className="lab-caption">
              TRY A FINISH · INTERACTIVE PRODUCT CONCEPT
            </span>
          </>
        ) : tab === 1 ? (
          <>
            <div className="lab-panel-copy">
              <span className="eyebrow">POWER-UP 002 / CLEAR INFORMATION</span>
              <h3>
                Useful can be
                <br />
                delightful, too.
              </h3>
              <p>
                Switch the time frame to see how
                <br />
                motion makes a change feel natural.
              </p>
              <span className="lab-demo-label">
                EXPERIMENTAL UI · ILLUSTRATIVE DATA
              </span>
            </div>
            <div className="interactive-dashboard">
              <div className="mini-dash-top">
                <span>Activity overview</span>
                <MoveUpRight size={18} />
              </div>
              <strong>
                {period === "Week"
                  ? "128"
                  : period === "Month"
                    ? "486"
                    : "5,820"}
                <span> visits</span>
              </strong>
              <div
                className="period-controls"
                role="group"
                aria-label="Chart time frame"
              >
                {["Week", "Month", "Year"].map((p) => (
                  <button
                    key={p}
                    aria-pressed={p === period}
                    onClick={() => setPeriod(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <div className="live-bars">
                {[45, 72, 48, 96, 65, 110, 92, 135, 115].map((h, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      height:
                        period === "Week"
                          ? h
                          : period === "Month"
                            ? h * (i % 2 ? 0.7 : 1.1)
                            : h * (i % 3 ? 0.9 : 1.2),
                    }}
                    transition={{
                      duration: reduced ? 0 : 0.6,
                      delay: reduced ? 0 : i * 0.025,
                    }}
                  />
                ))}
              </div>
              <div className="mini-dash-bottom">
                <span>Start of {period.toLowerCase()}</span>
                <span>Now</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="lab-panel-copy">
              <span className="eyebrow">
                POWER-UP 003 / A LITTLE PERSONALITY
              </span>
              <h3>
                A little input.
                <br />A different outcome.
              </h3>
              <p>
                Move across the field to bend the light.
                <br />
                Tap the control to rearrange its form.
              </p>
              <button
                className="pill-button"
                onClick={() => setSpread(!spread)}
              >
                <RotateCcw size={15} />
                {spread ? "Gather the field" : "Expand the field"}
              </button>
            </div>
            <div
              className="reactive-field"
              onPointerMove={(e) => {
                if (reduced || e.pointerType === "touch") return;
                const r = e.currentTarget.getBoundingClientRect();
                setPointer({
                  x: ((e.clientX - r.left) / r.width) * 100,
                  y: ((e.clientY - r.top) / r.height) * 100,
                });
              }}
              onPointerLeave={() => setPointer({ x: 50, y: 50 })}
              aria-hidden="true"
            >
              {Array.from({ length: 49 }, (_, i) => (
                <motion.i
                  key={i}
                  animate={{
                    x: spread ? ((i % 7) - 3) * 12 : 0,
                    y: spread ? (Math.floor(i / 7) - 3) * 12 : 0,
                    rotate: spread ? 45 : 0,
                    scale:
                      1 -
                      Math.min(
                        0.7,
                        Math.hypot(
                          (i % 7) * 16.7 - pointer.x,
                          Math.floor(i / 7) * 16.7 - pointer.y,
                        ) / 150,
                      ),
                  }}
                  transition={{ duration: reduced ? 0 : 0.5 }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
