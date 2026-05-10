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
  // Initial state from URL or localStorage
  const url = new URL(location.href);
  let on = false;
  if (url.searchParams.has("presenter")) {
    on = url.searchParams.get("presenter") !== "0";
  } else {
    try { on = localStorage.getItem(KEY) === "1"; } catch {}
  }

  // Render the toggle pill if the page has presenter notes
  const hasNotes = document.querySelector(".presenter-only");
  if (hasNotes) {
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
