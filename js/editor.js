/* Mochi — canvas editor engine. 1080x1350 working space. */
MOCHI.editor = (() => {
  const W = 1080, H = 1350;
  const cv = () => document.getElementById("studio-canvas");
  const svgCache = {};

  const E = {
    photo: null,          // {img, scale, ox, oy}
    filter: "milk",
    frame: "puff",
    stickers: [],         // {key, x, y, s, r, flip}
    caption: { text: "", color: "#e14d78", size: 64 },
    selected: -1,
    ready: false,
  };

  function svgImg(key) {
    if (svgCache[key]) return svgCache[key];
    const img = new Image();
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(MOCHI.stickers.SVG[key]);
    svgCache[key] = img;
    return img;
  }

  function setPhoto(img) {
    E.photo = { img, scale: 1, ox: 0, oy: 0 };
    fitPhoto();
    E.ready = true;
    render();
  }

  function fitPhoto() {
    if (!E.photo) return;
    const { img } = E.photo;
    E.photo.base = Math.max(W / img.width, H / img.height);
    E.photo.scale = E.photo.base;
    E.photo.ox = 0; E.photo.oy = 0;
  }

  function filterDef() {
    return MOCHI.config.FILTERS.find(f => f.id === E.filter) || MOCHI.config.FILTERS[0];
  }

  // ---- main render ----
  function render(scale = 1) {
    const c = cv(); if (!c) return;
    const ctx = c.getContext("2d");
    const w = W * scale, h = H * scale;
    if (c.width !== w) { c.width = w; c.height = h; }
    ctx.save();
    ctx.scale(scale, scale);

    // backdrop
    ctx.fillStyle = "#ffeef4";
    ctx.fillRect(0, 0, W, H);

    // photo (cover + pan/zoom) with filter
    if (E.photo) {
      const { img, ox, oy } = E.photo;
      const s = E.photo.scale;
      const dw = img.width * s, dh = img.height * s;
      const dx = (W - dw) / 2 + ox, dy = (H - dh) / 2 + oy;
      ctx.save();
      const f = filterDef();
      ctx.filter = f.css === "none" ? "none" : f.css;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.filter = "none";
      if (f.tint) {
        ctx.globalCompositeOperation = "overlay";
        ctx.fillStyle = f.tint;
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "source-over";
      }
      // soft vignette
      const vg = ctx.createRadialGradient(W/2, H/2, H*0.35, W/2, H/2, H*0.75);
      vg.addColorStop(0, "rgba(120,60,90,0)");
      vg.addColorStop(1, "rgba(120,60,90,0.14)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    } else {
      // empty state pattern
      ctx.fillStyle = "#f7dce8";
      for (let y = 0; y < H; y += 120) for (let x = 0; x < W; x += 120)
        if (((x + y) / 120) % 2 === 0) { ctx.fillRect(x, y, 120, 120); }
    }

    // stickers
    E.stickers.forEach((st, i) => {
      const img = svgImg(st.key);
      if (!img.complete || !img.naturalWidth) return;
      const size = 190 * st.s;
      ctx.save();
      ctx.translate(st.x, st.y);
      ctx.rotate(st.r * Math.PI / 180);
      ctx.scale(st.flip ? -1 : 1, 1);
      ctx.shadowColor = "rgba(120,60,90,0.25)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 8;
      ctx.drawImage(img, -size/2, -size/2, size, size);
      ctx.restore();
      if (i === E.selected && scale === 1) {
        ctx.save();
        ctx.strokeStyle = "#ff6fa5";
        ctx.lineWidth = 5;
        ctx.setLineDash([18, 12]);
        ctx.translate(st.x, st.y);
        ctx.rotate(st.r * Math.PI / 180);
        ctx.strokeRect(-size/2 - 12, -size/2 - 12, size + 24, size + 24);
        ctx.restore();
      }
    });

    drawFrame(ctx);
    drawCaption(ctx);

    // watermark for free users
    if (!MOCHI.pro.isPro() && scale === 1) {
      ctx.save();
      ctx.font = "600 30px Inter, sans-serif";
      const label = "Made with Mochi";
      const tw = ctx.measureText(label).width;
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      roundRect(ctx, W - tw - 56, H - 76, tw + 36, 52, 26);
      ctx.fill();
      ctx.fillStyle = "#c08497";
      ctx.fillText(label, W - tw - 38, H - 40);
      ctx.restore();
    }
    ctx.restore();
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawFrame(ctx) {
    const id = E.frame;
    if (id === "puff") {
      ctx.save();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 96;
      ctx.shadowColor = "rgba(190,110,150,0.45)";
      ctx.shadowBlur = 30;
      roundRect(ctx, 48, 48, W - 96, H - 96, 64);
      ctx.stroke();
      ctx.restore();
    } else if (id === "pola") {
      // white polaroid mat
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.shadowColor = "rgba(190,110,150,0.4)";
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 12;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      if (E.photo) {
        const mx = 56, my = 56, mw = W - 112, mh = H - 360;
        const { img, ox, oy, base } = E.photo;
        const zoom = E.photo.scale / base;
        const s2 = Math.max(mw / img.width, mh / img.height) * zoom;
        const dw = img.width * s2, dh = img.height * s2;
        const dx = mx + (mw - dw) / 2 + ox * (mw / W);
        const dy = my + (mh - dh) / 2 + oy * (mh / H);
        ctx.save();
        ctx.beginPath();
        ctx.rect(mx, my, mw, mh);
        ctx.clip();
        const f = filterDef();
        ctx.filter = f.css === "none" ? "none" : f.css;
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.filter = "none";
        if (f.tint) {
          ctx.globalCompositeOperation = "overlay";
          ctx.fillStyle = f.tint;
          ctx.fillRect(mx, my, mw, mh);
          ctx.globalCompositeOperation = "source-over";
        }
        ctx.restore();
      }
    } else if (id === "scallop") {
      ctx.save();
      ctx.fillStyle = "#ffb3d1";
      const r = 46, step = 92;
      for (let x = step/2; x < W; x += step) {
        ctx.beginPath(); ctx.arc(x, 40, r, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(x, H - 40, r, 0, 7); ctx.fill();
      }
      for (let y = step/2; y < H; y += step) {
        ctx.beginPath(); ctx.arc(40, y, r, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(W - 40, y, r, 0, 7); ctx.fill();
      }
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 30;
      roundRect(ctx, 78, 78, W - 156, H - 156, 48);
      ctx.stroke();
      ctx.restore();
    } else if (id === "candy") {
      ctx.save();
      ctx.strokeStyle = "#ff8fb3";
      ctx.lineWidth = 84;
      roundRect(ctx, 42, 42, W - 84, H - 84, 56);
      ctx.stroke();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 26;
      roundRect(ctx, 96, 96, W - 192, H - 192, 40);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      for (let x = 130; x < W - 100; x += 120) {
        ctx.beginPath(); ctx.arc(x, 42, 12, 0, 7); ctx.fill();
        ctx.beginPath(); ctx.arc(x, H - 42, 12, 0, 7); ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawCaption(ctx) {
    const cap = E.caption;
    if (!cap.text.trim()) return;
    ctx.save();
    const inPola = E.frame === "pola";
    const y = inPola ? H - 170 : H - 150;
    ctx.font = `700 ${cap.size}px Unbounded, sans-serif`;
    ctx.textAlign = "center";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = cap.size * 0.22;
    ctx.strokeText(cap.text, W / 2, y);
    ctx.fillStyle = cap.color;
    ctx.fillText(cap.text, W / 2, y);
    ctx.restore();
  }

  // ---- sticker ops ----
  function addSticker(key) {
    E.stickers.push({
      key,
      x: W / 2 + (Math.random() * 120 - 60),
      y: H / 2 + (Math.random() * 120 - 60),
      s: 1, r: Math.random() * 24 - 12, flip: false,
    });
    E.selected = E.stickers.length - 1;
    render();
  }
  function selectedSticker() { return E.stickers[E.selected] || null; }
  function deleteSelected() {
    if (E.selected >= 0) { E.stickers.splice(E.selected, 1); E.selected = -1; render(); }
  }
  function bringForward() {
    if (E.selected >= 0) {
      const [st] = E.stickers.splice(E.selected, 1);
      E.stickers.push(st);
      E.selected = E.stickers.length - 1;
      render();
    }
  }

  function hitSticker(px, py) {
    for (let i = E.stickers.length - 1; i >= 0; i--) {
      const st = E.stickers[i];
      const size = 190 * st.s;
      const dx = px - st.x, dy = py - st.y;
      const rad = st.r * Math.PI / 180;
      const lx = dx * Math.cos(-rad) - dy * Math.sin(-rad);
      const ly = dx * Math.sin(-rad) + dy * Math.cos(-rad);
      if (Math.abs(lx) < size/2 + 14 && Math.abs(ly) < size/2 + 14) return i;
    }
    return -1;
  }

  function toCanvas(e) {
    const c = cv();
    const r = c.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) / r.width * W,
      y: (e.clientY - r.top) / r.height * H,
    };
  }

  function bindPointer() {
    const c = cv();
    const pts = new Map();
    let dragSt = -1, lastPinch = 0;

    c.addEventListener("pointerdown", (e) => {
      c.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, toCanvas(e));
      if (pts.size === 1) {
        const p = toCanvas(e);
        dragSt = hitSticker(p.x, p.y);
        E.selected = dragSt;
        MOCHI.ui.syncStickerToolbar();
        render();
      } else if (pts.size === 2) {
        const [a, b] = [...pts.values()];
        lastPinch = Math.hypot(a.x - b.x, a.y - b.y);
        dragSt = -2; // pinch mode
      }
    });

    c.addEventListener("pointermove", (e) => {
      if (!pts.has(e.pointerId)) return;
      const prev = pts.get(e.pointerId);
      const p = toCanvas(e);
      pts.set(e.pointerId, p);
      const dx = p.x - prev.x, dy = p.y - prev.y;
      if (dragSt >= 0) {
        const st = E.stickers[dragSt];
        st.x = Math.max(0, Math.min(W, st.x + dx));
        st.y = Math.max(0, Math.min(H, st.y + dy));
        render();
      } else if (dragSt === -2 && pts.size === 2 && E.photo) {
        const [a, b] = [...pts.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (lastPinch > 0) {
          E.photo.scale = Math.max(0.5, Math.min(4, E.photo.scale * (d / lastPinch)));
        }
        lastPinch = d;
        render();
      } else if (dragSt === -1 && E.photo) {
        E.photo.ox += dx; E.photo.oy += dy;
        render();
      }
    });

    const up = (e) => { pts.delete(e.pointerId); if (pts.size < 2) dragSt = -1; };
    c.addEventListener("pointerup", up);
    c.addEventListener("pointercancel", up);
  }

  // ---- export ----
  function exportPNG() {
    const pro = MOCHI.pro.isPro();
    const scale = pro ? 1.5 : 1;
    render(scale);
    const c = cv();
    return new Promise((res) => c.toBlob(res, "image/png"));
  }

  function reset() {
    E.photo = null; E.stickers = []; E.selected = -1;
    E.filter = "milk"; E.frame = "puff";
    E.caption = { text: "", color: "#e14d78", size: 64 };
    E.ready = false;
    render();
  }

  return {
    E, W, H, setPhoto, fitPhoto, render, addSticker, selectedSticker,
    deleteSelected, bringForward, bindPointer, exportPNG, reset, svgImg,
  };
})();
