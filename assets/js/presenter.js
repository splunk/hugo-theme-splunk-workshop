// Presenter mode — toggle via pill, ?presenter=1 URL param, or "PP" key sequence.

const KEY = "splunk-workshop-presenter";

function applyMode(on) {
  document.documentElement.setAttribute("data-presenter", on ? "true" : "false");
  try { localStorage.setItem(KEY, on ? "1" : "0"); } catch {}
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

  // Initial state from URL or localStorage
  const url = new URL(location.href);
  let on = false;
  if (url.searchParams.has("presenter")) {
    on = url.searchParams.get("presenter") !== "0";
  } else {
    try { on = localStorage.getItem(KEY) === "1"; } catch {}
  }

  // Render the toggle pill if the page has presenter notes, OR if presenter
  // mode is currently on — without the second condition, enabling the mode
  // on one page and navigating to a page without notes would strand the user
  // with no way to turn it off.
  const hasNotes = !!document.querySelector(".presenter-only");
  if (hasNotes || on) {
    const btn = document.createElement("button");
    btn.className = "presenter-toggle";
    btn.type = "button";
    btn.innerHTML = `<span class="presenter-toggle__dot"></span><span>Presenter</span>`;
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-presenter") !== "true";
      applyMode(next);
    });
    document.body.appendChild(btn);
  }

  applyMode(on);

  // "PP" double-tap — handy for muscle memory during a talk
  let last = 0;
  document.addEventListener("keydown", (e) => {
    if (e.key !== "p" && e.key !== "P") { last = 0; return; }
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA" || e.target.isContentEditable)) return;
    const now = performance.now();
    if (now - last < 500) {
      const next = document.documentElement.getAttribute("data-presenter") !== "true";
      applyMode(next);
      last = 0;
    } else {
      last = now;
    }
  });
}
