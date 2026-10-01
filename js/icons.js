/* Mochi — hand-drawn SVG icon set (no emoji anywhere). 24x24, stroke style. */
MOCHI.icons = (() => {
  const wrap = (inner) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  return {
    camera: wrap(`<path d="M4 8h3l2-2.5h6L17 8h3a1.5 1.5 0 0 1 1.5 1.5V18a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 18V9.5A1.5 1.5 0 0 1 4 8z"/><circle cx="12" cy="13.5" r="3.4"/>`),
    image: wrap(`<rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><circle cx="9" cy="10" r="1.8"/><path d="M4.5 17.5l4.5-4.5 3 3 3.5-3.5 4 4"/>`),
    wand: wrap(`<path d="M6 21L21 6l-3-3L3 18l3 3z"/><path d="M14 5l1.2-2.4L17.6 3.8l-1.2 2.4L14 5zM20 11l.9-1.8 1.8.9-1.8.9L20 11zM11 4l.7-1.4L13.1 3.3l-.7 1.4L11 4z"/>`),
    smile: wrap(`<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14.5c1 1.2 2.2 1.8 3.5 1.8s2.5-.6 3.5-1.8"/><circle cx="9" cy="9.8" r=".4" fill="currentColor"/><circle cx="15" cy="9.8" r=".4" fill="currentColor"/>`),
    frame: wrap(`<rect x="4" y="4" width="16" height="16" rx="4"/><rect x="8.5" y="8.5" width="7" height="7" rx="2"/>`),
    text: wrap(`<path d="M5 6.5h14"/><path d="M12 6.5V19"/><path d="M9.5 19h5"/>`),
    download: wrap(`<path d="M12 4v11"/><path d="M7.5 11.5L12 16l4.5-4.5"/><path d="M4.5 19.5h15"/>`),
    share: wrap(`<circle cx="7" cy="12" r="2.6"/><circle cx="16.5" cy="6" r="2.6"/><circle cx="16.5" cy="18" r="2.6"/><path d="M9.4 10.8l4.8-3.6M9.4 13.2l4.8 3.6"/>`),
    back: wrap(`<path d="M14.5 5.5L8 12l6.5 6.5"/>`),
    plus: wrap(`<path d="M12 5v14M5 12h14"/>`),
    trash: wrap(`<path d="M4.5 6.5h15"/><path d="M9.5 6.5V4.8A.8.8 0 0 1 10.3 4h3.4a.8.8 0 0 1 .8.8v1.7"/><path d="M6.5 6.5l1 13a1 1 0 0 0 1 .9h7a1 1 0 0 0 1-.9l1-13"/>`),
    close: wrap(`<path d="M6 6l12 12M18 6L6 18"/>`),
    check: wrap(`<path d="M4.5 12.5l5 5 10-11"/>`),
    crown: wrap(`<path d="M4 17.5h16"/><path d="M4.5 17.5L3 8l5.5 3.5L12 5l3.5 6.5L21 8l-1.5 9.5"/>`),
    lock: wrap(`<rect x="5.5" y="10.5" width="13" height="9" rx="2.5"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>`),
    chevron: wrap(`<path d="M9.5 5.5L16 12l-6.5 6.5"/>`),
    heart: wrap(`<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>`),
    shuffle: wrap(`<path d="M3.5 7h4l10 10h3"/><path d="M17.5 17l3 3 3-3"/><path d="M3.5 17h4l2.5-2.5"/><path d="M13.5 9.5L17.5 7h3"/><path d="M17.5 4l3 3-3 3"/>`),
    flip: wrap(`<path d="M12 3.5v17"/><path d="M8 7L4.5 12 8 17V7z"/><path d="M16 7l3.5 5L16 17V7z"/>`),
    layers: wrap(`<path d="M12 3.5l9 4.5-9 4.5-9-4.5 9-4.5z"/><path d="M4.5 12.5L12 16.2l7.5-3.7"/><path d="M4.5 16.5L12 20.2l7.5-3.7"/>`),
    sparkle: wrap(`<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9L12 3z"/><path d="M18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"/>`),
    minus: wrap(`<path d="M5 12h14"/>`),
    rotate: wrap(`<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 3.5V8h-4.5"/>`),
    gallery: wrap(`<rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2"/><rect x="13" y="3.5" width="7.5" height="7.5" rx="2"/><rect x="3.5" y="13" width="7.5" height="7.5" rx="2"/><rect x="13" y="13" width="7.5" height="7.5" rx="2"/>`),
  };
})();
