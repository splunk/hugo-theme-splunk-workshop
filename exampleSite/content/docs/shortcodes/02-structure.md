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

The `exercise` shortcode is the canonical way to mark a hands-on task. It renders a scoped frame with a full-bleed pink→orange gradient header bar — `◎ EXERCISE · Title` in mono caps — over a panel containing the task itself. The gradient bar is the brand-marker; no left-border accent needed. Visually distinct from a `notice` (which is informational only): the gradient bar reads as "do this thing" before the reader even gets to the title. Use it when the section *is something the reader does*.

### 1. The basic shape

{{< exercise "Find the slowest endpoint" >}}
Modify the SPL below to return the **single slowest** request grouped by URI, by p95 response time.

```text
index=web sourcetype=access_combined
| stats avg(response_time) as avg by uri
```

{{< solution >}}

```text
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

### 2. Exercise + nested warning

When an exercise needs a heads-up — *"reset your terminals first"*, *"this is destructive"* — nest a `notice` inside it. The EXERCISE label and the WARNING label belong to different visual languages (action vs. heads-up), so they read as **complementary** rather than competing boxes:

{{< exercise "Configure file storage" >}}
{{< notice warning >}}
Change ALL terminal windows to the `2-building-resilience` directory and run `clear` before continuing.
{{< /notice >}}

Open `agent.yaml` and add a `file_storage/checkpoint` extension under the existing `extensions:` block. Set `directory: "./checkpoint-dir"` and `create_directory: true`.

When you restart the collector, you should see a `file_storage` line in the startup logs.
{{< /exercise >}}

````markdown
{{</* exercise "Configure file storage" */>}}
{{</* notice warning */>}}
Change ALL terminal windows to the `2-building-resilience` directory and run `clear` before continuing.
{{</* /notice */>}}

Open `agent.yaml` and add a `file_storage/checkpoint` extension ...
{{</* /exercise */>}}
````

### 3. Multi-step exercise

When an exercise is a sequence of actions, nest `step` blocks inside `exercise` — one exercise scope, three numbered actions inside it:

{{< exercise "Add the file_storage extension" >}}
You'll add a `file_storage` extension to `agent.yaml`, then verify the collector loaded it.

{{< step "Open agent.yaml" >}}
In the Agent terminal, run `vim agent.yaml` (or your editor of choice).
{{< /step >}}

{{< step "Paste the extension block" >}}
Under the `extensions:` key, add:

```yaml
file_storage/checkpoint:
  directory: "./checkpoint-dir"
  create_directory: true
```

{{< /step >}}

{{< step "Restart and verify" >}}
Run `./restart.sh` and watch the logs. You should see `Extension started · file_storage/checkpoint`.
{{< /step >}}
{{< /exercise >}}

````markdown
{{</* exercise "Add the file_storage extension" */>}}
{{</* step "Open agent.yaml" */>}} ... {{</* /step */>}}
{{</* step "Paste the extension block" */>}} ... {{</* /step */>}}
{{</* step "Restart and verify" */>}} ... {{</* /step */>}}
{{</* /exercise */>}}
````

### 4. Tabbed exercise variants

When the same task has different paths (macOS vs Linux, Python vs Go, kubectl vs helm), wrap a `tabs` block inside `exercise`:

{{< exercise "Install the collector" >}}
Pick your platform and run the install command:

{{< tabs groupid="install-platform" >}}
{{< tab "macOS" >}}

```bash
brew install otel-collector
```

{{< /tab >}}
{{< tab "Linux" >}}

```bash
sudo apt install otel-collector
```

{{< /tab >}}
{{< tab "Windows" >}}

```powershell
choco install otel-collector
```

{{< /tab >}}
{{< /tabs >}}

{{< notice tip >}}
The `groupid` on `tabs` keeps the reader's platform choice synced across every exercise that uses the same id — they pick once, and every later exercise opens the same tab.
{{< /notice >}}
{{< /exercise >}}

### 5. When to skip the container

Not every "do this" needs an exercise frame. For a one-action task — under five lines of prose plus maybe one code block — a plain `### H3 heading` reads cleaner than wrapping it. The H3 already gets a top-border accent stripe from the theme's typography, which is plenty of scope marker:

### Try it: Adjust the percentile threshold

Edit `agent.yaml` and change `percentile: 95` to `percentile: 99`. Restart the agent.

{{< notice warning >}}
Save the file **before** restarting — otherwise the running collector picks up the old config.
{{< /notice >}}

```markdown
### Try it: Adjust the percentile threshold

Edit `agent.yaml` and change `percentile: 95` to `percentile: 99`.
Restart the agent.

{{</* notice warning */>}}
Save the file **before** restarting ...
{{</* /notice */>}}
```

Rule of thumb: use `{{</* exercise */>}}` when the section needs scope (multi-step, has a solution reveal, multiple code blocks). Use a plain H3 when it's a single action you can describe in two sentences.

### Migrating from `notice style="green"`

Some workshops mark exercises by wrapping them in a green-styled notice — a leftover convention from relearn-themed sites that didn't ship a dedicated exercise primitive. This theme does, so the convention is now: an `exercise` shortcode marks the task, a nested `notice` (any style) marks an aside.

Before:

```markdown
{{%/* notice title="Exercise" style="green" icon="running" */%}}
... exercise body, possibly with a nested warning notice ...
{{%/* /notice */%}}
```

After:

```markdown
{{</* exercise "Exercise" */>}}
... same body, unchanged ...
{{</* /exercise */>}}
```

Nested notices, terminals, code blocks, trees, and solutions all carry over verbatim. Two label badges (EXERCISE + WARNING) read as **complementary** — different visual languages. Two notice frames (green + orange) read as **stacked** — same visual language competing for attention.

## Acknowledge

For content the reader **must not skim past** — instructor-only steps, configuration that's already been done for them, irreversible warnings the workshop assumes you've understood. Renders two surfaces:

1. **An inline orange-banded block** that stays in the page for later reference.
2. **A native `<dialog>` modal** that pops on first page-load and can only be dismissed by clicking the "I understand" button. ESC is blocked; the backdrop swallows clicks. Once acknowledged, the modal stays closed on every subsequent visit.

{{< acknowledge "Only need 1 integration" >}}
Rather than each attendee setting this up, watch your instructor perform the following steps.

You will continue performing steps on the next page.
{{< /acknowledge >}}

```markdown
{{</* acknowledge "Only need 1 integration" */>}}
Rather than each attendee setting this up, watch your instructor perform
the following steps.

You will continue performing steps on the next page.
{{</* /acknowledge */>}}
```

**Acknowledgement state** lives in localStorage under `splunk-workshop:acks`, keyed by `<page-permalink>::<ordinal>` — so the same page can host multiple acknowledge blocks and each one is tracked independently. State persists across reloads and sessions; to reset for dev/demo:

```js
localStorage.removeItem("splunk-workshop:acks"); location.reload();
```

**Use it sparingly.** The whole point is that ack blocks demand engagement; if every page has one, attendees stop reading them. Reserve for content that genuinely can't be skimmed — usually "watch the instructor do this, don't do it yourself" or "the next step will delete data, don't run it twice".

**`prefers-reduced-motion`** is respected by the modal's transitions. The "I understand" button is gradient-styled and keyboard-focusable; native `<dialog>` traps focus inside the modal while it's open, so Tab cycles only through the modal's contents.

## Checkpoint

{{< checkpoint "Reached the end of the structural shortcodes" >}}

```markdown
{{</* checkpoint "Reached the end of the structural shortcodes" */>}}
```

A milestone marker. Use these at the end of a logical chunk so the reader gets a small dopamine hit and a clear "I'm on track" signal.

The title supports inline markdown — `**bold**`, `*italic*`, `` `code` ``, and `[links](…)` all render. The title itself isn't bold by default, so author emphasis carries its own weight:

{{< checkpoint "Workshop complete — **nice work!**" >}}

```markdown
{{</* checkpoint "Workshop complete — **nice work!**" */>}}
```

The shortcode is self-closing only — to attach follow-up prose, put it as regular markdown directly under the call.

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
