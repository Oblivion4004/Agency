# ATRIXX WEB — architecture & design plan

## Information architecture

- `/`: introduction → selected concept work → interactive lab → services → studio approach → project inquiry.
- `/work/[slug]`: dedicated case studies, clearly labeled self-initiated concepts; brief, design response, interactive preview, intended business value, next project.
- `/privacy`: clear handling of inquiry data.
- `/api/contact`: server-side validation, Turnstile verification, shared rate limiting, email delivery with honest failure states.

## Visual system

Near-black #10110f, ivory #f1f0e8, muted #a6a79f, acid #d6f76f. Manrope variable type; oversized tightly tracked headlines with generous line height on body text. 1440px content maximum; 5vw gutters. Hairline rules, asymmetric compositions, small uppercase labels, large imagery, no generic feature-card grids. Native CSS/Three.js artwork, not external project imagery.

## Component plan

Header and accessible mobile navigation; magnetic CTA; editorial Hero; deferred SculptureCanvas with static SVG fallback; GSAP reveal orchestrator; ProjectVisual and ProjectGallery; tabbed ExperienceLab with product material control and interactive UI demo; service accordion; ContactForm; Footer. Server components provide meaningful content before JavaScript.

## Motion & accessibility

Transform/opacity animation only; no scroll hijacking. GSAP scoped contexts; Motion for local controls; Three.js via dynamically imported React Three Fiber. Suspend canvas offscreen, cap DPR, use static mode for reduced motion, save-data, unsupported WebGL, and small screens. Keyboard-accessible controls, skip link, visible focus, error summaries, minimum 44px touch targets.

## Phases and validation

1. Foundation: routes, content, typography, responsive layout. Lint, production build, content tests.
2. Experience: 3D, scroll reveals, lab, mobile navigation. Lint, production build, interaction tests.
3. Conversion: secure contact route, privacy, accessibility, responsive QA. Lint, build, server validation tests and browser checks.

## Content integrity

ATRIXX WEB is the user-approved studio name, inspired by Atharva. All showcased projects are original, explicitly labeled concept work. No client relationships, endorsements, awards, or measured results are claimed. Contact delivery requires owner-provided email credentials and spam-protection configuration.

## Arcade edition — 13 October 2026

User-requested change: replace the abstract hero sculpture with coffee and make the whole site more arcade-inspired, clearly positioning premium websites for everyday businesses. Hero: smiling ceramic coffee cup, latte art, matching SVG fallback, keyboard-accessible peach/lilac/mint controls. Visual system: ink, lavender, peach, and mint; tactile offset-shadow buttons, monospaced labels, pixel details, checker motifs, and browser-window project frames. Messaging: direct first-person introduction to Atharva, practical menus/booking/inquiry use cases. Portfolio concepts now cover a café, salon, and local home services. No client work or results are claimed. Keep existing motion preferences, accessibility, lazy loading, and contact safeguards.

## Coffee scroll update

Brand: ATRIXX WEB. Dark arcade hero transitions into cream paper and espresso typography. A short desktop scroll scene turns the cup once, then tilts it with scroll-driven droplets; reverse scrolling rewinds. Mobile uses the vector fallback without pinning. Reduced motion removes the sequence. Portfolio concepts remain explicitly labeled.

## Continuous spill transition

The projected 3D cup rim anchors a continuous SVG coffee river crossing the hero boundary. It widens into a full-width pool, then the liquid and following section change from coffee brown/dark to cream as the boundary enters view. Mobile uses the SVG rim; reduced motion keeps a static cream transition. Decorative layers ignore pointer input; observers stop geometry work offscreen.
