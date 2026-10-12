"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { budgets, services, validateInquiry } from "@/lib/contact";
type Turnstile = {
  render: (element: HTMLElement, options: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}
export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "success">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [notice, setNotice] = useState("");
  const [config, setConfig] = useState<{
    ready: boolean;
    siteKey: string | null;
  } | null>(null);
  const [token, setToken] = useState("");
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const form = useRef<HTMLFormElement>(null);
  const status = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/contact", { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then(setConfig)
      .catch(() => {
        if (!controller.signal.aborted)
          setConfig({ ready: false, siteKey: null });
      });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    if (!config?.siteKey || !widget.current) return;
    let cancelled = false;
    const render = () => {
      if (cancelled || !widget.current || !window.turnstile) return;
      widgetId.current = window.turnstile.render(widget.current, {
        sitekey: config.siteKey,
        theme: "dark",
        action: "contact",
        callback: (value: string) => setToken(value),
        "expired-callback": () => setToken(""),
        "error-callback": () => {
          setToken("");
          setNotice(
            "The security check could not load. Please try again shortly.",
          );
        },
      });
    };
    let script: HTMLScriptElement | undefined;
    if (window.turnstile) render();
    else {
      script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.onload = render;
      script.onerror = () =>
        setNotice(
          "The security check could not load. Please try again shortly.",
        );
      document.head.append(script);
    }
    return () => {
      cancelled = true;
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
      script?.remove();
    };
  }, [config]);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const payload = { ...values, consent: values.consent === "on", token };
    const checked = validateInquiry(payload);
    setErrors(checked.errors);
    setNotice("");
    if (!checked.data) {
      const field = Object.keys(checked.errors)[0];
      form.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
      return;
    }
    if (!config?.ready) {
      setNotice(
        "Inquiry delivery is not available yet. Your message has not been sent. Please try again later.",
      );
      return;
    }
    if (!token) {
      setNotice("Please complete the security check below.");
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(35000),
      });
      const result = await res.json();
      if (!res.ok) {
        setErrors(result.errors ?? {});
        throw Error(
          result.error ||
            "Your inquiry could not be delivered. Please try again.",
        );
      }
      setState("success");
      setNotice(result.message);
      form.current?.reset();
      requestAnimationFrame(() => status.current?.focus());
    } catch (error) {
      setState("idle");
      setNotice(
        error instanceof Error && error.name !== "TimeoutError"
          ? error.message
          : "We couldn’t confirm delivery. Please try again shortly.",
      );
    } finally {
      setToken("");
      if (widgetId.current) window.turnstile?.reset(widgetId.current);
    }
  }
  const invalid = (name: string) => ({
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `error-${name}` : undefined,
  });
  return (
    <form ref={form} className="contact-form" onSubmit={submit} noValidate>
      <div className="form-row">
        <label>
          Your name <span>*</span>
          <input
            name="name"
            autoComplete="name"
            placeholder="How should we call you?"
            maxLength={100}
            required
            {...invalid("name")}
          />
          {errors.name && <small id="error-name">{errors.name}</small>}
        </label>
        <label>
          Email address <span>*</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            maxLength={254}
            required
            {...invalid("email")}
          />
          {errors.email && <small id="error-email">{errors.email}</small>}
        </label>
      </div>
      <div className="form-row">
        <label>
          What does your business need? <span>*</span>
          <select
            name="service"
            defaultValue=""
            required
            {...invalid("service")}
          >
            <option value="" disabled>
              Select a project type
            </option>
            {services.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          {errors.service && <small id="error-service">{errors.service}</small>}
        </label>
        <label>
          Approximate budget <span>*</span>
          <select
            name="budget"
            defaultValue="Let’s discuss"
            {...invalid("budget")}
          >
            {budgets.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          {errors.budget && <small id="error-budget">{errors.budget}</small>}
        </label>
      </div>
      <label>
        A little about your idea <span>*</span>
        <textarea
          name="message"
          rows={3}
          minLength={20}
          maxLength={4000}
          placeholder="Your business, your customers, and what your website should help them do…"
          required
          {...invalid("message")}
        />
        {errors.message && <small id="error-message">{errors.message}</small>}
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Leave this empty
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent">
        <input
          type="checkbox"
          name="consent"
          required
          {...invalid("consent")}
        />
        <span>
          I agree to the <Link href="/privacy">privacy notice</Link> and consent
          to being contacted about this inquiry.
        </span>
      </label>
      {errors.consent && <small id="error-consent">{errors.consent}</small>}
      <div ref={widget} className="security-check" />
      {config && !config.ready && (
        <p className="form-availability">
          The inquiry desk is being set up. Feel free to draft your brief;
          sending will be available soon.
        </p>
      )}
      <div className="form-submit">
        <button
          type="submit"
          className="pill-button primary"
          disabled={state === "sending"}
        >
          {state === "sending"
            ? "Sending your idea…"
            : state === "success"
              ? "Send another inquiry"
              : "Let’s level up"}
          <ArrowUpRight size={18} />
        </button>
        <span>YOUR NEXT LEVEL STARTS HERE.</span>
      </div>
      <div
        ref={status}
        tabIndex={-1}
        className={`form-status ${state === "success" ? "success" : ""}`}
        role="status"
        aria-live="polite"
      >
        {state === "success" && <Check size={17} />}
        <span>{notice || errors.form}</span>
      </div>
    </form>
  );
}
