+++
title       = "Navigation model"
description = "How the sidebar, pager, and home listing decide what to show."
weight      = 30
+++

{{< lead >}}
Five rules cover 100% of the theme's navigation behavior. Once you know them, you can predict exactly where any page will appear.
{{< /lead >}}

## Rule 1 — Order is by `weight`, then `title`

Every list (sidebar, pager, card grid, search index) is sorted ascending by `weight`. Pages with the same weight are sorted by `title` next, then by file path.

The convention used throughout the theme is `weight = 10, 20, 30, …` so you can insert pages without renumbering.

## Rule 2 — `hidden: true` excludes the page from listings

When a page has `hidden: true` in front matter:

- Sidebar: page doesn't appear
- Pager: page is skipped (prev/next jumps over it)
- Home / chapter card grid: page doesn't appear
- Search index: page is excluded
- The page **still renders at its URL** — only the listings change

Use this for draft pages, internal references, or any page you want reachable by URL but not advertised.

## Rule 3 — Each section is its own pager scope

The pager (prev/next) walks pages within the **current section only**. From the last page of chapter A, Next is empty (not the first page of chapter B). From the first page of chapter B, Previous goes back to the chapter B landing — not into chapter A.

This trades continuous flow for predictable bounded navigation. Readers use the sidebar (or `/` search) to jump between chapters.

If you want to opt a page out of the pager entirely, set `nopager: true`.

## Rule 4 — Section pages are nav stops

A `_index.md` is a navigable page. The pager treats it as the first item of its scope:

- Chapter landing → first lesson via Next
- First lesson → chapter landing via Previous
- Last lesson → no Next (end of chapter)

This means your chapter `_index.md` content matters — it's the first thing readers hit when they enter the chapter, before any lesson.

## Rule 5 — The home picks top-level sections

`/` (the home page) lists every top-level section in the site, sorted by weight, hidden filtered. Override the order or pick specific sections by setting `home_sections` — either in your site config OR directly on the home page's `_index.md` front matter (the page form wins when both are set):

```toml
# hugo.toml
[params]
  home_sections = ["workshops", "guides", "reference"]
```

```toml
# content/_index.md
+++
home_sections = ["workshops", "guides", "reference"]
+++
```

Without either, the home shows all top-level sections in weight order. See [Customizing › home sections](../../customizing/04-toggles/#picking-which-sections-appear-on-the-home) for the full contract (typo warnings, hidden filtering).

## Worked example

Given:

```text
content/
├── _index.md                                           # weight default
├── workshops/
│   ├── _index.md                                       # weight = 1
│   ├── getting-started/
│   │   ├── _index.md                                   # weight = 1
│   │   ├── 01-introduction.md                          # weight = 10
│   │   ├── 02-installation.md                          # weight = 20, hidden = true
│   │   └── 03-first-search.md                          # weight = 30
│   └── advanced/
│       ├── _index.md                                   # weight = 2
│       └── 01-pipelines.md                             # weight = 10
└── about.md                                            # weight default
```

Then:

| Where you are | What you see |
| --- | --- |
| `/` | Cards: workshops, about (sorted by weight, then title) |
| `/workshops/` | Cards: getting-started, advanced |
| `/workshops/getting-started/` | Sidebar: 01-introduction, 03-first-search (02 is hidden) |
| `/workshops/getting-started/01-introduction/` | Prev: chapter landing · Next: 03-first-search (skips hidden 02) |
| `/workshops/getting-started/03-first-search/` | Prev: 01-introduction · Next: empty |

That's the entire model.

{{< checkpoint "You can predict where any page appears in the nav" >}}
