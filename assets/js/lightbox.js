// Click-to-zoom for figure images.

import { lock, unlock } from "./scroll-lock.js";

export function initLightbox() {
  let box = document.querySelector(".lightbox");
  if (!box) {
    box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Image preview");
    box.setAttribute("tabindex", "-1");
    box.innerHTML = `
      <button type="button" class="lightbox__close" aria-label="Close image preview">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/></svg>
      </button>
      <img alt="">`;
    document.body.appendChild(box);
  }
  const img = box.querySelector("img");
  const closeBtn = box.querySelector(".lightbox__close");
  let isOpen = false;
  let returnFocusTo = null;

  const onKey = (e) => {
    if (e.key === "Escape") { e.preventDefault(); close(); return; }
    if (e.key === "Tab") { e.preventDefault(); closeBtn.focus(); }
  };

  const open = (src) => {
    img.src = src.currentSrc || src.src;
    img.alt = src.alt || "";
    returnFocusTo = src;
    box.classList.add("is-open");
    lock();
    isOpen = true;
    document.addEventListener("keydown", onKey);
    closeBtn.focus();
  };

  const close = () => {
    if (!isOpen) return;
    box.classList.remove("is-open");
    unlock();
    isOpen = false;
    document.removeEventListener("keydown", onKey);
    if (returnFocusTo && document.contains(returnFocusTo)) {
      returnFocusTo.focus({ preventScroll: false });
    }
    returnFocusTo = null;
  };

  document.querySelectorAll(".figure__inner img, .figure img").forEach((src) => {
    if (src.dataset.nozoom !== undefined) return;
    src.style.cursor = "zoom-in";
    src.setAttribute("tabindex", "0");
    src.setAttribute("role", "button");
    src.setAttribute("aria-label", `Open image preview${src.alt ? ": " + src.alt : ""}`);
    src.addEventListener("click", () => open(src));
    src.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(src); }
    });
  });

  closeBtn.addEventListener("click", close);
  box.addEventListener("click", (e) => { if (e.target === box) close(); });
}
