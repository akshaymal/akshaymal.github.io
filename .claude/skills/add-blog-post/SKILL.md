---
name: add-blog-post
description: Scaffold a new entry in content/posts/ (title, date, summary, slug) and co-draft the post body via doc-coauthoring using a category-specific structure. Use when asked to add, draft, or write a new blog post.
---

# Add Blog Post

Blog posts are long-form prose, not a handful of structured fields — this skill leans on `doc-coauthoring` for the body instead of asking for it up front like `add-project`/`add-experience` do.

## 1. Gather metadata and intent

Ask the user for:

- **Title**
- **Date** (default: today)
- **One-line summary**
- **Category** — one of:
  - `technical` — explaining how something works or was built
  - `hobby-experience` — a personal experience/story (not necessarily technical)
  - `general` — anything that doesn't fit the above
- **Supporting inputs**, all optional, any combination:
  - Pasted notes/bullets
  - Local file paths (docs, specs, diffs, PRs already in the repo)
  - A reference URL to fetch and read

Read/fetch every supporting input before drafting starts. These ground the post's content — they are not a substitute for co-drafting.

**Before moving on, pin down the one-sentence thesis.** Ask the user to state, in one sentence, what this post is actually arguing or showing — not its topic, its point (e.g. not "a post about my marathon," but "training for time instead of distance is what finally got me under 4 hours"). If they can't yet, that's the first thing to work out together, before drafting — a post without a one-sentence answer to "what's this actually about" tends to wander, and it's much cheaper to fix that now than after a full draft.

## 2. Voice sample (once, then reused)

Check whether `docs/voice-sample.md` exists.

- **If missing:** ask the user for a sample of their own writing (a past post, an email, notes — anything in their own voice). This file is committed to a public repo, so before saving it, redact anything identifying — addresses, unit/order/tracking numbers, phone numbers, other people's names — replacing each with a bracketed placeholder (`[unit]`, `[order number]`) that preserves the *shape* of the specificity without the real value. Confirm the redacted version with the user, then save it to `docs/voice-sample.md`. Explain that this is saved once and reused by this skill and by `content-reviewer` on every future post, so they won't be asked again.
- **If present:** read it silently and use it to calibrate tone during drafting. Don't re-ask.

## 3. Slug

Derive a kebab-case slug from the title and check it against existing files in `content/posts/`. If it collides, don't silently disambiguate — tell the user the slug is taken and ask them to either adjust the title (and re-derive) or confirm a specific alternate slug.

## 4. Co-draft the body via `doc-coauthoring`

Invoke `doc-coauthoring` to draft the post **one beat at a time**, pausing after each beat for the user's edits/voice before moving to the next. Never draft the full body solo and present it as a finished draft — every beat gets real back-and-forth before the next one starts.

The beats are an invisible drafting scaffold: they shape drafting order and content, but the published post reads as flowing prose with its own topic-specific H2s (not headings literally titled "Hook" etc.).

Pick the scaffold from the category chosen in step 1:

| Category | Beats |
|---|---|
| `technical` | **Context** (what prompted this, background) → **Mechanism** (how it actually works, told with concrete specifics) → **Implications** (what it means more broadly) |
| `hobby-experience` | **Hook** (the specific moment that prompted this post) → **Story** (what happened, told as narrative) → **Reflection** (what it changed for you, what you'd tell someone else) |
| `general` | **Hook** (the specific moment/observation/problem) → **The Thing** (the substantive middle — argument, detail, whatever the post is actually about) → **So What** (the takeaway) |

Ground each beat in the supporting inputs and voice sample gathered in steps 1–2. Match the user's real voice, not a generic explanatory tone — no hedging, no listicle-itis, no "in today's world"-style filler transitions.

**Open with a hook, not a topic statement.** The opening beat (Hook/Context) should do one of two things: **scene-first** — a concrete moment or outcome stated plainly, then complicated in the next sentence (e.g. a clean result, immediately undercut by what it missed) — or **frustration-first** — name the reader's exact gap or question directly, in one sentence, before anything else. Either works; a generic topic sentence ("This post is about...") never does.

**Pick one concrete example and extend it, don't replace it.** Ground the whole post in a single running case (an anecdote, a specific project, one conversation) and revisit it across beats instead of introducing a fresh example per beat — extend it sideways with "say X instead" counterfactuals when a beat needs more depth. For a technical beat explaining how something works, walk that same one example through every step of the mechanism, in order, rather than describing the mechanism in the abstract.

**Craft habits to apply while drafting every beat** (standard, tested habits from journalism/editorial writing — not novel, but easy to drop under time pressure):

- **Go deep, not wide.** Each beat should carry more than one concrete example or reasoning step before landing its point — a single anecdote per beat reads thin. When a beat feels short, the fix is more texture within it (another example, the actual reasoning instead of just the conclusion, a specific counterpoint considered and dismissed) — not padding, and not adding a fourth beat. Depth per beat, not length for its own sake.
- **Front-load.** Put the most important point in the first paragraph, even in the Hook. Don't make the reader wait for the payoff — the inverted pyramid, not a slow build.
- **Show, don't tell.** Lead with the concrete moment/example/number before the abstraction it supports. "CI caught a 0.554 CLS regression" beats "performance was a problem" — specifics are what make a post sound like it happened to someone, not like a summary.
- **Name the anti-pattern before correcting it.** When a beat argues against a common wrong conclusion, state that wrong conclusion first, by name, before giving the right one — a labeled misconception is more memorable than a bare assertion of the correct answer.
- **State an absence, then confirm it.** When the point is that something is missing (a step, a safeguard, a decision), invite the reader to look for it before saying it isn't there — a stronger beat than just asserting the gap upfront.
- **One post, one thesis.** If a tangent doesn't serve the one-sentence thesis from step 1, cut it or split it into its own post. Don't let scope creep in mid-draft.
- **Active voice, short sentences.** Default to active voice and vary sentence length; a string of same-length sentences reads flat and is a common AI tell.
- **Earn transitions.** Move between beats with a specific connective ("that fix exposed a second bug" — not "moving on to..." or "with that said...").
- **Headings are theses, not topics.** Any H2 introduced while assembling beats into prose should state the section's argument ("A summary is a claim, not evidence") rather than label its subject ("Metrics" or "Evaluation").

## 5. Write the file

Create `content/posts/<slug>.mdx` with frontmatter matching the shape `lib/posts.ts` validates:

```yaml
---
title: "<title>"
date: "<YYYY-MM-DD>"
summary: "<one-line summary>"
---
```

The `date` **must** be a quoted string — an unquoted date is parsed by YAML as a `Date` object, not a string, and fails `lib/posts.ts`'s runtime validation.

## 6. Tighten before review

Once all beats are drafted and assembled, do one self-edit pass over the whole post before handing it to `content-reviewer` — this is where bloat that's invisible beat-by-beat gets caught:

- **Cut, don't pad.** Reread for sentences/clauses that repeat a point already made, or that hedge instead of asserting ("might potentially," "in some ways") — cut them. Aim to tighten by ~10–20% from the co-drafted length, not to hit a word count.
- **Read the whole thing as continuous prose**, not beat-by-beat — check the piece flows as one argument, not three assembled sections.
- **Kill any leftover scaffold language** — if a beat name or its framing ("Now for the mechanism...") leaked into the actual prose, cut it. The scaffold is invisible to the reader.

Surface the tightened draft to the user for a look before moving to formal review.

## 7. Tone and voice review

Run the `content-reviewer` subagent against the drafted body, passing `docs/voice-sample.md` alongside it so the review checks both the standard tone brief (professional, direct, lightweight) and fit against the user's actual voice sample — not just generic AI-writing tells.

## 8. Build check

Run `npm run build` to confirm the new post compiles and is picked up by `getAllPosts()`/`generateStaticParams`. MDX isn't typechecked, so this is the equivalent of the typecheck step in `add-project`/`add-experience`.

## 9. Final sign-off

Report the finished post back to the user for a final look before committing.
