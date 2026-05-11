+++
title       = "Archetypes"
description = "`hugo new` templates that pre-fill front matter so you stay consistent."
weight      = 20
+++

{{< lead >}}
Archetypes are templates that Hugo uses when you run `hugo new`. The theme ships five: `default`, `chapter`, `workshop`, `lesson`, and `exercise`. Pick the one that matches the shape of the page you're creating.
{{< /lead >}}

Each archetype is wired up to a live demo page in this site — open [Archetype examples](/docs/authoring/archetype-examples/) to see them rendered side-by-side with their source.

## The five archetypes

### `default` — generic page

```bash
hugo new content/about.md
```

Produces:

```yaml
+++
date  = '2026-05-09T12:00:00Z'
draft = true
title = 'About'
+++
```

Use for any page that isn't a workshop chapter or lesson — about pages, contact, terms of service.

→ See [Default archetype](/docs/authoring/archetype-examples/01-default/) rendered live.

### `workshop` — a workshop lesson

```bash
hugo new --kind workshop content/workshops/foo/01-intro.md
```

Produces:

```yaml
+++
title       = 'Intro'
description = ''
date        = '2026-05-09T12:00:00Z'
draft       = true
duration    = '15 min'
difficulty  = 'beginner'
weight      = 10
tags        = []
+++

{{</* objectives */>}}
- First objective
- Second objective
{{</* /objectives */>}}

{{</* prerequisites */>}}
- A working install
{{</* /prerequisites */>}}

## Introduction

Write your content here.
```

Pre-fills the typical workshop meta fields and seeds the body with `objectives` and `prerequisites` blocks.

→ See [Workshop archetype](/docs/authoring/archetype-examples/02-workshop/) rendered live.

### `chapter` — a section landing

```bash
hugo new --kind chapter content/workshops/foo/_index.md
```

Produces:

```yaml
+++
title       = 'Foo'
description = ''
date        = '2026-05-09T12:00:00Z'
draft       = true
weight      = 1
layout      = 'chapter'
+++

Discover what this chapter is about. Use this as the chapter intro.
```

The `layout = 'chapter'` is what enables the gradient-weight hero.

→ The [Archetype examples](/docs/authoring/archetype-examples/) section landing you just visited is itself rendered from the `chapter` archetype.

### `lesson` — richer lesson scaffold

```bash
hugo new --kind lesson content/workshops/foo/02-concept.md
```

Produces:

```markdown
+++
title       = 'Concept'
description = ''
date        = '2026-05-09T12:00:00Z'
draft       = true
weight      = 10
duration    = '10 min'
difficulty  = 'beginner'
tags        = []
+++

{{</* lead */>}}
One-sentence summary of what this lesson covers and why the reader should care.
{{</* /lead */>}}

## What you'll learn

{{</* objectives */>}}
- First learning objective
- Second learning objective
- Third learning objective
{{</* /objectives */>}}

## Concept

Explain the concept the lesson teaches. Keep prose tight — workshop readers
skim. Reach for shortcodes where they help:

- `{{</* tip */>}}` for shortcuts and pro moves
- `{{</* note */>}}` for caveats that aren't blocking
- `{{</* warning */>}}` for things that will break a beginner

## Walkthrough

Step-by-step. Prefer numbered `{{</* step */>}}` blocks for sequential work,
or a `{{</* terminal */>}}` block for command-line examples.

## Wrap up

One paragraph summarizing what the reader just built / learned, and a
pointer to the next lesson in the chapter.
```

Like `workshop`, but seeded with a fuller body structure that mirrors how strong workshop lessons are typically written: a one-line `lead`, an explicit *What you'll learn* `objectives` block, a *Concept* section for the prose, a *Walkthrough* for the hands-on portion, and a *Wrap up* that pivots to the next lesson. Reach for this when you want a more opinionated starting point than `workshop`.

→ See [Lesson archetype](/docs/authoring/archetype-examples/03-lesson/) rendered live.

### `exercise` — hands-on lab page

```bash
hugo new --kind exercise content/workshops/foo/03-build-a-query.md
```

Produces:

````markdown
+++
title       = 'Build A Query'
description = ''
date        = '2026-05-09T12:00:00Z'
draft       = true
weight      = 10
duration    = '15 min'
difficulty  = 'beginner'
nopager     = true
tags        = []
+++

{{</* lead */>}}
What the reader will build in this exercise. State the end-state clearly so
they know when they're done.
{{</* /lead */>}}

{{</* prerequisites */>}}
- Item one
- Item two
{{</* /prerequisites */>}}

## Steps

{{</* step "Set up the workspace" */>}}
Brief instruction for the first step.

```bash
mkdir my-exercise && cd my-exercise
```
{{</* /step */>}}

{{</* step "Run the example" */>}}
Walk through the core action. Show the expected output:

{{</* terminal */>}}
$ ./run.sh
Hello, workshop.
{{</* /terminal */>}}
{{</* /step */>}}

{{</* step "Verify your result" */>}}
What success looks like. If there's a checkpoint criterion the reader can
self-verify against, list it.

{{</* solution */>}}
The expected output / final state, hidden behind a click so readers try
first before peeking.
{{</* /solution */>}}
{{</* /step */>}}

{{</* checkpoint "You've completed the exercise" */>}}
````

A scaffold for hands-on labs that sit alongside reading lessons. Pre-seeds:

- `nopager = true` (exercises are usually launched from a parent lesson, not stepped through linearly)
- A `lead` summarising the end-state and a `prerequisites` block up top
- Three `{{</* step */>}}` blocks with `terminal` and `solution` examples
- A `{{</* checkpoint */>}}` to confirm completion

Use this when the page is a thing the reader *does*, not a thing they read.

→ See [Exercise archetype](/docs/authoring/archetype-examples/04-exercise/) rendered live.

## Custom archetypes

If your team has conventions that differ — required fields, pre-baked sections, a specific tone for intros — drop your own archetype at `archetypes/<name>.md` in your site (not the theme).

```yaml
# archetypes/lab.md
+++
title       = '{{ replace .File.ContentBaseName "-" " " | title }}'
description = ''
date        = '{{ .Date }}'
draft       = true
duration    = '30 min'
difficulty  = 'intermediate'
weight      = 10
labKit      = ''
prerequisiteLabs = []
+++

{{</* prerequisites */>}}
- List your prereq labs
{{</* /prerequisites */>}}

## Setup

## Walkthrough

## Troubleshooting

## Wrap-up
```

Then:

```bash
hugo new --kind lab content/labs/01-pcap-analysis.md
```

Hugo looks for archetypes in **your site first**, then falls back to the theme. So you can override the bundled ones if you want — drop a file at `archetypes/workshop.md` in your site to replace the theme's version.

{{< notice tip "Templating in archetypes" >}}
Archetypes are Go templates. You can use `{{ now.Format }}`, `{{ .Site.Params.X }}`, or any Hugo function. See the [Hugo docs on archetypes](https://gohugo.io/content-management/archetypes/).
{{< /notice >}}
