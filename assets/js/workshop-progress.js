// Workshop progress tracking — paints a "visited" dot in the sidebar next to
// every page the attendee has dwelled on for 2 seconds.
//
// State is localStorage-backed and scoped per workshop root, so a site with
// multiple workshops keeps progress streams separate.
//
// Three localStorage keys:
//   splunk-workshop:visited  — { <root>: [<url>, …] } per-workshop URL list
//                              (populated by initWorkshopProgress when a
//                              workshop sidebar is on the page)
//   splunk-workshop:totals   — { <root>: <count>   } total navigable links
//                              counted from the sidebar at visit time
//   splunk-workshop:pages    — [ <url>, … ]            every URL the user has
//                              dwelled on, regardless of context. Drives
//                              completion for single-page leaf sections
//                              (cards with data-section-pages="1") that
//                              don't have a workshop sidebar to count from.
// Three keys (not one nested object) keep the `visited` shape backwards-
// compatible with state from older releases.

const KEY        = "splunk-workshop:visited";
const TOTALS_KEY = "splunk-workshop:totals";
const PAGES_KEY  = "splunk-workshop:pages";
const DWELL_MS   = 2000;

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}
function write(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}
function readTotals() {
  try { return JSON.parse(localStorage.getItem(TOTALS_KEY) || "{}"); }
  catch { return {}; }
}
function writeTotal(root, count) {
  try {
    const t = readTotals();
    t[root] = count;
    localStorage.setItem(TOTALS_KEY, JSON.stringify(t));
  } catch {}
}
function readPages() {
  try { return new Set(JSON.parse(localStorage.getItem(PAGES_KEY) || "[]")); }
  catch { return new Set(); }
}
function markPageVisited(url) {
  try {
    const pages = readPages();
    pages.add(url);
    localStorage.setItem(PAGES_KEY, JSON.stringify(Array.from(pages)));
  } catch {}
}

export function initWorkshopProgress() {
  const sidebar = document.querySelector(".sidebar[data-workshop-root]");
  if (!sidebar) return;
  const root = sidebar.dataset.workshopRoot;
  if (!root) return;

  const links = Array.from(sidebar.querySelectorAll("[data-page-url]"));
  if (links.length === 0) return;

  // Cache the total link count for this workshop root so card-completion
  // on parent pages can compare against the same number the tree-roll-up
  // here uses. Refreshed every visit so workshop content changes
  // (pages added/removed) are picked up automatically.
  writeTotal(root, links.length);

  const state = read();
  const visited = new Set(state[root] || []);

  // Walk each <details> chapter group; if every descendant page link inside
  // it carries .is-visited, mark the group's <summary> as .is-complete so
  // the user sees a roll-up indicator without expanding the branch.
  // Recursive by construction — `:scope [data-page-url]` matches nested
  // sub-chapter leaves too, so completeness propagates up the tree.
  const repaintCompleteness = () => {
    const groups = sidebar.querySelectorAll(".sidebar-tree__group");
    for (const g of groups) {
      const descendants = g.querySelectorAll(":scope [data-page-url]");
      const all = descendants.length > 0 &&
        Array.from(descendants).every(a => a.classList.contains("is-visited"));
      const summary = g.querySelector(":scope > details > summary");
      summary?.classList.toggle("is-complete", all);
    }
  };

  // Paint visited dots from existing state.
  for (const a of links) {
    if (visited.has(a.dataset.pageUrl)) a.classList.add("is-visited");
  }
  repaintCompleteness();

  // Mark the current page visited after dwell, unless it's already there.
  const currentUrl = window.location.pathname;
  const onWorkshopPage = links.some(a => a.dataset.pageUrl === currentUrl);
  if (!onWorkshopPage || visited.has(currentUrl)) return;

  const handle = window.setTimeout(() => {
    visited.add(currentUrl);
    state[root] = Array.from(visited);
    write(state);
    const active = links.find(a => a.dataset.pageUrl === currentUrl);
    active?.classList.add("is-visited");
    repaintCompleteness();
  }, DWELL_MS);

  // Cancel the dwell timer if the attendee leaves before it completes —
  // accidental clicks shouldn't pollute the visited set. `pagehide` fires
  // reliably on iOS + bfcache where `beforeunload` doesn't; pair it with
  // `visibilitychange` so tab-switches also cancel.
  const cancel = () => window.clearTimeout(handle);
  window.addEventListener("pagehide", cancel, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") cancel();
  }, { once: true });
}

// Universal page dwell — records the current page URL into the
// `splunk-workshop:pages` set after 2 seconds, regardless of whether
// the page sits inside a workshop sidebar. Lets leaf-section cards
// (data-section-pages="1") light up after a single visit, since a
// single-page _index.md has no workshop sidebar for initWorkshopProgress
// to count from. Runs alongside initWorkshopProgress; workshop pages
// end up in both stores (negligible cost, simpler logic).
export function initPageDwell() {
  const url = window.location.pathname;
  const pages = readPages();
  if (pages.has(url)) return;

  const handle = window.setTimeout(() => { markPageVisited(url); }, DWELL_MS);
  const cancel = () => window.clearTimeout(handle);
  window.addEventListener("pagehide", cancel, { once: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") cancel();
  }, { once: true });
}

// Card completion — runs on ANY page that has cards with
// `data-section-root`. Two strategies:
//
//   1. Multi-page workshop card — compare per-workshop visited count to
//      the total the sidebar wrote when the user last visited.
//   2. Leaf section card (data-section-pages="1") — check the universal
//      pages set; a single visit is "complete".
//
// Strategy 1 totals are written by initWorkshopProgress on visit. A
// workshop the user has never opened can't be marked complete via
// strategy 1 — there's no recorded total to compare against. Strategy 2
// kicks in for leaf cards (Hugo emits data-section-pages="1" when
// children-count returns 0).
export function initCardCompletion() {
  const cards = document.querySelectorAll("[data-section-root]");
  if (cards.length === 0) return;
  const state  = read();
  const totals = readTotals();
  const pages  = readPages();

  for (const card of cards) {
    const root = card.dataset.sectionRoot;
    if (!root) continue;

    // Strategy 2: leaf section — single-page completion via the universal
    // pages set. Cheap to check first; covers the common "I read a
    // standalone reference page" case.
    const leaf = card.dataset.sectionPages === "1";
    if (leaf) {
      if (pages.has(root)) card.classList.add("is-complete");
      continue;
    }

    // Strategy 1: multi-page workshop — need totals (written by the
    // sidebar on visit) and a visited list to compare.
    const total = totals[root];
    if (!Number.isFinite(total) || total <= 0) continue;

    // Find the localStorage workshop-root whose URL prefixes this card's
    // section root — the visited URL list lives there. Most often the
    // card's section IS the workshop root, but a nested category card
    // (e.g. /scenarios/foo/ inside workshop /scenarios/) also resolves
    // via the prefix fallback. First match wins; the filter below
    // narrows to URLs under the card's root regardless of which bucket
    // we picked, so non-determinism here is safe.
    let visited = state[root] || [];
    if (visited.length === 0) {
      for (const wsRoot of Object.keys(state)) {
        if (root.startsWith(wsRoot)) { visited = state[wsRoot]; break; }
      }
    }
    const visitedUnderRoot = visited.filter(u => u.startsWith(root));
    if (visitedUnderRoot.length >= total) {
      card.classList.add("is-complete");
    }
  }
}
