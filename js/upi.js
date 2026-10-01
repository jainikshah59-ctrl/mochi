/* Mochi — UPI payment rail (deep link + local QR + UTR entry) + Pro subscription state.
   Static frontend: cannot verify with the bank and cannot do real recurring
   billing. Plans are fixed-term (no auto-renewal); expiry is enforced
   on-device. UTR entry only checks format — activation happens on this device. */
(function () {
  const cfg = () => MOCHI.config;
  const LS_SUB = "mochi_pro_sub";   // JSON: {plan, at, exp}
  const LS_LEGACY = "mochi_pro";    // old one-time flag -> grandfathered as lifetime

  function isConfigured() {
    const id = (cfg().UPI_ID || "").trim();
    return id && !/REPLACE_WITH_YOUR_UPI_ID/i.test(id) && /^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(id);
  }

  function planById(id) {
    return (cfg().PLANS || []).find(p => p.id === id) || (cfg().PLANS || [])[0];
  }

  function buildIntent(plan) {
    const c = cfg();
    const p = planById(plan && plan.id);
    const txnRef = "MOCHI" + Date.now().toString(36).toUpperCase();
    const params = new URLSearchParams({
      pa: c.UPI_ID.trim(),
      pn: c.UPI_PAYEE_NAME,
      am: String(p.price),
      cu: "INR",
      tn: "Mochi Pro " + p.name,
      tr: txnRef,
    });
    return { intent: "upi://pay?" + params.toString(), txnRef, plan: p };
  }

  // local QR via vendored generator (no network)
  function renderQR(el, intent) {
    try {
      const qr = qrcode(0, "M");
      qr.addData(intent);
      qr.make();
      el.innerHTML = qr.createImgTag(5, 4);
      return true;
    } catch (e) {
      el.innerHTML = '<div class="pay-pending">QR failed to render.</div>';
      return false;
    }
  }

  function validUtr(v) {
    return /^\d{12}$/.test((v || "").trim());
  }

  function readSub() {
    try {
      const raw = localStorage.getItem(LS_SUB);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function activatePro(planId) {
    const p = planById(planId);
    const now = Date.now();
    const rec = { plan: p.id, at: now, exp: now + p.days * 864e5 };
    try { localStorage.setItem(LS_SUB, JSON.stringify(rec)); } catch (e) {}
  }

  function isLifetime() {
    try { return localStorage.getItem(LS_LEGACY) === "1" && !readSub(); } catch (e) { return false; }
  }

  function isPro() {
    if (isLifetime()) return true;
    const s = readSub();
    return !!(s && s.exp > Date.now());
  }

  function proInfo() {
    if (isLifetime()) return { active: true, lifetime: true, planName: "Forever", daysLeft: Infinity };
    const s = readSub();
    if (!s) return { active: false };
    const active = s.exp > Date.now();
    const p = planById(s.plan);
    return {
      active,
      lifetime: false,
      plan: p.id,
      planName: p.name,
      price: p.price,
      exp: s.exp,
      daysLeft: active ? Math.ceil((s.exp - Date.now()) / 864e5) : 0,
    };
  }

  MOCHI.upi = { isConfigured, buildIntent, renderQR, validUtr, activatePro, isPro, planById };
  MOCHI.pro = { isPro: isPro, activate: activatePro, info: proInfo, planById: planById };
})();
