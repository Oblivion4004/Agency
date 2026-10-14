import { afterEach, describe, expect, it, vi } from "vitest";
import { handleContact, validateInquiry, type ContactEnv } from "./contact";
const valid = {
  name: "Test Person",
  email: "test@example.com",
  service: "Custom website",
  message: "A thoughtful website for our new business.",
  consent: true,
  website: "",
  token: "test-token",
};
const env: ContactEnv = {
  RESEND_API_KEY: "test",
  CONTACT_FROM_EMAIL: "studio@example.com",
  CONTACT_TO_EMAIL: "owner@example.com",
  TURNSTILE_SECRET_KEY: "test",
  TURNSTILE_SITE_KEY: "public",
  UPSTASH_REDIS_REST_URL: "https://redis.example.com",
  UPSTASH_REDIS_REST_TOKEN: "test",
  RATE_LIMIT_SALT: "test",
  SITE_URL: "https://studio.example.com",
};
const request = (
  body: unknown = valid,
  origin = "https://studio.example.com",
) =>
  new Request("https://studio.example.com/api/contact", {
    method: "POST",
    headers: { origin, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
afterEach(() => vi.unstubAllGlobals());
describe("inquiry validation", () => {
  it("accepts an inquiry without a budget", () =>
    expect(validateInquiry(valid).errors).toEqual({}));
  it.each(["Cafe website we want", "Hi", "a"])(
    "accepts a short message: %s",
    (message) => expect(validateInquiry({ ...valid, message }).errors).toEqual({}),
  );
  it("still requires a nonblank message", () =>
    expect(validateInquiry({ ...valid, message: " \n\t " }).errors.message).toBeTruthy());
  it("rejects missing fields", () =>
    expect(Object.keys(validateInquiry({}).errors)).toEqual([
      "name",
      "email",
      "service",
      "message",
      "consent",
    ]));
  it("rejects invalid field types and header injection", () => {
    expect(validateInquiry({ ...valid, name: 7 }).errors.name).toBeTruthy();
    expect(
      validateInquiry({ ...valid, email: "x@y.com\r\nBcc:a@b.com" }).errors
        .email,
    ).toBeTruthy();
  });
  it("bounds message size", () =>
    expect(
      validateInquiry({ ...valid, message: "a".repeat(4001) }).errors.message,
    ).toBeTruthy());
});
describe("contact endpoint", () => {
  it("reports configuration without leaking secrets", async () => {
    const response = await handleContact(
      new Request("https://studio.example.com/api/contact"),
      env,
    );
    expect(await response.json()).toEqual({ ready: true, siteKey: "public" });
  });
  it("rejects cross-origin requests before external calls", async () => {
    const mock = vi.fn();
    vi.stubGlobal("fetch", mock);
    expect(
      (await handleContact(request(valid, "https://evil.example.com"), env))
        .status,
    ).toBe(403);
    expect(mock).not.toHaveBeenCalled();
  });
  it("rejects malformed bodies", async () =>
    expect((await handleContact(request(null), env)).status).toBe(400));
  it("rejects oversized bodies", async () =>
    expect(
      (
        await handleContact(
          request({ ...valid, message: "a".repeat(17000) }),
          env,
        )
      ).status,
    ).toBe(413));
  it("catches the honeypot", async () =>
    expect(
      (await handleContact(request({ ...valid, website: "spam" }), env)).status,
    ).toBe(400));
  it("never claims delivery without configuration", async () => {
    const response = await handleContact(request(), {});
    expect(response.status).toBe(503);
    expect((await response.json()).error).toContain("not been sent");
  });
  it("requires a challenge token", async () =>
    expect(
      (await handleContact(request({ ...valid, token: "" }), env)).status,
    ).toBe(400));
  it("stops rate-limited requests", async () => {
    const mock = vi.fn().mockResolvedValue(Response.json({ result: 6 }));
    vi.stubGlobal("fetch", mock);
    expect((await handleContact(request(), env)).status).toBe(429);
    expect(mock).toHaveBeenCalledTimes(1);
  });
  it("rejects invalid challenge hostname", async () => {
    const mock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ result: 1 }))
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          hostname: "evil.example.com",
          action: "contact",
        }),
      );
    vi.stubGlobal("fetch", mock);
    expect((await handleContact(request(), env)).status).toBe(400);
    expect(mock).toHaveBeenCalledTimes(2);
  });
  it("fails closed when spam protection is unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(Error("offline")));
    expect((await handleContact(request(), env)).status).toBe(503);
  });
  it("reports provider failure honestly", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(Response.json({ result: 1 }))
        .mockResolvedValueOnce(
          Response.json({
            success: true,
            hostname: "studio.example.com",
            action: "contact",
          }),
        )
        .mockResolvedValueOnce(
          Response.json({ error: "failed" }, { status: 500 }),
        ),
    );
    expect((await handleContact(request(), env)).status).toBe(503);
  });
  it("confirms a provider-accepted message", async () => {
    const mock = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ result: 1 }))
      .mockResolvedValueOnce(
        Response.json({
          success: true,
          hostname: "studio.example.com",
          action: "contact",
        }),
      )
      .mockResolvedValueOnce(Response.json({ id: "email-test" }));
    vi.stubGlobal("fetch", mock);
    expect((await handleContact(request(), env)).status).toBe(200);
    const sent = JSON.parse(mock.mock.calls[2][1].body);
    expect(sent.to).toEqual(["owner@example.com"]);
    expect(sent.reply_to).toBe(valid.email);
    expect(sent.text).toContain(valid.message);
    expect(sent.text).not.toContain("Budget:");
  });
});
