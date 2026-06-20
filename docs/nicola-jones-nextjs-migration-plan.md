# Nicola Jones Site — Vite + React → Next.js (App Router) Migration Plan

**Status:** Proposed
**Author:** Whisk Digital
**Goal:** Move the site from a client-rendered Vite + React SPA to **Next.js (App Router)** with **server-side rendering / static generation**, so all marketing, portfolio and shop content is crawlable for SEO. Today every page fetches its content client-side in `useEffect`, so crawlers and link-preview bots see an empty shell — this is the core problem the migration solves.

---

## Part 1 — Current State Analysis

### 1. Project structure

**Stack:** Vite 6 + React 18.3.1 SPA, TypeScript, `react-router` 7 (data router, declarative `Component` form), Tailwind CSS v4. Deployed to **Netlify** (`netlify.toml`, `dist` publish dir, SPA catch-all redirect to `/index.html`). Originated as a Figma "Make" export (note the `@figma/my-make-file` package name and "do not remove" plugin comments in `vite.config.ts`).

**Boot chain:**
- `index.html` → `src/main.tsx` (`createRoot(...).render(<App/>)`)
- `src/app/App.tsx` → `<HelmetProvider><RouterProvider router={router}/></HelmetProvider>`
- `src/app/routes.tsx` → `createBrowserRouter([...])`
- `src/app/Root.tsx` → layout shell: `<Navigation/>`, `<main>` wrapping `motion`/`AnimatePresence` page transition keyed on `location.pathname`, `<Footer/>`, `<ScrollRestoration/>`

**Routes (all nested under the `Root` layout):**

| Path | Page component | Data source | SEO today |
|------|----------------|-------------|-----------|
| `/` (index) | `HomePage` (907 lines) | Sanity: homepage, featured projects, testimonial, shopProduct (top 20) | Helmet + JSON-LD |
| `/portfolio` | `PortfolioPage` | Sanity: all portfolioProject | Helmet |
| `/portfolio/:slug` | `ProjectDetailPage` | Sanity: project by slug + all (nav) | **none** |
| `/shop` | `ShopPage` | Sanity: shopProduct in-stock | Helmet |
| `/shop/:slug` | `ProductDetailPage` (639 lines) | Sanity: product by slug + related | JSON-LD only (no `<title>`) |
| `/checkout/success` | `CheckoutSuccessPage` | reads `session_id` query | none |
| `/checkout/cancel` | `CheckoutCancelPage` | — | none |
| `/commissions` | `CommissionsPage` | Sanity: commissionsPage + featured projects | Helmet + JSON-LD |
| `/celebrate` | `CelebratePage` | Sanity: celebratePage | Helmet + JSON-LD |
| `/about` | `AboutPage` | Sanity: aboutContent | Helmet |
| `/contact` | `ContactPage` | Sanity: siteSettings (contact copy) | Helmet |
| `*` | `NotFoundPage` | — | none |

**Components:**
- App-specific: `Navigation`, `Footer` (newsletter form + its own Sanity fetch), `BlobShape`, `WavyDivider`, `PageTransition`, `PillButton`, `figma/ImageWithFallback`.
- `components/ui/*` — a full **shadcn/ui** set (~50 files). Most are unused by the actual pages; dragged in by the Figma export.
- `src/app/data/projects.ts` — 274-line static fallback dataset (legacy; pages now prefer Sanity).

**Observations that shape the migration:**
- Every content page fetches Sanity in a `useEffect` **on the client**, with hardcoded fallback data for first paint → no server HTML for crawlers. This is the #1 thing to fix.
- Several page files are very large (HomePage 907, ProductDetailPage 639, CelebratePage 587, ProjectDetailPage 502, CommissionsPage 491). Porting is mechanical but voluminous.
- SEO is inconsistent: `ProjectDetailPage` and `ProductDetailPage` lack `<title>`/meta entirely.

### 2. Sanity integration

- **Client:** `src/lib/sanity.ts` — `createClient({ projectId: 'fnwcgtif', dataset: 'production', useCdn: true, apiVersion: '2024-01-01' })`. **No token** (public read-only dataset). Exports `urlFor()` via `@sanity/image-url`.
- **Studio:** in-repo under `/studio` with `sanity.config.ts` (structureTool + visionTool) and `sanity.cli.ts` (`studioHost: 'nicola-jones'`, deployed app `zlqioyo3ammcvy2clzvm638x`). Run via `npm run studio` / `studio:deploy`. Hosted at `nicola-jones.sanity.studio`.
- **Schemas** (`studio/schemas/`, 11 files; 10 registered in `index.ts`):
  - Singletons: `homepage`, `shopPage`, `commissionsPage`, `celebratePage`, `aboutContent`, `siteSettings`
  - Collections: `portfolioProject`, `shopProduct`, `testimonial`, `caseStudy` (defined, **not** registered)
  - `shopProduct` is commerce-critical: `name, slug, price, category, image, gallery, shortDescription, description (PT), productDetails (PT), size, inStock, fulfillment (studio|theprintspace), shippingIncluded, allowCustomNotes, customNotesLabel, creativehubSku`.
- **Fetch pattern:** GROQ string → `client.fetch` inside `useEffect`. Queries currently in use:
  - Home: `*[_type=="homepage"][0]{...}`, featured `portfolioProject` by slug list, `testimonial[0]`, `shopProduct[inStock!=false]|order(_createdAt desc)[0...20]`
  - Shop: `*[_type=="shopProduct" && inStock!=false]|order(_createdAt desc)`
  - Product: `*[_type=="shopProduct" && slug.current==$slug][0]{...}` + related-by-category / recent
  - Portfolio: `*[_type=="portfolioProject"]|order(...)` variants; ProjectDetail by `$slug`; featured-by-slug for Home/Commissions
  - `aboutContent[0]`, `commissionsPage[0]`, `celebratePage[0]`, `siteSettings[0]` (Contact + Footer)
- Portable Text is rendered by a hand-rolled `blocksToLines()` helper, **not** `@portabletext/react`.

### 3. Stripe integration

Two **Netlify Functions** (`netlify/functions/`, esbuild bundler, `@netlify/functions` types):

- **`create-checkout-session.ts`** — `POST`. Body `{ productId, productName, price, quantity, imageUrl, fulfillment, creativehubSku }`. Validates name/price and that `theprintspace` products carry a `creativehubSku`. Creates a Checkout Session: `mode:'payment'`, GBP, **dynamic `price_data`** (`unit_amount = round(price*100)`), `shipping_address_collection`, `metadata` (productId, fulfillment, quantity, creativehubSku), `success_url`/`cancel_url` from `SITE_URL || URL || localhost`. Permissive CORS + OPTIONS handler. Returns `{ url }`; client does `window.location.href = url`.
- **`stripe-webhook.ts`** — `POST`. Verifies signature with `STRIPE_WEBHOOK_SECRET` against the **raw body**. On `checkout.session.completed`: if `fulfillment==='theprintspace'`, POSTs an order to **CreativeHub / ThePrintSpace** (`https://api.creativehub.io/api/v1/orders/confirmed`, Bearer `CREATIVEHUB_API_KEY`, SKU + shipping); returns **500 on failure so Stripe retries**. Otherwise (studio/handmade) just `console.log`s — Nicola ships manually.
- Stripe `apiVersion:'2026-04-22.dahlia'`. Client calls `fetch('/.netlify/functions/create-checkout-session', ...)` from `ProductDetailPage.handleBuyNow`.
- **No order-confirmation email is sent today** — manual-fulfilment orders produce only a log line.

### 4. Forms

Two **Netlify Forms** (no backend code):
- **Contact** (`ContactPage`): `name, email, projectType, message`. JS POSTs `application/x-www-form-urlencoded` to `/` with `form-name: contact`. Pre-fills `projectType` from a `?type=` query param.
- **Newsletter** (`Footer`): `email`. Same pattern, `form-name: newsletter`.
- Detection relies on **hidden static `<form data-netlify="true" hidden>` stubs in `index.html`** (Netlify scans built HTML at deploy).
- **Migration risk:** Netlify Forms is a platform feature. Off Netlify it disappears; even on Netlify the static-HTML detection breaks once `index.html` is gone (Next renders dynamically). Forms must be re-implemented as API routes.

### 5. Assets / images

- **Primary:** Sanity CDN (`cdn.sanity.io/images/fnwcgtif/...`) via `urlFor()`. Some homepage pathway images are **hardcoded full CDN URLs**.
- **Static** in `public/`: brand logos (`nicola-jones-logo*.svg`), `nicola-jones-hero.webp`, `nicola-jones-headshot.webp`, animated "loop" PNGs (cherub, daffs, dancer, flowers…), client logos in `public/logos/`, `photo-placeholder.svg`.
- `figma/ImageWithFallback.tsx` wraps `<img>` with an error fallback. No `next/image` (plain `<img>` today).
- Ingestion tooling: `scripts/process-images.py` + `scripts/upload-to-sanity.cjs` (one-off content pipeline; keep in repo, out of runtime scope).

### 6. Fonts

- Google Fonts via CSS `@import` in `src/styles/fonts.css`: **Bricolage Grotesque** + **Plus Jakarta Sans** (`&display=swap`). Manrope is referenced via class names (`font-heading-manrope`) but **not** imported — verify during port.
- Render-blocking from `fonts.googleapis.com`. Migration opportunity: `next/font/google` for self-hosting, zero CLS, no extra DNS round-trip.

### 7. Styling

- **Tailwind CSS v4** via `@tailwindcss/vite` (not the PostCSS plugin). Entry `src/styles/index.css` imports `fonts.css`, `tailwind.css` (`@import 'tailwindcss' source(none)` + `@source` globs + `tw-animate-css`) and `theme.css` (CSS custom properties incl. `oklch` colours, shadcn tokens, `--radius`, dark variant).
- **shadcn/ui** + `class-variance-authority` + `tailwind-merge` + `clsx` (`components/ui/utils.ts`).
- No CSS Modules. `styled-components`, `@emotion/*`, `@mui/*` are in `package.json` but appear to be **unused Figma-export baggage** — confirm and drop.

### 8. Third-party dependencies needing attention

| Dependency | Migration action |
|---|---|
| `react-router` 7 | **Remove** → App Router file-system routing. |
| `react-helmet-async` | **Remove** → Next Metadata API (`generateMetadata`) + JSON-LD `<script>`. |
| `motion` (Framer Motion) | Keep, but its consumers become **Client Components** (`'use client'`). The `Root` `AnimatePresence` route transition needs rework (no `Outlet`/`location.pathname` in App Router — use `template.tsx` or a `usePathname()` wrapper). |
| `@netlify/functions` | **Remove** → Stripe + form handlers become Route Handlers (`app/api/*/route.ts`). |
| Netlify Forms | **Remove** → API route + Resend. |
| `@tailwindcss/vite` / `vite` / `@vitejs/plugin-react` | **Remove** → Next-native Tailwind v4 (PostCSS). |
| `@sanity/client`, `@sanity/image-url` | **Keep** (work server-side). Move calls into Server Components; add `next-sanity` for tag revalidation (recommended). |
| `sanity`, `@sanity/vision` | **Keep** for Studio. Decide standalone-hosted (simplest) vs embedded `/studio`. |
| `@mui/*`, `@emotion/*`, `styled-components`, `recharts`, `react-dnd*`, `react-slick`, `embla-carousel-react`, `vaul`, `cmdk`, `input-otp`, `react-day-picker`, `react-resizable-panels`, `canvas-confetti`, `next-themes` | **Audit & prune** — almost all are unused export leftovers; port only the shadcn/ui components the real pages import. |
| `react`/`react-dom` 18.3.1 | Upgrade to 18.3.x (or 19) per chosen Next version. |

### 9. Environment variables

**Current (Netlify):**
- `STRIPE_SECRET_KEY` · `STRIPE_WEBHOOK_SECRET` · `CREATIVEHUB_API_KEY` (server)
- `SITE_URL` / `URL` (checkout redirect base; `URL` is Netlify-auto)
- `STRIPE_PUBLISHABLE_KEY` / `VITE_STRIPE_PUBLISHABLE_KEY` — **declared but unused** (checkout is server-redirect, not Stripe.js)
- Sanity `projectId`/`dataset` are **hardcoded** in source.

**After migration (Next):**
- Keep: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `CREATIVEHUB_API_KEY`.
- Redirect base → `NEXT_PUBLIC_SITE_URL` (or server `SITE_URL`).
- Sanity → `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, optional `SANITY_API_READ_TOKEN` (only for draft/preview or private data).
- New: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ORDER_NOTIFY_EMAIL`, `CONTACT_NOTIFY_EMAIL` (Phases 5/7).
- Drop the unused publishable-key vars.

---

## Part 2 — Migration Plan

Target: **Next.js 15 (App Router, React Server Components)**, deployed to **Vercel** (recommended) or Netlify's Next runtime. Default rendering = static generation with ISR / tag revalidation for Sanity content; route handlers for Stripe + forms on the Node runtime.

> Effort scale: **S** ≈ <½ day, **M** ≈ ½–2 days, **L** ≈ 2–5 days.

### Phase 1 — Scaffold from Whisk starter + port routing · Effort: **M**

1. Initialise from the **Whisk Next.js starter** (App Router, TypeScript, Tailwind v4, lint/format, deploy config). Bring the Nicola brand into it rather than converting in place.
2. Recreate the route tree as the file system: `app/layout.tsx` ← `Root.tsx`; `app/page.tsx`, `app/portfolio/page.tsx`, `app/portfolio/[slug]/page.tsx`, `app/shop/page.tsx`, `app/shop/[slug]/page.tsx`, `app/commissions/`, `app/celebrate/`, `app/about/`, `app/contact/`, `app/checkout/success/`, `app/checkout/cancel/`, `app/not-found.tsx`.
3. Port global CSS: `theme.css` + `tailwind.css` into the starter's global stylesheet; wire Tailwind v4 via PostCSS (Next-native), dropping `@tailwindcss/vite`.
4. Move `public/` assets as-is (paths unchanged).
5. Mechanical swaps: `react-router` `<Link>` → `next/link`; `useNavigate`/`useParams` → `next/navigation`.
6. Delete `index.html`, `main.tsx`, `App.tsx`, `routes.tsx`, `vite.config.ts`, SPA redirect.

**Risks:** The `Root` `AnimatePresence` page transition relies on a router `Outlet` + `location.pathname`; no direct App Router equivalent. Use `app/template.tsx` (re-mounts per nav) or a small client wrapper using `usePathname()`. Keep minimal — over-engineering transitions is a common time sink. Phase is sized by code volume, not difficulty.

### Phase 2 — Move Sanity queries to server-side · Effort: **M**

1. Recreate `lib/sanity.ts` from env; keep `useCdn:true`. Add a typed `sanityFetch()` (or adopt `next-sanity`) that sets `next: { revalidate, tags }` for ISR.
2. Convert each page to a **Server Component**: lift the `useEffect`+`client.fetch` GROQ to the top of the async page. Delete the loading-state + hardcoded fallback scaffolding (server fetch resolves before render). Keep GROQ strings verbatim — they already work.
3. Add `generateStaticParams()` for `portfolio/[slug]` and `shop/[slug]` from slug queries so detail pages are statically generated.
4. Revalidation: marketing singletons long ISR / tag-based; shop + products `weekly` (per current sitemap intent). Optionally add a Sanity webhook → `/api/revalidate` for instant updates.
5. Render Portable Text with `@portabletext/react` (replace `blocksToLines()`), or keep the helper if output parity matters more than richness.
6. Split each page: server shell does data + metadata; interactive bits (carousels, buy button, forms, motion) become small `'use client'` children receiving data as props.

**Risks:** Largest behavioural change. Decide whether to keep graceful fallbacks server-side or treat missing singletons as build errors. `urlFor()` works server-side unchanged.

### Phase 3 — Port components · Effort: **L**

- **Stays as-is:** `PillButton`, `BlobShape`, `WavyDivider`, the shadcn/ui components actually used, `theme.css` tokens.
- **Add `'use client'`:** anything using `motion`, `useState`/`useEffect`, `window`/`document`, or event handlers — confirmed: `Navigation`, `Footer`, `PageTransition`, `PillButton`, plus interactive sections inside the big pages (Home hero, product gallery, carousels).
- **Images:** swap `ImageWithFallback`/raw `<img>` for `next/image` where sensible; add `cdn.sanity.io` to `next.config` `images.remotePatterns`; keep a thin fallback wrapper for art that legitimately 404s.
- **Prune:** delete unused `components/ui/*` and the unused MUI/emotion/styled-components/recharts/dnd/slick/etc. deps.
- **Fonts:** replace the `fonts.css` `@import` with `next/font/google` (Bricolage Grotesque + Plus Jakarta Sans), exposing CSS variables to Tailwind. Resolve the Manrope reference (import or remove).

**Risks:** Server/Client boundary mistakes (passing handlers across, importing client hooks in a server file) are the most common errors — expect iteration. The big page files carry the most raw porting hours.

### Phase 4 — Port Stripe checkout + webhook to Route Handlers · Effort: **M**

1. `app/api/checkout/route.ts` ← `create-checkout-session.ts`. Keep payload/validation/`price_data`/metadata identical. `SITE_URL||URL` → `NEXT_PUBLIC_SITE_URL`. Drop wildcard CORS (same-origin) unless an external caller needs it. `export const runtime = 'nodejs'`.
2. `app/api/stripe/webhook/route.ts` ← `stripe-webhook.ts`. **Critical:** signature verification needs the **raw body** — read `await req.text()` (do **not** JSON-parse first) and pass to `constructEvent`. Keep the 500-on-CreativeHub-failure retry. Node runtime.
3. Update client `handleBuyNow` URL `/.netlify/functions/create-checkout-session` → `/api/checkout`.
4. Re-point the Stripe Dashboard webhook to `/api/stripe/webhook` and update `STRIPE_WEBHOOK_SECRET` if a new endpoint secret is issued.

**Risks:** (a) Raw-body handling — #1 cause of webhook signature failures on App Router; verify with `stripe listen --forward-to localhost:3000/api/stripe/webhook`. (b) Old `/.netlify/functions/*` URLs die — update Stripe + client together. (c) Confirm the pinned `apiVersion` is valid with the installed SDK.

### Phase 5 — Port forms · Effort: **M**

Netlify Forms cannot survive the move (dynamic HTML breaks detection; gone off-Netlify). Re-implement:

1. `app/api/contact/route.ts` and `app/api/newsletter/route.ts` accept JSON POSTs, validate (`react-hook-form` client-side + a server/zod check).
2. Contact → notification email via Resend (Phase 7 infra) to `CONTACT_NOTIFY_EMAIL`; preserve the `?type=` pre-fill in the client form component.
3. Newsletter → store/forward to an email provider (Mailchimp/Buttondown/Resend Audiences) or, minimally, email the address to Nicola. Decide provider with the client.
4. Convert both forms to client components POSTing to the new routes; drop the hidden `index.html` stubs and the `fetch('/', form-name=...)` pattern.

**Risks:** Spam — add a honeypot and/or Turnstile/hCaptcha (Netlify previously provided basic filtering, now lost). Confirm where newsletter signups should durably land (today they only hit Netlify's dashboard).

### Phase 6 — SEO setup · Effort: **M**

1. **Metadata API:** replace every Helmet block with `export const metadata` / `generateMetadata()`. Root title template, descriptions, canonicals, Open Graph/Twitter cards. **Fix the gaps:** `ProjectDetailPage` and `ProductDetailPage` have no `<title>`/meta today — add full metadata incl. OG image from the Sanity hero/product image.
2. **JSON-LD:** keep the existing `Product` data on product pages and page-level JSON-LD on Home/Commissions/Celebrate via `<script type="application/ld+json">`. Add `Organization`/`Person` (Nicola) on Home and `BreadcrumbList` on detail pages.
3. **Sitemap:** replace static `public/sitemap.xml` with `app/sitemap.ts` enumerating static routes **plus** all `portfolioProject` and `shopProduct` slugs from Sanity (the current file misses every detail page).
4. **Robots:** `app/robots.ts` ← `public/robots.txt` (keep `Disallow: /studio`, point at the dynamic sitemap).
5. Set `metadataBase` to the production origin so OG/canonical URLs resolve absolutely.

**Risks:** Low technical risk, high payoff — this is the reason for the migration. Confirm canonical host (`nicolajones.art`, hardcoded in Helmet/robots/sitemap today) and consistent www/non-www + trailing-slash handling to avoid duplicate-URL dilution.

### Phase 7 — Order notification emails (Resend) · Effort: **S–M**

Today manual-fulfilment orders only `console.log`. Add real notifications:

1. Add `resend` SDK; env `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ORDER_NOTIFY_EMAIL`.
2. In the **webhook** `checkout.session.completed` handler: after fulfilment branching, email Nicola the order (customer, product, qty, fulfilment type, shipping address). For `theprintspace`, send after successful CreativeHub submission; for studio/handmade, send the "ship manually" alert that replaces today's log line.
3. Optional: customer order-confirmation email.
4. Verify the sending domain in Resend (SPF/DKIM) before go-live.

**Risks:** Don't let email failure flip the webhook off 200 — Stripe would retry the whole event and could double-submit the CreativeHub order. Send email in a try/catch that logs but doesn't change the response once fulfilment has succeeded. CreativeHub already uses `session.id` as `orderId` (idempotent); keep email sends tolerant of Stripe's at-least-once delivery.

### Phase 8 — Testing & cutover · Effort: **M**

1. **Functional parity:** every route renders with real Sanity data; **view-source shows server HTML** (the SEO goal). Diff against the live site.
2. **Stripe end-to-end** in test mode: studio product (manual) and theprintspace product (CreativeHub sandbox) → checkout → webhook → email. Use `stripe trigger` / `stripe listen`.
3. **Forms:** contact + newsletter submit, validation, spam guard, email receipt.
4. **SEO audit:** Lighthouse, sitemap reachable, robots correct, metadata/JSON-LD per page (Rich Results Test), no client-only content.
5. **Perf:** `next/image` + `next/font`; check CLS/LCP vs old site.
6. **Cutover:** deploy to Vercel; set all env vars; re-point Stripe webhook; verify Sanity CORS/CDN; **301-redirect** any changed paths; keep Netlify live until DNS flips; switch `nicolajones.art` DNS; smoke-test prod checkout with a real low-value order; monitor webhook + email logs.
7. **Studio:** confirm the hosted Studio (`nicola-jones.sanity.studio`) still targets the same project/dataset (config unchanged — it does); decide whether to embed `/studio` later.

**Risks:** The live cutover (webhook re-point + DNS) is the highest-stakes moment — a missed webhook secret or stale checkout URL silently breaks orders. Run prod in parallel before flipping DNS, and do one real test purchase post-cutover.

---

## Effort summary

| Phase | Effort | Top risk |
|---|---|---|
| 1 — Scaffold + routing | M | Route-transition (`AnimatePresence`) has no direct App Router equivalent |
| 2 — Sanity server-side | M | Behavioural shift from client fallback data to server fetch |
| 3 — Components | L | Server/Client boundary errors; volume of large page files |
| 4 — Stripe routes | M | Raw-body webhook verification; webhook URL/secret re-point |
| 5 — Forms | M | Netlify Forms removed; spam protection + newsletter destination |
| 6 — SEO | M | Low risk, high payoff; fix missing detail-page metadata |
| 7 — Resend emails | S–M | Email failure must not break webhook idempotency |
| 8 — Testing & cutover | M | DNS + webhook cutover is the highest-stakes step |

**Rough total: ~8–12 working days** depending on how aggressively the unused dependency surface and large page files are refactored vs. ported verbatim.

## Cross-cutting recommendations
- **Prune aggressively** in Phase 3 — MUI, Emotion, styled-components, recharts, dnd, slick and most `components/ui/*` are dead Figma-export weight.
- **Externalise hardcoded config** — Sanity IDs, the `nicolajones.art` host, and the hardcoded CDN URLs in `HomePage` should move to env/Sanity.
- **Keep GROQ verbatim** — the queries are correct; only their execution location changes. De-risks Phase 2.
- **Recommended hosting: Vercel** for first-class App Router/ISR; if staying on Netlify, validate its Next runtime handles route handlers + ISR as expected.
