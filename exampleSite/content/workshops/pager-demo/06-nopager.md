+++
title       = "06 · nopager (this page)"
linkTitle   = "06 · nopager"
description = "Set `nopager = true` in front matter to take a page out of the prev/next pager chain entirely."
weight      = 60
nopager     = true
+++

{{< lead >}}
You're reading this page because you navigated here from the **sidebar** (or directly via URL). There's no prev/next pager at the bottom — `nopager: true` in the front matter suppresses it on this page, and neighbouring pages skip over this one when they compute their own prev/next.
{{< /lead >}}

## The front matter

```toml
+++
title   = "06 · nopager (this page)"
weight  = 60
nopager = true
+++
```

That single line is the whole opt-out.

## What it does

`nopager: true` triggers two things in the navigation layer:

1. **This page renders no pager.** Scroll to the bottom — there's no row of prev/next buttons. The pager partial returns early when it sees the flag on the current page.
2. **Neighbouring pages skip over this page in their own pager chain.** Open [05 · Override both](../05-override-both/) — its "next" doesn't point to *this* page; it goes to whatever comes after.

The page is otherwise normal — it still appears in the left sidebar, in search results, and at its own URL. Only the linear pager chain treats it as invisible.

## When to use it

Reach for `nopager: true` when a page is a destination rather than a waypoint:

- **Exercises launched from a parent lesson.** The parent lesson links to the exercise ("now try it →"), the reader completes the exercise, and returns to the lesson. A "next →" button on the exercise to some unrelated next-lesson would feel like the lesson never ended.
- **Glossaries, references, and FAQs.** Readers land on these via search or a direct link, not by stepping forward through chapters.
- **Branching pages where the next step is context-dependent.** If the right "next" depends on what the reader is trying to do, an automatic "next" is wrong by definition. Suppress it and let the body content link to the right place.

If the page IS part of a linear sequence — even if it's a hands-on exercise inside a sequence — leave `nopager` off. The default (sequential prev/next) is the right answer for most workshop content.

## What it does NOT do

- Doesn't hide the page from the sidebar (that's `hidden: true`).
- Doesn't remove it from the search index (also `hidden: true`).
- Doesn't break direct links — the page renders at its URL like any other.
- Doesn't affect the pager-override shortcode — a `{{</* pager next="…" */>}}` on a different page can still target this one explicitly.
