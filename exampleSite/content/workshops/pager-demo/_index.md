+++
title       = "Pager override demo"
linkTitle   = "Pager override demo"
description = "A walkable demo of the `pager` shortcode — override the prev/next destinations on a page-by-page basis."
duration    = "5 min"
difficulty  = "reference"
weight      = 90
layout      = "chapter"
subtitle    = "Chapter · Authoring"
tagline     = "90 · Demo"
+++

A small workshop that demonstrates the [`pager` shortcode](/docs/shortcodes/06-utilities/#pager). Each page exhibits a different override pattern. Click through end-to-end and watch the pager change at the bottom of each page.

What this demo covers:

- **Page 1 — Baseline.** No override; standard auto-pager.
- **Page 2 — Override `next`.** `Next` skips ahead, leaving `Previous` auto.
- **Page 3 — Skipped page.** The page that page 2 jumps over. Reachable via the sidebar; pager unchanged.
- **Page 4 — Override `prev`.** `Previous` points back to where the user came from.
- **Page 5 — Override both, including an external URL and label fallback.**

Open the sidebar to see every page in the demo. Use the bottom pager to navigate sequentially.
