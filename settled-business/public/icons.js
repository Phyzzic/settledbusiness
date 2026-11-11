// Settled icons. Drawn for this app, not from an icon pack.
//
// Room icons are floor-plan symbols, the way an architect draws furniture
// from above: a hob, a bath, a sofa, a bed. They match the house plan.
// Anything with class "a" is filled in the logo's clay orange.
//
// Usage: icon("bath", 24) returns an <svg> string.

const ICON_PATHS = {
  /* ---- Rooms (plan symbols) ---- */
  // Hob: four rings, the front-left one is on.
  hob: '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><circle class="a" cx="8.5" cy="15.5" r="2.6"/><circle cx="15.5" cy="15.5" r="2.6"/><circle cx="8.5" cy="8.5" r="2.1"/><circle cx="15.5" cy="8.5" r="2.1"/>',
  // Bath from above, plug at the tap end.
  bath: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><rect x="7.5" y="5" width="9" height="14" rx="4.5"/><circle class="a" cx="12" cy="7.6" r="1.2"/>',
  // Sofa from above: back, arms, two seat cushions.
  sofa: '<path class="a" d="M7 9.5h5v9.5H7z"/><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 19V9.5h10V19M12 9.5V19"/>',
  // Double bed: pillows at the top, duvet folded back.
  bed: '<rect x="4" y="2.5" width="16" height="19" rx="2"/><rect x="6" y="4.5" width="5" height="3.5" rx="1.2"/><rect x="13" y="4.5" width="5" height="3.5" rx="1.2"/><path d="M4 10.5h16"/><path class="a" d="M4 10.5h16v2.5H4z"/>',
  // Washing machine: drum with water in it.
  washer: '<rect x="4" y="2.5" width="16" height="19" rx="2.5"/><path d="M4 7h16"/><circle cx="7.3" cy="4.8" r=".6"/><circle cx="9.6" cy="4.8" r=".6"/><circle cx="12" cy="14.2" r="4.8"/><path class="a" d="M7.6 15.3c1.4.9 2.9.9 4.4 0s3-.9 4.4 0a4.8 4.8 0 0 1-8.8 0z"/>',
  // Front door swing, with the fuse box on the wall.
  door: '<path d="M2.5 20.5H7M17 20.5h4.5"/><path d="M7 20.5V10.5"/><path d="M7 10.5a10 10 0 0 1 10 10"/><rect x="13" y="3" width="8" height="5.5" rx="1"/><path d="M15 5.7v.6M17 5.7v.6"/><path class="a" d="M18.5 4.6h1v2.2h-1z"/>',
  // Tree from above, with the trunk showing through.
  tree: '<path d="M12 3.2a3.6 3.6 0 0 1 3.4 2.4 3.6 3.6 0 0 1 4.3 4.3 3.6 3.6 0 0 1 0 5.2 3.6 3.6 0 0 1-4.3 4.3 3.6 3.6 0 0 1-6.8 0 3.6 3.6 0 0 1-4.3-4.3 3.6 3.6 0 0 1 0-5.2 3.6 3.6 0 0 1 4.3-4.3A3.6 3.6 0 0 1 12 3.2z"/><circle class="a" cx="12" cy="12.5" r="1.9"/>',

  /* ---- App ---- */
  // Home: the house from the logo, with its four-pane window.
  home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/><path class="a" d="M10.2 12.2h1.5v1.5h-1.5zM12.3 12.2h1.5v1.5h-1.5zM10.2 14.3h1.5v1.5h-1.5zM12.3 14.3h1.5v1.5h-1.5z"/>',
  // Guides: an open notebook.
  guides: '<path d="M3 5.5c3.2-1.2 6.2-.9 9 1.1 2.8-2 5.8-2.3 9-1.1v13c-3.2-1.2-6.2-.9-9 1.1-2.8-2-5.8-2.3-9-1.1z"/><path d="M12 6.6v12.9"/>',
  // Help: a toolbox with an orange catch.
  help: '<rect x="3" y="8" width="18" height="12" rx="2"/><path d="M8.5 8V5.8a1.3 1.3 0 0 1 1.3-1.3h4.4a1.3 1.3 0 0 1 1.3 1.3V8"/><path d="M3 13h7.5M13.5 13H21"/><path class="a" d="M10.5 11.5h3v3h-3z"/>',
  // Saved: a heart (filled orange once a tip is saved).
  heart: '<path class="h" d="M12 19.6s-7.6-4.5-7.6-10a4.2 4.2 0 0 1 7.6-2.5 4.2 4.2 0 0 1 7.6 2.5c0 5.5-7.6 10-7.6 10z"/>',
  phone: '<path d="M6.8 3.5h2.5l1.4 4-2 1.3a10.6 10.6 0 0 0 6.5 6.5l1.3-2 4 1.4v2.5a2 2 0 0 1-2.2 2A16.4 16.4 0 0 1 4.8 5.7a2 2 0 0 1 2-2.2z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1.2 1.2"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.2-1.2"/>',
  user: '<circle cx="12" cy="8.2" r="3.9"/><path d="M4.8 20.2c1.3-3.5 4-5.3 7.2-5.3s5.9 1.8 7.2 5.3"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.3"/><path d="m15.5 15.5 5 5"/>',
  back: '<path d="M19 12H5.5"/><path d="M11 6l-6 6 6 6"/>',
  chevronRight: '<path d="m9.5 6 6 6-6 6"/>',
  chevronDown: '<path d="m6 9.5 6 6 6-6"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.8v2.1M12 19.1v2.1M2.8 12h2.1M19.1 12h2.1M5.5 5.5 7 7M17 17l1.5 1.5M5.5 18.5 7 17M17 7l1.5-1.5"/>',
  moon: '<path d="M19.5 14.6A7.9 7.9 0 1 1 9.4 4.5a6.4 6.4 0 0 0 10.1 10.1z"/>',
  download: '<path d="M12 3.5v11"/><path d="m7 10 5 5 5-5"/><path d="M4.5 20h15"/>',
  share: '<path d="M12 3.5v11.5"/><path d="m8 7.5 4-4 4 4"/><path d="M6.5 11H6a1 1 0 0 0-1 1v7.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V12a1 1 0 0 0-1-1h-.5"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  check: '<path d="m4.5 12.5 4.8 4.8L19.5 7"/>'
};

// Which plan symbol each room uses.
const ROOM_ICONS = { kitchen: "hob", bathroom: "bath", living: "sofa", bedroom: "bed", utility: "washer", hallway: "door", garden: "tree" };

function icon(name, size) {
  size = size || 20;
  const path = ICON_PATHS[name] || ICON_PATHS.home;
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
}

function roomIcon(room, size) {
  return icon(ROOM_ICONS[room.id] || "home", size);
}
