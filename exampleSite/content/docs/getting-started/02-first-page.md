+++
title       = "Your first workshop page"
description = "Generate a workshop bundle, add a couple of lessons, and link them up."
weight      = 20
+++

{{< lead >}}
Workshops in this theme are folders. A folder with an `_index.md` is a chapter; the markdown files inside are its lessons. The pager and sidebar are derived from that structure.
{{< /lead >}}

## Create the chapter

```bash
hugo new --kind chapter content/workshops/getting-started/_index.md
```

The `chapter` archetype gives you front matter like:

```yaml
+++
title       = "Getting Started"
description = "Your first hour with the platform."
weight      = 1
layout      = "chapter"
subtitle    = "Chapter · Foundation"
+++
```

The `layout = "chapter"` is what unlocks the gradient-weight hero. Without it the page falls back to `list.html` (which is fine, just plainer).

## Add lessons

```bash
hugo new --kind workshop content/workshops/getting-started/01-introduction.md
hugo new --kind workshop content/workshops/getting-started/02-installation.md
```

Each lesson gets a typical workshop front matter:

```yaml
+++
title       = "Introduction"
description = "What you'll build and what you need."
duration    = "5 min"
difficulty  = "beginner"
weight      = 10
tags        = ["overview"]
+++
```

`weight` controls order in the sidebar and the prev/next pager. The convention used throughout the demo is `weight = N0` (10, 20, 30…) so you can slip a `weight = 15` between two lessons without renumbering.

## Run it

```bash
hugo server
```

Visit `/workshops/getting-started/` and you'll see the chapter hero with cards for each lesson. Click into a lesson — the sidebar lists every page in the chapter, the pager links to the next lesson, and `←`/`→` navigate them with the keyboard.

{{< image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80" alt="Workshop page rendered" caption="A typical workshop page in the theme — sidebar, content, TOC, and pager." >}}

## What's next

- Brand the colors, fonts, and logo: see [Customizing](/docs/customizing/).
- Embed callouts, tabs, terminal, mermaid diagrams: see [Shortcodes](/docs/shortcodes/).
- Hide a draft page from nav: set `hidden: true` in front matter (see [Authoring](/docs/authoring/)).

{{< checkpoint "Two lessons rendered with working pager + sidebar" >}}
