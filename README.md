# akshaymalhotra.dev

Personal portfolio for Akshay Malhotra — senior software engineer. Fast, professional, direct, lightweight.

## Stack

- **[Next.js 14](https://nextjs.org)** (App Router), configured as a **fully static export** (`next.config.js`: `output: 'export'`, `images: { unoptimized: true }`). There is no server runtime and no API routes — every page is prerendered at build time into plain HTML/JS and served as static files.
- **React 18** + **TypeScript 5**.
- **Tailwind CSS 3.4** for styling, with **[shadcn/ui](https://ui.shadcn.com)** (`new-york` style, configured in `components.json`) providing accessible component primitives built on **Radix UI** (`@radix-ui/react-*`). shadcn components are copied into the repo (`components/ui/`), not installed as a package, so they're fully editable.
- **next-themes** for light/dark mode (class-based strategy; theme tokens are CSS variables defined in `app/globals.css` and mapped to Tailwind colors in `tailwind.config.ts`).
- **lucide-react** for icons.
- Small styling utilities: `clsx` + `tailwind-merge` (combined into the `cn()` helper in `lib/utils.ts`), `class-variance-authority` (variant-based component styling, used by `components/ui/*`), `tailwindcss-animate`.
- **@vercel/analytics** for pageview analytics.
- Fonts: Inter (sans) and Source Serif 4 (serif), self-hosted via `next/font/local` in `app/fonts.ts`, sourced from the `@fontsource-variable/inter` / `@fontsource-variable/source-serif-4` npm packages — no build-time network dependency on Google Fonts.
- Tooling: ESLint (`eslint-config-next`), `tsc --noEmit` for type checking, **Playwright** (`@playwright/test`) for a viewport-overflow smoke test (`e2e/`), **Lighthouse CI** (`@lhci/cli`) for performance/accessibility/best-practices/SEO audits across every route, each category gated at a minimum score of 0.90.
- No CMS — most content is authored directly in TypeScript (see `content/` below). The blog is the one exception: posts are MDX files with frontmatter (`content/posts/`), compiled to static HTML at build time via `next-mdx-remote/rsc` — no runtime server dependency, still compatible with the static export. No dedicated state-management library; the site has no client state beyond theme and current route.
- Deployed on **Vercel**, which builds the static export and serves it from its edge network. Every push to `main` deploys to production; every PR gets a preview deployment (see the Vercel bot comment on PRs).

## Project structure

```
.
├── app/                        # Routes (Next.js App Router) — one folder per route
├── components/                 # Shared React components
│   └── ui/                        # shadcn/ui primitives (generated, not hand-rolled)
├── content/                    # Site copy as typed data, separate from components
├── lib/                        # Small shared utilities
├── hooks/                      # Custom React hooks
├── public/assets/              # Static files served as-is
├── e2e/                        # Playwright viewport smoke test
├── scripts/                    # Node/shell tooling run in CI and locally (not part of the app bundle)
├── docs/                       # Human-facing docs: process reference and design specs/plans
├── .claude/                    # Claude Code skills/agents used to develop this repo
└── .github/                    # CI workflow, issue template, PR template
```

### `app/` — routes

Each subfolder is a route, following App Router conventions (a folder's `page.tsx` is what renders at that URL).

| File | Route | Purpose |
|---|---|---|
| `app/page.tsx` | `/` | Home — intro/hero copy |
| `app/experience/page.tsx` | `/experience` | Renders `content/experience.ts` via `components/experience-timeline.tsx` |
| `app/projects/page.tsx` | `/projects` | Renders `content/projects.ts` |
| `app/beyond-work/page.tsx` | `/beyond-work` | Non-work interests |
| `app/blog/page.tsx` | `/blog` | Lists posts from `content/posts/` |
| `app/blog/[slug]/page.tsx` | `/blog/[slug]` | Renders one MDX post |
| `app/layout.tsx` | — | Root layout: fonts, `ThemeProvider`, `Nav` chrome, `ContactWidget`, `Person` JSON-LD, `Analytics` |
| `app/fonts.ts` | — | `next/font/local` config, self-hosted (Inter, Source Serif 4) |
| `app/globals.css` | — | Tailwind directives + light/dark CSS variable theme tokens |
| `app/sitemap.ts` | `/sitemap.xml` | Generates the sitemap from the route list |

Pages are intentionally thin (15–60 lines): they import from `content/` and `components/`, they don't hold data or business logic themselves.

### `components/` — shared UI

- `nav.tsx` — site chrome, rendered once in `app/layout.tsx`.
- `contact-widget.tsx` — persistent floating contact/social pill (GitHub, LinkedIn, Instagram, email), fixed to the bottom-right corner, rendered once in `app/layout.tsx`.
- `theme-provider.tsx`, `theme-toggle.tsx` — dark/light mode (wraps `next-themes`).
- `experience-timeline.tsx` — the one non-trivial component (~200 lines); renders the work-history list from `content/experience.ts`.
- `ui/` — shadcn/ui primitives currently in use: `button`, `input`, `separator`, `sheet`, `skeleton`, `tooltip`. These are scaffolded by the shadcn CLI (per `components.json`) rather than written by hand, and are meant to be edited in place rather than treated as a vendored dependency.

### `content/` — site copy as data

Plain TypeScript modules, not components — the point is that editing what the site says doesn't require touching JSX.

- `projects.ts` — `Project[]`, each with `slug`, `title`, `summary`, `problem`, `role`, `decision`, `outcome`, `tags`, optional `link`.
- `experience.ts` — work history entries (company, title, dates, summary, highlights).
- `posts/*.mdx` — blog posts. Each file's frontmatter carries `title`, `date`, `summary`; the MDX body is the post itself. Read at build time via `lib/posts.ts`.

New entries are typically added via the `add-project` / `add-experience` Claude Code skills (see `.claude/skills/`), which scaffold the structured fields and run a tone check.

### `lib/` and `hooks/`

- `lib/utils.ts` — `cn()`, the standard shadcn `clsx` + `tailwind-merge` className helper.
- `lib/nav-items.ts` — the nav link list; single source of truth consumed by `components/nav.tsx`.
- `lib/posts.ts` — reads and parses `content/posts/*.mdx` frontmatter (via `gray-matter`) for the blog list and post pages.
- `hooks/use-mobile.tsx` — `useIsMobile()`, a media-query hook (shadcn convention), for responsive behavior that CSS alone can't express.

### `e2e/` — viewport smoke test

- `viewport-overflow.spec.ts` — Playwright check that renders every route against the static-exported `out/` output at four widths (375px/393px/768px/1280px) and asserts nothing overflows horizontally. Configured in `playwright.config.ts` (serves `out/` via `serve` on port 4173). Run with `npm run test:viewport` (requires `npm run build` first).

### `scripts/` — repo tooling, not app code

- `check-bundle-size.mjs` — run after `npm run build`; fails if `.next/static/chunks` exceeds the KB budget in `bundle-budget.json`.
- `check-internal-links.mjs` — crawls `app/` for valid routes and scans for `href`s pointing at internal paths that don't exist.
- `git-hooks/pre-commit` — local pre-commit lint/typecheck gate, enabled once via `git config core.hooksPath scripts/git-hooks`.
- `setup-labels.sh` — one-time GitHub label setup for the issue-driven workflow (see `docs/WORKFLOW.md`).

### `docs/` — process and design docs

- `WORKFLOW.md` — full reference for the issue-driven development process (label taxonomy, the `issue-refiner`/`work-issue` lifecycle, CI gates).
- `superpowers/specs/`, `superpowers/plans/` — design and planning docs for past and future work (e.g. the Claude Code harness setup, a site redesign, and a deferred backend-integration spec not yet ready to implement).

### `.claude/` — Claude Code configuration for this repo

- `skills/` — `add-project`, `add-experience`, `issue-refiner`, `sync-resume`, `work-issue`: the skills that drive content edits and issue-to-PR implementation.
- `agents/content-reviewer.md` — a subagent that checks copy against the tone brief below.

This is tooling *for developing the site*, not something the site itself depends on at runtime.

### `.github/` — CI and repo templates

- `workflows/ci.yml` — on every PR and push to `main`: `verify` job runs lint, typecheck, build, the bundle-size check, and the internal-link check; a `viewport` job runs the Playwright viewport-overflow smoke test; a `lighthouse` job runs Lighthouse CI across every route (all jobs blocking).
- `ISSUE_TEMPLATE/task.yml`, `PULL_REQUEST_TEMPLATE.md` — structure for filed issues and opened PRs.

### Root config files

`components.json` (shadcn/ui config — style, aliases, Tailwind wiring), `tailwind.config.ts`, `next.config.js` (static export settings), `tsconfig.json`, `postcss.config.js`, `.eslintrc.json`, `.lighthouserc.js`, `bundle-budget.json`, `playwright.config.ts`.

## Commands

```bash
npm run dev          # local dev server
npm run build         # production build (static export to out/)
npm run lint            # ESLint
npm run typecheck        # tsc --noEmit
npm run test:viewport    # Playwright viewport-overflow check (run after npm run build)
node scripts/check-bundle-size.mjs      # run after npm run build
node scripts/check-internal-links.mjs
```

## Development workflow

Work is tracked as GitHub Issues and implemented via Claude Code skills (`issue-refiner`, `work-issue`). All changes land via PR — CI runs lint, typecheck, build, bundle-size budget, internal-link, and viewport-overflow checks. See `CLAUDE.md` for the summary and `docs/WORKFLOW.md` for the full reference.

## Deployment

Deployed on Vercel with automatic deployments on push to `main` and preview deployments for pull requests.

## License

This project is private and proprietary.
