# Arvion Studios — independent digital studio

A custom Next.js / TypeScript portfolio built for Atharva. The arcade edition pairs an interactive coffee cup with direct messaging about premium websites for everyday businesses. The visual direction and information architecture are documented in [DESIGN.md](./DESIGN.md).

## Run

Requires Node.js 22+ and npm. Run `npm ci`, then `npm run dev`. If port 3000 is occupied, Next selects another port and prints its address. Production: `npm run build`, then `npm start`.

## Checks

- `npm run lint` — Next.js accessibility, React, and TypeScript lint rules.
- `npm test` — content integrity and contact validation, abuse protection, and delivery handling.
- `npm run build` — standard Next.js production build and TypeScript check.
- `npm run build:sites` — Next.js prerendered export plus the same contact handler in a Sites-compatible ESM Worker.
- `node scripts/verify-sites.mjs` — verifies packaged routes, 404 behavior, contact configuration, and HEAD handling.

## Activate project inquiries

Copy `.env.example` to `.env.local` for local development, or set the named runtime variables in your deployment platform. The template selects Gmail for the standard Node.js/Next.js deployment: `EMAIL_PROVIDER=gmail`, `GMAIL_USER=atharvasandipgadhave@gmail.com`, and `CONTACT_TO_EMAIL=atrixxweb@gmail.com`. Set `GMAIL_APP_PASSWORD` to a Google App Password for that sending account, never its normal login password. Keep the App Password in server-only environment settings, not chat, source files, or any `NEXT_PUBLIC_` variable. No Resend account or custom sending domain is needed for this mode.

Also configure Cloudflare Turnstile site and secret keys and the exact public `SITE_URL`. Gmail credentials and Turnstile must be configured before the form reports ready. Upstash Redis and a long random `RATE_LIMIT_SALT` are optional; when all three rate-limit settings are present, the form limits repeated submissions. Use a Node.js runtime with outbound Gmail SMTP over TLS on port 465. The current portable Sites Worker cannot run Nodemailer; setting Gmail mode there intentionally leaves delivery unavailable. It can still use the existing Resend transport with `EMAIL_PROVIDER=resend`, `RESEND_API_KEY`, and `CONTACT_FROM_EMAIL`. Never commit credentials.

Allow the site's hostname in Turnstile. The widget sends action `contact`; the server verifies both action and hostname. The form fails closed if email or protection services are missing. An unavailable desk never presents a false success. Success means the configured provider accepted the message, not that it reached the recipient's inbox. Gmail messages use the authenticated account as sender, the fixed configured destination, and the visitor's address as Reply-To. SMTP errors are not exposed to visitors and are not automatically retried.

When Upstash is configured, the rate limit allows five attempts per ten minutes. The Sites Worker uses Cloudflare's trusted `CF-Connecting-IP` header. The Node route uses Vercel's overwritten `X-Forwarded-For` only when the server environment has `VERCEL=1`; other Node hosts use a shared fallback bucket. Identifiers are stored only as salted hashes with a ten-minute TTL. Without Upstash, Turnstile and the honeypot still reject automated submissions, but repeated valid submissions are not counted across server instances. Before deploying on another platform, adapt the trusted proxy header to that host's documented behavior; do not trust arbitrary forwarded headers.

## Deployment modes

The normal build runs Next.js with `/api/contact`. The Sites build prerenders the `.tsx` pages and bundles static assets into a portable Worker with the identical contact handler. `pageExtensions` deliberately excludes the Node-only `route.ts` from that static export. The generated Worker has no Node dependencies. Assets are embedded for portability; this tradeoff is appropriate for the compact portfolio, but a larger media library should move to a CDN or native asset binding.

Sites access is private by default. The display name is Arvion Studios; the hosting slug was allocated under the initial working name before the branding reply. A custom production domain can be attached separately.

## Content and accessibility

All four project studies—Atharva Coffee, Daybreak café, Goodform salon, and Homebase local services—are original, explicitly labeled concepts. Replace entries in `src/lib/projects.ts` with approved work when available. No clients, testimonials, business results, or awards are invented. The illustrations are CSS/SVG artwork, and the coffee cup/product studies are procedural Three.js objects. The hero's peach, lilac, and mint controls update both the live cup and the static SVG fallback.

Three.js loads only on supported desktop devices. Small screens, reduced-motion preferences, and save-data mode get static artwork. Offscreen canvases stop rendering. GSAP handles scroll reveals without taking over scrolling; Motion handles state transitions. Controls support keyboard use, visible focus, and touch interaction. Mobile navigation traps focus and makes page content inert while open.

## Remaining launch configuration

- Set production inbox, delivery credentials, and spam-protection keys; optionally add rate-limit storage.
- Replace concept work only when actual project material is available.
- Verify real email delivery and real-device behavior on the final domain.
- Measure field Core Web Vitals after launch; no unmeasured performance score is claimed.

Development-only dependency audit: the current Next.js ESLint toolchain inherits the published `braces` advisory through `fast-glob`/`micromatch`. The registry has no patched `braces` release at the time of implementation. Production dependency audit is clean. Do not downgrade Next.js to resolve an unrelated development-tool advisory.

## Atharva Coffee demo

The featured café case study links to the live website at `https://atharvacoffee.store`. A self-contained snapshot of the separate `../atharva-coffee` build remains in `public/demos/atharva-coffee`, including the artwork used by its portfolio preview. The café is a fictional business concept with sample details.
