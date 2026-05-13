# Changelog

All notable changes to the Splunk Workshop Theme are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
versions follow [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Changed

- **Default display/body font is now Inter** (loaded from Google Fonts), replacing Splunk Data Sans Pro. The theme markets itself as fully rebrandable, so the out-of-the-box default is now a neutral, openly-licensed family. JetBrains Mono remains the code font.

### Added

- `splunkDataSansPro` boolean param. Set `splunkDataSansPro = true` in `[params]` and point `fontDisplay`/`fontBody` at `'Splunk Data Sans Pro', …` to restore the Splunk-branded typeface; the theme then emits the six `@font-face` rules that load Splunk Data Sans Pro from Splunk's CDN. The `exampleSite/` demo uses this opt-in and is the canonical reference for Splunk-branded sites.

### Migration

If your site relied on the previous default and you want to keep Splunk Data Sans Pro, add the four lines under "Opt in to Splunk Data Sans Pro" in [docs/customizing/typography](https://splunk.github.io/hugo-theme-splunk-workshop/docs/customizing/02-fonts/) to your `[params]` block. Otherwise expect display/body text to render in Inter on next build.

## [0.1.0] - 2026-05-12

### Added

- Initial public release as a redistributable Hugo theme.
- Workshop layout: three-column with sidebar navigation, content, and right-rail TOC.
- Light / dark / auto color modes with `prefers-color-scheme` and persisted toggle.
- Reading-progress bar tracking scroll within the content column.
- Client-side site search — JSON index + vanilla-JS modal (`/`, `⌘K`/`Ctrl+K`).
- Keyboard navigation between workshop pages (`←` / `→`).
- Chapter-as-self-contained-unit pager: section landings have no Previous, last lessons have no Next.
- Skip-to-content link, `:focus-visible` rings, ARIA-correct tabs, `aria-current` on active sidebar.
- 50+ shortcodes covering callouts, structure, layout, code blocks, heavyweights (math, diagrams, video, presenter), and utilities.
- Relearn-compatible aliases: `notice`, `expand`, `details`, `cards`, `children`, `tabs`+`tab` (with `groupid`), `button`, `icon`, `attachments`, `resources`, `siteparam`, `relref`, `tree`, `highlight`, `math`, `mermaid`.
- Splunk-specific shortcodes: `otel-version`, `linkedin`, `presenter` (with floating toggle and `P`×2 hotkey), `textcolor`.
- KaTeX and Mermaid loaded on demand via per-page `Page.Store` flags.
- Mermaid re-renders on light/dark toggle via `MutationObserver`.
- SRI-pinned CDN assets for KaTeX and Mermaid.
- `i18n/en.yaml` extracts every UI string for translation.
- Print stylesheet — hides chrome, prevents code blocks from breaking across pages, forces light colors.
- Render hooks for code (with `{file=…}` filename header + copy button), images (zoomable + lightbox), headings (anchor permalinks), and external links (auto target + arrow icon).
- Splunk Data Sans Pro display/body + JetBrains Mono code, matching `splunk.github.io/observability-workshop`.
- Splunk brand palette: official Magenta 50 `#FF007F` → Orange 50 `#FF9000` gradient with 10/90 stops, plus supplementary amber `#FFAB0F` for warm callouts.
- Brand-asset hero backgrounds — official Splunk-light and Splunk-dark gradient bloom WebP images swap automatically with theme mode (`heroBackgroundLight` / `heroBackgroundDark` params).
- Full-bleed responsive layout pinning sidebar/TOC to viewport edges with a flexing content column.
- Hugo Modules support via `go.mod`.
- `exampleSite/` with a minimal Getting Started workshop.
- `Makefile` with `serve`, `build`, `clean`, `check`, `stats`, `shortcodes`, `screenshot` targets.
- `images/screenshot.png` (1500×1000) and `images/tn.png` (900×600) for themes.gohugo.io listing.
- `LICENSE` (MIT), `CHANGELOG.md`, `CONTRIBUTING.md`, `README.md`.
