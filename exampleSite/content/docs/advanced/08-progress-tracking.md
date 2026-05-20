+++
title       = "Workshop progress tracking"
description = "Pink dot in the sidebar next to every page the attendee has visited — no config, no account, no backend."
weight      = 25
+++

{{< lead >}}
Every workshop page an attendee dwells on for 2 seconds gets remembered. The theme paints a small pink dot in the sidebar next to every page they've already visited, so it's instantly obvious what's been covered and what's still ahead. State lives in the attendee's browser only — no account, no backend, no telemetry.
{{< /lead >}}

## What an attendee sees

After visiting two lessons in a four-lesson workshop:

```text
splunk> Workshop

• Introduction          ← visited, pink dot in the gutter
• Installation          ← visited
  Your First Search     ← current page (bold + accent border)
  Going Further         ← not yet visited
```

The dot intensifies (full opacity, slight scale-up) on the active page so the "you're here" signal is never lost.

## How it works

- On every workshop page, the sidebar emits a `data-workshop-root="<path>"` attribute on `<aside class="sidebar">`. The workshop root is the section the [`workshop-root.html`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/layouts/_partials/workshop-root.html) partial returns — typically `/<lang>/<category>/<workshop>/` or `/<lang>/<workshop>/` for flat workshops.
- Every link in the sidebar tree gets a `data-page-url="<RelPermalink>"` attribute.
- After 2 seconds on a workshop page, the client-side `workshop-progress.js` module appends the current URL to a localStorage entry keyed by the workshop root.
- On every subsequent page load, the module re-paints `.is-visited` on every matching link in the sidebar.

The 2-second dwell prevents an accidental click from polluting the visited set; attendees who tab past a lesson and immediately leave don't get it marked.

## State

Inspect the state in DevTools → Application → Local Storage:

```json
{
  "splunk-workshop:visited": "{\"/en/splunk4rookies/observability-cloud-short/\":[\"/en/splunk4rookies/observability-cloud-short/1-workshop-goals/\",\"/en/splunk4rookies/observability-cloud-short/2-opentelemetry/\"]}"
}
```

The outer key is constant; the inner JSON is a map from workshop-root URL to an array of visited page URLs. Multiple workshops on the same site track independently — finishing Workshop A doesn't appear to affect progress in Workshop B.

## Resetting progress

There's no UI button — attendees who want a fresh start clear the `splunk-workshop:visited` localStorage entry via DevTools, or use their browser's "Clear site data" option. The theme doesn't surface a "Reset progress" button because the audience (workshop attendees in a guided session) almost never wants one; surfacing it would just risk accidental clicks.

If you author content for a context where reset is needed, add a small footer button to your own `layouts/_partials/footer.html` override that calls `localStorage.removeItem("splunk-workshop:visited")` and reloads the page.

## Why no counter or percentage?

An earlier iteration showed a "X of Y lessons · N%" bar at the top of the sidebar. We dropped it because the count is ambiguous when a section hub holds multiple workshops — an attendee viewing one 20-page workshop inside a hub of three doesn't want to see "5 of 99 lessons" worth of progress (the other 79 belong to workshops they'll never take).

The pink dot per visited page communicates the same information without committing to a denominator: you see what you've done, you see what's ahead, you don't see false totals.

## Privacy

- All state is in the attendee's browser's localStorage.
- Nothing is sent to a server.
- No cookies, no fingerprinting, no third-party tracking.
- Clearing site data or using a private/incognito window discards everything.

{{< notice info "Built-in, no config" >}}
There's no toggle. Progress tracking is on for every workshop page that has a sidebar. If you don't want it, override [`assets/js/workshop-progress.js`](https://github.com/splunk/hugo-theme-splunk-workshop/blob/main/assets/js/workshop-progress.js) in your site to no-op the `initWorkshopProgress` export, or remove the call from `assets/js/main.js`.
{{< /notice >}}
