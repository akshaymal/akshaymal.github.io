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

## 2. Voice sample (once, then reused)

Check whether `docs/voice-sample.md` exists.

- **If missing:** ask the user for a sample of their own writing (a past post, an email, notes — anything in their own voice). Save it verbatim to `docs/voice-sample.md`. Explain that this is saved once and reused by this skill and by `content-reviewer` on every future post, so they won't be asked again.
- **If present:** read it silently and use it to calibrate tone during drafting. Don't re-ask.

## 3. Slug

Derive a kebab-case slug from the title and confirm it's unique against existing files in `content/posts/`.

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

## 6. Tone and voice review

Run the `content-reviewer` subagent against the drafted body, passing `docs/voice-sample.md` alongside it so the review checks both the standard tone brief (professional, direct, lightweight) and fit against the user's actual voice sample — not just generic AI-writing tells.

## 7. Build check

Run `npm run build` to confirm the new post compiles and is picked up by `getAllPosts()`/`generateStaticParams`. MDX isn't typechecked, so this is the equivalent of the typecheck step in `add-project`/`add-experience`.

## 8. Final sign-off

Report the finished post back to the user for a final look before committing.
