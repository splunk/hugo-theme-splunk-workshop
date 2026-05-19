+++
title       = "Utilities & extras"
description = "Smaller shortcodes for embedding files, listing children, pulling site params, social links, and inline color."
weight      = 60
+++

{{< lead >}}
Ten smaller shortcodes that don't fit the other categories — file lists, page-tree helpers, templating utilities, and a couple of Splunk-specific embellishments.
{{< /lead >}}

## File downloads

### `attachments`

Lists every non-content file in a page bundle as a downloadable link. Useful for workshop slide decks, sample data, or starter zips that ship alongside the markdown.

```markdown
{{</* attachments */>}}
```

Place a page bundle at `content/workshops/intro/index.md` and drop `lab-data.csv`, `slides.pdf` next to it. The shortcode renders one `<a download>` per file.

Args:

- `pattern` — glob to filter (default: everything that isn't a markdown page)
- `title` — section heading (default: "Attachments")

### `resources`

Like `attachments`, but lets you pass an explicit Hugo resource type / pattern. Useful when a page has both inline images (referenced from prose) and downloadable resources that you want to list separately.

```markdown
{{</* resources pattern="*.pdf" */>}}
{{</* resources pattern="*.zip" title="Starter projects" */>}}
```

## Page-tree helpers

### `children`

Renders the immediate children of the current section as a card list. Drop it in a chapter `_index.md` and Hugo fills in the rest:

```markdown
{{</* children */>}}
```

Args:

- `style` — `cards` (default), `list`, or `h2` (rendered as h2 + description for each child)
- `description` — `true` to include each child's `description` front matter (default `true`)
- `depth` — recurse N levels deep (default `1`)
- `sort` — `weight` (default), `title`, `date`

Pairs nicely with the `weight` front-matter key for explicit ordering.

### `divider`

A horizontal divider with a centered gradient dot. Section break for long pages where the standard `<hr>` feels too quiet.

```markdown
{{</* divider */>}}
```

No args. Pure decoration; doesn't affect document outline.

### `pager`

Override the bottom prev/next pager's destinations on this page. The default pager walks the page tree via DFS; this shortcode lets a branching page (decision point, alternate path, "go elsewhere from here") send the reader to a different next step than the linear order suggests.

Place the shortcode anywhere in the markdown body — the pager always renders at the bottom of the page, only the values change.

```markdown
{{</* pager next="/docs/advanced/" nextLabel="Jump straight to the advanced track" */>}}
```

Args (every one optional; supply only the side(s) you want to override):

- `prev` — URL for the Previous button (relative `/path/` or absolute `https://...`).
- `prevLabel` — Label for Previous. If omitted and `prev` resolves to a local page, that page's `linkTitle` is used.
- `next` — same shape as `prev`.
- `nextLabel` — same shape as `prevLabel`.

Sides you don't override remain auto-computed by DFS. So overriding only `next` keeps Previous pointing at the natural prior page; overriding both replaces the whole pager.

Honored after `nopager: true` — a page with `nopager: true` in front matter still renders no pager even if this shortcode is present.

Typical branching pattern:

```markdown
+++
title = "Pick your install method"
+++

Choose the path that matches your environment, then continue.

- **Splunk Cloud** — managed, no agents to install.
- **Splunk Enterprise** — self-hosted, full control of the cluster.

{{</* pager next="/workshops/cloud-track/01-prerequisites/" nextLabel="Continue with Splunk Cloud" */>}}
```

For a "two-way branch" page, render two `card` shortcodes inline (one per path) and use `pager` to pick a default Next — most readers click a card, the rest fall through to the pager destination.

## Templating helpers

### `include`

Inline another file's content as if it were part of the current page. The included file is rendered through Hugo's markdown pipeline, so shortcodes work in the included file too.

```markdown
{{</* include "shared/prerequisites.md" */>}}
```

The path is relative to the project root. Hugo errors if the file is missing.

Use cases:

- Shared boilerplate across multiple workshops (e.g. a single "what you need installed" block)
- DRY-ing up sample code snippets

### `relref`

Hugo's built-in `relref` lookup, exposed as a shortcode for inline contexts where the native one doesn't fit cleanly. Returns the resolved URL.

```markdown
See [the install guide]({{</* relref "/docs/getting-started/01-install" */>}}).
```

If the page can't be resolved, the build fails loudly — so typos surface early.

### `siteparam`

Reads a value from `[params]` in your `hugo.toml`. Useful when you want a single source of truth for things like a product version, a CDN host, or a phone number.

```markdown
The current version is **{{</* siteparam name="productVersion" */>}}**.
```

Args:

- `name` (positional) — the param to read
- `default` — fallback if the param is unset

### `tree`

A file-tree renderer with two modes:

**Body mode** (preferred for workshops) — paste the ASCII art you'd get from `tree` or hand-author it, and the shortcode just typesets it as a styled block with directory lines highlighted:

```markdown
{{</* tree */>}}
my-project/
├── README.md
├── data/
│   ├── access.log
│   └── tutorial.csv
└── src/
    └── main.go
{{</* /tree */>}}
```

**Resource mode** — pass a `pattern` regex and the shortcode walks the page bundle's resources:

```markdown
{{</* tree pattern=".*\.csv$" */>}}
```

The `{{</* file-tree */>}}` shortcode covered above is the body-mode-only variant. Reach for `tree` when you want either mode in one call, or when migrating from relearn (which only ships the resource mode under this name).

## Splunk-specific

### `otel-version`

Renders the latest OpenTelemetry Collector version, pulled from a value the site author sets in `[params.splunk]`. Keeps version-pinned text from going stale silently between collector releases — change one param, every workshop page that uses the shortcode updates.

```markdown
Install OTel Collector {{</* otel-version */>}}.
```

The shortcode reads `Site.Params.splunk.otelVersion`. Set it once in `hugo.toml`:

```toml
[params.splunk]
otelVersion = "0.110.0"
```

### `linkedin`

Emits a deep link to LinkedIn's "Add a certification" form, pre-filled with the workshop name, the issuing organisation (Splunk by default), and the current issue date. Workshop attendees click it on the completion page to add the cert to their profile in two taps.

```markdown
{{</* linkedin */>}}
{{</* linkedin name="Splunk OpenTelemetry Fundamentals" certUrl="https://example.com/certs/otel-fundamentals.png" */>}}
{{</* linkedin text="Add to LinkedIn" color="#0a66c2" */>}}
```

| Param | Default | Notes |
| --- | --- | --- |
| `name` | `Site.Params.linkedinCertName` → `"Splunk Workshop"` | Certification name shown on the user's profile. |
| `organizationId` | `Site.Params.linkedinOrgId` → `"20226"` | LinkedIn company ID. `20226` is Splunk; change it for non-Splunk workshops. |
| `certUrl` | `Site.Params.linkedinCertUrl` → `""` | Public URL of the certificate image (PNG/JPG). Optional but recommended. |
| `text` | `"LinkedIn"` | Visible link label. |
| `color` | `"#ffffff"` | CSS colour for the link text — default white so it sits cleanly inside a dark CTA. Pass `"#0a66c2"` for stand-alone LinkedIn-brand links. |

Issue date is auto-set to the current month/year, so the cert always reflects when the attendee actually completed the workshop. Set the defaults once in `hugo.toml`:

```toml
[params]
  linkedinCertName = "Splunk OpenTelemetry Fundamentals"
  linkedinOrgId    = "20226"
  linkedinCertUrl  = "https://your-cdn.example.com/certs/otel-fundamentals.png"
```

Most pages can then call `{{</* linkedin */>}}` with no arguments and pick up the workshop-wide defaults.

## Inline styling

### `textcolor`

Wraps inline text in a span with a custom color. Use sparingly — most emphasis should come from `<strong>`, `<em>`, or callouts. Reach for `textcolor` when you specifically need a hue (e.g. matching a screenshot's UI element).

```markdown
The {{</* textcolor color="#FF007F" */>}}magenta{{</* /textcolor */>}} chart shows a regression.
```

Args:

- `color` — any CSS color (hex, rgb, named)
- positional 0 — alias of `color`

Accepts markdown in the body, so you can combine: `{{</* textcolor "#FF007F" */>}}**critical**{{</* /textcolor */>}}`.

## Typography

### `lead`

A larger, italic intro paragraph for the top of a page. Drop it directly under the page H1 — it bridges the title and the rest of the prose, the way the eyebrow + lead pair works on landing pages.

```markdown
+++
title = "Layout helpers"
+++

{{</* lead */>}}
The visual building blocks for non-prose content — anything you'd want to
break into columns, a labeled chip, or a visually distinct block.
{{</* /lead */>}}

## First real section
…
```

Renders the inner content as a `<p class="shortcode-lead">` with display typography, lighter weight, and a max-width that constrains the line length. Accepts markdown in the body (so inline links, bold, code spans all work).

Used at the top of every page in this docs section — open any source file under `/docs/shortcodes/` for live examples.

No args; just opens and closes around the body text. One per page is the convention.
