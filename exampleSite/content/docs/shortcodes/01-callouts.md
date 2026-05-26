+++
title       = "Callouts"
description = "Six callout types via the relearn-compatible `notice` shortcode."
weight      = 10
+++

{{< lead >}}
Callouts are the most-used shortcode in any workshop. The theme ships one shortcode — `notice` — with six built-in styles, each with its own color and icon. It's a drop-in for [hugo-theme-relearn's `notice`](https://mcshelby.github.io/hugo-theme-relearn/shortcodes/notice/index.html), so existing relearn content migrates verbatim.
{{< /lead >}}

## The six styles

{{< notice tip >}}
A warm, helpful aside. Use for shortcuts, mnemonics, and "you'll thank me later" details.
{{< /notice >}}

{{< notice note >}}
A neutral aside. Useful when you want to set something off without raising an alarm.
{{< /notice >}}

{{< notice info >}}
Reference material — versions, defaults, "by the way" details.
{{< /notice >}}

{{< notice warning >}}
Heads-up. Something a careful reader needs to know before continuing.
{{< /notice >}}

{{< notice danger >}}
Hard-stop. Skipping this will break your build, lose data, or page someone at 3am.
{{< /notice >}}

{{< notice success >}}
Confirmation. Use after a checkpoint or successful exercise.
{{< /notice >}}

```markdown
{{</* notice tip */>}}
A warm, helpful aside.
{{</* /notice */>}}
```

## With a custom title

{{< notice tip "Pro move" >}}
Pass the title as the second positional argument, or `title="…"`. Falls back to the style name when omitted.
{{< /notice >}}

```markdown
{{</* notice tip "Pro move" */>}}
Use the keyboard shortcut to skip the menu altogether.
{{</* /notice */>}}
```

## Parameters

All parameters are optional. Positional 0/1/2 map to `style`/`title`/`icon`.

| Param | Notes |
| --- | --- |
| `style` | Semantic preset OR relearn colour alias. See table below. |
| `title` | Header label. Falls back to the i18n-resolved type name. |
| `icon` | Override the default icon (any [Lucide name](https://lucide.dev/) we ship). |
| `color` | Custom accent colour for the border + icon. Any CSS colour. |
| `expanded` | `"true"` (open, can collapse) / `"false"` (closed, can expand). Renders the notice as a `<details>` widget. Unset means a plain styled block. |
| `groupid` | Synced-collapse group name — multiple `<details>` notices with the same id behave like radio buttons (uses the native `<details name>` attribute). |

### Style presets

| `style=` | maps to |
| --- | --- |
| `note` (default) | `note` |
| `info` `primary` `important` | `info` |
| `tip` | `tip` |
| `warning` `caution` `orange` `yellow` | `warning` |
| `danger` `error` `red` | `danger` |
| `success` `green` | `success` |
| `blue` | `info` |
| `gray` `grey` `secondary` `code` `default` | `note` |

Style values are case-insensitive — `style="Info"` and `style="info"` resolve the same way. See [Migrating from relearn](../../advanced/05-from-relearn/) for the full migration checklist.

## Custom icon

Override the default icon with any [Lucide name](https://lucide.dev/) the theme ships (`rocket`, `shield`, `download`, etc.).

{{% notice style="tip" title="Lift off" icon="rocket" %}}
The `icon` param accepts any name from the [Icons](../07-icons/) catalog.
{{% /notice %}}

```markdown
{{%/* notice style="tip" title="Lift off" icon="rocket" */%}}
The `icon` param accepts any name from the [Icons](../07-icons/) catalog.
{{%/* /notice */%}}
```

## Collapsible

Set `expanded="true"` for an open-by-default `<details>` the reader can collapse, or `expanded="false"` for the opposite.

{{% notice style="info" title="Advanced details" expanded="false" %}}
Useful for "extra reading" or platform-specific tangents you don't want to dominate the page. The collapsed state is native browser behaviour — no JS.
{{% /notice %}}

```markdown
{{%/* notice style="info" title="Advanced details" expanded="false" */%}}
Collapsed by default; reader can expand to see the body.
{{%/* /notice */%}}
```

Use `groupid` to sync multiple `<details>` notices so opening one closes the others (native `<details name>` attribute, no JS).

## GitHub Alerts — markdown syntax

If you're authoring in plain markdown (or migrating content from a GitHub README), the theme also recognises [GitHub Alerts](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/basic-writing-and-formatting-syntax#alerts). They route through the same renderer as `notice`, so the output is identical to a shortcode invocation.

```markdown
> [!NOTE]
> Useful information that users should know.

> [!TIP]
> Helpful advice for doing things better.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

Renders as:

> [!NOTE]
> Useful information that users should know.

> [!TIP]
> Helpful advice for doing things better.

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

GitHub's five types map onto the theme's six like this:

| GitHub Alert | → | Theme callout |
| --- | --- | --- |
| `[!NOTE]` | → | `note` |
| `[!TIP]` | → | `tip` |
| `[!IMPORTANT]` | → | `info` (sky blue) |
| `[!WARNING]` | → | `warning` |
| `[!CAUTION]` | → | `danger` (red) |

GitHub doesn't have a `success` equivalent — use `{{</* notice success */>}}` for that.

## Nested callouts

A callout inside a callout sheds its box and gets a coloured vertical strip on the left edge — like a margin mark. The inner keeps its own type color so the reader still sees whether it's a tip, an info, a warning, etc.; the type icon sits at the top of the strip as the visual anchor. Works for any combination of types, on either authoring path (`{{%/* notice */%}}` or `> [!TYPE]` blockquote), and cascades to arbitrary nesting depth.

{{% notice icon="user" style="orange" title="Persona" %}}
Putting your SRE hat back on, you'd love to spot these database issues without having to log in and poke around.

> [!IMPORTANT]
> Wouldn't it be great if we could have 24/7 monitoring of every database query — and be alerted the moment something starts drifting?
{{% /notice %}}

```markdown
{{%/* notice icon="user" style="orange" title="Persona" */%}}
Putting your SRE hat back on...

> [!IMPORTANT]
> Wouldn't it be great if we could have 24/7 monitoring...
{{%/* /notice */%}}
```

Purely a visual treatment — no shortcode change. The CSS picks it up because the inner `.callout` literally lives inside the outer's `.callout__body`; the descendant selector handles it. Deep nesting (3+ levels) keeps cascading.

## Severity ladder

Visual weight escalates with severity — pick the right type and the page does the right thing automatically:

| Type | Visual treatment |
| --- | --- |
| `note` / `tip` / `info` / `success` | Soft tinted background (~7–10%), coloured left rule, small icon disc. The "quiet end" — sits next to prose without shouting. |
| `warning` | Louder background (~16%), hairline perimeter border on top of the 5px left rule. Reads as "stop and read before continuing". |
| `danger` | Full saturated red bg, white title + body + icon, soft drop shadow. Reserved for irreversible actions — data loss, prod side-effects, things you cannot undo. |

Use `danger` sparingly. Its visual cost is high by design; if everything's an emergency, nothing is. A workshop with two genuine danger blocks across 40 pages has them land properly. A workshop with twenty does not.

## When to use which

| Situation | Use |
| --- | --- |
| Helpful tip, shortcut | `notice tip` |
| Quiet aside, footnote | `notice note` |
| Reference value, version note | `notice info` |
| Be careful, common mistake | `notice warning` |
| Will break, lose data, irreversible | `notice danger` |
| Confirms something worked | `notice success` |

Callouts are noisy. Use them sparingly — three per page is the sweet spot, six is too many. If you find yourself reaching for a callout to highlight every paragraph, your prose is doing the wrong job.

{{< notice warning "Nest sparingly" >}}
Even with the strip-mark styling, a callout-inside-a-callout signals "this is a special aside on a special aside" — usually you want a list or a `step` instead. Save nesting for the cases where the inner content is genuinely a different *kind* of thing (a `Persona` framing wrapping an `Important` question, for example).
{{< /notice >}}
