// Slides — `{{< slides >}}` shortcode runtime. Loads reveal.js from
// jsdelivr on the first deck open and reuses the same instance for any
// subsequent decks on the page. Pages without a deck pay nothing.
//
// Why CDN, not bundled: reveal.js is ~75KB minified plus a CSS theme,
// and most workshop pages don't use it. CDN delivery with pinned SRI
// hashes keeps the bundle small AND tamper-evident — if jsdelivr ever
// serves a modified file the browser refuses to apply it.

import { lock, unlock } from "./scroll-lock.js";

const REVEAL_VERSION = "6.0.1";
const REVEAL_BASE = `https://cdn.jsdelivr.net/npm/reveal.js@${REVEAL_VERSION}/dist`;

// SRI hashes pinned to reveal.js v6.0.1. Regenerate when bumping
// REVEAL_VERSION:
//   curl -sL <url> | openssl dgst -sha384 -binary | openssl base64 -A
const SRI = {
  revealCSS: "sha384-8TQTOge911tNU4DISMYx3J5cwMwwLZh55NKLfAMCih8Tlt3vbomAtsr9a3Ybginy",
  blackCSS:  "sha384-W500yBe80JJBnTj+BxYtezZLsdR5wigdRepELqePUAH1HO7npy5E8xJlk/ps8XuH",
  revealJS:  "sha384-6x6l5j00jYdgHqxl+c9v3HQRZMOlEDoCU6EhoNp2HySUFFUAwXfT+VixFkOmtmY0",
};

let revealLoaded = null;     // promise — set on first open, awaited on subsequent
let currentReveal = null;    // active Reveal instance (one at a time)
let modal = null;            // <div> overlay, created on first open
let lastTrigger = null;      // focus restoration on close
let isOpening = false;       // guard against double-click while the CDN load is in flight

function loadCSS(href, integrity) {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    if (integrity) { link.integrity = integrity; link.crossOrigin = "anonymous"; }
    link.onload = resolve;
    link.onerror = () => reject(new Error(`slides: failed to load ${href}`));
    document.head.appendChild(link);
  });
}

function loadScript(src, integrity) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    if (integrity) { s.integrity = integrity; s.crossOrigin = "anonymous"; }
    s.onload = resolve;
    s.onerror = () => reject(new Error(`slides: failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function ensureReveal() {
  if (window.Reveal) return;
  if (revealLoaded) return revealLoaded;
  revealLoaded = Promise.all([
    loadCSS(`${REVEAL_BASE}/reveal.min.css`,      SRI.revealCSS),
    loadCSS(`${REVEAL_BASE}/theme/black.min.css`, SRI.blackCSS),
    /* Inter (with the display optical-size axis) — distinct from the
       workshop site's Splunk Data Sans Pro so slide typography reads as
       its own thing. Google Fonts content is dynamic so SRI isn't
       practical here; impact of a Google Fonts compromise is bounded
       to glyph rendering. */
    loadCSS("https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..800&display=swap"),
    loadScript(`${REVEAL_BASE}/reveal.min.js`,    SRI.revealJS),
  ]).catch((err) => {
    /* Reset so a retry has a chance — without this, every subsequent
       open() would hit the cached rejected promise immediately. */
    revealLoaded = null;
    throw err;
  });
  await revealLoaded;
}

function buildModal() {
  const root = document.createElement("div");
  root.className = "slides-overlay";
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-modal", "true");
  root.setAttribute("aria-label", "Slide deck");
  root.innerHTML = `
    <button class="slides-overlay__close" type="button" aria-label="Close presentation">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
    </button>
    <div class="slides-overlay__stage" data-slides-stage></div>
  `;
  document.body.appendChild(root);
  root.querySelector(".slides-overlay__close").addEventListener("click", close);
  // Background click closes — but not clicks inside .reveal (the slides).
  root.addEventListener("click", (e) => { if (e.target === root) close(); });
  return root;
}

async function open(trigger) {
  /* Double-open guard. While the CDN load is in flight (could be a few
     hundred ms on a cold cache) a second click — either on the same
     trigger or another deck on the page — would race the first, mount
     two Reveal instances, and orphan the first's destroy(). Also blocks
     re-open while a deck is already showing. */
  if (isOpening || (modal && modal.classList.contains("is-open"))) return;
  isOpening = true;

  const targetId = trigger.dataset.slidesTarget;
  const tpl = document.getElementById(targetId);
  if (!tpl) { isOpening = false; return; }
  lastTrigger = trigger;

  try {
    await ensureReveal();
  } catch (err) {
    isOpening = false;
    // eslint-disable-next-line no-console
    console.error(err);
    return;
  }

  if (!modal) modal = buildModal();
  const stage = modal.querySelector("[data-slides-stage]");
  stage.replaceChildren(tpl.content.cloneNode(true));

  modal.classList.add("is-open");
  lock();
  document.addEventListener("keydown", onKey);
  /* Arrow-key conflict between reveal.js and the theme's keyboard-nav
     (prev/next workshop page) is handled inside keyboard-nav.js itself,
     which short-circuits when `.slides-overlay.is-open` exists. The
     reverse fix here — capture + stopPropagation — wouldn't work because
     both handlers attach to `document` and `stopPropagation` doesn't
     stop sibling listeners on the same element. */

  // Initialize Reveal inside the cloned .reveal element.
  const revealEl = stage.querySelector(".reveal");
  currentReveal = new window.Reveal(revealEl, {
    hash: false,
    controls: true,
    progress: true,
    transition: "slide",
    embedded: false,
  });
  await currentReveal.initialize();

  // Focus management — focus the close button so Esc + Tab work
  // immediately without the user having to click into the modal first.
  modal.querySelector(".slides-overlay__close").focus();
  isOpening = false;
}

function close() {
  if (!modal) return;
  modal.classList.remove("is-open");
  unlock();
  document.removeEventListener("keydown", onKey);
  if (currentReveal) {
    try {
      currentReveal.destroy();
    } catch (e) {
      // Reveal can throw if destroy() runs against a partially-initialized
      // instance; log to console.debug so the failure is visible during
      // dev without showing up as an error to end users.
      // eslint-disable-next-line no-console
      console.debug("slides: Reveal.destroy() threw —", e);
    }
    currentReveal = null;
  }
  if (lastTrigger && typeof lastTrigger.focus === "function") lastTrigger.focus();
  lastTrigger = null;
}

function onKey(e) {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    close();
  }
}

export function initSlides() {
  document.querySelectorAll("[data-slides-trigger]").forEach((btn) => {
    btn.addEventListener("click", () => open(btn));
  });
}
