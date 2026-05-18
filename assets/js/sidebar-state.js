// Persist sidebar <details> expand state across in-tab navigations.
//
// Native <details> open state is server-rendered per page based on whether
// the current page lives under that section ($isOnPath in sidebar-tree.html).
// Without this script, every navigation collapses any section the user had
// manually expanded — which makes the link they just clicked jump upward on
// the new page and breaks orientation.
//
// State is scoped per workshop root and lives in sessionStorage so it lasts
// only while the tab is open (fresh tab = fresh tree, no long-term cruft).

export function initSidebarState() {
  const sidebar = document.querySelector(".sidebar[data-workshop-root]");
  if (!sidebar) return;
  const root = sidebar.dataset.workshopRoot;
  if (!root) return;

  const KEY = `splunk-workshop:sidebar-open:${root}`;
  const groups = sidebar.querySelectorAll(".sidebar-tree__group > details[data-section-url]");
  if (groups.length === 0) return;

  let saved;
  try { saved = new Set(JSON.parse(sessionStorage.getItem(KEY) || "[]")); }
  catch { saved = new Set(); }

  // Restore: any section the user has opened in this tab stays open across
  // navigations, even when it's no longer on the active page's path.
  for (const d of groups) {
    if (saved.has(d.dataset.sectionUrl)) d.open = true;
  }

  const persist = () => {
    const opened = Array.from(groups)
      .filter(d => d.open)
      .map(d => d.dataset.sectionUrl);
    try { sessionStorage.setItem(KEY, JSON.stringify(opened)); }
    catch {}
  };

  // Save on every toggle so we capture user-initiated opens AND closes.
  for (const d of groups) {
    d.addEventListener("toggle", persist);
  }

  // Also persist the current state immediately. This captures the SSR-default
  // $isOnPath section so it sticks across the next navigation, even if the
  // user never manually toggles anything.
  persist();
}
