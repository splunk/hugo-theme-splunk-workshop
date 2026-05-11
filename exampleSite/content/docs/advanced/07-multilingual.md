+++
title       = "Multilingual sites"
description = "Author the same workshop in multiple languages with per-language content trees and an auto-rendering language switcher."
weight      = 70
+++

{{< lead >}}
The theme ships ready for multilingual content but doesn't *force* it. Single-language sites need no setup; once you opt in, the header gains a language switcher and Hugo gates each translation behind its own URL prefix.
{{< /lead >}}

## Decide your strategy

Hugo offers two ways to organise multilingual content:

1. **Translation by filename** — `post.md`, `post.ja.md` side-by-side. Good for ~1:1 translations of small sites.
2. **Translation by directory** — `content/en/`, `content/ja/`, …, each a parallel content tree. Better for workshops: each language can diverge in structure, screenshots, and even chapter ordering.

This theme assumes strategy 2 (directory-per-language). The included language switcher and pager both work either way, but the examples below all use directory-per-language.

## Turn it on

In your `hugo.toml`, uncomment / paste in the block below:

```toml
defaultContentLanguage           = "en"
defaultContentLanguageInSubdir   = true

[languages]
  [languages.en]
    label      = "English"
    locale     = "en"
    weight     = 1
    contentDir = "content/en"
  [languages.ja]
    label          = "日本語"
    locale         = "ja"
    weight         = 2
    hasCJKLanguage = true
    contentDir     = "content/ja"
```

Key fields:

| Field | Why |
| --- | --- |
| `defaultContentLanguage` | Which language wins when content exists in only one. |
| `defaultContentLanguageInSubdir` | When `true`, the default language also gets a `/en/` URL prefix (no naked-root content). Recommended for consistency. |
| `[languages.<code>].label` | The display name shown in the header switcher dropdown. |
| `[languages.<code>].locale` | Hugo's internal locale code (used for `<html lang>`, date formatting, etc.). |
| `[languages.<code>].weight` | Order in the switcher dropdown (lowest first). |
| `[languages.<code>].contentDir` | Where this language's `_index.md` and pages live. |
| `[languages.<code>].hasCJKLanguage` | `true` for Chinese, Japanese, Korean — improves Hugo's word-counting and tokenisation. |

The theme's [`hugo.toml`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/hugo.toml) at the repo root has the same block commented out as a copy-paste starter.

## Lay out your content

Mirror the directory tree under each language root:

```text
content/
├── en/
│   ├── _index.md                 # English homepage
│   ├── docs/
│   │   └── _index.md
│   └── workshops/
│       ├── _index.md
│       └── getting-started/
│           ├── _index.md
│           ├── 01-introduction.md
│           └── 02-installation.md
└── ja/
    ├── _index.md                 # Japanese homepage
    ├── docs/
    │   └── _index.md
    └── workshops/
        ├── _index.md
        └── getting-started/
            ├── _index.md
            ├── 01-introduction.md
            └── 02-installation.md
```

Each language tree is independent — translations don't need to match 1:1. If Japanese doesn't have a `customizing` doc yet, just leave that section out of `content/ja/`. Hugo won't show broken links for missing translations; the language switcher gracefully falls back to the target language's home page when no direct translation exists.

## Translate the UI strings

The theme's own UI copy (button labels, pager next/previous, callout titles, etc.) is keyed in `i18n/en.yaml`. Copy that file alongside in your site's `i18n/` directory for each additional language:

```bash
mkdir -p i18n
cp themes/hugo-theme-splunk-workshop/i18n/en.yaml i18n/ja.yaml
```

Translate the right-hand strings:

```yaml
- id: previous
  translation: "前へ"
- id: next
  translation: "次へ"
- id: tip
  translation: "ヒント"
# … etc
```

Hugo automatically picks the right file based on the current page's language. Hot-reload the dev server after adding `i18n/ja.yaml`.

## The language switcher

Once `len site.Languages > 1`, the header automatically gains a language switcher pill. It links to the current page's translation when one exists ([`.AllTranslations`](https://gohugo.io/methods/page/translations/)) and falls back to the target language's home otherwise. No additional config needed.

The pill displays the current language's locale code (`EN`, `JA`); the dropdown lists each language's `label` (`English`, `日本語`).

## Build and serve

```bash
hugo server
```

Hugo prints page counts per language at the top of the build summary. Visit `/en/` and `/ja/` (or use the switcher) and verify both render.

```text
                  │  EN  │  JA  
──────────────────┼──────┼──────
 Pages            │  142 │  142
```

## Edge cases

- **`hreflang` tags**: Hugo emits these automatically in `<head>` when a page has translations.
- **RSS feeds**: Each language gets its own RSS at `/<lang>/index.xml`.
- **Search**: The bundled fuzzy search builds a separate index per language and only searches the current language.
- **Date and number formatting**: Set `locale` per-language so Hugo uses the right ICU rules.
- **RTL languages**: Set `languageDirection = "rtl"` under the language block; the theme honours it via `<html dir="rtl">`.

## See also

- [Migrating from hugo-theme-relearn](../05-from-relearn/) — relearn's `multilingualMode` maps closely to Hugo's standard directory-per-language model.
- Hugo's docs: [Multilingual mode](https://gohugo.io/content-management/multilingual/).
