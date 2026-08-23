# akshaymalhotra.dev

Personal portfolio for Akshay Malhotra — senior software engineer. Fast, professional, direct, lightweight.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** (Radix primitives under `components/ui/`)
- Fonts: Inter (sans) and Source Serif 4, via `next/font/google`
- Deployed on **Vercel**, with Vercel Analytics

## Project structure

```
.
├── app/                  # Routes (App Router) — one page.tsx per route, thin
│   ├── page.tsx              # Home
│   ├── experience/page.tsx
│   ├── projects/page.tsx
│   ├── beyond-work/page.tsx
│   ├── layout.tsx            # Root layout, metadata, JSON-LD
│   ├── fonts.ts
│   ├── globals.css
│   └── sitemap.ts
├── components/           # Shared UI
│   └── ui/                   # shadcn/ui primitives
├── content/              # Structured content (projects, experience) — edited independently of components
├── lib/                  # Small shared utilities
├── hooks/                # Custom React hooks
├── public/assets/        # Static assets
├── scripts/               # CI/tooling scripts (bundle size, link check, git hooks, label setup)
├── docs/                 # Workflow reference and design specs/plans
└── .claude/              # Claude Code skills and agents used to develop this repo
```

## Commands

```bash
npm run dev          # local dev server
npm run build         # production build
npm start             # start production server
npm run lint           # ESLint
npm run typecheck       # tsc --noEmit
```

## Development workflow

Work is tracked as GitHub Issues and implemented via Claude Code skills (`issue-refiner`, `work-issue`). All changes land via PR — CI runs lint, typecheck, build, bundle-size budget, and internal-link checks. See `CLAUDE.md` for the summary and `docs/WORKFLOW.md` for the full reference.

## Deployment

Deployed on Vercel with automatic deployments on push to `main` and preview deployments for pull requests.

## License

This project is private and proprietary.
