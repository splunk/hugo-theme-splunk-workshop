// Browse ("See all") page — live client-side filter over the rendered
// workshop rows. No index fetch needed; the rows are already in the DOM.
// Filters on the row's visible text (title + description + meta), hides
// empty category groups, hides the "recently updated" rail while a query
// is active, and shows an empty-state message when nothing matches.

export function initBrowse() {
  const input = document.querySelector("[data-browse-filter]");
  if (!input) return;

  const rows = Array.from(document.querySelectorAll(".ws-row"));
  const cats = Array.from(document.querySelectorAll("[data-browse-cat]"));
  const recent = document.querySelector("[data-browse-recent]");
  const empty = document.querySelector("[data-browse-empty]");

  // Cache each row's searchable text once.
  const haystacks = new Map(rows.map((r) => [r, r.textContent.toLowerCase()]));

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let anyVisible = false;

    rows.forEach((r) => {
      const hit = !q || haystacks.get(r).includes(q);
      r.hidden = !hit;
      if (hit) anyVisible = true;
    });

    // Collapse categories with no visible rows.
    cats.forEach((c) => {
      const hasVisible = c.querySelector(".ws-row:not([hidden])");
      c.hidden = !hasVisible;
    });

    if (recent) recent.hidden = q.length > 0;
    if (empty) empty.hidden = anyVisible;
  };

  input.addEventListener("input", apply);
}
