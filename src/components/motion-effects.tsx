"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export function MotionEffects() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-headline h1", {
        y: 30,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        clearProps: "all",
      });
      gsap.utils
        .toArray<HTMLElement>(
          ".section-heading, .studio-statement, .case-story > div, .services-section > div, .contact-section > h2",
        )
        .forEach((el) => {
          gsap.from(el, {
            y: 35,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 91%", once: true },
            clearProps: "all",
          });
        });
      gsap.to(".hero-art", {
        y: 70,
        rotate: 7,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    });
    const cleanups: (() => void)[] = [];
    if (
      matchMedia("(pointer:fine) and (prefers-reduced-motion:no-preference)")
        .matches
    ) {
      document.querySelectorAll<HTMLElement>(".pill-button").forEach((el) => {
        const move = (event: MouseEvent) => {
          const r = el.getBoundingClientRect();
          gsap.to(el, {
            x: (event.clientX - r.left - r.width / 2) * 0.12,
            y: (event.clientY - r.top - r.height / 2) * 0.2,
            duration: 0.35,
          });
        };
        const leave = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,.4)" });
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", leave);
          gsap.killTweensOf(el);
        });
      });
    }
    return () => {
      media.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);
  return null;
}
