# akshaymalhotra.dev

Personal portfolio for Akshay Malhotra. Fast, professional, direct, lightweight — see `docs/superpowers/specs/2026-08-22-harness-foundation-design.md` for the harness design (Spec 1), `docs/superpowers/specs/2026-08-22-site-redesign-design.md` for visual/content decisions (Spec 2, current architecture), and `docs/superpowers/specs/2026-08-25-backend-integration-design.md` for the future backend-integration direction (Spec 3, not yet ready to implement).

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, deployed on Vercel. Do not introduce a different framework or a heavier stack without a real reason — this project deliberately stays lightweight.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (also run in CI)
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `node scripts/check-bundle-size.mjs` — bundle size budget check (run after `npm run build`)
- `node scripts/check-internal-links.mjs` — broken internal link check
- `npm run test:viewport` — Playwright viewport-overflow check across every route (run after `npm run build`)

## One-time local setup

- `git config core.hooksPath scripts/git-hooks` — enables the pre-commit lint/typecheck gate.
- `gh auth login` — required before any skill that creates/reads issues or PRs (`issue-refiner`, `work-issue`).

## Workflow: issues drive the work

All planned work — features, content, chores, bugs — is tracked as a GitHub Issue, not a TODO file. Full detail in `docs/WORKFLOW.md`; summary:

1. Issues get filed at any level of roughness.
2. The `issue-refiner` skill turns a rough issue into `agent-ready` (unambiguous acceptance criteria, one Type/Priority/Area label each).
3. Say "work on issue #N" to start — the `work-issue` skill branches, implements, self-verifies, gets an independent code-review pass, and opens a PR.
4. **Never push directly to `main`.** All changes land via PR, and CI (lint, typecheck, build, bundle-size, link-check, viewport-overflow check, Lighthouse) must pass.

**Issue creation rule:** Never create a GitHub issue directly via the API or MCP tools. Always invoke the `issue-refiner` skill instead — it enforces the required Type/Priority/Area labels and acceptance criteria before the issue is filed. The `.github/ISSUE_TEMPLATE/task.yml` form (used by the GitHub web UI) and the `issue-refiner` skill are the only two sanctioned paths for creating issues.

**Spec-stage work exception:** work belonging to a spec that's still being drafted or deliberately deferred (e.g. Spec 3: Backend Integration) does not get filed as a GitHub issue — log it in that spec doc's own open-questions/future-work section instead, since it isn't actionable yet. See `docs/WORKFLOW.md`'s "Spec-scoped work" section.

## Content skills

- `add-project` — new entry in `content/projects.ts`
- `add-experience` — new entry in `content/experience.ts`
- `add-blog-post` — new entry in `content/posts/`, co-drafted body via `doc-coauthoring`
- `sync-resume` — reconcile site content against an updated resume, surfacing drift rather than auto-overwriting

## Tone brief (applies to all copy)

Professional, direct, lightweight. No filler, no corporate-speak, specifics over adjectives. The `content-reviewer` subagent checks this automatically inside the content skills above — invoke it manually too if you're writing copy outside those skills.

## Branch/commit/PR conventions

- Branch: `issue-<N>-<short-slug>`
- Commits reference the issue: `<summary> (#<N>)`
- PRs: `Closes #<N>`, body restates acceptance criteria as a checklist, plus a verification checklist (lint/typecheck/build/independent review)
