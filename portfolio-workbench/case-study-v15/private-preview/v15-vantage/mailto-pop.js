/* V15 Vantage — make an email link always do something.
 *
 * A bare mailto: is silent for anyone without a desktop mail client registered,
 * which is most people using webmail: no tab, no error, nothing. The link looks
 * broken and the visitor leaves.
 *
 * So any link marked data-mail opens a small popover instead: the address in
 * full, a copy button, and one-click routes to Gmail and Outlook web plus the
 * mail-app link for people who do have one. Subject and body carry through from
 * the original href, so the prompts we pre-fill are not lost.
 *
 * Progressive enhancement. Without JavaScript the link stays an ordinary mailto
 * and behaves exactly as before, which is why the address is also printed as
 * text next to every one of these on the page.
 */
(function () {
  "use strict";

  const links = [...document.querySelectorAll("a[data-mail]")];
  if (!links.length) return;

  let pop = null;

  const close = () => {
    if (!pop) return;
    const opener = pop._opener;
    pop.remove();
    pop = null;
    document.removeEventListener("keydown", onKey, true);
    document.removeEventListener("click", onOutside, true);
    if (opener) opener.focus();
  };

  function onKey(e) {
    if (e.key === "Escape") { e.stopPropagation(); close(); }
  }
  function onOutside(e) {
    if (pop && !pop.contains(e.target)) close();
  }

  function parse(href) {
    const raw = href.replace(/^mailto:/i, "");
    const [addr, qs] = raw.split("?");
    const q = new URLSearchParams(qs || "");
    return { addr: decodeURIComponent(addr), subject: q.get("subject") || "", body: q.get("body") || "" };
  }

  function open(link) {
    close();
    const { addr, subject, body } = parse(link.getAttribute("href"));
    const enc = (s) => encodeURIComponent(s);
    const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${enc(addr)}&su=${enc(subject)}&body=${enc(body)}`;
    const outlook = `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(addr)}&subject=${enc(subject)}&body=${enc(body)}`;

    pop = document.createElement("div");
    pop.className = "mailpop";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Email " + addr);
    pop.innerHTML =
      '<button class="mailpop__x" type="button" data-x aria-label="Close">&times;</button>' +
      '<p class="mailpop__addr"><span data-addr></span></p>' +
      '<div class="mailpop__row">' +
        '<button class="mailpop__copy" type="button" data-copy>Copy address</button>' +
        '<a class="mailpop__alt" data-gmail target="_blank" rel="noopener">Gmail</a>' +
        '<a class="mailpop__alt" data-outlook target="_blank" rel="noopener">Outlook</a>' +
        '<a class="mailpop__alt" data-app>Mail app</a>' +
      '</div>' +
      '<p class="mailpop__note">The prompts are pre-filled once the draft opens.</p>';
    // set URLs and the address as properties, never by string-building HTML
    pop.querySelector("[data-addr]").textContent = addr;
    pop.querySelector("[data-gmail]").href = gmail;
    pop.querySelector("[data-outlook]").href = outlook;
    pop.querySelector("[data-app]").href = link.getAttribute("href");
    pop._opener = link;

    document.body.appendChild(pop);

    // position under the link, kept inside the viewport
    const r = link.getBoundingClientRect();
    const w = pop.offsetWidth;
    let left = r.left + window.scrollX;
    left = Math.min(left, window.scrollX + document.documentElement.clientWidth - w - 12);
    left = Math.max(window.scrollX + 12, left);
    pop.style.top = `${r.bottom + window.scrollY + 8}px`;
    pop.style.left = `${left}px`;

    pop.querySelector("[data-copy]").addEventListener("click", async (e) => {
      const btn = e.currentTarget;
      try {
        await navigator.clipboard.writeText(addr);
        btn.textContent = "Copied";
      } catch {
        // clipboard blocked (insecure origin, permissions): select it instead so
        // the visitor can copy by hand rather than being told nothing happened
        const sel = window.getSelection(), rng = document.createRange();
        rng.selectNodeContents(pop.querySelector("[data-addr]"));
        sel.removeAllRanges(); sel.addRange(rng);
        btn.textContent = "Press Ctrl+C";
      }
      setTimeout(() => { btn.textContent = "Copy address"; }, 2400);
    });
    pop.querySelector("[data-x]").addEventListener("click", close);
    pop.querySelector("[data-copy]").focus();

    // bound on the next tick so the click that opened this does not close it
    setTimeout(() => {
      document.addEventListener("keydown", onKey, true);
      document.addEventListener("click", onOutside, true);
    }, 0);
  }

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      // let a modified click behave normally
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      if (pop && pop._opener === a) { close(); return; }
      open(a);
    });
  });

  window.addEventListener("resize", close);
})();
