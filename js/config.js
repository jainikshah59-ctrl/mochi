/* Mochi — Cute Photo Studio. Global config. */
window.MOCHI = window.MOCHI || {};
MOCHI.config = {
  APP_NAME: "Mochi",
  TAGLINE: "Cute Photo Studio",
  UPI_ID: "REPLACE_WITH_YOUR_UPI_ID",
  UPI_PAYEE_NAME: "Mochi Studio",
  PRO_LABEL: "Mochi Pro",
  // subscription plans: fixed-term, no auto-renewal (static site can't do
  // recurring billing). Expiry is enforced on-device; renewals are manual.
  PLANS: [
    { id: "monthly", name: "Monthly", price: 49, days: 30, per: "month", blurb: "A little treat every month" },
    { id: "yearly", name: "Yearly", price: 399, days: 365, per: "year", blurb: "Best value — 4 months free", best: true },
  ],
  EXPORT_W: 1080,
  EXPORT_H: 1350,

  // canvas filter recipes: css filter for photo + overlay tint
  FILTERS: [
    { id: "none",   name: "Original", pro: false, css: "none",                                   tint: null },
    { id: "milk",   name: "Milk",     pro: false, css: "brightness(1.12) saturate(1.05)",        tint: "rgba(255,220,235,0.18)" },
    { id: "peach",  name: "Peach",    pro: false, css: "brightness(1.06) saturate(1.25) hue-rotate(-8deg)", tint: "rgba(255,190,150,0.14)" },
    { id: "boba",   name: "Boba",     pro: false, css: "contrast(1.08) saturate(1.1)",            tint: "rgba(200,190,255,0.12)" },
    { id: "sakura", name: "Sakura",   pro: true,  css: "brightness(1.1) saturate(1.35) hue-rotate(-18deg)", tint: "rgba(255,170,200,0.22)" },
    { id: "matcha", name: "Matcha",   pro: true,  css: "brightness(1.05) saturate(1.2) hue-rotate(25deg)",  tint: "rgba(190,235,180,0.16)" },
  ],

  FRAMES: [
    { id: "none",    name: "No frame", pro: false },
    { id: "puff",    name: "Puff",     pro: false, desc: "Chunky clay border" },
    { id: "pola",    name: "Polaroid", pro: false, desc: "Cute polaroid + caption" },
    { id: "scallop", name: "Scallop",  pro: true,  desc: "Wavy candy edge" },
    { id: "candy",   name: "Candy",    pro: true,  desc: "Double candy stripe" },
  ],

  CHALLENGES: [
    { tag: "Morning cutie", prompt: "Snap your breakfast and make it adorable" },
    { tag: "Pet day", prompt: "Your pet deserves a sticker crown today" },
    { tag: "Pink hour", prompt: "Everything pink. No exceptions." },
    { tag: "Moodboard", prompt: "Build a 4:5 moodboard of your week" },
    { tag: "Selfie Sunday", prompt: "One selfie, five stickers minimum" },
  ],

  TEMPLATES: [
    { id: "bday",   name: "Birthday Cutie", filter: "sakura", frame: "pola",
      caption: "make a wish", stickers: ["cake", "balloon", "sparkle", "heart", "crown"] },
    { id: "pet",    name: "Pet Love", filter: "milk", frame: "puff",
      caption: "cutie patrol", stickers: ["star", "heart", "bow", "sparkle"] },
    { id: "mood",   name: "Moodboard", filter: "peach", frame: "none",
      caption: "soft days", stickers: ["cloud", "rainbow", "flower", "sun"] },
    { id: "sweet",  name: "Sweet Day", filter: "boba", frame: "scallop",
      caption: "sugar rush", stickers: ["donut", "boba", "candy", "icecream", "strawberry"] },
  ],
};
