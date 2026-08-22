---
name: add-project
description: Scaffold a new entry in content/projects.ts with the project's structured fields (problem, role, decision, outcome). Use when asked to add a new project to the portfolio.
---

# Add Project

1. Ask the user for: title, one-line summary, problem, role, key decision/tradeoff, outcome, tags (array of short strings), and an optional external link.
2. Derive a `slug` (kebab-case of the title) and confirm it's unique against existing entries in `content/projects.ts`.
3. Append a new `Project` object to the `projects` array in `content/projects.ts`, matching the existing `Project` interface exactly.
4. Run the `content-reviewer` subagent against the new entry's text fields (summary, problem, role, decision, outcome) for tone.
5. Run `npm run typecheck` to confirm the new entry satisfies the `Project` type.
6. Report the added entry back to the user for a final look before committing.
