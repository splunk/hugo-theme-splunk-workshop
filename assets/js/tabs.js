// Tabs — handles button clicks, ARIA, keyboard nav, and groupid sync.
//
// Authoring contract for `data-tabs-group`: when two tab sets across pages
// share a groupid, their tab LABELS must match exactly for sync to work.
// If page A has "macOS" and page B has "Mac OS", a reader who picked "macOS"
// on page A will silently land on tab index 0 on page B (because the saved
// label doesn't match). Use the same labels across pages, or use distinct
// groupids when the sets genuinely differ.

const KEY = "splunk-workshop-tabs";
function loadSelection() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); } catch { return {}; }
}
function saveSelection(map) {
  try { localStorage.setItem(KEY, JSON.stringify(map)); } catch {}
}

export function initTabs() {
  const selection = loadSelection();
  const groups = new Map();

  document.querySelectorAll("[data-tabs]").forEach((tabs) => {
    const buttons = Array.from(tabs.querySelectorAll(".tabs__btn"));
    const panels  = Array.from(tabs.querySelectorAll(".tabs__panel"));
    if (!buttons.length) return;

    const groupId = tabs.dataset.tabsGroup;

    const activate = (idx, propagate = true) => {
      buttons.forEach((b, i) => {
        const on = i === idx;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on ? "true" : "false");
        b.setAttribute("tabindex", on ? "0" : "-1");
      });
      panels.forEach((p, i) => {
        p.classList.toggle("is-active", i === idx);
        p.hidden = i !== idx;
      });
      if (groupId && propagate) {
        const label = buttons[idx]?.dataset.tabLabel;
        selection[groupId] = label;
        saveSelection(selection);
        const peers = groups.get(groupId) || [];
        peers.forEach(({ tabs: t, activate: a }) => {
          if (t === tabs) return;
          const peerButtons = Array.from(t.querySelectorAll(".tabs__btn"));
          const found = peerButtons.findIndex(b => b.dataset.tabLabel === label);
          if (found >= 0) a(found, false);
        });
      }
    };

    buttons.forEach((b, i) => {
      b.addEventListener("click", () => activate(i));
      b.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); activate((i + 1) % buttons.length); buttons[(i + 1) % buttons.length].focus(); }
        if (e.key === "ArrowLeft")  { e.preventDefault(); const n = (i - 1 + buttons.length) % buttons.length; activate(n); buttons[n].focus(); }
      });
    });

    if (groupId) {
      const peers = groups.get(groupId) || [];
      peers.push({ tabs, activate });
      groups.set(groupId, peers);
    }

    // Honor saved selection
    let initial = 0;
    if (groupId && selection[groupId]) {
      const idx = buttons.findIndex(b => b.dataset.tabLabel === selection[groupId]);
      if (idx >= 0) initial = idx;
    }
    activate(initial, false);
  });
}
