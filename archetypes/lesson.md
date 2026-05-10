+++
title       = '{{ replace .File.ContentBaseName "-" " " | title }}'
description = ''
date        = '{{ .Date }}'
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
or a `{{</* terminal */>}}` block for command-line examples:

```text
$ echo "this lesson is at $PWD"
```

## Wrap up

One paragraph summarizing what the reader just built / learned, and a
pointer to the next lesson in the chapter.
