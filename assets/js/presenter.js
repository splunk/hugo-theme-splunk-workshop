// Presenter mode — toggle via pill, ?presenter=1 URL param, or "PP" key sequence.
//
// URL param is the gate: presenter controls are unavailable unless
// `?presenter=1` has been used in this browser profile at least once.
// After that one-time unlock, presenter mode preference persists locally.

const KEY = "splunk-workshop-presenter";
const KEY_UNLOCK = "splunk-workshop-presenter-unlocked";

function applyMode(on, persist = true) {
  document.documentElement.setAttribute("data-presenter", on ? "true" : "false");
  if (persist) {
    try {
      localStorage.setItem(KEY, on ? "1" : "0");
    } catch {}
  }
  const t = document.querySelector(".presenter-toggle");
  if (t) {
    t.setAttribute("aria-pressed", on ? "true" : "false");
    t.title = on ? "Presenter mode is ON — click to hide notes" : "Presenter mode is OFF — click to show notes";
  }
}

export function initPresenter() {
  /* Idempotency guard — Hugo's dev-server live reload re-injects the JS
     bundle on every change, which means initPresenter() can run multiple
     times in the same page session. Each call would otherwise stack a
     fresh click handler on the toggle pill: clicks then fire 2× / 4× /…
     toggling the mode an even number of times → looks "stuck". */
  if (document.documentElement.dataset.presenterInit === "1") return;
  document.documentElement.dataset.presenterInit = "1";

  // Initial state from URL or localStorage.
  // `?presenter=1` both enables mode and unlocks presenter controls.
  // Without the unlock, attendees do not see the pill and PP does nothing.
  const url = new URL(location.href);
  const hasParam = url.searchParams.has("presenter");
  let unlocked = false;
  let on = false;
  if (hasParam) {
    unlocked = url.searchParams.get("presenter") !== "0";
    on = unlocked;
    try {
      localStorage.setItem(KEY_UNLOCK, unlocked ? "1" : "0");
      localStorage.setItem(KEY, on ? "1" : "0");
    } catch {}
  } else {
    try {
      unlocked = localStorage.getItem(KEY_UNLOCK) === "1";
      on = unlocked && localStorage.getItem(KEY) === "1";
    } catch {}
  }

  // Render the toggle only for unlocked presenters. Keep it visible when mode
  // is on even on a page without notes so presenters can turn it back off.
  const hasNotes = !!document.querySelector(".presenter-only");
  if (unlocked && (hasNotes || on)) {
    const btn = document.createElement("button");
    btn.className = "presenter-toggle";
    btn.type = "button";
    btn.innerHTML = `<span class="presenter-toggle__dot"></span><span>Presenter</span>`;
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-presenter") !== "true";
      applyMode(next, true);
    });
    document.body.appendChild(btn);
  }

  // Initial render reflects resolved state; persistence is handled above.
  applyMode(on, false);

  // "PP" double-tap — handy for muscle memory during a talk
  let last = 0;
  document.addEventListener("keydown", (e) => {
    if (!unlocked) return;
    if (e.repeat) return;
    if (e.key !== "p" && e.key !== "P") { last = 0; return; }
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)) return;
    const now = performance.now();
    if (now - last < 500) {
      const next = document.documentElement.getAttribute("data-presenter") !== "true";
      applyMode(next, true);
      last = 0;
    } else {
      last = now;
    }
  });
}
