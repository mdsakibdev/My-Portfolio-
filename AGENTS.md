# AGENTS.md

Single-package personal portfolio (no monorepo, no tests, no CI). Next.js 16 App Router + TypeScript strict + Tailwind v4 + Motion; one server route (`/api/contact`) sends email via Resend. All pages prerender via Cache Components.

## Commands

- `npm run dev` — Turbopack dev server at http://localhost:3000
- `npm run build` — main verification step; also runs the TypeScript check
- `npm run lint` — bare `eslint` (flat config, `core-web-vitals` + TS); `scripts/**` and `next-env.d.ts` are ignored
- `npx tsc --noEmit` — types alone (no `typecheck` script)

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Architecture

- `app/` — routes only: `/` (landing page composed of `<section>` components in `components/sections/`) and `/projects/[slug]/` (SSG via `generateStaticParams`). `Navbar`/`Footer` are rendered per page, not in the root layout.
- `lib/data/` — all content: `personal-info.ts` (email/socials/resume/profile photo), `projects.ts`, `technologies.tsx`. Editing a project means editing `projects.ts` only — homepage cards, detail page, prev/next links, and metadata all derive from it.
- Path alias `@/*` → repo root (no `src/`).
- `scripts/` — one-off Node tooling, not in the app bundle and excluded from ESLint.

## Contact form

- `components/contact/contact-dialog.tsx` (modal shell) + `contact-form.tsx` (fields/state) render the **Say Hello** modal; the trigger's classes must stay identical to the old mailto button.
- `lib/contact/schema.ts` holds shared types/validation used by both the client and `app/api/contact/route.ts`. Keep it free of server-only imports.
- Server env vars: `CONTACT_EMAIL`, `RESEND_API_KEY`, `RESEND_FROM_EMAIL` (see `.env.example`). They are read only in the route — never import them into client components or prefix them with `NEXT_PUBLIC_`.
- Without credentials the route returns 503 and the UI shows an error; never short-circuit to a success state. Resend is a dependency, not ad-hoc tooling.
- The modal locks `html`/`body` scroll while open by design (this is separate from the mobile-menu rule below) and must keep Escape, backdrop click, close button, focus trap, and focus restoration working.

## Framework & styling quirks

- `cacheComponents: true` in `next.config.ts`: dynamic by default; cache with `use cache` and Suspense-wrap anything uncached in the prerender shell. Keep `partialPrefetching: true` (omitting it warns) and never reintroduce `runtime = "edge"`/`experimental_ppr`.
  - `new Date()` / `Date.now()` in a plain server component is a prerender error; `components/copyright-year.tsx` shows the `"use cache"` workaround.
- Tailwind v4 with no `tailwind.config.js` and no PostCSS config: tokens are `@theme inline` vars in `app/globals.css`, and CSS is compiled by the Turbopack-only `@tailwindcss/turbopack` loader in `turbopack.rules` — keep building with Turbopack (no `--webpack`).
- Style with tokens (`bg-background`, `bg-surface`/`bg-elevated`, `text-accent`, `text-muted`, `border-hairline`) and the `container-site` / `text-hero` / `text-section-heading` utilities instead of raw hex or new max-widths.
- Animations: package is `motion`; import from `motion/react` (no `framer-motion`). Use `<Reveal />` for scroll reveals. `MotionProvider` sets `reducedMotion="user"` and `globals.css` disables animation under reduced motion — don't opt out per component.
- Next 16: `params` is a Promise (`await params`, see `[slug]`); `LayoutProps<"/">`-style global types are generated for you — use them, don't import them.
- Keep `data-scroll-behavior="smooth"` on `<html>`: without it, Next 16 no longer neutralizes CSS smooth scrolling during navigation.

## Intentional placeholders (do not "fix" these)

- `app/layout.tsx` `siteUrl`/`metadataBase` stays a placeholder until the deployment URL is confirmed.
- Project detail page: "Development challenges" / "Possible improvements" are hardcoded `EditablePlaceholder` cards. The purpose/features placeholders disappear once the matching `purpose`/`features` fields are set in `projects.ts` — fill data, not JSX.

## Navigation gotchas

- **Never use `<Link href="#hash">` for a same-page section link** — in the App Router it updates the URL hash without scrolling. Same-page anchors must be plain `<a>` elements (`components/navbar.tsx` wraps this in `SectionLink`); `<Link>` is only for cross-route targets like `/#contact` from a project page.
- **Don't lock body scroll for the mobile menu** — toggling `overflow: hidden` on `<body>` cancels the browser's native fragment scroll in Chromium, which broke all mobile menu links. The panel lives inside the fixed `<header>`, so no lock is needed, and it must not animate its unmount (no `AnimatePresence` exit on the panel).

## Resume tooling

- `public/resume.pdf` is a committed artifact generated from `scripts/resume/resume.html` via `node scripts/generate-resume.mjs` (headless Chromium; letter format, tagged text, clickable links). Regenerate it after editing the template.
- Playwright and `pdfjs-dist` are intentionally absent from `package.json`: run `npm i --no-save playwright && npx playwright install chromium` for `generate-resume.mjs` / `verify-nav.mjs`, and `npm i --no-save pdfjs-dist` for `verify-resume.mjs`. `verify-nav.mjs` needs `npm run dev` running (override with `BASE_URL`).
