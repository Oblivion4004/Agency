# ATRIXX — independent digital studio

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

Copy `.env.example` to `.env.local` for local development, or set the named runtime variables in your deployment platform. Configure a verified Resend sender and destination inbox, Cloudflare Turnstile site and secret keys, an Upstash Redis REST database, a long random rate-limit salt, and the exact public `SITE_URL`. Never commit credentials.

Allow the site's hostname in Turnstile. The widget sends action `contact`; the server verifies both action and hostname. The form fails closed if email or protection services are missing. An unavailable desk never presents a false success. Success means Resend accepted a message, not that it reached the recipient's inbox.

The rate limit allows five attempts per ten minutes. On Cloudflare, the network identifier comes from its trusted `CF-Connecting-IP` header and is stored only as a salted hash with a ten-minute TTL. Other hosts currently use a shared fallback bucket. Before deploying on another platform, adapt the trusted proxy header to that host's documented behavior; do not trust arbitrary forwarded headers.

## Deployment modes

The normal build runs Next.js with `/api/contact`. The Sites build prerenders the `.tsx` pages and bundles static assets into a portable Worker with the identical contact handler. `pageExtensions` deliberately excludes the Node-only `route.ts` from that static export. The generated Worker has no Node dependencies. Assets are embedded for portability; this tradeoff is appropriate for the compact portfolio, but a larger media library should move to a CDN or native asset binding.

Sites access is private by default. The display name is ATRIXX; the hosting slug was allocated under the initial working name before the branding reply. A custom production domain can be attached separately.

## Content and accessibility

All three project studies—Daybreak café, Goodform salon, and Homebase local services—are original, explicitly labeled concepts. Replace entries in `src/lib/projects.ts` with approved work when available. No clients, testimonials, business results, or awards are invented. The illustrations are CSS/SVG artwork, and the coffee cup/product studies are procedural Three.js objects. The hero's peach, lilac, and mint controls update both the live cup and the static SVG fallback.

Three.js loads only on supported desktop devices. Small screens, reduced-motion preferences, and save-data mode get static artwork. Offscreen canvases stop rendering. GSAP handles scroll reveals without taking over scrolling; Motion handles state transitions. Controls support keyboard use, visible focus, and touch interaction. Mobile navigation traps focus and makes page content inert while open.

## Remaining launch configuration

- Set production inbox, sender domain, delivery credentials, spam-protection keys, and rate-limit storage.
- Replace concept work only when actual project material is available.
- Verify real email delivery and real-device behavior on the final domain.
- Measure field Core Web Vitals after launch; no unmeasured performance score is claimed.

Development-only dependency audit: the current Next.js ESLint toolchain inherits the published `braces` advisory through `fast-glob`/`micromatch`. The registry has no patched `braces` release at the time of implementation. Production dependency audit is clean. Do not downgrade Next.js to resolve an unrelated development-tool advisory.
