# Workflow: Issue-Driven Development

This document is the full reference for how work moves from idea to shipped code on akshaymalhotra.dev. `CLAUDE.md` has the summary; this is the detail, meant to make sense to a session with zero memory of how this was set up.

## One-time repo setup (do these once, in order)

1. Install and authenticate `gh`: `gh auth login`.
2. Create labels: `bash scripts/setup-labels.sh`.
3. Enable branch protection on `main` (requires repo admin). `gh api --field` does not accept nested JSON objects (it treats each value as a literal string, which the API then rejects) — write a payload file and use `--input` instead:
   ```bash
   cat <<'JSON' > /tmp/branch-protection.json
   {
     "required_status_checks": { "strict": true, "contexts": ["verify"] },
     "enforce_admins": true,
     "required_pull_request_reviews": { "required_approving_review_count": 0 },
     "restrictions": null
   }
   JSON
   gh api repos/:owner/:repo/branches/main/protection --method PUT --input /tmp/branch-protection.json
   ```
   `required_approving_review_count` is `0`, not `1`, because this is a solo-maintained repo — GitHub doesn't let a PR author approve their own PR, so a count of `1` combined with `enforce_admins: true` would lock you out of merging your own PRs. The real guardrails here are "no direct pushes to `main`" (this setting) and "CI must pass" (the `required_status_checks` above) — the human-in-the-loop step is you reviewing the diff before clicking merge, not a separate GitHub approval. If this repo ever gets a second maintainer, raise this back to `1`.
   
   (Already applied to this repo as of 2026-08-22 — this step is here for reference/future clones, not something you need to re-run.)
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
   - Self-verifies: lint, typecheck, build, plus an `npm@10`-pinned `npm ci --dry-run` when `package.json`/`package-lock.json` changed (catches npm-version-dependent lockfile drift before it reaches CI — see [#12](https://github.com/akshaymal/akshaymalhotra.dev/issues/12)).
   - Dispatches a **fresh, context-free subagent** to run the `code-review` skill against the diff — independent scrutiny with no exposure to the implementation reasoning.
   - Checks docs/artifacts (`README.md`, this file, relevant `docs/superpowers/` specs) against what the change actually touches: updates anything now stale, or writes a new doc if the change introduces something that doesn't fit an existing doc's purpose. No-op if nothing changed that any doc describes.
   - Opens a PR: `Closes #N`, acceptance criteria restated as a checklist, verification checklist included.
4. **CI runs** (`.github/workflows/ci.yml`): lint, typecheck, build, bundle-size budget, internal-link check (all blocking), plus Lighthouse CI (currently non-blocking — see below).
5. **You review and merge.** No autonomous merges, ever — branch protection enforces this at the repo level, not just by convention.

## Lighthouse CI status

Currently **non-blocking** (`.lighthouserc.json` has no assertions configured) because there's no real content yet to score meaningfully against a budget. Tracked as [#7](https://github.com/akshaymal/akshaymalhotra.dev/issues/7).

## Backlog

Filed as GitHub issues (none of these are `agent-ready` yet — each needs a pass through `issue-refiner` before pickup):

- [#4](https://github.com/akshaymal/akshaymalhotra.dev/issues/4) — Logo/mark design
- [#5](https://github.com/akshaymal/akshaymalhotra.dev/issues/5) — Real contact form (replacing `mailto:`)
- [#6](https://github.com/akshaymal/akshaymalhotra.dev/issues/6) — Blog (MDX/CMS-backed)
- [#7](https://github.com/akshaymal/akshaymalhotra.dev/issues/7) — Lighthouse CI promotion to blocking
