// Mobile sidebar toggle.

export function initMobileNav() {
  const btn = document.querySelector("[data-menu-btn]");
  const sidebar = document.querySelector(".sidebar");
  if (!btn) return;
  // No workshop sidebar on this page (home, docs hub, etc.) — hide the
  // hamburger entirely so it doesn't look like a dead button. Search and
  // theme-toggle remain visible in the header on mobile.
  if (!sidebar) { btn.hidden = true; return; }

  // Sidebar becomes a fixed overlay below 820px — inert the rest so focus
  // stays trapped inside the nav.
  const overlayBreakpoint = window.matchMedia("(max-width: 820px)");
  const inertTargets = ["main", ".site-footer"]
    .map((sel) => document.querySelector(sel))
    .filter(Boolean);

  const sync = () => {
    const open = sidebar.classList.contains("is-open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    const trap = open && overlayBreakpoint.matches;
    inertTargets.forEach((el) => { el.inert = trap; });
  };
  const close = () => { sidebar.classList.remove("is-open"); sync(); };

  btn.setAttribute("aria-expanded", "false");
  if (!btn.hasAttribute("aria-controls") && sidebar.id) {
    btn.setAttribute("aria-controls", sidebar.id);
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("is-open");
    sync();
    if (sidebar.classList.contains("is-open") && overlayBreakpoint.matches) {
      const firstLink = sidebar.querySelector("a, button");
      if (firstLink) firstLink.focus();
    }
  });
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  sidebar.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
  // Recompute inert on viewport change so desktop doesn't end up with
  // inert chrome left over from a mobile-overlay state.
  overlayBreakpoint.addEventListener("change", sync);
}
