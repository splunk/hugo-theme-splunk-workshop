// Adds a Copy button to every <pre> code block (rendered via render-codeblock)
// and, on every individual chroma line, a small "Copy" pill that appears on
// hover so attendees can grab a single command from a multi-line script.

const ICON_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const ICON_DONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

// Strip common prompt prefixes ("$ ", "# ", "> ") so a single-line copy from
// a terminal block puts the actual command on the clipboard, not the prompt.
const PROMPT_RE = /^[ \t]*([$#>])[ \t]+/;
function cleanLineText(text) {
  return text.replace(/^\s+|\s+$/g, "").replace(PROMPT_RE, "");
}

export function initCopyCode() {
  // Block-level copy button (existing behaviour — full code block).
  document.querySelectorAll(".code-block__copy").forEach((btn) => {
    btn.innerHTML = `${ICON_COPY}<span>Copy</span>`;
    btn.addEventListener("click", async () => {
      const block = btn.closest(".code-block");
      const pre = block?.querySelector("pre");
      // Per-line .line-copy pills are injected into the DOM after render —
      // clone the <pre> and strip them before reading innerText so they
      // don't end up on the clipboard as stray "Copy" lines.
      let code = "";
      if (pre) {
        const clone = pre.cloneNode(true);
        clone.querySelectorAll(".line-copy").forEach((el) => el.remove());
        code = clone.innerText;
      }
      try {
        await navigator.clipboard.writeText(code);
        btn.innerHTML = `${ICON_DONE}<span>Copied</span>`;
        btn.classList.add("is-copied");
        setTimeout(() => {
          btn.innerHTML = `${ICON_COPY}<span>Copy</span>`;
          btn.classList.remove("is-copied");
        }, 1600);
      } catch {
        btn.innerHTML = `<span>Press ⌘C</span>`;
      }
    });
  });

  // Per-line copy pill. Chroma emits <span class="line"><span class="cl">…</span></span>
  // for every source line when noClasses=false (our config). Attach a small
  // copy affordance to every line in a chroma-rendered block. Single-line
  // blocks get no per-line buttons — the block-level Copy is enough.
  document.querySelectorAll(".code-block .chroma").forEach((chroma) => {
    const lines = chroma.querySelectorAll(":scope .line");
    if (lines.length < 2) return;
    lines.forEach((line) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "line-copy";
      pill.setAttribute("aria-label", "Copy this line");
      pill.textContent = "Copy";
      pill.addEventListener("click", async (e) => {
        e.stopPropagation();
        // Read text from the chroma <span class="cl"> child rather than the
        // whole .line — otherwise the pill's "Copy" label sneaks onto the
        // clipboard alongside the code.
        const cl = line.querySelector(".cl");
        const text = cleanLineText(cl ? cl.innerText : line.innerText);
        try {
          await navigator.clipboard.writeText(text);
          pill.textContent = "Copied";
          pill.classList.add("is-copied");
          setTimeout(() => {
            pill.textContent = "Copy";
            pill.classList.remove("is-copied");
          }, 1400);
        } catch {
          pill.textContent = "⌘C";
        }
      });
      line.appendChild(pill);
    });
  });
}
