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

## Other render hooks

The theme also customises:

- **Images** — wrapped in a zoomable `<figure>` with optional caption. See [Image shortcode](/docs/shortcodes/03-layout/#image).
- **Headings** — anchor links appear on hover for h2-h4.
- **External links** — automatic `target="_blank" rel="noopener"` and a trailing arrow icon.
- **Code blocks** — `bash {file=script.sh}` syntax adds a filename header + copy button. See [Code shortcodes](/docs/shortcodes/04-code/).

Each is a Hugo render hook under `layouts/_default/_markup/`. The source is the canonical reference if you need to tweak any of these per-site.
