+++
title       = "Hugo Modules deep-dive"
description = "Pinning versions, replacing locally, and overriding individual files."
weight      = 10
+++

{{< lead >}}
Hugo Modules are the modern way to consume themes. They give you version pinning, easy upgrades, and — most powerfully — the ability to override individual files without forking the theme.
{{< /lead >}}

## Pinning a version

```bash
hugo mod get github.com/splunk/hugo-theme-splunk-workshop@v0.2.0
```

Hugo writes the resolved version to your `go.mod`. Future `hugo build` and `hugo server` invocations use that exact version. Available tags are on the [releases page](https://github.com/splunk/hugo-theme-splunk-workshop/releases).

To upgrade everything:

```bash
hugo mod get -u
```

To upgrade just this theme to the latest tag:

```bash
hugo mod get -u github.com/splunk/hugo-theme-splunk-workshop
```

To pin to any specific version:

```bash
hugo mod get github.com/splunk/hugo-theme-splunk-workshop@vX.Y.Z
```

## Local development with `replace`

When you're developing a fix to the theme alongside your site, point the module at your local checkout:

```toml
# In your site's hugo.toml
[module]
  [[module.imports]]
    path = "github.com/splunk/hugo-theme-splunk-workshop"

  [[module.replacements]]
    path        = "github.com/splunk/hugo-theme-splunk-workshop"
    replacement = "/Users/you/code/hugo-theme-splunk-workshop"
```

Now your site renders against your local theme checkout. Save a file in the theme; your site reloads. When you're done, remove the `[[module.replacements]]` block (or comment it out) and the module pin reasserts itself.

## Overriding individual files

Hugo's union filesystem means **any file in your site overrides the same file in the theme**. So if you want a custom header without forking:

```text
your-site/
└── layouts/
    └── partials/
        └── header.html      # ← yours wins over the theme's
```

Hugo's resolution order:

1. Your site's `layouts/`
2. Theme's `layouts/`

Same goes for `assets/`, `static/`, `i18n/`, `data/`, and `archetypes/`. Your file is used; the theme's file is ignored.

This is the cleanest way to customize the theme — no fork, no patch, just create a same-named file in your site.

{{< notice warning "Don't override what you don't have to" >}}
Every file you override is a file you'll have to maintain when the theme updates. Override the smallest unit possible — usually a partial, not a full layout. And document why in a comment at the top of the file.
{{< /notice >}}

## Submodule alternative

If Go modules aren't an option (corporate firewalls, build constraints, preference), git submodules give you a similar setup minus the version pinning:

```bash
git submodule add https://github.com/splunk/hugo-theme-splunk-workshop.git \
  themes/hugo-theme-splunk-workshop
git submodule update --init --recursive
```

In `hugo.toml`:

```toml
theme = "hugo-theme-splunk-workshop"
```

To upgrade to the latest:

```bash
cd themes/hugo-theme-splunk-workshop
git pull origin main
cd ../..
git add themes/hugo-theme-splunk-workshop
git commit -m "chore: bump theme"
```

The submodule pins to a specific commit, so it has version-control benefits — just less ergonomic than `hugo mod`.
