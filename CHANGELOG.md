# Changelog

All notable changes to the Splunk Workshop Theme are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
versions follow [Semantic Versioning](https://semver.org/).

## [0.10.0] - 2026-05-23

### Added

- **Icon catalog at `/docs/shortcodes/icons/`.** New auto-generated reference page that renders every bundled icon with its name underneath. Single source of truth: icon SVG path data extracted from `_partials/icon-svg.html` into `data/icons.toml`, which both the partial and the new `icon-gallery` shortcode read. Adding an icon is now a one-entry edit to the data file — the gallery updates on next build.
- **Site-level icon extension.** Authors can extend or override the bundled icon set without forking the theme by creating `data/icons.toml` in their own site; Hugo's data-file precedence puts site overrides ahead of the theme.

### Fixed

- **Site-config `[params]` lookups reverted to camelCase.** v0.9.0's snake_case rename was over-applied — the case-sensitivity foot-gun is real for **page front-matter `isset` checks** but `.Site.Params.X` reads are case-insensitive and have always been camelCase in this theme. As a result, sites that kept their existing `showToc = true` (or `homeSections = [...]`) in `hugo.toml` saw the lookup return nil after upgrading to 0.9.x, silently suppressing the TOC on every page. Code now reads `$p.showToc` / `$p.homeSections` / `site.Params.stableOtelVersion`. **Page front matter stays snake_case** (`show_toc`, `hero_title`, `home_sections`) — that part of the v0.9.0 migration was correct.
- **`hero-trap` warning message rewritten.** The previous wording ("those pages are unreachable in workshop navigation") implied a broken state; the actual behaviour is "children render fine but get no sidebar/pager". New text labels the intentional hero-with-cards pattern explicitly and tells the author when to ignore the warning.

### Notes for v0.9.x upgraders

If you ran the v0.9.0 sed migration over `hugo.toml`, revert the `[params]` changes — those keys can stay camelCase (`showToc`, `homeSections`, etc.). The sed should only have touched **content `.md` files** (front matter `hero_title` / `home_sections` / `show_toc`). The two-tier convention is now documented in [Authoring › Front matter › Page layouts](docs/authoring/01-front-matter/#page-layouts).

## [0.9.3] - 2026-05-23

### Fixed

- **Callout titles via GitHub-Alert blockquotes (`> [!TIP]`, etc.) no longer crash the build.** v0.9.2's markdown-in-titles fix called `markdownify` on the value Hugo's render-blockquote hook forwards as the title — but `.AlertTitle` is already-rendered `template.HTML`, and markdownify refuses already-rendered input. Added a `| string` cast so both code paths (string from `{{< notice >}}`, template.HTML from the render hook) flow through cleanly.

## [0.9.2] - 2026-05-23

Re-tag of v0.9.1 to escape a checksum-mismatch problem: v0.9.1 was force-republished shortly after its initial tag, which violates Go's tag-immutability assumption and poisons the proxy/`go.sum` hash for anyone who fetched the first v0.9.1. v0.9.2 contains the same code v0.9.1 was supposed to ship. Skip v0.9.1.

### Fixed

- **Callout titles now honour inline markdown** in `{{< notice >}}` calls (e.g. `title="**Foo**"`). Previously rendered as literal asterisks. **Broken on pages that use `> [!TIP]`-style GitHub Alert blockquotes — see v0.9.3.**

## [0.9.1] - 2026-05-23 [BROKEN — do not use]

Tag was force-rewritten shortly after publish; subsequent fetches fail Go's checksum check. Use v0.9.2 instead.

## [0.9.0] - 2026-05-23

### Changed (breaking)

- **Hero opt-in is now explicit via `layout = "hero"`.** The depth-1 auto-detect (sections with no direct `.md` children) is gone. Replace `hub = true` with `layout = "hero"`; `hub` still works for one release with a build warning, removal in v0.10.0.
- **Visible-label text is plain everywhere.** Breadcrumb, sidebar, pager, card titles, chapter H1, default H1: no `markdownify`. Fixes the `<ol><li>...</li></ol>` DOM injection that ran on numbered titles like `1. Verify Agent`. Use `hero_title` (below) for the gradient italic.
- **Partial reorg under `_partials/`.** Grouped into `chrome/`, `nav/`, `workshop/`, `cards/`, `shell/`, `page/`. Old `_partials/page-shell.html` and `page-inner-*.html` are gone — see the mapping in step 4 below.
- **Three theme front-matter keys renamed to snake_case** to follow Hugo's best-practice for custom keys (Hugo lowercases all keys internally; mixed-case names cause subtle `isset` bugs):
  - `heroTitle` → `hero_title`
  - `homeSections` → `home_sections` (page front matter and `[params]`)
  - `showToc` → `show_toc` (page front matter and `[params]`)

### Added

- **`hero_title` front-matter key.** Hero-only override; renders the H1 through `markdownify`. Only surface where markdown emphasis works inside a heading.
- **`_default/hero.html` template.** Fires when `layout = "hero"` is set; delegates to `_partials/page/hero.html`.
- **Three documented page layouts**: `hero`, `chapter`, default. See [Authoring › Front matter › Page layouts](docs/authoring/01-front-matter/#page-layouts). Not the same as Hugo [archetypes](docs/authoring/02-archetypes/) — the `chapter` archetype sets `layout = "chapter"` for you.

### Migration

1. **Replace `hub = true` with `layout = "hero"`** in every section that used it. Re-run `hugo`; the build prints one deprecation warning per affected section.
2. **Add `layout = "hero"` to category landings that previously auto-detected.** Any depth-1 `_index.md` with sub-sections only (no direct `.md` children) needs it. **The build does not warn for this case** — audit with `find content -mindepth 2 -maxdepth 3 -name '_index.md'`. Symptom of a miss: a category landing rendering as the 3-column shell.
3. **Use `hero_title` for italic-gradient hero H1s.** Move `*emphasis*` out of `title` into `hero_title`; keep `title` as the plain fallback for nav/cards/browser-tab.
4. **Rename camelCase keys to snake_case** in your content and config — `sed -i '' -e 's/heroTitle/hero_title/g' -e 's/homeSections/home_sections/g' -e 's/showToc/show_toc/g'` over your content tree and `hugo.toml`. The old camelCase names *work* (Hugo case-folds reads) but trip on `isset` in custom templates; standardising on snake_case removes the foot-gun.
5. **Update partial overrides** if you have any. The theme can't warn about moved partials — your override at the old path will be silently ignored. Mapping:

   | Old path | New path |
   | --- | --- |
   | `_partials/page-shell.html` | `_partials/shell/three-column.html` |
   | `_partials/page-inner-{single,list-workshop,chapter}.html` | replaced by `_partials/page/{default,chapter}.html` (different shape; see file for new args) |
   | `_partials/{head,header,footer,custom-header,theme-vars}.html` | `_partials/chrome/<name>.html` |
   | `_partials/{sidebar,sidebar-tree,breadcrumb,pager,toc,language-switcher}.html` | `_partials/nav/<name>.html` |
   | `_partials/{workshop-root,workshop-meta,page-meta-footer,flat-pages,visible-pages,children-count}.html` | `_partials/workshop/<name>.html` |
   | `_partials/{card-from-page,cards-auto-grid}.html` | `_partials/cards/<name>.html` |
   | `_partials/{callout-render,resource-list,icon-svg,site-href}.html` | unchanged (still flat at `_partials/`) |

## [0.2.0] - 2026-05-13

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
