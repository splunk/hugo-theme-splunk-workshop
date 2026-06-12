# Changelog

All notable changes to the Splunk Workshop Theme are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and
versions follow [Semantic Versioning](https://semver.org/).

## [0.13.9] - 2026-06-08

### Security

- **CSS-color allow-list factored into a shared partial.** New `layouts/_partials/css-color.html` validates a user-supplied colour against a regex allow-list (hex, named colours, `rgb()` / `hsl()` / `var()` / `color-mix()` syntax) before it's interpolated into an inline `style` attribute. Applied to every shortcode that takes a `color=` arg and emits it inline:
  - `button.html` (filled-style chip)
  - `card.html` (`--card-accent` CSS variable)
  - `icon.html` (inline glyph color)
  - `linkedin.html` (replaces the local copy of the same regex)
  - `webex-msg.html` (avatar tint)
  
  Same defence as `textcolor.html` / `badge.html`. On failure each shortcode falls back to a sensible per-context default (`currentColor`, accent, etc.) so a malformed value degrades safely instead of rendering attacker-controlled CSS declarations.

### Fixed

- **`solution` shortcode label now honours inline markdown.** Same fix as the other title-arg shortcodes in v0.13.6 — pipes the label through `markdownify` so an author can write `label="**Solution** with bold"` and have it render as expected.

## [0.13.8] - 2026-06-08

### Fixed

- **Nested `tabs` blocks could merge their panes.** When two separate `{{< tabs >}}` blocks live inside `step`, `exercise`, or `notice` shortcodes (whose `.Inner` re-renders via `.Page.RenderString`), the inner `.Position` collapses to zero and `.Ordinal` resets per sub-scope. Both `{{< tabs >}}` then computed the same bucket key in `.Page.Store` and their child `{{% tab %}}` pushes accumulated into one bucket, producing a tab bar with all panes from both blocks. The fix adds an explicit `id=` (or `key=`) arg to `tabs`; `tab` reads it from `.Parent.Get "id"`. When omitted, the existing automatic keying (`.Position` + `.Ordinal`) is still tried — so pages without the nesting hazard need no changes. Documented in `shortcodes/02-structure.md` + `03-layout.md`. v0.13.7 was an earlier incomplete attempt at this fix.

### Added

- **`objectives` and `prerequisites` shortcodes now accept a `title=` arg** (and first positional). Pipes through `markdownify` so authors can format the heading (`title="**Goals** for today"`). Defaults remain "What you'll learn" and "Before you start" via the new `objectivesTitle` and `prerequisitesTitle` i18n keys.

## [0.13.6] - 2026-06-08

### Fixed

- **Shortcode `title=` args now honour inline markdown** on `expand`, `details`, `badge`, `exercise`, `acknowledge`, and `presenter`. Previously a value like `title="**Ninja:** Observing the collector internals"` rendered with literal `**` asterisks in the visible heading instead of bold text. Each shortcode now pipes its `title` (or `summary`) value through `markdownify` at the point of visible output, matching the same fix applied to the `step` shortcode in v0.11.4. `aria-label` and `<dialog aria-labelledby>` reference points are left as plain text where they're attributes (markdown HTML in attribute strings doesn't help assistive tech and would render as literal angle brackets).

## [0.13.5] - 2026-06-05

### Fixed

- **`site-href.html` now recognises any RFC 3986 URI scheme**, not just `http`. Previously a `mailto:`, `tel:`, `ftp:`, `data:`, etc. href was passed through `relLangURL` as if it were an internal path — mangling it. The scheme check is now `findRE '^[A-Za-z][A-Za-z0-9+.-]*:'` plus an explicit `//` (protocol-relative) check.
- **`{{< image >}}` / `{{< figure >}}` / the markdown image render hook** route `/`-prefixed image refs through `site-href.html` so the baseURL path prefix is added on GitHub Pages project-page deploys (and any other subpath host). Previously a `src="/foo.png"` produced a domain-rooted href that 404'd on subpath sites.
- **`{{< include >}}` bubbles `_needs_katex` and `_needs_mermaid` flags** from the included page's `Page.Store` up to the host page's store. Without this, a workshop that pulls in a shared snippet via `include` and the snippet uses the `{{< mermaid >}}` shortcode would not load mermaid.js on the host page — diagrams rendered as plain text.

### Changed

- **Theme's root `hugo.toml` defaults to single-language** (multilingual block now commented out). Consuming sites that opt into multilingual mode uncomment the block in their own config. This matches the typical author flow and avoids confusing newcomers who don't need `/en/` URL prefixes.
- **README** clarifies that the theme reads from `content/` by default and only requires `content/<lang>/` directories when multilingual mode is opted in.

## [0.13.4] - 2026-06-05

### Changed

- **Inline code chips now carry brand identity on the type, not the surface.** Background unified with fenced code blocks (`--code-bg`, the same surface used by `.code-block`); chip text uses `--color-accent-text` — the theme's body-text accent token (dark magenta `#BD0D5F` on white in light mode, light pink `#FF7DBA` on navy in dark mode). Both token values are pre-tuned for WCAG body-text contrast (~5.4:1 light, ~8:1 dark). Two earlier-flagged problems addressed in one move:
  - **Two-tone code surfaces** (chip on `--color-surface-alt` vs blocks on `--code-bg`) read as visual noise per the frontend-design review. They now share the surface; the chip is distinguished by the brand glyph colour + border + tight padding.
  - **Dark-mode chips were nearly invisible** (previously `--color-surface` on `--color-paper-dark` = only 4–11 unit per-channel delta). Pink text on the unified surface gives the chip definitive identity without needing a tinted background.
- **Removed the `[data-theme="dark"]` chip override** — `--code-bg` and `--color-accent-text` both flip per theme automatically, so a single rule serves both modes.
- **Chip border bumped to `--color-border-strong`** for definition at the small chip size.

## [0.13.3] - 2026-06-05

### Fixed

- **Inline code chip butted up against neighbouring words.** Rules in typography.css had `padding: 0.15em 0.4em` but no margin, so the chip's filled background started right where the inter-word space ended — reading "into `gateway-metrics.out`." the gap from the "o" in "into" to the chip's left edge was just the natural space character, which is visually tight against the chip's solid fill. Added `margin: 0 0.15em` so there's a deliberate ~0.15em buffer on each side without feeling like a real word gap.

## [0.13.2] - 2026-06-05

### Changed

- **Slide content is left-aligned by default.** Reveal.js's stock styles centre every section, which suits a TED-talk deck but is wrong for technical content — workshops are made of bullet lists, code blocks, and paragraph prose, all of which parse faster left-aligned. Override applied as `.slides-overlay .reveal .slides section { text-align: left }`.
- **`.center` per-slide opt-in** for cover slides, big takeaways, hero quotes — anything that genuinely benefits from centring. Use the reveal.js native class-comment pattern inside the section: `<!-- .slide: class="center" -->`. The theme ships the `.center` rule; the comment syntax is reveal.js's standard mechanism so any other reveal-known class (or your own) works the same way. Documented in `shortcodes/05-heavyweights.md`.

## [0.13.1] - 2026-06-05

### Fixed

- **Slide canvas background broken on GitHub Pages (and any subpath deploy).** The slides.css `background-image` used `url("/images/…")` which is domain-rooted — the browser resolved it to `https://splunk.github.io/images/…` instead of `https://splunk.github.io/observability-workshop/images/…`. Changed to `url("../images/…")` so it resolves relative to the bundled CSS file at `<base>/css/bundle.css` and lands at `<base>/images/…` on any deploy.
- **Inter font (and every other workshop override inside `.reveal`) was being silently overridden by reveal.js.** Reveal.js injects its own stylesheet into `<head>` at runtime on first deck open — AFTER slides.css is already loaded. Rules with equal specificity therefore lost by source order: my `.reveal { font-family: Inter }` was being beaten by reveal's `.reveal { font-family: Source Sans Pro }`. All in-slide rules are now scoped to `.slides-overlay .reveal` (two classes) instead of bare `.reveal` (one class), which outranks reveal's defaults regardless of source order. The bug also affected the typography reset (strong/em color, code-block chrome, image sizing) — those override too now.

## [0.13.0] - 2026-06-05

### Added

- **`{{< slides >}}` shortcode — inline mid-workshop slide deck.** Author writes markdown inside the shortcode with `---` between slides; on click, the deck mounts in a fullscreen overlay over the workshop. Powered by [reveal.js](https://revealjs.com/) v6.0.1, loaded from jsdelivr on first open (~75KB one-time, with SRI hashes pinned so a CDN compromise can't inject modified code). Pages without `{{< slides >}}` pay nothing — slides.js is bundled but gates on `[data-slides-trigger]` selectors at init. The slide canvas uses the Splunk dark-mode WebP from `static/images/` so decks look on-brand without per-slide background config.
- **Presenter-mode gate on the deck CTA.** By default the preview card is hidden so attendees don't see the deck on a normal scroll-through. It only appears when presenter mode is on — same `[data-presenter="true"]` toggle the theme already uses for `{{< presenter >}}` notes and the `P P` keyboard shortcut. Override with `.slides-card { display: grid }` in your own CSS if you want decks visible to every reader.
- **Inter font (with optical-size axis) loaded for slide typography.** Distinct from the workshop site's Splunk Data Sans Pro so slide type reads as its own thing. Loaded from Google Fonts on first deck open, never on pages without slides.
- **Four new i18n keys** (`slidesKicker`, `slidesOpen`, `slidesSlide`, `slidesSlides`) so consumers can retheme or translate the deck CTA without touching shortcode source.

### Fixed

- **Presenter mode toggle pill could stack click handlers under Hugo dev-server live reload.** Each rebuild re-injected the JS bundle, calling `initPresenter()` a second time, which appended another click listener to the pill — clicks then toggled `data-presenter` an even number of times in a row and the mode appeared stuck. Added an idempotency guard on `document.documentElement.dataset.presenterInit` so subsequent invocations no-op.
- **Arrow-key conflict between reveal.js and the theme's keyboard-nav** (prev/next workshop page) — both attach to `document` and `stopPropagation` doesn't stop sibling listeners on the same element. Guard added in `keyboard-nav.js` itself: short-circuits when `.slides-overlay.is-open` is present so reveal.js owns nav keys while the deck is up.

## [0.12.0] - 2026-06-05

### Added

- **`product` front-matter field on workshop / section pages.** Renders a gradient-filled chip at the top-right of the auto-grid card, labelling the product the workshop covers ("ITSI", "Observability Cloud", "Splunk Enterprise"). The point is to **keep the `title` short**: authors often pack the product name into the title ("Alerting and Monitoring with Splunk IT Service Intelligence"), which makes cards unbalanced in a grid. Split it: `title = "Alerting & Monitoring"` + `product = "ITSI"`. Omit `product` and the chip disappears — no layout shift, no empty placeholder.

### Changed

- **Auto-card head row.** `card-from-page.html` now wraps the numbered eyebrow (`card__num`) and the new product chip (`card__product`) in a `card__head` flex row so the title flows full-width below. If only one of the two is present (no index, or no product), the row still renders correctly via `margin-left: auto` on the chip — it always pins right. Cards with neither emit no head row at all.
- **Card icon hero moved below the head row.** When a section sets `icon = "<lucide-name>"`, the hero icon now renders **between** the head row and the title, not above it. The hero's negative top margin is gone (`margin: 0.25rem 0 0.75rem`) so it sits cleanly under the eyebrow.
- **Chapter weight number sized down.** `.chapter-hero .chapter__weight` was `clamp(4rem, 9vw, 7rem)` which let two-digit weights ("18", "90") intrude into the chapter title's horizontal space. Now `clamp(2.5rem, 5vw, 4rem)` — clearly a small decorative ghost in the corner, never competing for title room.

## [0.11.7] - 2026-05-29

### Fixed

- **Chapter weight number bottom-curve crop — actual root cause this time.** v0.11.5 and v0.11.6 added `padding-block` to `.chapter__weight` chasing a misdiagnosed `background-clip: text` painting-area issue. Verified A/B in a real browser with Playwright that padding doesn't move the clip point at all. The actual cause is the inherited `letter-spacing: -0.06em` on this rule: non-zero letter-spacing interacts with `background-clip: text` in Chrome and shifts the paint area, cropping the bottom of curve-digits (5, 8, 0, 6, 9). `letter-spacing: normal` here restores the rounded bottom. Padding-block additions from v0.11.5 / v0.11.6 are dropped — they were solving nothing.

## [0.11.6] - 2026-05-29

### Fixed

- **Chapter weight number STILL clipped after 0.11.5.** The previous `padding-block: 0.1em` covered the cap heights but didn't cover the **curve overshoots** at the bottom of digits like 5, 8, 0, 6, 9 in Bricolage Grotesque at `font-weight: 800` — these glyphs are designed to extend a few percent below the baseline so they look optically aligned with flat-bottomed digits (1, 2, 7). At this font size the overshoot exceeded 0.1em, so `background-clip: text` still cropped the bottom curves. Bumped to `padding-block: 0.18em`, which covers both the cap overshoots and the curve overshoots without meaningfully shifting the visual position of the (intentionally faded) chapter number.

## [0.11.5] - 2026-05-29

### Fixed

- **Chapter weight number clipped at the top.** `.chapter__weight` (the large gradient number in the chapter-hero corner) uses `line-height: 1` + `font-weight: 800` + `clamp(5rem, 12vw, 9rem)`. At heavy display weights the digit caps extend above the line-box, and `background-clip: text` only paints within the padding box — so the tops of the digits render transparent and look cropped. Added `padding-block: 0.1em` so the gradient covers both ends of the glyph. The 0.11.3 audit had explicitly skipped this rule on the grounds that numbers don't have descenders — true, but they have **ascenders**, which clip the same way at this weight.

## [0.11.4] - 2026-05-29

### Security

- **`badge` shortcode: allow-list custom `color=` values before inline-style interpolation.** `safeCSS` marks a value as trusted but doesn't validate it; an unguarded `color="red;background:url(evil)"` would inject extra CSS declarations into the badge's `style` attribute. Now restricted to a conservative char-set (hex, named colours, `rgb()` / `hsl()` / `var()` / `calc()` syntax) — failing values fall back to `currentColor` so the badge degrades safely instead of rendering attacker-controlled CSS. Same defence as `textcolor.html`.

### Fixed

- **Quiz option markers stopped at F.** The `quiz` shortcode used a hard-coded `slice "A" "B" "C" "D" "E" "F"` to label options, so a 7th option rendered an empty marker. Now generates the letter from the index (`printf "%c" (add 65 $i)`) — quizzes scale to any reasonable number of options.

### Accessibility

- **Browse-page filter empty state is announced to screen readers.** `.browse__empty` now carries `role="status" aria-live="polite"`, so when a query goes from hits to no-hits, assistive tech announces "No matches" instead of silently leaving the user wondering whether the input was registered. Sighted users see no visual change.

### Documentation

- **i18n catalog updated** with the new `notFound*` keys introduced in 0.11.2 — `notFoundEyebrow`, `notFoundQueryLabel`, `notFoundResultLabel`, `notFoundResultValue` — plus a short paragraph on what each drives so consumers know what they're overriding when they retheme the 404.
- **Tabs**: documented the label / `icon=` arguments on `tab` (the per-tab affordances, not just the wrapping `tabs` block).
- **Math**: documented the `align="left|center|right"` argument on the `math` shortcode.
- **Utilities**: rounded out `attachments` / `children` / `include` / `textcolor` docs (sort and icon args on `attachments`; `type` / `image` / `showhidden` / `notime` on `children`; `hidefirstheading` on `include`; `font` / `weight` plus the input-validation note on `textcolor`).
- **`otel-version`**: corrected the param location — reads `Site.Params.stableOtelVersion` (top-level `[params]`), not `params.splunk.*`. Renders nothing if unset rather than failing the build.

## [0.11.3] - 2026-05-28

### Fixed

- **Descender clipping on every gradient-clip-text surface.** `background-clip: text` with `text-fill-color: transparent` only paints the gradient inside the element's padding box. Descenders (g, p, y, q, j) that extend below the baseline render invisible — the gradient isn't there to reveal, the glyph itself is transparent, so the bottom of the letter looks cropped. Reported on the new 404 page heading ("This page has no trace." — the `g` in "page" was clipped). Audit found four other rules with the same latent bug: `.hero__title em` / `.browse__title em` / `.cat__name em` (italic gradient on display headings), `.cat__name a:hover` (browse category hover), `.ws-row:hover .ws-row__title` (browse workshop hover), and the prose link hover. All five now have a small `padding-bottom` (0.05–0.1em depending on context) so the painted area covers descenders. Padding-bottom on inline elements doesn't participate in line-box height, so neighbouring text doesn't shift on hover.

### Changed

- `exampleSite/content/browse/_index.md` now uses the italic-gradient pattern (`title: "All *Workshops*"` + `linkTitle: "All Workshops"`) to demo the v0.11.0 italic-display-heading feature in the bundled example. The menu entry keeps the plain-text name via `linkTitle`.

## [0.11.2] - 2026-05-28

### Added

- **404 page reframed in observability language.** Title is now `This page has no trace.` (was `Not found.`), eyebrow is `404 · No span found`, lead reads `We searched every metric, log, and span for this URL — nothing matched. The workshops list, however, is well-instrumented.` Jargon is limited to "trace" / "span" — they read as English even to a non-observability visitor, so the joke doesn't lock out casual users.
- **Fake-query result panel on the 404 page.** A small monospaced panel under the lead surfaces the visitor's actual path as a "query" that returned `0 events in the last 30 days`. Path is populated by an inline 4-line script (`location.pathname + location.search`); panel is `hidden` at first paint and unhides only once filled, so without JS the page just shows heading + lead + CTA — no awkward empty panel. Uses the existing `--code-bg` / `--color-border` tokens so consuming sites inherit their own code-block colours automatically.
- **Three new i18n keys** (`notFoundQueryLabel`, `notFoundResultLabel`, `notFoundResultValue`) so consumers can override the joke or translate the panel without forking the template.

## [0.11.1] - 2026-05-28

### Fixed

- **Header menu produced doubled URLs for page-backed entries on subpath baseURLs.** A menu entry added via a page's front-matter `[menu.main]` block (introduced for the new `/browse/` page in 0.11.0) reports `.URL` as the page's `RelPermalink` — which is already an absolute path including the baseURL prefix and language subdir. The header template was piping that through `site-href.html`, which stripped the leading slash and re-applied `relLangURL`, producing URLs like `/<basepath>/<lang>/<basepath>/<lang>/<page>/` — a 404 on the production deploy. Now switches on `.Page` presence: `.RelPermalink` directly for page-backed entries, site-href only for URL-only entries (defined in `hugo.toml` with `url =`). Surfaces on any consuming site with a non-root baseURL (GitHub Pages project pages, any subpath deploy). The exampleSite uses a root baseURL, which is why local testing didn't catch it.

## [0.11.0] - 2026-05-28

### Added

- **"See all" workshop directory page** (closes #3). Opt in by creating `content/<lang>/browse/_index.md` with `layout: browse` and (optionally) `browse_sections` to nominate which top-level sections to surface and in what order. The page groups every workshop by category — title + description + last-updated time per workshop, a "Recently updated" rail at the top, and a live client-side filter. Granularity: a "workshop" is a leaf workshop-root (hero hubs are descended through). Chapter pages stay hidden behind the workshop link. The header's `/` search overlay reads the same data: with no query, its empty state shows the categories as a jump-to-area list.
- **Italic gradient on display headings.** Markdown `*italic*` inside the hero title, the See-all browse h1, and category names renders as the pink→orange gradient instead of plain italic. Scoped to display headings only — workshop body `##` / `###` keep emphasis as plain italic so file names like `*agent.yaml*` aren't recoloured. Titles must pipe through `markdownify` to opt in (`hero.html`, `browse/list.html`, `browse/row.html` already do); the `step` shortcode now does the same for step titles.
- **`legacyLatestRedirect` site param.** Opt-in on the themed 404 page: detects `/…/latest/<rest>` URLs (from sites that previously used a `/latest/` segment in their URL scheme) and `location.replace`s to `/…/<rest>` before the 404 content paints. One file catches every legacy URL — no per-page `aliases:` front matter required. Gated on a param so brand-new sites pay nothing.
- **Code-block surface params** (`codeBg`, `codeHeaderBg`, `codeBgDark`, `codeHeaderBgDark`). Each code-block surface (body, header bar, dark variants) is now a Hugo param so consumers can match their own design without forking CSS. Defaults sit one step off the page paper / surface tokens so a code block reads as "embedded panel" rather than blending into the page.

### Documentation

- **Mermaid section rewrite** (`shortcodes/05-heavyweights.md`). Documents the three authoring forms (`{{< mermaid >}}`, `{{% mermaid %}}`, fenced ` ```mermaid `), the `lucide:NAME` + `fa:fa-NAME` icon substitution, the `mermaidIconSize` param, the `securityLevel: "antiscript"` policy, and the transparent surface overrides.
- **`custom-header.html` override hook** is now documented (`customizing/03-logos.md`), with a warning callout about the canonical path (`_partials/custom-header.html`, NOT `_partials/chrome/…`).
- **See-all browse page** documented in `authoring/03-navigation.md`.
- **Two new troubleshooting entries**: missing themed 404 on `defaultContentLanguageInSubdir` sites (needs a CI `cp public/<lang>/404.html public/404.html` step — GitHub Pages only serves the catch-all from repo root) and the legacy `/latest/…` URL pattern.
- **Stale partial paths fixed** in `colors.md`, `fonts.md`, `logos.md`, and `troubleshooting.md` (paths gained the `chrome/` subdir in earlier releases; docs didn't follow).

### Fixed

- **Browse-page filter silently did nothing.** `.ws-row { display: grid }` was beating the UA `[hidden] { display: none }` rule, so `r.hidden = true` left rows visible. Added an explicit `.ws-row[hidden] { display: none }` override.
- **Row descriptions ignored `max-width`.** The markup is `<span>` (kept inline so it stays inside the wrapping `<a>`); `max-width` only applies to blocks. Set `display: block` so the constraint takes effect. Both `.cat__desc` and `.ws-row__desc` now wrap at 70ch.
- **Italic letters clipped by `background-clip:text`.** Italic glyphs slant past their inline box; the trailing letter (e.g. the "s" in "Workshops") got cut. Pad the box wider and pull the next sibling back with negative margin so visual spacing is unchanged.

## [0.10.10] - 2026-05-27

### Changed

- **Header search trigger is now an icon-only button** instead of a placeholder-style pill with `Search` label and `/` kbd hint. The pill mimicked an `<input>` but you couldn't type into it — clicking opened a modal where you typed. That's a misleading affordance; the new icon-only button is consistent with the help and theme-toggle buttons and the `/` shortcut still works (the keyboard-help dialog documents it). The 65-line `.site-search-trigger` ruleset in `components.css` is gone — search joins `.theme-toggle` / `.kbd-help-trigger` in a shared rule.
- **Header layout reordered.** Trailing controls are now `search · github · lang · theme · help`. Help moves from second-from-left to the trailing position — it's a tertiary affordance, terminal position matches the convention used by Linear / Notion / Stripe.
- **All header icon buttons (search, lang, theme, help) use brand pink (`--color-accent`) for the icon at rest**, not muted ink. Hover keeps the same icon colour and lights the border to match. The language switcher's `EN` label and chevron stay in muted ink as informational text — only the globe icon is pink, matching the other action icons.
- **Pill outlines bumped to `--color-border-strong`** (`#C7CDD8` light / `#2A3A56` dark) so the rings are visible in dark mode without being heavy in light mode. The previous `--color-border` resolved to `#1F2C44` against the dark-mode navy paper — about 1.5:1 contrast, basically invisible.

### Fixed

- **`custom-header.html` override path mismatch (also touched by the v0.10.9 rename).** The stub's comment told sites to override at `layouts/_partials/custom-header.html`, but `head.html` invoked `partial "chrome/custom-header.html"` — Hugo's lookup is exact-path, so site overrides at the documented path were silently never loaded. The v0.10.9 commit moved the stub via `git mv` but didn't update the `head.html` invocation in the same commit; this release lands the invocation update that completes the fix.

## [0.10.9] - 2026-05-27

### Fixed (incomplete — see 0.10.10)

- Theme stub moved from `layouts/_partials/chrome/custom-header.html` to `layouts/_partials/custom-header.html`. The invocation update in `head.html` was meant to ship with this rename but did not — see 0.10.10. Don't pin against this version on its own; it's a partial fix.

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
