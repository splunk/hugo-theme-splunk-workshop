// Theme toggle — simple binary toggle between light and dark.
//
// Behaviour:
//   - Default mode for first visits is `auto` (set in hugo.toml `defaultMode`).
//     The inline script in <head> resolves auto → light/dark via
//     `prefers-color-scheme` so the page paints with the right colors.
//   - Click the toggle: switch to whichever mode is NOT currently displayed.
//     One click always moves you to the opposite of what you're seeing.
//     The choice is persisted in localStorage (explicit override of `auto`).
//   - Shift+click (or right-click): reset back to `auto` (follow the OS).
//
// The cycle through three states (light → dark → auto → light) was confusing —
// from the default `auto` it took two clicks to reach dark. Simple toggle wins.

const KEY = "splunk-workshop-theme";
const VALID = new Set(["light", "dark", "auto"]);

export function getMode() {
  const v = localStorage.getItem(KEY);
  return VALID.has(v) ? v : "auto";
}

function resolved() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function applyMode(mode) {
  const root = document.documentElement;
  const r = mode === "auto"
    ? (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
    : mode;
  root.setAttribute("data-theme", r);
  root.setAttribute("data-theme-mode", mode);
}

export function setMode(mode) {
  if (!VALID.has(mode)) return;
  if (mode === "auto") {
    try { localStorage.removeItem(KEY); } catch {}
  } else {
    try { localStorage.setItem(KEY, mode); } catch {}
  }
  applyMode(mode);
}

function tooltipFor(mode) {
  if (mode === "auto") return "Theme: auto · click to switch · shift-click to reset";
  const opposite = resolved() === "dark" ? "light" : "dark";
  return `Switch to ${opposite} mode (shift-click to follow system)`;
}

function refresh(btn) {
  const mode = getMode();
  btn.setAttribute("aria-label", tooltipFor(mode));
  btn.setAttribute("title", tooltipFor(mode));
  btn.dataset.themeMode = mode;            // exposes mode for CSS targeting
}

export function initThemeToggle() {
  const btn = document.querySelector("[data-theme-toggle]");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    if (e.shiftKey) {
      setMode("auto");
    } else {
      setMode(resolved() === "dark" ? "light" : "dark");
    }
    refresh(btn);
  });

  btn.addEventListener("contextmenu", (e) => {
    // right-click resets to auto without bringing up the OS menu
    e.preventDefault();
    setMode("auto");
    refresh(btn);
  });

  // Re-evaluate when the OS scheme changes, but only while in auto mode
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
    if (getMode() === "auto") {
      applyMode("auto");
      refresh(btn);
    }
  });

  refresh(btn);
}
