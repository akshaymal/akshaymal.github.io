---
name: sync-resume
description: Reconcile content/experience.ts (and About copy) against an updated resume, flagging drift instead of silently overwriting. Use when the user's resume has changed and the site's content needs to catch up.
---

# Sync Resume

1. Ask the user for the updated resume content (pasted text or a file path) if not already provided.
2. Compare it against the current `content/experience.ts` entries and any resume-derived copy on the About page.
3. For each discrepancy (new role, changed dates, changed highlights, removed role), report it to the user individually — do not auto-apply changes. Present as a list: "Resume says X, site currently says Y."
4. For each discrepancy the user confirms should be applied, make the edit directly in `content/experience.ts` (or the About page copy), following the existing `ExperienceEntry` structure.
5. Run the `content-reviewer` subagent against any newly written copy for tone.
6. Run `npm run typecheck` and report a summary of what changed.

## Guardrails

- Never silently overwrite existing entries — this skill's whole purpose is surfacing drift, not blindly syncing.
