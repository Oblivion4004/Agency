export const services = [
  "Custom website",
  "Immersive experience",
  "Digital product",
  "Something else",
];
export const budgets = [
  "Let’s discuss",
  "Under ₹1 lakh",
  "₹1–3 lakh",
  "₹3–7 lakh",
  "₹7 lakh+",
];
export type Inquiry = {
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  consent: boolean;
  website: string;
  token: string;
};
export function validateInquiry(value: unknown): {
  data?: Inquiry;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  if (!value || typeof value !== "object" || Array.isArray(value))
    return { errors: { form: "Please provide a valid inquiry." } };
  const raw = value as Record<string, unknown>;
  const str = (key: string) =>
    typeof raw[key] === "string" ? (raw[key] as string).trim() : "";
  const data: Inquiry = {
    name: str("name"),
    email: str("email"),
    service: str("service"),
    budget: str("budget"),
    message: str("message"),
    consent: raw.consent === true,
    website: str("website"),
    token: str("token"),
  };
  if (data.name.length < 2 || data.name.length > 100)
    errors.name = "Please enter your name (2–100 characters).";
  if (
    data.email.length > 254 ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
    /[\r\n]/.test(data.email)
  )
    errors.email = "Please enter a valid email address.";
  if (!services.includes(data.service))
    errors.service = "Choose a project type.";
  if (!budgets.includes(data.budget))
    errors.budget = "Choose an approximate budget.";
  if (data.message.length < 20 || data.message.length > 4000)
    errors.message = "Tell us a little more (20–4,000 characters).";
  if (!data.consent)
    errors.consent = "Please agree so we can respond to your inquiry.";
  if (data.token.length > 2048)
    errors.form = "Please refresh the security check.";
  return { data: Object.keys(errors).length ? undefined : data, errors };
}
export type ContactEnv = Partial<
  Record<
    | "RESEND_API_KEY"
    | "CONTACT_FROM_EMAIL"
    | "CONTACT_TO_EMAIL"
    | "TURNSTILE_SECRET_KEY"
    | "TURNSTILE_SITE_KEY"
    | "UPSTASH_REDIS_REST_URL"
    | "UPSTASH_REDIS_REST_TOKEN"
    | "RATE_LIMIT_SALT"
    | "SITE_URL",
    string
  >
>;
export function contactReady(env: ContactEnv) {
  return [
    "RESEND_API_KEY",
    "CONTACT_FROM_EMAIL",
    "CONTACT_TO_EMAIL",
    "TURNSTILE_SECRET_KEY",
    "TURNSTILE_SITE_KEY",
    "UPSTASH_REDIS_REST_URL",
    "UPSTASH_REDIS_REST_TOKEN",
    "RATE_LIMIT_SALT",
  ].every((key) => Boolean(env[key as keyof ContactEnv]));
}
const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
async function remote(url: string, init: RequestInit) {
  return fetch(url, { ...init, signal: AbortSignal.timeout(10000) });
}
export async function handleContact(request: Request, env: ContactEnv) {
  if (request.method === "GET")
    return json({
      ready: contactReady(env),
      siteKey: contactReady(env) ? env.TURNSTILE_SITE_KEY : null,
    });
  if (request.method !== "POST")
    return json({ error: "Method not allowed." }, 405);
  const origin = request.headers.get("origin");
  const expected = env.SITE_URL
    ? new URL(env.SITE_URL).origin
    : new URL(request.url).origin;
  if (!origin || origin !== expected)
    return json({ error: "This request could not be verified." }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return json({ error: "Please send a valid inquiry." }, 415);
  if (Number(request.headers.get("content-length")) > 16000)
    return json({ error: "Your inquiry is too long." }, 413);
  let raw: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Please send a valid inquiry." }, 400);
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 16000) {
        await reader.cancel();
        return json({ error: "Your inquiry is too long." }, 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    raw = JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return json({ error: "Please send a valid inquiry." }, 400);
  }
  const { data, errors } = validateInquiry(raw);
  if (!data)
    return json({ error: "Please check the highlighted fields.", errors }, 400);
  if (data.website)
    return json({ error: "This request could not be verified." }, 400);
  if (!contactReady(env))
    return json(
      {
        error:
          "Inquiry delivery is not available yet. Your message has not been sent. Please try again later.",
      },
      503,
    );
  if (!data.token)
    return json({ error: "Please complete the security check." }, 400);
  try {
    // Cloudflare overwrites this header. On other hosts configure a trusted proxy header.
    const ip = request.headers.get("cf-connecting-ip") || "shared";
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(`${env.RATE_LIMIT_SALT}:${ip}`),
    );
    const key =
      "atrixx:contact:" +
      Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    const limit = await remote(env.UPSTASH_REDIS_REST_URL!, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([
        "EVAL",
        "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],600) end; return n",
        "1",
        key,
      ]),
    });
    if (!limit.ok) throw Error("rate limit unavailable");
    const limited = await limit.json();
    if (typeof limited.result !== "number")
      throw Error("rate limit unavailable");
    if (limited.result > 5)
      return json(
        { error: "Too many attempts. Please try again in 10 minutes." },
        429,
      );
    const verification = await remote(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: data.token,
          ...(ip !== "shared" ? { remoteip: ip } : {}),
        }),
      },
    );
    if (!verification.ok) throw Error("verification unavailable");
    const challenge = await verification.json();
    if (
      !challenge.success ||
      challenge.hostname !== new URL(expected).hostname ||
      challenge.action !== "contact"
    )
      return json(
        { error: "Security check expired or failed. Please try again." },
        400,
      );
    const delivery = await remote("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `inquiry-${await hash(data.token)}`,
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [env.CONTACT_TO_EMAIL],
        reply_to: data.email,
        subject: `ATRIXX project inquiry — ${data.service}`,
        text: `Name: ${data.name}\nEmail: ${data.email}\nProject: ${data.service}\nBudget: ${data.budget}\n\n${data.message}\n\nConsent to respond: yes`,
      }),
    });
    if (!delivery.ok) throw Error("delivery unavailable");
    const result = await delivery.json();
    if (!result.id) throw Error("delivery not confirmed");
    return json({
      message: "Your inquiry is on its way. Thanks for sharing your idea.",
    });
  } catch {
    return json(
      {
        error:
          "We couldn’t deliver your inquiry right now. Your details are still here—please try again shortly.",
      },
      503,
    );
  }
}
async function hash(text: string) {
  const d = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(text),
  );
  return Array.from(new Uint8Array(d))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
