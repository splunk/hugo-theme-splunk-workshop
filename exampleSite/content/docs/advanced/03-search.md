+++
title       = "Search index"
description = "How the client-side search works and how to tune it."
weight      = 30
+++

{{< lead >}}
The theme ships a fully self-contained client-side search — no Algolia, no external service, no build step. Press `/` to try it.
{{< /lead >}}

## How it works

When Hugo builds your site, it emits a `/index.json` file containing every regular page's title, description, section, URL, tags, and a 600-character summary of the body. The JavaScript modal fetches this file once on first open, scores entries against the user's query with a small substring + word-prefix matcher, and renders the top 12 results.

```text
Build time:
  hugo → public/index.json (one JSON document, ~50KB for 200 pages)

Run time (first / press):
  fetch('/index.json') → cached in module
  user types → score(entry, terms) → top 12 → render
```

No server, no API, no external service. The whole index is one HTTP request and one parse.

## Triggers

Three ways to open the search modal:

| Trigger | Detail |
| --- | --- |
| Click the search pill in the header | The "Search workshops…" button with the `/` keyboard hint |
| Press `/` | Anywhere on the site (except inside an input) |
| Press `⌘K` (Mac) or `Ctrl+K` | The "macOS Spotlight" convention |

Inside the modal:

- `↑` / `↓` — navigate results
- `Enter` — open the highlighted result
- `Esc` — close

## Required Hugo config

Make sure `JSON` is enabled for the home output in `hugo.toml`:

```toml
[outputs]
  home    = ["HTML", "RSS", "JSON"]
  section = ["HTML", "RSS"]
  page    = ["HTML"]
```

Without `JSON` in `home`, no `index.json` is emitted and the search returns no results.

## What gets indexed

The index template `layouts/_default/index.json` includes every page where `Params.hidden` is not `true`. Each entry has:

```json
{
  "title": "Your First Search",
  "linkTitle": "Your First Search",
  "description": "Ingest sample data and write SPL.",
  "section": "Getting Started",
  "url": "/workshops/getting-started/03-first-search/",
  "tags": ["spl", "search"],
  "summary": "First 600 chars of the rendered plain-text body..."
}
```

To exclude a page from search, set `hidden: true` in front matter. The page still renders at its URL but disappears from the index (and from sidebar/pager listings — the same flag controls all of them).

## Scoring

The matcher (`assets/js/search.js`) uses a deliberately simple algorithm:

```text
For each search term:
  for each haystack (title, linkTitle, section, tags, description, summary):
    if term has a word-boundary match in haystack: +weight × 2
    else if haystack contains term: +weight × 1

Sum across all terms. If any term has zero hits, the entry is excluded.
```

Field weights (highest to lowest): `title` (18), `linkTitle` (12), `section` (6), `tags` (5), `description` (4), `summary` (1).

That keeps title matches dominant, body matches barely-present. Workshops rarely have enough pages to need a real ranking algorithm — Fuse.js or Lunr would add 50KB+ for marginal benefit.

## Tuning

To change the ranking:

1. Open `assets/js/search.js`.
2. Edit the `score()` function — adjust field weights or add new haystacks.
3. Override `assets/js/search.js` in your site to keep the change.

To change the index shape:

1. Open `layouts/_default/index.json`.
2. Add or remove fields per entry.
3. Update `search.js` to read the new fields.

## When to swap to a real search engine

If your workshop site grows past **~500 pages** or you need fuzzy matching, typo tolerance, or facets, consider:

- **[Pagefind](https://pagefind.app/)** — drop-in static-site search, runs at build time, very capable. Works alongside this theme — just override `_partials/chrome/head.html` and `_partials/chrome/footer.html` to load Pagefind.
- **Algolia DocSearch** — free for OSS docs, hosted, blazing fast.

Both replace the bundled search, not augment it. Until you hit those scale points, the bundled search is enough.
