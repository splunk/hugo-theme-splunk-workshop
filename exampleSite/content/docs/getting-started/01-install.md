+++
title       = "Install"
description = "Three install methods, ranked by recommendation."
weight      = 10
+++

{{< lead >}}
Hugo extended **0.161 or newer** is required. Check with `hugo version` — you want a build that says `extended`.
{{< /lead >}}

## Before you start

All three methods below install the theme **into an existing Hugo site**. If you don't have one yet, scaffold a blank site first:

```bash
hugo new site my-workshops
cd my-workshops
git init
```

If you already have a Hugo site, just `cd` into its root. Every command on this page runs from that directory.

## Pick your method

{{< tabs groupid="install-method" >}}
{{< tab "Hugo Module (recommended)" >}}
Hugo Modules give you version-pinned installs and one-command upgrades. Requires **Go 1.18+** for the one-time init.

**Step 1 — Initialise the site as a Hugo Module (once per site).**

```bash
hugo mod init github.com/your-org/your-site
```

This creates a `go.mod` file in your site root. The path can be anything you control — it's just your site's module identity, separate from any GitHub repo you may or may not push to.

{{% notice style="warning" title="Don't skip `hugo mod init`" %}}
Going straight to `hugo mod get` without initialising first produces this confusing error, because Hugo falls back to looking for the theme as a directory under `themes/`:

```text
ERROR failed to load modules: module "github.com/splunk/hugo-theme-splunk-workshop"
not found in "<your-site>/themes/github.com/splunk/hugo-theme-splunk-workshop";
either add it as a Hugo Module or store it in "<your-site>/themes".
```

Fix: run `hugo mod init <your-module-path>` in the site root, then re-run `hugo mod get`.
{{% /notice %}}

**Step 2 — Add the theme as a dependency.**

```bash
hugo mod get github.com/splunk/hugo-theme-splunk-workshop
```

Then in `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/splunk/hugo-theme-splunk-workshop"
```

Pin to a release (recommended for CI):

```bash
hugo mod get github.com/splunk/hugo-theme-splunk-workshop@v0.1.0
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

## Upgrading

Released versions are listed on the [GitHub releases page](https://github.com/splunk/hugo-theme-splunk-workshop/releases) — skim the release notes there before upgrading. Upgrade commands match the install method you picked above:

{{< tabs groupid="install-method" >}}
{{< tab "Hugo Module (recommended)" >}}

```bash
# Latest tag
hugo mod get -u github.com/splunk/hugo-theme-splunk-workshop

# Specific tag (also the rollback workflow)
hugo mod get github.com/splunk/hugo-theme-splunk-workshop@v0.1.0
```

Commit the updated `go.mod` / `go.sum` so collaborators and CI build against the same version. See [Hugo Modules deep-dive](/docs/advanced/01-modules/) for `replace` directives and the override-without-forking pattern.

{{< /tab >}}

{{< tab "Git submodule" >}}

```bash
cd themes/hugo-theme-splunk-workshop
git pull origin main           # or: git checkout v0.1.0 for a pinned tag
cd ../..
git add themes/hugo-theme-splunk-workshop
git commit -m "Bump theme"
```

{{< /tab >}}

{{< tab "Direct download" >}}

```bash
rm -rf themes/hugo-theme-splunk-workshop
curl -L https://github.com/splunk/hugo-theme-splunk-workshop/archive/refs/heads/main.tar.gz \
  | tar -xz -C themes/
mv themes/hugo-theme-splunk-workshop-main themes/hugo-theme-splunk-workshop
```

{{< /tab >}}
{{< /tabs >}}

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

Open [http://localhost:1313](http://localhost:1313). You should see the theme's default home with your site title. If something goes wrong, check the [troubleshooting](#troubleshooting) section below.

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

{{% notice style="warning" title="module does not exist" %}}
You're installing with Hugo Modules but skipped the one-time `hugo mod init` step. Run it once in your site root with any module path you control, then re-run `hugo mod get`:

```bash
hugo mod init github.com/your-org/your-site
hugo mod get github.com/splunk/hugo-theme-splunk-workshop
```

If you can't (or don't want to) install Go, switch to the submodule install method instead.
{{% /notice %}}
