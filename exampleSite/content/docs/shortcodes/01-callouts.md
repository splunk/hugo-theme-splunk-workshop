+++
title       = "Callouts"
description = "Six callout types in two flavors — native shortcodes and the relearn-compatible `notice` alias."
weight      = 10
+++

{{< lead >}}
Callouts are the most-used shortcode in any workshop. The theme ships six types, each with its own color and icon.
{{< /lead >}}

## Native shortcodes

{{< tip >}}
A warm, helpful aside. Use for shortcuts, mnemonics, and "you'll thank me later" details.
{{< /tip >}}

{{< note >}}
A neutral aside. Useful when you want to set something off without raising an alarm.
{{< /note >}}

{{< info >}}
Reference material — versions, defaults, "by the way" details.
{{< /info >}}

{{< warning >}}
Heads-up. Something a careful reader needs to know before continuing.
{{< /warning >}}

{{< danger >}}
Hard-stop. Skipping this will break your build, lose data, or page someone at 3am.
{{< /danger >}}

{{< success >}}
Confirmation. Use after a checkpoint or successful exercise.
{{< /success >}}

## With a custom title

{{< tip "Pro move" >}}
All callouts accept an optional title argument as the first positional or `title="…"`. Falls back to the type name when omitted.
{{< /tip >}}

```markdown
{{</* tip "Pro move" */>}}
Use the keyboard shortcut to skip the menu altogether.
{{</* /tip */>}}
```

## The generic `callout`

The typed callouts (`tip`, `note`, `info`, `warning`, `danger`, `success`) are sugar for one underlying shortcode: `{{</* callout type="…" */>}}`. Reach for the generic form when the type comes from a variable, when you want to author a single callout that picks its type from front-matter, or when you're generating callouts programmatically from a parent shortcode. For day-to-day workshop authoring, prefer the typed shortcuts — they're tighter to read.

{{< callout "tip" "Same as `{{< tip >}}`" >}}
Positional args: type first, optional title second. Named args (`type=`, `title=`) work too.
{{< /callout >}}

```markdown
{{</* callout "tip" "Same as {{< tip >}}" */>}}
Positional args: type first, optional title second.
{{</* /callout */>}}
```

## Relearn-compatible `notice`

If you're migrating from the [hugo-theme-relearn](https://mcshelby.github.io/hugo-theme-relearn/), your existing `notice` shortcodes work without changes:

{{% notice style="tip" title="Same look, relearn syntax" %}}
The `notice` shortcode maps relearn's style values onto our internal callout types. Supported semantic styles: `note`, `info`, `tip`, `warning`, `caution`, `important`, `danger`, `error`, `success`, `primary`, `secondary`, `default`, `code`.
{{% /notice %}}

```markdown
{{%/* notice style="tip" title="Same look, relearn syntax" */%}}
The `notice` shortcode maps relearn's style values onto our callout types.
{{%/* /notice */%}}
```

It also accepts relearn's colour-name styles for content that authored against the old palette:

| relearn style | maps to | notes |
| --- | --- | --- |
| `blue` | `info` | |
| `green` | `success` | |
| `orange`, `yellow` | `warning` | |
| `red` | `danger` | |
| `gray`, `grey` | `note` | |
| `important` | `warning` | yellow-tinted in relearn |

Style values are case-insensitive — `style="Info"` and `style="info"` resolve the same way. See [Migrating from relearn](../../advanced/05-from-relearn/) for the full migration checklist.

## When to use which

| Situation | Use |
| --- | --- |
| Helpful tip, shortcut | `tip` |
| Quiet aside, footnote | `note` |
| Reference value, version note | `info` |
| Be careful, common mistake | `warning` |
| Will break, lose data, irreversible | `danger` |
| Confirms something worked | `success` |

Callouts are noisy. Use them sparingly — three per page is the sweet spot, six is too many. If you find yourself reaching for a callout to highlight every paragraph, your prose is doing the wrong job.

{{< warning "Don't nest callouts" >}}
Visually noisy and ARIA-unfriendly. If you need a callout inside a callout, you almost always want a list or a `step` instead.
{{< /warning >}}
