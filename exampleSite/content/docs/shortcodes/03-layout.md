+++
title       = "Layout helpers"
description = "Tabs, terminal, kbd, files, trees, images, badges, buttons, cards."
weight      = 30
+++

{{< lead >}}
The visual building blocks for non-prose content — anything you'd want to break into columns, a labeled chip, or a visually distinct block.
{{< /lead >}}

## Tabs

A simple tab block:

{{< tabs >}}
{{< tab "macOS" >}}

```bash
brew install hugo
```

{{< /tab >}}
{{< tab "Linux" >}}

```bash
sudo apt install hugo
```

{{< /tab >}}
{{< tab "Windows" >}}

```powershell
choco install hugo-extended
```

{{< /tab >}}
{{< /tabs >}}

```markdown
{{</* tabs */>}}
{{</* tab "macOS" */>}} ... {{</* /tab */>}}
{{</* tab "Linux" */>}} ... {{</* /tab */>}}
{{</* /tabs */>}}
```

Each `tab` takes its label as the positional arg (or `title=` / `name=` / `label=`). Add `icon="<name>"` to render a theme icon before the label.

When a page has more than one `tabs` block inside nested shortcodes such as `step`, `exercise`, or `notice`, give each `tabs` block a unique `id`. Hugo can collapse shortcode position data during nested re-renders; the explicit `id` keeps each tab set in its own bucket so panes from separate steps do not merge:

```markdown
{{</* step "Run the app" */>}}
{{</* tabs id="run-app" */>}}
{{%/* tab title="Command" */%}} ... {{%/* /tab */%}}
{{%/* tab title="Output" */%}} ... {{%/* /tab */%}}
{{</* /tabs */>}}
{{</* /step */>}}

{{</* step "Send a request" */>}}
{{</* tabs id="send-request" */>}}
{{%/* tab title="Command" */%}} ... {{%/* /tab */%}}
{{%/* tab title="Output" */%}} ... {{%/* /tab */%}}
{{</* /tabs */>}}
{{</* /step */>}}
```

Use `id` for rendering identity only. Use `groupid` when you want matching tab labels to stay selected together across multiple tab sets.

### Tabs with `groupid` (synced)

When a workshop has many tab blocks for the same axis (OS, language, environment), pass a shared `groupid` and they'll stay in sync — picking "Linux" once selects it everywhere.

{{< tabs groupid="install-axis" >}}
{{< tab "macOS" >}}This pane is synced with the next one.{{< /tab >}}
{{< tab "Linux" >}}This pane is synced with the next one.{{< /tab >}}
{{< tab "Windows" >}}This pane is synced with the next one.{{< /tab >}}
{{< /tabs >}}

{{< tabs groupid="install-axis" >}}
{{< tab "macOS" >}}Switch the tab above and watch this one follow.{{< /tab >}}
{{< tab "Linux" >}}Switch the tab above and watch this one follow.{{< /tab >}}
{{< tab "Windows" >}}Switch the tab above and watch this one follow.{{< /tab >}}
{{< /tabs >}}

The selection is persisted in `localStorage` per `groupid`, so the user's choice survives across pages.

## Terminal

{{< terminal title="zsh" >}}
$ npm install
added 142 packages in 6s
$ npm run dev
> server listening on http://localhost:3000
{{< /terminal >}}

```markdown
{{</* terminal title="zsh" */>}}
$ npm install
added 142 packages in 6s
$ npm run dev
> server listening on http://localhost:3000
{{</* /terminal */>}}
```

Lines starting with `$` get a styled prompt; everything else renders as output. The blinking cursor is decorative.

## Keyboard shortcuts

Open the command palette with {{< kbd "Cmd+Shift+P" >}} on macOS, or {{< kbd "Ctrl+Shift+P" >}} on Linux/Windows. Press {{< kbd "?" >}} to view all shortcuts.

```markdown
Open the command palette with {{</* kbd "Cmd+Shift+P" */>}} on macOS.
```

Single keys, key combinations with `+`, single Unicode keys all work.

## Inline filenames

Edit {{< file "config/server.yaml" >}}, then run the migration described in {{< file "scripts/migrate.sh" >}}.

```markdown
Edit {{</* file "config/server.yaml" */>}}, then run the migration described in
{{</* file "scripts/migrate.sh" */>}}.
```

A small dot-prefixed pill that visually separates filenames from prose.

## File tree

{{< file-tree >}}
project/
├── src/
│   ├── index.ts
│   └── lib/
│       └── format.ts
├── tests/
│   └── format.test.ts
├── package.json
└── README.md
{{< /file-tree >}}

```markdown
{{</* file-tree */>}}
project/
├── src/
│   └── index.ts
├── package.json
└── README.md
{{</* /file-tree */>}}
```

Paste output from the `tree` command directly. Lines containing `/` are highlighted as directories.

## Image with caption + zoom

{{< image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80" alt="Dashboard" caption="Click any image to zoom — figures auto-number across the page." >}}

```markdown
{{</* image src="dashboard.png" alt="Dashboard" caption="Click any image to zoom." */>}}
```

`image` resolves the `src` against the page's resources first, then falls back to a relative URL. Add `align="left"` / `"right"` for floated variants (prose wraps around, capped at 40% width; unfloats on screens narrower than 720px), `align="center"` to centre an image narrower than the content column, or `align="bleed"` to extend the figure past the prose margins for a full-bleed screenshot.

Pass `width=` (e.g. `width="320px"`, `width="50%"`) to clamp the whole figure, or `height=` to clamp just the image vertically. Either dimension accepts any CSS length (`px`, `rem`, `%`, `vh`, …); with only one set, the browser preserves the image's intrinsic aspect ratio. Setting both pins the image inside a fixed box without distortion.

### `figure` alias

Hugo's built-in shortcode name is `figure`, and content from other Hugo themes often uses it. This theme aliases `figure` to the same renderer as `image` so migrated content works without rewrites:

```markdown
{{</* figure src="dashboard.png" alt="Dashboard" caption="Same render as `image`." */>}}
```

Prefer `image` for new content (it's the documented name); `figure` is the compatibility surface.

## Badges

Small inline pills for status, version markers, environment labels, and the like. Use them in workshop-meta rows, alongside titles, or as terse "this only applies to X" annotations.

### Color presets

The theme ships six tonal presets that map onto the same palette as the callouts:

{{< badge >}}default{{< /badge >}} {{< badge color="accent" >}}NEW{{< /badge >}} {{< badge color="info" >}}stable{{< /badge >}} {{< badge color="success" >}}passing{{< /badge >}} {{< badge color="warn" >}}deprecated{{< /badge >}} {{< badge color="danger" >}}breaking{{< /badge >}}

```markdown
{{</* badge */>}}default{{</* /badge */>}}
{{</* badge color="accent" */>}}NEW{{</* /badge */>}}
{{</* badge color="info" */>}}stable{{</* /badge */>}}
{{</* badge color="success" */>}}passing{{</* /badge */>}}
{{</* badge color="warn" */>}}deprecated{{</* /badge */>}}
{{</* badge color="danger" */>}}breaking{{</* /badge */>}}
```

### Custom hex / CSS colors

Pass any CSS color (hex, `rgb()`, named) to break out of the presets:

{{< badge color="#7c3aed" >}}custom hex{{< /badge >}} {{< badge color="#0891b2" >}}cyan-700{{< /badge >}} {{< badge color="rebeccapurple" >}}rebecca{{< /badge >}}

```markdown
{{</* badge color="#7c3aed" */>}}custom hex{{</* /badge */>}}
```

The CSS recipe used internally is `color-mix(in oklab, <yourColor> 40%, transparent)` for the border, `10%` for the background, plus the full color for the text — so any color you pass produces a balanced tonal pill without you having to specify each surface.

### With a leading title pill

The `title` attribute renders a small label to the LEFT of the content, separated by a hairline. Useful for `key: value`-style metadata:

{{< badge color="accent" title="version" >}}9.2.1{{< /badge >}} {{< badge color="info" title="status" >}}active{{< /badge >}} {{< badge color="success" title="ci" >}}passing{{< /badge >}} {{< badge title="env" color="warn" >}}staging{{< /badge >}}

```markdown
{{</* badge color="accent" title="version" */>}}9.2.1{{</* /badge */>}}
{{</* badge color="info" title="status" */>}}active{{</* /badge */>}}
```

### With an icon

Prefix the label with an icon from the bundled icon set (see [Icons](#icons) below):

{{< badge color="accent" icon="rocket" >}}fast{{< /badge >}} {{< badge color="info" icon="shield" >}}secure{{< /badge >}} {{< badge color="success" icon="check" >}}verified{{< /badge >}} {{< badge color="warn" icon="warning" >}}heads-up{{< /badge >}}

```markdown
{{</* badge color="accent" icon="rocket" */>}}fast{{</* /badge */>}}
{{</* badge color="info" icon="shield" */>}}secure{{</* /badge */>}}
```

### Combined: title + icon + content

All three modifiers compose:

{{< badge color="accent" title="API" icon="check" >}}stable{{< /badge >}} {{< badge color="info" title="docs" icon="book" >}}up to date{{< /badge >}}

```markdown
{{</* badge color="accent" title="API" icon="check" */>}}stable{{</* /badge */>}}
```

### Badge parameters

| Param | Default | Notes |
| --- | --- | --- |
| (inner content) | — | The visible label. Markdown allowed (e.g. `` `code` ``, **bold**, links). |
| `color` | — | Either a preset name (`accent`, `info`, `success`, `warn`, `danger`, `primary`, `secondary`) or any CSS color value. |
| `style` | — | Alias of `color` (relearn-compatibility). |
| `title` | — | Optional label rendered to the left of the content, separated by a hairline. |
| `icon` | — | Optional icon name from the bundled set, rendered to the left of the title (or content if no title). |

### When to reach for a badge

| Need | Example |
| --- | --- |
| Mark a feature as new / experimental | {{< badge color="accent" >}}BETA{{< /badge >}} next to a section heading |
| Show a version requirement | {{< badge color="info" title="requires" >}}≥ 1.2.0{{< /badge >}} |
| Flag a deprecated path | {{< badge color="warn" >}}deprecated{{< /badge >}} inline in prose |
| Status of a build / test / pipeline | {{< badge color="success" icon="check" >}}passing{{< /badge >}} |
| Environment annotation | {{< badge title="env" color="warn" >}}staging{{< /badge >}} |

### What badges aren't

- **Not a callout.** If you need a paragraph of "be careful" guidance, use `tip` / `warning` / `notice`.
- **Not a button.** Badges aren't interactive. Use `button` if it's clickable.
- **Not for long text.** Keep them under 4 words. Long text in a badge defeats the visual hierarchy.

## Buttons

The theme ships **two** button shortcodes for two distinct jobs. Pick the right one:

| Shortcode | Visual | Use for |
| --- | --- | --- |
| `{{</* button */>}}` | Small inline pill, configurable colour | Inline page content, prose, multi-button rows. [Relearn-compatible](https://mcshelby.github.io/hugo-theme-relearn/shortcodes/button/index.html). |
| `{{</* cta */>}}` | Big gradient Splunk-branded pill with shadow | Hero / landing / end-of-workshop primary actions. One per section. |

### `button` — inline (relearn-compatible)

Small linkable pill. Drop-in replacement for the [relearn `button`](https://mcshelby.github.io/hugo-theme-relearn/shortcodes/button/index.html) — same param names, same semantic style presets, same colour aliases. The default is a neutral white/clear pill; opt into a coloured fill via `style="primary"` (Splunk magenta) or any semantic preset.

{{< button href="#" icon="book-open" >}}Read the docs{{< /button >}} {{< button href="#" icon="rocket" style="primary" >}}Get started{{< /button >}} {{< button href="#" icon="github" style="secondary" target="_blank" >}}View on GitHub{{< /button >}} {{< button href="#" icon="download" style="transparent" >}}Download{{< /button >}}

```markdown
{{</* button href="#" icon="book-open" */>}}Read the docs{{</* /button */>}}
{{</* button href="#" icon="rocket" style="primary" */>}}Get started{{</* /button */>}}
{{</* button href="#" icon="github" style="secondary" target="_blank" */>}}View on GitHub{{</* /button */>}}
{{</* button href="#" icon="download" style="transparent" */>}}Download{{</* /button */>}}
```

#### Button parameters

| Param | Default | Notes |
| --- | --- | --- |
| `href` | — | Target URL. If omitted, renders as a `<button type="button">` (no link). |
| `style` | `default` | Semantic preset OR any CSS colour. See table below. |
| `color` | — | Explicit CSS colour. Wins over `style` colour. Any CSS colour (`#hex`, `rgb()`, named). |
| `icon` | — | Icon name from the bundled set. Renders to the left of the label by default. |
| `iconposition` | `left` | `left` or `right`. |
| `target` | — | `_blank` to open in a new tab; auto-adds `rel="noopener"`. |
| `title` | — | Fallback label if the inner text is empty. |

#### Style presets

| `style=` | Result |
| --- | --- |
| `default` (default) | Neutral white/clear surface with a subtle border. |
| `primary` | Filled accent fill (Splunk magenta). |
| `secondary` | Outlined — accent border + label, transparent fill. |
| `transparent` | Text-only — no border or background. |
| `success` `warning` `error` `info` `note` `tip` | Semantic colour fills. |
| `blue` `green` `orange` `yellow` `red` `gray` | [Relearn colour aliases](https://mcshelby.github.io/hugo-theme-relearn/shortcodes/button/index.html). |
| Any CSS colour | Used as the fill (`style="purple"`, `style="#7f00ff"`). |

#### Variations

Outline + icon-right (good for "continue" affordances):

{{< button href="#" icon="arrow-right" iconposition="right" style="secondary" >}}Continue{{< /button >}}

Coloured presets:

{{< button href="#" style="success" icon="check" >}}Success{{< /button >}} {{< button href="#" style="warning" icon="alert-triangle" >}}Warning{{< /button >}} {{< button href="#" style="error" icon="x" >}}Error{{< /button >}}

Custom colour:

{{< button href="#" color="#7f00ff" icon="sparkles" >}}Custom{{< /button >}}

### `cta` — the big Splunk pill

A bold gradient call-to-action pill (extra padding, shadow, arrow). Use sparingly — one primary `cta` per page section, on landing or end-of-workshop pages. For inline page content, reach for `button` instead.

{{< cta href="#" icon="rocket" >}}Start the workshop{{< /cta >}}

```markdown
{{</* cta href="#" icon="rocket" */>}}Start the workshop{{</* /cta */>}}
```

#### CTA parameters

| Param | Default | Notes |
| --- | --- | --- |
| `href` | — | Target URL. If omitted, renders as a `<button type="button">`. |
| `style` | `primary` | `primary` (gradient fill) or `secondary` / `ghost` / `transparent` (outline). |
| `icon` | — | Icon name. If omitted, the pill emits a `→` arrow at the end. |
| `iconposition` | `left` | `left` or `right`. |
| `target` | — | `_blank` to open in a new tab; auto-adds `rel="noopener"`. |
| `title` | — | Fallback label if the inner text is empty. |

## Icons

The theme ships a curated set of ~40 inline SVG icons sourced from [Lucide](https://lucide.dev/). They're rendered via the `icon` shortcode or referenced by name from `button`, `card`, `badge`, and `tab`.

### Inline use

Icons inherit `currentColor` so they pick up the surrounding text color:

{{< icon "shield" >}} security · {{< icon "rocket" >}} performance · {{< icon "users" >}} community · {{< icon "lightbulb" >}} ideas

```markdown
{{</* icon "shield" */>}} security · {{</* icon "rocket" */>}} performance
```

### Custom color

Pass an explicit CSS color to override:

{{< icon icon="heart" color="#FF007F" >}} brand-pink heart · {{< icon icon="star" color="#FFAB0F" >}} amber star · {{< icon icon="check" color="#2f7c47" >}} green check

```markdown
{{</* icon icon="heart" color="#FF007F" */>}}
```

Note that the `icon` shortcode takes either a single positional arg (`{{</* icon "name" */>}}`) **or** named args (`{{</* icon icon="name" color="..." */>}}`) — Hugo doesn't allow mixing positional and named on the same call.

### The icon set

The bundled set covers the cases you'll most often hit in workshop content:

- **Status:** `check`, `x`, `info`, `warning`, `alert`, `tip`, `note`, `lightbulb`
- **Action:** `download`, `upload`, `external`, `link`, `play`, `edit`, `trash`, `copy`, `search`
- **Navigation:** `home`, `menu`, `chevron-left`, `chevron-right`, `chevron-up`, `chevron-down`, `arrow-left`, `arrow-right`, `plus`, `minus`
- **Content:** `book`, `code`, `terminal`, `file`, `folder`
- **People:** `user`, `users`
- **Time:** `clock`, `calendar`
- **Settings:** `settings`, `shield`
- **Other:** `star`, `heart`, `rocket`
- **Brands:** `github`, `twitter` (alias `x`), `linkedin`, `youtube`, `mastodon`, `bluesky`, `rss`

Common Font Awesome aliases are accepted too: `fas-check`, `fa-circle-info`, `external-link`, etc.

### Adding your own icons

To register a new icon, edit [`layouts/_partials/icon-svg.html`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/layouts/_partials/icon-svg.html) (override it in your own site to keep your changes outside the theme). Drop a new entry into the `$icons` dict — paste the SVG path data only, without the `<svg>` wrapper:

```go-html-template
"my-icon" `<path d="M3 12h18M12 3l9 9-9 9" stroke-linecap="round"/>`
```

The wrapper auto-applies `viewBox="0 0 24 24"`, `stroke="currentColor"`, and 2px stroke. So your SVG path data should be designed for a 24×24 grid with no inline color.

{{< notice tip "Source for new icons" >}}
[Lucide](https://lucide.dev/) and [Phosphor](https://phosphoricons.com/) both ship 24×24 SVGs with consistent stroke widths that drop straight in. Copy the path data, paste into the dict, restart `hugo server`.
{{< /notice >}}

## Cards

A grid of cards via the `cards` container:

{{< cards >}}
{{< card title="Install" href="/docs/getting-started/01-install/" icon="download" >}}
Set up the theme on your platform of choice.
{{< /card >}}
{{< card title="Customize" href="/docs/customizing/" icon="settings" >}}
Rebrand colors, fonts, and logo.
{{< /card >}}
{{< card title="Shortcodes" href="/docs/shortcodes/" icon="code" >}}
Live reference for every shortcode.
{{< /card >}}
{{< /cards >}}

```markdown
{{</* cards */>}}
{{</* card title="Install" href="/install/" icon="download" */>}}
Set up the theme...
{{</* /card */>}}
{{</* card title="Customize" href="/customize/" icon="settings" */>}}
Rebrand colors, fonts, and logo.
{{</* /card */>}}
{{</* /cards */>}}
```

A standalone `card` outside a `cards` container renders as a single full-width content card.

### Card images

Three ways to attach a banner image to a card, in order of preference:

**1. Auto-pull from the linked page (recommended).** When a `card` has an `href` pointing at a Hugo page, the shortcode looks up that page's front matter and pulls `images[0]` automatically. The image file lives in the linked page's bundle (page-bundle resource):

```toml
# content/resources/_index.md
+++
title  = "Resources"
images = ["images/featured-resources.png"]
+++
```

```markdown
{{</* cards */>}}
{{</* card title="Resources" href="/resources/" icon="book" */>}}
Reference docs, community links, deeper reading.
{{</* /card */>}}
{{</* /cards */>}}
```

No `image=` arg needed on the card itself. The auto-resolution does a 3-step lookup against the linked page's bundle (raw path → `images/<basename>` → bare basename), so most directory shapes work. The card renders without an image if the linked page has no `images` front matter, no matching bundle resource, or is an external URL — graceful no-op.

`images` lives at the **top level** of front matter, not under `[params]`. Hugo treats it as a special key that doubles as the OpenGraph / Twitter-card image source — so you get social-share images as a side effect.

**2. Explicit absolute path.** If the image lives in `static/` or you want to override the auto-pull:

```markdown
{{</* card title="Resources" href="/resources/" icon="book" image="/images/featured-resources.png" */>}}
```

Explicit `image=` always wins over the auto-pull. Path is piped through `relURL` so baseURL subpaths (GitHub Pages) work.

**3. Featured image via `children type="card" image="true"`.** Auto-discovered for **every** card in a `children` listing, same `images` front-matter contract. The auto-discovery semantics are identical; the difference is `children` lists every visible sub-page automatically, while hand-written `cards` + `card` blocks let you curate which pages appear and in what order.

### Hero icons — featured visual via Lucide

When you don't want a raster image but still want a visual anchor at the top of a card, pass `hero-icon="<lucide-name>"`. The icon renders large in the card's featured-image slot, stroked with the brand pink→orange gradient:

{{< cards >}}
{{< card title="Resources" href="/docs/" hero-icon="book-text" >}}
Reference docs, community links, deeper reading.
{{< /card >}}
{{< card title="Customize" href="/docs/customizing/" hero-icon="settings" >}}
Rebrand colors, fonts, and logo.
{{< /card >}}
{{< card title="Get started" href="/docs/getting-started/" hero-icon="rocket" >}}
Spin up the theme in five minutes.
{{< /card >}}
{{< /cards >}}

```markdown
{{</* card title="Resources" href="/docs/" hero-icon="book-text" */>}}
Reference docs, community links, deeper reading.
{{</* /card */>}}
```

The gradient is locked to the theme's `--color-accent` → `--color-accent-2` variables, so sites that rebrand those tokens in `hugo.toml` automatically get their own gradient — no fork needed.

**Precedence:** if both `image=` and `hero-icon=` are set on the same card, `image=` wins (the explicit raster beats the derived visual).

**Inline icon suppression:** the `icon=` arg renders a small glyph next to the title. When `hero-icon=` is also set, the inline `icon=` is **automatically suppressed** — one identity signal per card. Use `hero-icon=` OR `icon=`, not both; the hero is the right call for landing-card visuals.

**Auto-grid equivalent.** The auto card-grid (sections with `home_sections` or `subsections = true`) reads the same Lucide name from each child page's `icon` front-matter key and renders the same hero treatment without any per-card markup:

```toml
# content/resources/_index.md
+++
title = "Resources"
icon  = "book-text"
+++
```

Sections without an `icon` key render the existing text-only card layout — no regression.

### Opt-in meta row — `show-time` / `show-pages`

Manual `{{</* card */>}}`s render title + body by default. Pass either flag to add a hairline-separated meta row pulled from the linked Hugo page (same mono-uppercase + magenta-bullet styling as the auto-grid cards):

```markdown
{{</* card title="Scenarios" href="/scenarios/" hero-icon="rocket" show-time=true show-pages=true */>}}
Guided workshops...
{{</* /card */>}}
```

| Flag | Pulls from |
| --- | --- |
| `show-time=true` | `time` / `duration` front matter, falling back to Hugo's auto-estimated `ReadingTime`. |
| `show-pages=true` | Child-page count via the `workshop/children-count` partial. Hidden if ≤1. |

Both flags **no-op silently on external `href`** values where the target isn't a Hugo page. Safe to leave on for any card.

### Categorized card grids

When a section has too many children for one flat grid to scan, group them. The `cards-by-category` shortcode renders one grid per named category, defined in the section's own `_index.md` front matter.

```toml
# content/ninja-workshops/_index.md
+++
title       = "Ninja Workshops"
description = "Deep-dive workshops grouped by topic."

[[params.categories]]
  slug        = "foundations"
  title       = "Foundations"
  description = "Baseline workflows and concepts."

[[params.categories]]
  slug  = "instrumentation"
  title = "OpenTelemetry & Instrumentation"

[[params.categories]]
  slug  = "advanced"
  title = "Advanced"
+++

{{< cards-by-category >}}
```

Each child page declares which bucket it belongs to via its own `categories` front-matter array:

```toml
# content/ninja-workshops/12-pipeline-management/_index.md
+++
title      = "Pipeline Management"
categories = ["advanced", "instrumentation"]
+++
```

Pages can belong to multiple categories (they appear once per category). Pages with no `categories` value drop into a final **Other** group that only renders when non-empty — surfaces gaps in your taxonomy instead of silently hiding pages.

Card markup is shared with the section's `cards-auto-grid` fallback (same time / difficulty / page-count meta), so a section can switch between flat and categorized renderings without the cards looking different. Numbering (`01`, `02`, …) restarts inside each category.

Like the auto-grid, dropping `cards-by-category` in a section's body suppresses the layout's automatic card-grid fallback so the same children don't render twice.

### Suppressing the time pill on a card grid

Both `{{</* children type="card" */>}}` and `{{</* cards-by-category */>}}` accept a `notime="true"` arg that drops the time pill from every card in that listing. Useful for grids of reference pages or short topics where the auto-estimated reading time adds noise without information:

```markdown
{{</* children type="card" notime="true" */>}}
{{</* cards-by-category notime="true" */>}}
```

Other meta items (difficulty, "N pages" count) keep rendering. Scope is per-shortcode-invocation — drop the arg and a sibling card grid on the same page still shows times.

### Progress tracking — the completion tick

Cards that link to a section grow a small magenta tick in their bottom-right corner once the reader has visited every page underneath. Works on all three card-rendering paths — the auto card-grid, `{{</* card */>}}`, and `{{</* children type="card" */>}}` — without any per-card opt-in. The same data drives the sidebar's chapter roll-up indicators, so the two are always in agreement.

**How completion is measured.** Two cases:

- **Multi-page workshop section** — the workshop sidebar's link count is the threshold. As the reader dwells on each page for ≥ 2 seconds, the URL goes into a per-workshop visited list. Once `visited.length >= totalSidebarLinks`, the parent card's tick lights up on next render.
- **Single-page section** (an `_index.md` with no children) — there's no workshop sidebar to count from, so a universal page-dwell tracker handles it: a single 2-second dwell on the page marks the parent card complete. Hugo emits `data-section-pages="1"` on these cards so the JS knows to use the leaf-completion path.

**State lives in localStorage** under three keys, scoped per origin:

| Key | Shape | Written by |
| --- | --- | --- |
| `splunk-workshop:visited` | `{ <workshopRoot>: [<url>, …] }` | Workshop sidebar dwell-tracker |
| `splunk-workshop:totals` | `{ <workshopRoot>: <count> }` | Workshop sidebar (link count at visit time) |
| `splunk-workshop:pages` | `[<url>, …]` | Universal page-dwell tracker (every page) |

Totals are refreshed on every visit, so adding or removing pages from a workshop automatically updates the completion threshold the next time the reader opens any page in it.

**Resetting progress for dev / testing / a clean demo.**

Open DevTools (`Cmd+Opt+I` / `Ctrl+Shift+I`) → Console. To wipe all three buckets and reload:

```js
["visited", "totals", "pages"].forEach(k => localStorage.removeItem("splunk-workshop:" + k));
location.reload();
```

To reset just one bucket — for example, only the universal-pages set used by leaf cards:

```js
localStorage.removeItem("splunk-workshop:pages"); location.reload();
```

Or via the UI: DevTools → Application tab → Storage → Local Storage → your origin → delete the three `splunk-workshop:*` rows → refresh.

Inspect current state any time with:

```js
console.table({
  visited: JSON.parse(localStorage.getItem("splunk-workshop:visited") || "{}"),
  totals:  JSON.parse(localStorage.getItem("splunk-workshop:totals")  || "{}"),
  pages:   JSON.parse(localStorage.getItem("splunk-workshop:pages")   || "[]"),
});
```

The 2-second dwell timer cancels on `pagehide` and `visibilitychange`, so quick clicks don't pollute state — you have to actually stay on a page to mark it visited.

**Accessibility.** Completed cards get a visually-hidden "Completed" label inside the tick badge so assistive tech announces the state. The SVG itself stays `aria-hidden`; the wrapper does not.

## Indicators

Two inline-pill shortcodes for surfacing workshop metadata anywhere in the body. They render as `<span class="indicator">` so they sit cleanly mid-prose.

{{< time "20 min" >}} &nbsp; {{< difficulty 3 >}}

```markdown
{{</* time "20 min" */>}} &nbsp; {{</* difficulty 3 */>}}
```

### `time`

Clock icon + free-form duration label. Takes a single positional argument — any string.

```markdown
{{</* time "20 min" */>}}
{{</* time "1 hour" */>}}
{{</* time "About a coffee" */>}}
```

### `difficulty`

Five-dot meter + labelled difficulty band. Takes either a positional integer or a `level=` named arg, range 1–5:

| Value | Label |
| --- | --- |
| 1 | Beginner |
| 2 | Easy |
| 3 | Intermediate |
| 4 | Advanced |
| 5 | Expert |

```markdown
{{</* difficulty 3 */>}}
{{</* difficulty level=4 */>}}
```

Out-of-range values cap to 1 or 5; missing values default to 1 (Beginner). The dot meter is `aria-label`-described for screen readers.

### When to reach for indicators vs front matter

If the value is **about the whole page** (the workshop's total duration / overall difficulty), put it in front matter — the workshop-meta partial renders it in the page header automatically. Use the shortcodes mid-prose only when the indicator describes a *section* of the page (a single exercise's duration, a per-step difficulty), not the page as a whole.
