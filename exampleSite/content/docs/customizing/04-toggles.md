+++
title       = "Layout toggles"
description = "Hide the sidebar, drop the progress bar, change the prose width."
weight      = 40
+++

{{< lead >}}
Six boolean params and one width param control the major layout decisions. Flip them in `hugo.toml` to suppress chrome you don't need.
{{< /lead >}}

## All toggles

```toml
[params]
  defaultMode     = "auto"     # "light" | "dark" | "auto"
  showThemeToggle = true       # sun/moon button in the header
  showSidebar     = true       # left workshop nav on workshop pages
  showToc         = true       # right-rail "On this page"
  showProgress    = true       # gradient reading-progress bar
  showLightTrails = true       # decorative gradient streaks in hero/footer
  contentMaxWidth = "720px"    # prose column width on workshop pages
```

## When to flip each

### `defaultMode`

`auto` honors `prefers-color-scheme` on first visit; the user can override via the toggle and their choice persists in localStorage. Set to `"dark"` if you're shipping a black-tie product (Splunk, Datadog, observability tooling tends to look right in dark). `"light"` if you want a more bookish feel.

### `showThemeToggle`

Hide the sun/moon button when you've decided your site is one-mode-only. Combine with `defaultMode = "dark"` (or `"light"`) to commit fully to a single mode.

### `showSidebar`

Defaults to `true`. Hide it for sites where every page is a top-level resource (more like a blog than a multi-chapter workshop). When the page has no siblings, the sidebar is automatically suppressed even with this `true`.

### `showToc`

Right-rail "On this page" auto-generated from H2/H3 headings. Hide for landing pages or pages with little structure. Auto-suppresses when the page has no headings.

### `showProgress`

The gradient bar at the top of the page that fills as you scroll. Useful on long workshop pages, distracting on short marketing pages. Defaults to `true`.

### `showLightTrails`

The decorative gradient blobs in the top-right of the hero and bottom-left of the footer. Pure decoration — set to `false` for a flatter, less editorial look.

### `contentMaxWidth`

The prose column cap on workshop pages. Default is `720px` which works for IBM Plex Sans at the default body size. Bump up if you want denser pages, down if you want a more book-like feel.

## Per-page overrides

Some toggles can be overridden per-page in front matter:

```yaml
+++
title  = "..."
hidden = true        # exclude from sidebar, TOC, search, prev/next
nopager= true        # render the page but suppress the prev/next pager
+++
```

`hidden: true` is the canonical way to draft pages that should ship invisibly. `nopager: true` is for special pages (intro, outro, glossary) where prev/next doesn't make sense.

## Picking which sections appear on the home

```toml
[params]
  homeSections = ["workshops", "guides", "reference"]
```

Without this, the home page lists all top-level sections by weight (filtering out anything with `hidden: true`). Set `homeSections` to lock the order or hide specific sections from the home without hiding them everywhere.

{{< checkpoint "You can rebrand and reshape the theme without writing CSS" >}}
