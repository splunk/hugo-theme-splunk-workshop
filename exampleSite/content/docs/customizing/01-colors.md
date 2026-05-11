+++
title       = "Colors"
description = "The full color system, exposed as 22 Hugo params."
weight      = 10
+++

{{< lead >}}
Every color the theme uses is a CSS custom property fed by a Hugo param. Override any of them in your site's `hugo.toml` to rebrand instantly.
{{< /lead >}}

## The signature gradient

The theme's defining motif is the official Splunk brand gradient — **Magenta 50 → Orange 50** with stops at 10% / 90%. It appears on the hero `<em>`, step circles, the chapter weight number, the progress bar, the pager hover, and a dozen other places.

```toml
[params]
  colorAccent     = "#FF007F"   # Magenta 50 · Pantone 213 C · decorative (gradients, large display, borders, icons)
  colorAccent2    = "#FF9000"   # Orange 50  · Pantone 151 C · gradient end
  colorAccent3    = "#FFAB0F"   # supplementary amber (warm callouts only)
  colorAccentDark = "#D4006B"   # darker magenta for hover/active

  # Body-text accent — WCAG AA contrast. Use these for inline link colour,
  # active sidebar/breadcrumb states, and any place magenta meets prose.
  colorAccentText     = "#BD0D5F"   # Magenta 60 — ~5.4:1 on white
  colorAccentTextDark = "#FF7DBA"   # Magenta 30 — ~8:1 on Splunk navy
```

### Why two accents

Magenta 50 (`#FF007F`) is the brand colour but only hits ~3.6:1 on white — fine for *large* text, icons, gradients, and borders, but fails AA for body text. The theme splits accent usage:

| Use | Token |
| --- | --- |
| Hero gradient, step circles, chapter weight number, progress bar | `--color-accent` |
| Icons, decorative borders, focus rings, shadows | `--color-accent` |
| Inline link text, active sidebar/TOC entry, inline-code colour | `--color-accent-text` |
| Body badges (`accent` variant) | `--color-accent-text` |

If you rebrand to a single accent that already hits AA, set `colorAccentText` to the same value as `colorAccent`.

The gradient is computed from the two brand stops:

```css
linear-gradient(95deg, var(--color-accent) 10%, var(--color-accent-2) 90%)
```

The 10% / 90% offsets match the official brand spec — they keep the pure brand colors at the edges and let the natural CSS interpolation form a coral/red middle.

To rebrand to a single accent (no gradient), set both `colorAccent` and `colorAccent2` to the same value.

## Light mode tokens

| Token | Default | Used for |
| --- | --- | --- |
| `colorInk` | `#0C1724` | Body text |
| `colorInkMuted` | `#585B61` | Muted text, captions (AA-safe; the theme's bare default is `#4B4D52` but the demo overrides to `#585B61` for ~4.6:1 on white — recommended) |
| `colorPaper` | `#FFFFFF` | Page background |
| `colorSurface` | `#F7F6F3` | Callout fills, card surfaces |
| `colorSurfaceAlt` | `#EFEDE7` | Inline code chip background |
| `colorBorder` | `#E5E2DA` | Hairlines |
| `colorBorderStrong` | `#D6D2C8` | Strong borders, code-block borders |

## Dark mode tokens

Every light token has a `…Dark` counterpart that takes effect when `data-theme="dark"`:

| Token | Default |
| --- | --- |
| `colorInkDark` | `#F4F1EA` |
| `colorInkMutedDark` | `#9CA3AF` |
| `colorPaperDark` | `#0C1724` |
| `colorSurfaceDark` | `#141E2F` |
| `colorSurfaceAltDark` | `#1B2740` |
| `colorBorderDark` | `#1F2C44` |
| `colorBorderStrongDark` | `#2A3A56` |

## Worked example: rebrand to a teal/charcoal palette

```toml
[params]
  colorAccent     = "#0EA5E9"
  colorAccent2    = "#06B6D4"
  colorAccent3    = "#A7F3D0"
  colorAccentDark = "#0284C7"

  colorInk          = "#1F2937"
  colorInkMuted     = "#6B7280"
  colorPaper        = "#FAFAF9"
  colorSurface      = "#F4F4F5"
  colorSurfaceAlt   = "#E4E4E7"

  colorPaperDark        = "#0F172A"
  colorSurfaceDark      = "#1E293B"
  colorSurfaceAltDark   = "#334155"
```

That's the full rebrand — no SCSS recompile, no theme fork. The CSS custom properties update at page load.

{{< notice tip "Use a color tool" >}}
Run your accent through [oklch.com](https://oklch.com) or Tailwind's color palette to pick stops with even perceptual lightness. The gradient looks much better when stops are tonally balanced.
{{< /notice >}}

## Where these are wired

The flow is:

1. Param value lives in `hugo.toml` (this is what you edit).
2. `layouts/partials/theme-vars.html` reads the param and emits a `<style>` block with `--color-…` custom properties.
3. Every CSS file in `assets/css/` references `var(--color-…)`.
4. Dark mode flips the values via `[data-theme="dark"]` selectors.

If you want to add a new color, add the param + a default in `theme-vars.html`, then reference `var(--color-mything)` from CSS.
