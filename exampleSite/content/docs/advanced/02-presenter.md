+++
title       = "Presenter mode"
description = "Slide-deck-style facilitator notes embedded in your workshop pages."
weight      = 20
+++

{{< lead >}}
Workshops are often delivered live. Presenter mode lets you embed timing cues, "kick off the demo container in the background", and other facilitator notes directly in your markdown — visible only when you toggle them on.
{{< /lead >}}

## How to use it

Wrap presenter-only content in a `presenter` shortcode:

```markdown
{{</* presenter */>}}
Start the EC2 instance — boot takes ~3 minutes.
{{</* /presenter */>}}

{{</* presenter title="Timing" */>}}
Allow 10 minutes for attendees to finish this section.
{{</* /presenter */>}}
```

By default the block is hidden. When the page loads, JavaScript checks if any `presenter` blocks exist; if so, it injects a floating "Presenter" pill in the bottom-right.

## Three ways to toggle

1. **Click the pill** — the floating "Presenter" button in the bottom-right of any page that has presenter notes
2. **Press `P` twice** in quick succession — same effect, no mouse needed during a live demo
3. **Append `?presenter=1`** to the URL — useful if you want a bookmarkable presenter view

The state persists in `localStorage`, so once toggled it stays on as you navigate. The setting is per-browser, not per-page.

## Live example

{{< presenter title="Live demo" >}}
This is what a presenter note looks like when the mode is on. Toggle it via the pill in the bottom-right or press `P` twice. The block has a dashed border, an amber accent, and a hatched background so you can't miss it during a talk.
{{< /presenter >}}

If presenter mode is off, you should see no block above this paragraph. If presenter mode is on, you should see a styled note.

## Don't put answers here

The markup is in the page source. Anyone who view-source can see the content of every `presenter` block. Use it for **delivery cues**, not hidden answers.

For genuinely-hidden answers (like exercise solutions), use the `solution` shortcode inside an `exercise` — that's a `<details>` element, also revealable, but framed as "click to reveal" rather than "hidden facilitator content".

## Disabling

If you don't use presenter notes, no setup is needed — the JS code does nothing on pages without any `presenter` shortcode blocks. The toggle pill only appears when there's something to toggle.

To disable globally (e.g. if your team wants to ensure speaker notes never make it into rendered output), comment out every `presenter` block before deploy or override `layouts/shortcodes/presenter.html` with an empty file in your site.
