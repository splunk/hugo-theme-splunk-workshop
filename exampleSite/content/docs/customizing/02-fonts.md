+++
title       = "Typography"
description = "Swap the entire font stack with one config line."
weight      = 20
+++

{{< lead >}}
The theme defaults to **Inter** (Google Fonts) for display and body, paired with **JetBrains Mono** for code. Three params change every font on the site. Splunk sites can opt back into **Splunk Data Sans Pro** with one extra flag — see below.
{{< /lead >}}

## The three font slots

```toml
[params]
  fontUrl     = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
  fontDisplay = "'Inter', ui-sans-serif, system-ui, sans-serif"
  fontBody    = "'Inter', ui-sans-serif, system-ui, sans-serif"
  fontMono    = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
```

| Slot | Used for |
| --- | --- |
| `fontDisplay` | Headings, hero title, chapter weight number, callout titles, brand wordmark |
| `fontBody` | Prose, lead paragraphs, sidebar, TOC, navigation |
| `fontMono` | Code blocks, inline code, file chips, terminal, kbd, eyebrows, file-tree, badges |

## Opt in to Splunk Data Sans Pro

For Splunk-branded sites, flip a single boolean and point the font params at the family. The theme emits six `@font-face` rules pointing at Splunk's own CDN (the same TTF files `help.splunk.com` serves), so no Google Fonts request is needed for the display/body slot.

```toml
[params]
  splunkDataSansPro = true
  fontUrl     = "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
  fontDisplay = "'Splunk Data Sans Pro', ui-sans-serif, system-ui, sans-serif"
  fontBody    = "'Splunk Data Sans Pro', ui-sans-serif, system-ui, sans-serif"
  fontMono    = "'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, Consolas, monospace"
```

When `splunkDataSansPro` is unset (or `false`), the `@font-face` block in [`layouts/partials/theme-vars.html`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/layouts/partials/theme-vars.html) is skipped entirely — no Heretto-CDN requests fire. The exampleSite/ demo uses exactly this opt-in.

## Switching to a different stack

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
