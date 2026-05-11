// Language switcher dropdown — open/close on click, close on outside-click or Esc.

export function initLangSwitch() {
  const root = document.querySelector("[data-lang-switch]");
  if (!root) return;
  const btn = root.querySelector("[data-lang-switch-toggle]");
  const menu = root.querySelector(".lang-switch__menu");
  if (!btn || !menu) return;

  const open = () => {
    menu.hidden = false;
    btn.setAttribute("aria-expanded", "true");
  };
  const close = () => {
    menu.hidden = true;
    btn.setAttribute("aria-expanded", "false");
  };

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    menu.hidden ? open() : close();
  });
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
