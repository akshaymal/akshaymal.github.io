---
name: work-issue
description: Implement a GitHub issue that has been marked agent-ready — branch, implement against its acceptance criteria, get an independent code-review pass, and open a PR. Use when asked to work on, pick up, or implement a specific issue number.
---

# Work Issue

Use this skill when asked to "work on issue #N" or equivalent.

## Process

1. **Fetch and verify.** Run `gh issue view <N> --json title,body,labels,state`. If it's not open, stop and tell the user. If it does not have the `agent-ready` label, stop and tell the user to run the `issue-refiner` skill on it first — do not attempt to infer missing scope yourself.
2. **Branch.** From an up-to-date `main`: `git checkout main && git pull && git checkout -b issue-<N>-<short-slug>`, where `<short-slug>` is a kebab-case summary of the issue title.
3. **Implement** against the acceptance criteria in the issue body. Follow this repo's `CLAUDE.md` conventions (tech stack, file structure, tone brief for any content). Make focused commits, each referencing the issue: `git commit -m "<summary> (#<N>)"`.
4. **Self-verify** before review: run `npm run lint`, `npm run typecheck`, and `npm run build` locally. Fix any failures before proceeding.
5. **Independent review gate.** Dispatch a fresh subagent (not a fork — no shared context with this session) with the `code-review` skill, giving it only: the diff (`git diff main...HEAD`), the issue's acceptance criteria, and access to the codebase. It must not be told what reasoning produced the changes. If it reports correctness findings, fix them and re-run this step before proceeding.
6. **Open the PR.** `gh pr create --title "<summary> (#<N>)" --body "<body>"` where the body is:

   ```
   Closes #<N>

   ## Acceptance criteria

   <checklist copied from the issue, each item checked or explicitly left unchecked with a reason>

   ## Verification

   - [x] npm run lint
   - [x] npm run typecheck
   - [x] npm run build
   - [x] Independent code-review pass (see above)
   ```

7. **Report back** the PR URL and a one-line summary. Do not merge — merging is the user's call.

## Guardrails

- Never push directly to `main`.
- Never skip the independent review gate, even for small changes.
- If the acceptance criteria turn out to be wrong or incomplete once you're implementing, stop and ask the user rather than silently expanding or shrinking scope.
