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

## Walkthrough

{{< step "Ingest the sample data" "1" "3 min" >}}
Splunk ships with a tutorial dataset. Upload it from the **Add Data** screen, or use the CLI:

```bash
splunk add oneshot $SPLUNK_HOME/etc/apps/search/lookups/tutorial.csv \
  -sourcetype tutorial \
  -index main
```

Once the upload finishes, switch to **Search & Reporting** and pick *Last 24 hours* as the time range.
{{< /step >}}

{{< step "Run your first SPL query" "2" "5 min" >}}
Type the following into the search bar:

```spl {file="search.spl"}
index=main sourcetype=tutorial
| stats count by status
| sort -count
```

Each pipe transforms the previous result. Read the search like a sentence:
*"From everything in `main` of sourcetype `tutorial`, count events grouped by `status`, and sort the result descending."*

You should see something like this:

| Status | Count   |
|-------:|--------:|
| 200    | 24,531  |
| 404    | 1,148   |
| 500    | 312     |
{{< /step >}}

{{< step "Visualize it" "3" "4 min" >}}
Click the **Visualization** tab, choose *Column Chart*, and Splunk renders your aggregation immediately. No JS required.

{{< image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80" alt="Column chart" caption="Status codes by frequency. Pop quiz: which one should you alert on?" >}}
{{< /step >}}

{{< step "Save it as a report" "4" "3 min" >}}
Hit **Save As → Report**. Give it a name, set a default time range, and save. You can now schedule it, share it, or pin it to a dashboard.
{{< /step >}}

## Try it yourself

{{< exercise "Find the top 5 user agents" >}}
Modify the query above to count events grouped by `useragent` instead of `status`, and limit the output to the top five.

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
`stats` is Splunk’s aggregation workhorse. `timechart` is also an aggregator, but it always groups by time — useful for line charts, not for collapsing to a single row.
{{< /quiz-feedback >}}
{{< /quiz >}}

## Where to next?

{{< card title="The full SPL reference" url="#" >}}
Every command, every modifier — searchable and bookmark-friendly.
{{< /card >}}

{{< card title="Build your first dashboard" url="#" >}}
Combine three saved searches into a live dashboard with auto-refresh.
{{< /card >}}

{{< checkpoint "You wrote, visualized, and saved your first SPL search" >}}

> SPL is what makes Splunk feel less like a database and more like a conversation with your data.

{{< badge color="accent" >}}BETA{{< /badge >}} {{< badge >}}v9.2{{< /badge >}} {{< badge color="info" >}}macOS{{< /badge >}}

{{< divider >}}

That’s the end of the **Getting Started** workshop. From here, pick a topic that matches what you want to build.
