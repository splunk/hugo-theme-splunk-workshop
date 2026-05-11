// Workshop progress tracking — paints a "visited" dot in the sidebar next to
// every page the attendee has dwelled on for 2 seconds.
//
// State is localStorage-backed and scoped per workshop root, so a site with
// multiple workshops keeps progress streams separate.

const KEY = "splunk-workshop:visited";
const DWELL_MS = 2000;

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}
function write(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function initWorkshopProgress() {
  const sidebar = document.querySelector(".sidebar[data-workshop-root]");
  if (!sidebar) return;
  const root = sidebar.dataset.workshopRoot;
  if (!root) return;

  const links = Array.from(sidebar.querySelectorAll("[data-page-url]"));
  if (links.length === 0) return;

  const state = read();
  const visited = new Set(state[root] || []);

  // Paint visited dots from existing state.
  for (const a of links) {
    if (visited.has(a.dataset.pageUrl)) a.classList.add("is-visited");
  }

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
  }, DWELL_MS);

  // If the attendee leaves before the dwell completes, cancel — accidental
  // clicks shouldn't pollute the visited set.
  window.addEventListener("beforeunload", () => window.clearTimeout(handle), { once: true });
}
