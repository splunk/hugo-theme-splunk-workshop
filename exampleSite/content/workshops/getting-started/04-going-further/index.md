+++
title       = "Going Further"
description = "Wrap up, grab the cheat sheet, and pick your next workshop."
time        = "10 min"
difficulty  = "beginner"
authors     = ["Splunk Workshop Team", "Robert Castley"]
weight      = 40
tags        = ["wrap-up", "reference"]
+++

{{< lead >}}
You shipped a working Splunk install, ingested data, and turned raw events into a dashboard. The rest is repetition and depth. This page is your wrap-up: a video summary, a cheat sheet to take home, downloadable starter configs, and pointers to the workshops most people tackle next.
{{< /lead >}}

{{< presenter >}}
For instructors: the next 10 minutes are for Q&A and the LinkedIn cert link. Drop the video if you're short on time — the cheat sheet and follow-on workshops are the high-value takeaways.
{{< /presenter >}}

## Where you are now

You've completed three sessions: {{< relref "/workshops/getting-started/01-introduction" >}} (the tour), {{< relref "/workshops/getting-started/02-installation" >}} (your first install), and {{< relref "/workshops/getting-started/03-first-search" >}} (SPL + dashboards). That's the full beginner arc.

Throughout, you've been working against {{< icon "shield" >}} **{{< siteparam "brandName" >}}** Workshop edition — a lightly-themed Splunk Enterprise build with our OpenTelemetry Collector pinned at version `{{< otel-version >}}`. The same SPL, the same UI, the same data model as production.

If you want a quick rule of thumb for {{< textcolor color="#FF007F" weight="bold" >}}when to use what{{< /textcolor >}}: use SPL for ad-hoc investigations, dashboards for trend tracking, and alerts for anything you'd want to wake up about at 3am.

## 60-second recap

A short video walkthrough that revisits the three workflows you just used end-to-end. Swap in your own workshop video by replacing the id below.

{{< youtube dQw4w9WgXcQ >}}

## Architecture you just built

The pipeline below is what your three sessions actually assembled, end to end — agent → ingest → search/alert. Worth a screenshot.

{{< mermaid >}}
graph LR
  A[Hosts / Apps] -->|OTel SDK| B(OTel Collector)
  B -->|OTLP| C{Splunk Indexer}
  C --> D[Search Head]
  D --> E[Dashboards]
  D --> F[Alerts]
  D --> G[Reports]
{{< /mermaid >}}

{{< figure src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80" caption="Most production Splunk deployments look like this — same shape, more boxes." >}}

## The math behind your alerts

Workshop alerts use a simple standard-deviation threshold. The formula is the population variance, square-rooted:

{{< math >}}
\sigma = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(x_i - \mu)^2}
{{< /math >}}

Your alert in Session 3 fired when a metric drifted more than 2σ from its 24-hour mean — a classic streaming-stats pattern. Splunk's `streamstats` command computes this in real time.

## A single SPL block to take home

This is the search that powered the dashboard you built. Save it as a macro and reuse it on any host.

{{< highlight spl "linenos=true,hl_lines=1 3" >}}
search index=main earliest=-24h
| stats avg(response_ms) as avg, stdev(response_ms) as stdev by host
| eval upper = avg + (2 * stdev)
| where response_ms > upper
| sort -response_ms
{{< /highlight >}}

The highlighted lines are the two you'd most likely tweak: the time window (`earliest=-24h`) on line 1, and the deviation multiplier (`2 * stdev`) on line 3.

## SPL quick reference

The cheat sheet below is also available as a standalone page if you want to bookmark it. It lives in `content/snippets/cheatsheet.md` and is pulled in here via `{{</* include */>}}` so it stays in sync everywhere.

{{< include "snippets/cheatsheet" >}}

## What's next

Pick one — they're independent and run about {{< time "60–90 min" >}} each, somewhere between {{< difficulty 2 >}} and {{< difficulty 4 >}}.

{{< cards >}}
  {{< card title="Observability Cloud · 3-hour deep dive" href="/workshops/" icon="rocket" >}}
The full guided tour of metrics, traces, and logs in Splunk Observability Cloud. Pairs nicely with what you just learned.
  {{< /card >}}
  {{< card title="OpenTelemetry Collector" href="/workshops/" icon="settings" >}}
Build out the collector you saw in the architecture diagram. Agents, gateways, and pipelines for real workloads.
  {{< /card >}}
  {{< card title="Dashboards & Detectors" href="/workshops/" icon="book" >}}
Take the dashboard you built and turn its panels into real-time detectors with PagerDuty / Slack hooks.
  {{< /card >}}
{{< /cards >}}

### Pages in this workshop

For reference, here's what the full workshop tree looks like:

{{< children depth="2" >}}

{{< tree >}}
getting-started/
├── 01-introduction
├── 02-installation
├── 03-first-search
└── 04-going-further
    ├── sample-pipeline.yaml
    └── quickref.txt
{{< /tree >}}

## Deepen your understanding

A few collapsibles for the topics that came up during the workshop but didn't warrant their own section. Open whichever match your next question.

{{< expand "Why does `streamstats` outperform `stats` for alerting?" >}}
`streamstats` computes its aggregates incrementally as events arrive — it doesn't need to wait for the time bucket to close. That's the difference between an alert that fires within seconds versus one that fires at the bucket boundary.

Internally Splunk keeps a sliding window per group; memory grows with the cardinality of the `by` clause, so use it with care on high-cardinality fields.
{{< /expand >}}

{{< details summary="Common deployment topologies (single-instance vs. distributed)" >}}
Single-instance is what you ran in Session 2 — one process, all roles. Fine for workshops, dev, and small teams (under ~100 GB/day).

Distributed splits roles across hosts: indexers shard data, search heads run queries, a deployment server manages config. The threshold for splitting is usually data volume, not user count.
{{< /details >}}

## Take it home

Downloadable assets bundled with this page — drag them straight into your project.

{{< attachments >}}{{< /attachments >}}

{{< resources title="Reference files" pattern=".*\\.(yaml|txt)$" >}}{{< /resources >}}

{{< divider >}}

## Claim your certificate

Add this workshop to your LinkedIn profile in two taps — the badge is pre-filled with the workshop name, the issuing org, and today's date.

{{< button href="https://docs.splunk.com" icon="book-open" >}}Read the docs{{< /button >}}
{{< button href="https://community.splunk.com" icon="users" style="secondary" >}}Ask the community{{< /button >}}
{{< button href="#" icon="check" style="success" >}}{{< linkedin text="Add to LinkedIn" >}}{{< /button >}}

When you're ready to keep going, the next workshop is one click away.

{{< cta href="/workshops/" icon="arrow-right" iconposition="right" >}}Pick your next workshop{{< /cta >}}

{{< notice success "You're done!" >}}
You can close this tab — or keep it open for the cheat sheet. Either way: thank you for spending the hour with us, and we'll see you in the next workshop.
{{< /notice >}}
