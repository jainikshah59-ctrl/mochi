/* Mochi — kawaii SVG sticker library. viewBox 0 0 100 100, no emoji. */
MOCHI.stickers = (() => {
  const O = "#5d4457"; // outline
  const S = (inner) =>
    `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g stroke="${O}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round">${inner}</g></svg>`;

  const D = {
    heart: S(`<path d="M50 84C30 70 16 55 16 40c0-10 8-18 17-18 7 0 12 3.5 17 9 5-5.5 10-9 17-9 9 0 17 8 17 18 0 15-14 30-34 44z" fill="#ff8fb3"/><circle cx="36" cy="36" r="5" fill="#fff" stroke="none" opacity=".7"/>`),
    bow: S(`<path d="M50 50L20 32c-6-4-13 1-11 8l9 18z" fill="#ff9ec7"/><path d="M50 50l30-18c6-4 13 1 11 8l-9 18z" fill="#ff9ec7"/><circle cx="50" cy="52" r="11" fill="#ff6fa5"/><path d="M50 62c-2 8-6 12-12 14M50 62c2 8 6 12 12 14" fill="none"/>`),
    star: S(`<path d="M50 10l8.5 24.5L84 36l-20 16.5L70.5 79 50 64l-20.5 15L36 52.5 16 36l25.5-1.5z" fill="#ffd66e"/>`),
    sparkle: S(`<path d="M50 8c2.5 24 10 31.5 34 34-24 2.5-31.5 10-34 34-2.5-24-10-31.5-34-34 24-2.5 31.5-10 34-34z" fill="#cfe8ff"/><path d="M78 62c1.2 11 4.8 14.6 16 16-11.2 1.4-14.8 5-16 16-1.2-11-4.8-14.6-16-16 11.2-1.4 14.8-5 16-16z" fill="#fff3b0"/>`),
    flower: S(`<g fill="#ffc7dd"><ellipse cx="50" cy="28" rx="13" ry="17"/><ellipse cx="72" cy="43" rx="13" ry="17" transform="rotate(72 72 43)"/><ellipse cx="63" cy="68" rx="13" ry="17" transform="rotate(144 63 68)"/><ellipse cx="37" cy="68" rx="13" ry="17" transform="rotate(216 37 68)"/><ellipse cx="28" cy="43" rx="13" ry="17" transform="rotate(288 28 43)"/></g><circle cx="50" cy="50" r="12" fill="#ffd66e"/>`),
    cloud: S(`<path d="M28 72c-9 0-15-6-15-14 0-7 5-12.5 12-13.8C27.5 34 36 27 46 27c8.5 0 15.5 5 18.5 12 2-.7 4-1 6.5-1 8 0 14 6 14 13.5 0 7-5.5 12.5-13 12.5H28z" fill="#ffffff"/>`),
    rainbow: S(`<g fill="none" stroke-width="9"><path d="M14 74a36 36 0 0 1 72 0" stroke="#ff8fb3"/><path d="M24 74a26 26 0 0 1 52 0" stroke="#ffd66e"/><path d="M34 74a16 16 0 0 1 32 0" stroke="#9adcff"/></g><circle cx="14" cy="76" r="9" fill="#fff"/><circle cx="86" cy="76" r="9" fill="#fff"/>`),
    butterfly: S(`<g fill="#c3b2ff"><ellipse cx="32" cy="42" rx="17" ry="23" transform="rotate(-25 32 42)"/><ellipse cx="68" cy="42" rx="17" ry="23" transform="rotate(25 68 42)"/></g><ellipse cx="50" cy="52" rx="7" ry="20" fill="#8f7bff"/><circle cx="50" cy="28" r="6" fill="#8f7bff"/><path d="M46 24c-3-6-8-8-12-9M54 24c3-6 8-8 12-9" fill="none"/>`),
    moon: S(`<path d="M64 10a38 38 0 1 0 0 80 30 30 0 1 1 0-80z" fill="#ffe9a8"/><circle cx="70" cy="30" r="4" fill="${O}" stroke="none"/><circle cx="76" cy="52" r="3" fill="${O}" stroke="none"/>`),
    sun: S(`<circle cx="50" cy="50" r="20" fill="#ffd66e"/><g stroke-width="6"><path d="M50 14v-6M50 92v-6M14 50h-6M92 50h-6M25 25l-5-5M80 80l-5-5M75 25l5-5M20 80l5-5"/></g><circle cx="43" cy="47" r="2.6" fill="${O}" stroke="none"/><circle cx="57" cy="47" r="2.6" fill="${O}" stroke="none"/><path d="M43 56c4 4 10 4 14 0" fill="none"/>`),
    strawberry: S(`<path d="M50 88C36 74 26 60 26 46c0-8 6-12 12-10 4 1.4 8 1.4 12 0 4 1.4 8 1.4 12 0 6-2 12 2 12 10 0 14-10 28-24 42z" fill="#ff6f91"/><path d="M38 30c8-6 22-6 30 0-4 8-10 10-15 8-5 2-11 0-15-8z" fill="#7ed491"/><path d="M50 26v-8" fill="none"/><g fill="#fff" stroke="none"><ellipse cx="42" cy="55" rx="2.4" ry="3.4"/><ellipse cx="58" cy="55" rx="2.4" ry="3.4"/><ellipse cx="50" cy="68" rx="2.4" ry="3.4"/></g>`),
    cherry: S(`<path d="M50 22C48 36 40 44 34 58M50 22c4 12 14 18 24 24" fill="none"/><circle cx="32" cy="70" r="15" fill="#ff6f91"/><circle cx="66" cy="66" r="15" fill="#e14d78"/><path d="M44 22c6-5 16-6 24-2" fill="none"/><path d="M62 16c8-3 14 1 16 6-5 3-12 2-16-6z" fill="#7ed491"/>`),
    // ---- Sweet pack (pro)
    donut: S(`<circle cx="50" cy="52" r="32" fill="#ffb3d1"/><circle cx="50" cy="52" r="32" fill="none"/><path d="M50 22c8-3 20-2 27 5 5 8 3 16-3 20 4 8 0 18-8 22-9 3-19 1-24-6-9 1-18-4-19-13-1-10 6-17 13-18 2-6 7-9 14-10z" fill="#ff8fb3" stroke="none"/><circle cx="50" cy="52" r="12" fill="#fff"/><g stroke-width="3.5"><path d="M35 40l6 3M60 34l5 4M68 55l6 2M45 68l6-2M30 55l5-3" stroke="#fff"/><path d="M55 44l5 3M38 62l4 4" stroke="#7ed491"/><path d="M62 66l4-3" stroke="#9adcff"/></g>`),
    icecream: S(`<path d="M32 52l18 34 18-34z" fill="#f2b880"/><path d="M38 60l5 3M48 66l5 3M44 54l6 3" stroke-width="3" stroke="#d99a5b"/><circle cx="50" cy="36" r="20" fill="#ffc7dd"/><circle cx="50" cy="22" r="6" fill="#e14d78"/><path d="M50 16v-6" fill="none"/>`),
    boba: S(`<path d="M34 34h32l-5 48a6 6 0 0 1-6 5H45a6 6 0 0 1-6-5z" fill="#ffe3ef"/><path d="M34 48h32l-2.5 20h-27z" fill="#f7a8c4" stroke="none"/><g fill="${O}" stroke="none"><circle cx="42" cy="72" r="4.5"/><circle cx="52" cy="76" r="4.5"/><circle cx="60" cy="70" r="4.5"/><circle cx="48" cy="64" r="4.5"/></g><path d="M30 34h40" stroke-width="7"/><path d="M62 26L70 8" fill="none" stroke-width="7"/>`),
    cake: S(`<path d="M20 70l52-24v24z" fill="#ffd6e8"/><path d="M20 70l52-24" fill="none"/><path d="M72 46v24" fill="none"/><path d="M28 62l36-17" stroke-width="3.5" stroke="#ff8fb3"/><circle cx="66" cy="38" r="7" fill="#e14d78"/><path d="M66 31c0-4 3-6 6-7" fill="none"/>`),
    candy: S(`<path d="M28 50L12 38v24zM72 50l16-12v24z" fill="#9adcff"/><ellipse cx="50" cy="50" rx="22" ry="17" fill="#ff8fb3"/><path d="M38 42c6-6 18-6 24 0M36 56c8 5 20 5 28 0" fill="none" stroke="#fff" stroke-width="3.5"/>`),
    lollipop: S(`<path d="M50 52v36" fill="none" stroke-width="7"/><circle cx="50" cy="34" r="22" fill="#c3b2ff"/><path d="M50 34c8 0 12 4 12 9 0 6-6 9-12 7-5-2-6-7-3-10" fill="none" stroke="#fff" stroke-width="4"/><circle cx="50" cy="34" r="22" fill="none"/>`),
    cookie: S(`<circle cx="50" cy="50" r="30" fill="#e8b06e"/><g fill="${O}" stroke="none"><circle cx="40" cy="42" r="4"/><circle cx="58" cy="38" r="4"/><circle cx="62" cy="58" r="4"/><circle cx="44" cy="62" r="4"/><circle cx="52" cy="50" r="4"/></g>`),
    pudding: S(`<path d="M30 52h40l4 22a8 8 0 0 1-8 8H34a8 8 0 0 1-8-8z" fill="#ffe9a8"/><path d="M30 52c0-8 8-12 20-12s20 4 20 12" fill="#f2b880"/><ellipse cx="50" cy="44" rx="9" ry="5" fill="#e14d78"/><path d="M50 40v-8" fill="none"/>`),
    // ---- Dreamy pack (pro)
    catface: S(`<path d="M28 44L22 20l20 12zM72 44l6-24-20 12z" fill="#ffc7dd"/><circle cx="50" cy="56" r="28" fill="#fff"/><path d="M28 44L22 20l20 12zM72 44l6-24-20 12z" fill="none"/><g fill="${O}" stroke="none"><circle cx="40" cy="54" r="3.4"/><circle cx="60" cy="54" r="3.4"/></g><path d="M46 62h8l-4 5z" fill="#ff8fb3"/><path d="M50 67v4M50 71c-3 3-7 3-10 1M50 71c3 3 7 3 10 1" fill="none" stroke-width="3.5"/><g stroke-width="3"><path d="M28 58l-9-2M29 65l-8 3M72 58l9-2M71 65l8 3"/></g>`),
    bunnyface: S(`<ellipse cx="36" cy="22" rx="10" ry="20" fill="#fff"/><ellipse cx="64" cy="22" rx="10" ry="20" fill="#fff"/><ellipse cx="36" cy="24" rx="4.5" ry="12" fill="#ffc7dd" stroke="none"/><ellipse cx="64" cy="24" rx="4.5" ry="12" fill="#ffc7dd" stroke="none"/><circle cx="50" cy="62" r="24" fill="#fff"/><g fill="${O}" stroke="none"><circle cx="42" cy="60" r="3.2"/><circle cx="58" cy="60" r="3.2"/></g><path d="M46 68h8l-4 5z" fill="#ff8fb3"/><path d="M50 73v3M50 76c-3 3-6 2-9 0M50 76c3 3 6 2 9 0" fill="none" stroke-width="3.5"/>`),
    paw: S(`<ellipse cx="50" cy="64" rx="20" ry="16" fill="#ffc7dd"/><g fill="#ffc7dd"><ellipse cx="30" cy="44" rx="9" ry="11"/><ellipse cx="50" cy="36" rx="9" ry="11"/><ellipse cx="70" cy="44" rx="9" ry="11"/></g>`),
    mushroom: S(`<path d="M22 50c0-16 12-28 28-28s28 12 28 28z" fill="#ff8fb3"/><path d="M42 50l-3 24a7 7 0 0 0 7 8h8a7 7 0 0 0 7-8l-3-24z" fill="#fff"/><g fill="#fff" stroke="none"><circle cx="38" cy="38" r="5"/><circle cx="56" cy="32" r="6"/><circle cx="66" cy="44" r="4"/></g>`),
    balloon: S(`<ellipse cx="50" cy="36" rx="24" ry="28" fill="#ff9ec7"/><path d="M50 64l-4 8h8z" fill="#ff9ec7"/><path d="M50 72c-6 10 6 12 0 22" fill="none"/><circle cx="40" cy="28" r="6" fill="#fff" stroke="none" opacity=".65"/>`),
    crown: S(`<path d="M18 70l-4-34 18 12 10-22 8 20 6-12 12-8 14 10-4 34z" fill="#ffd66e"/><circle cx="50" cy="56" r="4" fill="#ff6f91" stroke="none"/><circle cx="34" cy="58" r="3" fill="#9adcff" stroke="none"/><circle cx="66" cy="58" r="3" fill="#9adcff" stroke="none"/>`),
    wand: S(`<path d="M30 70L66 34" fill="none" stroke-width="8"/><path d="M66 14c1.5 12 6 16.5 18 18-12 1.5-16.5 6-18 18-1.5-12-6-16.5-18-18 12-1.5 16.5-6 18-18z" fill="#ffd66e"/><path d="M84 44c1 8 4 11 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-1 11-4 12-12z" fill="#cfe8ff"/>`),
    shootingstar: S(`<path d="M62 18l4.5 12 12.5 1-9.5 8.5 3 12.5-10.5-6.5-10.5 6.5 3-12.5-9.5-8.5 12.5-1z" fill="#ffd66e"/><g fill="none" stroke-width="5"><path d="M40 62L18 78M48 68l-14 20M58 70l-6 18"/></g>`),
  };

  const PACKS = [
    { id: "bloomy", name: "Bloomy", pro: false,
      ids: ["heart","bow","star","sparkle","flower","cloud","rainbow","butterfly","moon","sun","strawberry","cherry"] },
    { id: "sweet", name: "Sweet", pro: true,
      ids: ["donut","icecream","boba","cake","candy","lollipop","cookie","pudding"] },
    { id: "dreamy", name: "Dreamy", pro: true,
      ids: ["catface","bunnyface","paw","mushroom","balloon","crown","wand","shootingstar"] },
  ];

  return { SVG: D, PACKS };
})();
