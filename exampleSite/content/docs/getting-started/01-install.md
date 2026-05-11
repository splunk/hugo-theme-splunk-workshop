+++
title       = "Install"
description = "Three install methods, ranked by recommendation."
weight      = 10
+++

{{< lead >}}
Hugo extended **0.125 or newer** is required. Check with `hugo version` — you want a build that says `extended`.
{{< /lead >}}

## Pick your method

{{< tabs groupid="install-method" >}}
{{< tab "Hugo Module (recommended)" >}}
Hugo Modules give you version-pinned installs and one-command upgrades. Requires **Go 1.18+** for the one-time init.

```bash
# 1. Init your site as a Hugo Module (one time only)
hugo mod init github.com/your-org/your-site

# 2. Add the theme as a dependency
hugo mod get github.com/splunk/hugo-theme-splunk-workshop
```

Then in `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/splunk/hugo-theme-splunk-workshop"
```

Pin to a release:

```bash
hugo mod get github.com/splunk/hugo-theme-splunk-workshop@v1.0.0
```

Update later:

```bash
hugo mod get -u
```
{{< /tab >}}

{{< tab "Git submodule" >}}
No Go required, fully reproducible.

```bash
cd your-hugo-site
git submodule add https://github.com/splunk/hugo-theme-splunk-workshop.git \
  themes/hugo-theme-splunk-workshop
```

In `hugo.toml`:

```toml
theme = "hugo-theme-splunk-workshop"
```

When cloning the site fresh later:

```bash
git submodule update --init --recursive
```
{{< /tab >}}

{{< tab "Direct download" >}}
Quickest, but you lose the version-control trail of the theme itself.

```bash
cd your-hugo-site/themes
curl -L https://github.com/splunk/hugo-theme-splunk-workshop/archive/refs/heads/main.tar.gz \
  | tar -xz
mv hugo-theme-splunk-workshop-main hugo-theme-splunk-workshop
```

In `hugo.toml`:

```toml
theme = "hugo-theme-splunk-workshop"
```
{{< /tab >}}
{{< /tabs >}}

{{< notice tip "Which one?" >}}
Use **Hugo Modules** unless you have a strong reason not to — the version pin makes upgrades and CI deterministic. Submodule is fine for personal sites; direct download is fine for quick prototypes.
{{< /notice >}}

## Minimal `hugo.toml`

After installing the theme, this is the smallest config that produces a working site:

```toml
baseURL = "https://example.org/"
title   = "My Workshops"

# Pick ONE of the install methods above; this example uses a submodule.
theme = "hugo-theme-splunk-workshop"

[markup.goldmark.renderer]
  unsafe = true            # required for raw HTML in shortcode output

[outputs]
  home = ["HTML", "RSS", "JSON"]   # JSON powers client-side search
```

You'll want to layer in `[params]` for branding once the basics work — see [Customizing](/docs/customizing/).

## Verify it works

```bash
hugo server
```

Open http://localhost:1313. You should see the theme's default home with your site title. If something goes wrong, check the [troubleshooting](#troubleshooting) section below.

{{< checkpoint "Theme installed and a blank site renders at localhost:1313" >}}

## Troubleshooting

{{% notice style="warning" title="Goldmark unsafe HTML" %}}
If shortcodes like `card` render as escaped text, you forgot `unsafe = true` under `[markup.goldmark.renderer]`. The theme emits raw HTML.
{{% /notice %}}

{{% notice style="warning" title="Search returns no results" %}}
The search modal needs `home = ["HTML", "RSS", "JSON"]` in your `[outputs]` block — the JSON output is the search index.
{{% /notice %}}

{{% notice style="warning" title="hugo: command not found" %}}
Install Hugo extended:
- macOS: `brew install hugo`
- Linux: download from [gohugo.io/installation](https://gohugo.io/installation/) (the package manager versions are often outdated and not the extended build)
- Windows: `choco install hugo-extended`
{{% /notice %}}
