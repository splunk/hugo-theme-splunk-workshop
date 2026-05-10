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

## Relearn-compatible `notice`

If you're migrating from the [hugo-theme-relearn](https://mcshelby.github.io/hugo-theme-relearn/), your existing `notice` shortcodes work without changes:

{{% notice style="tip" title="Same look, relearn syntax" %}}
The `notice` shortcode maps relearn's style values onto our internal callout types. Supported styles: `note`, `info`, `tip`, `warning`, `caution`, `danger`, `error`, `success`, `primary`, `secondary`, `default`, `code`.
{{% /notice %}}

```markdown
{{%/* notice style="tip" title="Same look, relearn syntax" */%}}
The `notice` shortcode maps relearn's style values onto our callout types.
{{%/* /notice */%}}
```

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
