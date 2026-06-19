# Nicola Jones Site — Next.js Migration Plan

## Current Architecture

The site is a single-page application with no server-side rendering:

- **Framework:** Vite + React, client-side rendered (CSR). Entry is `src/main.tsx` →
  `src/app/App.tsx` → `RouterProvider` (react-router `createBrowserRouter`).
- **Routing:** `src/app/routes.tsx`, all routes nested under a `Root` layout.
- **CMS:** Sanity. Client config in `src/lib/sanity.ts` (project `fnwcgtif`,
  dataset `production`, `apiVersion 2024-01-01`, `useCdn: true`). Image URLs via
  `@sanity/image-url`. Studio config in `sanity.config.ts` (`npm run studio`).
- **Commerce:** Stripe Checkout via two Netlify Functions:
  - `netlify/functions/create-checkout-session.ts` (Stripe SDK,
    `apiVersion 2026-04-22.dahlia`, reads `STRIPE_SECRET_KEY`, CORS-enabled).
  - `netlify/functions/stripe-webhook.ts`.
- **Hosting:** Netlify (static SPA + serverless functions).
- **UI:** Tailwind (`src/styles/tailwind.css`, `theme.css`, `fonts.css`),
  shadcn/Radix UI primitives in `src/app/components/ui/`, MUI, Emotion.
- **Local data:** `src/app/data/projects.ts` (some content not yet in Sanity).

### Routes (from `src/app/routes.tsx`)

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `HomePage` | index route |
| `/portfolio` | `PortfolioPage` | list |
| `/portfolio/:slug` | `ProjectDetailPage` | dynamic |
| `/shop` | `ShopPage` | list |
| `/shop/:slug` | `ProductDetailPage` | dynamic |
| `/checkout/success` | `CheckoutSuccessPage` | Stripe return |
| `/checkout/cancel` | `CheckoutCancelPage` | Stripe return |
| `/commissions` | `CommissionsPage` | |
| `/celebrate` | `CelebratePage` | |
| `/about` | `AboutPage` | |
| `/contact` | `ContactPage` | form |
| `*` | `NotFoundPage` | 404 |

## Why Migrate

- **CSR is invisible to search engines.** The current app ships an empty HTML
  shell and renders in the browser. Crawlers, link previews, and social cards
  see almost nothing — bad for an artist/shop site that depends on discovery.
- **Next.js gives SSG/SSR.** Portfolio and shop pages can be statically
  generated (or ISR-revalidated) from Sanity, so every page has real HTML at
  load and is fully indexable.
- **Better image optimisation.** `next/image` handles responsive sizing,
  lazy-loading, and modern formats automatically — important for an
  image-heavy portfolio.
- **First-class API routes.** Stripe checkout and webhooks move into the same
  app as route handlers, removing the separate Netlify Functions deployment.

## Migration Phases

### Phase 1: Scaffold — *Small*

- Initialise a Next.js App Router project from the Whisk starter.
- Port Tailwind config and brand tokens: copy `src/styles/theme.css`,
  `tailwind.css`, and `fonts.css` (colours like `--primary: #030213`, the
  `--color-*` token mappings, and the font faces) into the new `app/globals.css`
  / Tailwind setup.
- Set up the Sanity client in the new app reusing the same project ID
  (`fnwcgtif`), dataset (`production`), and API version. Bring `urlFor` across.
- Decide Studio hosting: keep the embedded Studio (`sanity.config.ts`) or move
  it to `/studio` in the Next app.

### Phase 2: Routes and Pages — *Medium*

- Map each Vite route to an App Router folder under `app/`:
  - `/` → `app/page.tsx`
  - `/portfolio` → `app/portfolio/page.tsx`
  - `/portfolio/:slug` → `app/portfolio/[slug]/page.tsx`
  - `/shop` → `app/shop/page.tsx`
  - `/shop/:slug` → `app/shop/[slug]/page.tsx`
  - `/checkout/success` → `app/checkout/success/page.tsx`
  - `/checkout/cancel` → `app/checkout/cancel/page.tsx`
  - `/commissions`, `/celebrate`, `/about`, `/contact` → matching folders
  - `*` → `app/not-found.tsx`
- Recreate the `Root` layout as `app/layout.tsx` (Navigation + Footer +
  page-transition wrapper).
- Move Sanity queries into server components. Use `generateStaticParams` for
  `portfolio/[slug]` and `shop/[slug]` to pre-render every project/product.
- Port the local `src/app/data/projects.ts` content (or migrate it into Sanity).

### Phase 3: Shop and Stripe — *Medium*

- Port `create-checkout-session.ts` to `app/api/checkout/route.ts` (Stripe SDK,
  same `STRIPE_SECRET_KEY`; drop the manual CORS headers — same-origin now).
- Port `stripe-webhook.ts` to `app/api/webhooks/stripe/route.ts`. Use the raw
  request body for signature verification (`STRIPE_WEBHOOK_SECRET`).
- **New:** add Resend order-notification emails fired from the webhook on
  successful checkout (`RESEND_API_KEY`).

### Phase 4: Components — *Medium*

- Port React components from `src/app/components/` — most (Radix/shadcn UI in
  `components/ui/`, `Footer`, `Navigation`, `PillButton`, etc.) work unchanged.
- Replace `react-router` `Link`/`useNavigate` with `next/link` /
  `next/navigation`.
- Add `"use client"` to interactive components (carousels, dialogs, forms,
  anything using hooks/state or browser APIs).
- Replace `<img>` / the `ImageWithFallback` shim with `next/image` where it
  helps (portfolio, shop, hero imagery).

### Phase 5: Forms — *Small*

- Port the contact form (`/contact`) to a server action or `/api` route
  (wire to Resend or existing handler).
- Port the newsletter signup.

### Phase 6: SEO — *Small (mostly free from the starter)*

- Sitemap (`app/sitemap.ts`) and `robots.ts`.
- Per-route `metadata` / `generateMetadata` (titles, descriptions, canonicals).
- JSON-LD structured data (Product on shop pages, CreativeWork on portfolio).
- OG image generation for shareable cards.

### Phase 7: Testing and Cutover — *Small*

- Test every route, the full checkout flow, and webhook delivery end-to-end.
- Verify Sanity content renders and revalidates as expected.
- DNS cutover to the new deployment.

## Risks

- **Stripe webhook URL changes.** The endpoint moves from the Netlify Function
  URL to `/api/webhooks/stripe` — must be updated in the Stripe dashboard, and
  the webhook signing secret re-checked.
- **Sanity preview/draft mode.** Set up Next.js Draft Mode + a preview token if
  editors expect live preview (the current SPA has no equivalent to port).
- **Client-only libraries.** MUI, Emotion, and some Radix usage need
  `"use client"` boundaries; confirm SSR compatibility and Emotion's Next.js
  setup to avoid hydration mismatches.
- **Stripe API version pinning.** Keep `2026-04-22.dahlia` (or deliberately
  bump) to avoid behavioural drift in checkout.
- **Local vs CMS data.** Decide whether `projects.ts` stays as code or migrates
  to Sanity before cutover so content isn't split across two sources.

## Estimated Total: 3–4 working days
