+++
title       = "Markdown rendering"
description = "How the theme renders standard markdown elements — blockquotes, headings, links, images, code."
weight      = 40
+++

{{< lead >}}
The theme uses [Hugo render hooks](https://gohugo.io/render-hooks/) to give standard markdown a polished, branded treatment. You don't need a shortcode for ordinary prose; just write the markdown.
{{< /lead >}}

## Blockquotes — two render paths

Plain markdown blockquotes branch into two visual treatments depending on whether they carry a GitHub Alert marker.

### Plain blockquote → speech-bubble pull-quote

Write a normal markdown blockquote:

```markdown
> The single biggest problem in communication is the illusion that
> it has taken place.
```

…and the theme renders it as a tinted card with paired decorative curly quotes (opening top-left, closing bottom-right) and a small bubble tail at the bottom-left. Use it for pull-quotes, attributed dialogue, or any text where the visual signal is "someone said this" rather than "I am calling out a safety note."

> The single biggest problem in communication is the illusion that
> it has taken place.

This is intentionally NOT a callout. It carries no severity (note / warning / etc.) — just a typographic flourish for quoted prose.

### GitHub Alerts → callout

If you prefix the blockquote with a GitHub Alert marker like `> [!TIP]`, the theme routes it through the callout renderer instead — full icon + label chip + tinted background. The five supported markers and full syntax are documented in [Callouts → GitHub Alerts](/docs/shortcodes/01-callouts/#github-alerts).

### Quick decision guide

- **Quoting someone (or playful pull-quote):** plain blockquote.
- **Semantic information about the workshop (tip / warning / heads-up):** GitHub Alert (`> [!TIP]`) or the `notice` shortcode. Don't lead a plain blockquote with `Tip:` / `Note:` expecting it to auto-promote — the theme renders it as a plain blockquote with the leading keyword visible in the text.

## Render hooks

The theme uses Hugo render hooks (in `layouts/_default/_markup/`) to customise four markdown elements globally — authors don't reach for shortcodes for these; the markdown does the right thing on its own.

### Images

Wrapped in a zoomable `<figure>` with an optional caption (the markdown image's *title* attribute). Capped at the prose-column width with click-to-zoom into a lightbox. See [Image shortcode](/docs/shortcodes/03-layout/#image-with-caption--zoom) for the `{{</* image */>}}` shortcode equivalent with explicit args.

### Headings

H2–H4 get hover-revealed anchor links so readers can deep-link to a specific section. The anchor (`#`) fades in at 0.6 opacity on heading hover, brightens on its own hover or keyboard focus, and on click updates the page URL to that section — copy it from the address bar to share. The h1 is reserved for the page title set by the layout, so authors don't normally produce one in body markdown.

### External links

Any link whose `href` starts with `http` automatically gets `target="_blank" rel="noopener"` and a small ↗ arrow trailing the link text — visual cue that the reader is about to leave the workshop. Internal links (`/docs/...` or `./relative/`) render plain.

### Code blocks

Fenced code blocks (`` ```bash ``) get a tinted card with copy buttons, brand-tinted hover ring, and JetBrains Mono. Append `{file=script.sh}` after the language for a filename header + per-file copy affordance. Full coverage in [Code shortcodes](/docs/shortcodes/04-code/).

## Auto-styled typography

Beyond render hooks, the theme styles every plain markdown element with deliberate typographic treatment. You write the markdown; the theme paints it. Reach for these knowingly — most of them are designed to make standard markdown feel branded.

### Headings (h1–h4)

- **h1** — page title. Used once, by the layout (not by markdown body). 4xl size, weight 700, tight letter-spacing.
- **h2** — major section break. Gets `3.5rem` top margin, a 1px hairline `border-top` in `--color-border`, and a **4rem-wide magenta→orange gradient stripe** painted across the left edge of that hairline via `::before`. Visually anchors the start of each major section.
- **h3** — sub-section. Same display font, no stripe, lighter margins.
- **h4** — minor heading. Used for fine-grained subdivisions inside an h3.

The h2 stripe is the theme's most recognisable typographic signature. Every h2 the markdown produces carries it — there's no opt-out per heading, but `.card__title` and `.pager__title` (which are class-only, not h2 elements) deliberately skip it.

### Horizontal rule (`<hr>`)

`---` in markdown renders as a centred gradient dot bracketed by two hairlines — magenta→orange swept gradient in the middle, neutral border on either side. Use as a section break between long-form prose where a heading would be heavier than needed.

### Lists

Both `<ul>` and `<ol>` get a magenta `::marker` glyph (the bullet for `ul`, the number for `ol`). Ordered lists render their numbers in mono `var(--font-mono)` weight 500 for a slight typographic shift.

```markdown
- First item
- Second item

1. First step
2. Second step
```

### Inline `<code>`

Anything in backticks (`` `code` ``) gets a tinted pill background, JetBrains Mono at 87.5% size, magenta-accent text colour (Magenta 60 light / Magenta 30 dark for AA contrast), and a thin border in `--color-border`. Reads as code without needing a fenced block.

Distinct from fenced code blocks — those are full cards. Inline code is for *names of things in prose* (variable names, command names, short flags), not for code samples.

### Definition lists

Standard markdown definition lists (`term:` followed by `:    definition` on the next line, in Goldmark dialect) render with **bold display-font terms** and **muted-ink definitions** indented under each.

```markdown
HTTP
:    Hypertext Transfer Protocol

OTEL
:    OpenTelemetry — a vendor-neutral observability standard.
```

### Emphasis

`**strong**` renders at weight 650 in full ink. `*em*` is true italic. The slightly-bolder-than-700 weight on strong is deliberate — feels heavier against the lighter Inter / Splunk Data Sans Pro body weights without crossing into display-bold.

## Customising

Every rule above lives in `assets/css/typography.css`. To opt out of the h2 stripe globally, override the `h2::before` block to `content: none`. To disable external-link arrows, edit the `render-link.html` partial. Both are theme-level changes; the parameters in `hugo.toml` don't currently expose typography toggles.
