// Mobile sidebar toggle.

export function initMobileNav() {
  const btn = document.querySelector("[data-menu-btn]");
  const sidebar = document.querySelector(".sidebar");
  if (!btn || !sidebar) return;

  const sync = () => btn.setAttribute("aria-expanded", sidebar.classList.contains("is-open") ? "true" : "false");
  const close = () => { sidebar.classList.remove("is-open"); sync(); };

  btn.setAttribute("aria-expanded", "false");
  if (!btn.hasAttribute("aria-controls") && sidebar.id) {
    btn.setAttribute("aria-controls", sidebar.id);
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("is-open");
    sync();
  });
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  sidebar.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
}
