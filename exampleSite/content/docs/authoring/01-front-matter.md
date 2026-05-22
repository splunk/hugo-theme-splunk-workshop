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
time        = "20 min"               # shown in workshop-meta + cards
duration    = "20 min"               # alias of time (legacy)
difficulty  = "beginner"             # shown in workshop-meta + cards
authors     = ["Pieter Hagen",
               "Robert Castley"]     # shown in workshop-meta (plural array, preferred)
author      = "Pieter Hagen"         # alias of authors[0] (legacy singular)
lastmod     = "2026-04-28"           # optional override; otherwise from git
hidden      = false                  # exclude from sidebar, TOC, search, prev/next
nopager     = false                  # render the page but suppress prev/next
showToc     = true                   # override site-wide `showToc` per page
noautocards = false                  # section-only: suppress the auto-card-grid fallback
subsections = false                  # section-only: list sub-sections instead of pages
categories  = ["foundations"]        # bucket assignment for cards-by-category (page-level)
subtitle    = "Chapter · Foo"        # eyebrow text on chapter pages
tagline     = "01 · Foundation"      # extra text in the chapter sidebar
+++
```

### `time` / `duration`

Free-form text shown in the workshop meta row at the top of the page and in workshop cards. Conventionally something like `"20 min"` or `"1 hour"`. `time` is the preferred (relearn-compatible) key; `duration` works as a fallback so legacy front matter keeps rendering.

If neither key is set, the theme falls back to Hugo's built-in `.ReadingTime`, computed as `.WordCount ÷ 213` (Hugo's default words-per-minute) rounded down. Authors who set `time` or `duration` always win — the fallback only fires when both are absent.

Caveats of the auto-estimate:

- Code blocks count words at reading speed, but readers parse code more slowly. Pages with substantial command listings under-estimate.
- Terminal output counts as words but is usually skimmed. Same direction of error.
- Very short pages can round to `0 min` — Hugo doesn't apply a floor. Set `time` explicitly for short reference pages where `0 min` would look odd.

Set `time` deliberately for any page where the auto-estimate would mislead. The fallback is a sensible default for prose-heavy lessons, not a substitute for human judgement.

### `authors` / `author`

`authors` is a list, rendered as `Name1 & Name2 & …` next to a user icon in the workshop meta row. `author` (singular string) is honoured when only one name is set or when migrating legacy content. Use `authors` for new content.

```yaml
authors: ["Robert Castley", "Pieter Hagen"]
```

### `lastmod`

Optional explicit override for the page's last-modified date, shown in the small chip above the pager. When omitted, the theme reads the date from the most recent git commit that touched the page (requires `enableGitInfo = true` in `hugo.toml`, which is the default).

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

### `showToc`

Per-page override of the site-wide `showToc` param. When `false`, the right-rail "On this page" TOC is hidden on this page and the content column expands into the freed space. When `true`, the TOC is shown even if disabled site-wide. When omitted, the site param wins.

Useful for dashboard pages, very wide diagrams, or landing-style indexes where the TOC adds little but takes width.

```yaml
+++
title   = "Dashboard"
showToc = false
+++
```

**Cascading to a whole section.** Plain `showToc = false` in a section's `_index.md` only affects that one index page — Hugo's `.Params` are per-page. To hide the TOC across a whole subtree, use Hugo's built-in `[cascade]` block:

```toml
# in some-section/_index.md
[cascade]
  showToc = false
```

Every descendant inherits unless it sets its own `showToc`. The same mechanism works for any other front-matter key.

### `noautocards`

Section-only flag (set on an `_index.md`, not on regular pages). When `true`, the section's auto-card-grid is suppressed even if the section has no body content. Use it for landings that should be just title + description with no listing:

```toml
# content/resources/_index.md
+++
title       = "Resources"
description = "Reference docs, community links, deeper reading."
noautocards = true
+++
```

By default, an `_index.md` with no body content falls back to an auto-grid of the section's children (or sub-sections, if `subsections = true`). That fallback is a navigational helper for empty section landings; on pages where the title + description are the entire intended payload, the cards are unwelcome.

The sidebar still lists the section's children, so navigation isn't lost — the flag only removes the in-content card grid.

Equivalent to adding any body content (any prose suppresses the auto-grid via the standard `{{ if .Content }}…{{ else }}auto-grid{{ end }}` pattern), but more explicit and doesn't require placeholder text.

### `subsections`

Section-only flag (set on an `_index.md`, not on regular pages). When `true` and the section has child sub-sections, the section's auto-card-grid lists those sub-sections instead of its regular pages. Use it on **hub-of-workshops landings** where each child is itself a section bundle:

```toml
# content/workshops/_index.md
+++
title       = "Workshops"
description = "Pick a workshop and dive in."
subsections = true                   # show one card per sub-workshop
+++
```

Without the flag (default `false`), the auto-grid lists the section's regular `.md` pages. The flag has no effect on sections that have no sub-sections, or on pages that author their own card grid with `{{</* cards */>}}` / `{{</* children type="card" */>}}` (the body wins).

### `categories`

Page-level array used by the `cards-by-category` shortcode to group children of a section into named buckets. Each value is a slug that matches a `params.categories[].slug` entry on the parent section's `_index.md`. Pages can belong to multiple buckets (they'll render once per bucket).

```toml
# content/ninja-workshops/12-pipeline-management/_index.md
+++
title      = "Pipeline Management"
categories = ["advanced", "instrumentation"]
+++
```

A page with no `categories` value drops into a final "Other" bucket — surfaces taxonomy gaps rather than hiding the page. See [Shortcodes › Categorized card grids](../../shortcodes/03-layout/#categorized-card-grids) for the parent-section `params.categories` setup and a full example.

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

## Markdown in titles

The `title` front-matter key is rendered through Hugo's `markdownify` on the three layouts that use a *display-sized* heading:

| Layout | Trigger | H1 class | Markdownified? |
| --- | --- | --- | --- |
| Home (`/`) | `content/_index.md` rendered by `index.html` | `.hero__title` | ✅ |
| Hub landing (e.g. `/splunk4rookies/`) | depth-1 section with sub-sections, rendered by `list.html` in hub-mode | `.hero__title` | ✅ |
| Chapter landing (`layout = "chapter"`) | rendered by `chapter.html` | `.chapter__title` | ✅ |
| Regular workshop page | rendered by `single.html` | (plain `h1`) | ❌ |
| Workshop section landing | rendered by `list.html` in workshop-mode | (plain `h1`) | ❌ |

So you can write:

```toml
+++
title = "Splunk4Rookies *Workshops*"
+++
```

…and the `*Workshops*` becomes `<em>Workshops</em>`, picking up the magenta→orange brand gradient defined in `components.css` for `.hero__title em` / `.chapter__title em`. The asterisks render as italic everywhere markdown does — but only the three layouts above also apply the brand gradient.

Plain `single.html` titles are left as literal text. The brand-gradient italic treatment is meant for *display* headings (landing pages); applying it to every workshop step's H1 would over-deploy the brand magenta. If you want italic emphasis in a regular page title, write it in markdown body content as `## **Heading**` or similar — the H1 stays clean.

### Card titles

Card titles ALSO markdownify — anywhere a page appears as a card (the home page's auto-grid, a hub landing's auto-grid, a chapter landing's card-fallback, the `cards` / `card` / `children type="card"` shortcodes), the title goes through `markdownify`. The same `*emphasis*` markdown works:

```toml
+++
title = "Splunk4Rookies *Workshops*"
+++
```

…and the card showing that page renders the `*Workshops*` as italic, regardless of which layout drew the card. The em styling on card titles doesn't pick up the brand gradient (cards use a tighter visual register than display heros), so italic emphasis there is plain `<em>` — useful for distinguishing a product name, a UI label, or a key noun without dominating the card.

## Workshop meta row

The block at the top of a workshop page showing time, difficulty, authors, and tags is composed from these front-matter keys. If you don't set any, the row is suppressed.

```yaml
+++
title       = "Your First Search"
description = "Ingest sample data..."
time        = "20 min"
difficulty  = "beginner"
authors     = ["Pieter Hagen", "Robert Castley"]
tags        = ["spl", "search"]
+++
```

Renders the meta row with a clock icon (time), a chart icon (difficulty), a user icon (authors), and a series of tag pills.

## Defaults set via cascade

Hugo's [cascade](https://gohugo.io/content-management/front-matter/#cascade) lets a section set front-matter defaults for all its descendants. Useful for inheriting `authors` or `difficulty`:

```yaml
# content/workshops/getting-started/_index.md
+++
title  = "Getting Started"
weight = 1
[cascade]
  authors    = ["Splunk Workshop Team"]
  difficulty = "beginner"
+++
```

Now every page under `getting-started/` inherits `authors` and `difficulty` unless it overrides them.

{{< notice tip "Cascade is fantastic for big workshops" >}}
Set the workshop's `authors` and `difficulty` once in the chapter `_index.md` via cascade. New lessons inherit it automatically — fewer keys to manage per file.
{{< /notice >}}
