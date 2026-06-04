+++
title       = "Front matter"
description = "Every front-matter key the theme reads, with examples and defaults."
weight      = 10
+++

{{< lead >}}
The theme respects all of Hugo's standard front-matter keys plus a handful of theme-specific ones. Here's the complete list.
{{< /lead >}}

## Page layouts

Hugo's `layout` front-matter key picks one of three layouts:

| Layout | Opt-in | Renders | Use for |
| --- | --- | --- | --- |
| **`hero`** | `layout = "hero"` (auto for the site/language home) | Centered hero (breadcrumb-or-eyebrow + H1 + lead + CTAs) → body + auto card-grid. No sidebar, no TOC. | Landing pages: home, category hubs. |
| **`chapter`** | `layout = "chapter"` | Gradient weight-number hero → workshop-meta → body OR auto card-grid of sub-sections. Sidebar + TOC. | Chapter intros inside a workshop. |
| default | no `layout` key | Breadcrumb → section eyebrow → H1 → lead → workshop-meta → body. Sidebar + TOC. | Workshop content pages and section landings. |

Hero is automatic only for the language home; every other landing (category hubs etc.) needs explicit `layout = "hero"`. The earlier depth-1 auto-detect was removed in v0.9 — see [`hub` (deprecated)](#hub-deprecated) for migration.

`hero_title` is the only front-matter key that renders markdown in a heading; everything else renders plain. See [Markdown in titles](#markdown-in-titles).

> Don't confuse these page layouts with Hugo [archetypes](../02-archetypes/) — those are `hugo new` content scaffolds. They compose: the `chapter` archetype sets `layout = "chapter"` for you.

**Key-casing convention:** front-matter keys use **snake_case** (`hero_title`, `home_sections`, `show_toc`). Hugo's `isset` is case-sensitive on the lowercased internal key, so mixed-case names like `heroTitle` trip subtle bugs. Site-config `[params]` keys in `hugo.toml` use the existing **camelCase** convention (`brandTagline`, `colorAccent`, `showToc`, `homeSections`) — those are read via case-insensitive accessor and don't have the same foot-gun.

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
layout      = "chapter"                    # pick a page layout
                                            # ("chapter" | "hero" | unset for default)
+++
```

`weight` is the most important — it controls **everything** about ordering: the sidebar, the pager, card grids, the children listing. Use multiples of 10 (10, 20, 30, …) so you can insert pages later without renumbering.

## Theme-specific keys

```yaml
+++
time        = "20 min"               # shown in workshop-meta + cards
duration    = "20 min"               # alias of time (legacy)
difficulty  = "beginner"             # shown in workshop-meta + cards
product     = "ITSI"                 # gradient-filled chip on the card meta row
authors     = ["Pieter Hagen",
               "Robert Castley"]     # shown in workshop-meta (plural array, preferred)
author      = "Pieter Hagen"         # alias of authors[0] (legacy singular)
lastmod     = "2026-04-28"           # optional override; otherwise from git
hidden      = false                  # exclude from sidebar, TOC, search, prev/next
nopager     = false                  # render the page but suppress prev/next
show_toc     = true                   # override site-wide `show_toc` per page
noautocards = false                  # section-only: suppress the auto-card-grid fallback
subsections = false                  # section-only: list sub-sections instead of pages
icon        = "book-text"            # Lucide name; renders as the card's hero
                                      #   visual (pink→orange gradient) in any
                                      #   auto-grid / cards-by-category listing
hero_title   = "Splunk4*Ninjas*."     # hero-only: H1 text rendered through markdownify
                                      #            (the only surface where `*emphasis*` works)
# hub       = true                   # DEPRECATED — use `layout = "hero"` instead.
                                      # Recognised for one release; removal in v0.10.0.
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

### `product`

Free-form short label for the product the workshop covers — `"ITSI"`, `"Observability Cloud"`, `"Splunk Enterprise"`. Renders as a gradient-filled chip at the start of the card's meta row.

The point is to **keep the `title` short**. Authors often pack the product name into the workshop title (`"Alerting and Monitoring with Splunk IT Service Intelligence"`), which makes cards unbalanced in a grid. Split it:

```toml
title       = "Alerting & Monitoring"
product     = "ITSI"
description = "Combine Splunk Enterprise, AppDynamics, Observability Cloud, and ITSI for end-to-end alerting and service-level monitoring."
```

The card renders `Alerting & Monitoring` as the hero with `ITSI` as a category chip in the meta row. Omit `product` and the chip disappears — no layout shift, no empty placeholder.

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

### `show_toc`

Per-page override of the site-wide `show_toc` param. When `false`, the right-rail "On this page" TOC is hidden on this page and the content column expands into the freed space. When `true`, the TOC is shown even if disabled site-wide. When omitted, the site param wins.

Useful for dashboard pages, very wide diagrams, or landing-style indexes where the TOC adds little but takes width.

```yaml
+++
title   = "Dashboard"
show_toc = false
+++
```

**Cascading to a whole section.** Plain `show_toc = false` in a section's `_index.md` only affects that one index page — Hugo's `.Params` are per-page. To hide the TOC across a whole subtree, use Hugo's built-in `[cascade]` block:

```toml
# in some-section/_index.md
[cascade]
  show_toc = false
```

Every descendant inherits unless it sets its own `show_toc`. The same mechanism works for any other front-matter key.

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

By layout:

- **chapter** — body and cards are mutually exclusive. Any prose suppresses cards; `noautocards = true` is the explicit form.
- **hero** — body AND cards both render (body first, cards under). `noautocards = true` is the only way to suppress the grid when prose is present.
- **default** — no auto-cards fallback; the flag is a no-op.

The sidebar still lists children regardless — the flag only removes the in-content grid.

**Gotcha: HTML-commented shortcodes still run.** The auto-grid is suppressed when a `cards`, `card`, or `children type="card"` shortcode appears in the body (they set a `_has_cards` flag on the page). Hugo evaluates shortcodes **before** markdown rendering, so wrapping them in `<!-- … -->` hides the output from the browser but still fires the flag — which silently suppresses your `home_sections` grid or any other auto-cards path. To genuinely disable a shortcode in source, escape it with `/* */`:

```markdown
<!--
{{</* cards */>}}
{{</* card title="Resources" href="/resources/" */>}}…{{</* /card */>}}
{{</* /cards */>}}
-->
```

The `/* */` tells Hugo to render the shortcode as literal text instead of running it; HTML comments then hide the literal text from readers.

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

### `hero_title`

Hero-only override for the H1, rendered through `markdownify`. `*asterisks*` become `<em>` with the brand gradient. The only key that does this — every other heading renders `title` plain.

```toml
+++
title     = "Splunk4Ninjas"      # plain fallback (browser tab, search, cards)
hero_title = "Splunk4*Ninjas*."   # rendered H1 — "Ninjas" gets the gradient
layout    = "hero"
+++
```

**Eyebrow on nested heroes.** The site home shows `eyebrow` (or `params.brandTagline`). Nested hero sections show the **breadcrumb** in that slot instead — there's no other way back to ancestor pages. `eyebrow` is ignored on nested heroes; use `description` for a subtitle.

### `hub` (deprecated)

Replaced by `layout = "hero"`. Recognised for one release with a build warning; removal in v0.10.0.

```toml
# OLD: hub = true
# NEW:
layout = "hero"
```

Works at any depth. The workshop root for a nested page is the highest non-hero ancestor:

```text
/workshops/                            layout = "hero"   (was: auto-detected at depth-1)
/workshops/observability/              layout = "hero"   (was: hub = true)
/workshops/observability/k8s-monitor/  workshop          ← workshop root
/workshops/observability/k8s-monitor/01-intro/   page
```

The depth-1 auto-detect was removed too — every hero section now needs the explicit key. Re-run `hugo` after upgrading; deprecation warnings list each section to migrate. A separate `hero-trap` warning fires when a hero section has direct `.md` page children (they'd be unreachable in workshop nav).

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

`content/_index.md` front matter drives the home page hero — no template editing needed:

```toml
+++
title       = "Learn by building."
hero_title   = "Learn by *building*."
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

- **`title`** — plain text. Used for browser tab, search index, social cards.
- **`hero_title`** — optional markdown-rendered H1 override; `*asterisks*` get the brand gradient italic. Falls back to `title`.
- **`eyebrow`** — kicker above the title. Falls back to `params.brandTagline`.
- **`description`** — lead paragraph. Falls back to `params.description`.
- **`cta`** — list of `{label, href, style}`. `style: ghost` makes a secondary button; `primary` is the default. Internal hrefs are baseURL-prefixed; external (`http*`) hrefs get `target="_blank"`.
- Markdown body renders below the hero; the auto card-grid renders under that. Use [`noautocards`](#noautocards) to suppress the grid; [`home_sections`](../../customizing/04-toggles/#picking-which-sections-appear-on-the-home) to curate which sections appear.

`hero_title` works on any section with `layout = "hero"`, not just the home.

## Markdown in titles

One rule: **only `hero_title` renders markdown.** `title` and `linkTitle` are plain text everywhere they surface.

| Surface | Source | Rendering |
| --- | --- | --- |
| Hero H1 | `hero_title` → `title` | markdown → `<em>` with brand gradient |
| Chapter H1, default H1 | `title` | plain |
| Sidebar, breadcrumb, pager, card titles | `linkTitle` / `title` | plain |
| `<title>` tag, OpenGraph, search index | `title` → `markdownify \| plainify` | stripped to plain |

Why so strict? `markdownify` treats a leading digit-dot-space (`1. Foo`) as an ordered-list marker and emits `<ol><li>…</li></ol>` inside the heading, breaking every inline DOM context that contains it. Plain text everywhere removes the bug class.

Trade-off: `*emphasis*` in `title` shows literal asterisks. Use `hero_title` for the one surface that needs the italic gradient:

```toml
+++
title       = "Splunk4Rookies Workshops"      # plain everywhere else
hero_title   = "Splunk4Rookies *Workshops*"    # only used by the hero layout's H1
layout      = "hero"
+++
```

If a site genuinely needs rich text in a different surface (a specific sidebar label, say), the escape hatch is to override the relevant template and switch `{{ .LinkTitle }}` to `{{ .LinkTitle | safeHTML }}` — explicit per-site opt-in, no theme-wide breakage.

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
