# Harness & Workflow Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the issue-driven agent workflow, its skills/subagent, and its CI/local gates, per `docs/superpowers/specs/2026-08-22-harness-foundation-design.md`.

**Architecture:** Static config/docs/scripts live at the repo root and in `.github/`; project content gets a typed `content/` directory; Claude-facing behavior lives in `.claude/skills/` and `.claude/agents/`. No new runtime dependency except `@lhci/cli` (dev-only, explicitly requested). All checker scripts are dependency-free Node scripts.

**Tech Stack:** Node 20 (`node --version` confirmed 24.11.0, targeting Node 20 LTS in CI for stability), TypeScript, GitHub Actions, `gh` CLI (for label/branch-protection setup, run manually later), Lighthouse CI.

---

## Task 1: Content data foundations

**Files:**
- Create: `content/projects.ts`
- Create: `content/experience.ts`

- [ ] **Step 1: Create `content/projects.ts`**

```typescript
export interface Project {
  slug: string
  title: string
  summary: string
  problem: string
  role: string
  decision: string
  outcome: string
  tags: string[]
  link?: string
}

export const projects: Project[] = []
```

- [ ] **Step 2: Create `content/experience.ts`**

```typescript
export interface ExperienceEntry {
  slug: string
  company: string
  title: string
  startDate: string
  endDate: string | null
  summary: string
  highlights: string[]
}

export const experience: ExperienceEntry[] = []
```

- [ ] **Step 3: Verify both compile**

Run: `npx tsc --noEmit content/projects.ts content/experience.ts --strict`
Expected: no output (success)

- [ ] **Step 4: Commit**

```bash
git add content/projects.ts content/experience.ts
git commit -m "Add typed content data foundations for projects and experience"
```

---

## Task 2: Add `typecheck` npm script

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add the script**

In `package.json`, under `"scripts"`, add:

```json
"typecheck": "tsc --noEmit"
```

(Resulting `scripts` block: `dev`, `build`, `start`, `lint`, `typecheck`.)

- [ ] **Step 2: Run it**

Run: `npm run typecheck`
Expected: exits 0 (existing codebase is already valid TS)

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "Add typecheck npm script"
```

---

## Task 3: `CLAUDE.md`

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Create the file**

```markdown
# akshaymalhotra.dev

Personal portfolio for Akshay Malhotra. Fast, professional, direct, lightweight — see `docs/superpowers/specs/2026-08-22-harness-foundation-design.md` for the harness design, and the Spec 2 design doc (once written) for visual/content decisions.

## Stack

Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, deployed on Vercel. Do not introduce a different framework or a heavier stack without a real reason — this project deliberately stays lightweight.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build (also run in CI)
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `node scripts/check-bundle-size.mjs` — bundle size budget check (run after `npm run build`)
- `node scripts/check-internal-links.mjs` — broken internal link check

## One-time local setup

- `git config core.hooksPath scripts/git-hooks` — enables the pre-commit lint/typecheck gate.
- `gh auth login` — required before any skill that creates/reads issues or PRs (`issue-refiner`, `work-issue`).

## Workflow: issues drive the work

All planned work — features, content, chores, bugs — is tracked as a GitHub Issue, not a TODO file. Full detail in `docs/WORKFLOW.md`; summary:

1. Issues get filed at any level of roughness.
2. The `issue-refiner` skill turns a rough issue into `agent-ready` (unambiguous acceptance criteria, one Type/Priority/Area label each).
3. Say "work on issue #N" to start — the `work-issue` skill branches, implements, self-verifies, gets an independent code-review pass, and opens a PR.
4. **Never push directly to `main`.** All changes land via PR, and CI (lint, typecheck, build, bundle-size, link-check, Lighthouse) must pass.

## Content skills

- `add-project` — new entry in `content/projects.ts`
- `add-experience` — new entry in `content/experience.ts`
- `sync-resume` — reconcile site content against an updated resume, surfacing drift rather than auto-overwriting

## Tone brief (applies to all copy)

Professional, direct, lightweight. No filler, no corporate-speak, specifics over adjectives. The `content-reviewer` subagent checks this automatically inside the content skills above — invoke it manually too if you're writing copy outside those skills.

## Branch/commit/PR conventions

- Branch: `issue-<N>-<short-slug>`
- Commits reference the issue: `<summary> (#<N>)`
- PRs: `Closes #<N>`, body restates acceptance criteria as a checklist, plus a verification checklist (lint/typecheck/build/independent review)
```

- [ ] **Step 2: Verify it renders sensibly**

Run: `node -e "console.log(require('fs').readFileSync('CLAUDE.md','utf8').length + ' bytes')"`
Expected: prints a byte count > 0

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "Add CLAUDE.md project instructions"
```

---

## Task 4: `docs/WORKFLOW.md`

**Files:**
- Create: `docs/WORKFLOW.md`

- [ ] **Step 1: Create the file**

```markdown
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
```

- [ ] **Step 2: Commit**

```bash
git add docs/WORKFLOW.md
git commit -m "Add docs/WORKFLOW.md issue-driven workflow reference"
```

---

## Task 5: GitHub issue form + PR template

**Files:**
- Create: `.github/ISSUE_TEMPLATE/task.yml`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`

- [ ] **Step 1: Create the issue form**

```yaml
name: Task
description: A unit of work for this project (feature, content, chore, or bug)
title: "[TYPE] <short summary>"
labels: []
body:
  - type: dropdown
    id: type
    attributes:
      label: Type
      options:
        - feature
        - content
        - chore
        - bug
    validations:
      required: true
  - type: dropdown
    id: priority
    attributes:
      label: Priority
      options:
        - P1
        - P2
        - P3
    validations:
      required: true
  - type: dropdown
    id: area
    attributes:
      label: Area
      options:
        - content
        - ui
        - seo
        - infra
        - harness
    validations:
      required: true
  - type: textarea
    id: description
    attributes:
      label: Description / context
      description: What needs to happen and why.
    validations:
      required: true
  - type: textarea
    id: acceptance
    attributes:
      label: Acceptance criteria
      description: Checklist of conditions that must be true for this to be done.
      value: |
        - [ ]
        - [ ]
    validations:
      required: true
  - type: textarea
    id: dod
    attributes:
      label: Definition of done
      value: |
        - [ ] Build passes (`npm run build`)
        - [ ] Lint and typecheck pass
        - [ ] Docs updated if applicable
    validations:
      required: true
```

- [ ] **Step 2: Create the PR template**

```markdown
## Summary

<!-- What does this PR do and why -->

Closes #

## Acceptance criteria

<!-- Copy the acceptance criteria checklist from the issue and check off as satisfied -->

## Verification

- [ ] `npm run lint` passes
- [ ] `npm run typecheck` passes
- [ ] `npm run build` passes
- [ ] Independent code-review pass completed (fresh subagent, per `docs/WORKFLOW.md`)
```

- [ ] **Step 3: Validate the YAML parses**

Run: `node -e "const {readFileSync}=require('fs'); const yaml=readFileSync('.github/ISSUE_TEMPLATE/task.yml','utf8'); if(!yaml.includes('type: dropdown')) process.exit(1); console.log('ok')"`
Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add .github/ISSUE_TEMPLATE/task.yml .github/PULL_REQUEST_TEMPLATE.md
git commit -m "Add GitHub issue form and PR template"
```

---

## Task 6: Label setup script

**Files:**
- Create: `scripts/setup-labels.sh`

- [ ] **Step 1: Create the script**

```bash
#!/usr/bin/env bash
set -euo pipefail

# One-time setup. Requires `gh auth login` first (see docs/WORKFLOW.md).

declare -A LABELS=(
  ["type:feature"]="0E8A16"
  ["type:content"]="1D76DB"
  ["type:chore"]="C5DEF5"
  ["type:bug"]="D93F0B"
  ["priority:p1"]="B60205"
  ["priority:p2"]="D93F0B"
  ["priority:p3"]="FBCA04"
  ["area:content"]="5319E7"
  ["area:ui"]="0052CC"
  ["area:seo"]="006B75"
  ["area:infra"]="795548"
  ["area:harness"]="333333"
  ["agent-ready"]="0E8A16"
)

for name in "${!LABELS[@]}"; do
  color="${LABELS[$name]}"
  gh label create "$name" --color "$color" --force
done

echo "Labels created/updated."
```

- [ ] **Step 2: Make it executable and verify syntax**

Run: `chmod +x scripts/setup-labels.sh && bash -n scripts/setup-labels.sh`
Expected: no output (syntax OK). Do not run it for real yet — `gh` isn't authenticated on this machine.

- [ ] **Step 3: Commit**

```bash
git add scripts/setup-labels.sh
git commit -m "Add label setup script"
```

---

## Task 7: Pre-commit hook

**Files:**
- Create: `scripts/git-hooks/pre-commit`

- [ ] **Step 1: Create the hook**

```bash
#!/usr/bin/env bash
set -euo pipefail

echo "Running pre-commit checks (lint + typecheck)..."

npm run lint
npm run typecheck

echo "Pre-commit checks passed."
```

- [ ] **Step 2: Make it executable**

Run: `chmod +x scripts/git-hooks/pre-commit`

- [ ] **Step 3: Install it locally and verify it blocks a bad commit**

```bash
git config core.hooksPath scripts/git-hooks
echo "const x: number = 'not a number'" >> app/page.tsx
git add app/page.tsx
git commit -m "test: should be blocked"
```

Expected: commit fails (non-zero exit), TypeScript error printed for `app/page.tsx`.

- [ ] **Step 4: Revert the bad change and verify a clean commit succeeds**

```bash
git checkout -- app/page.tsx
git add scripts/git-hooks/pre-commit
git commit -m "Add pre-commit lint/typecheck hook"
```

Expected: commit succeeds.

---

## Task 8: Bundle-size budget check

**Files:**
- Create: `bundle-budget.json`
- Create: `scripts/check-bundle-size.mjs`

- [ ] **Step 1: Create the budget config**

```json
{
  "maxTotalKb": 500
}
```

- [ ] **Step 2: Create the checker script**

```javascript
#!/usr/bin/env node
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const budget = JSON.parse(readFileSync(join(process.cwd(), 'bundle-budget.json'), 'utf8'))
const chunksDir = join(process.cwd(), '.next', 'static', 'chunks')

function totalSize(dir) {
  let total = 0
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      total += totalSize(path)
    } else if (entry.name.endsWith('.js')) {
      total += statSync(path).size
    }
  }
  return total
}

const totalBytes = totalSize(chunksDir)
const totalKb = Math.round(totalBytes / 1024)

console.log(`Total JS in .next/static/chunks: ${totalKb} KB (budget: ${budget.maxTotalKb} KB)`)

if (totalKb > budget.maxTotalKb) {
  console.error(`Bundle size budget exceeded: ${totalKb} KB > ${budget.maxTotalKb} KB`)
  process.exit(1)
}
```

- [ ] **Step 3: Build and run it**

Run: `npm run build && node scripts/check-bundle-size.mjs`
Expected: prints total KB, exits 0 (current placeholder site is well under 500 KB)

- [ ] **Step 4: Commit**

```bash
git add bundle-budget.json scripts/check-bundle-size.mjs
git commit -m "Add bundle-size budget check"
```

---

## Task 9: Internal link checker

**Files:**
- Create: `scripts/check-internal-links.mjs`

- [ ] **Step 1: Create the script**

```javascript
#!/usr/bin/env node
import { readdirSync, statSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'

const routes = new Set()

function collectRoutes(dir, base = '') {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      collectRoutes(full, `${base}/${entry.name}`)
    } else if (entry.name === 'page.tsx') {
      routes.add(base === '' ? '/' : base)
    }
  }
}
collectRoutes(join(process.cwd(), 'app'))

const hrefPattern = /href=["'](\/[^"'#?]*)["']/g
const errors = []

function scanFile(path) {
  const content = readFileSync(path, 'utf8')
  let match
  while ((match = hrefPattern.exec(content))) {
    const href = match[1].replace(/\/$/, '') || '/'
    if (!routes.has(href)) {
      errors.push(`${relative(process.cwd(), path)}: broken internal link "${match[1]}"`)
    }
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue
    const full = join(dir, entry.name)
    if (statSync(full).isDirectory()) {
      walk(full)
    } else if (full.endsWith('.tsx') || full.endsWith('.ts')) {
      scanFile(full)
    }
  }
}

walk(join(process.cwd(), 'app'))
walk(join(process.cwd(), 'components'))

if (errors.length > 0) {
  console.error('Broken internal links found:\n' + errors.join('\n'))
  process.exit(1)
}
console.log(`Checked internal links. Known routes: ${[...routes].join(', ')}`)
```

- [ ] **Step 2: Run it against the current codebase**

Run: `node scripts/check-internal-links.mjs`
Expected: exits 0, lists known routes (`/`, `/experience`, `/projects`, `/blog`, `/hobbies/...`) — all current `<Link href>` targets in `app-sidebar.tsx` are real pages, so this should pass clean today.

- [ ] **Step 3: Commit**

```bash
git add scripts/check-internal-links.mjs
git commit -m "Add internal link checker script"
```

---

## Task 10: Lighthouse CI config

**Files:**
- Modify: `package.json` (add `@lhci/cli` devDependency)
- Create: `.lighthouserc.json`

- [ ] **Step 1: Install `@lhci/cli`**

Run: `npm install --save-dev @lhci/cli`
Expected: adds `@lhci/cli` to `devDependencies` in `package.json` and updates `package-lock.json`

- [ ] **Step 2: Create the config**

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start",
      "url": ["http://localhost:3000/"],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {}
    },
    "upload": {
      "target": "filesystem",
      "outputDir": "./.lighthouseci"
    }
  }
}
```

No assertions are defined yet, so this reports scores without failing the build — matches the "non-blocking until real content exists" decision in `docs/WORKFLOW.md`.

- [ ] **Step 3: Verify locally**

Run: `npm run build && npx lhci autorun`
Expected: exits 0, prints a report location under `.lighthouseci/`

- [ ] **Step 4: Add `.lighthouseci/` to `.gitignore`**

Append to `.gitignore`:

```
# lighthouse ci reports
.lighthouseci/
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json .lighthouserc.json .gitignore
git commit -m "Add Lighthouse CI config (non-blocking)"
```

---

## Task 11: CI GitHub Actions workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the workflow**

```yaml
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run build
      - run: node scripts/check-bundle-size.mjs
      - run: node scripts/check-internal-links.mjs

  lighthouse:
    runs-on: ubuntu-latest
    needs: verify
    continue-on-error: true
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npx lhci autorun
```

`verify` is the required status check referenced in `docs/WORKFLOW.md`'s branch-protection command. `lighthouse` is `continue-on-error: true`, matching the non-blocking decision.

- [ ] **Step 2: Validate YAML syntax**

Run: `node -e "const {readFileSync}=require('fs'); const c=readFileSync('.github/workflows/ci.yml','utf8'); if(!c.includes('jobs:')||!c.includes('verify:')) process.exit(1); console.log('ok')"`
Expected: `ok`

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "Add CI workflow (lint, typecheck, build, bundle-size, link-check, Lighthouse)"
```

---

## Task 12: `issue-refiner` and `work-issue` skills

**Files:**
- Create: `.claude/skills/issue-refiner/SKILL.md`
- Create: `.claude/skills/work-issue/SKILL.md`

- [ ] **Step 1: Create `issue-refiner`**

```markdown
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
```

- [ ] **Step 2: Create `work-issue`**

```markdown
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
```

- [ ] **Step 3: Verify frontmatter is well-formed**

Run: `node -e "for (const f of ['.claude/skills/issue-refiner/SKILL.md','.claude/skills/work-issue/SKILL.md']) { const c=require('fs').readFileSync(f,'utf8'); if(!c.startsWith('---\nname:')) throw new Error(f+' bad frontmatter') } console.log('ok')"`
Expected: `ok`

- [ ] **Step 4: Commit**

```bash
git add .claude/skills/issue-refiner/SKILL.md .claude/skills/work-issue/SKILL.md
git commit -m "Add issue-refiner and work-issue skills"
```

---

## Task 13: `content-reviewer` subagent

**Files:**
- Create: `.claude/agents/content-reviewer.md`

- [ ] **Step 1: Create the agent**

```markdown
---
name: content-reviewer
description: Reviews portfolio copy for tone (professional, direct, lightweight — no filler, no generic corporate-speak) before it's finalized. Invoked by content-authoring skills (add-project, add-experience, sync-resume) or manually.
tools: Read, Grep, Glob
---

You review copy for akshaymalhotra.dev, a personal portfolio site. The tone brief, non-negotiable:

- **Professional**: no slang, no gimmicks, reads like it was written by a senior engineer, not a marketing team.
- **Direct**: no filler, no throat-clearing ("I am passionate about..."), no generic corporate-speak ("leveraged synergies").
- **Lightweight**: short sentences, concrete nouns and verbs, specifics over adjectives ("cut p99 latency 40%" beats "significantly improved performance").

Given a piece of copy (a project entry, an experience entry, About page text), check it against these three properties and report:

1. **Violations found**, quoted directly with the specific phrase, and a suggested rewrite for each.
2. **A pass/fail-style verdict** per property (professional / direct / lightweight), not just an overall grade.

Do not rewrite the copy yourself unless asked — report findings back to the calling skill or user, who decides whether to apply them.
```

- [ ] **Step 2: Commit**

```bash
git add .claude/agents/content-reviewer.md
git commit -m "Add content-reviewer subagent"
```

---

## Task 14: Content-authoring skills (`add-project`, `add-experience`, `sync-resume`)

**Files:**
- Create: `.claude/skills/add-project/SKILL.md`
- Create: `.claude/skills/add-experience/SKILL.md`
- Create: `.claude/skills/sync-resume/SKILL.md`

- [ ] **Step 1: Create `add-project`**

```markdown
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
```

- [ ] **Step 2: Create `add-experience`**

```markdown
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
```

- [ ] **Step 3: Create `sync-resume`**

```markdown
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
```

- [ ] **Step 4: Verify frontmatter is well-formed**

Run: `node -e "for (const f of ['.claude/skills/add-project/SKILL.md','.claude/skills/add-experience/SKILL.md','.claude/skills/sync-resume/SKILL.md']) { const c=require('fs').readFileSync(f,'utf8'); if(!c.startsWith('---\nname:')) throw new Error(f+' bad frontmatter') } console.log('ok')"`
Expected: `ok`

- [ ] **Step 5: Commit**

```bash
git add .claude/skills/add-project/SKILL.md .claude/skills/add-experience/SKILL.md .claude/skills/sync-resume/SKILL.md
git commit -m "Add add-project, add-experience, and sync-resume content skills"
```

---

## Task 15: Final verification pass

**Files:** none (verification only)

- [ ] **Step 1: Run the full local gate**

```bash
npm run lint
npm run typecheck
npm run build
node scripts/check-bundle-size.mjs
node scripts/check-internal-links.mjs
```

Expected: all exit 0.

- [ ] **Step 2: Confirm all planned files exist**

```bash
git ls-files CLAUDE.md docs/WORKFLOW.md docs/superpowers/specs docs/superpowers/plans \
  .github/ISSUE_TEMPLATE/task.yml .github/PULL_REQUEST_TEMPLATE.md .github/workflows/ci.yml \
  scripts/setup-labels.sh scripts/git-hooks/pre-commit scripts/check-bundle-size.mjs scripts/check-internal-links.mjs \
  bundle-budget.json .lighthouserc.json \
  content/projects.ts content/experience.ts \
  .claude/skills/issue-refiner/SKILL.md .claude/skills/work-issue/SKILL.md \
  .claude/skills/add-project/SKILL.md .claude/skills/add-experience/SKILL.md .claude/skills/sync-resume/SKILL.md \
  .claude/agents/content-reviewer.md
```

Expected: every path listed back (nothing missing).

- [ ] **Step 3: Report to the user**

Summarize: harness foundation complete; remaining manual steps before it's fully live are `gh auth login`, `bash scripts/setup-labels.sh`, and enabling branch protection (all documented in `docs/WORKFLOW.md`). Nothing to commit in this task — verification only.
