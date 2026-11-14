// ---------- "Zombie apocalypse at a theme park", part 4: one seat ----------
// base.js (part 2) and base3.js (part 3) supply the shared helpers; this file replaces their shot lists
SHOTS.length = 0;
window.HL = { four: 'y', helicopter: 'y', seat: 'r', cable: 'y', rotor: 'r', infected: 'r', back: 'r', "can't": 'r', climb: 'r', pile: 'r', stack: 'r', ten: 'y', twenty: 'y', thirty: 'r', gus: 'y', kid: 'y', knees: 'r', run: 'r', first: 'y', harness: 'y', complains: 'r', pickles: 'y', goose: 'y', "doesn't": 'r', pilot: 'y', fuel: 'r', forty: 'y', minutes: 'y', leaves: 'y', noise: 'y', sixty: 'r', foot: 'r', minute: 'r', hub: 'y', hundred: 'y', feet: 'y', pocket: 'y', remote: 'y', nora: 'y' };
const W4 = wheelRot(STOP, STOP), FT = 8, LEGX = WX + WR * .62;
function pile(ctx, x, ground, feet, t, seed = 3) {
  const h = feet * FT, R = rng(seed), rows = Math.max(1, Math.round(h / 44)), items = [];
  for (let r = 0; r < rows; r++) { const y = ground - 20 - r * 44, wdt = (1 - r / (rows + .6)) * h * .62 + 40, n = Math.max(1, Math.round(wdt / 52)); for (let i = 0; i < n; i++) items.push([x + (i - (n - 1) / 2) * 56 + (R() - .5) * 26 - r * 6, y + (R() - .5) * 14, 30 + R() * 8, R() < .6, R() * 6, r === rows - 1]); }
  ctx.beginPath(); ctx.moveTo(x - h * .36 - 60, ground + 10); ctx.quadraticCurveTo(x - h * .12, ground - h * .9, x - rows * 6, ground - h + 8); ctx.quadraticCurveTo(x + h * .14, ground - h * .8, x + h * .34 + 60, ground + 10); ctx.closePath(); ctx.fillStyle = '#0d0a14'; ctx.fill();
  for (const [ix, iy, r, eyes, ph, top] of items) { const wob = Math.sin(t * 3 + ph) * 3; if (top) for (const sd of [-1, 1]) line(ctx, ix + sd * 16, iy, ix + sd * (30 + Math.sin(t * 5 + ph) * 8), iy - 62, 13, '#14101c'); circle(ctx, ix + wob, iy, r); ctx.fillStyle = eyes ? '#17131f' : '#110e18'; ctx.fill(); if (eyes) for (const sd of [-1, 1]) { circle(ctx, ix + wob + sd * 10, iy - 2, 4.5); ctx.fillStyle = '#fff'; ctx.fill(); } }
  for (let i = 0; i < Math.min(14, rows * 2); i++) { const ix = x + (R() - .5) * h * .5, iy = ground - R() * h * .7; glow(ctx, ix, iy, 34, '255,255,255', .25); }
}
function scaleFt(ctx, x, ground, feet, marks) { ctx.setLineDash([14, 12]); line(ctx, x, ground, x, ground - feet * FT, 5, CREAM); ctx.setLineDash([]); for (const m of marks) { if (m > feet + .5) continue; line(ctx, x - 22, ground - m * FT, x + 22, ground - m * FT, 5, CREAM); text(ctx, `${m} FT`, x + 34, ground - m * FT, 40, CREAM, null, 0, 'Bebas', 400, 'left'); } }
function hub4(ctx, t, o = {}) {
  box(ctx, WX - 120, WY - 20, 240, 26, '#4a4470', 8); for (const sd of [-1, 1]) line(ctx, WX + sd * 110, WY - 20, WX + sd * 110, WY - 90, 7, '#8f8ab8'); line(ctx, WX - 110, WY - 90, WX + 110, WY - 90, 7, '#8f8ab8');
  const sit = { L: [-1.2, 1.3], R: [1.3, -1.3] };
  if (o.nora !== false) guy(ctx, C(NORA, Object.assign({ x: WX - 62, y: WY + 44, s: 170, shadow: false, legs: sit, arms: { L: [.5, -.4], R: [.5, -.4] } }, o.nora || {})));
  if (o.gus) guy(ctx, C(GUS, Object.assign({ x: WX + 44, y: WY + 44, s: 170, shadow: false, legs: sit, arms: { L: [.5, -.4], R: [.5, -.4] } }, o.gus)));
  if (o.goose) goose(ctx, WX + 128, WY - 92, 90, t, { flip: -1 });
}
function scene4(ctx, t, cam, o = {}) { park(ctx, t, cam); applyCam(ctx, cam, 1); ferris(ctx, WX, WY, WR, W4, { t, n: N, lit: 1 }); booth(ctx, 1010, GROUND, 1, N, .85); if (o.pile) pile(ctx, LEGX, GROUND, o.pile, t); }
const rotorArcs = (ctx, x, y, t, a = .7) => { for (let i = 0; i < 3; i++) { const k = (t * 1.8 + i / 3) % 1; ctx.beginPath(); ctx.arc(x, y, 120 + k * 420, .5, Math.PI - .5); ctx.lineWidth = 14; ctx.strokeStyle = `rgba(255,197,58,${(1 - k) * a})`; ctx.stroke(); } };

// 1 — title
SHOTS.push({ start: 0, end: 3.3, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 4), cam = { x: 540 + hh[0], y: kf(lt, [[0, 560], [3.3, 500]]) + hh[1], z: kf(lt, [[0, .8], [3.3, .88]]), r: 0 };
  scene4(ctx, t, cam); hub4(ctx, t, { gus: {}, goose: true });
  chopper(ctx, 560 + Math.sin(t) * 16, -230 + Math.sin(t * 2) * 10, 1.15, t); tinyCrowd(ctx, t, -400, 1500, 1500, 30, { s: 80, dy: 160, sp: 60, inf: 1, seed: 5 });
  vignette(ctx, .6); titleTags(ctx, lt, 'PART 4', 'DAY 1 · 8:34 PM');
} });
// 2 — one seat, one cable
SHOTS.push({ start: 3.3, end: 7.55, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 4), cam = { x: 540 + hh[0], y: kf(lt, [[0, 180], [4.25, 380]]) + hh[1], z: kf(lt, [[0, 1.25], [4.25, 1.5]]), r: 0 };
  scene4(ctx, t, cam);
  hub4(ctx, t, { nora: { arms: { L: [2.5, .3], R: [2.6 + Math.sin(t * 9) * .2, .3] }, face: { eyes: 'wide', mouth: 'o', look: [0, -1] } }, gus: { face: { eyes: 'wide', mouth: 'flat', look: [0, -1] } }, goose: true });
  const cx = 560 + Math.sin(t) * 14, cy = -160 + Math.sin(t * 2) * 8, low = kf(lt, [[.8, 0], [4.0, 1]], ease);
  line(ctx, cx, cy + 60, cx + Math.sin(t * 2.2) * 14 * low, cy + 60 + low * 560, 5, '#d9dde2'); const hy = cy + 60 + low * 560, hx = cx + Math.sin(t * 2.2) * 14 * low; path(ctx, [[hx - 30, hy], [hx + 30, hy], [hx + 18, hy + 54], [hx - 18, hy + 54]]); ctx.lineWidth = 9; ctx.strokeStyle = '#e8872a'; ctx.lineJoin = 'round'; ctx.closePath(); ctx.stroke();
  chopper(ctx, cx, cy, 1.25, t);
  vignette(ctx, .6);
  pill(ctx, 540, 250, 'SEATS: 1', { size: 54, k: (lt - 2.4) * 5, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
  pill(ctx, 540, 345, 'CABLE: 1', { size: 46, k: (lt - 3.35) * 5 });
} });
// 3 — the rotor pulls them all back
SHOTS.push({ start: 7.55, end: 11.4, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 5), cam = { x: kf(lt, [[0, 900], [3.85, 700]]) + hh[0], y: 1240 + hh[1], z: kf(lt, [[0, .95], [3.85, 1.08]]), r: 0 };
  scene4(ctx, t, cam, { pile: 3 });
  tinyCrowd(ctx, t, -300, 2200, 1500, 110, { s: 92, dy: 200, sp: 150, inf: 1, seed: 8, dir: -1 });
  for (let i = 0; i < 5; i++) infected(ctx, 1700 - lt * 250 - i * 190, GROUND + 60 + (i % 2) * 70, 330 + (i % 3) * 30, t, { ph: i, sp: 5, dir: -1 });
  ui(ctx, () => rotorArcs(ctx, 400, 60, t)); tint(ctx, '#d8392b', kf(lt, [[0, 0], [2.5, .22]]), 'overlay'); vignette(ctx, .65);
  pill(ctx, 540, 250, `COMING BACK: ${Math.round(lerp(40, 400, clamp(lt / 2.4)))}+`, { size: 46, k: lt * 4, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 4 — rule #1 never said they can't pile
SHOTS.push({ start: 11.4, end: 16.1, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: 700 + hh[0], y: 1240 + hh[1], z: 1.08, r: 0 };
  scene4(ctx, t, cam, { pile: 3 + lt }); tinyCrowd(ctx, t, -300, 2200, 1500, 110, { s: 92, dy: 200, sp: 150, inf: 1, seed: 8, dir: -1 });
  tint(ctx, '#120a1c', .5); vignette(ctx, .6);
  const p2 = lt > 3.6;
  ruleCard(ctx, 540, 640, 'RULE #1', "THEY CAN'T CLIMB.", p2 ? 'BUT THEY CAN PILE.' : '', (lt - .08) * 5, { w: 880, h: 400, size: 116, size2: 100 });
  if (p2) tint(ctx, '#d8392b', .12, 'overlay');
} });
// 5 — ten feet, twenty, thirty
SHOTS.push({ start: 16.1, end: 20.5, tr: 'cut', draw(ctx, lt, t) {
  const ft = kf(lt, [[0, 6], [2.1, 10], [3.2, 20], [3.9, 30], [4.4, 32]]), hh = handheld(t, 3 + ft * .08);
  const cam = { x: 820 + hh[0], y: kf(lt, [[0, 1330], [4.4, 1230]]) + hh[1], z: kf(lt, [[0, 1.6], [4.4, 1.25]]), r: 0 };
  scene4(ctx, t, cam, { pile: ft }); tinyCrowd(ctx, t, 300, 1700, 1510, 40, { s: 90, dy: 150, sp: 90, inf: 1, seed: 8, dir: -1 });
  scaleFt(ctx, 1060, GROUND, ft, [10, 20, 30]);
  tint(ctx, '#d8392b', .18, 'overlay'); vignette(ctx, .65);
  pill(ctx, 540, 250, `PILE: ${Math.round(ft)} FT`, { size: 56, k: lt * 4, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 6 — the kid goes / his knees
SHOTS.push({ start: 20.5, end: 24.1, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), kn = lt > 2.3, cam = { x: kf(lt, [[0, 540], [2.2, 540], [2.7, 590]]) + hh[0], y: kf(lt, [[0, 600], [2.2, 600], [2.7, 660]]) + hh[1], z: kf(lt, [[0, 3.0], [2.2, 3.1], [2.7, 4.2]], ease), r: 0 };
  scene4(ctx, t, cam);
  hub4(ctx, t, { nora: { face: { eyes: 'dot', mouth: 'flat', look: kn ? [1, 1] : [1, 0], browAng: kn ? -.2 : 0 } }, goose: true,
    gus: { armLen: 1.15, arms: { L: { ik: [-.3, -.66] }, R: [2.7, .2] }, legs: { L: [-1.2 + Math.sin(t * 34) * .06, 1.3], R: [1.3 + Math.sin(t * 34 + 1) * .06, -1.3] }, face: { eyes: 'dot', mouth: lt < 1.5 && Math.sin(t * 14) > 0 ? 'o' : 'flat', look: [-1, 0], browAng: .2 } } });
  if (kn) for (const sd of [-1, 1]) for (let i = 0; i < 2; i++) line(ctx, WX + 44 + sd * (30 + i * 8), WY + 6 + i * 10, WX + 44 + sd * (40 + i * 8), WY + 2 + i * 10, 2.5, CREAM);
  vignette(ctx, .6);
  pill(ctx, 540, 250, kn ? 'KNEES: 61 YEARS OLD' : '"THE KID GOES."', { size: 44, k: kn ? (lt - 2.3) * 5 : lt * 4, dot: kn ? '#ff5a4d' : '#ffc53a' });
} });
// 7 — rule #5
SHOTS.push({ start: 24.1, end: 27.8, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: 590 + hh[0], y: 700 + hh[1], z: kf(lt, [[0, 1.3], [3.7, 1.15]]), r: 0 };
  scene4(ctx, t, cam, { pile: 34 }); hub4(ctx, t, { gus: {}, goose: true }); tint(ctx, '#120a1c', .5); vignette(ctx, .6);
  ruleCard(ctx, 540, 640, 'RULE #5', "THE ONE WHO CAN'T RUN,", lt > 2.55 ? 'GOES FIRST.' : '', (lt - .08) * 5, { w: 920, h: 420, size: 96, size2: 140 });
} });
// 8 — into the harness, complaining the whole way up
const harness = (c, tw, tTop) => { GUS.deco(c, tw, tTop); c.strokeStyle = '#e8872a'; c.lineWidth = .028; c.beginPath(); c.moveTo(-tw / 2, tTop + .04); c.lineTo(tw / 2, tTop + .34); c.moveTo(tw / 2, tTop + .04); c.lineTo(-tw / 2, tTop + .34); c.stroke(); c.fillStyle = '#e8872a'; c.fillRect(-tw, tTop + .3, tw * 2, .035); };
SHOTS.push({ start: 27.8, end: 31.75, tr: 'cut', draw(ctx, lt, t) {
  const up = kf(lt, [[1.2, 0], [3.95, 1]], ease), gy = WY - 40 - up * 520, gx = WX + 44 + Math.sin(t * 2) * 10 * up, hh = handheld(t, 3);
  const cam = { x: 560 + hh[0], y: gy - 30 + hh[1], z: kf(lt, [[0, 3.0], [3.95, 2.2]]), r: 0 };
  scene4(ctx, t, cam, { pile: 38 });
  hub4(ctx, t, { nora: { armLen: 1.2, arms: up > 0 ? { L: [.5, -.4], R: [2.6 + Math.sin(t * 9) * .2, .3] } : { L: [.5, -.4], R: { ik: [.5, -.6], bend: -1 } }, face: { eyes: 'dot', mouth: 'smile', look: [1, -1] } } });
  line(ctx, gx, gy - 150, gx + 6, -900, 4, '#d9dde2');
  guy(ctx, C(GUS, { x: gx, y: gy + 84, s: 170, shadow: false, deco: harness, lean: Math.sin(t * 2) * .06 * up, legs: up > 0 ? { L: [.25 + Math.sin(t * 5) * .15, -.3], R: [.25 - Math.sin(t * 5) * .15, -.3] } : { L: [-1.2, 1.3], R: [1.3, -1.3] }, arms: { L: { ik: [-.03, -.95] }, R: { ik: [.03, -.95], bend: -1 } }, armLen: 1.2, face: { eyes: 'closed', mouth: Math.sin(t * 13) > -.2 ? 'open' : 'flat', browAng: .35 } }));
  if (up > 0) flyGoose(ctx, gx + 90 + Math.sin(t * 3) * 14, gy - 40 + Math.cos(t * 3) * 12, 110, t, { flip: -1, honk: Math.max(0, Math.sin(t * 9)) });
  if (up > .1) ui(ctx, () => { for (let i = 0; i < 3; i++) { const k = ((t * .9 + i / 3) % 1); ctx.globalAlpha = 1 - k; text(ctx, ['"MY BACK."', '"TOO HIGH."', '"I HATE THIS."'][i], 800 + i * 10, 860 - k * 200 - i * 90, 44, CREAM, 'rgba(12,8,14,.8)', 8, 'Bebas', 400); } });
  vignette(ctx, .6);
  pill(ctx, 540, 250, 'WINCH: GOING UP', { size: 44, k: (lt - 1.2) * 4, dot: '#7dff8a' });
} });
// 9 — a goose doesn't count as a seat
SHOTS.push({ start: 31.75, end: 35.5, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), sw = Math.sin(t * 1.6) * 14; ctx.setTransform(1, 0, 0, 1, hh[0] + sw, hh[1]);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#070818', '#12143a', '#2a2050'); ctx.fillRect(-80, -80, W + 160, H + 160);
  const R = rng(4); for (let i = 0; i < 26; i++) { const c = ['255,214,120', '255,120,110', '120,230,255', '255,255,255'][i % 4]; glow(ctx, R() * 1100, 900 + R() * 1100 + ((t * 120) % 300), 60 + R() * 100, c, .2); }
  line(ctx, 540, 1000, 560, -100, 14, '#d9dde2');
  guy(ctx, C(GUS, { x: 540, y: 2420, s: 1650, shadow: false, deco: harness, face: { eyes: 'dot', mouth: 'flat', look: [0, -1], browAng: .3 } }));
  goose(ctx, 560, 850, 520, t, { flip: -1, honk: Math.max(0, Math.sin(t * 2.4)) * (lt > 1.0 ? 1 : 0), neck: .2 + Math.sin(t * 1.4) * .2 });
  honkTxt(ctx, 250, 420, (lt - 1.2) * 1.1, -.12, 120);
  vignette(ctx, .6);
  pill(ctx, 540, 190, 'PASSENGERS: 1', { size: 44, k: lt * 4 }); pill(ctx, 540, 275, 'GEESE: DO NOT COUNT', { size: 44, k: (lt - 1.75) * 4, dot: '#7dff8a' });
} });
// 10 — out of fuel, back in forty minutes
SHOTS.push({ start: 35.5, end: 40.3, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 4), talk = lt > 1.9 && lt < 4.7; ctx.setTransform(1.06, 0, 0, 1.06, -32 + hh[0], -56 + hh[1]);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#2a1420', '#140a12'); ctx.fillRect(-80, -80, W + 160, H + 160); glow(ctx, 900, 200, 900, ['255,214,120', '255,120,110', '120,230,255'][Math.floor(t * 2) % 3], .18);
  radioBig(ctx, t, lt > .3, talk); vignette(ctx, .7);
  pill(ctx, 540, 190, 'PILOT · CH 4', { k: lt * 5, size: 42, dot: '#ff5a4d' });
  pill(ctx, 540, 275, 'FUEL: OUT', { k: (lt - 2.5) * 5, size: 50, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
  pill(ctx, 540, 368, 'BACK IN 40:00', { k: (lt - 3.7) * 5, size: 50 });
} });
// 11 — the helicopter leaves, and the noise with it
SHOTS.push({ start: 40.3, end: 43.6, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2); ctx.setTransform(1, 0, 0, 1, hh[0], hh[1]);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#060716', '#0d1030', '#1a1c48'); ctx.fillRect(-50, -50, W + 100, H + 100);
  const R = rng(5); for (let i = 0; i < 80; i++) { circle(ctx, R() * W, R() * 1300, 1.5 + R() * 2.5); ctx.fillStyle = `rgba(240,240,255,${.3 + .4 * Math.sin(t * 2 + i) ** 2})`; ctx.fill(); }
  for (const [cx, cy, w] of [[200, 520, 380], [860, 760, 340], [500, 1050, 420]]) { ctx.fillStyle = '#141a3c'; ellipse(ctx, cx + t * 5, cy, w, 34); ctx.fill(); }
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(-50, 1560, W + 100, 500); for (let i = 0; i < 26; i++) { const a = i * TAU / 26; circle(ctx, 190 + Math.sin(a) * 150, 1640 + Math.cos(a) * 150, 7); ctx.fillStyle = ['#ffd678', '#ff786e', '#78e6ff', '#fff'][i % 4]; ctx.fill(); } glow(ctx, 190, 1640, 420, '255,200,140', .3);
  const k = clamp(lt / 3.3), s = lerp(1.5, .16, easeOut(k)); ctx.save(); ctx.translate(lerp(520, 930, k), lerp(700, 330, easeOut(k))); ctx.scale(-1, 1); chopper(ctx, 0, 0, s, t); ctx.restore();
  vignette(ctx, .6);
  pill(ctx, 540, 190, 'BACK IN 39:58', { size: 46, k: lt * 4 }); pill(ctx, 540, 275, 'NOISE: GONE', { size: 46, k: (lt - 1.7) * 4, dot: '#7dff8a' });
} });
// 12 — but the pile doesn't
SHOTS.push({ start: 43.6, end: 45.4, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: kf(lt, [[0, 560], [1.5, 800]], ease) + hh[0], y: kf(lt, [[0, 720], [1.5, 1180]], ease) + hh[1], z: kf(lt, [[0, 1.9], [1.5, 1.2]], ease), r: 0 };
  scene4(ctx, t, cam, { pile: 60 }); hub4(ctx, t, { nora: { face: { eyes: 'wide', mouth: 'wavy', look: [1, 1], browUp: 1 } } });
  tint(ctx, '#d8392b', kf(lt, [[.3, 0], [1.5, .26]]), 'overlay'); vignette(ctx, .7);
} });
// 13 — sixty feet, one foot a minute, the hub at a hundred
SHOTS.push({ start: 45.4, end: 51.0, tr: 'cut', draw(ctx, lt, t) {
  const [cx, cy, R] = wheelDiagram(ctx, t, Math.PI + .5, { title: 'THE PILE · SIDE VIEW' }), g = cy + R + 150, f = 4.8, ft = 60 + lt * .5, px = cx + 210;
  ctx.beginPath(); ctx.moveTo(px - 200, g); ctx.quadraticCurveTo(px - 40, g - ft * f * 1.05, px - 10, g - ft * f); ctx.quadraticCurveTo(px + 60, g - ft * f * .7, px + 190, g); ctx.closePath(); ctx.fillStyle = '#a02a22'; ctx.fill();
  const Rr = rng(6); for (let i = 0; i < 40; i++) { const u = Rr(), v = Rr() * (1 - Math.abs(u - .5) * 1.7); if (v < 0) continue; circle(ctx, px - 180 + u * 350, g - 10 - v * ft * f * .85, 9); ctx.fillStyle = '#6a1a16'; ctx.fill(); }
  ctx.setLineDash([12, 10]); line(ctx, px + 250, g, px + 250, g - ft * f, 6, '#2a2226'); ctx.setLineDash([]); line(ctx, px + 228, g - ft * f, px + 272, g - ft * f, 6, '#2a2226'); line(ctx, px - 20, g - ft * f, px + 250, g - ft * f, 3, 'rgba(42,34,38,.4)');
  text(ctx, '60 FT', px + 262, g - ft * f * .5, 70, RED, null, 0, 'Bebas', 400, 'right');
  const k2 = clamp((lt - 1.9) * 4); if (k2 > 0) { const ay = g - ft * f - 40 - ((t * 60) % 30); line(ctx, px - 10, ay + 60, px - 10, ay, 14, RED); path(ctx, [[px - 36, ay + 6], [px + 16, ay + 6], [px - 10, ay - 34]]); ctx.fillStyle = RED; ctx.fill(); ui(ctx, () => { ctx.translate(250, 560); ctx.scale(backOut(k2), backOut(k2)); box(ctx, -170, -44, 340, 88, RED, 12); text(ctx, '+1 FT / MIN', 0, 4, 60, CREAM, null, 0, 'Bebas', 400); }); }
  const k3 = clamp((lt - 3.7) * 4); if (k3 > 0) { ctx.setLineDash([16, 12]); line(ctx, 90, cy, 990, cy, 6, '#2f8f55'); ctx.setLineDash([]); circle(ctx, cx, cy, 44 + Math.sin(t * 7) * 5); ctx.fillStyle = '#3fa35b'; ctx.fill(); ui(ctx, () => { ctx.translate(540, 470); ctx.scale(backOut(k3), backOut(k3)); box(ctx, -250, -44, 500, 88, '#2f8f55', 12); text(ctx, 'HUB · NORA · 100 FT', 0, 4, 56, CREAM, null, 0, 'Bebas', 400); }); } else { circle(ctx, cx, cy, 40); ctx.fillStyle = '#4a3f66'; ctx.fill(); }
  vignette(ctx, .35);
} });
// 14 — forty feet, forty minutes
SHOTS.push({ start: 51.0, end: 53.6, tr: 'cut', draw(ctx, lt, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0f0d18'; ctx.fillRect(0, 0, W, H); glow(ctx, 540, 760, 800, '216,57,43', .16 + .06 * Math.sin(t * 6));
  const num = (s, sub, y, col, t0) => { const k = clamp((lt - t0) / .14); if (k <= 0) return; ctx.save(); ctx.translate(540, y); ctx.scale(1.5 - .5 * easeOut(k), 1.5 - .5 * easeOut(k)); ctx.globalAlpha = k; text(ctx, s, 0, 0, 300, col, null, 0, 'Bebas', 400); text(ctx, sub, 0, 170, 46, 'rgba(243,234,216,.6)', null, 0, 'Bebas', 400); ctx.restore(); };
  num('40 FT', 'BETWEEN THE PILE AND THE HUB', 480, '#ff4b3a', .12); num('40 MIN', 'UNTIL THE HELICOPTER IS BACK', 900, '#ffc53a', 1.02);
  vignette(ctx, .55);
} });
// 15 — she still has the remote
SHOTS.push({ start: 53.6, end: 56.9, tr: 'cut', draw(ctx, lt, t) {
  const rise = kf(lt, [[.2, 900], [1.2, 0, backOut]]), hv = kf(lt, [[1.9, 0], [2.5, 1]], ease), hh = handheld(t, 2), pu = .6 + .4 * Math.sin(t * 7);
  ctx.setTransform(1, 0, 0, 1, hh[0], hh[1]); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#0a0b20', '#1a1848'); ctx.fillRect(-50, -50, W + 100, H + 100);
  for (let i = 0; i < 12; i++) { const c = ['255,214,120', '255,120,110', '120,230,255'][i % 3]; glow(ctx, 80 + i * 97, 300 + Math.sin(i * 2.3) * 220, 150, c, .2); }
  ctx.translate(0, rise);
  for (let i = 0; i < 4; i++) box(ctx, 250, 820 + i * 112, 170, 96, '#b57a52', 46);
  box(ctx, 330, 440, 420, 900, '#e2a62b', 60); ctx.fillStyle = 'rgba(60,20,0,.18)'; rrect(ctx, 600, 440, 150, 900, [0, 60, 60, 0]); ctx.fill(); box(ctx, 360, 470, 360, 840, 'rgba(0,0,0,.08)', 44);
  glow(ctx, 540, 600, 300, '125,255,138', .5 * pu * (lt > 1.3 ? 1 : 0)); circle(ctx, 540, 600, 110); ctx.fillStyle = '#2a2226'; ctx.fill(); circle(ctx, 540, 600, 92); ctx.fillStyle = mix('#2f8f55', '#7dff8a', lt > 1.3 ? pu * .6 : 0); ctx.fill(); path(ctx, [[540, 548], [592, 640], [488, 640]]); ctx.fillStyle = CREAM; ctx.fill();
  circle(ctx, 540, 930, 140); ctx.fillStyle = '#2a2226'; ctx.fill(); circle(ctx, 540, 930, 118); ctx.fillStyle = '#8a1c16'; ctx.fill(); text(ctx, 'STOP', 540, 936, 90, 'rgba(243,234,216,.6)', null, 0, 'Bebas', 400);
  text(ctx, 'WHEEL CONTROL', 540, 1190, 54, '#2a2226', null, 0, 'Bebas', 400);
  ctx.save(); ctx.translate(lerp(960, 700, hv), lerp(1050, 700, hv)); ctx.rotate(-.75); box(ctx, -330, -66, 400, 132, '#c98d63', 66); ellipse(ctx, -280, 0, 40, 46); ctx.fillStyle = '#e9c3a0'; ctx.fill(); ctx.restore();
  box(ctx, 700, 1150, 500, 900, '#c98d63', 120);
  ctx.setTransform(1, 0, 0, 1, 0, 0); vignette(ctx, .65);
  pill(ctx, 540, 250, 'WHEEL: STOPPED', { size: 44, k: (lt - 1.3) * 4, dot: '#ffc53a' });
  darkness(ctx, clamp((lt - 3.05) / .2));
} });
// 16 — end card
SHOTS.push({ start: 56.9, end: 61.0, tr: 'cut', draw(ctx, lt, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0f0d18'; ctx.fillRect(0, 0, W, H);
  const R = rng(9); for (let i = 0; i < 60; i++) { circle(ctx, R() * W, R() * H, 1.5 + R() * 2); ctx.fillStyle = `rgba(240,235,255,${.1 + .2 * Math.sin(t * 2 + i) ** 2})`; ctx.fill(); }
  glow(ctx, 540, 820, 700, '216,57,43', .12);
  const L = (s, y, size, col, t0, sp = 0) => { const k = clamp((lt - t0) / .3); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.translate(540, y + (1 - easeOut(k)) * 26); if (sp) ctx.letterSpacing = sp + 'px'; text(ctx, s, 0, 0, size, col, null, 0, 'Bebas', 400); ctx.restore(); };
  L('ZOMBIE APOCALYPSE AT A THEME PARK', 600, 46, 'rgba(243,234,216,.75)', .2, 4); L('PART 5', 790, 280, CREAM, .45, 6); L('THE FINALE', 985, 120, '#ff4b3a', .85, 6);
  L('WHAT WOULD YOU DO', 1150, 108, CREAM, 1.35, 2); L('WITH THE WHEEL?', 1262, 108, CREAM, 1.35, 2); L('FOLLOW FOR THE FINALE', 1420, 50, '#ffc53a', 1.95, 5); L('STORY = FICTION · SURVIVAL FACTS = REAL', 1500, 32, 'rgba(243,234,216,.5)', 2.25, 3);
  vignette(ctx, .5); darkness(ctx, clamp((lt - 3.8) / .25));
} });
