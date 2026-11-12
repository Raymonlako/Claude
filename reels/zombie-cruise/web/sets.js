// ---------- sets, part 1: sea, the ship, pool deck, buffet, corridor, casino, grand stairs ----------
function lg(ctx, x0, y0, x1, y1, ...stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); return g; }
function glow(ctx, x, y, r, col = '255,220,140', a = .5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, r * .05, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
function tint(ctx, col, a, op = 'source-over') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function skySea(ctx, t, cam, o = {}) {
  const hz = o.horizon || 760;
  applyCam(ctx, cam, .06); drawSky(ctx, o.top || '#3ea6ee', o.bot || '#c9ecfb', -400, hz + 200);
  if (o.sun) { applyCam(ctx, cam, .08); drawSun(ctx, o.sun[0], o.sun[1], o.sun[2], t, o.sunPow || 1); }
  if (o.clouds !== false) { applyCam(ctx, cam, .12); drawCloud(ctx, 160 + t * 6, 260, 120, 1); drawCloud(ctx, 780 + t * 4, 150, 90, 2); drawCloud(ctx, 1080 + t * 5, 430, 70, 3, .9); drawCloud(ctx, -120 + t * 5, 520, 80, 4, .9); }
  applyCam(ctx, cam, o.seaDepth || .4); drawSea(ctx, hz, t, 3200, o.sea);
}
function floorP(ctx, back, c1, c2, lineCol, vx = 540, step = 180, rows = 0, x0 = -2500, x1 = 4500, vy = -700) {
  const bottom = back + 1500;
  ctx.fillStyle = lg(ctx, 0, back, 0, back + 1100, c1, c2); ctx.fillRect(x0, back, x1 - x0, 1800);
  if (lineCol) {
    ctx.strokeStyle = lineCol; ctx.lineWidth = 3; const k = (back - vy) / (bottom - vy);
    for (let bx = Math.floor((vx - 5200) / step) * step; bx < vx + 5200; bx += step) { ctx.beginPath(); ctx.moveTo(vx + (bx - vx) * k, back); ctx.lineTo(bx, bottom); ctx.stroke(); }
    for (let j = 1; j <= rows; j++) { const y = back + Math.pow(j / rows, 1.8) * 1300; line(ctx, x0, y, x1, y, 3, lineCol); }
  }
  ctx.fillStyle = 'rgba(20,10,20,.22)'; ctx.fillRect(x0, back, x1 - x0, 14);
}
function wallP(ctx, back, top, bot, o = {}) {
  const x0 = o.x0 == null ? -2500 : o.x0, x1 = o.x1 == null ? 4500 : o.x1;
  ctx.fillStyle = lg(ctx, 0, -300, 0, back, top, bot); ctx.fillRect(x0, -1400, x1 - x0, back + 1400);
  if (o.wains) { const h = o.wainsH || 230; ctx.fillStyle = o.wains; ctx.fillRect(x0, back - h, x1 - x0, h); ctx.fillStyle = o.trim || 'rgba(0,0,0,.2)'; ctx.fillRect(x0, back - h - 12, x1 - x0, 14); if (o.panels) for (let x = Math.ceil(x0 / 260) * 260; x < x1; x += 260) { rrect(ctx, x + 30, back - h + 34, 200, h - 70, 8); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.18)'; ctx.stroke(); } }
}
function porthole(ctx, x, y, r, t, o = {}) {
  circle(ctx, x, y, r * 1.18); fillStroke(ctx, o.ring || '#d9a441', 5);
  ctx.save(); circle(ctx, x, y, r); ctx.clip();
  ctx.fillStyle = lg(ctx, 0, y - r, 0, y + r, o.sky1 || '#6fc0f0', o.sky2 || '#d8f1fb'); ctx.fillRect(x - r, y - r, r * 2, r * 2);
  const hz = y + r * .2 + Math.sin(t * .8 + x * .01) * r * .12; ctx.fillStyle = o.sea || '#1c9dc0'; ctx.fillRect(x - r, hz, r * 2, r * 2); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fillRect(x - r, hz, r * 2, 3);
  ctx.fillStyle = 'rgba(255,255,255,.28)'; path(ctx, [[x - r, y - r * .2], [x - r * .2, y - r], [x + r * .1, y - r], [x - r, y + r * .2]]); ctx.fill();
  ctx.restore(); circle(ctx, x, y, r); fillStroke(ctx, null, 5);
  for (let i = 0; i < 6; i++) { const a = i * TAU / 6 + .3; circle(ctx, x + Math.cos(a) * r * 1.09, y + Math.sin(a) * r * 1.09, r * .045); ctx.fillStyle = '#8a6420'; ctx.fill(); }
}
function sign(ctx, str, x, y, size, fill, bg, o = {}) {
  ctx.save(); ctx.font = `700 ${size}px Poppins`; const w = ctx.measureText(str).width + size * 1.1;
  if (bg) box(ctx, x - w / 2, y - size * .78, w, size * 1.56, bg, o.lw == null ? 5 : o.lw, size * .28);
  text(ctx, str, x, y + size * .04, size, fill, INK, o.sw || 0); ctx.restore();
}
// ----- the cruise ship, side view. unit: 1000 long, waterline at y = 0, bow to the right -----
function drawCruise(ctx, x, y, s, t, o = {}) {
  const col = c => o.sil ? mix(c, o.sil, o.silAmt == null ? .88 : o.silAmt) : c;
  const inf = o.infect || 0, lit = o.lit || 0;
  let wi = 0; const NW = 190;
  const win = () => { const k = (wi++ * 37 % NW) / NW; return k < inf ? '#9be24a' : (lit ? mix('#6fc3e8', '#ffe08a', lit) : col('#5fb7e2')); };
  ctx.save(); ctx.translate(x, y + Math.sin(t * 1.1) * 3 * s); ctx.rotate(Math.sin(t * .8) * .004); ctx.scale(s * (o.flip || 1), s);
  const lw = 3.2 / Math.max(.6, Math.min(s, 2.2));
  // funnels + smoke
  for (const fx of [-170, -40]) {
    if (!o.noSmoke) for (let i = 0; i < 5; i++) { const k = ((t * .25 + i / 5 + (fx < -100 ? .1 : 0)) % 1); circle(ctx, fx - 10 - k * 240, -372 - k * 110, 14 + k * 40); ctx.fillStyle = o.sil ? `rgba(30,20,50,${.3 * (1 - k)})` : `rgba(245,245,250,${.75 * (1 - k)})`; ctx.fill(); }
    path(ctx, [[fx - 34, -250], [fx - 26, -365], [fx + 30, -365], [fx + 42, -250]]); fillStroke(ctx, col('#e23d32'), lw);
    ctx.fillStyle = col('#1f2c52'); ctx.fillRect(fx - 27, -365, 58, 22); ctx.fillStyle = col('#fbfbf7'); ctx.fillRect(fx - 31, -318, 68, 14);
    path(ctx, [[fx - 34, -250], [fx - 26, -365], [fx + 30, -365], [fx + 42, -250]]); fillStroke(ctx, null, lw);
  }
  // mast + radar
  line(ctx, 215, -280, 215, -372, 5, col('#8b96a3')); ctx.save(); ctx.translate(215, -350); ctx.scale(Math.cos(t * 3), 1); box(ctx, -22, -5, 44, 10, col('#fbfbf7'), lw, 4); ctx.restore();
  path(ctx, [[215, -372], [245 + Math.sin(t * 5) * 3, -364], [215, -356]]); fillStroke(ctx, col('#e23d32'), lw);
  // tiers
  const tiers = [[-455, 365, -100, -142], [-435, 335, -142, -182], [-405, 295, -182, -220], [-365, 235, -220, -254]];
  for (let k = tiers.length - 1; k >= 0; k--) {
    const [x0, x1, yb, yt] = tiers[k];
    path(ctx, [[x0, yb], [x0 + 8, yt], [x1 - 14, yt], [x1 + 10, yb]]); fillStroke(ctx, col(k % 2 ? '#f3f5f7' : '#fbfbf7'), lw);
    for (let wx = x0 + 22; wx < x1 - 24; wx += 24) { ctx.fillStyle = win(); ctx.fillRect(wx, yt + 12, 13, 15); }
    line(ctx, x0 + 6, yt - 7, x1 - 14, yt - 7, 2.2, col('#8b96a3'));
  }
  // bridge
  path(ctx, [[150, -254], [158, -292], [286, -292], [306, -254]]); fillStroke(ctx, col('#fbfbf7'), lw);
  path(ctx, [[166, -262], [170, -284], [282, -284], [294, -262]]); ctx.fillStyle = lit ? mix('#27405f', '#ffe08a', lit * .8) : col('#27405f'); ctx.fill();
  // pool deck umbrellas
  if (!o.sil) for (let i = 0; i < 5; i++) { const ux = -330 + i * 44; line(ctx, ux, -254, ux, -272, 2, '#8b96a3'); ctx.beginPath(); ctx.arc(ux, -270, 14, Math.PI, 0); ctx.closePath(); fillStroke(ctx, ['#ff7a59', '#ffd23a', '#4fc3f7', '#ff7a59', '#ffd23a'][i], 1.5); }
  // hull
  const hull = () => { ctx.beginPath(); ctx.moveTo(-500, -100); ctx.lineTo(400, -100); ctx.lineTo(530, -130); ctx.quadraticCurveTo(505, -40, 455, 26); ctx.lineTo(-470, 26); ctx.quadraticCurveTo(-505, -30, -500, -100); ctx.closePath(); };
  hull(); ctx.fillStyle = col('#fbfbf7'); ctx.fill();
  ctx.save(); hull(); ctx.clip(); ctx.fillStyle = col('#27407a'); ctx.fillRect(-520, -30, 1080, 80); ctx.fillStyle = col('#e23d32'); ctx.fillRect(-520, -37, 1080, 8); ctx.fillStyle = 'rgba(20,30,70,.1)'; ctx.fillRect(-520, -66, 1080, 30);
  for (let px = -468; px < 420; px += 30) { circle(ctx, px, -78, 5.5); ctx.fillStyle = win(); ctx.fill(); }
  ctx.restore(); hull(); fillStroke(ctx, null, lw);
  // lifeboats
  for (let i = 0; i < 7; i++) { const bx = -390 + i * 100; line(ctx, bx + 8, -150, bx + 8, -138, 2, col('#3a3a44')); line(ctx, bx + 52, -150, bx + 52, -138, 2, col('#3a3a44')); box(ctx, bx, -140, 60, 17, col('#ff8a1f'), lw * .8, 7); }
  // foam
  ctx.fillStyle = o.sil ? 'rgba(255,200,170,.35)' : 'rgba(255,255,255,.8)'; ellipse(ctx, 0, 24, 520, 9); ctx.fill(); ellipse(ctx, -560, 24, 130, 6); ctx.fill();
  ctx.restore();
}
// ----- pool deck -----
function umbrella(ctx, x, yTop, r, ground, c1 = '#e0392f', c2 = '#fbfbf7') {
  line(ctx, x, yTop, x, ground, 12, INK); line(ctx, x, yTop, x, ground, 6, '#d9dde2');
  const cy = yTop + r * .5; const shape = () => { ctx.beginPath(); ctx.ellipse(x, cy, r, r * .5, 0, Math.PI, 0); for (let i = 5; i >= 0; i--) ctx.quadraticCurveTo(x - r + (i + .5) * r / 3, cy + r * .1, x - r + i * r / 3, cy); ctx.closePath(); };
  shape(); ctx.fillStyle = c2; ctx.fill(); ctx.save(); shape(); ctx.clip();
  for (let i = 0; i < 6; i += 2) { path(ctx, [[x, yTop - 20], [x - r + i * r / 3, cy + 30], [x - r + (i + 1) * r / 3, cy + 30]]); ctx.fillStyle = c1; ctx.fill(); }
  ctx.fillStyle = 'rgba(40,10,40,.14)'; ctx.fillRect(x + r * .3, yTop - 10, r, r); ctx.restore(); shape(); fillStroke(ctx, null, 6); circle(ctx, x, yTop, 11); fillStroke(ctx, c1, 5);
}
function lounger(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (const lx of [-210, 150]) line(ctx, lx, -70, lx, 0, 12, '#f1f1ee'); for (const lx of [-210, 150]) { line(ctx, lx, -70, lx, 0, 14, INK); line(ctx, lx, -70, lx, 0, 7, '#f6f6f2'); }
  const pts = [[-330, -260], [-210, -78], [190, -78]];
  ctx.lineJoin = 'round'; ctx.lineCap = 'round'; path(ctx, pts, false); ctx.lineWidth = 44; ctx.strokeStyle = INK; ctx.stroke(); path(ctx, pts, false); ctx.lineWidth = 32; ctx.strokeStyle = '#ffcf3f'; ctx.stroke();
  path(ctx, [[-330, -268], [-210, -86], [190, -86]], false); ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.stroke();
  ctx.restore();
}
function palmPot(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-8, -110); ctx.quadraticCurveTo(-30, -300, 10, -470); ctx.lineTo(34, -466); ctx.quadraticCurveTo(0, -300, 22, -110); ctx.closePath(); fillStroke(ctx, '#a8733f', 5);
  for (let i = 0; i < 7; i++) { const a = -2.9 + i * .47 + Math.sin(t * 1.3 + i) * .04, L = 230 - Math.abs(i - 3) * 14; const ex = 20 + Math.cos(a) * L, ey = -470 + Math.sin(a) * L * .8 + 60; ctx.beginPath(); ctx.moveTo(20, -470); ctx.quadraticCurveTo(20 + Math.cos(a) * L * .6, -470 + Math.sin(a) * L - 30, ex, ey); ctx.quadraticCurveTo(20 + Math.cos(a) * L * .5, -470 + Math.sin(a) * L * .5 + 20, 20, -470); fillStroke(ctx, i % 2 ? '#3fa35b' : '#58bd6b', 5); }
  path(ctx, [[-70, -120], [70, -120], [50, 0], [-50, 0]]); fillStroke(ctx, '#d9703f', 5); box(ctx, -80, -138, 160, 28, '#e88453', 5, 8);
  ctx.restore();
}
function setPool(ctx, t, cam) {
  skySea(ctx, t, cam, { horizon: 760, sun: [880, 210, 85], sunPow: 1.1 });
  applyCam(ctx, cam, .62);
  path(ctx, [[-60, 1000], [-20, 330], [250, 330], [300, 1000]]); fillStroke(ctx, '#e23d32', 6); ctx.fillStyle = '#1f2c52'; ctx.fillRect(-22, 330, 274, 90); ctx.fillStyle = '#fbfbf7'; ctx.fillRect(-36, 560, 310, 60); ctx.fillStyle = 'rgba(40,0,30,.16)'; ctx.fillRect(150, 330, 150, 700); path(ctx, [[-60, 1000], [-20, 330], [250, 330], [300, 1000]]); fillStroke(ctx, null, 6);
  for (let i = 0; i < 4; i++) { const k = (t * .12 + i / 4) % 1; circle(ctx, 110 - k * 320, 290 - k * 240, 50 + k * 90); ctx.fillStyle = `rgba(250,250,252,${.8 * (1 - k)})`; ctx.fill(); }
  applyCam(ctx, cam, 1);
  // glass railing
  ctx.fillStyle = 'rgba(205,240,255,.38)'; ctx.fillRect(-900, 862, 3000, 140); for (let x = -900; x < 2100; x += 200) { ctx.fillStyle = 'rgba(255,255,255,.35)'; path(ctx, [[x + 40, 866], [x + 80, 866], [x + 30, 1000], [x - 10, 1000]]); ctx.fill(); box(ctx, x, 850, 14, 152, '#e9eef2', 4, 3); }
  box(ctx, -900, 840, 3000, 20, '#fbfbf8', 5, 8);
  // life ring on the rail
  circle(ctx, 880, 930, 52); fillStroke(ctx, '#fbfbf8', 5); ctx.save(); circle(ctx, 880, 930, 52); ctx.clip(); ctx.fillStyle = '#e0392f'; ctx.fillRect(828, 915, 104, 30); ctx.fillRect(865, 878, 30, 104); ctx.restore(); circle(ctx, 880, 930, 52); fillStroke(ctx, null, 5); circle(ctx, 880, 930, 24); fillStroke(ctx, 'rgba(205,240,255,.9)', 5);
  floorP(ctx, 1000, '#f0d7a8', '#dcb57c', 'rgba(170,120,60,.45)', cam.x, 150, 0);
  // pool
  path(ctx, [[330, 1070], [1700, 1070], [1900, 1300], [200, 1300]]); fillStroke(ctx, '#fbfbf8', 6);
  const water = () => path(ctx, [[356, 1090], [1700, 1090], [1900, 1278], [240, 1278]]);
  water(); ctx.fillStyle = lg(ctx, 0, 1090, 0, 1280, '#39c5e0', '#8fe9f2'); ctx.fill(); ctx.save(); water(); ctx.clip();
  ctx.fillStyle = '#1e9fc2'; ctx.fillRect(200, 1090, 1800, 30);
  ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.lineWidth = 5; ctx.lineCap = 'round'; const R = rng(8);
  for (let i = 0; i < 22; i++) { const x = 300 + R() * 1300 + Math.sin(t * 1.5 + i) * 14, y = 1135 + R() * 130; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 22, y - 9, x + 44, y); ctx.quadraticCurveTo(x + 66, y + 9, x + 88, y); ctx.stroke(); }
  ctx.restore(); water(); fillStroke(ctx, null, 5);
  // pool ladder, float ring, ball
  for (const lx of [430, 490]) { ctx.beginPath(); ctx.moveTo(lx, 1130); ctx.lineTo(lx, 1010); ctx.quadraticCurveTo(lx, 970, lx - 40, 975); ctx.lineWidth = 13; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#dfe6ec'; ctx.stroke(); }
  const fy = 1200 + Math.sin(t * 2) * 5; ellipse(ctx, 800, fy, 78, 30); fillStroke(ctx, '#ff7eb6', 5); ellipse(ctx, 800, fy - 4, 34, 11); fillStroke(ctx, '#39c5e0', 4);
  const by = 1160 + Math.sin(t * 1.7 + 1) * 5; circle(ctx, 1010, by, 36); fillStroke(ctx, '#fbfbf8', 5); ctx.save(); circle(ctx, 1010, by, 36); ctx.clip(); ctx.fillStyle = '#e0392f'; ctx.fillRect(974, by - 40, 26, 80); ctx.fillStyle = '#2f63c9'; ctx.fillRect(1020, by - 40, 30, 80); ctx.restore(); circle(ctx, 1010, by, 36); fillStroke(ctx, null, 5);
}
// ----- buffet / dining room -----
function steam(ctx, x, y, t, n = 3, s = 1) { ctx.save(); ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const k = (t * .5 + i / n) % 1; ctx.globalAlpha = .55 * (1 - k); ctx.beginPath(); const xx = x + (i - (n - 1) / 2) * 26 * s; ctx.moveTo(xx, y - k * 90 * s); ctx.quadraticCurveTo(xx + 16 * s, y - k * 90 * s - 22 * s, xx, y - k * 90 * s - 44 * s); ctx.lineWidth = 7 * s; ctx.strokeStyle = '#fff'; ctx.stroke(); } ctx.restore(); }
function cake(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, 0, 92, 14); fillStroke(ctx, '#dfe6ec', 4); for (const [w, yb, h, c] of [[150, 0, 52, '#f7b6c8'], [108, -52, 46, '#fff3d6'], [68, -98, 40, '#f7b6c8']]) { box(ctx, -w / 2, yb - h, w, h, c, 5, 8); ctx.fillStyle = '#fbfbf8'; for (let i = 0; i < w / 18 - 1; i++) { circle(ctx, -w / 2 + 14 + i * 18, yb - h + 8, 9); ctx.fill(); } } circle(ctx, 0, -150, 13); fillStroke(ctx, '#e0392f', 4); ctx.restore(); }
function turkey(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, 0, 120, 18); fillStroke(ctx, '#dfe6ec', 5); for (const sd of [-1, 1]) { line(ctx, sd * 62, -44, sd * 104, -84, 16, INK); line(ctx, sd * 62, -44, sd * 104, -84, 8, '#fbf3e0'); circle(ctx, sd * 108, -88, 11); fillStroke(ctx, '#fbf3e0', 4); } ellipse(ctx, 0, -46, 86, 52); fillStroke(ctx, '#c9772e', 5); ellipse(ctx, -26, -64, 30, 14, -.3); ctx.fillStyle = 'rgba(255,220,160,.5)'; ctx.fill(); for (const lx of [-70, -40, 40, 70]) { circle(ctx, lx, -6, 12); fillStroke(ctx, lx % 80 ? '#58bd6b' : '#e0392f', 4); } ctx.restore(); }
function fruitBowl(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); for (const [fx, fy, r, c] of [[-40, -66, 26, '#e0392f'], [8, -78, 28, '#ff9a2e'], [48, -62, 24, '#8bc34a'], [-12, -100, 22, '#ffd23a'], [30, -104, 18, '#9c4dcc']]) { circle(ctx, fx, fy, r); fillStroke(ctx, c, 4); } ctx.beginPath(); ctx.moveTo(-84, -60); ctx.quadraticCurveTo(-70, 0, -26, 0); ctx.lineTo(26, 0); ctx.quadraticCurveTo(70, 0, 84, -60); ctx.closePath(); fillStroke(ctx, '#6ec6e8', 5); ctx.restore(); }
function tureen(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); steam(ctx, 0, -120, t, 3); ctx.beginPath(); ctx.moveTo(-80, -70); ctx.quadraticCurveTo(-76, 0, -30, 0); ctx.lineTo(30, 0); ctx.quadraticCurveTo(76, 0, 80, -70); ctx.closePath(); fillStroke(ctx, '#cfd8e0', 5); ctx.beginPath(); ctx.ellipse(0, -72, 86, 36, 0, Math.PI, 0); ctx.closePath(); fillStroke(ctx, '#e6ecf1', 5); circle(ctx, 0, -112, 11); fillStroke(ctx, '#e8c04a', 4); ellipse(ctx, -34, -84, 20, 8, -.3); ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fill(); ctx.restore(); }
function plates(ctx, x, y, n = 6) { for (let i = 0; i < n; i++) { ellipse(ctx, x, y - i * 9, 46, 9); fillStroke(ctx, '#fbfbf8', 3.5); } }
function chandelier(ctx, x, y, s, t) { line(ctx, x, -1400, x, y, 6, '#8a6420'); glow(ctx, x, y + 40 * s, 420 * s, '255,225,150', .45); ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(-120, 0); ctx.quadraticCurveTo(0, 90, 120, 0); ctx.closePath(); fillStroke(ctx, '#e8c04a', 5); for (let i = -2; i <= 2; i++) { line(ctx, i * 54, 4, i * 54, -26, 8, '#fff6cf'); circle(ctx, i * 54, -34, 13); ctx.fillStyle = '#fff3b0'; ctx.fill(); line(ctx, i * 54, 40 - Math.abs(i) * 16, i * 54, 80 - Math.abs(i) * 22, 4, '#bfe9ff'); } ctx.restore(); }
function diningTable(ctx, x, y, s = 1) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ellipse(ctx, 0, 6, 190, 30); ctx.fillStyle = 'rgba(40,10,20,.25)'; ctx.fill(); ctx.beginPath(); ctx.moveTo(-170, -190); ctx.lineTo(170, -190); ctx.lineTo(196, -20); for (let i = 5; i >= 0; i--) ctx.quadraticCurveTo(-196 + (i + .5) * 65.3, 6, -196 + i * 65.3, -20); ctx.closePath(); fillStroke(ctx, '#fbfbf8', 5); ctx.fillStyle = 'rgba(40,40,90,.1)'; ctx.fillRect(70, -188, 110, 170); ellipse(ctx, 0, -190, 170, 30); fillStroke(ctx, '#ffffff', 5); ellipse(ctx, -70, -192, 46, 10); fillStroke(ctx, '#e9eef2', 3.5); ellipse(ctx, 76, -188, 46, 10); fillStroke(ctx, '#e9eef2', 3.5); box(ctx, -8, -236, 16, 44, '#e8c04a', 4, 3); ellipse(ctx, 0, -246, 9, 16); fillStroke(ctx, '#ffb347', 3.5); ctx.restore(); }
function setBuffet(ctx, t, cam) {
  applyCam(ctx, cam, 1);
  wallP(ctx, 1150, '#f3d9a4', '#f8e8c4', { wains: '#b5651d', wainsH: 230, trim: '#8a4b14', panels: true });
  for (let x = -640; x < 2700; x += 430) porthole(ctx, x, 560, 84, t);
  box(ctx, 250, 150, 580, 150, '#c2272d', 6, 30); text(ctx, 'BUFFET', 540, 230, 100, '#ffe08a', INK, 12);
  for (let i = 0; i < 9; i++) { circle(ctx, 280 + i * 65, 162, 9); ctx.fillStyle = (Math.floor(t * 4) + i) % 2 ? '#fff3b0' : '#e8c04a'; ctx.fill(); }
  floorP(ctx, 1150, '#a83246', '#8a2238', 'rgba(255,200,120,.2)', cam.x, 170, 9);
  for (const cx of [-100, 620, 1340, 2060]) chandelier(ctx, cx, 80, 1, t);
  // buffet table
  const x0 = 80, x1 = 1020; ctx.beginPath(); ctx.moveTo(x0, 955); ctx.lineTo(x1, 955); ctx.lineTo(x1, 1180); for (let x = x1; x > x0; x -= 94) ctx.quadraticCurveTo(x - 47, 1206, x - 94, 1180); ctx.closePath(); fillStroke(ctx, '#fbfbf8', 5); ctx.fillStyle = 'rgba(190,60,70,.9)'; ctx.fillRect(x0 + 3, 1060, x1 - x0 - 6, 16);
  box(ctx, x0 - 14, 935, x1 - x0 + 28, 30, '#ffffff', 5, 8);
  turkey(ctx, 250, 935, 1); cake(ctx, 520, 935, 1); tureen(ctx, 740, 935, 1, t); fruitBowl(ctx, 920, 935, .9); plates(ctx, 125, 932, 7);
  // second counter to the right: desserts + drinks
  box(ctx, 1260, 955, 620, 240, '#8a4b14', 5, 6); box(ctx, 1246, 935, 648, 30, '#d9a441', 5, 8);
  for (let i = 0; i < 5; i++) { const gx = 1320 + i * 62; path(ctx, [[gx - 18, 935], [gx - 24, 880], [gx + 24, 880], [gx + 18, 935]]); fillStroke(ctx, ['#ffb347', '#ff7eb6', '#8fe9f2', '#c6f06a', '#ffb347'][i], 4); line(ctx, gx + 6, 880, gx + 16, 850, 4, '#e0392f'); }
  cake(ctx, 1740, 935, .8);
}
// ----- corridor, one-point perspective (camera looks down the hall) -----
function setCorridor(ctx, t, o = {}) {
  const vx = 540, vy = o.vy || 780, f = 540;
  const P = (x, y, z) => [vx + x * f / z, vy + y * f / z];
  const quad = (a, b, c, d, fill, lw = 4) => { path(ctx, [a, b, c, d]); fillStroke(ctx, fill, lw); };
  const HW = 1, CT = -1.25, FL = 1.75, Z0 = .6, Z1 = 9;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#1b1320'; ctx.fillRect(0, 0, W, H);
  quad(P(-HW, CT, Z0), P(HW, CT, Z0), P(HW, CT, Z1), P(-HW, CT, Z1), '#f2ead8', 0);
  quad(P(-HW, FL, Z0), P(HW, FL, Z0), P(HW, FL, Z1), P(-HW, FL, Z1), '#8a2238', 0);
  quad(P(-.55, FL, Z0), P(.55, FL, Z0), P(.55, FL, Z1), P(-.55, FL, Z1), '#b03a48', 0);
  for (const sd of [-1, 1]) { quad(P(sd * HW, CT, Z0), P(sd * HW, CT, Z1), P(sd * HW, FL, Z1), P(sd * HW, FL, Z0), sd < 0 ? '#e9d3a3' : '#dcc491', 0); quad(P(sd * HW, FL - .75, Z0), P(sd * HW, FL - .75, Z1), P(sd * HW, FL, Z1), P(sd * HW, FL, Z0), '#a35b22', 0); line(ctx, ...P(sd * HW, FL - .75, Z0), ...P(sd * HW, FL - .75, Z1), 5, '#7a4014'); line(ctx, ...P(sd * .55, FL, Z0), ...P(sd * .55, FL, Z1), 6, '#e8c04a'); }
  const off = ((o.dolly || 0) % 1.6 + 1.6) % 1.6;
  for (let k = 12; k >= 0; k--) {
    const z = .75 + k * 1.6 * .5 + off * .5; if (z > Z1 || z < Z0) continue; const z2 = z + .42;
    const a = clamp((Z1 - z) / 2);
    ctx.globalAlpha = a;
    // carpet seam + ceiling light
    line(ctx, ...P(-.55, FL, z), ...P(.55, FL, z), 5 / z + 1, 'rgba(255,210,120,.5)');
    if (k % 2 === 0) { quad(P(-.3, CT, z), P(.3, CT, z), P(.3, CT, z + .3), P(-.3, CT, z + .3), '#fff6cf', 3); }
    // doors
    for (const sd of [-1, 1]) { if ((k + (sd > 0 ? 1 : 0)) % 2) continue; quad(P(sd * HW, -.55, z), P(sd * HW, -.55, z2), P(sd * HW, FL, z2), P(sd * HW, FL, z), '#f7f1e4', 4); const [hx, hy] = P(sd * HW, .7, z + .34); circle(ctx, hx, hy, 9 / z + 2); fillStroke(ctx, '#e8c04a', 2); const [nx, ny] = P(sd * HW, -.8, z + .21); circle(ctx, nx, ny, 14 / z + 2); fillStroke(ctx, '#fff3b0', 2); }
    ctx.globalAlpha = 1;
  }
  // far end
  const [ax, ay] = P(-HW, CT, Z1), [bx, by] = P(HW, FL, Z1); box(ctx, ax, ay, bx - ax, by - ay, '#3a2a35', 0);
  const g = ctx.createRadialGradient(vx, vy, 60, vx, vy, 900); g.addColorStop(0, 'rgba(20,10,25,.55)'); g.addColorStop(.35, 'rgba(20,10,25,.12)'); g.addColorStop(1, 'rgba(20,10,25,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  return P;
}
// ----- casino -----
function slotMachine(ctx, x, y, s, t, i = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const c = ['#e0392f', '#2f63c9', '#8e44ad', '#17a6b8', '#e67e22'][i % 5];
  glow(ctx, 0, -330, 260, '255,220,150', .22);
  box(ctx, -95, -430, 190, 430, c, 6, 18); ctx.fillStyle = 'rgba(20,0,40,.2)'; ctx.fillRect(40, -424, 52, 420);
  ctx.beginPath(); ctx.moveTo(-104, -420); ctx.quadraticCurveTo(0, -540, 104, -420); ctx.closePath(); fillStroke(ctx, '#ffd23a', 6);
  for (let k = 0; k < 7; k++) { const a = Math.PI + (k + .5) * Math.PI / 7; circle(ctx, Math.cos(a) * 82, -424 + Math.sin(a) * 78 * .72, 8); ctx.fillStyle = (Math.floor(t * 6) + k + i) % 2 ? '#fff' : '#ff5a4d'; ctx.fill(); }
  text(ctx, '777', 0, -444, 34, '#c2272d', INK, 0);
  box(ctx, -74, -390, 148, 110, '#fbfbf8', 5, 10);
  ctx.save(); rrect(ctx, -74, -390, 148, 110, 10); ctx.clip();
  for (let r = 0; r < 3; r++) { const sp = (t * (3 + r) + i * .37 + r * .3) % 1; const sym = (Math.floor(t * (3 + r) + i + r)) % 3; for (let q = 0; q < 2; q++) { const yy = -335 + (sp + q - 1) * 110, xx = -48 + r * 48, sy = (sym + q) % 3; if (sy === 0) text(ctx, '7', xx, yy, 62, '#e0392f', INK, 5); else if (sy === 1) { circle(ctx, xx - 9, yy + 10, 13); fillStroke(ctx, '#e0392f', 3); circle(ctx, xx + 11, yy + 14, 13); fillStroke(ctx, '#e0392f', 3); line(ctx, xx - 6, yy, xx + 6, yy - 24, 4, '#3fa35b'); } else { box(ctx, xx - 19, yy - 12, 38, 24, '#2b2230', 3, 4); text(ctx, 'BAR', xx, yy + 1, 15, '#ffd23a'); } } if (r) line(ctx, -72 + r * 48, -390, -72 + r * 48, -280, 4); }
  ctx.restore(); box(ctx, -74, -390, 148, 110, null, 5, 10);
  for (let k = 0; k < 3; k++) { circle(ctx, -46 + k * 46, -236, 15); fillStroke(ctx, ['#ffd23a', '#58bd6b', '#ff7eb6'][k], 4); }
  box(ctx, -70, -190, 140, 30, '#2b2230', 5, 8); box(ctx, -84, -86, 168, 44, '#d9dde2', 5, 10);
  for (let k = 0; k < 4; k++) { ellipse(ctx, -40 + k * 26, -52 - (k % 2) * 8, 16, 7); fillStroke(ctx, '#ffd23a', 3); }
  const la = Math.max(0, Math.sin(t * 2.2 + i * 1.7)) * .9; line(ctx, 95, -260, 132, -260, 12, INK); line(ctx, 132, -260, 132 + Math.sin(la) * 30, -260 - Math.cos(la) * 120, 12, INK); line(ctx, 132, -260, 132 + Math.sin(la) * 30, -260 - Math.cos(la) * 120, 5, '#d9dde2'); circle(ctx, 132 + Math.sin(la) * 30, -260 - Math.cos(la) * 120, 19); fillStroke(ctx, '#e0392f', 5);
  ctx.restore();
}
function neon(ctx, str, x, y, size, col, t, ph = 0) { const fl = .8 + .2 * Math.sin(t * 9 + ph) * (Math.sin(t * 2.3 + ph) > .6 ? 1 : .2); ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 50 * fl; text(ctx, str, x, y, size, col, null, 0); text(ctx, str, x, y, size, col, null, 0); ctx.shadowBlur = 0; ctx.globalAlpha = .85; text(ctx, str, x, y, size, '#fff', null, 0); ctx.restore(); }
function chips(ctx, x, y, n, col) { for (let i = 0; i < n; i++) { ellipse(ctx, x, y - i * 9, 26, 9); fillStroke(ctx, col, 3.5); } ellipse(ctx, x, y - (n - 1) * 9, 14, 5); ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.stroke(); }
function ropePost(ctx, x, y, x2) { if (x2 != null) { ctx.beginPath(); ctx.moveTo(x, y - 190); ctx.quadraticCurveTo((x + x2) / 2, y - 100, x2, y - 190); ctx.lineWidth = 22; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 13; ctx.strokeStyle = '#c2272d'; ctx.stroke(); } box(ctx, x - 9, y - 200, 18, 200, '#e8c04a', 5, 5); circle(ctx, x, y - 212, 19); fillStroke(ctx, '#ffd86a', 5); ellipse(ctx, x, y, 36, 11); fillStroke(ctx, '#e8c04a', 5); }
function setCasino(ctx, t, cam) {
  applyCam(ctx, cam, 1);
  wallP(ctx, 1150, '#2c1348', '#5a2a86', { wains: '#2a1242', wainsH: 150, trim: '#e8c04a' });
  for (let x = -700; x < 4600; x += 520) { box(ctx, x, -300, 54, 1310, '#43206b', 4); ctx.fillStyle = '#e8c04a'; ctx.fillRect(x + 6, -300, 6, 1300); ctx.fillRect(x + 42, -300, 6, 1300); path(ctx, [[x - 40, 250], [x + 27, 150], [x + 94, 250], [x + 27, 350]]); fillStroke(ctx, '#e8c04a', 4); }
  for (let x = -600; x < 4600; x += 46) { const yy = 60 + Math.sin(x * .012) * 36; circle(ctx, x, yy, 8); ctx.fillStyle = (Math.floor(t * 3) + x / 46) % 3 < 1 ? '#fff3b0' : '#ffb347'; ctx.fill(); }
  neon(ctx, 'CASINO', 660, 330, 150, '#ff4fa3', t); neon(ctx, 'JACKPOT', 2060, 330, 130, '#ffd23a', t, 2); neon(ctx, 'WIN BIG', 3350, 330, 130, '#4fe3ff', t, 4);
  floorP(ctx, 1150, '#b01630', '#7d0f24', 'rgba(255,200,90,.28)', cam.x, 150, 10);
  for (let i = 0; i < 17; i++) { const x = -330 + i * 262; if (i % 6 === 5) { box(ctx, x - 90, 760, 180, 390, '#3a1d5c', 5, 90); box(ctx, x - 70, 790, 140, 360, '#12081f', 5, 70); continue; } slotMachine(ctx, x, 1160, 1, t, i); }
  for (const cx of [140, 1400, 2700, 3900]) chandelier(ctx, cx, 20, .9, t);
}
function casinoFG(ctx, t, cam) {
  applyCam(ctx, cam, 1.35);
  for (let x = -200; x < 4000; x += 620) ropePost(ctx, x, 1830, x + 620);
  // card table with chips
  for (const tx of [900, 2500]) { ellipse(ctx, tx, 1800, 330, 70); fillStroke(ctx, '#6b3a1c', 6); ellipse(ctx, tx, 1786, 300, 58); fillStroke(ctx, '#1f8a4c', 5); chips(ctx, tx - 150, 1790, 6, '#e0392f'); chips(ctx, tx - 90, 1800, 4, '#2f63c9'); chips(ctx, tx + 130, 1792, 7, '#ffd23a'); for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(tx + i * 40 - 10, 1770); ctx.rotate(-.3 + i * .25); box(ctx, -20, -30, 40, 16, '#fbfbf8', 3, 3); ctx.restore(); } }
}
// ----- grand staircase (side view, climbing to the right) -----
const STAIR = { x0: 150, y0: 1640, n: 8, w: 84, h: 84 };
function stairPt(k) { return [STAIR.x0 + k * STAIR.w, STAIR.y0 - k * STAIR.h]; }
function setStairs(ctx, t, cam) {
  applyCam(ctx, cam, 1);
  wallP(ctx, 1640, '#1f5a5e', '#2e7f84', { wains: '#17474a', wainsH: 260, trim: '#e8c04a' });
  for (let x = -800; x < 2200; x += 300) { ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(x, -600, 150, 1980); }
  // paintings + sign
  for (const [px, py, w, h, c] of [[200, 420, 260, 200, '#6fc0f0'], [560, 250, 200, 250, '#ffb347'], [-140, 250, 220, 260, '#c6a0e8']]) { box(ctx, px - 16, py - 16, w + 32, h + 32, '#e8c04a', 5, 6); box(ctx, px, py, w, h, c, 4); ctx.save(); rrect(ctx, px, py, w, h, 0); ctx.clip(); ctx.fillStyle = '#1c9dc0'; ctx.fillRect(px, py + h * .62, w, h); circle(ctx, px + w * .7, py + h * .3, 26); ctx.fillStyle = '#fff6c4'; ctx.fill(); path(ctx, [[px + w * .3, py + h * .62], [px + w * .45, py + h * .3], [px + w * .6, py + h * .62]]); ctx.fillStyle = '#fbfbf8'; ctx.fill(); ctx.restore(); }
  sign(ctx, 'DECK 5', 960, 560, 54, '#1f2c52', '#fbfbf8'); for (const lx of [-40, 820]) { glow(ctx, lx, 700, 300, '255,225,150', .35); path(ctx, [[lx - 34, 700], [lx + 34, 700], [lx + 20, 640], [lx - 20, 640]]); fillStroke(ctx, '#fff3b0', 5); box(ctx, lx - 8, 700, 16, 40, '#e8c04a', 4); }
  floorP(ctx, 1640, '#e9e2d4', '#cfc5b2', 'rgba(120,100,80,.35)', cam.x, 190, 7);
  const { x0, y0, n, w, h } = STAIR, topX = x0 + n * w, topY = y0 - n * h;
  // stair body
  const pts = [[x0, y0]]; for (let k = 0; k < n; k++) { pts.push([x0 + k * w, y0 - (k + 1) * h]); pts.push([x0 + (k + 1) * w, y0 - (k + 1) * h]); } pts.push([2400, topY], [2400, y0 + 40], [x0, y0 + 40]);
  path(ctx, pts); fillStroke(ctx, '#7a4a2c', 6);
  ctx.save(); path(ctx, pts); ctx.clip(); ctx.fillStyle = 'rgba(20,0,10,.22)'; ctx.fillRect(x0, topY + 150, 2400, 900); for (let x = x0 + 80; x < 2400; x += 220) { rrect(ctx, x, topY + 190, 160, 500, 8); ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(0,0,0,.2)'; ctx.stroke(); } ctx.restore();
  // red carpet treads
  for (let k = 0; k < n; k++) { box(ctx, x0 + k * w - 4, y0 - (k + 1) * h - 8, w + 10, 20, '#c2272d', 4, 6); ctx.fillStyle = '#e8c04a'; ctx.fillRect(x0 + k * w + 2, y0 - (k + 1) * h + 8, w - 2, 5); }
  box(ctx, topX - 4, topY - 8, 1700, 20, '#c2272d', 4, 6);
}
function stairRail(ctx) {
  const { x0, y0, n, w, h } = STAIR, topX = x0 + n * w, topY = y0 - n * h;
  for (let k = 0; k < n; k++) { const bx = x0 + k * w + w / 2, by = y0 - (k + 1) * h; line(ctx, bx, by, bx, by - 200, 9, INK); line(ctx, bx, by, bx, by - 200, 4, '#e8c04a'); }
  for (let x = topX + 60; x < 2400; x += 90) { line(ctx, x, topY, x, topY - 200, 9, INK); line(ctx, x, topY, x, topY - 200, 4, '#e8c04a'); }
  const rail = [[x0 - 30, y0 - 190], [x0 + 20, y0 - 240], [topX, topY - 240 + 30], [topX + 50, topY - 205], [2400, topY - 205]];
  ctx.lineJoin = 'round'; path(ctx, rail, false); ctx.lineWidth = 26; ctx.strokeStyle = INK; ctx.stroke(); path(ctx, rail, false); ctx.lineWidth = 15; ctx.strokeStyle = '#8a4b14'; ctx.stroke();
  box(ctx, x0 - 50, y0 - 250, 40, 250, '#8a4b14', 5, 8); circle(ctx, x0 - 30, y0 - 270, 30); fillStroke(ctx, '#e8c04a', 5);
}
