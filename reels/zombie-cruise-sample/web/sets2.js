// ---------- sets, part 2: lower decks, steel door, galley, medical bay, the climb, the bridge, lifeboat, sunset ----------
function setSteel(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, 1);
  const back = o.back || 1250;
  wallP(ctx, back, o.w1 || '#4d6276', o.w2 || '#6f8599');
  for (let x = -2400; x < 4600; x += 330) { line(ctx, x, -900, x, back, 5, 'rgba(20,30,45,.3)'); for (let y = -860; y < back - 100; y += 110) { circle(ctx, x + 20, y, 7); ctx.fillStyle = 'rgba(20,30,45,.35)'; ctx.fill(); circle(ctx, x + 18, y - 2, 3); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fill(); } }
  // hazard band
  ctx.save(); ctx.beginPath(); ctx.rect(-2500, back - 90, 7000, 70); ctx.clip(); ctx.fillStyle = '#f2c230'; ctx.fillRect(-2500, back - 90, 7000, 70); ctx.fillStyle = '#23232b'; for (let x = -2500; x < 4600; x += 90) { path(ctx, [[x, back - 20], [x + 45, back - 20], [x + 90, back - 90], [x + 45, back - 90]]); ctx.fill(); } ctx.restore();
  ctx.lineWidth = 4; ctx.strokeStyle = INK; ctx.strokeRect(-2500, back - 90, 7000, 70);
  // pipes
  for (const [py, w, c] of [[170, 38, '#c8493c'], [236, 24, '#e8c04a'], [300, 50, '#9aa7b3']]) { box(ctx, -2500, py, 7000, w, c, 4); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(-2500, py + 5, 7000, w * .2); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.fillRect(-2500, py + w * .68, 7000, w * .28); for (let x = -2300; x < 4600; x += 440) box(ctx, x, py - 7, 26, w + 14, mix(c, '#000000', .25), 4, 4); }
  // valves + lamps
  for (let x = -1900; x < 4600; x += 880) { ctx.save(); ctx.translate(x, 325); ctx.rotate(t * .3); circle(ctx, 0, 0, 44); ctx.lineWidth = 14; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 7; ctx.strokeStyle = '#e0392f'; ctx.stroke(); for (let i = 0; i < 3; i++) { ctx.rotate(TAU / 6); line(ctx, -44, 0, 44, 0, 7, '#e0392f'); } ctx.restore(); circle(ctx, x, 325, 12); fillStroke(ctx, '#8b96a3', 4); }
  for (let x = -1500; x < 4600; x += 880) { const fl = .6 + .4 * Math.sin(t * 5 + x); glow(ctx, x, 520, 330, '255,90,60', .3 * fl); box(ctx, x - 30, 470, 60, 26, '#3b4856', 4, 5); rrect(ctx, x - 24, 496, 48, 62, 20); fillStroke(ctx, mix('#7a2a22', '#ff6a4d', fl), 4); line(ctx, x - 24, 518, x + 24, 518, 3); line(ctx, x - 24, 538, x + 24, 538, 3); line(ctx, x, 496, x, 558, 3); }
  floorP(ctx, back, '#46525f', '#2a323c', 'rgba(0,0,0,.3)', cam.x, 110, 12);
}
function stencil(ctx, str, x, y, size = 70) { ctx.save(); ctx.globalAlpha = .8; text(ctx, str, x, y, size, '#f4f1e4'); ctx.restore(); }
function wtFrame(ctx, x, y, s) { box(ctx, x - 250 * s, y - 765 * s, 500 * s, 775 * s, '#36424f', 6, 125 * s); rrect(ctx, x - 200 * s, y - 715 * s, 400 * s, 700 * s, 95 * s); fillStroke(ctx, '#0d1118', 6); }
function wtClip(ctx, x, y, s) { rrect(ctx, x - 200 * s, y - 715 * s, 400 * s, 700 * s, 95 * s); ctx.clip(); }
function wtSlab(ctx, x, y, s, o = {}) {
  const open = o.open || 0;
  ctx.save(); ctx.translate(x - 200 * s, y); ctx.scale(s * (1 - open * .88), s);
  if (o.bulge) { ctx.translate(200, -360); ctx.scale(1 + o.bulge * .05, 1 + o.bulge * .03); ctx.translate(-200, 360); }
  box(ctx, 0, -715, 400, 700, o.col || '#93a4b2', 6, 95);
  ctx.save(); rrect(ctx, 0, -715, 400, 700, 95); ctx.clip(); ctx.fillStyle = 'rgba(15,25,45,.2)'; ctx.fillRect(270, -720, 140, 720); ctx.fillStyle = 'rgba(255,255,255,.2)'; ctx.fillRect(34, -720, 26, 720); ctx.restore();
  rrect(ctx, 28, -687, 344, 644, 72); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(20,30,45,.45)'; ctx.stroke();
  for (const [dx, dy] of [[-8, -560], [-8, -360], [-8, -160], [376, -560], [376, -360], [376, -160]]) box(ctx, dx, dy - 22, 32, 44, '#5d6b78', 4, 6);
  circle(ctx, 200, -570, 58); fillStroke(ctx, '#5d6b78', 5); circle(ctx, 200, -570, 42); fillStroke(ctx, o.glass || '#17202c', 5);
  if (o.window) { ctx.save(); circle(ctx, 200, -570, 40); ctx.clip(); o.window(ctx); ctx.restore(); }
  for (const [dx, dy, r, a] of (o.dents || [])) { if (a <= 0) continue; ctx.save(); ctx.translate(dx, dy); ctx.scale(backOut(clamp(a)), backOut(clamp(a))); ellipse(ctx, 0, 0, r, r * .8); ctx.fillStyle = 'rgba(15,25,45,.3)'; ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 0, r, r * .8, 0, .4, 2.6); ctx.lineWidth = 7; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, r, r * .8, 0, 3.5, 5.8); ctx.strokeStyle = 'rgba(15,25,45,.6)'; ctx.stroke(); for (let i = 0; i < 4; i++) { const an = i * 1.6 + r; line(ctx, Math.cos(an) * r, Math.sin(an) * r * .8, Math.cos(an) * r * 1.5, Math.sin(an) * r * 1.3, 4, 'rgba(15,25,45,.6)'); } ctx.restore(); }
  // wheel
  ctx.save(); ctx.translate(200, -330); ctx.rotate(o.spin || 0); circle(ctx, 0, 0, 96); ctx.lineWidth = 30; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 19; ctx.strokeStyle = '#e0392f'; ctx.stroke(); for (let i = 0; i < 3; i++) { ctx.rotate(TAU / 6); line(ctx, -92, 0, 92, 0, 22, INK); line(ctx, -90, 0, 90, 0, 12, '#e0392f'); } ctx.restore();
  circle(ctx, 200, -330, 26); fillStroke(ctx, '#d9dde2', 5);
  ctx.restore();
}
// ----- galley -----
function can(ctx, x, y, w, h, c) { box(ctx, x - w / 2, y - h, w, h, c, 4, 5); ctx.fillStyle = '#fbfbf2'; ctx.fillRect(x - w / 2 + 2, y - h * .68, w - 4, h * .36); circle(ctx, x, y - h * .5, h * .12); ctx.fillStyle = c; ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.fillRect(x + w * .18, y - h + 2, w * .3, h - 4); ellipse(ctx, x, y - h, w / 2, 6); fillStroke(ctx, '#d9dde2', 3.5); }
function jar(ctx, x, y, w, h, c) { box(ctx, x - w / 2, y - h, w, h, 'rgba(225,245,255,.75)', 4, 10); ctx.fillStyle = c; rrect(ctx, x - w / 2 + 5, y - h * .7, w - 10, h * .7 - 5, 6); ctx.fill(); box(ctx, x - w / 2 - 3, y - h - 12, w + 6, 16, '#e8c04a', 4, 4); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x - w / 2 + 8, y - h + 8, 7, h - 20); }
function sack(ctx, x, y, s, label) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-70, 0); ctx.quadraticCurveTo(-96, -90, -62, -170); ctx.lineTo(-30, -200); ctx.lineTo(30, -200); ctx.lineTo(62, -170); ctx.quadraticCurveTo(96, -90, 70, 0); ctx.closePath(); fillStroke(ctx, '#e6cf9c', 5); ctx.fillStyle = 'rgba(90,50,0,.14)'; ctx.fillRect(20, -180, 60, 180); path(ctx, [[-34, -200], [0, -228], [34, -200]]); fillStroke(ctx, '#d9be82', 5); line(ctx, -32, -196, 32, -196, 7, '#8a5a2c'); text(ctx, label, 0, -90, 34, '#8a5a2c', null, 0); ctx.restore(); }
function shelfItems(ctx, x0, x1, y, seed) { const R = rng(seed); let x = x0 + 40; const cs = ['#e0392f', '#3fa35b', '#f2b52a', '#2f63c9', '#e67e22', '#8e44ad', '#17a6b8']; while (x < x1 - 40) { const k = R(), c = cs[Math.floor(R() * cs.length)]; if (k < .45) { can(ctx, x, y, 58, 84 + R() * 20, c); if (R() < .4) can(ctx, x, y - 96, 58, 80, cs[Math.floor(R() * cs.length)]); x += 74; } else if (k < .75) { jar(ctx, x + 6, y, 64, 100 + R() * 30, c); x += 88; } else { box(ctx, x - 34, y - 130, 80, 130, c, 4, 4); box(ctx, x - 20, y - 104, 52, 40, '#fbfbf2', 3, 4); x += 100; } } }
function fridge(ctx, x, y, t) {
  box(ctx, x, y - 900, 520, 900, '#c9d3da', 6, 14); box(ctx, x + 22, y - 878, 476, 850, '#fff7d6', 5, 8); glow(ctx, x + 260, y - 480, 520, '255,240,170', .4);
  for (let k = 0; k < 4; k++) { const sy = y - 690 + k * 195; line(ctx, x + 24, sy, x + 496, sy, 7, '#9aa7b3'); shelfItems(ctx, x + 20, x + 500, sy - 4, 30 + k); }
  ellipse(ctx, x + 150, y - 70, 100, 62); fillStroke(ctx, '#3fa35b', 5); for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.ellipse(x + 150, y - 70, Math.abs(i) * 36 + 8, 62, 0, 0, TAU); ctx.lineWidth = 4; ctx.strokeStyle = '#1f6b3a'; ctx.stroke(); }
  for (let i = 0; i < 4; i++) { circle(ctx, x + 300 + i * 46, y - 56 - (i % 2) * 6, 26); fillStroke(ctx, '#ff9a2e', 4); }
  // open door
  path(ctx, [[x + 520, y - 900], [x + 700, y - 940], [x + 700, y + 40], [x + 520, y]]); fillStroke(ctx, '#b4c0c8', 6); for (let k = 0; k < 3; k++) { path(ctx, [[x + 540, y - 640 + k * 240], [x + 680, y - 660 + k * 250], [x + 680, y - 590 + k * 250], [x + 540, y - 575 + k * 240]]); fillStroke(ctx, '#fbfbf8', 4); jar(ctx, x + 580, y - 650 + k * 242, 40, 70, '#ffd23a'); jar(ctx, x + 640, y - 664 + k * 248, 40, 76, '#e0392f'); }
}
function setKitchen(ctx, t, cam) {
  applyCam(ctx, cam, 1);
  wallP(ctx, 1150, '#f3f7f8', '#e3ecef');
  ctx.strokeStyle = 'rgba(120,150,165,.28)'; ctx.lineWidth = 3; for (let x = -900; x < 3800; x += 92) line(ctx, x, -500, x, 1150, 3, 'rgba(120,150,165,.25)'); for (let y = -460; y < 1150; y += 92) line(ctx, -900, y, 3800, y, 3, 'rgba(120,150,165,.25)');
  ctx.fillStyle = '#17a6b8'; ctx.fillRect(-900, 760, 4700, 26);
  // hanging rail
  line(ctx, -900, 130, 3800, 130, 10, '#8b96a3');
  for (let i = 0; i < 16; i++) { const x = -260 + i * 210, sw = Math.sin(t * 1.4 + i) * .04; if (x > 1520 && x < 2280) continue; if (i % 3 === 0) { line(ctx, x, 130, x, 170, 5); drawPan(ctx, x, 150, .62, Math.PI + sw); } else if (i % 3 === 1) { ctx.save(); ctx.translate(x, 130); ctx.rotate(sw); line(ctx, 0, 0, 0, 150, 9, INK); line(ctx, 0, 0, 0, 150, 4, '#d9dde2'); ellipse(ctx, 0, 172, 30, 26); fillStroke(ctx, '#d9dde2', 5); ctx.restore(); } else { ctx.save(); ctx.translate(x, 130); ctx.rotate(sw); for (let k = 0; k < 3; k++) { ellipse(ctx, (k - 1) * 30, 90 + k * 8, 15, 62, (k - 1) * .12); fillStroke(ctx, '#b5452c', 4); } line(ctx, -30, 0, -30, 40, 4); line(ctx, 30, 0, 30, 50, 4); ctx.restore(); } }
  // shelves
  for (const [sy, sd] of [[470, 3], [690, 11]]) { for (const [a, b] of [[-400, 1500], [2330, 3600]]) { shelfItems(ctx, a, b, sy, sd + a); box(ctx, a - 20, sy, b - a + 40, 24, '#a8733f', 5, 5); for (let x = a + 60; x < b; x += 420) path(ctx, [[x, sy + 24], [x + 16, sy + 24], [x + 16, sy + 70]]), fillStroke(ctx, '#8b96a3', 4); } }
  fridge(ctx, 1620, 1150, t);
  // counter
  box(ctx, -900, 900, 2440, 262, '#b9c4cc', 5); box(ctx, 2360, 900, 1500, 262, '#b9c4cc', 5);
  for (let x = -860; x < 3800; x += 250) { if (x > 1380 && x < 2360) continue; box(ctx, x, 940, 220, 196, '#cdd6dc', 4, 8); box(ctx, x + 80, 962, 60, 12, '#8b96a3', 3, 5); }
  box(ctx, -900, 876, 2450, 34, '#eef2f5', 5, 6); box(ctx, 2350, 876, 1500, 34, '#eef2f5', 5, 6);
  // stove with pot
  const sx = 260; for (let i = 0; i < 5; i++) { const fx = sx - 60 + i * 30, fh = 22 + Math.sin(t * 14 + i * 2) * 8; path(ctx, [[fx - 12, 876], [fx, 876 - fh], [fx + 12, 876]]); fillStroke(ctx, i % 2 ? '#ffb347' : '#4fc3f7', 3); }
  steam(ctx, sx, 720, t, 3, 1.3); box(ctx, sx - 100, 740, 200, 124, '#8b96a3', 5, 12); ctx.fillStyle = 'rgba(255,255,255,.3)'; ctx.fillRect(sx - 84, 748, 20, 108); box(ctx, sx - 112, 728, 224, 22, '#aab4bd', 5, 8); box(ctx, sx - 140, 780, 40, 16, '#3a3a44', 4, 6); box(ctx, sx + 100, 780, 40, 16, '#3a3a44', 4, 6);
  // board with veg, flour, bread
  box(ctx, 520, 858, 260, 20, '#d9a25f', 5, 6); for (let i = 0; i < 3; i++) { circle(ctx, 570 + i * 56, 836, 24); fillStroke(ctx, '#e0392f', 4); line(ctx, 570 + i * 56, 814, 576 + i * 56, 802, 5, '#3fa35b'); } path(ctx, [[720, 856], [800, 820], [806, 840]]); fillStroke(ctx, '#ff9a2e', 4);
  sack(ctx, 940, 876, 1, 'FLOUR'); sack(ctx, 1090, 876, .9, 'RICE');
  for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(1270 + i * 24, 876); ctx.rotate(-.5 + i * .12); box(ctx, -20, -210, 40, 210, '#e2a85a', 4, 20); for (let k = 0; k < 4; k++) line(ctx, -10, -170 + k * 40, 10, -182 + k * 40, 3, '#b87a34'); ctx.restore(); }
  cake(ctx, 2560, 876, .8); fruitBowl(ctx, 2820, 876, 1); sack(ctx, 3080, 876, 1, 'SUGAR');
  floorP(ctx, 1160, '#f6f6f2', '#d6d6d0', 'rgba(40,40,50,.22)', cam.x, 150, 9);
  // crates on the floor
  drawCrate(ctx, 2480, 1420, 240, 200, 0, 'FRUIT'); for (let i = 0; i < 4; i++) { circle(ctx, 2400 + i * 52, 1206, 30); fillStroke(ctx, i % 2 ? '#ff9a2e' : '#e0392f', 4); }
}
// ----- medical bay -----
function bottle(ctx, x, y, h, c) { box(ctx, x - 20, y - h, 40, h, c, 4, 8); box(ctx, x - 11, y - h - 18, 22, 20, '#fbfbf8', 4, 4); box(ctx, x - 16, y - h * .62, 32, h * .34, '#fbfbf8', 3, 3); }
function bandage(ctx, x, y, r = 30) { ellipse(ctx, x, y - r, r * 1.15, r); fillStroke(ctx, '#fbfbf2', 4); ctx.beginPath(); for (let a = 0; a < 11; a += .3) { const rr = 3 + a * r * .075; const px = x + Math.cos(a) * rr * 1.15, py = y - r + Math.sin(a) * rr; a ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.lineWidth = 3; ctx.strokeStyle = '#c9c4b4'; ctx.stroke(); }
function medkit(ctx, x, y, s = 1) { box(ctx, x - 70 * s, y - 100 * s, 140 * s, 100 * s, '#e0392f', 5, 12 * s); box(ctx, x - 24 * s, y - 118 * s, 48 * s, 22 * s, null, 5, 8 * s); ctx.fillStyle = '#fff'; ctx.fillRect(x - 12 * s, y - 80 * s, 24 * s, 60 * s); ctx.fillRect(x - 30 * s, y - 62 * s, 60 * s, 24 * s); }
function curtain(ctx, x0, x1, y0, y1, t, shake = 0) { const n = Math.max(2, Math.round((x1 - x0) / 70)); ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1 + Math.sin(t * 30) * shake, y1); for (let i = n; i > 0; i--) { const xa = x0 + (x1 - x0) * i / n, xb = x0 + (x1 - x0) * (i - 1) / n; ctx.quadraticCurveTo((xa + xb) / 2 + Math.sin(t * 30 + i) * shake, y1 + 26, xb + Math.sin(t * 30 + i) * shake, y1); } ctx.closePath(); fillStroke(ctx, '#3bb6a6', 5); for (let i = 1; i < n; i++) { const xa = x0 + (x1 - x0) * i / n; ctx.beginPath(); ctx.moveTo(xa, y0); ctx.quadraticCurveTo(xa + 10 + Math.sin(t * 30 + i) * shake, (y0 + y1) / 2, xa + Math.sin(t * 30 + i) * shake, y1); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(10,80,80,.35)'; ctx.stroke(); } }
function setMed(ctx, t, cam) {
  applyCam(ctx, cam, 1);
  wallP(ctx, 1180, '#e2f6ef', '#cdeee2', { wains: '#8fcdb9', wainsH: 300, trim: '#fbfbf8' });
  // cross sign
  glow(ctx, 210, 330, 330, '255,120,110', .3); box(ctx, 110, 230, 200, 200, '#fbfbf8', 6, 30); ctx.fillStyle = '#e0392f'; ctx.fillRect(185, 262, 50, 136); ctx.fillRect(142, 305, 136, 50);
  // eye chart + ecg
  box(ctx, -330, 330, 250, 380, '#fbfbf8', 5, 8); ['E', 'F P', 'T O Z', 'L P E D'].forEach((s, i) => text(ctx, s, -205, 400 + i * 78, 70 - i * 14, INK));
  // cabinet
  box(ctx, 480, 300, 560, 600, '#fbfbf8', 6, 14); for (let k = 0; k < 3; k++) { const sy = 480 + k * 190; line(ctx, 496, sy, 1024, sy, 8, '#b9c4cc'); }
  for (let i = 0; i < 6; i++) bottle(ctx, 540 + i * 62, 476, 80 + (i * 37 % 40), ['#8e44ad', '#f2b52a', '#2f63c9', '#3fa35b', '#e67e22', '#17a6b8'][i]); medkit(ctx, 950, 476, .8);
  for (let i = 0; i < 4; i++) bandage(ctx, 550 + i * 76, 666, 30); for (let i = 0; i < 3; i++) box(ctx, 850 + i * 56, 586, 46, 80, ['#ff7eb6', '#6ec6e8', '#c6f06a'][i], 4, 5);
  for (let i = 0; i < 5; i++) bottle(ctx, 546 + i * 70, 856, 90 + (i * 53 % 50), ['#e0392f', '#17a6b8', '#f2b52a', '#8e44ad', '#3fa35b'][i]); bandage(ctx, 940, 856, 34);
  ctx.fillStyle = 'rgba(190,230,250,.25)'; ctx.fillRect(486, 306, 548, 588); line(ctx, 760, 304, 760, 896, 6); ctx.fillStyle = 'rgba(255,255,255,.3)'; path(ctx, [[500, 520], [640, 310], [700, 310], [500, 610]]); ctx.fill();
  box(ctx, 480, 900, 560, 290, '#e9eef2', 6, 10); box(ctx, 520, 940, 220, 100, '#fbfbf8', 4, 8); box(ctx, 780, 940, 220, 100, '#fbfbf8', 4, 8); box(ctx, 600, 980, 60, 12, '#8b96a3', 3, 5); box(ctx, 860, 980, 60, 12, '#8b96a3', 3, 5);
  porthole(ctx, 1230, 520, 80, t);
  // bed + monitor + iv
  box(ctx, 1150, 800, 150, 120, '#2b3440', 5, 12); ctx.save(); rrect(ctx, 1160, 810, 130, 100, 8); ctx.clip(); ctx.beginPath(); for (let x = 0; x <= 130; x += 4) { const ph = ((x / 130) * 2 + t * 1.2) % 1; const yy = 860 - (ph > .4 && ph < .46 ? 34 : ph > .46 && ph < .52 ? -18 : 0); x ? ctx.lineTo(1160 + x, yy) : ctx.moveTo(1160 + x, yy); } ctx.lineWidth = 5; ctx.strokeStyle = '#7dff8a'; ctx.stroke(); ctx.restore(); line(ctx, 1225, 920, 1225, 1180, 10, INK); line(ctx, 1225, 920, 1225, 1180, 4, '#d9dde2'); ellipse(ctx, 1225, 1184, 60, 12); fillStroke(ctx, '#8b96a3', 4);
  line(ctx, 1400, 400, 1400, 1190, 10, INK); line(ctx, 1400, 400, 1400, 1190, 4, '#d9dde2'); line(ctx, 1360, 400, 1440, 400, 8); rrect(ctx, 1408, 410, 60, 110, 16); fillStroke(ctx, 'rgba(200,240,255,.8)', 4); ctx.fillStyle = '#ffd98a'; ctx.fillRect(1412, 460, 52, 56); ctx.beginPath(); ctx.moveTo(1438, 520); ctx.quadraticCurveTo(1470, 760, 1560, 880); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(40,60,80,.6)'; ctx.stroke();
  box(ctx, 1500, 900, 560, 60, '#fbfbf8', 5, 20); box(ctx, 1500, 950, 560, 80, '#6ec6e8', 5, 10); box(ctx, 1490, 800, 30, 390, '#d9dde2', 5, 8); box(ctx, 2046, 860, 30, 330, '#d9dde2', 5, 8); ellipse(ctx, 1610, 892, 84, 36); fillStroke(ctx, '#fbfbf8', 5); box(ctx, 1520, 1030, 530, 26, '#b9c4cc', 4, 6); for (const wx of [1520, 2050]) { circle(ctx, wx, 1200, 20); fillStroke(ctx, '#3a3a44', 4); }
  line(ctx, 1300, 262, 2400, 262, 10, '#8b96a3');
  floorP(ctx, 1180, '#f1f8f5', '#d3e5de', 'rgba(70,130,120,.28)', cam.x, 170, 8);
}
// ----- the climb: the superstructure from outside -----
const CLIMB = [[250, 1700], [830, 1270], [250, 840], [830, 410], [250, -20], [470, -20]];
function climbPt(p) { const n = CLIMB.length - 1, k = clamp(p) * n, i = Math.min(n - 1, Math.floor(k)), f = k - i; return [lerp(CLIMB[i][0], CLIMB[i + 1][0], f), lerp(CLIMB[i][1], CLIMB[i + 1][1], f), CLIMB[i + 1][0] > CLIMB[i][0] ? 1 : -1]; }
function setTower(ctx, t, cam) {
  applyCam(ctx, cam, .05); drawSky(ctx, '#4d8fd6', '#ffd9a0', -700, 1500);
  applyCam(ctx, cam, .1); drawSun(ctx, 900, 1150, 90, t, 1.2);
  applyCam(ctx, cam, .2); drawCloud(ctx, 100, 500, 150, 3); drawCloud(ctx, 900, -100, 130, 5); drawCloud(ctx, 300, -900, 160, 7); drawCloud(ctx, 950, 900, 110, 2);
  applyCam(ctx, cam, .45); drawSea(ctx, 1780, t, 3000, ['#ffd9a0', '#3fb0c8', '#0d7fa6']);
  applyCam(ctx, cam, .8);
  path(ctx, [[760, 300], [800, -520], [1010, -520], [1050, 300]]); fillStroke(ctx, '#e23d32', 6); ctx.fillStyle = '#1f2c52'; ctx.fillRect(798, -520, 214, 90); ctx.fillStyle = '#fbfbf7'; ctx.fillRect(786, -300, 240, 60); path(ctx, [[760, 300], [800, -520], [1010, -520], [1050, 300]]); fillStroke(ctx, null, 6);
  for (let i = 0; i < 4; i++) { const k = (t * .12 + i / 4) % 1; circle(ctx, 900 - k * 300, -560 - k * 260, 50 + k * 90); ctx.fillStyle = `rgba(250,250,252,${.8 * (1 - k)})`; ctx.fill(); }
  applyCam(ctx, cam, 1);
  for (let i = 0; i < 4; i++) {
    const yb = 1700 - i * 430, x0 = 40 + i * 40, x1 = 1040 - i * 40;
    box(ctx, x0, yb - 430, x1 - x0, 430, i % 2 ? '#f1f4f6' : '#fbfbf8', 6); ctx.fillStyle = 'rgba(30,40,90,.1)'; ctx.fillRect(x1 - 130, yb - 428, 128, 426);
    for (let wx = x0 + 60; wx < x1 - 120; wx += 150) { box(ctx, wx, yb - 330, 90, 130, '#5fb7e2', 5, 14); ctx.fillStyle = 'rgba(255,220,150,.55)'; path(ctx, [[wx + 6, yb - 250], [wx + 60, yb - 326], [wx + 84, yb - 326], [wx + 6, yb - 216]]); ctx.fill(); }
    box(ctx, x0 - 30, yb - 12, x1 - x0 + 60, 24, '#d9dde2', 5, 6);
  }
  // bridge
  box(ctx, -40, -330, 1160, 310, '#fbfbf8', 6, 10); path(ctx, [[0, -90], [20, -280], [1060, -280], [1080, -90]]); fillStroke(ctx, '#27405f', 6); for (let x = 150; x < 1080; x += 190) line(ctx, x, -280, x, -90, 10, '#fbfbf8'); ctx.fillStyle = 'rgba(255,220,150,.3)'; path(ctx, [[40, -110], [180, -270], [300, -270], [80, -100]]); ctx.fill();
  box(ctx, -70, -32, 1220, 24, '#d9dde2', 5, 6); sign(ctx, 'BRIDGE', 540, -372, 50, '#fbfbf8', '#1f2c52');
  box(ctx, 420, -200, 110, 180, '#8fa0ae', 5, 20); circle(ctx, 475, -140, 20); fillStroke(ctx, '#17202c', 4);
  line(ctx, 300, -330, 300, -760, 12, '#8b96a3'); ctx.save(); ctx.translate(300, -640); ctx.scale(Math.cos(t * 3), 1); box(ctx, -90, -14, 180, 28, '#fbfbf8', 5, 10); ctx.restore(); path(ctx, [[300, -760], [390 + Math.sin(t * 5) * 6, -735], [300, -705]]); fillStroke(ctx, '#e23d32', 5);
  circle(ctx, 620, -410, 80); fillStroke(ctx, '#fbfbf8', 6); ctx.fillStyle = 'rgba(30,40,90,.1)'; ctx.beginPath(); ctx.arc(620, -410, 78, -1, 1.2); ctx.fill();
  // zigzag stairs + railings
  for (let i = 0; i < 4; i++) { const [ax, ay] = CLIMB[i], [bx, by] = CLIMB[i + 1]; line(ctx, ax, ay, bx, by, 30, INK); line(ctx, ax, ay, bx, by, 20, '#f2c230'); for (let k = 1; k < 10; k++) { const sx = lerp(ax, bx, k / 10), sy = lerp(ay, by, k / 10); line(ctx, sx - 16, sy, sx + 16, sy, 5, '#a8842a'); } }
}
function towerRails(ctx) {
  for (let i = 0; i < 4; i++) { const [ax, ay] = CLIMB[i], [bx, by] = CLIMB[i + 1]; line(ctx, ax, ay - 120, bx, by - 120, 12, INK); line(ctx, ax, ay - 120, bx, by - 120, 6, '#fbfbf8'); for (let k = 0; k <= 5; k++) { const sx = lerp(ax, bx, k / 5), sy = lerp(ay, by, k / 5); line(ctx, sx, sy, sx, sy - 120, 5, '#d9dde2'); } }
}
// ----- the bridge -----
function shipWheel(ctx, x, y, r, rot) { line(ctx, x, y, x, y + r * 2.3, r * .3, INK); line(ctx, x, y, x, y + r * 2.3, r * .2, '#8a4b14'); ctx.save(); ctx.translate(x, y); ctx.rotate(rot); for (let i = 0; i < 4; i++) { ctx.rotate(TAU / 8); line(ctx, -r * 1.3, 0, r * 1.3, 0, r * .16, INK); line(ctx, -r * 1.28, 0, r * 1.28, 0, r * .09, '#c98a3f'); } circle(ctx, 0, 0, r); ctx.lineWidth = r * .24; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = r * .15; ctx.strokeStyle = '#a8642a'; ctx.stroke(); circle(ctx, 0, 0, r * .22); fillStroke(ctx, '#e8c04a', 5); ctx.restore(); }
function setBridge(ctx, t, cam, o = {}) {
  applyCam(ctx, cam, .25); drawSky(ctx, '#5a8fd0', '#ffcf8a', -200, 700); drawSun(ctx, 760, 520, 70, t, 1.1); drawCloud(ctx, 200, 300, 120, 4); drawCloud(ctx, 1050, 200, 100, 6);
  drawSea(ctx, 660, t, 2000, ['#ffd9a0', '#3fb0c8', '#0d7fa6']);
  if (o.outside) o.outside(ctx);
  applyCam(ctx, cam, 1);
  // window wall
  ctx.fillStyle = '#273043'; ctx.fillRect(-2000, -1200, 6000, 1380); ctx.fillRect(-2000, 800, 6000, 400);
  for (let x = -1640; x < 3600; x += 380) { box(ctx, x - 20, 170, 40, 640, '#273043', 5); ctx.fillStyle = 'rgba(255,255,255,.14)'; path(ctx, [[x + 60, 800], [x + 240, 180], [x + 300, 180], [x + 120, 800]]); ctx.fill(); }
  line(ctx, -2000, 180, 4000, 180, 6); line(ctx, -2000, 800, 4000, 800, 6);
  // ceiling instruments
  for (let x = -900; x < 2400; x += 300) { box(ctx, x, 70, 200, 84, '#1a2030', 5, 10); for (let k = 0; k < 4; k++) { circle(ctx, x + 34 + k * 44, 112, 12); ctx.fillStyle = (Math.floor(t * 2 + k + x) % 3) ? ['#7dff8a', '#ffd23a', '#ff6a4d', '#4fe3ff'][k] : '#2f3a50'; ctx.fill(); } }
  // console
  box(ctx, -2000, 900, 6000, 280, '#3a4a66', 5); path(ctx, [[-2000, 900], [4000, 900], [4000, 850], [-2000, 850]]); fillStroke(ctx, '#55698c', 5);
  for (let x = -1500; x < 3600; x += 300) { box(ctx, x, 940, 260, 200, '#324059', 4, 8); }
  // radar
  for (const rx of [140, 1640]) { box(ctx, rx - 110, 700, 220, 170, '#1a2030', 5, 14); ctx.save(); circle(ctx, rx, 785, 68); ctx.clip(); ctx.fillStyle = '#0d2a1a'; ctx.fillRect(rx - 70, 715, 140, 140); ctx.beginPath(); ctx.moveTo(rx, 785); ctx.arc(rx, 785, 70, t * 2, t * 2 + .9); ctx.closePath(); ctx.fillStyle = 'rgba(125,255,138,.55)'; ctx.fill(); for (const [dx, dy] of [[20, -30], [-34, 12], [8, 40]]) { circle(ctx, rx + dx, 785 + dy, 5); ctx.fillStyle = '#7dff8a'; ctx.fill(); } ctx.restore(); circle(ctx, rx, 785, 68); ctx.lineWidth = 5; ctx.strokeStyle = '#7dff8a'; ctx.stroke(); circle(ctx, rx, 785, 36); ctx.lineWidth = 2; ctx.stroke(); }
  // buttons + throttles
  for (const bx of [860, -340, 2000]) { for (let i = 0; i < 12; i++) { box(ctx, bx + (i % 4) * 44, 866 + Math.floor(i / 4) * -44 - 30, 30, 26, (Math.floor(t * 3 + i * 1.7) % 4) ? ['#ff6a4d', '#ffd23a', '#7dff8a', '#4fe3ff'][i % 4] : '#49566e', 3, 5); } }
  for (const lx of [320, 380]) { box(ctx, lx - 14, 780, 28, 90, '#1a2030', 4, 6); line(ctx, lx, 850, lx + Math.sin(t + lx) * 6, 760, 9, INK); circle(ctx, lx + Math.sin(t + lx) * 6, 752, 15); fillStroke(ctx, '#e0392f', 4); }
  floorP(ctx, 1180, '#2e3a58', '#1a2136', 'rgba(255,255,255,.07)', cam.x, 160, 8);
}
function radio(ctx, x, y, t, on = 1) {
  line(ctx, x + 130, y - 200, x + 190, y - 470, 7, INK); circle(ctx, x + 190, y - 470, 11); fillStroke(ctx, '#e0392f', 4);
  box(ctx, x - 170, y - 210, 340, 210, '#59636e', 6, 16); box(ctx, x - 150, y - 190, 150, 110, '#2b3440', 4, 8); for (let i = 0; i < 5; i++) line(ctx, x - 136, y - 174 + i * 20, x - 14, y - 174 + i * 20, 5, '#59636e');
  box(ctx, x + 20, y - 190, 130, 56, '#0d2a1a', 4, 6); ctx.beginPath(); for (let i = 0; i <= 26; i++) { const yy = y - 162 + Math.sin(i * 1.1 + t * 14) * 16 * on * Math.sin(i / 26 * Math.PI); i ? ctx.lineTo(x + 28 + i * 4.4, yy) : ctx.moveTo(x + 28 + i * 4.4, yy); } ctx.lineWidth = 4; ctx.strokeStyle = '#7dff8a'; ctx.stroke();
  for (let i = 0; i < 3; i++) { circle(ctx, x + 42 + i * 44, y - 96, 17); fillStroke(ctx, '#d9dde2', 4); line(ctx, x + 42 + i * 44, y - 96, x + 42 + i * 44 + Math.cos(t + i * 2) * 13, y - 96 + Math.sin(t + i * 2) * 13, 4); }
  circle(ctx, x - 130, y - 40, 12); ctx.fillStyle = Math.floor(t * 4) % 2 ? '#ff6a4d' : '#7a2a22'; ctx.fill(); box(ctx, x - 90, y - 54, 240, 28, '#2b3440', 4, 6);
}
// ----- lifeboat + sunset -----
function lifeboat(ctx, x, y, s, part = 'front') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (part === 'back') { path(ctx, [[-296, 0], [296, 0], [270, 70], [-270, 70]]); fillStroke(ctx, '#b35a10', 5); for (const bx of [-120, 120]) box(ctx, bx - 60, 2, 120, 16, '#d9a25f', 4, 4); ctx.restore(); return; }
  const hull = () => { ctx.beginPath(); ctx.moveTo(-320, -8); ctx.lineTo(320, -8); ctx.quadraticCurveTo(300, 150, 200, 160); ctx.lineTo(-200, 160); ctx.quadraticCurveTo(-300, 150, -320, -8); ctx.closePath(); };
  hull(); ctx.fillStyle = '#ff8a1f'; ctx.fill(); ctx.save(); hull(); ctx.clip(); ctx.fillStyle = '#fbfbf8'; ctx.fillRect(-330, 36, 660, 22); ctx.fillStyle = 'rgba(80,20,0,.2)'; ctx.fillRect(-330, 104, 660, 70); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fillRect(-330, -4, 660, 12); ctx.restore(); hull(); fillStroke(ctx, null, 6);
  box(ctx, -330, -20, 660, 24, '#ffa94d', 5, 10);
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(-250 + i * 100, 8); ctx.quadraticCurveTo(-200 + i * 100, 40, -150 + i * 100, 8); ctx.lineWidth = 5; ctx.strokeStyle = '#fbfbf8'; ctx.stroke(); }
  text(ctx, 'LIFEBOAT 7', 0, 84, 34, '#fbfbf8', INK, 0);
  ctx.restore();
}
function sunsetSky(ctx, t, cam, hz) {
  applyCam(ctx, cam, .05); ctx.fillStyle = lg(ctx, 0, -300, 0, hz, '#2b1b4d', '#6a2c7a', '#d94f70', '#ff9a4a', '#ffdc8f'); ctx.fillRect(-3000, -3000, 7000, 3000 + hz + 400);
  const R = rng(5); for (let i = 0; i < 26; i++) { circle(ctx, -200 + R() * 1500, -250 + R() * 500, 2 + R() * 2.5); ctx.fillStyle = `rgba(255,240,220,${.3 + .3 * Math.sin(t * 2 + i)})`; ctx.fill(); }
  applyCam(ctx, cam, .08); glow(ctx, 560, hz - 30, 700, '255,220,140', .6); circle(ctx, 560, hz - 30, 170); ctx.fillStyle = '#fff3c0'; ctx.fill(); circle(ctx, 560, hz - 30, 150); ctx.fillStyle = '#ffe9a0'; ctx.fill();
  applyCam(ctx, cam, .14); for (const [cx, cy, w, c] of [[160, hz - 330, 380, '#8a3a86'], [860, hz - 420, 320, '#6a2c7a'], [760, hz - 200, 300, '#e0607a'], [120, hz - 150, 260, '#f08a6a'], [1150, hz - 280, 300, '#b0487e']]) { ellipse(ctx, cx + t * 4, cy, w, 26); ctx.fillStyle = c; ctx.fill(); ellipse(ctx, cx + 60 + t * 4, cy - 22, w * .6, 22); ctx.fill(); }
}
function sunsetSea(ctx, t, hz, sunX = 560) {
  ctx.fillStyle = lg(ctx, 0, hz, 0, hz + 900, '#ffb36b', '#d05a72', '#5a2f72', '#2a1b4d'); ctx.fillRect(-3000, hz, 7000, 4000);
  const R = rng(21); ctx.lineCap = 'round';
  for (let i = 0; i < 70; i++) { const d = R(), y = hz + 8 + d * d * 900, sc = .3 + d * 1.5, spread = 60 + d * 380; const x = sunX + (R() - .5) * spread * 2 + Math.sin(t * 2 + i) * 10; line(ctx, x - 26 * sc, y, x + 26 * sc, y, 3 + sc * 3, `rgba(255,236,180,${.75 - d * .35})`); }
  for (let i = 0; i < 60; i++) { const d = R(), y = hz + 14 + d * d * 900, sc = .3 + d * 1.6; const x = ((R() * 3000 + t * 12 * sc) % 3000) - 900; ctx.lineWidth = 2 + sc * 3; ctx.strokeStyle = 'rgba(255,200,190,.3)'; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 22 * sc, y - 6 * sc, x + 44 * sc, y); ctx.stroke(); }
  ctx.fillStyle = 'rgba(255,240,200,.5)'; ctx.fillRect(-3000, hz - 2, 7000, 5);
}
// the boat deck at dusk: ship's side on the left, the lifeboat hangs from davits on the right
function setBoatDeck(ctx, t, cam) {
  sunsetSky(ctx, t, cam, 2300);
  applyCam(ctx, cam, 1); sunsetSea(ctx, t, 2300, 900);
  // superstructure
  box(ctx, -1200, -900, 1560, 2060, '#f4ede6', 6); for (let r = 0; r < 5; r++) for (let x = -1100; x < 300; x += 190) { const g = (x * 7 + r * 13) % 3 === 0; box(ctx, x, -700 + r * 380, 110, 150, g ? '#9be24a' : '#ffe08a', 5, 14); if (g) glow(ctx, x + 55, -625 + r * 380, 160, '150,255,90', .3); }
  box(ctx, 130, 700, 190, 450, '#8fa0ae', 5, 30); circle(ctx, 225, 830, 34); fillStroke(ctx, '#17202c', 5);
  // hull + deck
  box(ctx, -1200, 1210, 1800, 1700, '#f4ede6', 6); for (let r = 0; r < 4; r++) for (let x = -1100; x < 560; x += 170) { circle(ctx, x, 1420 + r * 230, 34); fillStroke(ctx, (x + r * 170) % 510 === 0 ? '#9be24a' : '#3b4a66', 5); }
  ctx.fillStyle = '#e23d32'; ctx.fillRect(-1197, 2280, 1794, 30); ctx.fillStyle = '#27407a'; ctx.fillRect(-1197, 2310, 1794, 600);
  box(ctx, -1200, 1150, 1820, 64, '#c98a4f', 6, 6);
  for (let x = -1150; x < 470; x += 150) { line(ctx, x, 1150, x, 990, 11, INK); line(ctx, x, 1150, x, 990, 5, '#fbfbf8'); } line(ctx, -1200, 990, 440, 990, 16, INK); line(ctx, -1200, 990, 440, 990, 8, '#fbfbf8'); line(ctx, -1200, 1070, 440, 1070, 6, '#d9dde2');
  // davits
  for (const [bx, top, tipx] of [[520, 640, 700], [590, 560, 1020]]) { ctx.beginPath(); ctx.moveTo(bx, 1150); ctx.lineTo(bx, top + 120); ctx.quadraticCurveTo(bx, top, tipx, top); ctx.lineWidth = 34; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 22; ctx.strokeStyle = '#f2c230'; ctx.stroke(); circle(ctx, tipx, top, 22); fillStroke(ctx, '#3a3a44', 5); }
}
