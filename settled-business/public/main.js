// Settled — settled.business
// Shared by every page: theme, mobile menu, app links.
// Home page only: the "Have a look around" plan. Questions page only: the FAQ.

(() => {
  // Where the app lives. Every [data-app-link] on the page is pointed here,
  // so moving the app is a one-line change.
  const APP_URL = "https://app.settled.business";

  document.querySelectorAll("[data-app-link]").forEach((a) => {
    a.href = APP_URL + (a.dataset.appPath || "");
  });
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Icons (just the few this page needs) ---------- */
  const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICONS = {
    sun: svg('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>'),
    moon: svg('<path d="M20 14.6A8.4 8.4 0 1 1 9.4 4a6.9 6.9 0 0 0 10.6 10.6z"/>'),
    menu: svg('<path d="M4 8h16M4 16h16"/>'),
    close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  };

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeToggle");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => root.dataset.mode || (systemDark.matches ? "dark" : "light");

  function paintThemeButton() {
    const dark = currentTheme() === "dark";
    themeBtn.innerHTML = dark ? ICONS.moon : ICONS.sun; // shows the mode you are in
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  function setTheme(next) {
    const apply = () => {
      root.dataset.mode = next;
      try { localStorage.setItem("settledTheme", next); } catch (e) {}
      paintThemeButton();
    };
    apply();
  }
  themeBtn.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
  // Follow the system setting live, unless someone has picked a theme by hand.
  systemDark.addEventListener("change", (e) => {
    let saved = null;
    try { saved = localStorage.getItem("settledTheme"); } catch (err) {}
    if (!saved) { root.dataset.mode = e.matches ? "dark" : "light"; paintThemeButton(); }
  });
  paintThemeButton();

  // Mobile menu
  const menuBtn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  const setMenu = (open) => {
    menu.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.innerHTML = open ? ICONS.close : ICONS.menu;
  };
  setMenu(false);
  menuBtn.addEventListener("click", () => setMenu(menu.hidden));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setMenu(false); menuBtn.focus(); } });

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Have a look around (home page) ---------- */
  const plan = document.getElementById("plan");
  if (plan && typeof ROOMS !== "undefined") {
  const lines = plan.querySelector(".plan-lines");
  const readout = document.getElementById("readout");
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  const buttons = ROOMS.map((r) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "room";
    b.dataset.room = r.id;
    b.style.cssText = `left:${r.plan.x}%;top:${r.plan.y}%;width:${r.plan.w}%;height:${r.plan.h}%`;
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = `${typeof roomIcon === "function" ? roomIcon(r, 30) : ""}<span>${esc(r.name)}</span>`;
    b.addEventListener("click", () => select(r.id));
    plan.insertBefore(b, lines); // drawing stays on top of the room fills
    return b;
  });

  function readoutHTML(r) {
    const tips = r.clean.map((t) => `<li>${esc(t)}</li>`);
    if (r.basic) tips.push(`<li><b>${esc(r.basic.title)}.</b> ${esc(r.basic.text)}</li>`);
    const more = r.more > 0 ? `There ${r.more === 1 ? "is" : "are"} ${r.more} more ${r.more === 1 ? "tip" : "tips"} for this room in the app.` : "That's everything for this room.";
    return `
      <div class="readout-inner">
        <p class="readout-tag">${plural(r.total, "tip")}</p>
        <h3>${esc(r.name)}</h3>
        <p class="readout-blurb">${esc(r.blurb)}</p>
        <ul class="readout-tips">${tips.join("")}</ul>
        <div class="readout-foot">
          <span>${more}</span>
          <a class="readout-link" href="${APP_URL}/?room=${encodeURIComponent(r.id)}">See all ${r.total} tips in the app</a>
        </div>
      </div>`;
  }

  let current = null;
  function select(id, instant) {
    if (id === current) return;
    current = id;
    const r = ROOMS.find((x) => x.id === id);
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.room === id)));
    const old = readout.querySelector(".readout-inner");
    if (!old || instant || reduceMotion) { readout.innerHTML = readoutHTML(r); return; }
    old.classList.add("is-leaving");
    setTimeout(() => {
      if (current !== id) return; // a newer click already won
      readout.innerHTML = readoutHTML(r);
      const fresh = readout.querySelector(".readout-inner");
      fresh.classList.add("is-leaving");
      requestAnimationFrame(() => requestAnimationFrame(() => fresh.classList.remove("is-leaving")));
    }, 170);
  }
  select("kitchen", true);

  // Arrow keys move between rooms once one has focus.
  plan.addEventListener("keydown", (e) => {
    const i = buttons.indexOf(document.activeElement);
    if (i < 0) return;
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = buttons[(i + step + buttons.length) % buttons.length];
    next.focus();
    next.click();
  });
  }

  /* ---------- FAQ (questions page) ---------- */
  const FAQS = [
    ["Is it free?", "Yes, all of it. Every room and every tip is free to use."],
    ["Do I need an account?", "No, you can use the whole thing without one. If you'd like your saved tips on more than one device, you can sign in with Google or with a code we email you. There's no password to remember."],
    ["Can I save tips?", "Yes. Tap the heart on any tip and it goes in your Saved tab. Sign in and your saved tips and first-week list will be on your other devices too."],
    ["Will it always be free?", "Everything that's free now will stay free. Later on we're planning Settled Premium, an optional upgrade with a few extras. You won't need it to use the guide."],
    ["Is it on the App Store?", "No, you add it to your phone straight from your browser. The Install page shows you how. There's nothing to download from a store, and updates come through on their own."],
    ["Does it work without signal?", "Yes. Once it's on your phone and you've opened it once, every room and tip is saved on it."],
    ["Can I use it on my phone and my laptop?", "Yes. It works in any up-to-date browser, and you can sign in with the same Google account or email on both."],
    ["Is it just for the UK?", "It's written for UK homes, so it talks about fuse boxes, stopcocks and council bins. A lot of the cleaning tips work anywhere though."],
    ["Will there be more rooms?", "Yes, we're adding more of the house over time."],
  ];
  const faqList = document.getElementById("faqList");
  if (faqList) {
  faqList.innerHTML = FAQS.map(([q, a], i) => `
    <div class="faq-item">
      <button class="faq-q" type="button" aria-expanded="false" aria-controls="faq-a-${i}" id="faq-q-${i}">
        <span>${esc(q)}</span><span class="plus" aria-hidden="true"></span>
      </button>
      <div class="faq-a" id="faq-a-${i}" role="region" aria-labelledby="faq-q-${i}"><div><p>${esc(a)}</p></div></div>
    </div>`).join("");
  faqList.addEventListener("click", (e) => {
    const btn = e.target.closest(".faq-q");
    if (!btn) return;
    const item = btn.parentElement;
    const open = !item.classList.contains("is-open");
    item.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
  });
  }
})();
