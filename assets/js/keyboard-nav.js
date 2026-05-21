// Workshop keyboard navigation — ← / → step between pages, ? shows shortcuts.
//
// Skipped when:
//   - the user is typing in an input/textarea/contenteditable
//   - a modifier (cmd/ctrl/alt/meta) is held — preserves browser shortcuts
//     (Shift IS allowed because the `?` shortcut requires Shift+/)
//   - a tab control is focused (tabs.js owns ←/→ there)

import { lock, unlock } from "./scroll-lock.js";

function isTyping(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target.isContentEditable;
}

function inTabs(target) {
  return !!(target && target.closest && target.closest(".tabs__btn"));
}

const HINT_KEY = "splunk-workshop-kbd-hint";

function markHintSeen() {
  try { localStorage.setItem(HINT_KEY, "1"); } catch {}
}

// Help overlay — built lazily on first `?` press, then reused.
let helpEl = null;

function buildHelp() {
  const root = document.createElement("div");
  root.className = "kbd-help";
  root.setAttribute("hidden", "");
  root.innerHTML = `
    <div class="kbd-help__panel" role="dialog" aria-modal="true" aria-labelledby="kbd-help-title">
      <h2 id="kbd-help-title" class="kbd-help__title">Keyboard shortcuts</h2>
      <dl class="kbd-help__list">
        <div><dt><kbd>&larr;</kbd> <kbd>&rarr;</kbd></dt><dd>Previous / next page</dd></div>
        <div><dt><kbd>/</kbd></dt><dd>Open search</dd></div>
        <div><dt><kbd>&uarr;</kbd> <kbd>&darr;</kbd></dt><dd>Navigate search results</dd></div>
        <div><dt><kbd>Enter</kbd></dt><dd>Open selected search result</dd></div>
        <div><dt><kbd>Esc</kbd></dt><dd>Close any modal or menu</dd></div>
        <div><dt><kbd>P</kbd> <kbd>P</kbd></dt><dd>Toggle presenter mode (double-tap)</dd></div>
        <div><dt><kbd>?</kbd></dt><dd>Show this dialog</dd></div>
      </dl>
      <button type="button" class="kbd-help__close" aria-label="Close">Close (Esc)</button>
    </div>`;
  // Click outside the panel closes
  root.addEventListener("click", (e) => {
    if (e.target === root) closeHelp();
  });
  root.querySelector(".kbd-help__close").addEventListener("click", closeHelp);
  document.body.appendChild(root);
  return root;
}

function isHelpOpen() {
  return helpEl && !helpEl.hasAttribute("hidden");
}

function openHelp() {
  if (!helpEl) helpEl = buildHelp();
  if (isHelpOpen()) return;
  helpEl.removeAttribute("hidden");
  lock();
  // Focus the close button so Esc / Enter immediately work for keyboard users
  setTimeout(() => helpEl.querySelector(".kbd-help__close")?.focus(), 30);
}

function closeHelp() {
  if (!isHelpOpen()) return;
  helpEl.setAttribute("hidden", "");
  unlock();
}

export function initKeyboardNav() {
  const prev = document.querySelector(".pager__btn--prev");
  const next = document.querySelector(".pager__btn--next");

  document.addEventListener("keydown", (e) => {
    // Esc closes the help overlay even when modals/typing checks would block.
    if (e.key === "Escape" && isHelpOpen()) { closeHelp(); return; }

    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isTyping(e.target) || inTabs(e.target)) return;

    // `?` is Shift+/ on most layouts; e.key normalises to "?".
    if (e.key === "?") {
      e.preventDefault();
      if (isHelpOpen()) closeHelp(); else openHelp();
      return;
    }

    if (e.key === "ArrowLeft" && prev) {
      e.preventDefault();
      markHintSeen();
      window.location.href = prev.href;
    } else if (e.key === "ArrowRight" && next) {
      e.preventDefault();
      markHintSeen();
      window.location.href = next.href;
    }
  });

  // Hint the affordance: small pill above the pager on first visit.
  try {
    if (!localStorage.getItem(HINT_KEY) && (prev || next)) {
      const pager = (prev || next).parentElement;
      const hint = document.createElement("p");
      hint.className = "pager__hint";
      hint.innerHTML = `Tip: use <kbd>&larr;</kbd> and <kbd>&rarr;</kbd> to move between pages, or press <kbd>?</kbd> for all shortcuts.`;
      pager.parentElement.insertBefore(hint, pager);
    }
  } catch {}
}
