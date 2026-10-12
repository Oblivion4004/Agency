"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, X, Menu } from "lucide-react";
export function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [
      ...document.querySelectorAll<HTMLElement>("main, .site-footer"),
    ];
    const previousInert = background.map((element) => element.inert);
    background.forEach((element) => {
      element.inert = true;
    });
    const desktop = matchMedia("(min-width: 701px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
      if (e.key === "Tab") {
        const links = nav.current?.querySelectorAll<HTMLAnchorElement>("a");
        if (!links?.length) return;
        const first = toggle.current;
        const last = links[links.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((element, index) => {
        element.inert = previousInert[index];
      });
      desktop.removeEventListener("change", closeOnDesktop);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="Atrixx home">
        atrixx<span className="wordmark-star">✳</span>
      </Link>
      <span className="header-descriptor">INDEPENDENT DIGITAL STUDIO</span>
      <button
        ref={toggle}
        className="menu-toggle"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="main-nav"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        id="main-nav"
        ref={nav}
        className={open ? "navigation open" : "navigation"}
        aria-label="Main navigation"
      >
        {[
          ["Work", "/#work"],
          ["Studio", "/#studio"],
          ["Lab", "/#lab"],
        ].map(([label, href]) => (
          <Link key={label} href={href} onClick={() => setOpen(false)}>
            {label}
          </Link>
        ))}
        <Link
          href="/#contact"
          className="header-contact"
          onClick={() => setOpen(false)}
        >
          Let’s talk <ArrowUpRight size={16} />
        </Link>
      </nav>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <Link className="wordmark" href="/">
        atrixx<span className="wordmark-star">✳</span>
      </Link>
      <span>Independent minds. Extraordinary possibilities.</span>
      <div>
        <span>© {new Date().getFullYear()} ATRIXX</span>
        <Link href="/privacy">Privacy</Link>
        <a href="#top" aria-label="Back to top">
          ↑
        </a>
      </div>
    </footer>
  );
}
