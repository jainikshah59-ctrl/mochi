/* Mochi — app shell: navigation, home, studio panels, gallery, pro, share. */
MOCHI.ui = (() => {
  const $ = (id) => document.getElementById(id);
  const I = (n) => MOCHI.icons[n];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  const SAMPLES = ["kitten", "bunny", "dessert", "rainbow"];
  const store = {
    get gallery() { try { return JSON.parse(localStorage.getItem("mochi_gallery") || "[]"); } catch (e) { return []; } },
    set gallery(v) { try { localStorage.setItem("mochi_gallery", JSON.stringify(v.slice(0, 24))); } catch (e) {} },
    get name() { try { return localStorage.getItem("mochi_name") || ""; } catch (e) { return ""; } },
    set name(v) { try { localStorage.setItem("mochi_name", v); } catch (e) {} },
  };

  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(t._h);
    t._h = setTimeout(() => t.classList.remove("show"), 2200);
  }

  function show(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.toggle("active", s.id === id));
    document.querySelector(".bottom-nav").style.display = id === "screen-studio" ? "none" : "";
    window.scrollTo(0, 0);
  }

  function iconBtn(icon, label) {
    return `<span class="ic">${I(icon)}</span>${label ? `<span>${label}</span>` : ""}`;
  }

  // ---------- init ----------
  function init() {
    document.querySelectorAll("[data-icon]").forEach(el => { el.innerHTML = I(el.dataset.icon); });
    if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    }
    buildHome();
    buildStudio();
    buildGallery();
    buildPro();
    bindNav();
    MOCHI.editor.bindPointer();
    setTimeout(() => {
      if (store.name) { show("screen-home"); refreshHome(); }
      else show("screen-onboard");
    }, 1100);
  }

  // ---------- onboarding ----------
  function bindOnboard() {
    const colors = ["#ff8fb3", "#c3b2ff", "#9adcff", "#7ed491", "#ffd66e"];
    const wrap = $("ob-colors");
    wrap.innerHTML = colors.map((c, i) =>
      `<button class="color-dot${i === 0 ? " sel" : ""}" data-c="${c}" style="--c:${c}" aria-label="color"></button>`).join("");
    let sel = colors[0];
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest(".color-dot"); if (!b) return;
      wrap.querySelectorAll(".color-dot").forEach(d => d.classList.remove("sel"));
      b.classList.add("sel"); sel = b.dataset.c;
      document.documentElement.style.setProperty("--acc", sel);
    });
    $("ob-start").addEventListener("click", () => {
      const name = $("ob-name").value.trim().slice(0, 20) || "Cutie";
      store.name = name;
      document.documentElement.style.setProperty("--acc", sel);
      try { localStorage.setItem("mochi_color", sel); } catch (e) {}
      show("screen-home"); refreshHome();
      toast(`Hi ${name}! Let's make something cute`);
    });
  }

  // ---------- home ----------
  function buildHome() {
    const day = new Date().getDate();
    const ch = MOCHI.config.CHALLENGES[day % MOCHI.config.CHALLENGES.length];
    $("home-challenge-tag").textContent = ch.tag;
    $("home-challenge-prompt").textContent = ch.prompt;
    // templates
    $("home-templates").innerHTML = MOCHI.config.TEMPLATES.map(t =>
      `<button class="tpl-card" data-tpl="${t.id}">
         <span class="tpl-art tpl-${t.id}"></span>
         <span class="tpl-name">${esc(t.name)}</span>
       </button>`).join("");
    $("home-templates").addEventListener("click", (e) => {
      const b = e.target.closest(".tpl-card"); if (!b) return;
      applyTemplate(b.dataset.tpl);
    });
    $("btn-upload").addEventListener("click", () => $("file-input").click());
    $("btn-camera").addEventListener("click", () => $("camera-input").click());
    $("home-challenge-go").addEventListener("click", () => $("file-input").click());
    $("file-input").addEventListener("change", (e) => loadFile(e.target.files[0]));
    $("camera-input").addEventListener("change", (e) => loadFile(e.target.files[0]));
    bindOnboard();
  }

  function refreshHome() {
    $("home-hi").textContent = `Hi ${store.name || "Cutie"}!`;
    const g = store.gallery;
    $("home-recent").innerHTML = g.length
      ? g.slice(0, 4).map(item =>
          `<button class="g-thumb" data-id="${item.id}"><img src="${item.thumb}" alt="creation"></button>`).join("")
      : `<div class="g-empty">Your cute creations will appear here</div>`;
    $("home-recent").onclick = (e) => {
      const b = e.target.closest(".g-thumb"); if (!b) return;
      openView(b.dataset.id, "screen-home");
    };
    updateProBadges();
  }

  function updateProBadges() {
    const pro = MOCHI.pro.isPro();
    document.querySelectorAll(".pro-badge").forEach(el => {
      el.classList.toggle("is-pro", pro);
      el.innerHTML = pro
        ? `${I("crown")}<span>Pro</span>`
        : `${I("crown")}<span>Get Pro</span>`;
    });
  }

  function loadFile(file) {
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      MOCHI.editor.setPhoto(img);
      MOCHI.editor.E.selected = -1;
      URL.revokeObjectURL(img.src);
      openStudio();
    };
    img.onerror = () => toast("Could not read that photo");
    img.src = URL.createObjectURL(file);
  }

  function loadSample(key) {
    const img = new Image();
    img.onload = () => { MOCHI.editor.setPhoto(img); MOCHI.editor.E.selected = -1; openStudio(); };
    img.onerror = () => toast("Sample not ready yet");
    img.src = `assets/samples/${key}.png`;
  }

  function templateNeedsPro(t) {
    const f = MOCHI.config.FILTERS.find(f => f.id === t.filter);
    if (f && f.pro) return true;
    const fr = MOCHI.config.FRAMES.find(f => f.id === t.frame);
    if (fr && fr.pro) return true;
    const proStk = new Set();
    MOCHI.stickers.PACKS.filter(p => p.pro).forEach(p => p.ids.forEach(id => proStk.add(id)));
    return t.stickers.some(k => proStk.has(k));
  }

  function applyTemplate(id) {
    const t = MOCHI.config.TEMPLATES.find(t => t.id === id);
    if (!t) return;
    if (templateNeedsPro(t) && !MOCHI.pro.isPro()) {
      show("screen-pro");
      toast("That template is Pro — unlock all the cute");
      return;
    }
    const go = () => {
      const E = MOCHI.editor.E;
      E.filter = t.filter; E.frame = t.frame;
      E.caption = { text: t.caption, color: "#e14d78", size: 64 };
      E.stickers = []; E.selected = -1;
      t.stickers.forEach(k => MOCHI.editor.addSticker(k));
      E.selected = -1;
      syncStudioPanels();
      openStudio();
      toast(`Template "${t.name}" applied`);
    };
    if (MOCHI.editor.E.photo) go();
    else {
      const img = new Image();
      img.onload = () => { MOCHI.editor.setPhoto(img); go(); };
      img.onerror = () => { $("file-input").click(); toast("Pick a photo for the template"); };
      img.src = "assets/samples/kitten.png";
    }
  }

  // ---------- studio ----------
  let curTab = "photo";
  let panelDraw = {};
  function refreshLocks() {
    if (panelDraw.drawFilters) panelDraw.drawFilters();
    if (panelDraw.drawFrames) panelDraw.drawFrames();
    if (panelDraw.drawPacks) panelDraw.drawPacks();
    updateProBadges();
  }
  function buildStudio() {
    $("st-back").addEventListener("click", () => { show("screen-home"); refreshHome(); });
    $("st-export").addEventListener("click", onExport);
    $("st-share").addEventListener("click", onShare);
    $("st-save").addEventListener("click", onSaveToGallery);

    // tool tabs
    document.querySelectorAll(".tool-tab").forEach(b => {
      b.addEventListener("click", () => {
        curTab = b.dataset.tab;
        document.querySelectorAll(".tool-tab").forEach(x => x.classList.toggle("sel", x === b));
        document.querySelectorAll(".tool-panel").forEach(p => p.classList.toggle("sel", p.id === "panel-" + curTab));
      });
    });

    // photo panel
    $("ph-upload").addEventListener("click", () => $("file-input").click());
    $("ph-zoom").addEventListener("input", (e) => {
      const E = MOCHI.editor.E;
      if (E.photo) { E.photo.scale = E.photo.base * parseFloat(e.target.value); MOCHI.editor.render(); }
    });
    $("ph-samples").innerHTML = SAMPLES.map(k =>
      `<button class="sample-thumb" data-k="${k}"><img src="assets/samples/${k}.png" alt="${k}" onerror="this.closest('.sample-thumb').style.display='none'"></button>`).join("");
    $("ph-samples").addEventListener("click", (e) => {
      const b = e.target.closest(".sample-thumb"); if (!b) return;
      loadSample(b.dataset.k);
    });

    // filters panel
    const drawFilters = () => {
      const el = $("panel-filters");
      el.innerHTML = MOCHI.config.FILTERS.map(f =>
        `<button class="filter-chip${f.pro && !MOCHI.pro.isPro() ? " locked" : ""}${MOCHI.editor.E.filter === f.id ? " sel" : ""}" data-f="${f.id}">
           <span class="f-swatch f-${f.id}"></span><span>${f.name}</span>
           ${f.pro && !MOCHI.pro.isPro() ? `<span class="mini-lock">${I("lock")}</span>` : ""}
         </button>`).join("");
    };
    drawFilters();
    $("panel-filters").addEventListener("click", (e) => {
      const b = e.target.closest(".filter-chip"); if (!b) return;
      const f = MOCHI.config.FILTERS.find(x => x.id === b.dataset.f);
      if (f.pro && !MOCHI.pro.isPro()) { show("screen-pro"); return; }
      MOCHI.editor.E.filter = f.id;
      document.querySelectorAll(".filter-chip").forEach(x => x.classList.toggle("sel", x === b));
      MOCHI.editor.render();
    });

    // stickers panel
    const packsEl = $("stk-packs"), gridEl = $("stk-grid");
    let curPack = "bloomy";
    const drawPacks = () => {
      packsEl.innerHTML = MOCHI.stickers.PACKS.map((p) =>
        `<button class="pack-tab${p.id === curPack ? " sel" : ""}" data-p="${p.id}">${p.name}${p.pro && !MOCHI.pro.isPro() ? ` ${I("lock")}` : ""}</button>`).join("");
    };
    const drawGrid = (pid) => {
      const p = MOCHI.stickers.PACKS.find(x => x.id === pid);
      gridEl.innerHTML = p.ids.map(k =>
        `<button class="stk-btn" data-k="${k}"><span class="stk-art">${MOCHI.stickers.SVG[k]}</span></button>`).join("");
    };
    drawPacks(); drawGrid("bloomy");
    packsEl.addEventListener("click", (e) => {
      const b = e.target.closest(".pack-tab"); if (!b) return;
      const p = MOCHI.stickers.PACKS.find(x => x.id === b.dataset.p);
      if (p.pro && !MOCHI.pro.isPro()) { show("screen-pro"); return; }
      curPack = p.id;
      packsEl.querySelectorAll(".pack-tab").forEach(x => x.classList.toggle("sel", x === b));
      drawGrid(p.id);
    });
    gridEl.addEventListener("click", (e) => {
      const b = e.target.closest(".stk-btn"); if (!b) return;
      MOCHI.editor.addSticker(b.dataset.k);
      syncStickerToolbar();
      toast("Sticker added — drag it around");
    });

    // frames panel
    const drawFrames = () => {
      const el = $("panel-frames");
      el.innerHTML = MOCHI.config.FRAMES.map(f =>
        `<button class="frame-chip${f.pro && !MOCHI.pro.isPro() ? " locked" : ""}${MOCHI.editor.E.frame === f.id ? " sel" : ""}" data-f="${f.id}">
           <span class="fr-swatch fr-${f.id}"></span>
           <span class="fr-name">${f.name}</span>
           ${f.desc ? `<span class="fr-desc">${f.desc}</span>` : ""}
           ${f.pro && !MOCHI.pro.isPro() ? `<span class="mini-lock">${I("lock")}</span>` : ""}
         </button>`).join("");
    };
    drawFrames();
    $("panel-frames").addEventListener("click", (e) => {
      const b = e.target.closest(".frame-chip"); if (!b) return;
      const f = MOCHI.config.FRAMES.find(x => x.id === b.dataset.f);
      if (f.pro && !MOCHI.pro.isPro()) { show("screen-pro"); return; }
      MOCHI.editor.E.frame = f.id;
      document.querySelectorAll(".frame-chip").forEach(x => x.classList.toggle("sel", x === b));
      MOCHI.editor.render();
    });

    // text panel
    const capColors = ["#e14d78", "#8f7bff", "#2f9e6e", "#3f8cff", "#f5a623", "#5d4457"];
    $("tx-colors").innerHTML = capColors.map((c, i) =>
      `<button class="color-dot${i === 0 ? " sel" : ""}" data-c="${c}" style="--c:${c}"></button>`).join("");
    $("tx-colors").addEventListener("click", (e) => {
      const b = e.target.closest(".color-dot"); if (!b) return;
      $("tx-colors").querySelectorAll(".color-dot").forEach(d => d.classList.remove("sel"));
      b.classList.add("sel");
      MOCHI.editor.E.caption.color = b.dataset.c;
      MOCHI.editor.render();
    });
    $("tx-input").addEventListener("input", (e) => {
      MOCHI.editor.E.caption.text = e.target.value.slice(0, 24);
      MOCHI.editor.render();
    });
    $("tx-size").addEventListener("input", (e) => {
      MOCHI.editor.E.caption.size = parseInt(e.target.value, 10);
      MOCHI.editor.render();
    });

    // sticker transform toolbar
    $("tt-size").addEventListener("input", (e) => {
      const st = MOCHI.editor.selectedSticker();
      if (st) { st.s = parseFloat(e.target.value); MOCHI.editor.render(); }
    });
    $("tt-rotate").addEventListener("input", (e) => {
      const st = MOCHI.editor.selectedSticker();
      if (st) { st.r = parseFloat(e.target.value); MOCHI.editor.render(); }
    });
    $("tt-flip").addEventListener("click", () => {
      const st = MOCHI.editor.selectedSticker();
      if (st) { st.flip = !st.flip; MOCHI.editor.render(); }
    });
    $("tt-fwd").addEventListener("click", () => { MOCHI.editor.bringForward(); });
    $("tt-del").addEventListener("click", () => { MOCHI.editor.deleteSelected(); syncStickerToolbar(); });
    $("tt-done").addEventListener("click", () => {
      MOCHI.editor.E.selected = -1;
      MOCHI.editor.render();
      syncStickerToolbar();
    });

    syncStudioPanels();
    MOCHI.editor.render();
    panelDraw = { drawFilters, drawFrames, drawPacks };
  }

  function syncStickerToolbar() {
    const st = MOCHI.editor.selectedSticker();
    $("sticker-tools").classList.toggle("show", !!st);
    if (st) {
      $("tt-size").value = st.s;
      $("tt-rotate").value = st.r;
    }
  }

  function syncStudioPanels() {
    const E = MOCHI.editor.E;
    document.querySelectorAll(".filter-chip").forEach(x => x.classList.toggle("sel", x.dataset.f === E.filter));
    document.querySelectorAll(".frame-chip").forEach(x => x.classList.toggle("sel", x.dataset.f === E.frame));
    $("tx-input").value = E.caption.text;
    $("tx-size").value = E.caption.size;
    if (E.photo) $("ph-zoom").value = (E.photo.scale / E.photo.base).toFixed(2);
  }

  function openStudio() {
    syncStudioPanels();
    syncStickerToolbar();
    show("screen-studio");
    MOCHI.editor.render();
  }

  async function onExport() {
    if (!MOCHI.editor.E.photo) { toast("Add a photo first"); return; }
    toast("Rendering your cuteness…");
    const blob = await MOCHI.editor.exportPNG();
    MOCHI.editor.render(1);
    if (!blob) { toast("Export failed"); return; }
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mochi.png";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast(MOCHI.pro.isPro() ? "Saved in HD!" : "Saved! Go Pro for HD + no watermark");
  }

  async function onShare() {
    if (!MOCHI.editor.E.photo) { toast("Add a photo first"); return; }
    const blob = await MOCHI.editor.exportPNG();
    MOCHI.editor.render(1);
    if (!blob) return;
    const file = new File([blob], "mochi.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: "Made with Mochi" }); return; }
      catch (e) { /* user cancelled */ }
    }
    onExport();
  }

  async function onSaveToGallery() {
    if (!MOCHI.editor.E.photo) { toast("Add a photo first"); return; }
    const blob = await MOCHI.editor.exportPNG();
    MOCHI.editor.render(1);
    if (!blob) return;
    const img = new Image();
    img.onload = () => {
      const t = document.createElement("canvas");
      t.width = 540; t.height = 675;
      t.getContext("2d").drawImage(img, 0, 0, 540, 675);
      const thumb = t.toDataURL("image/jpeg", 0.82);
      const g = store.gallery;
      g.unshift({ id: "m" + Date.now(), ts: Date.now(), thumb });
      store.gallery = g;
      toast("Saved to your gallery");
    };
    img.src = URL.createObjectURL(blob);
  }

  // ---------- gallery ----------
  function buildGallery() {
    $("gal-back").addEventListener("click", () => { show("screen-home"); refreshHome(); });
    $("gal-new").addEventListener("click", () => $("file-input").click());
    renderGallery();
  }
  function renderGallery() {
    const g = store.gallery;
    $("gallery-grid").innerHTML = g.length
      ? g.map(item => `<button class="g-thumb" data-id="${item.id}"><img src="${item.thumb}" alt="creation" loading="lazy"></button>`).join("")
      : `<div class="g-empty big">No creations yet.<br>Tap + to make your first cute pic.</div>`;
    $("gallery-grid").onclick = (e) => {
      const b = e.target.closest(".g-thumb"); if (!b) return;
      openView(b.dataset.id, "screen-gallery");
    };
  }
  function openView(id, from) {
    const item = store.gallery.find(x => x.id === id);
    if (!item) return;
    $("view-img").src = item.thumb;
    $("view-del").onclick = () => {
      store.gallery = store.gallery.filter(x => x.id !== id);
      show("screen-gallery"); renderGallery(); refreshHome();
      toast("Deleted");
    };
    $("view-share").onclick = async () => {
      const blob = await (await fetch(item.thumb)).blob();
      const file = new File([blob], "mochi.png", { type: blob.type });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: "Made with Mochi" }); } catch (e) {}
      } else {
        const a = document.createElement("a");
        a.href = item.thumb; a.download = "mochi.png"; a.click();
      }
    };
    $("view-back").onclick = () => {
      show(from === "screen-gallery" ? "screen-gallery" : "screen-home");
      renderGallery(); refreshHome();
    };
    show("screen-view");
  }

  // ---------- pro / paywall ----------
  let selectedPlanId = "yearly";
  function renderPlans() {
    const plans = MOCHI.config.PLANS;
    $("pro-plans").innerHTML = plans.map(p =>
      `<button class="plan-card${p.id === selectedPlanId ? " sel" : ""}" data-plan="${p.id}">
        ${p.best ? `<span class="pl-best">Best value</span>` : ""}
        <span class="pl-name">${p.name}</span>
        <span class="pl-price">₹${p.price}</span>
        <span class="pl-per">per ${p.per}</span>
        <span class="pl-blurb">${p.blurb}</span>
      </button>`).join("");
    $("pro-plans").querySelectorAll(".plan-card").forEach(c =>
      c.addEventListener("click", () => {
        selectedPlanId = c.dataset.plan;
        renderPlans();
      }));
    const p = MOCHI.pro.planById(selectedPlanId);
    $("pro-buy-label").textContent = `Get Pro — ₹${p.price}/${p.per}`;
  }

  function buildPro() {
    if (proBuilt) { refreshPayState(); return; }
    proBuilt = true;
    const feats = [
      ["sparkle", "All 28 stickers", "Bloomy + Sweet + Dreamy packs unlocked"],
      ["frame", "All frames & filters", "Scallop, Candy, Sakura, Matcha"],
      ["download", "HD export", "1.5x sharper pictures, no watermark"],
      ["crown", "New packs first", "Every future sticker pack while Pro"],
    ];
    $("pro-feats").innerHTML = feats.map(([ic, t, d]) =>
      `<div class="pro-feat"><span class="pf-ic">${I(ic)}</span><div><b>${t}</b><p>${d}</p></div><span class="pf-check">${I("check")}</span></div>`).join("");
    renderPlans();
    $("pro-buy").addEventListener("click", () => openPay(MOCHI.pro.planById(selectedPlanId)));
    $("pro-renew").addEventListener("click", () => {
      $("pro-owned").style.display = "none";
      $("pro-plans").style.display = "";
      $("pro-buy-row").style.display = "";
    });
    $("pay-close").addEventListener("click", () => show("screen-pro"));
    $("pay-open-app").addEventListener("click", () => { if (payIntent) window.location.href = payIntent; });
    $("pay-verify").addEventListener("click", () => {
      const v = $("pay-utr").value;
      if (!MOCHI.upi.validUtr(v)) { $("pay-msg").textContent = "Enter the 12-digit UTR from your UPI app."; return; }
      MOCHI.pro.activate(selectedPlanId);
      show("screen-pro"); buildPro();
      refreshLocks();
      toast("Welcome to Mochi Pro!");
    });
    refreshPayState();
  }

  let payIntent = null;
  function openPay(plan) {
    if (!MOCHI.upi.isConfigured()) {
      $("pay-qr-zone").innerHTML = '<div class="pay-pending">Payments are being set up.<br>Please check back soon.</div>';
      $("pay-utr-row").style.display = "none";
      $("pay-open-app").style.display = "none";
    } else {
      const { intent, txnRef } = MOCHI.upi.buildIntent(plan);
      payIntent = intent;
      $("pay-txn").textContent = "Ref: " + txnRef;
      MOCHI.upi.renderQR($("pay-qr-zone"), intent);
      $("pay-utr-row").style.display = "flex";
      $("pay-open-app").style.display = "block";
    }
    $("pro-price-2").textContent = "₹" + plan.price + " · " + plan.name;
    $("pay-utr").value = "";
    $("pay-msg").textContent = "";
    show("screen-pay");
  }

  function refreshPayState() {
    const info = MOCHI.pro.info();
    const owned = info.active;
    $("pro-plans").style.display = owned ? "none" : "";
    $("pro-buy-row").style.display = owned ? "none" : "";
    $("pro-owned").style.display = owned ? "" : "none";
    if (owned) {
      $("pro-owned-title").textContent = info.lifetime ? "You're Pro forever!" : "You're Pro!";
      $("pro-owned-sub").textContent = info.lifetime
        ? "All cute things unlocked."
        : `${info.planName} plan · ${info.daysLeft} day${info.daysLeft === 1 ? "" : "s"} left`;
    }
  }

  // ---------- bottom nav ----------
  let proBuilt = false;
  function bindNav() {
    document.querySelectorAll("[data-nav]").forEach(b => {
      if (b._navBound) return;
      b._navBound = true;
      b.addEventListener("click", () => {
        const t = b.dataset.nav;
        document.querySelectorAll(".nav-btn").forEach(x => x.classList.toggle("sel", x.dataset.nav === t));
        if (t === "home") { show("screen-home"); refreshHome(); }
        else if (t === "studio") { openStudio(); }
        else if (t === "gallery") { show("screen-gallery"); renderGallery(); }
        else if (t === "pro") { refreshPayState(); show("screen-pro"); }
      });
    });
    document.querySelectorAll(".pro-badge").forEach(b =>
      b.addEventListener("click", () => { refreshPayState(); show("screen-pro"); }));
  }

  return { init, show, toast, refreshHome, syncStickerToolbar, openStudio, loadSample, refreshLocks };
})();
