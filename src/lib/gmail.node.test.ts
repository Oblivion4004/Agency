import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import nodemailer from "nodemailer";
import { handleContact, type ContactEnv } from "./contact";
import { gmailDelivery } from "./gmail.node";

vi.mock("nodemailer", () => ({ default: { createTransport: vi.fn() } }));
const sendMail = vi.fn();
const close = vi.fn();
const env: ContactEnv = {
  EMAIL_PROVIDER: "gmail",
  GMAIL_USER: "sender@gmail.com",
  GMAIL_APP_PASSWORD: "test app password",
  CONTACT_TO_EMAIL: "owner@example.com",
  TURNSTILE_SITE_KEY: "public",
  TURNSTILE_SECRET_KEY: "test-secret",
  UPSTASH_REDIS_REST_URL: "https://redis.example.com",
  UPSTASH_REDIS_REST_TOKEN: "test-redis",
  RATE_LIMIT_SALT: "test-salt",
  SITE_URL: "https://studio.example.com",
};
function request() {
  return new Request("https://studio.example.com/api/contact", {
    method: "POST",
    headers: {
      origin: "https://studio.example.com",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      name: "Visitor",
      email: "visitor@example.com",
      service: "Custom website",
      message: "Cafe website we want",
      consent: true,
      website: "",
      token: "challenge",
    }),
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  vi.mocked(nodemailer.createTransport).mockReturnValue({
    sendMail,
    close,
  } as never);
  sendMail.mockResolvedValue({
    accepted: [env.CONTACT_TO_EMAIL],
    rejected: [],
  });
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
      ),
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("Gmail contact delivery", () => {
  it("uses the authenticated sender and configured recipient after spam checks", async () => {
    const response = await handleContact(request(), env, {
      delivery: gmailDelivery(env),
      clientIp: "shared",
    });
    expect(response.status).toBe(200);
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: { user: "sender@gmail.com", pass: "testapppassword" },
      }),
    );
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: { name: "Arvion Studios", address: "sender@gmail.com" },
        to: "owner@example.com",
        replyTo: "visitor@example.com",
        text: expect.stringContaining("Cafe website we want"),
      }),
    );
    expect(close).toHaveBeenCalledOnce();
  });
  it("does not report ready or expose secrets without an App Password", async () => {
    const incomplete = { ...env, GMAIL_APP_PASSWORD: "" };
    const response = await handleContact(
      new Request("https://studio.example.com/api/contact"),
      incomplete,
      { delivery: gmailDelivery(incomplete) },
    );
    expect(await response.json()).toEqual({ ready: false, siteKey: null });
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });
  it("does not fall back to Resend when Gmail has no compatible runtime", async () => {
    const response = await handleContact(request(), {
      ...env,
      RESEND_API_KEY: "legacy",
      CONTACT_FROM_EMAIL: "legacy@example.com",
    });
    expect(response.status).toBe(503);
    expect(fetch).not.toHaveBeenCalled();
  });
  it("does not send when rate limited", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(Response.json({ result: 6 })),
    );
    expect(
      (await handleContact(request(), env, { delivery: gmailDelivery(env) }))
        .status,
    ).toBe(429);
    expect(sendMail).not.toHaveBeenCalled();
  });
  it("does not send when the security challenge fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(Response.json({ result: 1 }))
        .mockResolvedValueOnce(Response.json({ success: false })),
    );
    expect(
      (await handleContact(request(), env, { delivery: gmailDelivery(env) }))
        .status,
    ).toBe(400);
    expect(sendMail).not.toHaveBeenCalled();
  });
  it.each(["rejected", "connection failed"])(
    "reports SMTP failure: %s",
    async (failure) => {
      if (failure === "rejected")
        sendMail.mockResolvedValue({
          accepted: [],
          rejected: [env.CONTACT_TO_EMAIL],
        });
      else sendMail.mockRejectedValue(Error("private SMTP diagnostic"));
      const response = await handleContact(request(), env, {
        delivery: gmailDelivery(env),
      });
      expect(response.status).toBe(503);
      expect(await response.text()).not.toContain("private SMTP diagnostic");
      expect(close).toHaveBeenCalledOnce();
    },
  );
});
