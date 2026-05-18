+++
title       = "05 · Override both"
linkTitle   = "05 · Override both"
description = "Override both sides at once; demonstrate explicit labels and an external URL."
weight      = 50
+++

{{< lead >}}
The final page overrides **both** sides of the pager. Previous points at the skipped page 3 (effectively undoing the workshop's skip-flow); Next points at an **external URL** with a custom label.
{{< /lead >}}

## What to look for

- **Previous** → `Read about the skipped page` (custom label, points at `/03 · Skipped page`).
- **Next** → `Open the theme on GitHub` (custom label, external URL).

External URLs are valid — the shortcode doesn't try to resolve them to local pages, so the `nextLabel` is mandatory in that case (without a label, the button would display the bare URL).

## The markdown

```markdown
{{</* pager
  prev="/workshops/pager-demo/03-skipped/"
  prevLabel="Read about the skipped page"
  next="https://github.com/splunk/hugo-theme-splunk-workshop"
  nextLabel="Open the theme on GitHub"
*/>}}
```

The order and line breaks don't matter — Hugo shortcodes accept named args on one line or several.

## End of demo

This is the last page of the demo. The pager at the bottom is fully manual.

If you came in expecting the standard "Previous = sibling, Next = sibling", compare this page's pager to page 1's and you'll see the difference at a glance.

{{< pager
  prev="/workshops/pager-demo/03-skipped/"
  prevLabel="Read about the skipped page"
  next="https://github.com/splunk/hugo-theme-splunk-workshop"
  nextLabel="Open the theme on GitHub" >}}
