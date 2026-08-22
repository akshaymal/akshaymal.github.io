# akshaymalhotra.dev

Personal portfolio for Akshay Malhotra. Fast, professional, direct, lightweight — see `docs/superpowers/specs/2026-08-22-harness-foundation-design.md` for the harness design, and the Spec 2 design doc (once written) for visual/content decisions.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, deployed on Vercel. Do not introduce a different framework or a heavier stack without a real reason — this project deliberately stays lightweight.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (also run in CI)
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `node scripts/check-bundle-size.mjs` — bundle size budget check (run after `npm run build`)
- `node scripts/check-internal-links.mjs` — broken internal link check

## One-time local setup

- `git config core.hooksPath scripts/git-hooks` — enables the pre-commit lint/typecheck gate.
- `gh auth login` — required before any skill that creates/reads issues or PRs (`issue-refiner`, `work-issue`).

## Workflow: issues drive the work

All planned work — features, content, chores, bugs — is tracked as a GitHub Issue, not a TODO file. Full detail in `docs/WORKFLOW.md`; summary:

1. Issues get filed at any level of roughness.
2. The `issue-refiner` skill turns a rough issue into `agent-ready` (unambiguous acceptance criteria, one Type/Priority/Area label each).
3. Say "work on issue #N" to start — the `work-issue` skill branches, implements, self-verifies, gets an independent code-review pass, and opens a PR.
4. **Never push directly to `main`.** All changes land via PR, and CI (lint, typecheck, build, bundle-size, link-check, Lighthouse) must pass.

## Content skills

- `add-project` — new entry in `content/projects.ts`
- `add-experience` — new entry in `content/experience.ts`
- `sync-resume` — reconcile site content against an updated resume, surfacing drift rather than auto-overwriting

## Tone brief (applies to all copy)

Professional, direct, lightweight. No filler, no corporate-speak, specifics over adjectives. The `content-reviewer` subagent checks this automatically inside the content skills above — invoke it manually too if you're writing copy outside those skills.

## Branch/commit/PR conventions

- Branch: `issue-<N>-<short-slug>`
- Commits reference the issue: `<summary> (#<N>)`
- PRs: `Closes #<N>`, body restates acceptance criteria as a checklist, plus a verification checklist (lint/typecheck/build/independent review)
