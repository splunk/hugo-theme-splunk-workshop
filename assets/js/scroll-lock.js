// Shared scroll-lock helper for modal-style overlays (search modal, lightbox).
//
// Why not `document.documentElement.style.overflow = "hidden"`: iOS Safari
// ignores that on the html element, so the page scrolls underneath the
// modal anyway. The body-position trick freezes the page where the user
// was scrolled and restores the position on unlock.

let lockedY = 0;
let lockCount = 0;

export function lock() {
  // Nesting-safe — multiple modals can lock without trampling each other.
  if (lockCount === 0) {
    lockedY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockedY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
  }
  lockCount += 1;
}

export function unlock() {
  if (lockCount === 0) return;
  lockCount -= 1;
  if (lockCount === 0) {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    // `behavior: "instant"` overrides the global `html { scroll-behavior: smooth }`
    // in reset.css — without it, unlock animates from top→lockedY, which reads
    // as "the page scrolled to the image" when closing a lightbox/modal.
    window.scrollTo({ top: lockedY, left: 0, behavior: "instant" });
  }
}
