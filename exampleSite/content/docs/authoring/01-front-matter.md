+++
title       = "Front matter"
description = "Every front-matter key the theme reads, with examples and defaults."
weight      = 10
+++

{{< lead >}}
The theme respects all of Hugo's standard front-matter keys plus a handful of theme-specific ones. Here's the complete list.
{{< /lead >}}

## Standard Hugo keys

```yaml
+++
title       = "Your First Search"          # rendered as the H1
linkTitle   = "Your First Search"          # used in sidebar and pager (default: title)
description = "Ingest sample data..."      # rendered under the H1 as the lead paragraph
date        = "2026-01-15"                 # publication date
weight      = 30                           # controls order in lists and pager
draft       = false                        # exclude from production builds
tags        = ["spl", "search"]            # added to /tags/ taxonomy
layout      = "chapter"                    # use a non-default layout
+++
```

`weight` is the most important — it controls **everything** about ordering: the sidebar, the pager, card grids, the children listing. Use multiples of 10 (10, 20, 30, …) so you can insert pages later without renumbering.

## Theme-specific keys

```yaml
+++
duration    = "20 min"           # shown in workshop-meta + cards
difficulty  = "beginner"         # shown in workshop-meta + cards
time        = "20 min"           # alias of duration
author      = "Your Name"        # shown in workshop-meta
hidden      = false              # exclude from sidebar, TOC, search, prev/next
nopager     = false              # render the page but suppress prev/next
subtitle    = "Chapter · Foo"    # eyebrow text on chapter pages
tagline     = "01 · Foundation"  # extra text in the chapter sidebar
+++
```

### `duration` / `time`

Free-form text shown in the workshop meta row at the top of the page and in workshop cards. Conventionally something like `"20 min"` or `"1 hour"`.

### `difficulty`

Free-form text. Common values: `beginner`, `intermediate`, `advanced`. Renders in workshop meta and cards. Pair with the `difficulty` shortcode if you want a numeric 1–5 dot indicator.

### `hidden`

When `true`:
- Page is excluded from sidebar listings
- Page is excluded from the prev/next pager
- Page is excluded from search index
- Page is excluded from `children` shortcodes and card grids on parent sections
- Page **still renders** at its URL (people who have the link can read it)

Use `hidden: true` for draft pages, internal references, or "Easter egg" content you want accessible but not advertised.

### `nopager`

When `true`, suppresses the prev/next pager on this specific page. Useful for:
- Index/landing pages where prev/next is meaningless
- Q&A or FAQ pages where the linear flow doesn't apply
- Special pages (404, search results, glossary)

The page still appears in the sidebar and search; only the pager block is hidden.

## Home page hero

The hero block on the site root (rendered from `content/_index.md`) is fully driven by front matter — no template editing required:

```toml
+++
title       = "Learn by *building*."
eyebrow     = "Workshops · Hands-on, opinionated"
description = "..."

[[cta]]
label = "Browse workshops"
href  = "/workshops/"
style = "primary"

[[cta]]
label = "View on GitHub"
href  = "https://github.com/you/your-repo"
style = "ghost"
+++
```

- **`title`** is markdownified — wrap a word in `*asterisks*` to render it as `<em>` (the brand-gradient italic).
- **`eyebrow`** is the kicker line above the title. Falls back to `params.brandTagline` if unset.
- **`description`** is the lead paragraph. Falls back to `params.description` if unset.
- **`cta`** is a list of buttons. `style` is `primary` (filled, with arrow) or `ghost` (outline). Internal hrefs like `/workshops/` are auto-prefixed for project-pages baseURLs; external (`http*`) hrefs get `target="_blank"` automatically.
- Any markdown body below the front matter renders below the hero.

## Workshop meta row

The block at the top of a workshop page showing duration, difficulty, author, and tags is composed from these front-matter keys. If you don't set any, the row is suppressed.

```yaml
+++
title       = "Your First Search"
description = "Ingest sample data..."
duration    = "20 min"
difficulty  = "beginner"
author      = "Pieter Hagen"
tags        = ["spl", "search"]
+++
```

Renders the meta row with a clock icon (duration), a chart icon (difficulty), a user icon (author), and a series of tag pills.

## Defaults set via cascade

Hugo's [cascade](https://gohugo.io/content-management/front-matter/#cascade) lets a section set front-matter defaults for all its descendants. Useful for inheriting `author` or `difficulty`:

```yaml
# content/workshops/getting-started/_index.md
+++
title  = "Getting Started"
weight = 1
[cascade]
  author     = "Splunk Workshop Team"
  difficulty = "beginner"
+++
```

Now every page under `getting-started/` inherits `author` and `difficulty` unless it overrides them.

{{< notice tip "Cascade is fantastic for big workshops" >}}
Set the workshop's `author` and `difficulty` once in the chapter `_index.md` via cascade. New lessons inherit it automatically — fewer keys to manage per file.
{{< /notice >}}
