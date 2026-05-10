// Site search — vanilla JS modal over the JSON index produced by /index.json.
//
// Triggers: header button, "/" key, Cmd/Ctrl-K. Results live-updated as you type.
// Closes: Esc, click outside, click a result.
//
// Scoring is intentionally simple — substring + word-prefix bonuses. Workshops
// rarely have enough pages to need a real ranking algorithm, and a small
// dependency-free matcher beats pulling in Fuse.js for ~50KB.

let INDEX = null;
let INDEX_LOADING = null;

async function loadIndex() {
  if (INDEX) return INDEX;
  if (INDEX_LOADING) return INDEX_LOADING;
  INDEX_LOADING = fetch("/index.json", { credentials: "same-origin" })
    .then(r => r.ok ? r.json() : [])
    .then(data => { INDEX = Array.isArray(data) ? data : []; return INDEX; })
    .catch(() => { INDEX = []; return INDEX; });
  return INDEX_LOADING;
}

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
  root.innerHTML = `
    <div class="site-search__panel">
      <div class="site-search__input-row">
        <svg class="site-search__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input class="site-search__input" type="search" placeholder="Search workshops…" aria-label="Search" autocomplete="off" spellcheck="false">
        <kbd class="site-search__esc">esc</kbd>
      </div>
      <ul class="site-search__results" role="listbox"></ul>
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
  let scrollY = 0;
  let lastResults = [];

  const open = () => {
    if (!modal) {
      modal = buildModal();
      input   = modal.querySelector(".site-search__input");
      results = modal.querySelector(".site-search__results");
      empty   = modal.querySelector(".site-search__empty");

      input.addEventListener("input", () => onQuery(input.value));
      input.addEventListener("keydown", onKey);
      modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    }
    loadIndex();
    modal.classList.add("is-open");
    // Scroll-lock the page while the modal is open. Use the body-position
    // technique rather than `documentElement.style.overflow = "hidden"`
    // because iOS Safari ignores the latter on the html element, which
    // would let the page scroll underneath the modal.
    scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    setTimeout(() => input.focus(), 30);
  };

  const close = () => {
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    window.scrollTo(0, scrollY);
    activeIdx = -1;
  };

  const setActive = (i) => {
    const items = results.querySelectorAll(".site-search__result");
    activeIdx = Math.max(0, Math.min(i, items.length - 1));
    items.forEach((el, idx) => el.classList.toggle("is-active", idx === activeIdx));
    items[activeIdx]?.scrollIntoView({ block: "nearest" });
  };

  const onQuery = (q) => {
    const terms = tokenize(q);
    lastResults = search(q);
    if (!q.trim()) {
      results.innerHTML = "";
      empty.hidden = true;
      return;
    }
    if (!lastResults.length) {
      results.innerHTML = "";
      empty.hidden = false;
      return;
    }
    empty.hidden = true;
    results.innerHTML = lastResults.map((r, i) => `
      <li>
        <a class="site-search__result ${i === 0 ? "is-active" : ""}" href="${r.url}" role="option">
          <span class="site-search__result-title">${highlight(r.title, terms)}</span>
          ${r.section ? `<span class="site-search__result-section">${escapeHtml(r.section)}</span>` : ""}
          ${r.description ? `<span class="site-search__result-desc">${highlight(r.description, terms)}</span>` : ""}
        </a>
      </li>`).join("");
    activeIdx = 0;
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
    }
  };

  // Global triggers
  document.querySelectorAll("[data-search-trigger]").forEach(btn => {
    btn.addEventListener("click", open);
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
