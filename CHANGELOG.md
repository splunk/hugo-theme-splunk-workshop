# Changelog

All notable changes to the Splunk Workshop Theme are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
versions follow [Semantic Versioning](https://semver.org/).

## [0.10.4] - 2026-05-26

### Added

- **`acknowledge` shortcode** — content the reader must explicitly click through before continuing. Renders two surfaces from one block: an always-visible inline orange-banded aside (so the content stays in the page for later reference) **and** a native `<dialog>` modal that pops on first page-load. ESC is blocked via the cancel event; the only way out is the "I understand" button. Ack state persists in localStorage under `splunk-workshop:acks`, keyed by `<page-permalink>::<ordinal>` so multiple acknowledge blocks on one page are tracked independently. Reserve for content that genuinely cannot be skimmed — "watch the instructor do this", "the next step deletes data, don't run it twice". Documented in [docs/shortcodes/structure › Acknowledge](docs/shortcodes/02-structure/#acknowledge).
- **Card completion tick** — a magenta check appears in the bottom-right corner of any card whose linked section has been fully read. Works on all three card render paths: the auto card-grid, `{{< card >}}`, and `{{< children type="card" >}}`. State lives in three localStorage keys: `splunk-workshop:visited` (per-workshop URL list), `splunk-workshop:totals` (per-workshop sidebar link count, written every visit so workshop content changes update the threshold automatically), and `splunk-workshop:pages` (universal page-dwell set, covers single-page `_index.md` sections that don't have a workshop sidebar). Documented in [docs/shortcodes/layout › Progress tracking](docs/shortcodes/03-layout/#progress-tracking--the-completion-tick), including dev reset/inspect snippets and the accessibility note.
- **Card hero icons** — Lucide icon as a card's "featured image", stroked with the brand pink→orange gradient. Opt in via `icon = "name"` in a section's front matter (auto-grid cards) or `hero-icon = "name"` on `{{< card >}}`. The gradient uses `--color-accent` / `--color-accent-2` so rebranded sites get their own gradient. Inline `icon=` is auto-suppressed when `hero-icon=` is set — one identity signal per card.
- **`{{< card >}}` meta row** — opt-in via `show-time=true` / `show-pages=true`. Pulls reading time + child-page count from the linked Hugo page, rendering the same mono-uppercase + magenta-bullet styling as the auto-grid card meta. No-ops silently on external `href` values.
- **Exercise gradient header bar** — full-bleed pink→orange bar carrying a target icon (subtle 2.4 s heartbeat pulse, honors `prefers-reduced-motion`) + label + title in mono caps. Body sits in a clean panel below. Replaces the chip-style header.
- **`book-text` and `target` icons** in `data/icons.toml`.
- **`completed`, `acknowledge`, `acknowledgeDefault`, `iUnderstand` i18n keys** in `en.yaml`.

### Changed

- **Callout markup restructure** — the title is now a sibling of `.callout__body` (not inside it). The callout uses a 2-row grid: row 1 is `icon | title`, row 2 is the body spanning both columns. Body prose now flows at the full callout width instead of being indented under the icon column. The collapsible `<details>` variant was already correct; no change there.
- **Callout severity escalation** — `warning` gets a perimeter hairline border on top of its 5 px left rule plus a louder 16 % bg ("stop and read"). `danger` goes full saturated red with white text/icon and a soft drop shadow ("irreversible action"). Quiet severities (`note` / `tip` / `info` / `success`) are unchanged.
- **`.shortcode-card` hover** unified with the auto-grid `.card` — both now show the same gradient-ring effect (full brand-gradient `::before` masked by a paper-inset `::after`, fades in on hover). The old top-edge gradient sweep is gone. Per-card `--card-accent` still drives the shadow tint.
- **`.card__hero` and `.shortcode-card__hero`** dropped the pink-tinted background and border-bottom divider. The gradient icon now floats on the card's surface so it pops against neutral whitespace AND the hover ring stays uninterrupted around the full perimeter.

### Fixed

- **Card completion tick a11y** — removed `aria-hidden="true"` from the badge wrapper so the `.sr-only` "Completed" label gets announced to assistive tech. The SVG inside `icon-svg.html` keeps its own `aria-hidden` (decorative).
- **`children.html` tick badge** now emits the `hidden` attribute, matching the other two card templates.
- **Acknowledge modal centring** — explicit `position: fixed; inset: 0; margin: auto` works around browsers that drop the UA stylesheet's default modal-dialog centring. Long bodies scroll inside the modal via `max-height: calc(100dvh - 3rem)` + `overflow: auto`.
- **`hugo.Data.icons` gradient on thin strokes** — the card-hero-icon partial uses `gradientUnits="userSpaceOnUse"` so horizontal/vertical text-line strokes (zero-height bounding box) render the gradient correctly in every browser, not just Chrome/Safari.
- **Dead CSS** — removed the `@property --card-sweep` declaration left over from the previous shortcode-card hover; consolidated two near-identical `.shortcode-card__meta` blocks into one with both selector contracts (`__meta-item` and bare `<span>`) preserved.

### Documented

- New "Progress tracking — the completion tick" section in cards docs covering both completion paths, the three localStorage keys, dev reset/inspect snippets, the 2-second dwell behaviour, and the accessibility note.
- New "Severity ladder" section in callouts docs describing the visual escalation across severities with use-sparingly guidance for `danger`.
- New "Acknowledge" section in structural-shortcodes docs.
- New "Hero icons" and "Opt-in meta row" sub-sections in cards docs; new `icon =` key in the front-matter reference.
- Exercise description updated to reflect the gradient-bar layout.

## [0.10.3] - 2026-05-24

### Added

- **`webex` + `webex-msg` shortcodes** — simulated Cisco Webex chat as a narrative device for workshop exercises ("your manager just pinged you about a customer complaint, here's what you'd see"). Light-theme styling that matches the real Webex desktop client: white surface, soft gray borders, all messages stacked left with avatar + name + time + body (no left/right bubble split). Parent supplies the chat partner (`chat=`), status, date divider, and optional "Seen by" indicator; each child message takes `from=` (initials), `name`, `time`, `color` (per-sender avatar tint), and `me=true` for the current user — which swaps the initials disc for a chat-bubble glyph and defaults the name to "You". Message bodies support full markdown. Documented in [docs/shortcodes/heavyweights › Webex chat simulation](docs/shortcodes/05-heavyweights/#webex-chat-simulation).
- **Image `align="center"`** — centred via `margin: auto`, capped at `--content-max` (720 px). Joins the existing `left` / `right` / `bleed` / `none` set.
- **Image `height=` param** — clamps the image vertically (any CSS length). Pair with `width=` to pin the picture into a fixed box; the browser preserves the intrinsic aspect ratio when only one dimension is set.
- **`raw` utility shortcode** ships and is then removed in the same release — Hugo's shortcode preprocessor parses every `{{< … >}}` pair regardless of context, so a `raw` wrapper can't hide nested shortcode delimiters from it. The native escape `{{</* … */>}}` (and `{{%/* … */%}}` for the percent form) is the right tool; it works inline, in tables, and in fenced code blocks.

### Changed

- **Nested callouts now use a strip-mark layout** instead of the box-in-box rendering. A callout inside another callout sheds its container and gets a 3 px coloured strip on its left edge; the type icon sits at the top of the strip as the visual anchor, the title stays in the type's colour, and the body flows underneath. Reads as a margin mark, not as a second box fighting the first. CSS-only — applies on every author path (`{{%/* notice */%}}` nested in `{{%/* notice */%}}`, `> [!TYPE]` blockquote nested in either, etc.) and cascades to arbitrary nesting depth.
- **`exercise` header is now an inline chip.** The `EXERCISE` label and the exercise title sit on a single baseline, separated by a soft bullet (`◆ EXERCISE • Retail Therapy`). Previously the title rendered as a large display heading below the label. The label and title now share the same mono-uppercase-magenta style — the exercise header reads as one continuous chip rather than a label-plus-heading stack. New `<header class="exercise__head">` wraps both nodes; the underlying `<p class="exercise__label">` / `<p class="exercise__title">` elements are unchanged for existing override hooks.
- **`checkpoint` title supports inline markdown.** Pass `**bold**`, `*italic*`, `` `code` ``, or `[links](…)` in the title and they render. The title isn't bold by default, so author emphasis carries its own weight.

### Visual change (mind on upgrade)

- **Prose block spacing tightened.** The global `p, ul, ol, blockquote, dl, table, pre { margin-block }` dropped from `1.1em` to `0.2em`. Every prose block on every consumer site becomes ~5× closer to its neighbours. If your workshop content was tuned around the old breathing room — particularly long pages with many lists or paragraphs — add a site-level CSS override to restore the previous value: `.content p, .content ul, .content ol, .content blockquote, .content dl, .content table, .content pre { margin-block: 1.1em; }`.

## [0.10.2] - 2026-05-23

### Fixed

- **`.Site.Data` deprecation warning** on Hugo v0.156.0+. The icon data-file reads in `_partials/icon-svg.html` and `shortcodes/icon-gallery.html` were going through `site.Data.icons`, which Hugo flagged as deprecated. Both now use `hugo.Data.icons`. No behavioural change; build is quiet again.

## [0.10.1] - 2026-05-23

### Documented

- **HTML-commented shortcodes still run.** Added a "Gotcha" callout under [Front matter › `noautocards`](docs/authoring/01-front-matter/#noautocards) explaining why wrapping `{{< cards >}}` in `<!-- … -->` silently suppresses the `home_sections` grid — Hugo evaluates shortcodes before markdown rendering, so `_has_cards` fires even when the output is hidden. Workaround: escape with `{{</* … */>}}`.

### Tweaked

- `.section-divider` height/margin tightened (80→60 px, 4rem→2rem margin) so the divider sits closer to surrounding content.
- `.shortcode-card__image img` gains a 5px padding + rounded corners to match the surrounding card radius.

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
