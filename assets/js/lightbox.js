// Click-to-zoom for figure images.

export function initLightbox() {
  let box = document.querySelector(".lightbox");
  if (!box) {
    box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img alt="">`;
    document.body.appendChild(box);
  }
  const img = box.querySelector("img");

  document.querySelectorAll(".figure__inner img, .figure img").forEach((src) => {
    if (src.dataset.nozoom !== undefined) return;
    src.style.cursor = "zoom-in";
    src.addEventListener("click", () => {
      img.src = src.currentSrc || src.src;
      img.alt = src.alt || "";
      box.classList.add("is-open");
      document.documentElement.style.overflow = "hidden";
    });
  });

  const close = () => {
    box.classList.remove("is-open");
    document.documentElement.style.overflow = "";
  };
  box.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}
