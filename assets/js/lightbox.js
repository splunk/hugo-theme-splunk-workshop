// Click-to-zoom for figure images.

import { lock, unlock } from "./scroll-lock.js";

export function initLightbox() {
  let box = document.querySelector(".lightbox");
  if (!box) {
    box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = `<img alt="">`;
    document.body.appendChild(box);
  }
  const img = box.querySelector("img");
  let isOpen = false;

  document.querySelectorAll(".figure__inner img, .figure img").forEach((src) => {
    if (src.dataset.nozoom !== undefined) return;
    src.style.cursor = "zoom-in";
    src.addEventListener("click", () => {
      img.src = src.currentSrc || src.src;
      img.alt = src.alt || "";
      box.classList.add("is-open");
      lock();
      isOpen = true;
    });
  });

  const close = () => {
    if (!isOpen) return;
    box.classList.remove("is-open");
    unlock();
    isOpen = false;
  };
  box.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
}
