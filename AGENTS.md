# AGENTS.md

Single-package personal portfolio site (no monorepo, no tests, no CI, no env vars, no backend). Next.js 16 App Router + TypeScript strict + Tailwind v4 + Motion. Everything prerenders statically.

## Commands

- `npm run dev` — dev server (Turbopack) at http://localhost:3000
- `npm run build` — the main verification step; there is no test suite
- `npm run lint` — ESLint 9 flat config (`core-web-vitals` + TS); `scripts/**` and `next-env.d.ts` are ignored
- No typecheck script exists: use `npx tsc --noEmit`

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Architecture

- `app/` — routes only: `/` (single long landing page composed of `<section>` components from `components/sections/`) and `/projects/[slug]/` (details pages, SSG via `generateStaticParams`)
- `lib/data/` — all page content lives here: `personal-info.ts`, `projects.ts`, `technologies.tsx`. Adding or editing a project means editing `projects.ts` only; the `[slug]` page and homepage cards derive everything from it.
- Path alias: `@/*` maps to the repo root (no `src/` directory).
- `scripts/` — one-off tooling, not part of the app bundle and excluded from ESLint: `generate-resume.mjs` prints `scripts/resume/resume.html` to `public/resume.pdf` via Playwright/Chromium (installed ad hoc with `npm i --no-save`, see README); `verify-nav.mjs` and `verify-resume.mjs` are Playwright/pdfjs-based checks that need `npm run dev` running.

## Framework & styling quirks

- `cacheComponents: true` in `next.config.ts`: data fetching is dynamic by default; cache with `use cache`, and Suspense-wrap anything uncached in the prerender shell. Requires removing any `runtime = "edge"`/`experimental_ppr` patterns. `partialPrefetching` must stay explicitly set (omitting it logs a warning).
- Tailwind v4 with **no `tailwind.config.js`**: all design tokens (colors, fonts) are `@theme inline` CSS variables in `app/globals.css`. Design system is near-black surfaces (`background`/`surface`/`elevated`) + lime accent (`--color-accent`); use token classes like `bg-background`, `text-accent`, `border-hairline` rather than raw hex.
- Fonts: `next/font/google` vars `--font-inter` (body) and `--font-jakarta` (headings) wired through `--font-sans`/`--font-display` in `globals.css`.
- Animations: package is `motion` — import from `motion/react`, never `framer-motion`. Wrap scroll reveals in `<Reveal />` from `components/motion/reveal.tsx`; `MotionProvider` in the root layout sets `reducedMotion="user"`, so do not opt out of reduced motion per component. `globals.css` also force-disables animations under `prefers-reduced-motion`.
- Route handlers/pages are sync components in this app; in Next.js 16, `params` etc. are Promises (see the `[slug]` page for the established `await params` pattern).

## Intentional placeholders (do not "fix" these)

- `app/layout.tsx` has a TODO to update `metadataBase` after the first Vercel deploy — leave as-is unless the deployment URL is confirmed.
- `app/projects/[slug]/page.tsx` has clearly-marked editable placeholder cards for project details the owner hasn't supplied yet.

## Navigation gotchas

- **Never use `<Link href="#hash">` for a same-page section link** — in the App Router it updates the URL hash without scrolling. Same-page anchors must be plain `<a>` elements (`components/navbar.tsx` wraps this decision in `SectionLink`; `<Link>` is used only for cross-route targets like `/#contact` from a project page).
- **Don't lock body scroll for the mobile menu** — toggling `overflow: hidden` on `<body>` cancels the browser's native fragment scroll in Chromium, which broke all mobile menu links. The panel lives inside the fixed `<header>`, so no lock is needed; the menu must not animate its unmount (no `AnimatePresence` exit on the panel).
