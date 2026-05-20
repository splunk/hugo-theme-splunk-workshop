+++
title       = "05 · Override both"
linkTitle   = "05 · Override both"
description = "Override both sides at once; demonstrate explicit labels and an external URL."
weight      = 50
+++

{{< lead >}}
The last of the `pager` shortcode examples. This page overrides **both** sides of the pager. Previous points at the skipped page 3 (effectively undoing the workshop's skip-flow); Next points at an **external URL** with a custom label.
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

## End of the shortcode demo

This is the last page that uses the `pager` *shortcode* for overrides. The pager at the bottom is fully manual.

If you came in expecting the standard "Previous = sibling, Next = sibling", compare this page's pager to page 1's and you'll see the difference at a glance.

One more page follows in the sidebar — [06 · nopager](/workshops/pager-demo/06-nopager/) — which demonstrates the *front-matter* alternative for opting a page out of the pager chain entirely (a different mechanism from the override shortcode shown here).

{{< pager
  prev="/workshops/pager-demo/03-skipped/"
  prevLabel="Read about the skipped page"
  next="https://github.com/splunk/hugo-theme-splunk-workshop"
  nextLabel="Open the theme on GitHub" >}}
