// ---------- "Zombie apocalypse at a theme park", part 3: the lap bars ----------
// base.js is part 2's shot file: it supplies the shared helpers (park, radioBig, spokeScene, hubNora, crowdUp, hill ...)
SHOTS.length = 0;
window.HL = { three: 'y', lap: 'r', bars: 'r', twenty: 'r', four: 'y', infected: 'r', noise: 'y', hundred: 'y', problem: 'r', generator: 'y', shed: 'y', gus: 'y', inside: 'r', sheet: 'y', metal: 'y', "won't": 'r', hold: 'r', hub: 'y', whole: 'y', see: 'y', leads: 'y', window: 'y', carousel: 'y', wait: 'r', run: 'y', sixty: 'y', yards: 'y', dozen: 'r', block: 'r', ladder: 'y', jacket: 'y', pickles: 'y', hates: 'r', useful: 'y', goose: 'y', angriest: 'r', climbs: 'y', feet: 'y', happy: 'r', nothing: 'y', moving: 'y', voice: 'r', coast: 'y', guard: 'y', helicopter: 'y', lights: 'y', one: 'y', seat: 'r', loudest: 'r', flying: 'r', them: 'r' };
function lapBarUp(ctx, t, k, eyes = 1) { bigRider(ctx, 540, 1250, 1.5, eyes, ease(k)); bigCar(ctx, 540, 1330, 1.5); ctx.save(); ctx.translate(120, 1100); ctx.rotate(-ease(k) * 1.15); line(ctx, 0, 0, 0, -150, 40, '#8a6a1e'); line(ctx, 0, -150, 840, -150, 74, '#e2a62b'); line(ctx, 30, -168, 810, -168, 12, 'rgba(255,255,255,.3)'); ctx.restore(); circle(ctx, 120, 1100, 40); ctx.fillStyle = '#3d3878'; ctx.fill(); }
function flyGoose(ctx, x, y, s, t, o = {}) { const fl = Math.sin(t * 16), honk = o.honk || 0; ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.tilt || 0);
  path(ctx, [[-.1, -.02], [-.28, -.5 * fl - .12], [.16, -.04]]); ctx.fillStyle = '#dcd8cf'; ctx.fill();
  ellipse(ctx, 0, 0, .3, .13); ctx.fillStyle = '#f4f1ea'; ctx.fill(); path(ctx, [[-.26, -.04], [-.44, -.1], [-.4, .06]]); ctx.fill();
  line(ctx, .22, -.02, .52, -.1, .1, '#f4f1ea'); circle(ctx, .56, -.11, .085); ctx.fillStyle = '#f4f1ea'; ctx.fill();
  path(ctx, [[.62, -.15], [.8, -.12 - honk * .05], [.63, -.1]]); ctx.fillStyle = '#e8872a'; ctx.fill(); path(ctx, [[.62, -.1], [.77, -.08 + honk * .07], [.62, -.06]]); ctx.fillStyle = '#c96f1c'; ctx.fill();
  circle(ctx, .58, -.13, .018); ctx.fillStyle = DK; ctx.fill(); line(ctx, .53, -.18, .61, -.16, .014, DK);
  path(ctx, [[-.06, 0], [-.2, .55 * fl + .1], [.2, .02]]); ctx.fillStyle = '#f4f1ea'; ctx.fill(); line(ctx, -.2, .1, -.34, .14, .03, '#e8872a'); ctx.restore(); }
const honkTxt = (ctx, x, y, k, rot = -.1, size = 110) => { if (k <= 0 || k > 1.4) return; ui(ctx, () => { ctx.translate(x, y); ctx.rotate(rot); ctx.scale(backOut(clamp(k * 4)), backOut(clamp(k * 4))); ctx.globalAlpha = clamp((1.4 - k) * 3); text(ctx, 'HONK', 0, 0, size, '#ffc53a', 'rgba(12,8,14,.85)', size * .14, 'Bebas', 400); }); };
const ROT3 = rotAt(66);   // where the wheel was when part 2 ended
const wheelRot = (T, stopAt = 1e9) => ROT3 + Math.min(T, stopAt) * .12;
const STOP = 43.7;        // the one on the lever follows the goose: the wheel stops

// 1 — title
SHOTS.push({ start: 0, end: 3.3, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2); stationBG(ctx, t); const z = 1.08 + lt * .02; ctx.setTransform(z, 0, 0, z, 540 * (1 - z) + hh[0], 900 * (1 - z) + hh[1]);
  lapBarUp(ctx, t, 1); tint(ctx, '#d8392b', .38, 'overlay'); vignette(ctx, .7); titleTags(ctx, lt, 'PART 3', 'DAY 1 · 8:09 PM');
} });
// 2 — twenty four infected step off the train
SHOTS.push({ start: 3.3, end: 7.45, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3); stationBG(ctx, t); ctx.setTransform(1, 0, 0, 1, hh[0], hh[1]);
  for (let i = 0; i < 3; i++) { const x = 140 + i * 420; bigCar(ctx, x, 1180, .55); ctx.save(); ctx.translate(x - 150, 1100); ctx.rotate(-1.15); line(ctx, 0, 0, 300, 0, 26, '#e2a62b'); ctx.restore(); }
  box(ctx, -50, 1300, W + 100, 700, '#1c1a38', 0); ctx.fillStyle = 'rgba(255,255,255,.05)'; ctx.fillRect(-50, 1300, W + 100, 12);
  const zs = [[150, 1480, 380, 0], [420, 1500, 400, 1.2], [700, 1470, 370, .5], [930, 1510, 400, 1.8], [-80, 1720, 520, .8], [270, 1760, 540, 2.2], [600, 1740, 520, 1.5], [900, 1790, 560, 0.3]];
  zs.forEach(([x, y, s, d], i) => { const k = clamp((lt - .3 - d * .7) * 3); if (k <= 0) return; infected(ctx, x + (lt - d * .7) * 55, y, s, t, { ph: i, sp: 3.2, col: i > 3 ? '#0f0c16' : '#1a1626', extra: { alpha: k } }); });
  tint(ctx, '#d8392b', .25, 'overlay'); vignette(ctx, .7);
  pill(ctx, 540, 250, `LOOSE: ${Math.round(clamp((lt - 1.2) / 1.6) * 24)}`, { size: 50, k: lt * 4, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 3 — the noise worked: 400 at the coaster
SHOTS.push({ start: 7.45, end: 11.9, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: kf(lt, [[0, 420], [4.45, 700]]) + hh[0], y: 1010 + hh[1], z: kf(lt, [[0, .82], [4.45, .92]]), r: 0 };
  coasterBG(ctx, t, cam); hill(ctx, t);
  tinyCrowd(ctx, t, -900, 1500, 1500, 90, { s: 86, dy: 190, sp: 70, inf: 1, seed: 8, dir: 1 }); tinyCrowd(ctx, t, 300, 1300, 1480, 60, { s: 80, dy: 150, sp: 6, inf: 1, seed: 12 });
  const p = hillPt(.62); for (let i = 0; i < 3; i++) { const k = (t * 1.2 + i / 3) % 1; ctx.beginPath(); ctx.arc(p[0], p[1], 90 + k * 320, Math.PI * .1, Math.PI * .9); ctx.lineWidth = 12; ctx.strokeStyle = `rgba(255,197,58,${(1 - k) * .7})`; ctx.stroke(); }
  vignette(ctx, .6);
  pill(ctx, 540, 250, 'RULE #3: WORKED', { size: 42, k: lt * 4, dot: '#7dff8a' });
  pill(ctx, 540, 335, `AT THE COASTER: ${Math.round(lerp(24, 400, clamp((lt - 1.3) / 1.8)))}+`, { size: 44, k: (lt - 1.2) * 4, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 4 — one problem: the shed is right next to it
const DOTS = (() => { const R = rng(17), a = []; for (let i = 0; i < 90; i++) a.push([R() * 1080, 1250 + R() * 500, 300 + R() * 520, 520 + R() * 560, R() * 1.4]); return a; })();
SHOTS.push({ start: 11.9, end: 15.3, tr: 'cut', draw(ctx, lt, t) {
  paper(ctx); text(ctx, 'NORTH SIDE · COASTER', 90, 180, 40, 'rgba(60,45,35,.6)', null, 0, 'Bebas', 400, 'left');
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(140, 980); ctx.bezierCurveTo(200, 420, 420, 420, 480, 760); ctx.bezierCurveTo(520, 1000, 640, 1000, 660, 700); ctx.lineWidth = 16; ctx.strokeStyle = '#c9543e'; ctx.stroke(); for (let i = 0; i < 7; i++) line(ctx, 170 + i * 75, 1000, 170 + i * 75, 1080, 6, '#b9ab8c');
  box(ctx, 150, 1060, 420, 60, '#c9543e', 8); text(ctx, 'COASTER STATION', 360, 1093, 40, CREAM, null, 0, 'Bebas', 400);
  const k = clamp((lt - 1.2) * 4), g = clamp((lt - 3.5) * 5);
  if (k > 0) { ui(ctx, () => { ctx.translate(820, 800); ctx.scale(backOut(k), backOut(k)); box(ctx, -130, -110, 260, 220, '#b08a2e', 12); rrect(ctx, -130, -110, 260, 220, 12); ctx.lineWidth = 7; ctx.strokeStyle = '#2a2226'; ctx.stroke(); text(ctx, 'GENERATOR', 0, -52, 40, '#2a2226', null, 0, 'Bebas', 400); text(ctx, 'SHED', 0, -12, 40, '#2a2226', null, 0, 'Bebas', 400); }); line(ctx, 672, 800, 688, 800, 6, '#2a2226'); ctx.setLineDash([10, 8]); line(ctx, 600, 880, 690, 880, 5, RED); ctx.setLineDash([]); text(ctx, '20 FT', 645, 925, 40, RED, null, 0, 'Bebas', 400); }
  for (const [x0, y0, x1, y1, d] of DOTS) { const q = ease(clamp((lt - d) / 1.6)); circle(ctx, lerp(x0, x1, q) + Math.sin(t * 5 + x0) * 3, lerp(y0, y1, q), 11); ctx.fillStyle = '#a02a22'; ctx.fill(); }
  if (g > 0) { circle(ctx, 820, 850, 20 + Math.sin(t * 8) * 3); ctx.fillStyle = '#e2a62b'; ctx.fill(); circle(ctx, 820, 850, 46 * g); ctx.lineWidth = 7; ctx.strokeStyle = '#e2a62b'; ctx.stroke(); ui(ctx, () => { ctx.translate(940, 650); ctx.scale(backOut(g), backOut(g)); box(ctx, -70, -36, 140, 72, '#2a2226', 10); text(ctx, 'GUS', 0, 3, 50, '#ffc53a', null, 0, 'Bebas', 400); }); }
  vignette(ctx, .35);
  pill(ctx, 540, 250, 'ONE PROBLEM', { size: 44, k: lt * 4, dot: '#ff5a4d' });
} });
SHOTS.push({ start: 15.3, end: 17.05, tr: 'cut', draw(ctx, lt, t) {
  const b = [.35, 1.0], sh = b.reduce((a, x) => a + (lt > x ? Math.max(0, 1 - (lt - x) * 5) : 0), 0), hk = shake(t * 3, 14 * sh, 3), hh = handheld(t, 3);
  ctx.setTransform(1.04, 0, 0, 1.04, -20 + hh[0] + hk[0], -40 + hh[1] + hk[1]); shed(ctx, t);
  guy(ctx, C(GUS, { x: 690, y: 1560, s: 620, lean: .05, arms: { L: [1.3, 1.3], R: [1.3, -1.3] }, face: { eyes: 'wide', mouth: 'o', look: [-1, 0], browUp: 1 } }));
  if (sh > .3) for (let i = 0; i < 3; i++) line(ctx, 60 + i * 20, 760 + i * 70, 150 + i * 14, 740 + i * 80, 10, CREAM);
  vignette(ctx, .7);
} });
// 5 — sheet metal: it won't hold
SHOTS.push({ start: 17.05, end: 19.85, tr: 'cut', draw(ctx, lt, t) {
  const bangs = [.3, .85, 1.4, 1.95, 2.4], sh = bangs.reduce((a, x) => a + (lt > x ? Math.max(0, 1 - (lt - x) * 5) : 0), 0), hk = shake(t * 3, 20 * sh, 3), hh = handheld(t, 2);
  ctx.setTransform(1, 0, 0, 1, hh[0] + hk[0], hh[1] + hk[1]); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#2c2a3a', '#17151f'); ctx.fillRect(-60, -60, W + 120, H + 120); glow(ctx, 1000, 1500, 900, '255,190,110', .3);
  box(ctx, 190, 250, 700, 1330, '#15131c', 10);
  ctx.save(); ctx.translate(540, 900); ctx.scale(1 + sh * .02 + clamp(lt / 2.6) * .03, 1); ctx.translate(-540, -900);
  box(ctx, 230, 290, 620, 1290, '#8f9aa8', 8); for (let x = 260; x < 850; x += 62) { ctx.fillStyle = 'rgba(20,30,50,.16)'; ctx.fillRect(x, 290, 22, 1290); ctx.fillStyle = 'rgba(255,255,255,.12)'; ctx.fillRect(x + 24, 290, 10, 1290); }
  box(ctx, 420, 380, 240, 170, '#0c0a12', 10); for (const [ex, ph] of [[490, 0], [600, 1.3]]) for (const sd of [-1, 1]) { const yy = 465 + Math.sin(t * 2 + ph) * 14; glow(ctx, ex + sd * 20, yy, 50, '255,255,255', .6); circle(ctx, ex + sd * 20, yy, 11); ctx.fillStyle = '#fff'; ctx.fill(); } for (let i = 0; i < 5; i++) line(ctx, 420, 400 + i * 34, 660, 400 + i * 34, 3, 'rgba(180,190,210,.5)');
  bangs.forEach((b, i) => { const k = clamp((lt - b) * 8); if (k <= 0) return; const [dx, dy, r] = [[380, 800, 80], [660, 1040, 90], [450, 1240, 70], [640, 720, 76], [520, 960, 100]][i]; ctx.save(); ctx.translate(dx, dy); ctx.scale(backOut(k), backOut(k)); ellipse(ctx, 0, 0, r, r * .8); ctx.fillStyle = 'rgba(15,20,40,.35)'; ctx.fill(); ctx.beginPath(); ctx.ellipse(0, 0, r, r * .8, 0, .4, 2.6); ctx.lineWidth = 9; ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.stroke(); ctx.beginPath(); ctx.ellipse(0, 0, r, r * .8, 0, 3.5, 5.8); ctx.strokeStyle = 'rgba(15,20,40,.6)'; ctx.stroke(); ctx.restore(); });
  circle(ctx, 800, 950, 30); ctx.fillStyle = '#3d3a50'; ctx.fill();
  ctx.restore();
  if (lt > 1.95) for (const fy of [700, 1100]) for (let i = 0; i < 4; i++) line(ctx, 232, fy + i * 30, 232 + (50 + Math.sin(t * 12 + i) * 14) * clamp((lt - 1.95) * 4), fy + i * 30 - 8, 20, '#0f0c16');
  tint(ctx, '#d8392b', clamp(lt / 2.6) * .2, 'overlay'); vignette(ctx, .7);
  pill(ctx, 540, 190, lt > 1.75 ? 'DOOR: FAILING' : 'DOOR: SHEET METAL', { size: 44, k: lt * 4, bg: lt > 1.75 ? 'rgba(150,25,20,.95)' : undefined, dot: lt > 1.75 ? '#fff' : '#ffc53a' });
} });
// 6 — from the hub, Nora can see the whole park
function hubLook(ctx, lt, t, cam, T) {
  park(ctx, t, cam); applyCam(ctx, cam, 1); ferris(ctx, WX, WY, WR, wheelRot(T), { t, n: N, lit: 1 });
  hubNora(ctx, t, { noGoose: true, armLen: 1.2, arms: { L: [1.3, 1.2], R: { ik: [.1, -.92], bend: -1 } }, face: { eyes: 'wide', mouth: 'flat', look: [1, .6], browAng: .2 } });
  gooseHead(ctx, WX - 4, WY - 66, 14, 0, .3);
  booth(ctx, 1010, GROUND, 1, N, .85);
}
SHOTS.push({ start: 19.85, end: 23.05, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), cam = { x: kf(lt, [[0, 540], [3.2, 640]]) + hh[0], y: kf(lt, [[0, 660], [3.2, 860]]) + hh[1], z: kf(lt, [[0, 3.0], [1.2, 2.7], [3.2, .95]], ease), r: 0 };
  hubLook(ctx, lt, t, cam, t);
  const k = clamp((lt - 1.5) / .8); if (k > 0) { ctx.save(); ctx.globalAlpha = .2 * k; path(ctx, [[WX + 20, WY - 100], [1700, 900 + Math.sin(t * 1.2) * 200], [1700, 1700 + Math.sin(t * 1.2) * 200]]); ctx.fillStyle = '#ffe9a8'; ctx.fill(); ctx.restore(); }
  tinyCrowd(ctx, t, 700, 1700, 1500, 40, { s: 80, dy: 160, sp: 20, inf: 1, seed: 5, dir: 1 });
  vignette(ctx, .6);
  pill(ctx, 540, 250, 'VIEW: THE WHOLE PARK', { size: 44, k: (lt - 1.3) * 4, dot: '#7dff8a' });
} });
// 7 — rule #4
SHOTS.push({ start: 23.05, end: 26.25, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: 640 + hh[0], y: 860 + hh[1], z: kf(lt, [[0, .95], [3.2, .88]]), r: 0 };
  hubLook(ctx, lt, t, cam, t); tint(ctx, '#120a1c', .5); vignette(ctx, .6);
  ruleCard(ctx, 540, 640, 'RULE #4', 'THE ONE WHO CAN SEE,', lt > 2.4 ? 'LEADS.' : '', (lt - .08) * 5, { w: 900, h: 420, size: 100, size2: 150 });
} });
// 8 — she walks him out
const ROUTE = [[850, 520], [850, 660], [560, 700], [300, 820], [300, 1010], [330, 1230]];
function routePt(u) { const n = ROUTE.length - 1, k = clamp(u) * n, i = Math.min(n - 1, Math.floor(k)), f = k - i; return [lerp(ROUTE[i][0], ROUTE[i + 1][0], f), lerp(ROUTE[i][1], ROUTE[i + 1][1], f)]; }
SHOTS.push({ start: 26.25, end: 31.7, tr: 'cut', draw(ctx, lt, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#0e1230', '#161a44'); ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(120,140,220,.1)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  text(ctx, "NORA'S VIEW · CH 4", 90, 180, 40, 'rgba(200,210,255,.6)', null, 0, 'Bebas', 400, 'left');
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [a, b, w] of [[[560, 400], [560, 1500], 60], [[120, 820], [1000, 820], 60], [[850, 500], [850, 820], 46], [[300, 820], [300, 1300], 46]]) line(ctx, a[0], a[1], b[0], b[1], w, 'rgba(110,125,200,.22)');
  // landmarks
  box(ctx, 740, 380, 220, 150, '#b08a2e', 10); text(ctx, 'SHED', 850, 440, 44, '#1a1630', null, 0, 'Bebas', 400); box(ctx, 815, 520, 70, 16, '#ffe9a8', 4);
  ctx.beginPath(); ctx.moveTo(480, 520); ctx.bezierCurveTo(520, 330, 620, 330, 660, 470); ctx.lineWidth = 12; ctx.strokeStyle = '#c9543e'; ctx.stroke(); text(ctx, 'COASTER', 560, 300, 36, '#c9543e', null, 0, 'Bebas', 400);
  circle(ctx, 620, 760, 70); ctx.fillStyle = '#7a5aa8'; ctx.fill(); for (let i = 0; i < 8; i++) { circle(ctx, 620 + Math.cos(i * TAU / 8 + t) * 52, 760 + Math.sin(i * TAU / 8 + t) * 52, 9); ctx.fillStyle = '#e9dcc4'; ctx.fill(); } text(ctx, 'CAROUSEL', 760, 700, 34, 'rgba(200,210,255,.7)', null, 0, 'Bebas', 400, 'left');
  for (const [bx, by] of [[120, 620], [120, 980], [760, 1000], [760, 1180]]) box(ctx, bx, by, 150, 110, 'rgba(110,125,200,.3)', 8);
  circle(ctx, 330, 1440, 170); ctx.lineWidth = 12; ctx.strokeStyle = '#8f8ab8'; ctx.stroke(); for (let i = 0; i < 12; i++) line(ctx, 330, 1440, 330 + Math.cos(i * TAU / 12) * 170, 1440 + Math.sin(i * TAU / 12) * 170, 4, '#8f8ab8'); circle(ctx, 330, 1440, 26); ctx.fillStyle = '#3fa35b'; ctx.fill(); text(ctx, 'NORA', 330, 1510, 38, '#7dff8a', null, 0, 'Bebas', 400);
  // the infected: clustered at the shed and coaster, one group crossing the path
  const R = rng(23); for (let i = 0; i < 46; i++) { const x = 440 + R() * 480 + Math.sin(t * 2 + i) * 6, y = 300 + R() * 250; circle(ctx, x, y, 10); ctx.fillStyle = '#ff4b3a'; ctx.fill(); }
  for (let i = 0; i < 7; i++) { const x = -260 + (lt - 2.4) * 330 - i * 44 + Math.sin(i * 3) * 20, y = 930 + Math.sin(i * 2.1) * 40; circle(ctx, x, y, 11); ctx.fillStyle = '#ff4b3a'; ctx.fill(); }
  for (let i = 0; i < 9; i++) { circle(ctx, 360 + (i % 3) * 50 + Math.sin(t * 2 + i) * 5, 1270 + Math.floor(i / 3) * 34, 10); ctx.fillStyle = '#ff4b3a'; ctx.fill(); }
  // Gus
  const u = kf(lt, [[1.95, 0], [2.65, .22], [3.0, .4, x => x], [3.95, .6], [4.7, .6], [5.35, .97, easeIn]]), p = routePt(u);
  ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(ROUTE[0][0], ROUTE[0][1]); for (let q = 0; q <= u; q += .01) { const a = routePt(q); ctx.lineTo(a[0], a[1]); } ctx.lineTo(p[0], p[1]); ctx.lineWidth = 8; ctx.strokeStyle = '#ffc53a'; ctx.stroke(); ctx.setLineDash([]);
  line(ctx, 330, 1440, p[0], p[1], 3, 'rgba(125,255,138,.45)');
  circle(ctx, p[0], p[1], 38 + Math.sin(t * 8) * 6); ctx.lineWidth = 6; ctx.strokeStyle = '#ffc53a'; ctx.stroke(); circle(ctx, p[0], p[1], 19); ctx.fillStyle = '#ffc53a'; ctx.fill(); text(ctx, 'GUS', p[0] + 54, p[1] - 30, 40, '#ffc53a', null, 0, 'Bebas', 400, 'left');
  vignette(ctx, .5);
  const step = lt < 1.95 ? ['ON THE RADIO', '#7dff8a'] : lt < 2.68 ? ['BACK WINDOW', '#ffc53a'] : lt < 4.02 ? ['LEFT AT THE CAROUSEL', '#ffc53a'] : lt < 4.68 ? ['WAIT.', '#ff5a4d'] : ['NOW. RUN.', '#7dff8a'];
  pill(ctx, 540, 250, step[0], { size: 54, dot: step[1], bg: step[0] === 'WAIT.' ? 'rgba(150,25,20,.95)' : undefined });
} });
// 9 — a dozen of them block the ladder    /    12 — one goose
const BLOCK = [[640, 0], [720, 2], [800, 4], [880, 1], [960, 3], [590, 5], [770, 6], [930, 7]];
function wheelBase(ctx, lt, t, cam, T, o = {}) {
  park(ctx, t, cam); applyCam(ctx, cam, 1); ferris(ctx, WX, WY, WR, wheelRot(T, o.stop), { t, n: N, lit: 1 });
  // the service ladder up the leg
  const A = [WX + WR * .62, GROUND], B = [WX, WY]; for (const sd of [-1, 1]) line(ctx, A[0] + sd * 20, A[1], B[0] + sd * 20, B[1], 7, '#ffc53a'); for (let k = .03; k < 1; k += .045) line(ctx, lerp(A[0], B[0], k) - 20, lerp(A[1], B[1], k), lerp(A[0], B[0], k) + 20, lerp(A[1], B[1], k), 5, '#ffc53a');
  booth(ctx, 1010, GROUND, 1, N, .85, o.booth);
  box(ctx, 20, GROUND - 250, 260, 250, '#2a2648', 10); for (let i = 0; i < 5; i++) { ctx.fillStyle = i % 2 ? '#3a3050' : '#5a2a34'; ctx.fillRect(20 + i * 52, GROUND - 300, 52, 60); }
}
SHOTS.push({ start: 31.7, end: 35.85, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: kf(lt, [[0, 520], [4.15, 640]]) + hh[0], y: kf(lt, [[0, 1180], [4.15, 1240]]) + hh[1], z: kf(lt, [[0, 1.0], [4.15, 1.3]]), r: 0 };
  wheelBase(ctx, lt, t, cam, t, { booth: inBooth(lt, true) });
  guy(ctx, C(GUS, { x: 300, y: GROUND + 10, s: 250, lean: -.1, arms: { L: [.4, -.3], R: [1.2, -1.6] }, face: { eyes: 'wide', mouth: 'wavy', look: [1, 0], browUp: 1 } }));
  box(ctx, 20, GROUND - 250, 250, 250, '#2a2648', 10);
  BLOCK.forEach(([x, i]) => infected(ctx, x + Math.sin(t * .8 + i) * 10, GROUND + 14 + (i % 3) * 16, 260 + (i % 2) * 20, t, { ph: i, still: true, dir: i % 2 ? -1 : 1 }));
  vignette(ctx, .65);
  pill(ctx, 540, 250, '60 YARDS TO THE LADDER', { size: 42, k: lt * 4 });
  pill(ctx, 540, 335, 'IN THE WAY: 12', { size: 44, k: (lt - 2.0) * 4, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 10 — Nora opens her jacket
SHOTS.push({ start: 35.85, end: 38.1, tr: 'cut', draw(ctx, lt, t) {
  const op = kf(lt, [[.9, 0], [1.3, 1, backOut]]), hh = handheld(t, 2);
  ctx.setTransform(1, 0, 0, 1, hh[0], hh[1]); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#0a0b20', '#1a1848'); ctx.fillRect(-50, -50, W + 100, H + 100);
  for (let i = 0; i < 12; i++) { const c = ['255,214,120', '255,120,110', '120,230,255'][i % 3]; glow(ctx, 80 + i * 97, 300 + Math.sin(i * 2.3) * 220, 150, c, .22); }
  guy(ctx, C(NORA, { x: 540, y: 2100, s: 1500, shadow: false, armLen: 1.1, arms: { L: { ik: [-.05 - op * .08, -.5] }, R: { ik: [.05 + op * .08, -.5], bend: -1 } }, face: { eyes: 'dot', mouth: 'smile', look: [0, 1], browAng: .25 },
    deco: (c, tw, tTop) => { NORA.deco(c, tw, tTop); c.fillStyle = '#17131f'; c.beginPath(); c.moveTo(-.01 - op * .06, tTop + .05); c.lineTo(.01 + op * .06, tTop + .05); c.lineTo(.006, tTop + .34); c.lineTo(-.006, tTop + .34); c.closePath(); c.fill(); } }));
  if (op > 0) gooseHead(ctx, 540, 1330 - op * 150, 120 * op, Math.max(0, Math.sin((lt - 1.3) * 16)) * (lt > 1.3 ? 1 : 0), .1);
  honkTxt(ctx, 800, 900, lt - 1.35, .1, 130);
  vignette(ctx, .6);
} });
// 11 — Pickles hates everyone
SHOTS.push({ start: 38.1, end: 41.3, tr: 'cut', draw(ctx, lt, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#070818', '#12143a', '#2a2050'); ctx.fillRect(0, 0, W, H);
  const R = rng(4); for (let i = 0; i < 30; i++) { const bx = ((R() * 1500 - lt * 260) % 1500 + 1500) % 1500 - 200, by = R() * 1900, c = ['255,214,120', '255,120,110', '120,230,255', '255,255,255'][i % 4]; glow(ctx, bx, by, 60 + R() * 110, c, .22); }
  for (let i = 0; i < 6; i++) line(ctx, 80 + i * 60 - (t * 900 % 500), 500 + i * 160, 260 + i * 60 - (t * 900 % 500), 500 + i * 160, 7, 'rgba(243,234,216,.25)');
  const hk = Math.max(0, Math.sin(t * 9));
  flyGoose(ctx, kf(lt, [[0, 300], [3.2, 520]]), kf(lt, [[0, 640], [3.2, 900]]) + Math.sin(t * 3) * 20, 560, t, { honk: hk, tilt: .16 });
  honkTxt(ctx, 300, 420, (lt - .2) * 1.2, -.14); honkTxt(ctx, 760, 1480, (lt - 1.3) * 1.2, .1, 130);
  vignette(ctx, .6);
  nameCard(ctx, 90, 1560, 'PICKLES', 'USEFUL AFTER ALL', (lt - 1.9) * 5, -.03);
} });
SHOTS.push({ start: 41.3, end: 46.4, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: kf(lt, [[0, 640], [5.1, 500]]) + hh[0], y: 1230 + hh[1], z: 1.25, r: 0 };
  const gone = lt > 4.3 - 0;
  wheelBase(ctx, lt, t, cam, t, { stop: STOP, booth: lt < 2.4 ? inBooth(lt, true) : null });
  const gx = kf(lt, [[0, 1250], [5.1, -500]], x => x), gy = 1130 + Math.sin(t * 4) * 30;
  BLOCK.forEach(([x, i]) => { const k = clamp((lt - .6 - i * .16) * 3), xx = x - Math.max(0, lt - .9 - i * .16) * 190; infected(ctx, xx, GROUND + 14 + (i % 3) * 16, 260 + (i % 2) * 20, t, { ph: i, still: k <= 0, sp: 5, dir: k > 0 ? -1 : (i % 2 ? -1 : 1), up: k > 0 }); });
  if (lt > 2.4) infected(ctx, 1010 - (lt - 2.4) * 300, GROUND + 20, 250, t, { ph: 9, sp: 5, dir: -1, up: true });
  flyGoose(ctx, gx, gy, 300, t, { flip: -1, honk: Math.max(0, Math.sin(t * 9)) });
  const sx = kf(lt, [[3.4, 300], [5.1, 800]], ease); guy(ctx, C(GUS, { x: sx, y: GROUND + 10 - (lt > 3.4 ? Math.abs(Math.sin(t * 12)) * 10 : 0), s: 250, legs: lt > 3.4 ? walkLegs(t, 12, .5) : undefined, arms: lt > 3.4 ? runArms(t, 12) : { L: [.4, -.3], R: [.4, -.3] }, face: { eyes: 'wide', mouth: 'flat', look: [1, 0] } }));
  box(ctx, 20, GROUND - 250, 250, 250, '#2a2648', 10);
  vignette(ctx, .65);
  honkTxt(ctx, 760, 700, (lt - .3) * 1.1, .1); honkTxt(ctx, 330, 760, (lt - 1.9) * 1.1, -.12);
  pill(ctx, 540, 250, 'DISTRACTION: 1 GOOSE', { size: 44, k: lt * 4, dot: '#7dff8a' });
  pill(ctx, 540, 335, lt > STOP - 41.3 ? 'WHEEL: STOPPED' : `IN THE WAY: ${Math.max(0, 12 - Math.round(clamp((lt - .7) / 2.2) * 12))}`, { size: 44, k: (lt - .3) * 4, dot: lt > 2.9 ? '#7dff8a' : '#ff5a4d' });
} });
// 13 — Gus climbs
SHOTS.push({ start: 46.4, end: 51.95, tr: 'cut', draw(ctx, lt, t) {
  const u = kf(lt, [[0, .18], [5.55, .52]], x => x), tired = lt > 2.7;
  spokeScene(ctx, lt, t * (tired ? .6 : 1), u, { who: GUS, noGoose: true, face: { eyes: tired ? 'closed' : 'dot', mouth: tired ? 'open' : 'flat', browAng: .35, look: [0, -1] } });
  ctx.setTransform(1, 0, 0, 1, 0, 0); for (let i = 0; i < 3; i++) { const k = ((t * .9 + i / 3) % 1); circle(ctx, 660 + i * 50, 760 + k * 170, 12 * (1 - k) + 5); ctx.fillStyle = `rgba(143,216,255,${.9 * (1 - k)})`; ctx.fill(); }
  vignette(ctx, .6);
  pill(ctx, 540, 250, `${Math.round(clamp((lt - .6) / 2.0) * 100)} FT`, { size: 54, k: lt * 4, dot: '#7dff8a' });
  pill(ctx, 540, 345, 'GUS · 61 · NOT HAPPY', { size: 42, k: (lt - 2.75) * 4, dot: '#ff5a4d' });
} });
// 14 — nothing is moving
function hubThree(ctx, lt, t, cam, o = {}) {
  park(ctx, t, cam); applyCam(ctx, cam, 1); ferris(ctx, WX, WY, WR, wheelRot(STOP, STOP), { t, n: N, lit: 1 });
  hubNora(ctx, t, { x: WX - 60, noGoose: true, arms: { L: [.5, -.4], R: [.5, -.4] }, face: o.nora || { eyes: 'closed', mouth: 'smile' } });
  guy(ctx, C(GUS, { x: WX + 44, y: WY + 44, s: 170, shadow: false, legs: { L: [-1.2, 1.3], R: [1.3, -1.3] }, arms: { L: [.5, -.4], R: [.5, -.4] }, headTilt: o.gusTilt == null ? .12 : o.gusTilt, face: o.gus || { eyes: 'closed', mouth: 'open', browAng: .2 } }));
  goose(ctx, WX + 128, WY - 92, 90, t, { flip: -1 });
  booth(ctx, 1010, GROUND, 1, N, .85);
}
SHOTS.push({ start: 51.95, end: 55.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 1.5), cam = { x: 540 + hh[0], y: kf(lt, [[0, 650], [3.25, 700]]) + hh[1], z: kf(lt, [[0, 2.9], [3.25, 1.7]], ease), r: 0 };
  hubThree(ctx, lt, t, cam); vignette(ctx, .6);
  pill(ctx, 540, 250, '8:31 PM · QUIET', { size: 44, k: lt * 4, dot: '#7dff8a' });
} });
// 15 — a new voice on channel 4
SHOTS.push({ start: 55.2, end: 57.6, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 5); ctx.setTransform(1.06, 0, 0, 1.06, -32 + hh[0], -56 + hh[1]);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#2a1420', '#140a12'); ctx.fillRect(-80, -80, W + 160, H + 160); glow(ctx, 900, 200, 900, ['255,214,120', '255,120,110', '120,230,255'][Math.floor(t * 2) % 3], .18);
  radioBig(ctx, t, lt > .3, lt > 1.2); vignette(ctx, .7);
  pill(ctx, 540, 250, 'CH 4 · UNKNOWN VOICE', { k: lt * 5, size: 42, dot: '#ff5a4d' });
} });
// 16 — one seat
function chopper(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const c = '#0c0a16'; ctx.save(); ctx.globalAlpha = .28; path(ctx, [[-10, 40], [-360, 1500], [260, 1500]]); ctx.fillStyle = '#fff3c4'; ctx.fill(); ctx.restore(); glow(ctx, -10, 40, 120, '255,243,196', .7);
  ellipse(ctx, 0, 0, 120, 58); ctx.fillStyle = c; ctx.fill(); path(ctx, [[60, -30], [330, -14], [330, 10], [80, 30]]); ctx.fill(); path(ctx, [[300, -60], [340, -60], [336, 14], [312, 14]]); ctx.fill();
  ellipse(ctx, 322, -36, 44 * Math.abs(Math.sin(t * 30)) + 6, 44); ctx.fillStyle = 'rgba(12,10,22,.55)'; ctx.fill();
  line(ctx, 0, -58, 0, -84, 10, c); ellipse(ctx, 0, -86, 300, 9 + Math.abs(Math.sin(t * 40)) * 5); ctx.fillStyle = 'rgba(200,205,235,.35)'; ctx.fill();
  for (const sx of [-60, 60]) line(ctx, sx, 54, sx, 82, 7, c); line(ctx, -100, 84, 100, 84, 8, c);
  ellipse(ctx, -56, -8, 40, 30); ctx.fillStyle = '#2a3566'; ctx.fill(); line(ctx, 30, -4, 170, 2, 12, '#e8872a');
  circle(ctx, 116, 4, 9); ctx.fillStyle = Math.floor(t * 4) % 2 ? '#ff5a4d' : '#5a2420'; ctx.fill(); if (Math.floor(t * 4) % 2) glow(ctx, 116, 4, 60, '255,90,77', .7); circle(ctx, 334, -62, 7); ctx.fillStyle = '#7dff8a'; ctx.fill();
  ctx.restore(); }
SHOTS.push({ start: 57.6, end: 61.9, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3); ctx.setTransform(1, 0, 0, 1, hh[0], hh[1]);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#060716', '#0d1030', '#1a1c48'); ctx.fillRect(-50, -50, W + 100, H + 100);
  const R = rng(5); for (let i = 0; i < 80; i++) { circle(ctx, R() * W, R() * 1300, 1.5 + R() * 2.5); ctx.fillStyle = `rgba(240,240,255,${.3 + .4 * Math.sin(t * 2 + i) ** 2})`; ctx.fill(); }
  for (const [cx, cy, w] of [[200, 520, 380], [860, 760, 340], [500, 1050, 420]]) { ctx.fillStyle = '#141a3c'; ellipse(ctx, cx + t * 5, cy, w, 34); ctx.fill(); }
  ctx.fillStyle = '#0a0c22'; ctx.fillRect(-50, 1560, W + 100, 500); for (let i = 0; i < 26; i++) { const a = i * TAU / 26 + t * .0; circle(ctx, 190 + Math.sin(a) * 150, 1640 + Math.cos(a) * 150, 7); ctx.fillStyle = ['#ffd678', '#ff786e', '#78e6ff', '#fff'][i % 4]; ctx.fill(); } glow(ctx, 190, 1640, 420, '255,200,140', .3);
  const s = kf(lt, [[0, .5], [4.3, 2.1]], x => x * x);
  chopper(ctx, kf(lt, [[0, 880], [4.3, 600]]), kf(lt, [[0, 420], [4.3, 640]]) + Math.sin(t * 2) * 12, s, t);
  vignette(ctx, .6);
  pill(ctx, 540, 190, 'COAST GUARD 6-5', { size: 44, k: (lt - .6) * 4 });
  pill(ctx, 540, 275, 'SEATS: 1', { size: 54, k: (lt - 3.4) * 5, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 17 — the loudest thing in the county
SHOTS.push({ start: 61.9, end: 65.9, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 4 + lt), cam = { x: kf(lt, [[0, 700], [4, 560]]) + hh[0], y: 1280 + hh[1], z: kf(lt, [[0, 1.18], [4, 1.3]]), r: 0 };
  crowdUp(ctx, 1, t, cam, i => 1 - (lt - .5 - i * .12) * 4);
  ui(ctx, () => { const sx = 540 + Math.sin(t * 1.4) * 380; ctx.globalAlpha = .2; path(ctx, [[540, -200], [sx - 240, 1920], [sx + 240, 1920]]); ctx.fillStyle = '#fff3c4'; ctx.fill(); ctx.globalAlpha = 1; for (let i = 0; i < 3; i++) { const k = (t * 1.8 + i / 3) % 1; ctx.beginPath(); ctx.arc(540, 120, 120 + k * 420, .5, Math.PI - .5); ctx.lineWidth = 14; ctx.strokeStyle = `rgba(255,197,58,${(1 - k) * .7})`; ctx.stroke(); } });
  tint(ctx, '#d8392b', kf(lt, [[.4, 0], [2.4, .3]]) + .06 * Math.sin(t * 7), 'overlay'); vignette(ctx, .7);
  pill(ctx, 540, 250, 'ROTOR NOISE: EVERYWHERE', { size: 42, k: (lt - .5) * 4, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
  darkness(ctx, clamp((lt - 3.75) / .2));
} });
// 18 — end card
SHOTS.push({ start: 65.9, end: 70.0, tr: 'cut', draw(ctx, lt, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0f0d18'; ctx.fillRect(0, 0, W, H);
  const R = rng(9); for (let i = 0; i < 60; i++) { circle(ctx, R() * W, R() * H, 1.5 + R() * 2); ctx.fillStyle = `rgba(240,235,255,${.1 + .2 * Math.sin(t * 2 + i) ** 2})`; ctx.fill(); }
  glow(ctx, 540, 820, 700, '216,57,43', .12);
  const L = (s, y, size, col, t0, sp = 0) => { const k = clamp((lt - t0) / .3); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.translate(540, y + (1 - easeOut(k)) * 26); if (sp) ctx.letterSpacing = sp + 'px'; text(ctx, s, 0, 0, size, col, null, 0, 'Bebas', 400); ctx.restore(); };
  L('ZOMBIE APOCALYPSE AT A THEME PARK', 600, 46, 'rgba(243,234,216,.75)', .2, 4); L('PART 4', 790, 280, CREAM, .45, 6); L('ONE SEAT', 985, 120, '#ff4b3a', .85, 6);
  L('NORA, GUS,', 1150, 120, CREAM, 1.35, 2); L('OR THE GOOSE?', 1268, 120, CREAM, 1.35, 2); L('FOLLOW FOR PART 4', 1420, 50, '#ffc53a', 1.95, 5); L('STORY = FICTION · SURVIVAL FACTS = REAL', 1500, 32, 'rgba(243,234,216,.5)', 2.25, 3);
  vignette(ctx, .5); darkness(ctx, clamp((lt - 3.8) / .25));
} });
