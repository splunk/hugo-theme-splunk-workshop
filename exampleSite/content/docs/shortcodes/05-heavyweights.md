+++
title       = "Math, diagrams, video, presenter"
description = "Heavyweight shortcodes that load external libraries — only on pages that use them."
weight      = 50
+++

{{< lead >}}
Math, diagrams, and video are expensive — KaTeX is ~150KB, Mermaid is ~700KB. The theme lazy-loads each one only when a page actually uses it, via `Page.Store` flags read in the footer.
{{< /lead >}}

## Math (KaTeX)

{{< math >}}
e^{i\pi} + 1 = 0
{{< /math >}}

{{< math >}}
\text{p95} = \inf\{x : F(x) \geq 0.95\}
{{< /math >}}

```markdown
{{</* math */>}}
e^{i\pi} + 1 = 0
{{</* /math */>}}
```

The shortcode wraps your LaTeX in `$$ … $$` (display mode) and flags the page so KaTeX is loaded from CDN in the footer. Pages without a `math` shortcode pay zero cost.

By default the block is centered; pass `align="left"` (or `right`) to change it:

```markdown
{{</* math align="left" */>}}
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
{{</* /math */>}}
```

For inline math, use raw `$ … $` (KaTeX's `auto-render` extension picks both up):

```markdown
The complexity is $O(n \log n)$ — see the proof below.
```

The CDN URL is pinned in `layouts/_partials/chrome/footer.html` with an SRI hash. Bump the version there when KaTeX releases an update.

## Diagrams (Mermaid)

{{< mermaid >}}
graph LR
  A[Forwarder] --> B[Indexer]
  B --> C[Search Head]
  C --> D[Dashboard]
{{< /mermaid >}}

Three equivalent ways to author a diagram:

```markdown
{{</* mermaid */>}}
graph LR
  A[Forwarder] --> B[Indexer]
{{</* /mermaid */>}}
```

```markdown
{{%/* mermaid */%}}
graph LR
  A[Forwarder] --> B[Indexer]
{{%/* /mermaid */%}}
```

````markdown
```mermaid
graph LR
  A[Forwarder] --> B[Indexer]
```
````

The angle-bracket shortcode (`{{</* mermaid */>}}`) is the most predictable form — Hugo passes `.Inner` through untouched. The percent form (`{{%/* mermaid */%}}`) lets the inner block participate in markdown so it survives being nested inside other percent-form shortcodes (e.g. `{{%/* notice */%}}`); the theme strips the blank lines Goldmark would otherwise treat as HTML-block terminators. The fenced `​```mermaid` block is registered through the theme's code-block render hook — convenient if your editor highlights mermaid in fenced blocks and you prefer to avoid shortcode syntax altogether.

Mermaid auto-rerenders when you toggle light/dark mode — a `MutationObserver` on `data-theme` triggers a re-init. Same lazy-load pattern: only pages using one of the three forms pull the module.

### Icons inside diagrams

Labels can reference any icon in [`data/icons.toml`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/data/icons.toml) using a `lucide:NAME` token. The theme substitutes the token with inline SVG before mermaid renders, so the diagram ships with vector icons without any external font load.

{{< mermaid >}}
graph LR
  A["lucide:download Collector"] --> B["lucide:cpu Processor"]
  B --> C["lucide:upload Backend"]
{{< /mermaid >}}

```markdown
{{</* mermaid */>}}
graph LR
  A["lucide:download Collector"] --> B["lucide:cpu Processor"]
  B --> C["lucide:upload Backend"]
{{</* /mermaid */>}}
```

For migrating diagrams that still use Font Awesome syntax, the same substitution accepts `fa:fa-NAME` and maps a small set of common aliases (`fa-download` → `download`, `fa-upload` → `upload`, `fa-microchip` → `cpu`, `fa-route` → `route`). Unknown FA names pass through untouched; the diagram still renders, just without the icon.

Tune the icon size site-wide via:

```toml
[params]
  mermaidIconSize = 24   # default; pixels
```

### Security mode and HTML in labels

The theme sets mermaid's `securityLevel: "antiscript"`. This matches relearn's default and allows `<br>`, `<strong>`, `<em>`, `&nbsp;`, and similar inline HTML in node labels (useful for line breaks and emphasis inside diagrams) while still blocking `<script>` tags and click handlers via mermaid's bundled DOMPurify. If you need a stricter or looser mode, the only place to change it is in [`layouts/_partials/chrome/footer.html`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/layouts/_partials/chrome/footer.html) — there's no site param for it (mermaid only sets the policy once at init time, so swapping it dynamically per page isn't useful).

### Background and theming

Mermaid normally paints its own canvas (white in default theme, dark slate in dark) plus a cream-yellow cluster fill (`#fff5ad`) for subgraphs. The theme overrides all four surface tokens (`background`, `clusterBkg`, `clusterBorder`, `secondaryColor`, `tertiaryColor`) to `transparent` so the diagram sits on the page's own `--color-surface` rather than introducing a fifth surface tint. Node and edge colors stay theme-driven by mermaid's default/dark palette; your `classDef` overrides in author content still win.

## Embedded video

{{< youtube id="dQw4w9WgXcQ" title="An old internet classic" >}}

```markdown
{{</* youtube id="dQw4w9WgXcQ" title="An old internet classic" */>}}
```

Uses `youtube-nocookie.com` for GDPR-friendlier embedding. The `title` attribute is required for accessibility.

For other video providers (Vimeo, Wistia, etc.), the theme doesn't ship a shortcode — drop the embed iframe directly into your markdown and Hugo's Goldmark with `unsafe = true` will render it.

## Presenter notes

A `presenter` block is hidden by default and revealed when the user enters presenter mode. A floating "Presenter" pill appears in the bottom-right of any page that has presenter notes; clicking it (or pressing `P` twice in quick succession, or appending `?presenter=1` to the URL) toggles the mode.

{{< presenter >}}
This block only appears when the floating "Presenter" pill is toggled on. Use it for delivery cues — timing notes, "kick off the demo container in the background", "remind people about the lunch break".

Don't hide answers here — attendees can see the markup in view-source.
{{< /presenter >}}

```markdown
{{</* presenter */>}}
Start the EC2 instance — boot takes ~3 minutes.
{{</* /presenter */>}}

{{</* presenter title="Timing" */>}}
Allow 10 minutes for attendees to finish this section.
{{</* /presenter */>}}
```

The state persists in `localStorage`, so once you toggle presenter mode it stays on as you navigate between pages — useful for live workshops where you want notes available throughout.

{{< notice tip "Don't put answers in presenter notes" >}}
The markup is in the page source. Attendees who view-source can see them. Use presenter notes for delivery cues and timing only — not for hidden answers to exercises.
{{< /notice >}}

## Webex chat simulation

Simulate a Cisco Webex conversation as the narrative device that opens an exercise — "your manager just pinged you about a customer complaint, here's what you'd see". Renders the full Webex chat UI (header, tabs, stacked message stream, "Seen by" indicator, composer footer) as decorative chrome around a sequence of messages you author yourself. Matches the real Webex desktop client's layout — all messages are left-aligned with avatar + name + time + body; the current-user case (`me=true`) swaps the initials disc for a chat-bubble glyph and defaults the name to "You". The chat surface follows the page's light/dark theme — flip the site theme and the chat flips with it, just like the real Webex client.

{{< webex chat="Bill Grant" date="Today • 28/01/2026" seenby="BG" >}}
{{< webex-msg from="BG" name="Bill Grant" time="09:42" >}}
Hey! We're getting reports of a potential customer satisfaction issue with the Online Boutique application. Can you do the first triage and see what's going on?
{{< /webex-msg >}}

{{< webex-msg me=true time="09:43" >}}
Sure, I'll start by checking RUM in Splunk Observability to see what the users are experiencing. 👍
{{< /webex-msg >}}
{{< /webex >}}

```markdown
{{</* webex chat="Bill Grant" date="Today • 28/01/2026" seenby="BG" */>}}
{{</* webex-msg from="BG" name="Bill Grant" time="09:42" */>}}
Hey! We're getting reports of a potential customer satisfaction issue
with the Online Boutique application. Can you do the first triage?
{{</* /webex-msg */>}}

{{</* webex-msg me=true time="09:43" */>}}
Sure, I'll start by checking RUM in Splunk Observability. 👍
{{</* /webex-msg */>}}
{{</* /webex */>}}
```

### Multi-turn conversation with multiple senders

Each ``{{</* webex-msg */>}}`` is independent, so you can interleave senders freely. Use the `color` param to give each person their own avatar tint.

{{< webex chat="Pieter Hagen" date="Today • 28/01/2026" seenby="PH" >}}
{{< webex-msg from="PH" name="Pieter Hagen" time="09:42" color="#0d9488" >}}
Hey! I've triaged a customer satisfaction issue with Online Boutique. RUM shows poor page load times. I traced a user session to the backend using Related Content — the latency is coming from the **paymentservice**.
{{< /webex-msg >}}

{{< webex-msg from="PH" name="Pieter Hagen" time="09:43" color="#0d9488" >}}
Can you dig into the back-end and find the root cause? I'll send you a link to the trace.
{{< /webex-msg >}}

{{< webex-msg me=true time="09:43" >}}
On it. I'll check APM and the service map. 👍
{{< /webex-msg >}}
{{< /webex >}}

### Parameters

**``{{</* webex */>}}``** (parent — chat container):

| Param | Default | Notes |
| --- | --- | --- |
| `chat` | `Chat` | Name in the header bar (also used as the input placeholder). |
| `status` | `Available` | Status text under the name. |
| `date` | `Today` | Centred date divider. Free-form — `Today • 28/01/2026`, `Yesterday`, `Last Tuesday`. |
| `seenby` | — | Initials of the avatar shown under "Seen by". Omit to hide the indicator. |
| `seenby-color` | Webex green | CSS colour for the seen-by avatar. |

**``{{</* webex-msg */>}}``** (child — one message):

| Param | Default | Notes |
| --- | --- | --- |
| `from` | — | Initials shown in the avatar disc. Ignored when `me=true` (the chat-bubble glyph replaces it). |
| `name` | — / `You` | Sender's full name (above the body). Defaults to `You` when `me=true`. |
| `time` | — | Timestamp string (e.g. `09:42`, `Thursday, 15:35`). Free-form, no parsing. |
| `color` | Webex green | Avatar disc background colour. Override per-sender to distinguish multiple voices. Ignored when `me=true`. |
| `me` | `false` | When `true`, the message uses the gray chat-bubble avatar and defaults the name to `You` — matching how Webex renders the current user's own messages. |

Message bodies support full markdown — `**bold**`, `*italic*`, `` `code` ``, links, emoji.
