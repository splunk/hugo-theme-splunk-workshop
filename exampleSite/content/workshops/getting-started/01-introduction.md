+++
title       = "Introduction"
description = "What you’ll build, what you need, and a 60-second tour of the toolchain."
duration    = "5 min"
difficulty  = "beginner"
weight      = 10
tags        = ["overview", "setup"]
+++

{{< lead >}}
Welcome. Over the next hour, you’ll go from an empty terminal to a working Splunk dashboard with live, queryable data. We’ll move quickly — but every step has an escape hatch if you get stuck.
{{< /lead >}}

## Why this workshop

Splunk is at its best when you see results in minutes, not days. This workshop is intentionally hands-on: you’ll be typing into a real terminal, pressing real keys, and watching real events stream in.

{{< objectives >}}
- Install Splunk Enterprise locally
- Ingest a small sample dataset
- Run your first search using SPL
- Save it as a report and add it to a dashboard
{{< /objectives >}}

{{< prerequisites >}}
- A Mac, Linux, or Windows machine with **8 GB of RAM** free
- Comfort using a terminal (you won’t need to be an expert)
- About **60 minutes** of uninterrupted time
{{< /prerequisites >}}

## What you’ll build

By the end, your dashboard will look something like this:

{{< image src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80" alt="Dashboard preview" caption="Sample dashboard — yours will track ingestion rate, top sourcetypes, and event latency." >}}

{{< slides title="The Splunk data pipeline in five slides" >}}

## The pipeline

Splunk takes **raw events**, runs them through a small set of well-named stages, and gives you back a queryable index.

The whole loop:

```text
forwarder → indexer → search head
```

---

## Forwarder

A small agent that watches files or sockets and ships events.

- Runs on the host generating the data
- Tails logs, reads syslog, listens on a TCP port
- Cheap, stateless, easy to deploy

---

## Indexer

Where events come to rest.

- Parses, timestamps, and stores events
- Owns the on-disk index
- Answers searches from the search head

---

## Search head

The query brain.

- Speaks SPL
- Dispatches sub-searches to indexers
- Aggregates, ranks, and renders results

---

## What you'll build today

By the end of this workshop, all three stages will be running on **your machine**, ingesting a sample dataset, and answering a search.

Close this deck and read on for the install.
{{< /slides >}}

## How this guide works

Every workshop in this series follows the same shape:

1. A short framing section like this one
2. A series of **steps** with code, commands, and screenshots
3. **Exercises** to reinforce — with collapsible solutions
4. A **checkpoint** at the end so you know everything’s wired up

{{< notice tip "Read first, run second" >}}
We strongly recommend skimming each step before typing anything. The narrative tells you *why*; the commands only tell you *what*.
{{< /notice >}}

{{< notice note >}}
This theme was designed to feel like a beautifully typeset technical book — slow down, settle in, and enjoy the prose.
{{< /notice >}}

## A note on shortcuts

Throughout the workshop, keyboard shortcuts appear like this: press {{< kbd "Cmd+K" >}} to open the command palette, or {{< kbd "Ctrl+Shift+P" >}} on Windows.

When you’re ready, click **Next** to install Splunk.
