# Workflow: Issue-Driven Development

This document is the full reference for how work moves from idea to shipped code on akshaymalhotra.dev. `CLAUDE.md` has the summary; this is the detail, meant to make sense to a session with zero memory of how this was set up.

## One-time repo setup (do these once, in order)

1. Install and authenticate `gh`: `gh auth login`.
2. Create labels: `bash scripts/setup-labels.sh`.
3. Enable branch protection on `main` (requires repo admin):
   ```bash
   gh api repos/:owner/:repo/branches/main/protection \
     --method PUT \
     --field required_status_checks='{"strict":true,"contexts":["verify"]}' \
     --field enforce_admins=true \
     --field required_pull_request_reviews='{"required_approving_review_count":1}' \
     --field restrictions=null
   ```
4. Local git hook: `git config core.hooksPath scripts/git-hooks`.

## Label taxonomy (fixed — do not add ad-hoc labels)

| Family | Values | Meaning |
|---|---|---|
| Type | `type:feature`, `type:content`, `type:chore`, `type:bug` | What kind of change |
| Priority | `priority:p1`, `priority:p2`, `priority:p3` | Urgency |
| Area | `area:content`, `area:ui`, `area:seo`, `area:infra`, `area:harness` | What part of the project it touches |
| Status | `agent-ready` | Only applied once acceptance criteria/DoD are unambiguous and non-overlapping with other open issues |

Every issue gets exactly one Type, one Priority, one Area label.

## Lifecycle

1. **File the issue** using the `task.yml` form (`.github/ISSUE_TEMPLATE/task.yml`), at any level of roughness.
2. **Refine it**: run the `issue-refiner` skill against the issue number. It interviews you until Type/Priority/Area/acceptance criteria/DoD are all concrete, checks for overlap with other open issues, and applies `agent-ready`.
3. **Work it**: say "work on issue #N". The `work-issue` skill:
   - Verifies `agent-ready` is set (refuses to proceed otherwise).
   - Branches as `issue-<N>-<short-slug>` off up-to-date `main`.
   - Implements against the acceptance criteria, following `CLAUDE.md`.
   - Self-verifies: lint, typecheck, build.
   - Dispatches a **fresh, context-free subagent** to run the `code-review` skill against the diff — independent scrutiny with no exposure to the implementation reasoning.
   - Opens a PR: `Closes #N`, acceptance criteria restated as a checklist, verification checklist included.
4. **CI runs** (`.github/workflows/ci.yml`): lint, typecheck, build, bundle-size budget, internal-link check (all blocking), plus Lighthouse CI (currently non-blocking — see below).
5. **You review and merge.** No autonomous merges, ever — branch protection enforces this at the repo level, not just by convention.

## Lighthouse CI status

Currently **non-blocking** (`.lighthouserc.json` has no failing assertions) because there's no real content yet to score meaningfully against a budget. Once Spec 2 ships real content, file an issue (`area:infra`) to add real assertion thresholds and make the job blocking.

## Backlog (filed as issues once `gh` is set up)

- Logo/mark design
- Real contact form (replacing `mailto:`)
- Blog (MDX/CMS-backed)
- Lighthouse CI promotion to blocking
