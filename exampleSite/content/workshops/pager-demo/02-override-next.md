+++
title       = "02 · Override next"
linkTitle   = "02 · Override next"
description = "Override only the Next button; let Previous stay auto-computed."
weight      = 20
+++

{{< lead >}}
This page overrides only the **Next** destination — sending you to page 4 and skipping page 3. **Previous** still auto-computes back to page 1.
{{< /lead >}}

## What to look for

At the bottom of this page:

- **Previous** → `01 · Baseline` (auto-computed, unchanged).
- **Next** → `04 · Override prev` (overridden, skipping `03 · Skipped page`).

You can still reach page 3 from the left sidebar. The override only affects this page's bottom pager.

## The markdown

```markdown
{{</* pager next="/workshops/pager-demo/04-override-prev/" */>}}
```

That single line is the whole override. No `nextLabel` is provided, so the shortcode falls back to the destination page's `linkTitle` (`04 · Override prev`).

The shortcode can sit anywhere in the body — beginning, middle, or end. It always writes to the page's Scratch and the bottom pager partial reads from there.

{{< pager next="/workshops/pager-demo/04-override-prev/" >}}
