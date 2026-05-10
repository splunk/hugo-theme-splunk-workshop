// Scroll-spy for the right-rail "On this page" TOC.

export function initTOC() {
  const toc = document.querySelector("[data-toc]");
  if (!toc) return;

  const links = Array.from(toc.querySelectorAll("a[href^='#']"));
  if (!links.length) return;

  const idToLink = new Map(
    links.map(a => [decodeURIComponent(a.getAttribute("href").slice(1)), a])
  );

  const headings = links
    .map(a => document.getElementById(decodeURIComponent(a.getAttribute("href").slice(1))))
    .filter(Boolean);
  if (!headings.length) return;

  let active = null;
  const setActive = (id) => {
    if (active === id) return;
    active = id;
    links.forEach(l => l.classList.remove("is-active"));
    const link = idToLink.get(id);
    if (link) link.classList.add("is-active");
  };

  const observer = new IntersectionObserver((entries) => {
    // pick the topmost intersecting heading
    const visible = entries
      .filter(e => e.isIntersecting)
      .map(e => e.target)
      .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    if (visible.length) setActive(visible[0].id);
  }, {
    rootMargin: "-80px 0px -65% 0px",
    threshold: 0,
  });

  headings.forEach(h => observer.observe(h));
}
