+++
title       = "Troubleshooting"
description = "Common build failures, broken-link symptoms, and why your search/dark-mode/Mermaid isn't working."
weight      = 60
+++

{{< lead >}}
Symptom → cause → fix, for the issues most likely to show up in the first 24 hours of using the theme.
{{< /lead >}}

## Links 404 on GitHub Pages but work locally

**Symptom.** `http://localhost:1313/docs/foo/` works in `hugo server`, but the deployed site at `https://owner.github.io/repo/docs/foo/` returns 404.

**Cause.** The published site lives under a path prefix (`/repo/`), but a link in your markdown or a template emits a domain-rooted `/docs/foo/` href that the browser resolves to `https://owner.github.io/docs/foo/`.

**Fix.** Make sure your build passes the right `--baseURL`. The bundled GitHub Pages workflow does this automatically:

```yaml
hugo \
  --source exampleSite \
  --themesDir ../.. \
  --baseURL "${{ steps.pages.outputs.base_url }}/"
```

The theme's own templates already route every internal href through `layouts/partials/site-href.html`, which strips the leading `/` and pipes the path through Hugo's `relURL` so the baseURL prefix is applied. If your own custom shortcodes or partials emit `href="/foo"` raw, swap to `href="{{ partial "site-href.html" "/foo" }}"`.

## Search shows "No matches" for everything

**Symptom.** The `/` search modal opens, but every query returns "No matches" — even searches that should obviously hit something.

**Cause.** Search reads `/index.json` from the site root. If your `hugo.toml` `[outputs]` block doesn't list `JSON` for the home, that file is never built.

**Fix.** Confirm your config has:

```toml
[outputs]
  home    = ["HTML", "RSS", "JSON"]
  section = ["HTML", "RSS"]
  page    = ["HTML"]
```

After a build, `index.json` should exist at the published site root. Hit it directly in a browser to confirm.

## Dark mode flashes light on first paint

**Symptom.** Every page loads in light mode for ~100ms before switching to dark, even when the user has dark mode set.

**Cause.** The `<script>` that reads the persisted theme preference from localStorage runs too late — after the CSS has already applied the default-light tokens.

**Fix.** The bundled `layouts/partials/head.html` puts the theme-init script *before* the stylesheet `<link>` to avoid this. If you've overridden `head.html` in your own site, replicate that order:

```html
<script>
  /* Read persisted theme BEFORE the stylesheet evaluates so the right tokens apply on first paint. */
  var m = localStorage.getItem("splunk-workshop-theme") || "auto";
  if (m === "dark" || (m === "auto" && matchMedia("(prefers-color-scheme: dark)").matches)) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
</script>
<link rel="stylesheet" href="...">
```

## "Shortcode not found" errors

**Symptom.** `ERROR: template: shortcodes/foo.html:N: ... error calling shortcode ...`

**Cause(s).**

- The shortcode name doesn't exist. Check spelling against `make shortcodes` for the full list.
- The theme isn't loaded. Verify `theme = "hugo-theme-splunk-workshop"` in `hugo.toml` and that the theme is on disk at `themes/hugo-theme-splunk-workshop/` (or imported via Hugo Modules).
- You're using a relearn-only shortcode that doesn't have an alias. Check the [migration guide](../05-from-relearn/) for the supported list.

## Mermaid diagrams don't render / KaTeX equations stay literal

**Symptom.** A `{{</* mermaid */>}}` block renders as plain `graph TD; ...` text, or a `{{</* math */>}}` block shows `$x = 1$` literally rather than typeset.

**Cause.** Both libraries lazy-load only when a page has explicitly opted in via `Page.Store`. If a downstream shortcode that emits Mermaid/KaTeX doesn't set the flag, the CDN never loads.

**Fix.** Inside any custom shortcode that wraps math or mermaid markup, set the flag before emitting:

```html
{{- .Page.Store.Set "_needs_mermaid" true -}}
<div class="mermaid">{{ .Inner }}</div>
```

The bundled `mermaid.html` and `math.html` shortcodes do this. If you're embedding diagrams via raw HTML in markdown (not the shortcode), call the partial directly or just use the shortcode.

## "Open menu" button does nothing on mobile

**Symptom.** Tap the hamburger on a phone, sidebar doesn't slide in.

**Cause.** The mobile-nav JS module didn't initialise — usually because the bundled JS file failed to load (404), or you have a Content-Security-Policy that blocks inline scripts.

**Fix.**

1. Check the network tab — the page should load one `bundle.min.<hash>.js` from `/<basepath>/js/`.
2. If you've added a CSP header, make sure `script-src 'self'` is allowed.
3. Confirm the sidebar partial has `<aside id="workshop-sidebar" class="sidebar" ...>` — the menu button's `aria-controls` points at that id.

## Eyebrow / hero copy looks wrong on the home page

**Symptom.** The home hero says "Splunk Workshops" instead of "Learn by *building*." (or vice versa), or the eyebrow shows the brandTagline instead of a custom value.

**Cause.** The hero reads from `content/_index.md` front matter — `title`, `description`, `eyebrow`, and a `[[cta]]` array. If those keys are missing, the template falls through to `params.brandTagline` and `params.description` from `hugo.toml`.

**Fix.** Edit `content/_index.md`:

```toml
+++
title       = "Learn by *building*."   # markdownified — wrap in *asterisks* for <em>
eyebrow     = "Workshops · Hands-on"
description = "..."

[[cta]]
label = "Browse workshops"
href  = "/workshops/"
style = "primary"
+++
```

See [Authoring › Front matter › Home page hero](../../authoring/01-front-matter/#home-page-hero) for the full spec.

## Print preview is missing styling / shows nav chrome

**Symptom.** `Cmd-P` shows the navigation, sidebar, and footer in the print preview instead of a clean printable page.

**Cause.** The print stylesheet is loaded but a downstream override or a custom partial is forcing `display` values that survive the print media query.

**Fix.** The bundled `assets/css/print.css` hides `.site-header`, `.sidebar`, `.toc`, `.pager`, `.site-search-trigger`, and `.site-footer__social`. If you've added your own UI chrome, add a `@media print { .your-class { display: none !important; } }` rule.

## Need more help?

[Open an issue](https://github.com/splunk/hugo-theme-splunk-workshop/issues) with:

- A minimal repro (a stripped-down `hugo.toml` + one content file is gold).
- The Hugo version (`hugo version`).
- A screenshot if it's visual.

Most issues are unique to a specific Hugo version or a downstream override — having the repro lets us pin it down quickly.
