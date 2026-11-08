/* =========================================================
   Trovo marketing site — interactions
   ========================================================= */
const CONFIG = {
  // Paste a form endpoint here (Formspree, Netlify Forms, your API) to collect sign-ups.
  // While empty, the form shows the success state but does NOT save anything.
  WAITLIST_ENDPOINT: "",
  // Public URL used by the share buttons. Falls back to the current page.
  SITE_URL: "https://kamalmckenzie.github.io/Trovo-Website/"
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
};
const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const canHover = matchMedia("(hover: hover)").matches;
const siteUrl = () => CONFIG.SITE_URL || location.href.split("#")[0];

/* ---------- toast + clipboard ---------- */
let toastTimer;
function toast(html, ms = 3400) {
  const t = $("#toast");
  t.innerHTML = html;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), ms);
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; }
  catch (e) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand("copy"); ta.remove(); return ok;
    } catch (_) { return false; }
  }
}
$("#year").textContent = new Date().getFullYear();

/* =========================================================
   ACCESSIBILITY TOOLS (Gen X / Boomers): bigger text + pause motion
   ========================================================= */
let motionOn = store.get("trovo-motion") ? store.get("trovo-motion") === "on" : !prefersReduced;
function applyMotion() {
  document.body.classList.toggle("still", !motionOn);
  const b = $("#motionBtn");
  b.setAttribute("aria-pressed", String(!motionOn));
  $(".motion-ic", b).textContent = motionOn ? "❚❚" : "▶";
  $(".tool-label", b).textContent = motionOn ? "Pause motion" : "Play motion";
  b.title = motionOn ? "Pause animations" : "Play animations";
  const road = $(".hero-road");
  if (road && road.pauseAnimations) motionOn ? road.unpauseAnimations() : road.pauseAnimations();
}
$("#motionBtn").addEventListener("click", () => { motionOn = !motionOn; store.set("trovo-motion", motionOn ? "on" : "off"); applyMotion(); });

let bigText = store.get("trovo-bigtext") === "on";
function applyText() {
  document.documentElement.classList.toggle("big-text", bigText);
  const b = $("#textSizeBtn");
  b.setAttribute("aria-pressed", String(bigText));
  $(".tool-label", b).textContent = bigText ? "Normal text" : "Bigger text";
}
$("#textSizeBtn").addEventListener("click", () => { bigText = !bigText; store.set("trovo-bigtext", bigText ? "on" : "off"); applyText(); requestAnimationFrame(onScroll); });
applyText();

/* =========================================================
   TIME-AWARE TICKET (Contagious: triggers)
   ========================================================= */
function tickClock() {
  const d = new Date(), h = d.getHours() + d.getMinutes() / 60;
  const t = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  let msg;
  if (audience === "truck") {
    msg = h >= 10.5 && h < 14 ? `It's ${t}. People nearby are hungry right now.`
        : h >= 17 && h < 21 ? `It's ${t}. Dinner crowd is looking for you.`
        : `It's ${t}. Your next shift starts with one tap.`;
  } else {
    msg = h >= 5 && h < 10.5 ? `☀️ It's ${t}. Breakfast truck, anyone?`
        : h < 14.5 && h >= 10.5 ? `🌮 It's ${t}. Lunch is minutes away.`
        : h < 17 && h >= 14.5 ? `🍑 It's ${t}. Snack run?`
        : h < 22 && h >= 17 ? `🌙 It's ${t}. Dinner's on wheels tonight.`
        : `🌙 It's ${t}. See who's out tomorrow.`;
  }
  $("#clock").textContent = msg;
}

/* =========================================================
   FOOD TRUCK SVG
   ========================================================= */
function truckSVG({ body = "#E6592A", cab = "#C34A20", sign = "TROVO", signColor = "#FBBF24", menu = "", closed = false }) {
  const stripes = Array.from({ length: 8 }, (_, i) => {
    const x = 36 + i * 30.5, fill = i % 2 ? "#FFFFFF" : signColor;
    return `<rect x="${x}" y="76" width="30.6" height="28" fill="${fill}"/><circle cx="${x + 15.25}" cy="104" r="15.25" fill="${fill}"/>`;
  }).join("");
  const items = menu ? menu.split("|").slice(0, 3) : [];
  const menuLines = items.map((m, i) =>
    `<text class="menu-line" x="64" y="${138 + i * 20}" fill="#fff" font-size="14" font-weight="600" font-family="Outfit, sans-serif">${m}</text>
     <circle class="menu-line" cx="252" cy="${133 + i * 20}" r="4" fill="${signColor}"/>`).join("");
  const cook = items.length ? "" : `<circle class="menu-line" cx="158" cy="134" r="14" fill="#3A4152"/><rect class="menu-line" x="136" y="150" width="44" height="32" rx="12" fill="#3A4152"/>`;
  const fit = sign.length > 14 ? `textLength="186" lengthAdjust="spacingAndGlyphs"` : "";
  const shutterLines = Array.from({ length: 7 }, (_, i) => `<line x1="48" x2="268" y1="${104 + i * 12}" y2="${104 + i * 12}" stroke="#6B7386" stroke-width="2"/>`).join("");
  const closedSign = closed ? `<rect x="118" y="124" width="80" height="28" rx="6" fill="#161A23"/><text x="158" y="143" fill="#f87171" font-size="13" font-weight="800" text-anchor="middle" font-family="Outfit, sans-serif">CLOSED</text>` : "";
  const wheel = cx => `
    <circle cx="${cx}" cy="226" r="38" fill="rgba(0,0,0,.35)"/>
    <g class="wheel"><circle cx="${cx}" cy="226" r="30" fill="#0b0d12"/><circle cx="${cx}" cy="226" r="14" fill="#9BA6BB"/>
    <line x1="${cx - 12}" y1="226" x2="${cx + 12}" y2="226" stroke="#3A4152" stroke-width="3"/><line x1="${cx}" y1="214" x2="${cx}" y2="238" stroke="#3A4152" stroke-width="3"/></g>`;
  return `<svg viewBox="0 0 450 280" role="img" aria-label="Food truck: ${sign}">
    <ellipse cx="225" cy="262" rx="200" ry="12" fill="rgba(0,0,0,.6)"/>
    <g class="body-group">
      <rect x="110" y="52" width="6" height="14" fill="#3A4152"/><rect x="236" y="52" width="6" height="14" fill="#3A4152"/>
      <rect x="70" y="14" width="210" height="40" rx="10" fill="#0b0d12" stroke="${signColor}" stroke-width="2"/>
      <text class="sign-light" x="175" y="41" fill="${signColor}" font-size="18" font-weight="800" text-anchor="middle" font-family="Outfit, sans-serif" ${fit}>${sign}</text>
      <rect x="20" y="64" width="300" height="160" rx="20" fill="${body}"/>
      <rect x="20" y="198" width="300" height="10" fill="rgba(0,0,0,.18)"/>
      <path d="M318 104 h62 q22 0 34 22 l18 36 v52 q0 10 -10 10 h-104 z" fill="${cab}"/>
      <path d="M332 116 h44 q12 0 18 12 l14 30 h-76 z" fill="#9BA6BB" opacity=".9"/>
      <rect x="420" y="176" width="10" height="14" rx="3" fill="#FBBF24"/>
      <rect x="48" y="92" width="220" height="92" rx="10" fill="#120d0a"/>
      <rect x="48" y="92" width="220" height="92" rx="10" fill="url(#glow)" opacity=".9"/>
      ${menuLines}${cook}
      <g class="shutter"><rect x="48" y="92" width="220" height="92" rx="10" fill="#9BA6BB"/>${shutterLines}${closedSign}</g>
      <rect x="38" y="182" width="240" height="12" rx="4" fill="#e9e9e9"/>
      <g class="awning">${stripes}</g>
      <text x="300" y="218" fill="rgba(255,255,255,.75)" font-size="13" font-weight="800" text-anchor="end" font-family="Outfit, sans-serif">Live on Trovo</text>
      ${wheel(100)}${wheel(362)}
    </g>
    <defs><radialGradient id="glow" cx="50%" cy="30%" r="70%"><stop offset="0" stop-color="#FBBF24" stop-opacity=".35"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>
  </svg>`;
}
$$("[data-truck]").forEach(el => {
  el.innerHTML = truckSVG({
    body: el.dataset.body, cab: el.dataset.cab, sign: el.dataset.sign,
    signColor: el.dataset.signcolor, menu: el.dataset.menu || "", closed: el.dataset.stayClosed === "true"
  });
});

/* =========================================================
   HEADLINES: split into words so they rise in
   ========================================================= */
$$("h1.reveal, h2.reveal").forEach(h => {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span"); w.className = "w";
          const inner = document.createElement("span"); inner.textContent = part; inner.style.setProperty("--i", i++);
          w.appendChild(inner); frag.appendChild(w);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
    });
  };
  walk(h);
});

/* ---------- reveal + truck arrival ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.matches("[data-truck]")) {
      el.classList.add("arrived");
      if (el.dataset.stayClosed !== "true") setTimeout(() => el.classList.add("open"), motionOn ? 900 : 0);
    } else el.classList.add("in");
    io.unobserve(el);
  });
}, { threshold: 0, rootMargin: "0px 0px -10% 0px" });
$$(".reveal, [data-truck]").forEach(el => io.observe(el));
$$(".pricing, .icon-row").forEach(g => $$(".reveal, li", g).forEach((el, i) => (el.style.transitionDelay = `${i * 70}ms`)));

/* =========================================================
   AUDIENCE SPLIT: foodies vs truck owners
   ========================================================= */
let audience = store.get("trovo-audience") === "truck" ? "truck" : "foodie";
let stopsNow = [], banners = [];
const isShown = el => getComputedStyle(el).display !== "none";

function buildRoute() {
  stopsNow = $$(".stop").filter(isShown);
  $("#routeStops").innerHTML = stopsNow.map((s, i) =>
    `<li><a href="#${s.id}" data-label="${s.dataset.label}" aria-label="Stop ${i + 1}: ${s.dataset.label}"><span>${i + 1}</span></a></li>`).join("");
  stopsNow.forEach((s, i) => {
    const tag = $(".stop-tag", s);
    if (tag) tag.textContent = `Stop ${String(i + 1).padStart(2, "0")} / ${String(stopsNow.length).padStart(2, "0")} · ${s.dataset.label}`;
  });
}
function buildBanners() {
  $$(".next-stop").forEach(b => b.remove());
  banners = stopsNow.slice(1).map((s, i) => {
    const b = document.createElement("div");
    b.className = "next-stop"; b.setAttribute("aria-hidden", "true");
    const unit = `<span>Next stop</span><span class="on">→ ${s.dataset.label}</span><span>✦</span>`;
    b.innerHTML = `<div class="ns-track">${unit.repeat(6)}</div>`;
    s.before(b);
    return { el: b, track: b.firstElementChild, dir: i % 2 ? 1 : -1 };
  });
}
function setAudience(a, { scroll = false } = {}) {
  audience = a;
  document.body.dataset.audience = a;
  store.set("trovo-audience", a);
  $$(".aud-switch button").forEach(b => b.setAttribute("aria-checked", String(b.dataset.setAud === a)));
  $$(".nav-aud").forEach(b => b.classList.toggle("active", b.dataset.setAud === a));
  $(".aud-switch").dataset.aud = a;
  $("#shareBtn").textContent = a === "truck" ? "Send to a truck owner" : "Send to my lunch group";
  tickClock();
  buildRoute(); buildBanners(); onScroll(); motionFrame();
  if (scroll) {
    const target = a === "truck" ? $("#posting") : $("#closed");
    target.scrollIntoView({ behavior: motionOn ? "smooth" : "auto" });
  }
}
$$("[data-set-aud]").forEach(b => b.addEventListener("click", () =>
  setAudience(b.dataset.setAud, { scroll: b.classList.contains("nav-aud") })));

/* ---------- route bar progress ---------- */
const fill = $(".route-fill"), routeTruck = $(".route-truck");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = Math.min(1, Math.max(0, scrollY / max));
  fill.style.width = `${p * 100}%`;
  routeTruck.style.left = `${p * 100}%`;
  let active = 0;
  stopsNow.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) active = i; });
  $$("#routeStops a").forEach((a, i) => {
    a.classList.toggle("active", i === active);
    a.classList.toggle("passed", i < active);
  });
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);

/* ---------- cursor glow, magnetic buttons, phone tilt ---------- */
const glow = $(".cursor-glow");
glow.style.transform = "translate(-999px,-999px)";
addEventListener("pointermove", e => { glow.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`; }, { passive: true });
if (canHover) {
  $$(".magnetic").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      if (!motionOn) return;
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
    });
    btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
  });
  const phone = $("#heroPhone"), hero = $(".hero");
  hero.addEventListener("pointermove", e => {
    if (!motionOn) return;
    const r = hero.getBoundingClientRect();
    phone.style.transform = `rotateY(${((e.clientX - r.left) / r.width - 0.5) * 18}deg) rotateX(${-((e.clientY - r.top) / r.height - 0.5) * 14}deg)`;
  });
  hero.addEventListener("pointerleave", () => (phone.style.transform = ""));
}

/* ---------- old way vs Trovo switches ---------- */
$$(".compare").forEach(compare => {
  compare.dataset.mode = "old";
  const btns = $$(".compare-toggle button", compare);
  btns.forEach(b => b.addEventListener("click", () => {
    compare.dataset.mode = b.dataset.mode;
    btns.forEach(x => { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", x === b); });
    $$(".panel", compare).forEach(p => p.classList.toggle("active", p.dataset.panel === b.dataset.mode));
  }));
  const watch = new IntersectionObserver(en => {
    if (en[0].isIntersecting && compare.dataset.mode === "old" && !compare.dataset.flipped) {
      compare.dataset.flipped = "1";
      setTimeout(() => btns[1].click(), 2600);
    }
  }, { threshold: 0.6 });
  watch.observe(compare);
});

/* =========================================================
   LIVE MAP DEMO (sample data)
   ========================================================= */
const TRUCKS = [
  { id: "golden", name: "Golden Hour Biscuits", cat: "Southern", emoji: "🍳", x: 30, y: 32, dist: "0.4 mi", rating: "5.0", wait: "10–15 min", live: true, until: "2:00 PM", color: "#6b3a1c",
    menu: [["Biscuits & Gravy", "$9"], ["Chicken Biscuit", "$8"], ["Shrimp & Grits", "$13"]] },
  { id: "ruta", name: "La Ruta Tacos", cat: "Tacos", emoji: "🌮", x: 62, y: 28, dist: "0.9 mi", rating: "4.8", wait: "5–10 min", live: true, until: "3:30 PM", color: "#7a4a12",
    menu: [["Birria Tacos (3)", "$12"], ["Al Pastor", "$4"], ["Elote", "$5"]] },
  { id: "smoke", name: "Smoke Signal BBQ", cat: "BBQ", emoji: "🍖", x: 74, y: 66, dist: "1.3 mi", rating: "4.9", wait: "15–20 min", live: true, until: "4:00 PM", color: "#5a1f12",
    menu: [["Brisket Plate", "$16"], ["Pulled Pork Sandwich", "$11"], ["Mac & Cheese", "$5"]] },
  { id: "pops", name: "Peach State Pops", cat: "Sweets", emoji: "🍑", x: 18, y: 70, dist: "1.8 mi", rating: "4.7", wait: "< 5 min", live: true, until: "6:00 PM", color: "#7a3b2a",
    menu: [["Peach Cobbler Pop", "$5"], ["Banana Pudding Cup", "$6"], ["Sweet Tea", "$3"]] },
  { id: "wing", name: "Wing Theory", cat: "Wings", emoji: "🍗", x: 86, y: 22, dist: "2.1 mi", rating: "4.6", wait: "10 min", live: true, until: "8:00 PM", color: "#6a4510",
    menu: [["Lemon Pepper (8)", "$12"], ["Hot Honey (8)", "$12"], ["Fries", "$4"]] },
  { id: "lemon", name: "Lemon Drop Lemonade", cat: "Sweets", emoji: "🍋", x: 48, y: 80, dist: "2.6 mi", rating: "4.8", wait: "—", live: false, until: "Back Sat 11 AM", color: "#5c5512",
    menu: [["Classic Lemonade", "$5"], ["Strawberry Lemonade", "$6"], ["Funnel Fries", "$7"]] }
];
const CATS = [["All", "✨"], ["Southern", "🍳"], ["Tacos", "🌮"], ["BBQ", "🍖"], ["Wings", "🍗"], ["Sweets", "🍑"]];
let currentCat = "All", selectedId = "golden";
const favorites = new Set();
const chipsEl = $("#chips"), mapEl = $("#demoMap"), listEl = $("#demoList"), detailEl = $("#demoDetail");

chipsEl.innerHTML = CATS.map(([c, e]) => `<button class="chip${c === "All" ? " active" : ""}" data-cat="${c}" aria-pressed="${c === "All"}">${e} ${c}</button>`).join("");
chipsEl.addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  currentCat = b.dataset.cat;
  $$(".chip", chipsEl).forEach(c => { c.classList.toggle("active", c === b); c.setAttribute("aria-pressed", c === b); });
  renderDemo();
});
TRUCKS.forEach(t => {
  const pin = document.createElement("button");
  pin.className = "map-pin" + (t.live ? "" : " offline");
  pin.style.left = t.x + "%"; pin.style.top = t.y + "%";
  pin.dataset.id = t.id;
  pin.setAttribute("aria-label", `${t.name}, ${t.live ? "open now" : "closed"}, ${t.dist}`);
  pin.innerHTML = `<span class="mp-label">${t.name}</span><span class="mp-head">${t.emoji}</span><span class="mp-tail"></span>`;
  pin.addEventListener("click", () => select(t.id));
  mapEl.appendChild(pin);
});
function renderDemo() {
  const visible = TRUCKS.filter(t => currentCat === "All" || t.cat === currentCat);
  if (!visible.find(t => t.id === selectedId) && visible[0]) selectedId = visible[0].id;
  $$(".map-pin", mapEl).forEach(p => {
    const t = TRUCKS.find(x => x.id === p.dataset.id);
    p.classList.toggle("dim", !visible.includes(t));
    p.classList.toggle("selected", t.id === selectedId);
  });
  listEl.innerHTML = [...visible]
    .sort((a, b) => (b.live - a.live) || parseFloat(a.dist) - parseFloat(b.dist))
    .map(t => `<button class="list-item${t.id === selectedId ? " selected" : ""}" data-id="${t.id}">
      <span class="li-thumb" style="background:${t.color}">${t.emoji}</span>
      <span><span class="li-name">${t.name}</span><span class="li-sub">${t.live ? '<span class="live">● OPEN</span> · ' : "Closed · "}${t.cat} · ★ ${t.rating}</span></span>
      <span class="li-dist">${t.dist}</span></button>`).join("");
  renderDetail();
}
listEl.addEventListener("click", e => { const b = e.target.closest(".list-item"); if (b) select(b.dataset.id); });
function select(id) { selectedId = id; renderDemo(); }
function renderDetail() {
  const t = TRUCKS.find(x => x.id === selectedId);
  if (!t) { detailEl.innerHTML = ""; return; }
  const fav = favorites.has(t.id);
  detailEl.innerHTML = `
    <div class="dd-hero" style="background:linear-gradient(135deg, ${t.color}, #161A23)">${t.emoji}</div>
    <p class="dd-name">${t.name}</p>
    <p class="dd-sub">${t.cat} · <span style="color:var(--gold)">★ ${t.rating}</span></p>
    <div class="dd-meta">
      ${t.live ? `<span class="live">● Open until ${t.until}</span>` : `<span>Closed · ${t.until}</span>`}
      <span>📍 ${t.dist}</span>${t.live ? `<span>⏱ ${t.wait}</span>` : ""}
    </div>
    <ul class="dd-menu">${t.menu.map(([n, p]) => `<li><span>${n}</span><span>${p}</span></li>`).join("")}</ul>
    <div class="dd-actions">
      <button class="btn btn-primary" id="ddDir" ${t.live ? "" : "disabled"}>${t.live ? "Get directions" : "Closed right now"}</button>
      <button class="btn btn-ghost fav-btn${fav ? " on" : ""}" id="ddFav" aria-pressed="${fav}">${fav ? "❤️ Saved" : "🤍 Save"}</button>
    </div>`;
  $("#ddDir").addEventListener("click", () => toast(`🧭 In the app, this opens <b>Apple Maps</b> or <b>Google Maps</b> to ${t.name}.`));
  $("#ddFav").addEventListener("click", () => toggleFav(t));
}
function toggleFav(t) {
  if (favorites.has(t.id)) { favorites.delete(t.id); renderDetail(); toast(`Removed ${t.name} from your saved trucks.`); return; }
  favorites.add(t.id); renderDetail();
  toast(`❤️ Saved! We'll let you know when <b>${t.name}</b> opens.`);
  setTimeout(() => toast(`<span class="live-dot"></span> <span><b>${t.name}</b> just opened · ${t.dist} away</span>`, 3800), 2800);
}
$$(".view-toggle button").forEach(b => b.addEventListener("click", () => {
  $$(".view-toggle button").forEach(x => x.classList.toggle("active", x === b));
  $(".demo-body").dataset.view = b.dataset.view;
}));
renderDemo();

/* =========================================================
   GO LIVE SIMULATOR (truck owners)
   ========================================================= */
const goBtn = $("#goLiveBtn"), nameIn = $("#truckName"), spotIn = $("#truckSpot");
const card = $("#storyCard"), scName = $("#scName"), scWhere = $("#scWhere"), scUntil = $("#scUntil"), scStatus = $("#scStatus");
const copyBtn = $("#copyStory");
let isLive = false;
function syncCard() { scName.textContent = nameIn.value.trim() || "Your Truck"; scWhere.textContent = "📍 " + spotIn.value; }
nameIn.addEventListener("input", syncCard); spotIn.addEventListener("change", syncCard); syncCard();
function countUp(el, to, ms = 1400) {
  if (!motionOn) { el.textContent = to; return; }
  const start = performance.now();
  const step = now => {
    const p = Math.min(1, (now - start) / ms);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
goBtn.addEventListener("click", () => {
  isLive = !isLive;
  goBtn.setAttribute("aria-pressed", isLive);
  $(".gl-label", goBtn).textContent = isLive ? "You're Live" : "Go Live";
  card.classList.toggle("is-live", isLive);
  scStatus.textContent = isLive ? "● LIVE NOW" : "OFFLINE";
  copyBtn.disabled = !isLive;
  if (isLive) {
    const until = new Date(Date.now() + 3 * 3600e3); until.setMinutes(0);
    scUntil.textContent = "Open until " + until.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    countUp($("#statAlert"), 48); countUp($("#statViews"), 126, 1800); countUp($("#statTaps"), 31, 2000);
    $("#glHint").textContent = "🎉 You're on the map and your fans got a ping. Press again to end the shift.";
    toast(`<span class="live-dot"></span> <span><b>${scName.textContent}</b> is live at ${spotIn.value}</span>`);
  } else {
    scUntil.textContent = "Press Go Live";
    ["#statAlert", "#statViews", "#statTaps"].forEach(s => ($(s).textContent = "—"));
    $("#glHint").textContent = "Shift ended. You're off the map, so nobody shows up to a closed window.";
  }
});
copyBtn.addEventListener("click", async () => {
  const text = `We're LIVE at ${spotIn.value}! 🚚🔥 Find ${scName.textContent} on Trovo. ${CONFIG.SITE_URL}`.trim();
  toast((await copyText(text)) ? "📋 Caption copied. Paste it with your story card." : "Couldn't copy here. Please try again.");
});

/* =========================================================
   SIGN-UP → Founding badge + share
   ========================================================= */
const form = $("#signupForm"), badgeWrap = $("#badgeWrap"), err = $("#suErr");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const email = $("#suEmail").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email address, like name@example.com."; $("#suEmail").focus(); return; }
  err.textContent = "";
  const name = $("#suName").value.trim(), city = $("#suCity").value;
  if (CONFIG.WAITLIST_ENDPOINT) {
    try {
      const res = await fetch(CONFIG.WAITLIST_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, city, role: audience })
      });
      if (!res.ok) throw new Error(res.status);
    } catch (_) { err.textContent = "Something went wrong. Please try again."; return; }
  }
  $("#badgeTitle").textContent = audience === "truck" ? "Founding Truck" : "Founding Foodie";
  $("#badgeName").textContent = name || (audience === "truck" ? "Truck crew" : "Hungry local");
  $("#badgeCity").textContent = city;
  $("#badgeMsg").textContent = audience === "truck"
    ? "You're on the founding list! Know another truck owner? More trucks on the map means more customers looking."
    : "You're in! Know someone who's always hunting for lunch? Send them this.";
  form.hidden = true; badgeWrap.hidden = false;
});
$("#shareBtn").addEventListener("click", async () => {
  const text = audience === "truck"
    ? `Check out Trovo: one tap puts your food truck on the map for hungry people nearby 🚚 ${siteUrl()}`
    : `Found an app that shows which food trucks are actually open right now 🌮 Lunch this week? ${siteUrl()}`;
  const ok = await copyText(text);
  toast(ok ? "📋 Message copied. Paste it in your group chat." : "Couldn't copy here. Grab the link from your address bar.");
});
$("#resetBtn").addEventListener("click", () => { form.reset(); form.hidden = false; badgeWrap.hidden = true; });

/* =========================================================
   MOTION PACK (respects the Pause button)
   ========================================================= */
(function roadTrucks() {
  const g = $("#roadTrucks"); if (!g) return;
  const colors = [["#E6592A", "#C34A20"], ["#00695C", "#004d43"], ["#FBBF24", "#d99a0b"], ["#9BA6BB", "#6B7386"]];
  g.innerHTML = colors.map(([b, c], i) => `
    <g><g transform="translate(0,-4)">
      <rect x="-30" y="-30" width="40" height="22" rx="4" fill="${b}"/>
      <rect x="-25" y="-25" width="22" height="9" rx="2" fill="#0b0d12"/>
      <rect x="8" y="-22" width="20" height="14" rx="3" fill="${c}"/>
      <rect x="13" y="-19" width="10" height="6" rx="1.5" fill="#cbd5e1"/>
      <circle cx="27" cy="-12" r="2" fill="#fde68a"/>
      <circle cx="-20" cy="-6" r="5.5" fill="#111" stroke="#fff" stroke-width="2"/>
      <circle cx="17" cy="-6" r="5.5" fill="#111" stroke="#fff" stroke-width="2"/></g>
      <animateMotion dur="${15 + i * 2}s" begin="${-i * 4.3}s" repeatCount="indefinite" rotate="auto"><mpath href="#roadPath"/></animateMotion>
    </g>`).join("");
})();

(function foodFloat() {
  const box = $("#foodFloat"); if (!box) return;
  const foods = ["🌮", "🍔", "🍗", "🍖", "🍑", "🍋", "🥤", "🍳", "🌯", "🍟", "🧁", "🥪"];
  const spawn = () => {
    if (!motionOn || document.hidden || box.childElementCount > 14 || scrollY > innerHeight) return;
    const s = document.createElement("span");
    s.textContent = foods[Math.floor(Math.random() * foods.length)];
    s.style.left = Math.random() * 100 + "%";
    s.style.setProperty("--s", 20 + Math.random() * 26 + "px");
    s.style.setProperty("--d", 8 + Math.random() * 6 + "s");
    s.style.setProperty("--x", (Math.random() * 120 - 60) + "px");
    s.style.setProperty("--r", (Math.random() * 120 - 60) + "deg");
    box.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  };
  for (let k = 0; k < 6; k++) setTimeout(spawn, k * 350);
  setInterval(spawn, 900);
})();

(function phoneCycle() {
  const cardEl = $(".ps-card"), pins = $$(".ps-map .pin");
  const live = TRUCKS.filter(t => t.live);
  let k = 1;
  setInterval(() => {
    if (!motionOn || document.hidden) return;
    const t = live[k % live.length];
    cardEl.classList.add("swap");
    setTimeout(() => {
      $(".ps-thumb", cardEl).textContent = t.emoji;
      $(".ps-thumb", cardEl).style.background = `linear-gradient(135deg, ${t.color}, #161A23)`;
      $(".ps-row strong", cardEl).textContent = t.name;
      $(".rating", cardEl).textContent = "★ " + t.rating;
      $(".ps-sub", cardEl).textContent = t.cat;
      $(".ps-meta", cardEl).innerHTML = `<span class="live">● LIVE</span><span>📍 ${t.dist}</span><span>⏱ ${t.wait}</span>`;
      pins.forEach((p, i) => p.classList.toggle("hot", i === k % pins.length));
      cardEl.classList.remove("swap");
      k++;
    }, 350);
  }, 3200);
})();

const parallax = [
  ...$$(".blob").map(el => ({ el, speed: 0.25 })),
  ...$$(".float-badge").map(el => ({ el, speed: -0.12 })),
  ...$$(".sad-cloud").map(el => ({ el, speed: -0.1 })),
  ...$$(".truck").map(el => ({ el, speed: 0.06 })),
  ...$$(".story-card").map(el => ({ el, speed: -0.05 }))
];
let ticking = false;
function motionFrame() {
  ticking = false;
  const vh = innerHeight;
  banners.forEach(({ el, track, dir }) => {
    const r = el.getBoundingClientRect();
    if (r.bottom < -50 || r.top > vh + 50) return;
    const p = (vh - r.top) / (vh + r.height);
    track.style.transform = motionOn ? `translateX(${dir * (p * 40 + (dir > 0 ? -45 : 5))}%)` : "translateX(-5%)";
  });
  parallax.forEach(({ el, speed }) => {
    if (!motionOn) { el.style.translate = ""; return; }
    const r = el.getBoundingClientRect();
    if (r.bottom < -200 || r.top > vh + 200) return;
    el.style.translate = `0 ${((r.top + r.height / 2 - vh / 2) * speed).toFixed(1)}px`;
  });
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(motionFrame); } }, { passive: true });

(function mapLife() {
  const radar = document.createElement("div"); radar.className = "radar"; mapEl.prepend(radar);
  [{ top: "22%", d: 9 }, { top: "41%", d: 12, rev: true }, { top: "88%", d: 10 }, { top: "22%", d: 14, delay: -6 }, { top: "41%", d: 8, rev: true, delay: -3 }]
    .forEach(r => {
      const c = document.createElement("i");
      c.className = "car" + (r.rev ? " rev" : "");
      c.style.top = r.top; c.style.setProperty("--d", r.d + "s"); c.style.setProperty("--delay", (r.delay || 0) + "s");
      mapEl.appendChild(c);
    });
  [["14%", 11], ["40%", 9], ["64%", 13], ["88%", 10]].forEach(([left, d], i) => {
    const c = document.createElement("i");
    c.className = "car v"; c.style.left = left; c.style.setProperty("--d", d + "s"); c.style.setProperty("--delay", -i * 2.5 + "s");
    mapEl.appendChild(c);
  });
  const bubble = (t, text) => {
    const b = document.createElement("div");
    b.className = "map-bubble"; b.textContent = text;
    b.style.left = t.x + "%"; b.style.top = t.y + "%";
    mapEl.appendChild(b); setTimeout(() => b.remove(), 3300);
  };
  const lemon = TRUCKS.find(t => t.id === "lemon");
  let tick = 0;
  setInterval(() => {
    if (!motionOn || document.hidden || audience !== "foodie") return;
    const r = mapEl.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight) return;
    tick++;
    if (tick % 3 === 0) {
      lemon.live = !lemon.live;
      lemon.until = lemon.live ? "5:00 PM" : "Back Sat 11 AM";
      lemon.wait = lemon.live ? "5 min" : "—";
      const pin = $(`.map-pin[data-id="lemon"]`, mapEl);
      pin.classList.toggle("offline", !lemon.live);
      if (lemon.live) { pin.classList.remove("just-live"); void pin.offsetWidth; pin.classList.add("just-live"); }
      bubble(lemon, lemon.live ? "🎉 Just opened!" : "👋 Closed for the day");
      renderDemo();
    } else {
      const live = TRUCKS.filter(t => t.live);
      const t = live[Math.floor(Math.random() * live.length)];
      const msgs = ["🔥 Line's moving fast", "🧭 Someone's on the way", "⭐ New 5-star review", "🍽️ Menu updated"];
      bubble(t, msgs[Math.floor(Math.random() * msgs.length)]);
    }
  }, 2800);
})();

if (canHover) {
  $$(".price-card, .problem-trio > div, .icon-row li").forEach(c => {
    c.classList.add("tiltable");
    c.addEventListener("pointermove", e => {
      if (!motionOn) return;
      const r = c.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-4px)`;
    });
    c.addEventListener("pointerleave", () => (c.style.transform = ""));
  });
}

/* ---------- start ---------- */
applyMotion();
setAudience(audience);
setInterval(tickClock, 30000);
