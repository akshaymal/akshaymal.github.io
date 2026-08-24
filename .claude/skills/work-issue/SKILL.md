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
4. **Sync with base first.** Implementation (plus any back-and-forth on a tricky fix) can take long enough that `main` moves — a same-session branch going stale isn't a fluke, it's expected on anything nontrivial. Run `git fetch origin main`. If `origin/main` has commits the branch doesn't (`git log <branch>..origin/main` is non-empty), merge it in: `git merge origin/main` (never rebase or force-push — this may not be the only place work is happening, and a merge commit can't destroy anything). Resolve any conflicts. Doing this *before* self-verify means the verify pass below covers the code that will actually ship, instead of verifying a version of the branch that's about to be superseded — merging main in twice (once here, once again after review) is wasted work when once, at the right point, covers it.
5. **Self-verify** before review: run `npm run lint`, `npm run typecheck`, `npm run build`, and `npm run test:viewport` locally. If `package.json` or `package-lock.json` changed, also run `npx --yes --package npm@10 -- npm ci --dry-run`. Fix any failures before proceeding.

   Capture each command's output to a log file rather than letting it flood the conversation — most runs pass, and there's no reason to carry hundreds of lines of routine build/test output through the rest of the session. On failure, grep the log for the tool's actual failure markers with a little context, instead of guessing at a line count:

   ```bash
   npm run build > /tmp/build.log 2>&1
   if [ $? -ne 0 ]; then
     grep -n -iE "error|failed|✘" /tmp/build.log -A 5 -B 2 || tail -100 /tmp/build.log
   fi
   ```

   Apply the same pattern — log to file, grep for failure markers on non-zero exit, `tail` only as a last-resort fallback if grep finds nothing — to lint, typecheck, and the viewport test.

   The `npm@10` dry-run exists because CI (`.github/workflows/ci.yml`) runs Node 20, which bundles a different npm major version than a typical local dev machine (this repo has been developed against npm 11.x locally). Two prior PRs shipped a lockfile that passed local `npm ci` but failed identically both times in CI with the same error, for an optional, cpu-filtered transitive dependency (see issue #12). The npm-version difference is the leading hypothesis — reproduced directly (the exact failing lockfile passed local `npm ci` and failed the real CI run) — but OS (Windows vs. Linux) was never tested in isolation from npm version, so treat it as a strong, evidence-backed hypothesis, not a certainty. Running the dry-run under npm 10 locally is a cheap, effective gate regardless of which variable is the true cause. Skip it for changes that don't touch `package.json`/`package-lock.json` — it's not needed and adds ~10-20s for no benefit on unrelated changes.

   `npm run test:viewport` runs a Playwright check (`e2e/viewport-overflow.spec.ts`) against the static-exported `out/` output at four viewport widths per route, asserting nothing overflows horizontally — added after a nav overflow bug shipped undetected because no tool in the harness rendered a real viewport (see issue #13). Requires `npm run build` to have produced `out/` first, and a Chromium install matching the pinned `@playwright/test` version (`npx playwright install chromium` once per environment if the browser binary is missing or mismatched — check `npx playwright --version` against the installed browser revision if it fails to launch).
6. **Independent review gate.** Dispatch a fresh subagent (not a fork — no shared context with this session) with the `code-review` skill, giving it only: the diff (`git diff main...HEAD`), the issue's acceptance criteria, and access to the codebase. It must not be told what reasoning produced the changes. If it reports correctness findings, fix them and re-run step 5 before proceeding.
7. **Docs & artifacts check.** Read `docs/superpowers/INDEX.md` (short, always cheap). Its "In scope for changes to…" column tells you which spec/plan docs are relevant to the files your change touches — open only those. For `README.md` and `docs/WORKFLOW.md` (both short), read them directly if the change touches harness, workflow, or scripts; skip otherwise.
   - If an existing doc now describes something inaccurately, update it in this PR — don't leave known drift for a future pass.
   - If the change introduces something that needs documentation but doesn't fit any existing doc's purpose (e.g. a new subsystem, a new workflow), write a new doc rather than overloading an unrelated one. Add an entry for it to `docs/superpowers/INDEX.md`.
   - If nothing changed that any doc describes, no action needed — don't manufacture doc edits for their own sake.
8. **Re-check base before opening the PR.** Review rounds (steps 6-7) can themselves take long enough for `main` to move again. Run `git fetch origin main` and check `git log <branch>..origin/main`. If it's empty, the merge from step 4 still covers what's shipping — go straight to step 9. If it's non-empty, merge it in (same approach as step 4, resolve any conflicts) and re-run *only* step 5 (self-verify) against the newly-merged result — a clean merge can still combine into something that no longer builds or passes lint/typecheck, and the merged-in commits weren't covered by this issue's own review round. Push, *then* open the PR. This step should be a no-op most of the time; it only does real work when main moved again during review.
9. **Open the PR.** `gh pr create --title "<summary> (#<N>)" --body "<body>"` where the body is:

   ```
   Closes #<N>

   ## Acceptance criteria

   <checklist copied from the issue, each item checked or explicitly left unchecked with a reason>

   ## Verification

   - [x] npm run lint
   - [x] npm run typecheck
   - [x] npm run build
   - [x] Independent code-review pass (see above)
   - [x] Docs/artifacts checked for staleness against this change (see above)
   ```

10. **Report back** the PR URL and a one-line summary. Do not merge — merging is the user's call.

## Guardrails

- Never push directly to `main`.
- Never skip the independent review gate, even for small changes.
- Never skip the docs & artifacts check, even when the answer is "nothing to update."
- Never open a PR without first checking the branch is current with `origin/main` (step 8) — a PR opened against a stale base is a preventable, not occasional, failure mode.
- If the acceptance criteria turn out to be wrong or incomplete once you're implementing, stop and ask the user rather than silently expanding or shrinking scope.
