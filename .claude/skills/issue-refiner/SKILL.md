---
name: issue-refiner
description: Turn a rough GitHub issue into an agent-ready one by grilling the user until acceptance criteria, definition of done, area, and priority are all unambiguous and non-overlapping with other open issues. Use when asked to refine, groom, or make an issue agent-ready.
---

# Issue Refiner

Use this skill when the user asks to refine, groom, or prepare a GitHub issue for agent pickup (e.g., "refine issue #12", "make this issue agent-ready").

## Process

1. **Fetch the issue.** Run `gh issue view <N> --json title,body,labels` to read its current state.
2. **Fetch open issues for overlap check.** Run `gh issue list --state open --json number,title,labels` and compare scope against the issue being refined. Flag any apparent overlap to the user before proceeding.
3. **Grill the user** using the round-based interview pattern (see the `grilling` skill if installed) until each of the following is concretely filled in, not vague:
   - **Type**: `feature` / `content` / `chore` / `bug`
   - **Priority**: `P1` / `P2` / `P3`
   - **Area**: `content` / `ui` / `seo` / `infra` / `harness`
   - **Acceptance criteria**: a checklist of specific, verifiable conditions — not "make it better," but e.g. "the /projects page renders each entry from content/projects.ts with title, summary, and tags."
   - **Definition of done**: build/lint/typecheck pass, plus anything issue-specific (e.g., "docs/WORKFLOW.md updated").
4. **Check for ambiguity against other open issues.** If two open issues could both plausibly claim the same file or behavior, stop and ask the user to either merge them or redraw the boundary before continuing.
5. **Update the issue** via `gh issue edit <N>`:
   - Set the body to the filled-in template (Type/Priority/Area/Description/Acceptance criteria/DoD).
   - Apply exactly one label from each of Type, Priority, Area.
   - Apply the `agent-ready` label only once all of the above is unambiguous.
6. **Confirm with the user**: report the final issue body and labels before ending.

## Guardrails

- Never apply `agent-ready` on your own judgment alone — the user must explicitly confirm the acceptance criteria are correct and complete.
- If the user can't answer a question about scope precisely, that itself is a signal the issue isn't ready — keep grilling rather than filling in a plausible-sounding guess.
