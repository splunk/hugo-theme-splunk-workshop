// Mobile sidebar toggle.

export function initMobileNav() {
  const btn = document.querySelector("[data-menu-btn]");
  const sidebar = document.querySelector(".sidebar");
  if (!btn || !sidebar) return;

  const close = () => sidebar.classList.remove("is-open");

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.toggle("is-open");
  });
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !btn.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  sidebar.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
}
