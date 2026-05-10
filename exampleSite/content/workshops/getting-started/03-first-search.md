+++
title       = "Your First Search"
description = "Ingest sample data, write SPL, and turn raw events into a dashboard."
duration    = "20 min"
difficulty  = "beginner"
weight      = 30
tags        = ["spl", "search", "dashboards"]
+++

{{< lead >}}
SPL is the language Splunk speaks. It reads left-to-right like a Unix pipeline, and you’ll be fluent enough to build a dashboard before this page ends.
{{< /lead >}}

{{< step "Ingest the sample data" "1" "3 min" >}}
Splunk ships with a tutorial dataset. Upload it from the **Add Data** screen, or use the CLI:

```bash
splunk add oneshot $SPLUNK_HOME/etc/apps/search/lookups/tutorial.csv \
  -sourcetype tutorial -index main
```
{{< /step >}}

{{< step "Run your first SPL query" "2" "5 min" >}}
```spl {file="search.spl"}
index=main sourcetype=tutorial
| stats count by status
| sort -count
```

Each pipe transforms the previous result. Read the search like a sentence:
*"From everything in `main` of sourcetype `tutorial`, count events grouped by `status`, and sort the result descending."*
{{< /step >}}

{{< step "Save it as a report" "3" "3 min" >}}
Hit **Save As → Report**. Give it a name, set a default time range, and save. You can now schedule it, share it, or pin it to a dashboard.
{{< /step >}}

## Try it yourself

{{< exercise "Find the top 5 user agents" >}}
Modify the query above to count events grouped by `useragent`, limited to the top five.

{{< solution >}}
```spl
index=main sourcetype=tutorial
| stats count by useragent
| sort -count
| head 5
```

`head 5` truncates the result to the first five rows after sorting.
{{< /solution >}}
{{< /exercise >}}

## Quick check

{{< quiz question="Which command aggregates events into a single row?" >}}
{{< quiz-option >}}`timechart`{{< /quiz-option >}}
{{< quiz-option correct=true >}}`stats`{{< /quiz-option >}}
{{< quiz-option >}}`eval`{{< /quiz-option >}}
{{< quiz-option >}}`rex`{{< /quiz-option >}}
{{< quiz-feedback >}}
`stats` is Splunk's aggregation workhorse. `timechart` is also an aggregator, but it always groups by time.
{{< /quiz-feedback >}}
{{< /quiz >}}

{{< checkpoint "You wrote, visualized, and saved your first SPL search" >}}
