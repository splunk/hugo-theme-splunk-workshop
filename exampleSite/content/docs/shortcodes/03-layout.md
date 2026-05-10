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

Lines starting with `$ ` get a styled prompt; everything else renders as output. The blinking cursor is decorative.

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

`image` resolves the `src` against the page's resources first, then falls back to a relative URL. Add `align="left"` / `"right"` / `"bleed"` for floated or full-bleed variants.

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

A linkable call-to-action pill with optional icon, color override, and target. Use it sparingly — typically one primary button per page section.

{{< button href="#" icon="rocket" style="primary" >}}Get started{{< /button >}}
{{< button href="https://github.com" icon="github" style="secondary" target="_blank" >}}View on GitHub{{< /button >}}
{{< button href="#" icon="download" >}}Download{{< /button >}}

```markdown
{{</* button href="#" icon="rocket" style="primary" */>}}Get started{{</* /button */>}}
{{</* button href="https://github.com" icon="github" style="secondary" target="_blank" */>}}View on GitHub{{</* /button */>}}
{{</* button href="#" icon="download" */>}}Download{{</* /button */>}}
```

### Button parameters

| Param | Default | Notes |
| --- | --- | --- |
| `href` | — | Target URL. If omitted, renders as a `<button type="button">` (no link). |
| `style` | `primary` | `primary` (gradient fill) or `secondary` (outline). `transparent` aliases to `secondary`. |
| `icon` | — | Name from the bundled icon set (see below). Renders to the left of the label by default. |
| `iconposition` | `left` | `left` or `right` — which side the icon sits on. |
| `target` | — | `_blank` to open in a new tab; auto-adds `rel="noopener"`. |
| `color` | — | Override the accent for this one button. Any CSS color (`#hex`, `rgb()`, named). |
| `title` | — | Optional fallback label if the inner text is empty. |

### Variations

A secondary (outline) button without an icon:

{{< button href="#" style="secondary" >}}Read the docs{{< /button >}}

Icon on the right (good for "next" / "continue" affordances):

{{< button href="#" icon="arrow-right" iconposition="right" >}}Continue{{< /button >}}

Open in a new tab (auto-adds `rel="noopener"`):

{{< button href="https://github.com/splunk" target="_blank" icon="external" iconposition="right" style="secondary" >}}Splunk on GitHub{{< /button >}}

```markdown
{{</* button href="https://github.com/splunk" target="_blank" icon="external" iconposition="right" style="secondary" */>}}Splunk on GitHub{{</* /button */>}}
```

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

To register a new icon, edit [`layouts/partials/icon-svg.html`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/layouts/partials/icon-svg.html) (override it in your own site to keep your changes outside the theme). Drop a new entry into the `$icons` dict — paste the SVG path data only, without the `<svg>` wrapper:

```go-html-template
"my-icon" `<path d="M3 12h18M12 3l9 9-9 9" stroke-linecap="round"/>`
```

The wrapper auto-applies `viewBox="0 0 24 24"`, `stroke="currentColor"`, and 2px stroke. So your SVG path data should be designed for a 24×24 grid with no inline color.

{{< tip "Source for new icons" >}}
[Lucide](https://lucide.dev/) and [Phosphor](https://phosphoricons.com/) both ship 24×24 SVGs with consistent stroke widths that drop straight in. Copy the path data, paste into the dict, restart `hugo server`.
{{< /tip >}}

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

## Indicators

{{< time "20 min" >}} &nbsp; {{< difficulty 3 >}}

```markdown
{{</* time "20 min" */>}} &nbsp; {{</* difficulty 3 */>}}
```

Useful in workshop meta rows or as inline annotations. `difficulty` accepts 1–5.
