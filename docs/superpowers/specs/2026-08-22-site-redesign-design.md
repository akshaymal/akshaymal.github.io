# Spec 2: Site Redesign

Status: Approved
Date: 2026-08-22
Author: Akshay Malhotra (with Claude)

## Context

Spec 1 (harness foundation) is merged. This spec covers the actual portfolio redesign: visual identity, information architecture, page structure, and content sourcing — everything Spec 1 deliberately excluded. Goal remains a fast (one-to-two-weekend), professional, direct, lightweight v1, targeting recruiters and industry peers with a personality layer (motorsports) that differentiates without undermining the professional read.

## Visual identity — Direction D ("Warm Precision")

Chosen after comparing three initial directions (dark/technical, warm/editorial, clean monochrome) and a hybrid. Warmth drives trustworthiness (color temperature + serif-for-authority perception); a single bold, confidently-applied accent drives memorability — these two goals aren't in tension once the accent is applied as scale/confidence rather than relying on a dark background for distinctiveness.

**Palette (light):**
- Base: `#faf7f2` (warm off-white)
- Text (ink): `#1f1b16`
- Accent (ember): `#c4501c`
- Muted text: `#5c5148`

**Palette (dark):** structural inverse — charcoal base, off-white text, same `#c4501c` accent (kept identical across themes so the accent remains the brand-recognition anchor). Toggle control, system-preference default.

**Typography:** Serif display (**Source Serif 4**, via next/font Google Fonts) for headlines — modern and readable rather than stuffy, carries the credibility signal. Sans (**Inter**) for body copy and UI chrome (nav, buttons, labels) — the current standard, pairs cleanly against the serif.

**Accent usage:** confident blocks (buttons, section dividers, sidebar strips) rather than thin decorative lines — the accent is the memorability lever, so it needs visual weight to do that job.

**Logo/mark:** wordmark-only for v1 ("Akshay Malhotra" in the serif display face). A designed mark is tracked as [#4](https://github.com/akshaymal/akshaymalhotra.dev/issues/4), deliberately deferred.

## Navigation

Config-driven top nav — a plain data array (`{label, href}[]`), not hardcoded JSX — rendered as a horizontal nav bar. Four items:

| Label | Route |
|---|---|
| Home | `/` |
| Experience | `/experience` |
| Projects | `/projects` |
| Beyond Work | `/beyond-work` |

No overflow/"More" menu needed at 4 items; the config-driven structure means adding a 5th (e.g. when Blog ships, per [#6](https://github.com/akshaymal/akshaymalhotra.dev/issues/6)) is a one-line addition to the array. An overflow pattern is only worth building once the list actually approaches 6+ items — YAGNI for v1.

No "Contact" nav item or route. Social/contact links live behind a Contact button in the header instead (see below) — a single-item Contact page would just duplicate what's already one click away. (This started as a persistent footer, moved to a floating pill per [#27](https://github.com/akshaymal/akshaymalhotra.dev/issues/27), then into the header's collapsible Contact dropdown per [#38](https://github.com/akshaymal/akshaymalhotra.dev/issues/38).)

## Pages

### `/` — Home (About combined)
No separate `/about` route — the homepage carries the positioning line and short bio directly. One less click, matches the "direct" brief. Content: a sharp one-line positioning statement (not a generic "Software Engineer" title — see the seniority-signal advice below), a short bio paragraph, a way into Experience/Projects.

### `/experience`
Renders `content/experience.ts` entries (schema already exists from Spec 1). Sourced from the resume now in hand:

1. **Ernst & Young** — Senior, Technology Consulting (Oct 2023–Present)
2. **ZS Associates Inc.** — Software Engineer / Software Engineer Intern (Jun 2022–Sept 2023)
3. **InfoEdge India Limited** — Senior Software Engineer (Jan 2018–Jun 2021)

Bullets get rewritten through the "impact over duties" lens per the tone brief — the resume's own bullets are already impact-framed with real numbers (95% processing time reduction, 22% fewer outages, 3x response time improvement, etc.), so this is mostly a direct port with tone-brief polish via `add-experience` + `content-reviewer`, not a from-scratch rewrite.

### `/projects`
Renders `content/projects.ts` entries (schema already exists). **Open content question**: the resume's "Academic Projects" section (2 coursework projects) doesn't give strong flagship-project material. Real candidates likely live inside Experience bullets instead — e.g. the Kafka partitioning work, the multi-microservice resiliency mechanisms, the SSL connectivity utility — each of which has a real problem/role/decision/outcome shape. Deciding which 2-4 to feature (mined from experience, or separate side projects) is a content-phase task via `add-project`, not a design-phase blocker.

### `/beyond-work`
Consolidates the five existing hobby pages (motorsports, karting, sim-racing, travel, race-marshal) into sections on one page, rather than five thin routes — matches the "fun without undermining professional" brief from the original brainstorm: personality lives in voice/content, not in fragmenting the IA.

### Contact (all pages)
GitHub, LinkedIn, Instagram, email — originally a persistent footer, now a Contact button in the header (`components/contact-dropdown.tsx`) that opens a panel with the same links; see [#38](https://github.com/akshaymal/akshaymalhotra.dev/issues/38).

## SEO & analytics

Carried over from earlier brainstorming (Spec 1 discussion, applies here since it's content/page-level, not harness-level):
- Per-page metadata (title, description, OG image)
- `sitemap.xml`
- JSON-LD `Person` schema on the homepage
- Vercel Analytics

Baked in during initial build, not bolted on after — matches the stated discoverability goal.

## Component architecture

- `components/nav.tsx` — replaces `components/app-sidebar.tsx`; renders the config-driven top nav array, plus the header's Contact button and theme toggle
- `components/contact-dropdown.tsx` — the header Contact button's dropdown panel (social/contact links)
- `components/theme-toggle.tsx` — new, dark/light toggle (system-preference default)
- `app/page.tsx` — rewritten as Home/About
- `app/experience/page.tsx` — rewritten to render `content/experience.ts`
- `app/projects/page.tsx` — rewritten to render `content/projects.ts`
- `app/beyond-work/page.tsx` — new, replaces the five `app/hobbies/*/page.tsx` routes
- `app/hobbies/*` — removed (content migrates into `beyond-work`)
- `app/globals.css` / `tailwind.config.ts` — updated with the Direction D palette (light + dark) and font tokens

Existing shadcn/ui primitives (`button`, `separator`, `tooltip`, etc.) are kept where they fit; `sidebar.tsx` and `collapsible.tsx` become unused once the sidebar nav is replaced and can be removed as part of implementation (dead-code cleanup, not scope creep — they exist only to support the nav pattern being replaced).

## Content dependency status

A resume is now in hand (provided 2026-08-22) — **but the user has flagged it as an older version that will be updated**. Treat it as sufficient to unblock implementation (populate `/experience` with real, real-shaped content instead of placeholders) but not as final: once the updated resume arrives, run the `sync-resume` skill (built in Spec 1 for exactly this) to reconcile `content/experience.ts` against it rather than assuming the current entries are locked. Contains: 3 roles, MS in CS (ASU, 4.0 GPA), AWS Certified Developer – Associate, impact-framed bullets with real metrics. `/projects` needs one more content-phase decision (which 2-4 achievements become flagship project entries) before `add-project` can run — this decision should be revisited too if the updated resume changes the picture.

## Non-goals (this spec)

Blog, real contact form, designed logo/mark — all explicitly deferred, tracked as issues [#4](https://github.com/akshaymal/akshaymalhotra.dev/issues/4), [#5](https://github.com/akshaymal/akshaymalhotra.dev/issues/5), [#6](https://github.com/akshaymal/akshaymalhotra.dev/issues/6).
