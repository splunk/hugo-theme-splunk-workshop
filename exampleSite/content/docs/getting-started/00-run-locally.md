+++
title       = "Run locally"
linkTitle   = "Run locally"
description = "Clone the theme repo, get the demo running in 60 seconds, and learn where to put your own content."
weight      = 5
+++

{{< lead >}}
Two ways to use the theme: clone this repo to try the demo or contribute, or install it into a brand-new Hugo site you own. This chapter covers the first path. For the second, see [Install](../01-install/).
{{< /lead >}}

## Prerequisites

- **Hugo extended 0.125 or newer.** Check with `hugo version` — the build line must include `extended`.
  - macOS: `brew install hugo`
  - Linux: download the `_extended_` `.deb` / `.rpm` from [gohugo.io/installation](https://gohugo.io/installation/) (package-manager versions are usually outdated and non-extended)
  - Windows: `choco install hugo-extended`
- **Git** (any recent version).

Optional: `make` for the convenience targets. Anything `make` does, you can do by hand with `hugo` directly.

## Clone the repo

```bash
git clone https://github.com/splunk/hugo-theme-splunk-workshop.git
cd hugo-theme-splunk-workshop
```

## Run the demo

The theme ships with a complete demo under [`exampleSite/`](https://github.com/splunk/hugo-theme-splunk-workshop/tree/main/exampleSite). That's what produces the live site you're reading right now.

```bash
make serve
```

That target expands to:

```bash
hugo server --source exampleSite --themesDir ../.. --port 1313 --disableFastRender
```

Open <http://localhost:1313>. Edit any file under `exampleSite/content/` or `assets/css/` and the page reloads on save.

{{< checkpoint "Demo running on localhost:1313 with live reload" >}}

## What's where

```text
hugo-theme-splunk-workshop/
├── archetypes/             # `hugo new` scaffolds (lesson, exercise, chapter…)
├── assets/                 # source CSS + JS — bundled at build time
│   ├── css/
│   └── js/
├── content/                # YOUR content goes here when running the theme as a site (see below)
├── exampleSite/            # the demo / docs site
│   ├── content/            # the markdown for the live demo
│   └── hugo.toml           # the demo's own config
├── i18n/                   # UI strings, one file per language
├── images/                 # screenshots for the GitHub README
├── layouts/                # templates, partials, shortcodes (THE THEME)
├── static/                 # files copied as-is at build (favicon, brand images)
├── hugo.toml               # the theme's own config (and the site config when you put content in content/)
├── theme.toml              # metadata for themes.gohugo.io
└── Makefile                # serve / build / check / shortcodes / etc.
```

The two content directories matter:

- **`exampleSite/content/`** — the demo that ships with the theme. `make serve` builds this.
- **`content/`** — empty in a fresh clone. Drop your own markdown here when you want to build *your* workshop site from the theme repo itself (rather than installing the theme into a separate site).

You usually want only one of those two populated at a time. The exampleSite is the safer place to experiment — your edits are clearly demo edits.

## Edit the demo

Try this:

1. Open `exampleSite/content/workshops/getting-started/01-introduction.md` in your editor.
2. Change a word in the body. Save.
3. The browser at <http://localhost:1313/workshops/getting-started/01-introduction/> reloads with your change.

That's the whole inner loop. No build step, no asset pipeline to babysit.

## Author your own content

If you'd rather use the theme's repo as your own site (instead of the exampleSite demo), drop your content under `content/` at the theme root. The `content/` directory is empty in a fresh clone for exactly this reason.

Minimum to get going:

```bash
# In the theme repo root
hugo new --kind workshop content/workshops/my-workshop/01-intro.md
```

Then start a server pointing at the repo root (not exampleSite):

```bash
hugo server --port 1313
```

This time Hugo reads `hugo.toml` at the repo root and `content/` for your authored material. Your workshop appears at <http://localhost:1313/workshops/my-workshop/01-intro/>.

{{< note title="Two distinct dev loops" >}}
- `make serve` (or `hugo server --source exampleSite --themesDir ../..`) builds the **demo**.
- `hugo server` from the repo root builds **your content** in `content/`.

Use the first when you're learning the theme; use the second when you're authoring a real workshop you intend to ship.
{{< /note >}}

For a comprehensive guide to authoring conventions, front matter, and the navigation model see the [Authoring](../../authoring/) chapter.

## Other useful Make targets

```bash
make build         # production build of the demo to exampleSite/public/
make check         # build with strict logging (surfaces I18n & path warnings)
make clean         # remove built output and caches
make shortcodes    # list every shortcode the theme ships
make stats         # line counts for templates / CSS / JS
make screenshot    # refresh images/screenshot.png and tn.png (Chrome required)
```

All targets are documented in [`Makefile`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/Makefile).

## When you outgrow this setup

Working from a clone is great for trying the theme and contributing. For a production workshop site that *imports* the theme as a dependency (so you get one-command upgrades), move on to [Install](../01-install/).
