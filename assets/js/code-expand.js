// "Show more" for long code blocks. Any chroma block taller than the
// threshold gets clipped with a fade-out gradient + a centred toggle pill
// near the bottom. Click → reveal the rest. Workshops often have 30-line
// config blocks; this keeps them from dominating the page while still being
// one click away.

const THRESHOLD_PX = 380; // ≈ 22 lines at the default mono size

export function initCodeExpand() {
  const blocks = document.querySelectorAll(".code-block");
  if (blocks.length === 0) return;

  // Measure after layout so scrollHeight is meaningful.
  requestAnimationFrame(() => {
    blocks.forEach((block) => {
      const chroma = block.querySelector(".chroma");
      if (!chroma) return;
      if (chroma.scrollHeight <= THRESHOLD_PX) return;

      block.classList.add("is-clipped");

      const fade = document.createElement("div");
      fade.className = "code-block__fade";
      fade.setAttribute("aria-hidden", "true");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-block__expand-btn";
      btn.textContent = "Show more";
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", () => {
        block.classList.remove("is-clipped");
        block.classList.add("is-expanded");
        btn.setAttribute("aria-expanded", "true");
        fade.remove();
        btn.remove();
      });

      block.appendChild(fade);
      block.appendChild(btn);
    });
  });
}
