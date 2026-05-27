// Reading-progress bar — gradient fill that tracks scroll within .content.

export function initProgress() {
  const bar = document.querySelector("[data-progress]");
  const content = document.querySelector(".content") || document.querySelector("main");
  if (!bar || !content) return;

  let ticking = false;
  const update = () => {
    const rect = content.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const total = rect.height - window.innerHeight;
    const scrolled = Math.max(0, window.scrollY - top);
    const pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
    bar.style.width = pct.toFixed(2) + "%";
    ticking = false;
  };

  const schedule = () => {
    if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
  };
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  update();
}
