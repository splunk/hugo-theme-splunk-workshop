// Site search — vanilla JS modal over the JSON index produced by the home
// page's JSON output format. The actual path is language- and baseURL-
// dependent (`/en/index.json`, `/ja/index.json`, `/workshop/en/index.json`,
// …); the URL is read at runtime from the `<meta name="search-index-url">`
// tag Hugo emits in head.html.
//
// Triggers: header button, "/" key, Cmd/Ctrl-K. Results live-updated as you type.
// Closes: Esc, click outside, click a result.
//
// Scoring is intentionally simple — substring + word-prefix bonuses. Workshops
// rarely have enough pages to need a real ranking algorithm, and a small
// dependency-free matcher beats pulling in Fuse.js for ~50KB.

import { lock, unlock } from "./scroll-lock.js";

let INDEX = null;
let WORKSHOPS = [];
let INDEX_LOADING = null;

async function loadIndex() {
  if (INDEX) return INDEX;
  if (INDEX_LOADING) return INDEX_LOADING;
  // Read the index URL from the meta tag Hugo emits — it accounts for the
  // site's baseURL (subpath included) AND the active language under
  // `defaultContentLanguageInSubdir`. The `/index.json` fallback only fires
  // on sites that explicitly disabled the home `JSON` output format; under
  // multilingual + subdir it'll 404, but that's a deliberate site-level
  // config choice. Better a graceful empty-result search than a hard crash.
  const url = document.querySelector('meta[name="search-index-url"]')?.content
              || "/index.json";
  INDEX_LOADING = fetch(url, { credentials: "same-origin" })
    .then(r => r.ok ? r.json() : {})
    .then(data => {
      // New shape: { pages, workshops }. Old shape: a bare array (= pages).
      if (Array.isArray(data)) { INDEX = data; WORKSHOPS = []; }
      else {
        INDEX = Array.isArray(data.pages) ? data.pages : [];
        WORKSHOPS = Array.isArray(data.workshops) ? data.workshops : [];
      }
      return INDEX;
    })
    .catch(() => { INDEX = []; WORKSHOPS = []; return INDEX; });
  return INDEX_LOADING;
}

// Relative time from a Unix-seconds timestamp (workshop .lastmod). Mirrors
// the browse/reltime.html partial so the overlay and page agree.
function relTime(unix) {
  if (!unix) return "";
  const days = Math.floor((Date.now() / 1000 - unix) / 86400);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return days + " days ago";
  if (days < 30) return Math.floor(days / 7) + "w ago";
  if (days < 365) return Math.floor(days / 30) + "mo ago";
  return Math.floor(days / 365) + "y ago";
}
const isRecent = (unix) => unix && (Date.now() / 1000 - unix) < 14 * 86400;

function tokenize(q) {
  return q.toLowerCase().split(/\s+/).filter(Boolean);
}

function score(entry, terms) {
  const haystacks = [
    [entry.title || "",       18],
    [entry.linkTitle || "",   12],
    [entry.section || "",      6],
    [(entry.tags || []).join(" "), 5],
    [entry.description || "",  4],
    [entry.summary || "",      1],
  ];
  let total = 0;
  for (const term of terms) {
    let termHit = 0;
    for (const [text, w] of haystacks) {
      const t = text.toLowerCase();
      if (!t) continue;
      // word-boundary prefix match scores higher
      if (new RegExp("\\b" + escapeRe(term)).test(t)) termHit += w * 2;
      else if (t.includes(term))                       termHit += w;
    }
    if (termHit === 0) return 0;
    total += termHit;
  }
  return total;
}

function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}

function highlight(text, terms) {
  if (!text) return "";
  let out = escapeHtml(text);
  for (const term of terms) {
    if (!term) continue;
    out = out.replace(new RegExp("(" + escapeRe(term) + ")", "ig"), "<mark>$1</mark>");
  }
  return out;
}

function search(query, max = 12) {
  const terms = tokenize(query);
  if (!terms.length) return [];
  const scored = [];
  for (const entry of INDEX || []) {
    const s = score(entry, terms);
    if (s > 0) scored.push({ s, entry });
  }
  scored.sort((a, b) => b.s - a.s);
  return scored.slice(0, max).map(({ entry }) => entry);
}

function buildModal() {
  const root = document.createElement("div");
  root.className = "site-search";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Search");
  /* Combobox pattern (WAI-ARIA 1.2): the input is the only Tab stop;
     `aria-controls` points at the listbox; arrow keys move the
     virtually-focused option via `aria-activedescendant`, set in
     setActive() below. Screen readers announce option changes as
     the user arrows through results. */
  root.innerHTML = `
    <div class="site-search__panel">
      <div class="site-search__input-row">
        <svg class="site-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="site-search__input" type="search" placeholder="Search workshops…" aria-label="Search" role="combobox" aria-controls="site-search-results" aria-autocomplete="list" aria-expanded="false" autocomplete="off" spellcheck="false">
        <kbd class="site-search__esc">esc</kbd>
      </div>
      <ul class="site-search__results" id="site-search-results" role="listbox" aria-label="Search results"></ul>
      <p class="site-search__empty" hidden>No matches</p>
      <div class="site-search__footer">
        <span><kbd>&uarr;</kbd> <kbd>&darr;</kbd> navigate</span>
        <span><kbd>&crarr;</kbd> select</span>
        <span><kbd>esc</kbd> close</span>
      </div>
    </div>`;
  document.body.appendChild(root);
  return root;
}

export function initSearch() {
  let modal, input, results, empty;
  let activeIdx = -1;
  let isOpen = false;
  let lastResults = [];
  // Element that had focus before the modal opened — focus returns here on
  // close so keyboard users land back on the trigger that opened the modal,
  // not at the top of <body>.
  let lastTrigger = null;

  const open = (trigger) => {
    if (isOpen) return;
    if (!modal) {
      modal = buildModal();
      input   = modal.querySelector(".site-search__input");
      results = modal.querySelector(".site-search__results");
      empty   = modal.querySelector(".site-search__empty");

      input.addEventListener("input", () => onQuery(input.value));
      input.addEventListener("keydown", onKey);
      modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    }
    lastTrigger = trigger || document.activeElement;
    // Once the index resolves, render the browse-all list if the user
    // hasn't started typing — the empty state is a workshop directory.
    loadIndex().then(() => { if (isOpen && !input.value.trim()) renderEmptyState(); });
    modal.classList.add("is-open");
    input.setAttribute("aria-expanded", "true");
    lock();
    isOpen = true;
    setTimeout(() => input.focus(), 30);
  };

  const close = () => {
    if (!modal || !isOpen) return;
    modal.classList.remove("is-open");
    input.setAttribute("aria-expanded", "false");
    input.removeAttribute("aria-activedescendant");
    unlock();
    isOpen = false;
    activeIdx = -1;
    if (lastTrigger && typeof lastTrigger.focus === "function") {
      lastTrigger.focus();
    }
    lastTrigger = null;
  };

  const setActive = (i) => {
    const items = results.querySelectorAll(".site-search__result");
    activeIdx = Math.max(0, Math.min(i, items.length - 1));
    items.forEach((el, idx) => {
      el.classList.toggle("is-active", idx === activeIdx);
      el.setAttribute("aria-selected", idx === activeIdx ? "true" : "false");
    });
    const active = items[activeIdx];
    if (active) {
      input.setAttribute("aria-activedescendant", active.id);
      active.scrollIntoView({ block: "nearest" });
    } else {
      input.removeAttribute("aria-activedescendant");
    }
  };

  // Empty-query state = "browse all areas" — the top-level workshop
  // collections (categories), one per row, as a jump-to-area shortcut.
  // Reuses `.site-search__result` so arrow-key nav + Enter work unchanged.
  const renderEmptyState = () => {
    empty.hidden = true;
    if (!WORKSHOPS.length) { results.innerHTML = ""; return; }
    let html = `<li class="site-search__hint" role="presentation">Browse all areas — type to search every page</li>`;
    WORKSHOPS.forEach((w, i) => {
      const badge = isRecent(w.lastmod)
        ? `<span class="site-search__badge site-search__badge--updated">Updated</span>` : "";
      const count = w.count ? `${w.count} workshop${w.count === 1 ? "" : "s"} · ` : "";
      html += `
        <li>
          <a class="site-search__result ${i === 0 ? "is-active" : ""}" href="${w.url}" id="site-search-opt-${i}" role="option" aria-selected="${i === 0 ? "true" : "false"}">
            <span class="site-search__result-title">${escapeHtml(w.title)}${badge}</span>
            <span class="site-search__result-section">${count}updated ${relTime(w.lastmod)}</span>
            ${w.description ? `<span class="site-search__result-desc">${escapeHtml(w.description)}</span>` : ""}
          </a>
        </li>`;
    });
    results.innerHTML = html;
    activeIdx = 0;
    const first = results.querySelector(".site-search__result");
    if (first) input.setAttribute("aria-activedescendant", first.id);
  };

  const onQuery = (q) => {
    const terms = tokenize(q);
    if (!q.trim()) { renderEmptyState(); return; }
    lastResults = search(q);
    if (!lastResults.length) {
      results.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    results.innerHTML = lastResults.map((r, i) => `
      <li>
        <a class="site-search__result ${i === 0 ? "is-active" : ""}" href="${r.url}" id="site-search-opt-${i}" role="option" aria-selected="${i === 0 ? "true" : "false"}">
          <span class="site-search__result-title">${highlight(r.title, terms)}</span>
          ${r.section ? `<span class="site-search__result-section">${escapeHtml(r.section)}</span>` : ""}
          ${r.description ? `<span class="site-search__result-desc">${highlight(r.description, terms)}</span>` : ""}
        </a>
      </li>`).join("");
    activeIdx = 0;
    // Sync aria-activedescendant after rendering so the first result is
    // announced to screen readers as the virtually-focused option.
    const first = results.querySelector(".site-search__result");
    if (first) input.setAttribute("aria-activedescendant", first.id);
  };

  const onKey = (e) => {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(activeIdx + 1); return; }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActive(activeIdx - 1); return; }
    if (e.key === "Enter") {
      e.preventDefault();
      const items = results.querySelectorAll(".site-search__result");
      const link = items[activeIdx];
      if (link) { window.location.href = link.href; }
      return;
    }
    // Trap Tab inside the input — combobox pattern keeps focus on input,
    // arrow keys do option navigation. Without this, Tab leaves the modal
    // and focus disappears behind the overlay.
    if (e.key === "Tab") { e.preventDefault(); }
  };

  // Global triggers
  document.querySelectorAll("[data-search-trigger]").forEach(btn => {
    btn.addEventListener("click", () => open(btn));
  });
  document.addEventListener("keydown", (e) => {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)) return;
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault(); open(); return;
    }
    if (e.key === "/") {
      if (modal && modal.classList.contains("is-open")) return;
      e.preventDefault(); open(); return;
    }
  });
}
