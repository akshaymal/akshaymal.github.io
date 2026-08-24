---
name: issue-refiner
description: Turn a rough GitHub issue into an agent-ready one by grilling the user until acceptance criteria, definition of done, area, and priority are all unambiguous and non-overlapping with other open issues. Use when asked to refine, groom, or make an issue agent-ready.
---

# Issue Refiner

Use this skill when the user asks to refine, groom, or prepare a GitHub issue for agent pickup (e.g., "refine issue #12", "make this issue agent-ready").

## Process

1. **Fetch the issue.** Run `gh issue view <N> --json title,body,labels` to read its current state.
2. **Fetch open issues for overlap check.** Run `gh issue list --state open --json number,title,labels` and compare scope against the issue being refined. Flag any apparent overlap to the user before proceeding.
3. **Separate the stated request from the underlying goal.** If the issue already names a specific implementation ("add a sticky header," "lock the footer," "cache X in Redis") rather than describing an outcome, don't take that implementation at face value. Ask the user *why* — what breaks or is annoying without it. The answer sorts the implementation into one of two buckets, and the Acceptance Criteria are written differently for each:
   - **It was a guess at solving an unstated problem.** The "why" reveals a different, more fundamental goal the named implementation was just one candidate for. Write the AC around that *outcome* (what must be true for a visitor/user) instead of the mechanism, so a simpler or better implementation discovered during grilling — or during implementation itself — can still satisfy the issue without being seen as a deviation.
   - **It's a real, confirmed constraint.** The user wants that specific mechanism for its own sake (an explicit preference, an existing-infrastructure dependency, a stack rule already established in `CLAUDE.md`) — not as a proxy for something else. Write the AC to state *both* the outcome and the mechanism explicitly; dropping the mechanism here would lose a real requirement, not just an implementation detail.

   Always capture the outcome. Only *also* pin down the mechanism once it's been confirmed as load-bearing in its own right, not just the first idea that came up. An issue that jumps straight to a specific fix for a vague problem is exactly the kind of issue that looks agent-ready but isn't: skip this step only when the issue is already phrased as an outcome with no implementation baked in.
4. **Grill the user** using the round-based interview pattern (see the `grilling` skill if installed) until each of the following is concretely filled in, not vague:
   - **Type**: `feature` / `content` / `chore` / `bug`
   - **Priority**: `P1` / `P2` / `P3`
   - **Area**: `content` / `ui` / `seo` / `infra` / `harness`
   - **Acceptance criteria**: a checklist of specific, verifiable conditions — not "make it better," but e.g. "the /projects page renders each entry from content/projects.ts with title, summary, and tags."
   - **Definition of done**: build/lint/typecheck pass, plus anything issue-specific (e.g., "docs/WORKFLOW.md updated").
5. **Check for ambiguity against other open issues.** If two open issues could both plausibly claim the same file or behavior, stop and ask the user to either merge them or redraw the boundary before continuing.
6. **Update the issue** via `gh issue edit <N>`:
   - Set the body to the filled-in template (Type/Priority/Area/Description/Acceptance criteria/DoD).
   - Apply exactly one label from each of Type, Priority, Area.
   - Apply the `agent-ready` label only once all of the above is unambiguous.
7. **Confirm with the user**: report the final issue body and labels before ending.

## Guardrails

- Never apply `agent-ready` on your own judgment alone — the user must explicitly confirm the acceptance criteria are correct and complete.
- If the user can't answer a question about scope precisely, that itself is a signal the issue isn't ready — keep grilling rather than filling in a plausible-sounding guess.
