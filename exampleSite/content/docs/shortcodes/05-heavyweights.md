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

```markdown
{{</* mermaid */>}}
graph LR
  A[Forwarder] --> B[Indexer]
  B --> C[Search Head]
{{</* /mermaid */>}}
```

Mermaid auto-rerenders when you toggle light/dark mode — a `MutationObserver` on `data-theme` triggers a re-init. Same lazy-load pattern: only pages using the shortcode pull the module.

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
