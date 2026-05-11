// Smooth open/close for the workshop sidebar's <details> chapter groups.
// Native <details> snaps instantly; this handler animates max-height between
// 0 and the measured scrollHeight so the panels expand with the rest of the
// theme's motion.
//
// Why hardened: nested chapter groups bubble their own transitionend events
// up to ancestor handlers, and rapid clicks can re-enter the handler before
// the previous transition resolves. Without filtering for the right event
// target + property and without an in-flight guard, the animation loses
// frames and feels janky.

export function initSidebarTree() {
  const groups = document.querySelectorAll(".sidebar-tree__group > details");
  if (groups.length === 0) return;

  groups.forEach((d) => {
    const summary = d.querySelector(":scope > summary");
    const content = d.querySelector(":scope > :not(summary)");
    if (!summary || !content) return;

    // Branches already open on page load (active path) stay open without
    // playing the entrance animation.
    if (d.open) content.style.maxHeight = "none";

    let busy = false;

    const onEnd = (e) => {
      // Only respond to OUR content's max-height transition — ignore bubbled
      // transitions from nested groups + any other property.
      if (e.target !== content || e.propertyName !== "max-height") return;
      content.removeEventListener("transitionend", onEnd);
      if (d.open) {
        // Drop the clamp so nested toggles + window resize aren't capped.
        content.style.maxHeight = "none";
      } else {
        content.style.maxHeight = "";
      }
      busy = false;
    };

    summary.addEventListener("click", (e) => {
      e.preventDefault();
      if (busy) return;
      busy = true;

      const opening = !d.open;
      if (opening) {
        d.open = true;
        content.style.maxHeight = "0px";
        // Force reflow so the browser registers the 0 → scrollHeight start.
        // eslint-disable-next-line no-unused-expressions
        content.offsetHeight;
        content.style.maxHeight = content.scrollHeight + "px";
        content.addEventListener("transitionend", onEnd);
      } else {
        // From auto → measured → 0. Set the measured height first, force
        // reflow, then clamp to 0 to start the close transition.
        content.style.maxHeight = content.scrollHeight + "px";
        // eslint-disable-next-line no-unused-expressions
        content.offsetHeight;
        content.style.maxHeight = "0px";
        content.addEventListener(
          "transitionend",
          (e) => {
            if (e.target !== content || e.propertyName !== "max-height") return;
            d.open = false;
            content.style.maxHeight = "";
            busy = false;
          },
          { once: false }
        );
      }
    });
  });
}
