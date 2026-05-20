+++
title       = "Logos & branding"
description = "Drop in a logo, set the wordmark, swap the favicon."
weight      = 30
+++

{{< lead >}}
The header and footer use a single `.brand` element that auto-swaps between a light-mode and dark-mode logo. If you don't supply a logo, a text wordmark renders in its place.
{{< /lead >}}

## Logos

Drop your files into `static/images/`, then point the params at them:

```toml
[params]
  logoLight  = "images/your-logo-black.svg"   # shown in light mode
  logoDark   = "images/your-logo-white.svg"   # shown in dark mode (optional)
  logoHeight = "26"                           # height in pixels
```

Both `logoLight` and `logoDark` are paths relative to `static/`. The CSS auto-swaps them based on the `[data-theme]` attribute — only the relevant one is visible at a time.

If you only set `logoLight`, it's used in both modes. Make sure it has acceptable contrast on both backgrounds.

{{< notice tip "SVG > PNG" >}}
SVG logos render crisply at any zoom level and inherit `currentColor` if you want them to follow the theme accent. If your asset is a raster, use a 2× PNG so it stays sharp on retina displays.
{{< /notice >}}

## Text wordmark fallback

If you leave both logo params empty, the brand block renders a text wordmark instead:

```toml
brandName    = "splunk>"
brandTagline = "Workshops"      # optional pill next to the wordmark; "" hides it
```

The wordmark uses `--font-display` and the `--color-accent` (the `>` is colored as the brand mark).

## Favicon

```toml
favicon = "favicon.svg"
```

Path relative to `static/`. The theme defaults to a small SVG at `static/favicon.svg` that uses the accent gradient — replace it with your own.

For multi-format favicon coverage (legacy browsers, iOS app icons, etc.), you can drop additional files into `static/` and add a custom partial — see [Advanced → Custom partials](/docs/advanced/) for the override pattern.

## Hero background

The hero section on the home page and chapter landings shows a Splunk-branded background image with the magenta → orange bloom on the right edge. There are two — one for light mode, one for dark — selected based on the active theme.

```toml
[params]
  heroBackgroundLight = "images/background_Splunk-light-mode2_16x9.webp"
  heroBackgroundDark  = "images/background_Splunk-dark-mode2_16x9.webp"
```

The bundled defaults are the official Splunk brand assets and ship in the theme's `static/images/` directory. Override the params to use your own. Set both to `""` (empty string) to suppress the background entirely.

The image is sized with `background-size: cover` and anchored `right top`, so the bloom always pokes out of the top-right regardless of viewport width. If your asset has a different focal point, override `.light-trails--hero` in your own CSS to tweak the positioning.

{{< notice tip "Image format" >}}
Use 16:9 WebP — gradient blooms compress beautifully at quality 85–95 and stay around 100 KB each. The bundled Splunk assets ship as WebP at ~100 KB. PNG, JPG, and SVG also work, but the image loads on every page that has a hero, so keep it tight: 1 MB+ assets noticeably hurt first paint.
{{< /notice >}}

## Social links

The footer's right column renders a row of icon links for whichever social accounts you populate. Set the keys you want under `[params.social]`; any key you leave unset (or empty) is omitted from the row. If you set nothing, the whole row is suppressed.

```toml
[params.social]
  github   = "https://github.com/your-org"
  twitter  = "https://x.com/your-handle"
  linkedin = "https://www.linkedin.com/company/your-org"
  youtube  = "https://www.youtube.com/@your-channel"
  mastodon = "https://hachyderm.io/@you"        # adds rel="me" for verification
  bluesky  = "https://bsky.app/profile/you.bsky.social"
  rss      = "/index.xml"                       # local path; Hugo emits at site root
```

Seven keys are supported total: `github`, `twitter`, `linkedin`, `youtube`, `mastodon`, `bluesky`, `rss`. Each renders an SVG icon that picks up the footer's text color and tints to brand pink on hover.

A couple of details worth knowing:

- The `twitter` icon is the post-rebrand X wordmark, not the old bird. Same key name for back-compat.
- `mastodon` outputs `rel="noopener me"` so the link doubles as a profile-verification source on the Mastodon side.
- `rss` is the only key that takes a site-relative path — the theme runs it through Hugo's URL resolver and emits `rel="alternate" type="application/rss+xml"` so feed readers can autodiscover.
- All other URLs should be absolute (`https://…`) — they're emitted as-is into `href`.

{{< notice tip "Don't link to broken accounts" >}}
Hugo doesn't validate the URLs — if you ship a typo, the icon still renders but the link is dead. Click each one after deploying.
{{< /notice >}}

## OG / Twitter card image

The theme auto-emits OpenGraph and Twitter card meta tags using your site title and description. To set a social-share image, drop one at `static/images/og.png` (1200×630 is the canonical size) and override `_partials/head.html` to add:

```html
<meta property="og:image" content="{{ "images/og.png" | absURL }}">
```

This isn't wired by default because OG images are usually per-page; future versions of the theme will probably expose `params.ogImage` for site-wide and `params.image` per-page.
