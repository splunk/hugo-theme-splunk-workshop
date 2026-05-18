+++
title       = "04 · Override prev"
linkTitle   = "04 · Override prev"
description = "Override only the Previous button — useful when the user arrived via a custom Next."
weight      = 40
+++

{{< lead >}}
This page overrides only **Previous**, sending readers back to page 2 (where the override that brought them here lives) rather than the natural DFS prior page.
{{< /lead >}}

## What to look for

At the bottom of this page:

- **Previous** → `02 · Override next` (overridden — back to where the override flow started).
- **Next** → `05 · Override both` (auto-computed, unchanged).

The symmetry is intentional: page 2 sends readers forward to here; page 4 sends them back to page 2. Together they form a self-contained "skip" that round-trips correctly.

## The markdown

```markdown
{{</* pager prev="/workshops/pager-demo/02-override-next/" */>}}
```

No `prevLabel` is given, so the label falls back to the destination page's `linkTitle`.

## When to use this pattern

Common scenarios:

- A branching page sends readers to a custom Next (page 2 does this). The custom Next page wants Previous to send them *back* to the branching page, not to a sibling they never saw.
- A page is reachable from multiple entry points and you want the Previous to point at the most likely originating page.

{{< pager prev="/workshops/pager-demo/02-override-next/" >}}
