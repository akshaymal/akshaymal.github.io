# Spec 3: Backend Integration

Status: Draft — not ready to implement
Date: 2026-08-25
Author: Akshay Malhotra (with Claude)

## Context

Today, per Spec 2, site content lives in the repo itself — `content/projects.ts`, `content/experience.ts`, `content/posts/*.mdx` — bundled at build time into a static export (`output: 'export'`, `next.config.js`) and deployed to Vercel with no server at runtime. Updating content means editing a file, running a content skill (`add-project`, `add-experience`), opening a PR, waiting on CI, and merging — the same path as a code change, even though it's just content.

This spec explores moving content off the repo onto a real backend instead, hosted on Azure — decoupling content updates from code deploys, and deliberately chosen as an opportunity to learn Azure rather than because AWS (the provider Akshay is already certified in) couldn't do the job.

**This spec is not being implemented anytime soon.** It's a forward-looking design exploration, drafted now so the direction is on record, not a plan queued for work. Status stays "Draft" until Akshay says otherwise.

## Relationship to current work (Spec 2)

Every issue open right now — [#5](https://github.com/akshaymal/akshaymalhotra.dev/issues/5), [#6](https://github.com/akshaymal/akshaymalhotra.dev/issues/6) (and its sub-issues #47/#48), [#50](https://github.com/akshaymal/akshaymalhotra.dev/issues/50), [#51](https://github.com/akshaymal/akshaymalhotra.dev/issues/51), [#52](https://github.com/akshaymal/akshaymalhotra.dev/issues/52), [#53](https://github.com/akshaymal/akshaymalhotra.dev/issues/53), [#54](https://github.com/akshaymal/akshaymalhotra.dev/issues/54), [#55](https://github.com/akshaymal/akshaymalhotra.dev/issues/55), [#56](https://github.com/akshaymal/akshaymalhotra.dev/issues/56) — is scoped to Spec 2's architecture: content in the repo, static export, Vercel. None of it is blocked by, waiting on, or needs to anticipate this spec. Beyond Work (#53) and the home page (#54) can land their own `content/*.ts` shapes now; if this spec is ever implemented, migrating those into the backend happens then, not before.

When (if) this spec is ready to move forward, it gets broken into real GitHub issues through the normal `issue-refiner` path at that point, same as any other work. Until then, per `docs/WORKFLOW.md`'s "Spec-scoped work (not yet an issue)" section, any new idea that touches this direction gets logged in this doc's [Open questions / future work](#open-questions--future-work) section — not filed as a GitHub issue.

## Architecture shift

**Current (Spec 2):** `content/*.ts` and `content/posts/*.mdx` live in the repo, resolved at build time, baked into a static export with zero server at runtime.

**Future (Spec 3):**
- **Content scope:** everything migrates — `content/projects.ts`, `content/experience.ts`, `content/beyond-work.ts` (or whatever shape #53 lands on), and blog posts (`content/posts/*.mdx`). One unified content source on the backend, not a split between "structured content on Azure, posts still in git."
- **App hosting:** the Next.js app stays on Vercel. Azure hosts only the new content backend (a database and an API layer in front of it — specific services not decided here, see open questions). Vercel's deploy story doesn't change; it just gains a new external dependency to read from.
- **Deployment model:** moves from static export to server-rendered. The app reads content from the Azure backend at request time instead of bundling it at build time. Real consequence, not solved here: several pieces of the current CI/tooling setup assume a static `out/` directory exists — the Playwright viewport-overflow suite, Lighthouse's per-route URL derivation, `check-bundle-size.mjs`, and `check-internal-links.mjs` all currently work against that static output. Each of these needs rework once this actually gets implemented.

## Content update workflow

The existing content skills — `add-project`, `add-experience`, and `add-blog-post` (once [#50](https://github.com/akshaymal/akshaymalhotra.dev/issues/50) lands) — keep their current shape: walk through the fields, run `content-reviewer` for tone, confirm with Akshay before finalizing. Only the last step changes — instead of writing a local file and committing it to git, the skill calls the backend's write API directly.

**Trade-off, not resolved here:** today, every content change is a git commit — free audit trail, free rollback. Writing directly to a backend API loses that unless the backend implements its own version history. Logged as an open question below rather than decided now.

A dedicated content admin UI was considered and rejected (see Non-goals) — it's new product surface to design, build, and secure, for no real gain over the skills' existing authoring flow.

## Credential management & security

Two credential surfaces, kept deliberately separate (least privilege — neither path should be able to do what the other does):

1. **Read path.** Vercel's Next.js server calls the Azure backend at request time to render pages. Needs a read-only, content-scoped credential, stored as an encrypted Vercel environment variable — never committed to the repo.
2. **Write path.** The content-authoring skills, run locally by Akshay, need a write-scoped credential to call the backend's write API. This is a *different* credential from the read path — used only locally when a skill runs, never deployed with the app, never committed (a gitignored local secret).

Both credentials should be scoped as narrowly as Azure's access model allows — a scoped API key/token or Managed Identity limited to the content service specifically, not a subscription-level or resource-group-level admin credential. The backend surface itself also needs its own access control so it isn't reachable by anyone who merely has its URL — the concrete mechanism (network rules, auth on the API layer, etc.) is implementation-phase, not decided here.

Exact secret-storage and rotation mechanics (plain Vercel env vars vs. Azure Key Vault vs. something else) are also implementation-phase — see open questions.

## Open questions / future work

Per `docs/WORKFLOW.md`'s "Spec-scoped work" rule, new ideas relating to this direction land here, not as GitHub issues, until this spec is ready to move to implementation.

- Which specific Azure service(s) actually host the content (Cosmos DB / Azure SQL / Table Storage / Blob Storage, etc.), and what API layer sits in front of them (Azure Functions / App Service / API Management)?
- Content versioning/audit trail: does the backend need its own history mechanism to replace what git commits give today for content edits, or is losing that an acceptable trade-off?
- Exact secret-storage and rotation mechanism for both the read and write credentials.
- Backend access-control mechanism (network rules, API auth scheme, etc.).
- Migration path: how do the current `content/*.ts` entries and existing blog posts actually get moved onto the backend the first time — a one-time script, or manual re-entry?
- Cost: Azure hosting isn't free for a personal portfolio — what's an acceptable monthly budget?
- CI/tooling rework: viewport tests, Lighthouse's URL derivation, the bundle-size check, and the internal-link check all currently assume a static `out/` directory — how does each adapt once the app is server-rendered?
- Whether/how the `sync-resume` skill's role changes once experience content lives on the backend instead of a local file.

## Non-goals (this spec)

- No implementation timeline. This spec is deliberately deferred — nothing here is scheduled or queued.
- Doesn't pick specific Azure services or the exact API shape — that's implementation-phase, once this spec is approved and ready to move forward (see Open questions).
- Doesn't change how any currently open, Spec-2-scoped issue gets worked (see Relationship to current work).
- Doesn't build a dedicated content admin UI — rejected in favor of repointing the existing content skills at a backend API.
