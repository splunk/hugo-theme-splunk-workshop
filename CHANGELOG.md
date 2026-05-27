# Changelog

All notable changes to the Splunk Workshop Theme are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
versions follow [Semantic Versioning](https://semver.org/).

## [0.10.8] - 2026-05-27

### Changed

- **Inline prose links are now underline-free at rest.** Bold accent-pink text at rest; on hover the text itself becomes the brand pink→orange gradient via `background-clip: text`. WCAG 1.4.1 stays satisfied — link-vs-body contrast clears the 3:1 threshold in both light and dark modes. Replaces the previous solid-magenta underline.
- **External-link arrow** swapped from the Unicode `↗` glyph to a Lucide `arrow-up-right` SVG. Springs up-right on hover with curve ease; explicit `color` so it stays visible while the parent text fades to gradient. Has defensive `width="14" height="14"` attributes so it doesn't blow up to full-container size on first paint before the CSS bundle is cached.
- **Inline `<code>` colour** is now `--color-ink` (normal body ink) instead of `--color-accent-text` — chips like `vi`, `vim`, `ssh` no longer read as link-coloured.
- **`<strong>` / `<b>` inside an anchor inherits the link colour** so `**[link](url)**` markdown keeps its accent + gradient hover instead of having `strong, b { color: var(--color-ink) }` win the cascade and force body ink.
- **Mermaid diagrams** sit on the theme's `--color-surface` band cleanly: pass `themeVariables: { background, clusterBkg, clusterBorder, secondaryColor, tertiaryColor }` all `transparent` so mermaid's default cream-yellow subgraph fill and default-grey cluster border don't fight the theme palette. The `.mermaid` container's border is also dropped — diagram is contained by the surface band alone.

### Added

- **Code-block surface site params** — `codeBg`, `codeHeaderBg`, `codeBgDark`, `codeHeaderBgDark` now bridge from `[params]` in your hugo.toml through `chrome/theme-vars.html` to the CSS. Lets sites override the body / header strip backgrounds per-mode without forking the theme. The syntax-highlight palette (`--code-fg`, `--code-keyword`, `--code-string`, etc.) stays internal to `code.css` — exposing those per-token would invite mismatched contrast against the background you just changed.

### Fixed

- **Unclosed CSS comment in `code.css`** — the `/* ===== Splunk syntax theme — light =====` block was missing its closing `*/`, which masked the entire `:root` and `[data-theme="dark"]` token blocks inside a comment. All the syntax-highlight tokens (`--code-fg`, `--code-keyword`, `--code-string`, etc.) were silently undefined; `.chroma .k`, `.chroma .s`, etc. were falling back to inherit/default. Closed the delimiter; syntax highlighting now actually applies.

### Maintenance

- Trimmed comment bloat in `components.css` — 35 lines of narrative explanation removed without changing behaviour. Kept the load-bearing notes (specificity gotchas, `:has()` selector intent, `@property` browser-support fallback) and dropped marketing copy + placeholder comments.

## [0.10.7] - 2026-05-27

### Fixed

- **`{{% exercise %}}` produced a stray `<pre><code>&lt;/div&gt;</code></pre>` at the end of the rendered exercise body.** The template's closing `</div>` for `.exercise__body` was indented 4 spaces. Because `{{% exercise %}}` is a percent-form shortcode, Hugo runs the rendered output through Goldmark again as part of the surrounding markdown context. When the inner `.Page.RenderString` output ended with a blank line, the 4-space-indented `</div>` was parsed as a CommonMark indented code block — wrapped in `<pre><code>` and HTML-escaped. Same gotcha that `callout-render.html` documents at the top of its file. Fix: the exercise template is now flat (no internal line breaks inside open tags, no 4+ space indentation), matching the callout-render pattern. Verified clean against the live workshop content.

### Reverted

- **Body prose spacing back to `margin-block: 1.1em`** (from the `0.2em` introduced in v0.10.3). The tightened spacing collapsed paragraph breaks visually inside shortcode bodies (exercises, callouts, etc.), where readers expect normal breathing room between distinct prose blocks. If your site relied on the tighter spacing, override per-site with a CSS rule scoped to `.content p { margin-block: 0.2em }` (or whichever selector matches your needs).

### Audited

- Swept every percent-form shortcode that pipes `.Inner` through `.Page.RenderString` (`acknowledge`, `solution`, `expand`, `details`, `objectives`, `prerequisites`, `presenter`, `checkpoint`, `notice`, plus the inline-flat shortcodes `lead`, `card`, `button`, `cta`, `tab`, `step`). Empirically confirmed no other template produces the indented-code-block bug — all closing tags happen to sit at ≤2-space indent (or single-line) which is below the CommonMark threshold. The `exercise.html` template was the only outlier.

## [0.10.6] - 2026-05-27

### Fixed

- **Mermaid diagrams inside `{{% notice %}}` (and any other percent-form callout) double-encoded their arrows**, producing `Lexical error … unexpected token --&gt;` at runtime. Goldmark runs callouts' inner content through a second markdown pass via `.Page.RenderString` (so authors can use inline markdown inside callouts). When the rendered `<pre class="mermaid">` block contained a blank line, Goldmark terminated the type-1 HTML block at the gap — a known divergence from CommonMark, which says type-1 blocks (`<pre>`, `<script>`, `<style>`, `<textarea>`) continue until the matching closing tag. The diagram content after the blank line then got re-parsed as an indented code block, wrapping it in a fresh `<pre><code>` and HTML-escaping it a second time. `--&gt;` became `--&amp;gt;` and mermaid's lexer saw the literal entity instead of an arrow. Fix: both `layouts/_default/_markup/render-codeblock.html` and `layouts/shortcodes/mermaid.html` now collapse consecutive newlines in the diagram source (`replaceRE \n\s*\n → \n`). Mermaid treats blank lines as no-ops so the diagram renders identically — only the rendered HTML changes. Existing diagrams keep their authoring whitespace intact in source; the collapse happens only in the emitted HTML.

## [0.10.5] - 2026-05-27

### Added

- **`lucide:NAME` shorthand in mermaid diagrams** — type `lucide:download` (or any other icon name from `data/icons.toml`) anywhere in a label and it gets substituted with the inline Lucide SVG before mermaid renders. Works in `{{< mermaid >}}`, `{{% mermaid %}}`, and fenced ```` ```mermaid ```` code blocks. Mirrors mermaid's built-in `fa:fa-NAME` shorthand but reuses the theme's existing Lucide set instead of pulling FontAwesome at runtime. Configurable via `mermaidIconSize` site param (default 24 px).
- **Legacy `fa:fa-NAME` compatibility shim** — keeps imported diagrams from `hugo-theme-relearn` working unchanged. Pre-mapped tokens: `fa-download`, `fa-upload`, `fa-microchip`, `fa-route`. Extend `FA_ALIASES` in `chrome/footer.html` as new diagrams need it; unknown names pass through as literal text so failures are visible.
- **Fenced ```` ```mermaid ```` code blocks** — the render-codeblock hook now special-cases the `mermaid` lang and emits the same `<pre class="mermaid">` shape as the shortcode. Authors can use either form.
- **`route` icon** in `data/icons.toml` (Navigation / direction section).

### Changed

- **Mermaid `securityLevel: "strict"` → `"antiscript"`** — matches relearn's default. Allows raw HTML in labels (`<br>`, `<strong>`, `&nbsp;`) — common when migrating diagrams from relearn — while still stripping `<script>` tags and blocking click handlers. Diagrams that previously rendered `<br>` as literal text now line-break correctly.
- **Mermaid wrapper `<div>` → `<pre>` with `htmlEscape | safeHTML`** — same approach as relearn. Labels containing `<`, `>`, `&`, or quotes survive `textContent` round-tripping instead of being stripped by the browser's HTML parser before mermaid sees them.
- **`.content` body width now respects `--content-max`** (driven by `contentMaxWidth` site param, default 720 px). The CSS variable existed but wasn't being applied — callouts and prose were spanning the full middle column up to ~1000 px on wide viewports. Code blocks, mermaid, tables, and full-bleed figures opt out via `max-width: none`.
- **Mobile sidebar width** — `85%` (max `22rem`) → `min(80vw, 22rem)`. Reliable ~75 px content peek on a 375 px viewport (iPhone SE) instead of the previous ~56 px.

### Fixed

- **`--content-max` cascade collision** — `layout.css` was redeclaring the variable AFTER `chrome/theme-vars.html` set it from the site param, so `contentMaxWidth` overrides had no effect. The variable now lives only in theme-vars.html with a paired comment to prevent regression.
- **Code-block opt-out** — the `max-width: none` opt-out list targeted `.content > pre` and `.content > .highlight`, neither of which match the actual DOM (the render hook emits `.content > .code-block > .highlight > pre`). Replaced with `.content > .code-block`.
- **Mermaid theme-toggle re-render** — used `el.innerHTML = src`, which re-parsed labels containing `<` / `>` / `&` as DOM and broke the second render on light/dark flip. Now writes via `el.textContent = src`.
- **Reading-progress bar resize** — was running synchronously on every resize event; now batched via `requestAnimationFrame` like the scroll handler.

### Accessibility

- **Lightbox** — full WAI-ARIA modal-dialog pattern: `role="dialog"` + `aria-modal="true"`, dedicated close button, focus moves into the lightbox on open and restores to the triggering image on close, Tab is trapped, Escape closes. The keydown listener attaches on open and detaches on close. Triggering images are now keyboard-reachable (`tabindex="0"`, `role="button"`).
- **Quiz** — arrow keys (and Home / End) navigate between options. Results are announced via an auto-injected polite live region (`role="status"`), so screen readers report "Correct" or "Incorrect — the correct answer is: …" even when no `{{< quiz-feedback >}}` is authored. Answer text comes from a dedicated `.quiz__option-text` span (no longer relying on `:last-child`).
- **Mobile sidebar** — when open as an overlay (≤820 px), `<main>` and `.site-footer` are marked `inert` so Tab + screen readers stay inside the nav. Focus moves into the sidebar on open. Recomputed on viewport-change so desktop doesn't end up with inert chrome left over from a mobile-overlay state.

### Validation & robustness

- **`figure` / `image` shortcodes** — emit `warnf` when a page-bundle resource lookup misses (skipped for absolute URLs and root-anchored paths so external images don't spam the build log).
- **`youtube` shortcode** — validates id against `^[A-Za-z0-9_-]{11}$` and errors at build time on typos or copy-paste-with-slashes instead of silently producing a broken iframe URL. Replaced the `YOUR_VIDEO_ID` placeholder in the example workshop content (caught by the new validation).
- **`webex-msg` shortcode** — `errorf` when used outside a `{{< webex >}}` parent, instead of silently emitting nothing. Matches the existing `quiz-option` parent-guard pattern.
- **`linkedin` shortcode** — `color` param now allow-listed before interpolation into inline style, preventing `color="red;background:url(…)"` CSS-property-break injection. Same regex as `textcolor.html`.

### Documented

- **Theme storage key locked-step constants** — paired comments on `assets/js/theme-toggle.js` (`const KEY`) and the pre-paint script in `chrome/head.html` flag the load-bearing literal that must stay in sync.

### Visual change (mind on upgrade)

- **Content body now capped at 720 px by default.** Sites that previously relied on prose spanning the full middle column should set `contentMaxWidth = "1080px"` (or another value) in their `[params]`. Code blocks, mermaid, tables, and `figure--align-bleed` figures opt out and remain full-width.
- **Mermaid `securityLevel` is now `antiscript`**, not `strict`. Downstream sites that need to lock it back to `strict` can override the `mermaid.initialize` call in their own custom footer partial.

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
