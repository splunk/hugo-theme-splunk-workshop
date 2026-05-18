+++
title       = "03 · Skipped page"
linkTitle   = "03 · Skipped page"
description = "This page is in the natural DFS order but page 2's Next override jumps over it."
weight      = 30
+++

{{< lead >}}
You're reading this page because you navigated here from the **sidebar** (or directly via URL). Page 2's `Next` override jumps straight to page 4, skipping this one.
{{< /lead >}}

## Why this matters

Pages are still part of the workshop and the site search index. The `pager` shortcode only affects the bottom navigation buttons on the page where it lives — it doesn't hide pages or remove them from the tree. A skipped page is normal content that the author has decided not to send linear-walking readers through.

## What to look for

The pager on **this** page is the auto-default:

- **Previous** → `02 · Override next` (sibling above this one).
- **Next** → `04 · Override prev` (sibling below this one).

So a reader who landed here from the sidebar can still click forward and end up exactly where page 2's override sent them.
