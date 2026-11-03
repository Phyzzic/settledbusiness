// Settled — settled.business
// Theme, nav, scroll reveals, the "Have a look around" plan, and the FAQ.

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
  const currentTheme = () => root.dataset.theme || (systemDark.matches ? "dark" : "light");

  function paintThemeButton() {
    const dark = currentTheme() === "dark";
    themeBtn.innerHTML = dark ? ICONS.sun : ICONS.moon;
    themeBtn.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  function setTheme(next) {
    const apply = () => {
      root.dataset.theme = next;
      try { localStorage.setItem("settledTheme", next); } catch (e) {}
      paintThemeButton();
    };
    // A real crossfade of the whole page where the browser supports it.
    if (document.startViewTransition && !reduceMotion) document.startViewTransition(apply);
    else apply();
  }
  themeBtn.addEventListener("click", () => setTheme(currentTheme() === "dark" ? "light" : "dark"));
  // Follow the system setting live, unless someone has picked a theme by hand.
  systemDark.addEventListener("change", (e) => {
    let saved = null;
    try { saved = localStorage.getItem("settledTheme"); } catch (err) {}
    if (!saved) { root.dataset.theme = e.matches ? "dark" : "light"; paintThemeButton(); }
  });
  paintThemeButton();

  /* ---------- Nav: frost harder once scrolled, highlight current section ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 12);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navLinks = [...document.querySelectorAll(".nav-links a")];
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-current", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => sectionObserver.observe(s));

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

  /* ---------- Scroll reveals ---------- */
  // Siblings revealed together get a small stagger via --i.
  const revealEls = [...document.querySelectorAll(".reveal")];
  revealEls.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--i", sibs.indexOf(el));
  });
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); revealObserver.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Have a look around ---------- */
  const plan = document.getElementById("plan");
  const lines = plan.querySelector(".plan-lines");
  const readout = document.getElementById("readout");
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  const buttons = ROOMS.map((r) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "room";
    b.dataset.room = r.id;
    b.style.cssText = `left:${r.plan.x}%;top:${r.plan.y}%;width:${r.plan.w}%;height:${r.plan.h}%;--accent:${r.accent}`;
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<span>${esc(r.name)}</span>`;
    b.addEventListener("click", () => select(r.id));
    plan.insertBefore(b, lines); // drawing stays on top of the room fills
    return b;
  });

  function readoutHTML(r) {
    const tips = r.clean.map((t) => `<li>${esc(t)}</li>`);
    if (r.basic) tips.push(`<li><b>${esc(r.basic.title)}.</b> ${esc(r.basic.text)}</li>`);
    const more = r.premium > 0 ? `Plus ${r.premium} more with Premium.` : "Everything in here is free.";
    return `
      <div class="readout-inner" style="--accent:${r.accent}">
        <p class="readout-tag"><i></i>${plural(r.free, "free tip")} in here</p>
        <h3>${esc(r.name)}</h3>
        <p class="readout-blurb">${esc(r.blurb)}</p>
        <ul class="readout-tips">${tips.join("")}</ul>
        <div class="readout-foot">
          <span>${more}</span>
          <a class="readout-link" href="${APP_URL}/?room=${encodeURIComponent(r.id)}">Open the ${esc(r.name.split(" &")[0].toLowerCase())} in the app</a>
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

  /* ---------- FAQ ---------- */
  const FAQS = [
    ["Is it on the App Store?", "No — and that's on purpose. Settled installs straight from your browser (see above), so there's nothing to download from a store and updates reach you the moment they're out."],
    ["Does it work without signal?", "Yes. Once you've installed it and opened it once, every room and every free tip is saved on your phone, so it works in a basement, a loft, or a new build with no broadband yet."],
    ["Do I need an account?", "Not to start. Open it and start tapping rooms. An account only comes into it if you go Premium."],
    ["Is it just for the UK?", "It's written with UK homes in mind — fuse boxes, stopcocks, bin collections — but most of the cleaning advice works anywhere."],
    ["Can I cancel Premium?", "Whenever you like. It's month to month, and you keep it until the end of the period you've paid for."],
    ["Will there be more rooms?", "Yes. New rooms and guides are added over time, and Premium includes them at no extra cost."],
  ];
  const faqList = document.getElementById("faqList");
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
})();
