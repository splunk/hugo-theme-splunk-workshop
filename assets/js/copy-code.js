// Adds a Copy button to every <pre> code block (rendered via render-codeblock).

const ICON_COPY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const ICON_DONE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

export function initCopyCode() {
  document.querySelectorAll(".code-block__copy").forEach((btn) => {
    btn.innerHTML = `${ICON_COPY}<span>Copy</span>`;
    btn.addEventListener("click", async () => {
      const block = btn.closest(".code-block");
      const code = block?.querySelector("pre")?.innerText ?? "";
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
}
