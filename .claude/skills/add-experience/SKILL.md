---
name: add-experience
description: Add a new entry to content/experience.ts (company, title, dates, summary, highlights). Use when asked to add a job/role to the portfolio's experience section.
---

# Add Experience

`content/experience.ts` groups entries by employer: each `ExperienceEmployer` has `company`, `shortName`, `logo?`, `location`, and a `positions` array (ordered most-recent-first), where each `ExperiencePosition` has its own `title`, `startDate`, `endDate`, `highlights`, and `tags`.

1. Ask the user for: company, title, start date, end date (or "present"), tags, and a list of highlight bullets (impact-focused, not duty-focused — see the tone brief in `CLAUDE.md`).
2. Check whether the company already has an entry in `content/experience.ts`.
   - **New employer:** derive a `slug` (kebab-case of the company name) and confirm it's unique, then append a new `ExperienceEmployer` object to the `experience` array with a single-item `positions` array.
   - **New position at an existing employer:** prepend the new `ExperiencePosition` to that employer's `positions` array (most-recent-first).
3. Use `null` for `endDate` if current.
4. Run the `content-reviewer` subagent against `highlights` for tone.
5. Run `npm run typecheck` to confirm the new/updated entry satisfies the `ExperienceEmployer`/`ExperiencePosition` types.
6. Report the added entry back to the user for a final look before committing.
