# docs/superpowers — Index

Read this file first. Only open a full doc if its entry says it's relevant to what you're working on.

## Specs (design decisions, rationale, approved direction)

| File | Covers | In scope for changes to… |
|------|--------|--------------------------|
| `specs/2026-08-22-harness-foundation-design.md` | Agent workflow, GitHub Issues as source of truth, CI gates, skills architecture, guardrails philosophy | `.claude/`, `.github/`, `scripts/`, `docs/WORKFLOW.md`, `CLAUDE.md`, CI config |
| `specs/2026-08-22-site-redesign-design.md` | Visual identity (Direction D palette, typography), page structure, nav architecture, content sourcing, dark mode, SEO/analytics | `app/`, `components/`, `tailwind.config.ts`, `app/globals.css`, `content/` |

## Plans (step-by-step implementation, checkbox tracking)

| File | Covers | In scope for changes to… |
|------|--------|--------------------------|
| `plans/2026-08-22-harness-foundation.md` | Task-by-task implementation of the harness: `content/` data foundations, `.claude/skills/`, `.claude/agents/`, CI workflows, scripts, branch protection | `.claude/`, `.github/workflows/`, `scripts/`, `content/projects.ts`, `content/experience.ts` |
| `plans/2026-08-22-site-redesign.md` | Task-by-task implementation of the site redesign: palette/font tokens, nav, all app routes, Experience/Projects pages, SEO, analytics | `app/`, `components/`, `tailwind.config.ts`, `app/globals.css`, `public/fonts/`, `content/` |

## How to use this index

1. Identify the files your change touches.
2. Check the "In scope for changes to…" column — open only the docs whose scope overlaps.
3. If your change doesn't overlap with any entry, no doc read needed.
