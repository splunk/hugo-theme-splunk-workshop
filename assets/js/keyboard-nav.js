// Workshop keyboard navigation — ← / → step through pages, "?" shows shortcuts.
//
// Skipped when:
//   - the user is typing in an input/textarea/contenteditable
//   - a modifier (cmd/ctrl/alt/meta) is held — preserves browser shortcuts
//   - a tab control is focused (tabs.js owns ←/→ there)

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

export function initKeyboardNav() {
  const prev = document.querySelector(".pager__btn--prev");
  const next = document.querySelector(".pager__btn--next");
  if (!prev && !next) return;

  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (isTyping(e.target) || inTabs(e.target)) return;

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
      hint.innerHTML = `Tip: use <kbd>&larr;</kbd> and <kbd>&rarr;</kbd> to move between pages.`;
      pager.parentElement.insertBefore(hint, pager);
    }
  } catch {}
}
