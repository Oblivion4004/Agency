import gsap from "gsap";
import type { RefObject } from "react";

/** Project the animated rim into an SVG river spanning the section boundary. */
export function createCoffeeSpill(
  stage: HTMLElement,
  progress: RefObject<number>,
  originRef: RefObject<{ x: number; y: number } | null>,
  wash: RefObject<number>,
) {
  const main = document.querySelector<HTMLElement>(".home-page");
  const svg = document.querySelector<SVGSVGElement>(".page-coffee-spill");
  const river = svg?.querySelector(".spill-river");
  const crema = svg?.querySelector(".spill-crema");
  const runway = document.querySelector<HTMLElement>(".spill-runway");
  const art = stage.querySelector<HTMLElement>(".hero-art");
  const paper = gsap.utils.interpolate("#a36738", "#f0e5d3");
  const ink = gsap.utils.interpolate("#f6f0e7", "#36261d");
  const muted = gsap.utils.interpolate("#b2abbc", "#71604e");
  const liquid = gsap.utils.interpolate("#a36738", "#f0e5d3");
  let last = -1;
  let visible = true;
  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { rootMargin: "100px" },
  );
  const hero = document.querySelector(".arcade-hero");
  if (hero) observer.observe(hero);
  // The runway can be visible after the hero leaves the viewport.
  let poolVisible = false;
  const poolObserver = new IntersectionObserver(
    ([entry]) => {
      poolVisible = entry.isIntersecting;
    },
    { rootMargin: "100px" },
  );
  if (runway) poolObserver.observe(runway);
  const draw = () => {
    if (!main || !svg || !river || !crema || !runway || !art) return;
    const amount = Math.min(1, Math.max(0, (progress.current - 0.52) / 0.48));
    const spreadAmount = Math.min(1, Math.max(0, (amount - 0.22) / 0.78));
    const fill = wash.current;
    if (last !== fill) {
      main.style.setProperty("--spill-paper", paper(fill));
      main.style.setProperty("--spill-ink", ink(fill));
      main.style.setProperty("--spill-muted", muted(fill));
      main.style.setProperty("--spill-liquid", liquid(fill));
      last = fill;
    }
    svg.style.opacity = amount > 0 ? "1" : "0";
    if (!amount) return;
    if (!visible && !poolVisible) return;
    const box = art.getBoundingClientRect();
    const mainBox = main.getBoundingClientRect();
    const poolBox = runway.getBoundingClientRect();
    if (poolBox.bottom < 0 || box.top > innerHeight) return;
    const canvas = art.querySelector("canvas");
    const point = art.querySelector(".fallback-rim")?.getBoundingClientRect();
    const origin = canvas && originRef.current;
    const x = origin
      ? box.left + origin.x - mainBox.left
      : (point ? point.left + point.width / 2 : box.left + box.width * 0.28) -
        mainBox.left;
    const y = origin
      ? box.top + origin.y - mainBox.top
      : (point ? point.top + point.height / 2 : box.top + box.height * 0.45) -
        mainBox.top;
    const width = mainBox.width;
    const floor = poolBox.bottom - mainBox.top + 2;
    const landing = poolBox.top - mainBox.top + poolBox.height * 0.5;
    const reach = Math.min(1, amount / 0.45);
    const endY = y + (landing - y) * reach;
    const endX = x - width * 0.23 * reach;
    const left = endX + (-20 - endX) * spreadAmount;
    const right = endX + (width + 20 - endX) * spreadAmount;
    const neck = 15 + amount * 55;
    svg.setAttribute("viewBox", `0 0 ${width} ${floor}`);
    svg.style.height = `${floor}px`;
    river.setAttribute(
      "d",
      `M ${x} ${y} C ${x - 15} ${y + 75}, ${endX - 45} ${endY - 100}, ${endX} ${endY} C ${endX + 25} ${endY + 60}, ${right - 50} ${endY + 15}, ${right} ${endY + 80} L ${right} ${floor} L ${left} ${floor} L ${left} ${endY + 85} C ${left + 20} ${endY + 40}, ${endX - 85} ${endY + 60}, ${endX - neck} ${endY - 10} C ${endX - 70} ${endY - 100}, ${x - 40} ${y + 70}, ${x - 12} ${y - 3} Z`,
    );
    crema.setAttribute(
      "d",
      `M ${x - 9} ${y + 12} C ${x - 35} ${y + 95}, ${endX - 62} ${endY - 90}, ${endX - 12} ${endY} C ${endX + 30} ${endY + 60}, ${right - 55} ${endY + 30}, ${right - 15} ${endY + 85}`,
    );
    crema.setAttribute("opacity", String((1 - fill) * 0.6));
  };
  gsap.ticker.add(draw);
  return () => {
    gsap.ticker.remove(draw);
    observer.disconnect();
    poolObserver.disconnect();
    svg?.style.removeProperty("opacity");
    ["--spill-paper", "--spill-ink", "--spill-muted", "--spill-liquid"].forEach(
      (key) => main?.style.removeProperty(key),
    );
  };
}
