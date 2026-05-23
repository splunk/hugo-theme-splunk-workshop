+++
title       = "Icons"
description = "Every icon bundled with the theme, with the name you pass to `icon=`."
weight      = 70
+++

{{< lead >}}
Inline SVG icons available anywhere the theme accepts an `icon=` param — notices, badges, buttons, the `icon` shortcode. Rendered at first paint; no font load, no FOIT.
{{< /lead >}}

```markdown
{{</* icon rocket */>}}
{{</* badge color="info" icon="shield" */>}}secure{{</* /badge */>}}
{{%/* notice icon="lightbulb" */%}}…{{%/* /notice */%}}
```

## Available icons

{{< icon-gallery >}}

## Adding more

Drop your SVG path data into [`data/icons.toml`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/data/icons.toml) — one entry per icon. The gallery above reads from the same file and updates on the next build.

To extend without forking the theme, create `data/icons.toml` in your own site. Hugo's data-file precedence puts your file ahead of the theme's, so you can add or replace any icon site-locally.

```toml
# your-site/data/icons.toml
[icons]
my-icon = '<path d="M…"/>'
```
