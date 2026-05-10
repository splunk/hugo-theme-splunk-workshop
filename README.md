# Splunk Workshop Theme

A modern Hugo theme for technical workshops. Branded for Splunk out of the box (the official Magenta 50 → Orange 50 brand gradient), and rebrand-able to any company via Hugo `params`.

![Splunk Workshop Theme](images/screenshot.png)

**📖 Live demo & full docs: <https://splunk.github.io/hugo-theme-splunk-workshop/>**

## Features

- **Three-column workshop layout** — sidebar (chapter nav) · prose · on-this-page TOC
- **Light / Dark / Auto** with manual toggle and `prefers-color-scheme`
- **Built-in search** — `/` or `⌘K` opens a fuzzy modal over a JSON index
- **Keyboard navigation** — `←` / `→` step through workshop pages
- **50+ shortcodes** — callouts, steps, exercises, tabs (with sync), terminal, kbd, file-tree, image, quiz, presenter notes, mermaid, math, cards, children, and more
- **IBM Plex** typography (Sans + Mono) — same stack as `splunk.github.io/observability-workshop`
- **Accessible by default** — `:focus-visible` rings, ARIA-correct tabs, skip-to-content link
- **i18n-ready** — every UI string lives in `i18n/en.yaml`
- **Print-friendly** — workshops print cleanly with no chrome
- **No build dependencies** — pure Hugo extended; no PostCSS, no Node toolchain

> Requires Hugo **0.125+** extended.

## Install

Three install methods, in order of preference:

```bash
# 1. Hugo Module — version-pinned, easy upgrades
hugo mod get github.com/splunk/hugo-theme-splunk-workshop

# 2. Git submodule — no Go required
git submodule add https://github.com/splunk/hugo-theme-splunk-workshop.git \
  themes/hugo-theme-splunk-workshop

# 3. Direct download
curl -L https://github.com/splunk/hugo-theme-splunk-workshop/archive/refs/heads/main.tar.gz \
  | tar -xz -C themes/
```

Step-by-step instructions, troubleshooting, and a minimal `hugo.toml` are in the
[Getting Started docs](https://splunk.github.io/hugo-theme-splunk-workshop/docs/getting-started/).

## Quick start (run the demo locally)

```bash
git clone https://github.com/splunk/hugo-theme-splunk-workshop.git
cd hugo-theme-splunk-workshop
make serve         # http://localhost:1313
```

That's it — the demo IS the docs. Search, navigate, toggle dark mode, see every shortcode in context.

## Documentation

Everything lives at [splunk.github.io/hugo-theme-splunk-workshop](https://splunk.github.io/hugo-theme-splunk-workshop/):

- [**Getting started**](https://splunk.github.io/hugo-theme-splunk-workshop/docs/getting-started/) — install, first page, deploy
- [**Customizing**](https://splunk.github.io/hugo-theme-splunk-workshop/docs/customizing/) — colors, typography, logos, layout toggles
- [**Shortcodes**](https://splunk.github.io/hugo-theme-splunk-workshop/docs/shortcodes/) — live reference for every shortcode
- [**Authoring**](https://splunk.github.io/hugo-theme-splunk-workshop/docs/authoring/) — front matter, archetypes, navigation model
- [**Advanced**](https://splunk.github.io/hugo-theme-splunk-workshop/docs/advanced/) — Hugo Modules, presenter mode, search internals, i18n

## Development

```bash
make serve         # demo on http://localhost:1313 with live reload
make build         # production build to exampleSite/public/
make check         # build with strict logging
make stats         # line counts for templates / CSS / JS
make shortcodes    # list every shortcode shipped
make screenshot    # refresh images/screenshot.png and images/tn.png
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for code conventions, the test loop, and release process.

## License

MIT — see [LICENSE](LICENSE).

The Splunk wordmark and brand colors belong to Splunk Inc. (a Cisco company). This theme is an unofficial community project; rebrand the params for any non-Splunk use.
