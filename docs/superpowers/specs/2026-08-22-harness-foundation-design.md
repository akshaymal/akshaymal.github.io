# Spec 1: Harness & Workflow Foundation

Status: Approved
Date: 2026-08-22
Author: Akshay Malhotra (with Claude)

## Context

`akshaymalhotra.dev` is a personal portfolio, restarted after being abandoned mid-build last year. This time the goal is to ship a fast, professional, direct v1 within one to two weekends, and — just as importantly — to set up a Claude Code harness solid enough that work can resume months from now without re-deriving context.

This spec covers **only the harness and workflow foundation**: how work gets planned, gated, and shipped. It intentionally excludes visual identity, information architecture, and content — those are Spec 2 (Site Redesign), which depends on this foundation but not vice versa.

## Goals

- GitHub Issues are the single source of truth for planned work (features, content, chores, bugs) — not a TODO file, not tribal knowledge.
- An issue can be handed to a fresh Claude Code session ("work on issue #N") and executed safely, with real gates before anything reaches `main`.
- Recurring content/feature work (adding a project, adding an experience entry, refining a rough issue) has purpose-built skills instead of ad-hoc prompting each time.
- Guardrails are proportionate: real (PR review, CI, independent code review) but with minimal added dependencies, appropriate for a solo-maintained personal site.
- No autonomous CI/CD triggering (e.g., GitHub Actions auto-invoking Claude Code) — pickup is manual ("work on issue #N") for now. Automatic triggering is out of scope for this spec and can be added later if the manual flow proves itself.

## Non-goals

- Visual identity, IA, page content — Spec 2.
- Parallel/multi-agent execution of multiple issues at once — not needed at this scale.
- A separate "developer agent" persona — the session you're talking to is the developer; `work-issue` is a skill it follows, not a distinct identity.

## Issue system

### Issue template

One structured form, `.github/ISSUE_TEMPLATE/task.yml`, with fields:
- **Type** (dropdown, fixed): `feature` / `content` / `chore` / `bug`
- **Priority** (dropdown, fixed): `P1` / `P2` / `P3`
- **Area** (dropdown, fixed): `content` / `ui` / `seo` / `infra` / `harness`
- **Description / context** (free text)
- **Acceptance criteria** (checklist)
- **Definition of done** (checklist — e.g. build passes, docs updated if relevant)

### Label taxonomy (fixed — no free-form labels)

| Family | Labels |
|---|---|
| Type | `type:feature`, `type:content`, `type:chore`, `type:bug` |
| Priority | `priority:p1`, `priority:p2`, `priority:p3` |
| Area | `area:content`, `area:ui`, `area:seo`, `area:infra`, `area:harness` |
| Status | `agent-ready` |

Every issue gets exactly one Type, one Priority, one Area. `agent-ready` is applied only once the issue is unambiguous, self-contained, and non-overlapping with other open issues — this is the separation-of-concern gate.

### Lifecycle

1. Idea filed as an issue, any level of roughness.
2. `issue-refiner` skill (interactive) grills the user until acceptance criteria, DoD, area, and priority are all unambiguous → applies `agent-ready`.
3. User says "work on issue #N" in a session.
4. `work-issue` skill: verifies `agent-ready`, creates branch `issue-<n>-<slug>`, implements against the acceptance criteria, commits referencing `#N`.
5. **Independent review gate**: a fresh, context-free subagent (no memory of the implementation reasoning) runs the `code-review` skill against the diff, using only the issue's acceptance criteria and the codebase as ground truth. Findings get fixed and re-reviewed before proceeding.
6. `work-issue` opens a PR: `Closes #N`, body restates acceptance criteria as a checklist.
7. CI gates run (see below). User reviews and merges — no autonomous merge.

## Skills (`.claude/skills/`)

- **`issue-refiner`** — interactive; grills the user (same style as this project's own brainstorming sessions) to turn a rough issue into `agent-ready`.
- **`work-issue`** — implements the lifecycle steps 4–6 above, including dispatching the independent review subagent.
- **`add-project`** — scaffolds a new Projects entry with the structured fields defined in Spec 2.
- **`add-experience`** — adds a new Experience entry.
- **`sync-resume`** — given updated resume content, reconciles About/Experience copy and flags drift.

## Subagent (`.claude/agents/`)

- **`content-reviewer`** — checks new/changed copy against the tone brief (professional, direct, lightweight; no filler) before it's finalized. Invoked by the content skills above, and callable manually.

## Local + CI gates

- **Local pre-commit**: plain script at `scripts/git-hooks/pre-commit` running ESLint + `tsc --noEmit`. No husky or other dependency — installed via `git config core.hooksPath scripts/git-hooks`. Kept fast so it isn't skipped.
- **CI** (`.github/workflows/ci.yml`, on every PR): install → ESLint → `tsc --noEmit` → `next build` → bundle-size budget → broken-internal-link check → Lighthouse CI (Performance / Accessibility / Best Practices / SEO).
  - Lighthouse starts **non-blocking** (report only) since there's no real content yet to score meaningfully. Promotion to a blocking budget is tracked as a backlog issue once Spec 2 ships real content.
- **Branch protection on `main`**: PRs required, no direct pushes. This is the actual enforcement of human-in-the-loop at merge, not just a documented convention.

## Documentation

- **`CLAUDE.md`** (repo root): stack, commands, the issue-driven workflow, branch/commit/PR conventions, tone brief, explicit guardrail ("never push directly to main"), pointers to `docs/WORKFLOW.md`.
- **`docs/WORKFLOW.md`**: the full issue lifecycle, label taxonomy, and gates spelled out in detail, so a resumed session (or the user, months later) doesn't have to re-derive it from `CLAUDE.md` alone.
- This spec file.

## Setup dependency

`gh` CLI is not installed or authenticated on the development machine as of this writing. It's required before issues/PRs can be created from a session. This will be walked through (via the `wizard` skill) when the backlog issues below are actually filed — not part of this spec's build.

## Backlog to file once `gh` is set up

Captured here so nothing from the brainstorming session is lost:
- Logo/mark design (deferred from Spec 2's wordmark-only v1)
- Real contact form (deferred from Spec 2's `mailto:` v1)
- Blog (MDX/CMS-backed), deferred entirely from v1
- Lighthouse CI promotion from non-blocking to blocking, once Spec 2 ships real content

## Open questions for Spec 2 (not this spec)

None — Spec 2 will run its own brainstorming pass, including the visual companion for identity/layout direction.
