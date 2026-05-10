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

{{< tip "SVG > PNG" >}}
SVG logos render crisply at any zoom level and inherit `currentColor` if you want them to follow the theme accent. If your asset is a raster, use a 2× PNG so it stays sharp on retina displays.
{{< /tip >}}

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

{{< tip "Image format" >}}
Use 16:9 WebP — gradient blooms compress beautifully at quality 85–95 and stay around 100 KB each. The bundled Splunk assets ship as WebP at ~100 KB. PNG, JPG, and SVG also work, but the image loads on every page that has a hero, so keep it tight: 1 MB+ assets noticeably hurt first paint.
{{< /tip >}}

## OG / Twitter card image

The theme auto-emits OpenGraph and Twitter card meta tags using your site title and description. To set a social-share image, drop one at `static/images/og.png` (1200×630 is the canonical size) and override `partials/head.html` to add:

```html
<meta property="og:image" content="{{ "images/og.png" | absURL }}">
```

This isn't wired by default because OG images are usually per-page; future versions of the theme will probably expose `params.ogImage` for site-wide and `params.image` per-page.
