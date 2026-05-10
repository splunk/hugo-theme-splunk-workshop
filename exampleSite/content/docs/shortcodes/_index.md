+++
title       = "Shortcodes"
linkTitle   = "Shortcodes"
description = "Live, copy-pasteable examples of every shortcode shipped with the theme."
weight      = 40
layout      = "chapter"
subtitle    = "Chapter · Reference"
+++

The theme ships with **50+ shortcodes** organized into six categories. Each page below renders the live result alongside the markdown that produced it.

## Argument conventions

Across the theme, shortcodes follow these rules:

- **The primary argument is positional**. For most shortcodes the first positional arg is the title, label, or `href`/`src`:

  ```markdown
  {{</* tip "Pro move" */>}} ... {{</* /tip */>}}
  {{</* card "Get started" "/install/" */>}} ... {{</* /card */>}}
  {{</* image "screenshot.png" "A dashboard caption" */>}}
  ```

- **Secondary arguments are named.** Anything beyond the first one or two args should be named for clarity:

  ```markdown
  {{</* button href="/install/" icon="download" style="primary" */>}}Install{{</* /button */>}}
  {{</* step title="Deploy" time="5 min" n="3" */>}}body{{</* /step */>}}
  ```

- **Links use `href`.** `url` is accepted as a legacy alias on `card` and a few others for relearn compatibility but should not be used in new content. The theme's `site-href.html` partial routes every `href` through Hugo's URL resolver, so internal paths like `/docs/foo/` automatically pick up the site `baseURL` prefix and external `http*` URLs are passed through with `target="_blank"`.

- **Inner content is markdown.** Body content between the open and close tags is rendered through Hugo's markdown pipeline, so you can nest shortcodes, use links, lists, code blocks, etc. inside `{{</* tip */>}}` / `{{</* exercise */>}}` / etc.

- **Internationalization.** Default labels (`Tip`, `Note`, `Show solution`, `Quick check`, etc.) are pulled from `i18n/en.yaml`. Translate the theme by adding `i18n/<lang>.yaml` to your own site — every default label and UI string is keyed there.
