/* =========================================================
   Trovo marketing site — interactions
   ========================================================= */
const CONFIG = {
  // Paste a form endpoint here (Formspree, Netlify Forms, your API) to collect sign-ups.
  // While empty, the form shows the success state but does not send data anywhere.
  WAITLIST_ENDPOINT: "",
  // Public URL used by the "Copy invite link" button. Falls back to the current page.
  SITE_URL: ""
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- toast ---------- */
let toastTimer;
function toast(html, ms = 3200) {
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

/* ---------- live clock (Contagious: Trigger) ---------- */
function tickClock() {
  const d = new Date();
  const t = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  $("#clock").textContent = `It's ${t}.`;
}
tickClock(); setInterval(tickClock, 30000);
$("#year").textContent = new Date().getFullYear();

/* ---------- food truck SVG builder ---------- */
function truckSVG({ body = "#E6592A", cab = "#C34A20", sign = "TROVO", signColor = "#FBBF24", menu = "", closed = false }) {
  const stripes = Array.from({ length: 8 }, (_, i) => {
    const x = 36 + i * 30.5, fill = i % 2 ? "#FFFFFF" : signColor;
    return `<rect x="${x}" y="76" width="30.6" height="28" fill="${fill}"/><circle cx="${x + 15.25}" cy="104" r="15.25" fill="${fill}"/>`;
  }).join("");
  const items = menu ? menu.split("|").slice(0, 3) : [];
  const menuLines = items.map((m, i) =>
    `<text class="menu-line" x="64" y="${138 + i * 20}" fill="#fff" font-size="14" font-weight="600" font-family="Outfit, sans-serif">${m}</text>
     <circle class="menu-line" cx="252" cy="${133 + i * 20}" r="4" fill="${signColor}"/>`).join("");
  const cook = items.length ? "" : `<circle class="menu-line" cx="158" cy="130" r="16" fill="#3A4152"/><rect class="menu-line" x="134" y="148" width="48" height="36" rx="14" fill="#3A4152"/>`;
  const fit = sign.length > 14 ? `textLength="186" lengthAdjust="spacingAndGlyphs"` : "";
  const shutterLines = Array.from({ length: 7 }, (_, i) => `<line x1="48" x2="268" y1="${104 + i * 12}" y2="${104 + i * 12}" stroke="#6B7386" stroke-width="2"/>`).join("");
  const closedSign = closed ? `<rect x="118" y="124" width="80" height="28" rx="6" fill="#161A23"/><text x="158" y="143" fill="#e57373" font-size="13" font-weight="800" text-anchor="middle" font-family="Outfit, sans-serif">CLOSED</text>` : "";
  const wheel = (cx) => `
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

/* ---------- reveal + truck arrival ---------- */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    if (el.matches("[data-truck]")) {
      el.classList.add("arrived");
      if (el.dataset.stayClosed !== "true") setTimeout(() => el.classList.add("open"), reduceMotion ? 0 : 900);
    } else {
      el.classList.add("in");
    }
    io.unobserve(el);
  });
}, { threshold: 0, rootMargin: "0px 0px -12% 0px" });
$$(".reveal, [data-truck]").forEach(el => io.observe(el));

/* stagger reveals within the same parent */
$$(".feature-wall, .authority, .pricing, .plan").forEach(group => {
  $$(".reveal, .auth-card", group).forEach((el, i) => (el.style.transitionDelay = `${i * 80}ms`));
});

/* ---------- route bar progress ---------- */
const stops = $$(".stop");
const routeLinks = $$(".route-stops a");
const fill = $(".route-fill");
const routeTruck = $(".route-truck");
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = Math.min(1, Math.max(0, scrollY / max));
  fill.style.width = `${p * 100}%`;
  routeTruck.style.left = `${p * 100}%`;
  let active = 0;
  stops.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * 0.45) active = i; });
  routeLinks.forEach((a, i) => {
    a.classList.toggle("active", i === active);
    a.classList.toggle("passed", i < active);
  });
}
addEventListener("scroll", onScroll, { passive: true });
addEventListener("resize", onScroll);
onScroll();

/* ---------- cursor glow + magnetic buttons + phone tilt ---------- */
const glow = $(".cursor-glow");
addEventListener("pointermove", e => {
  if (glow) glow.style.transform = `translate(${e.clientX - 260}px, ${e.clientY - 260}px)`;
}, { passive: true });
if (glow) glow.style.transform = "translate(-999px,-999px)";

if (!reduceMotion && matchMedia("(hover: hover)").matches) {
  $$(".magnetic").forEach(btn => {
    btn.addEventListener("pointermove", e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      btn.style.transform = `translate(${x}px, ${y}px)`;
    });
    btn.addEventListener("pointerleave", () => (btn.style.transform = ""));
  });

  const phone = $("#heroPhone");
  const wrap = $(".hero");
  wrap.addEventListener("pointermove", e => {
    const r = wrap.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    phone.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
  });
  wrap.addEventListener("pointerleave", () => (phone.style.transform = ""));
}

/* ---------- Stop 2: old way vs Trovo way ---------- */
const compare = $("#compare");
compare.dataset.mode = "old";
$$(".compare-toggle button", compare).forEach(b => b.addEventListener("click", () => {
  const mode = b.dataset.mode;
  compare.dataset.mode = mode;
  $$(".compare-toggle button", compare).forEach(x => { x.classList.toggle("active", x === b); x.setAttribute("aria-selected", x === b); });
  $$(".panel", compare).forEach(p => p.classList.toggle("active", p.dataset.panel === mode));
}));
/* auto-flip once when it scrolls into view, to show the contrast */
new IntersectionObserver((en, obs) => {
  if (en[0].isIntersecting) { setTimeout(() => $('[data-mode="new"]', compare).click(), 2600); obs.disconnect(); }
}, { threshold: 0.6 }).observe(compare);

/* ---------- Stop 3: live map demo (sample data) ---------- */
const TRUCKS = [
  { id: "kamal", name: "Kamal's Biscuits And Gravy", cat: "Southern", emoji: "🍳", x: 30, y: 32, dist: "0.4 mi", rating: "5.0", wait: "10–15 min", live: true, until: "2:00 PM", color: "#6b3a1c",
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
const CATS = ["All", "Southern", "Tacos", "BBQ", "Wings", "Sweets"];
let currentCat = "All", selectedId = "kamal";
const favorites = new Set();

const chipsEl = $("#chips"), mapEl = $("#demoMap"), listEl = $("#demoList"), detailEl = $("#demoDetail");
chipsEl.innerHTML = CATS.map(c => `<button class="chip${c === "All" ? " active" : ""}" data-cat="${c}">${c}</button>`).join("");
chipsEl.addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  currentCat = b.dataset.cat;
  $$(".chip", chipsEl).forEach(c => c.classList.toggle("active", c === b));
  renderDemo();
});

TRUCKS.forEach(t => {
  const pin = document.createElement("button");
  pin.className = "map-pin" + (t.live ? "" : " offline");
  pin.style.left = t.x + "%"; pin.style.top = t.y + "%";
  pin.dataset.id = t.id;
  pin.setAttribute("aria-label", `${t.name}, ${t.live ? "live now" : "offline"}, ${t.dist}`);
  pin.innerHTML = `<span class="mp-label">${t.name}</span><span class="mp-head">${t.emoji}</span><span class="mp-tail"></span>`;
  pin.addEventListener("click", () => select(t.id));
  mapEl.appendChild(pin);
});

function renderDemo() {
  const visible = TRUCKS.filter(t => currentCat === "All" || t.cat === currentCat);
  $$(".map-pin", mapEl).forEach(p => {
    const t = TRUCKS.find(x => x.id === p.dataset.id);
    p.classList.toggle("dim", !visible.includes(t));
    p.classList.toggle("selected", t.id === selectedId);
  });
  listEl.innerHTML = visible
    .sort((a, b) => (b.live - a.live) || parseFloat(a.dist) - parseFloat(b.dist))
    .map(t => `<button class="list-item${t.id === selectedId ? " selected" : ""}" data-id="${t.id}">
      <span class="li-thumb" style="background:${t.color}">${t.emoji}</span>
      <span><span class="li-name">${t.name}</span><span class="li-sub">${t.live ? '<span class="live">● LIVE</span> · ' : "Offline · "}${t.cat} · ★ ${t.rating}</span></span>
      <span class="li-dist">${t.dist}</span></button>`).join("");
  if (!visible.find(t => t.id === selectedId) && visible[0]) selectedId = visible[0].id;
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
      ${t.live ? `<span class="live">● LIVE until ${t.until}</span>` : `<span>⏸ ${t.until}</span>`}
      <span>📍 ${t.dist}</span>${t.live ? `<span>⏱ ${t.wait}</span>` : ""}
    </div>
    <ul class="dd-menu">${t.menu.map(([n, p]) => `<li><span>${n}</span><span>${p}</span></li>`).join("")}</ul>
    <div class="dd-actions">
      <button class="btn btn-primary" id="ddDir" ${t.live ? "" : "disabled"}>${t.live ? "Directions" : "Not serving now"}</button>
      <button class="btn btn-ghost fav-btn${fav ? " on" : ""}" id="ddFav" aria-pressed="${fav}" aria-label="Favorite">${fav ? "❤️" : "🤍"}</button>
    </div>`;
  $("#ddDir").addEventListener("click", () => toast(`🧭 In the app, this opens <b>Apple Maps</b> or <b>Google Maps</b> straight to ${t.name}.`));
  $("#ddFav").addEventListener("click", () => toggleFav(t));
}

function toggleFav(t) {
  if (favorites.has(t.id)) { favorites.delete(t.id); toast(`Removed ${t.name} from favorites.`); renderDetail(); return; }
  favorites.add(t.id);
  renderDetail();
  toast(`❤️ Saved! We'll ping you when <b>${t.name}</b> goes live.`);
  setTimeout(() => toast(`<span class="live-dot"></span> <span><b>${t.name}</b> just went live · ${t.dist} away</span>`, 3600), 2600);
}

$$(".view-toggle button").forEach(b => b.addEventListener("click", () => {
  $$(".view-toggle button").forEach(x => x.classList.toggle("active", x === b));
  $(".demo-body").dataset.view = b.dataset.view;
}));
renderDemo();

/* ---------- Stop 4: craving picker (Cialdini: small commitment) ---------- */
const craveResult = $("#craveResult");
$$(".crave-opts button").forEach(b => b.addEventListener("click", () => {
  $$(".crave-opts button").forEach(x => x.classList.toggle("active", x === b));
  const t = TRUCKS.find(x => x.cat === b.dataset.crave && x.live) || TRUCKS[0];
  craveResult.hidden = false;
  craveResult.style.animation = "none"; void craveResult.offsetWidth; craveResult.style.animation = "";
  craveResult.innerHTML = `<span class="cr-ic">${t.emoji}</span>
    <p><b>${t.name}</b> is serving ${t.menu[0][0].toLowerCase()} <b>${t.dist}</b> away. <span style="color:var(--muted)">(sample)</span></p>
    <button class="btn btn-primary btn-sm" id="craveFav">${favorites.has(t.id) ? "❤️ Saved" : "❤️ Favorite"}</button>`;
  $("#craveFav").addEventListener("click", e => {
    if (!favorites.has(t.id)) toggleFav(t);
    e.currentTarget.textContent = "❤️ Saved";
  });
}));

/* ---------- Stop 5: Go Live simulator ---------- */
const goBtn = $("#goLiveBtn"), nameIn = $("#truckName"), spotIn = $("#truckSpot");
const card = $("#storyCard"), scName = $("#scName"), scWhere = $("#scWhere"), scUntil = $("#scUntil"), scStatus = $("#scStatus");
const copyBtn = $("#copyStory");
let isLive = false;

function syncCard() {
  scName.textContent = nameIn.value.trim() || "Your Truck";
  scWhere.textContent = "📍 " + spotIn.value;
}
nameIn.addEventListener("input", syncCard);
spotIn.addEventListener("change", syncCard);
syncCard();

function countUp(el, to, ms = 1400) {
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
    const until = new Date(Date.now() + 3 * 3600e3);
    until.setMinutes(0);
    scUntil.textContent = "Serving until " + until.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    countUp($("#statAlert"), 48); countUp($("#statViews"), 126, 1800); countUp($("#statTaps"), 31, 2000);
    $("#glHint").innerHTML = "🎉 You're on the map. Followers got a ping, and your story card is ready to share. When the shift ends, it turns off on its own.";
    toast(`<span class="live-dot"></span> <span><b>${scName.textContent}</b> is live at ${spotIn.value}</span>`);
  } else {
    scUntil.textContent = "Tap Go Live to start your shift";
    ["#statAlert", "#statViews", "#statTaps"].forEach(s => ($(s).textContent = "—"));
    $("#glHint").textContent = "Shift ended. You're off the map, so no one shows up to a closed window.";
  }
});

copyBtn.addEventListener("click", async () => {
  const text = `We're LIVE at ${spotIn.value}! 🚚🔥 Come hungry. Find ${scName.textContent} live on Trovo. ${CONFIG.SITE_URL || ""}`.trim();
  toast((await copyText(text)) ? "📋 Caption copied. Paste it with your story card." : "Couldn't copy here. Try again in the app.");
});

/* ---------- Stop 6 → 7: role pass-through ---------- */
function setRole(role) {
  $$(".role-toggle button").forEach(b => {
    const on = b.dataset.role === role;
    b.classList.toggle("active", on); b.setAttribute("aria-checked", on);
  });
  $("#suBtn").textContent = role === "truck" ? "Claim my founding spot" : "Get early access";
}
$$(".role-toggle button").forEach(b => b.addEventListener("click", () => setRole(b.dataset.role)));
$$(".price-card .btn[data-role]").forEach(b => b.addEventListener("click", () => setRole(b.dataset.role)));
$$('a[href="#stop-5"]').forEach(a => a.addEventListener("click", () => setRole("truck")));

/* ---------- Stop 7: signup → Founding badge (Contagious: Social currency) ---------- */
const form = $("#signupForm"), badgeWrap = $("#badgeWrap"), err = $("#suErr");
form.addEventListener("submit", async e => {
  e.preventDefault();
  const email = $("#suEmail").value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { err.textContent = "Please enter a valid email address."; $("#suEmail").focus(); return; }
  err.textContent = "";
  const role = $(".role-toggle button.active").dataset.role;
  const name = $("#suName").value.trim();
  const city = $("#suCity").value;

  if (CONFIG.WAITLIST_ENDPOINT) {
    try {
      const res = await fetch(CONFIG.WAITLIST_ENDPOINT, {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, city, role })
      });
      if (!res.ok) throw new Error(res.status);
    } catch (_) { err.textContent = "Something went wrong. Please try again."; return; }
  }

  $("#badgeTitle").textContent = role === "truck" ? "Founding Truck" : "Founding Foodie";
  $("#badgeName").textContent = name || (role === "truck" ? "Truck crew" : "Hungry local");
  $("#badgeCity").textContent = city.replace(" (next!)", "");
  $("#badgeMsg").textContent = role === "truck"
    ? "You're on the founding list. Know another truck owner? Send them this, because the more trucks on the map, the more customers come looking."
    : "You're in. Know someone who's always hunting for lunch? Send them this.";
  form.hidden = true; badgeWrap.hidden = false;
});
$("#shareBtn").addEventListener("click", async () => {
  const url = CONFIG.SITE_URL || location.href.split("#")[0];
  const ok = await copyText(`Found the app that shows which food trucks are actually open right now 🚚 ${url}`);
  toast(ok ? "📋 Invite link copied. Send it to a hungry friend." : "Couldn't copy here. Grab the link from your address bar.");
});
$("#resetBtn").addEventListener("click", () => { form.reset(); setRole("foodie"); form.hidden = false; badgeWrap.hidden = true; });
