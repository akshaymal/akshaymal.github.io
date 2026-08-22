---
name: add-experience
description: Add a new entry to content/experience.ts (company, title, dates, summary, highlights). Use when asked to add a job/role to the portfolio's experience section.
---

# Add Experience

1. Ask the user for: company, title, start date, end date (or "present"), a one-line summary, and a list of highlight bullets (impact-focused, not duty-focused — see the tone brief in `CLAUDE.md`).
2. Derive a `slug` (kebab-case of `company-title`) and confirm it's unique against existing entries in `content/experience.ts`.
3. Append a new `ExperienceEntry` object to the `experience` array, matching the existing interface exactly. Use `null` for `endDate` if current.
4. Run the `content-reviewer` subagent against `summary` and `highlights` for tone.
5. Run `npm run typecheck` to confirm the new entry satisfies the `ExperienceEntry` type.
6. Report the added entry back to the user for a final look before committing.
