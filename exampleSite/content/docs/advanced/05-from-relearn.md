+++
title       = "Migrating from hugo-theme-relearn"
description = "Compat-alias table, front-matter mapping, and what you gain by switching."
weight      = 50
+++

{{< lead >}}
The theme ships drop-in aliases for the most-used relearn shortcodes, so most workshop content moves over unchanged. This page is the explicit checklist — what's compatible, what isn't, and the new affordances you pick up after the swap.
{{< /lead >}}

## Drop-in aliases

These shortcodes exist with relearn-compatible names so your existing markdown keeps working:

| Relearn shortcode | This theme | Notes |
|---|---|---|
| `notice` | `notice` | Identical API: `{{</* notice tip "Title" */>}}`. Full param surface — `style`, `title`, `icon`, `color`, `expanded`, `groupid`. |
| `expand` | `expand` | `{{%/* expand "Click me" */%}}` — title is positional or `title=` |
| `details` | `details` | Same as `expand` but uses `summary=` argument name |
| `cards` + `card` | `cards` + `card` | Same API. `href` preferred over `url` (both accepted) |
| `tabs` + `tab` | `tabs` + `tab` | Supports `groupid=` for synchronized cross-page tabs |
| `relref` | `relref` | Errors loudly on missing target — typos won't silently link to `#` |
| `siteparam` | `siteparam` | Accepts `name=` or positional |
| `attachments` | `attachments` | Lists every non-markdown file in a page bundle |
| `resources` | `resources` | Filter with `pattern=` |
| `tree` | `tree` | Recursive page tree |
| `highlight` | `highlight` | Wraps Hugo's built-in highlighter with copy-to-clipboard |
| `math` | `math` | KaTeX, lazy-loaded only when a page uses it |
| `mermaid` | `mermaid` | Re-renders on light/dark toggle |
| `button` | `button` | `href=`, `icon=`, `style=primary\|ghost`, `target=` |
| `icon` | `icon` | Inline SVG icon by name |
| `children` | `children` | `style=cards\|list\|h2`, `depth=`, `sort=` |

## Front-matter mapping

Most relearn front-matter keys are honored as-is. Differences:

| Relearn key | This theme | Notes |
|---|---|---|
| `weight` | `weight` | Same — controls ordering everywhere |
| `description` | `description` | Same — renders as lead paragraph + meta description |
| `hidden` | `hidden` | Same — excludes from sidebar, search, pager, children listings |
| `chapter` | use `layout = "chapter"` | Triggers the gradient weight-number hero |
| `head` | (not supported) | Override `layouts/partials/head.html` in your own site instead |
| `menuPre` / `menuPost` | (not supported) | Customise the sidebar via your own `layouts/partials/sidebar.html` |
| `disableToc` | `showToc = false` (theme param) or `nopager = true` (page-level pager only) | TOC is a theme-wide param; pager can be suppressed per page |

For full front-matter coverage on this theme see [Authoring › Front matter](../../authoring/01-front-matter/).

## What changes visually

- **The hero**. Relearn's chapter pages have a numbered banner. This theme uses a similar gradient weight-number hero, but the gradient and typography are different. Set `colorAccent`, `colorAccent2`, `fontDisplay`, and `fontBody` in your `hugo.toml` to rebrand.
- **Sidebar**. Relearn has nested expandable groups. This theme has a flat scoped sidebar that shows the current chapter's pages — chapter switching is the responsibility of the breadcrumb / parent listing. If you depend on the nested-tree UX, override `layouts/partials/sidebar.html` in your own site.
- **Print stylesheet**. Both themes ship one. This theme's is in `assets/css/print.css`.
- **Edit-on-GitHub link**. Set `params.editURL` in your `hugo.toml` and pages get a "Edit this page on GitHub" link in the footer.

## What you gain

The reason to switch — beyond what relearn already does — is the workshop-pedagogy shortcode layer:

- `{{</* objectives */>}}` — *What you'll learn* checklist
- `{{</* prerequisites */>}}` — *Before you start* callout
- `{{</* step */>}}` — Numbered walkthrough steps with auto-incrementing markers
- `{{</* exercise */>}}` + `{{</* solution */>}}` — Try-it boxes with reveal-on-click answers
- `{{</* checkpoint */>}}` — Milestone marker for "you've made it this far"
- `{{</* quiz */>}}` + `{{</* quiz-option */>}}` + `{{</* quiz-feedback */>}}` — Inline quick checks with feedback
- `{{</* terminal */>}}` — `$ prompt`-aware command/output blocks
- `{{</* file */>}}` + `{{</* file-tree */>}}` — File listing + path tree
- `{{</* presenter */>}}` — Live-workshop speaker notes with a `P × 2` reveal hotkey
- `{{</* otel-version */>}}` — Splunk-specific, keeps OTel Collector version current

Plus the hero gradient bloom, the JSON-indexed fuzzy search, keyboard navigation between pages (`←` / `→`), and a presenter mode designed around live workshops rather than self-paced docs.

## Migration steps

1. **Vendor or pin the theme**. See [Getting started › Install](../../getting-started/01-install/) for Hugo Modules, submodule, and direct-download options.
2. **Swap the `theme =` value** in your site's `hugo.toml`.
3. **Run the dev server**. `hugo server` should build without errors. Any failures are usually one of:
    - A `relref` to a renamed page → fix the path (the new theme errors instead of silently linking to `#`)
    - A heading anchor that no longer exists → update the link
    - A custom partial you'd overridden → reapply against the new partial
4. **Rebrand**. Copy the `[params]` block from this theme's `hugo.toml` and adjust colors/fonts/logos. The five Splunk colors (`colorAccent` etc.) and the four fonts (`fontDisplay`, `fontBody`, `fontMono`, `fontUrl`) cover most needs.
5. **Adopt the workshop shortcodes incrementally**. There's no rush — relearn-compat keeps your old content working while you migrate page-by-page to `step`, `exercise`, `checkpoint`, etc.

## Things that don't transfer

- **Multi-language relearn syntax** that depends on Hugo's site-level multilingual config. This theme supports Hugo's standard i18n via `i18n/<lang>.yaml`, but no relearn-specific glue.
- **`menuPre` / `menuPost`** front-matter customisation. Override the sidebar partial if you need this.
- **Relearn's "Variant" theme switcher**. This theme has light/dark/auto only.
- **The collapsing TOC for long pages.** This theme's TOC is non-collapsible by design (workshop pages aren't usually long enough to need it).

If any of these are dealbreakers, [open an issue](https://github.com/splunk/hugo-theme-splunk-workshop/issues) — most are tractable.
