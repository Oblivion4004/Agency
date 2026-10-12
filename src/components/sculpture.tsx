"use client";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState } from "react";
import { SculptureFallback } from "./sculpture-fallback";
function ProductFallback() {
  return (
    <div className="product-fallback">
      <div className="speaker">
        <div className="speaker-top" />
        <div className="speaker-body" />
        <span className="speaker-led" />
      </div>
    </div>
  );
}
const Canvas = dynamic(() => import("./sculpture-canvas"), {
  ssr: false,
  loading: () => <SculptureFallback />,
});
class SceneBoundary extends Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SculptureFallback /> : this.props.children;
  }
}
export function Sculpture({
  color,
  product = false,
}: {
  color?: string;
  product?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 700px)");
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean };
    };
    const check = () => {
      if (reduced.matches || small.matches || nav.connection?.saveData) {
        setEnabled(false);
        return;
      }
      let webgl = false;
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("webgl2") || canvas.getContext("webgl");
        webgl = !!ctx;
        ctx?.getExtension("WEBGL_lose_context")?.loseContext();
      } catch {}
      setEnabled(webgl);
    };
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) timer = setTimeout(check, 200);
      },
      { rootMargin: "80px" },
    );
    if (root.current) observer.observe(root.current);
    reduced.addEventListener("change", check);
    small.addEventListener("change", check);
    return () => {
      observer.disconnect();
      clearTimeout(timer);
      reduced.removeEventListener("change", check);
      small.removeEventListener("change", check);
    };
  }, []);
  return (
    <div ref={root} className="sculpture-stage" aria-hidden="true">
      {enabled && !failed ? (
        <SceneBoundary>
          <Canvas
            color={color}
            product={product}
            active={visible}
            onFailure={() => setFailed(true)}
          />
        </SceneBoundary>
      ) : product ? (
        <ProductFallback />
      ) : (
        <SculptureFallback />
      )}
    </div>
  );
}
