/* V15 Vantage — case-study exhibits.
 *
 * Progressive enhancement, deliberately. Every card and every exhibit is real
 * HTML in the page. With JavaScript off the exhibits simply sit in the flow
 * below the cards and the card links are ordinary in-page anchors, so nothing
 * is lost. This file only upgrades that into a modal.
 *
 * The detail nodes are MOVED into the dialog and moved back on close, never
 * cloned. Cloning would duplicate every id in the document, which breaks both
 * the anchors and the aria-labelledby wiring the dialog depends on.
 *
 * A native <dialog> is used rather than a hand-built overlay because showModal()
 * already gives focus trapping, Escape to close, inert background content and
 * focus returned to the invoking element. Reimplementing those by hand is how
 * modals end up inaccessible.
 */
(function () {
  "use strict";

  const details = document.querySelector("[data-case-details]");
  const openers = [...document.querySelectorAll("[data-case]")];
  if (!details || !openers.length) return;
  if (typeof HTMLDialogElement !== "function" || !HTMLDialogElement.prototype.showModal) return;

  const dialog = document.createElement("dialog");
  dialog.className = "case-dialog";
  dialog.setAttribute("aria-label", "Case study");
  dialog.innerHTML =
    '<div class="case-dialog__bar">' +
      '<div class="case-dialog__nav">' +
        '<button type="button" class="case-dialog__step" data-step="-1" aria-label="Previous case"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 6l-6 6 6 6"></path></svg></button>' +
        '<p class="case-dialog__count" data-count aria-live="polite"></p>' +
        '<button type="button" class="case-dialog__step" data-step="1" aria-label="Next case"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6l6 6-6 6"></path></svg></button>' +
      '</div>' +
      '<button type="button" class="case-dialog__close" data-close>Close<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"></path></svg></button>' +
    '</div>' +
    '<div class="case-dialog__body" data-slot tabindex="-1"></div>';
  document.body.appendChild(dialog);

  const slot = dialog.querySelector("[data-slot]");
  const count = dialog.querySelector("[data-count]");
  const ids = openers.map((a) => a.dataset.case);
  let current = -1;
  let home = null; // where the moved node came from, so it goes back exactly there

  function park() {
    if (current < 0) return;
    const node = slot.firstElementChild;
    if (node && home) home.replaceWith(node);
    home = null;
    current = -1;
  }

  function show(i) {
    const id = ids[(i + ids.length) % ids.length];
    const node = document.getElementById(id);
    if (!node) return;
    park();
    current = (i + ids.length) % ids.length;
    // leave a marker so the node returns to its original position, not the end
    home = document.createComment("case-detail placeholder");
    node.replaceWith(home);
    slot.appendChild(node);
    const titleId = node.getAttribute("aria-labelledby");
    if (titleId) {
      dialog.removeAttribute("aria-label");
      dialog.setAttribute("aria-labelledby", titleId);
      slot.setAttribute("aria-labelledby", titleId);
    }
    count.textContent = `${current + 1} of ${ids.length}`;
    slot.scrollTop = 0;
    slot.focus();
  }

  openers.forEach((a, i) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      show(i);
      if (!dialog.open) dialog.showModal();
    });
  });

  dialog.addEventListener("click", (e) => {
    // clicking the backdrop resolves to the dialog element itself
    if (e.target === dialog || e.target.closest("[data-close]")) { dialog.close(); return; }
    const step = e.target.closest("[data-step]");
    if (step) show(current + Number(step.dataset.step));
  });

  dialog.addEventListener("close", park);

  dialog.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); dialog.close(); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
  });

  // Deep link: /for-clients.html#case-funding opens that case directly rather
  // than scrolling to a node this script is about to move.
  const fromHash = ids.indexOf(location.hash.slice(1));
  if (fromHash > -1) { show(fromHash); dialog.showModal(); }
})();
