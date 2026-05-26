// Acknowledge modal — pops a native <dialog> on first page-load for any
// {{< acknowledge >}} block on the page that hasn't yet been ack'd.
// Acknowledgement state is persisted in localStorage so re-visits don't
// re-prompt; only the "I understand" button closes the dialog. ESC is
// blocked via the cancel event, native dialog backdrop clicks already
// don't dismiss without explicit handling.
//
// State key: splunk-workshop:acks — { "<page-permalink>::<ordinal>": true }
// Works alongside the three completion-tracking keys; see
// workshop-progress.js for the matching pattern.

const KEY = "splunk-workshop:acks";

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || "{}"); }
  catch { return {}; }
}
function write(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function initAcknowledge() {
  const modals = document.querySelectorAll("dialog.ack-modal");
  if (modals.length === 0) return;

  const state = read();

  modals.forEach((dialog) => {
    const id = dialog.dataset.ackModalFor;
    if (!id) return;

    // Block ESC so the only way out is the "I understand" button.
    // `cancel` fires before `close`; preventDefault aborts the close.
    dialog.addEventListener("cancel", (e) => e.preventDefault());

    // Click on the button → record ack + close. We listen on the dialog
    // (event delegation) so an in-content link that happens to look like
    // a button doesn't accidentally fire it.
    const button = dialog.querySelector(".ack-modal__ack");
    if (button) {
      button.addEventListener("click", () => {
        state[id] = true;
        write(state);
        dialog.close();
      });
    }

    if (state[id]) return;             // already acknowledged → stay closed
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    }
  });
}
