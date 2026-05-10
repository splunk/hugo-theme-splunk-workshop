# Contributing

Thanks for considering a contribution. The theme is small enough that you can read it end-to-end in an afternoon — start with `layouts/_default/baseof.html` and follow the partials.

## Dev environment

You need:

- **Hugo extended ≥ 0.125** (`brew install hugo`, `apt install hugo`, or pull a binary from [gohugo.io/installation](https://gohugo.io/installation/))
- **Go ≥ 1.18** (only if you're testing Hugo Modules wiring)
- **GNU Make** (the bundled Makefile uses standard targets; if you don't have `make`, the equivalent `hugo` commands are in the Makefile itself)

## Local loop

```bash
git clone https://github.com/splunk/hugo-theme-splunk-workshop.git
cd hugo-theme-splunk-workshop
make serve         # http://localhost:1313 — live reload on file save
```

Open the `Shortcode Reference` page in the demo for a working example of every shortcode in context. When you change a CSS file or template, Hugo reloads automatically.

```bash
make check         # build with strict logging
make build         # production build
make stats         # line counts for templates / CSS / JS
make clean         # remove caches and build output
```

## Code conventions

### Templates (`layouts/`)

- BEM-ish class naming: `.block`, `.block__element`, `.block--modifier`.
- Whitespace-control delimiters (`{{- -}}`) inside shortcodes that emit HTML — Goldmark treats indented HTML as code blocks when called via `{{% %}}`.
- Render hooks live under `layouts/_default/_markup/` — keep them small and bounded.
- Partials use `{{ return … }}` for typed returns; partials that just emit markup don't.

### Stylesheets (`assets/css/`)

- One concern per file. Order matters — they're concatenated by `head.html` in this sequence: `reset → typography → layout → components → code → shortcodes → print`.
- Use CSS custom properties for colors, fonts, spacing — not hardcoded values.
- Dark-mode overrides go inside `[data-theme="dark"] { … }`.
- Use `:focus-visible`, never `:focus` — keyboard-only focus rings.
- No CSS-in-JS, no PostCSS, no preprocessors. Plain CSS only.

### JavaScript (`assets/js/`)

- ES modules. One file per concern. Each exports a single `init…` function called from `main.js`.
- No dependencies. No bundler. `js.Build` (esbuild under the hood) inlines the imports.
- Wrap every `localStorage` read/write in a try/catch — Safari private mode can throw.
- Respect `prefers-reduced-motion` for any animation longer than ~150ms.

### Shortcodes (`layouts/shortcodes/`)

- A shortcode that has nested children stores them via parent-keyed `Scratch` buckets (see `tabs.html`/`tab.html` and `quiz.html`/`quiz-option.html`).
- Always handle the percent (`{{% %}}`) form by emitting HTML on a single contiguous block with no leading whitespace — see `children.html` for the canonical example.
- Document each shortcode's args at the top of its template in a Go-template comment.
- Add new shortcodes to the demo's `Shortcode Reference` page so reviewers can see them.

### i18n (`i18n/en.yaml`)

Every user-facing string lives here. New strings: add the key in alphabetical-ish order and reference via `{{ i18n "myKey" }}` in templates.

## Commit messages

Conventional Commits is encouraged but not enforced:

```text
feat(shortcode): add presenter notes block
fix(pager): scope navigation to current chapter
docs(readme): add Hugo Modules install instructions
chore(deps): bump KaTeX to 0.16.12
```

Squash on merge — small commits during PR review are fine.

## Pull requests

1. Fork → branch → push.
2. Run `make check` locally; it should be clean.
3. If you add or change a shortcode, update the `Shortcode Reference` page in the demo.
4. If you add a UI string, add it to `i18n/en.yaml` and reference via `{{ i18n }}`.
5. Update `CHANGELOG.md` under `## [Unreleased]`.
6. Open the PR with a short description, screenshots if visual.

## Releasing

(For maintainers.)

1. Update `CHANGELOG.md` — move `Unreleased` items under a new `## [x.y.z] — YYYY-MM-DD` heading.
2. `git tag -s vX.Y.Z` and `git push --tags`.
3. Hugo Modules consumers can now pin to the new version: `hugo mod get github.com/splunk/hugo-theme-splunk-workshop@vX.Y.Z`.

## Questions

Open an issue with the `question` label or start a discussion. Bug reports should include:

- Hugo version (`hugo version`)
- OS
- A minimal `_index.md` or `hugo.toml` that reproduces the issue
- What you saw vs. what you expected
