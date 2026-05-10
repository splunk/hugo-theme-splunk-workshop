+++
title       = "Typography"
description = "Swap the entire font stack with one config line."
weight      = 20
+++

{{< lead >}}
The theme defaults to **IBM Plex Sans** + **IBM Plex Mono** — the same stack as `splunk.github.io/observability-workshop`. Three params let you change every font on the site.
{{< /lead >}}

## The three font slots

```toml
[params]
  fontUrl     = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
  fontDisplay = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
  fontBody    = "'IBM Plex Sans', ui-sans-serif, system-ui, sans-serif"
  fontMono    = "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
```

| Slot | Used for |
| --- | --- |
| `fontDisplay` | Headings, hero title, chapter weight number, callout titles, brand wordmark |
| `fontBody` | Prose, lead paragraphs, sidebar, TOC, navigation |
| `fontMono` | Code blocks, inline code, file chips, terminal, kbd, eyebrows, file-tree, badges |

## Switching to a different stack

### Inter + JetBrains Mono

```toml
fontUrl     = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
fontDisplay = "'Inter', ui-sans-serif, system-ui, sans-serif"
fontBody    = "'Inter', ui-sans-serif, system-ui, sans-serif"
fontMono    = "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
```

### Editorial: serif headings + sans body

```toml
fontUrl     = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500..800&family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap"
fontDisplay = "'Fraunces', ui-serif, Georgia, serif"
fontBody    = "'Inter', ui-sans-serif, sans-serif"
fontMono    = "'JetBrains Mono', ui-monospace, monospace"
```

### System-only (zero network requests)

```toml
fontUrl     = ""
fontDisplay = "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
fontBody    = "ui-sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
fontMono    = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
```

Setting `fontUrl = ""` drops the Google Fonts `<link>` from `<head>` entirely — useful for offline-capable sites or ultra-strict CSP setups.

## Self-hosting fonts

If you want to ship the font files yourself (privacy, performance, no external network):

1. Download the woff2 files from Google Fonts (or [Fontsource](https://fontsource.org/)).
2. Drop them under `static/fonts/`.
3. Write a `static/css/fonts.css` with `@font-face` rules.
4. Set `fontUrl = "/css/fonts.css"`.

Hugo serves anything under `static/` at the corresponding URL, so `/css/fonts.css` resolves correctly.

{{< tip "Font loading" >}}
The default `display=swap` in the Google Fonts URL means text renders in the fallback font first, then swaps when the web font loads. That's the right tradeoff for workshop content — you'd rather show something readable than block on the network.
{{< /tip >}}

## Heading sizes

Heading sizes are controlled by CSS custom properties in `assets/css/typography.css`. They're not exposed as params (yet), but the file is short — search for `--fs-` if you want to override them in your own CSS.
