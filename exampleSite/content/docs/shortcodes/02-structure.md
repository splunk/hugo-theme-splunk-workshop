+++
title       = "Workshop structure"
description = "Steps, exercises, solutions, checkpoints, quizzes, objectives, prerequisites."
weight      = 20
+++

{{< lead >}}
These shortcodes give a workshop its skeleton — the steps the reader follows, the exercises they try, and the milestones that confirm they're on track.
{{< /lead >}}

## Steps

{{< step "Auto-numbered with a gradient marker" "1" "5 min" >}}
Steps are the backbone of any procedure. Each one auto-increments via Hugo's `Scratch` so you don't have to renumber when you reorder.

```bash
echo "Steps can contain anything — code, callouts, tables, anything."
```
{{< /step >}}

{{< step "The next one in the sequence" "2" "2 min" >}}
A faint connecting line runs between consecutive steps so the eye doesn't lose place when scrolling fast.
{{< /step >}}

```markdown
{{</* step "Auto-numbered with a gradient marker" "1" "5 min" */>}}
Steps are the backbone of any procedure...
{{</* /step */>}}
```

The third positional arg is an optional time hint that renders next to the step title. Omit it for steps that aren't time-bounded.

## Exercise + Solution

{{< exercise "Find the slowest endpoint" >}}
Modify the SPL below to return the **single slowest** request grouped by URI, by p95 response time.

```spl
index=web sourcetype=access_combined
| stats avg(response_time) as avg by uri
```

{{< solution >}}
```spl
index=web sourcetype=access_combined
| stats perc95(response_time) as p95 by uri
| sort -p95
| head 1
```

`perc95` gives the 95th percentile; `head 1` truncates after the sort.
{{< /solution >}}
{{< /exercise >}}

```markdown
{{</* exercise "Find the slowest endpoint" */>}}
... problem ...

{{</* solution */>}}
... reveal-on-click answer ...
{{</* /solution */>}}
{{</* /exercise */>}}
```

The `solution` is a `<details>` element — collapsed by default, accessible by keyboard, no JS required.

## Checkpoint

{{< checkpoint "Reached the end of the structural shortcodes" >}}

```markdown
{{</* checkpoint "Reached the end of the structural shortcodes" */>}}
```

A milestone marker. Use these at the end of a logical chunk so the reader gets a small dopamine hit and a clear "I'm on track" signal.

## Objectives & Prerequisites

{{< objectives >}}
- Understand each shortcode in the theme
- Pick the right one for a given situation
- Compose them into a great workshop
{{< /objectives >}}

{{< prerequisites >}}
- A working Hugo install (any 0.125+)
- Comfort using a terminal
- About 30 minutes of uninterrupted time
{{< /prerequisites >}}

```markdown
{{</* objectives */>}}
- Understand each shortcode in the theme
- Pick the right one for a given situation
{{</* /objectives */>}}

{{</* prerequisites */>}}
- A working Hugo install (any 0.125+)
- Comfort using a terminal
{{</* /prerequisites */>}}
```

Place these at the top of a workshop so the reader can self-select before committing.

## Quiz

{{< quiz question="Which callout should you use to flag a destructive command?" >}}
{{< quiz-option >}}`tip`{{< /quiz-option >}}
{{< quiz-option >}}`note`{{< /quiz-option >}}
{{< quiz-option correct=true >}}`danger`{{< /quiz-option >}}
{{< quiz-option >}}`success`{{< /quiz-option >}}
{{< quiz-feedback >}}
`danger` (red) is reserved for hard-stops where the reader can lose data or break their build. `warning` (orange) is for "be careful" — different severity.
{{< /quiz-feedback >}}
{{< /quiz >}}

```markdown
{{</* quiz question="Which callout should you use to flag a destructive command?" */>}}
{{</* quiz-option */>}}`tip`{{</* /quiz-option */>}}
{{</* quiz-option correct=true */>}}`danger`{{</* /quiz-option */>}}
{{</* quiz-feedback */>}}
`danger` is reserved for hard-stops...
{{</* /quiz-feedback */>}}
{{</* /quiz */>}}
```

Mark the right answer with `correct=true`. The quiz reveals the correct answer when the user clicks any option, and shows the feedback prose below.

## Collapsibles: `expand` and `details`

{{< expand "Click to reveal" >}}
The `expand` shortcode is great for "click to learn more" details — historical context, alternative approaches, or anything that would derail the main narrative if always visible.
{{< /expand >}}

{{< details summary="What is SPL?" name="qa" >}}
SPL — the Splunk Processing Language — is a piped query language modelled on Unix commands.
{{< /details >}}

{{< details summary="What is a sourcetype?" name="qa" >}}
A label that tells Splunk how to parse the events in a feed (e.g. `access_combined`, `json`, `linux:audit`).
{{< /details >}}

```markdown
{{</* expand "Click to reveal" */>}}...{{</* /expand */>}}

{{</* details summary="What is SPL?" name="qa" */>}}...{{</* /details */>}}
{{</* details summary="What is a sourcetype?" name="qa" */>}}...{{</* /details */>}}
```

`expand` is a single collapsible. `details` with the same `name` form a radio group — opening one closes the others.
