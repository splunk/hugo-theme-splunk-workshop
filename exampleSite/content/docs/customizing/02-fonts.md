+++
title       = "Typography"
description = "Swap the entire font stack with one config line."
weight      = 20
+++

{{< lead >}}
The theme defaults to **Splunk Data Sans Pro** (the official Splunk typeface, also used on `help.splunk.com`) for display and body, paired with **IBM Plex Mono** for code. Three params change every font on the site; one is loaded from Splunk's CDN, the others from Google Fonts.
{{< /lead >}}

## The three font slots

```toml
[params]
  # Splunk Data Sans Pro is loaded via @font-face rules emitted by
  # theme-vars.html (six weights from Splunk's own CDN). fontUrl below
  # only pulls the mono companion.
  fontUrl     = "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap"
  fontDisplay = "'Splunk Data Sans Pro', ui-sans-serif, system-ui, sans-serif"
  fontBody    = "'Splunk Data Sans Pro', ui-sans-serif, system-ui, sans-serif"
  fontMono    = "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
```

### Where Splunk Data Sans Pro comes from

The theme embeds six `@font-face` declarations pointing at the same TTF files `help.splunk.com` loads (`https://assets.portal.heretto.com/splunk/26.02.26/SplunkDataSansPro_{Lt,Rg,Md,Bd,XBd,Blk}.ttf`). The declarations live in [`layouts/partials/theme-vars.html`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/layouts/partials/theme-vars.html) so they're emitted inline with the other CSS-variable bindings — no separate stylesheet, no extra request beyond the font files themselves.

If you switch `fontDisplay` and `fontBody` to a different family, the `@font-face` rules are still emitted but become dead weight. Override the partial in your own site (`layouts/partials/theme-vars.html`) to remove them, or live with the harmless extra bytes.

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

{{< notice tip "Font loading" >}}
The default `display=swap` in the Google Fonts URL means text renders in the fallback font first, then swaps when the web font loads. That's the right tradeoff for workshop content — you'd rather show something readable than block on the network.
{{< /notice >}}

## Heading sizes

Heading sizes are controlled by CSS custom properties in `assets/css/typography.css`. They're not exposed as params (yet), but the file is short — search for `--fs-` if you want to override them in your own CSS.
