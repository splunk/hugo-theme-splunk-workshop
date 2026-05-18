+++
title       = "01 · Baseline (no override)"
linkTitle   = "01 · Baseline"
description = "The default pager — auto-computed prev/next via DFS through the workshop tree."
weight      = 10
+++

{{< lead >}}
No `pager` shortcode on this page. The bottom pager renders the standard auto-computed Previous and Next.
{{< /lead >}}

## What to look for

Scroll to the bottom of this page. You'll see:

- **Previous** → the workshop landing (`Pager override demo`).
- **Next** → `02 · Override next`.

That's the standard behaviour: every page in the workshop walks the page tree in `weight`-sorted DFS order.

## The markdown

This page has no `pager` shortcode at all — just front matter and prose. The pager you see at the bottom is computed entirely from sibling order in the file system.

```markdown
+++
title  = "01 · Baseline (no override)"
weight = 10
+++

(no `pager` shortcode anywhere in the body)
```

Click **Next** to see the simplest override pattern.
