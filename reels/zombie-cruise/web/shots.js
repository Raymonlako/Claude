// ---------- shot list: "Imagine you're on a cruise ship when the zombie outbreak begins" ----------
const SHOTS = [];
// draw a layer off-screen and blur it once (a canvas filter on every stroke is far too slow)
const _tmp = document.createElement('canvas'); _tmp.width = W; _tmp.height = H;
function blurLayer(ctx, px, fn) { const c = _tmp.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); fn(c); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${px}px)`; ctx.drawImage(_tmp, 0, 0); ctx.restore(); }
const stars = (ctx, x, y, t, r = 120, n = 3, sz = 26) => { for (let i = 0; i < n; i++) { const a = t * 5 + i * TAU / n; star5(ctx, x + Math.cos(a) * r, y + Math.sin(a) * r * .28, sz, t * 3, '#ffe14d'); } };
const shout = (ctx, str, x, y, size, k, rot = -.08, fill = '#ffe14d') => { if (k <= 0) return; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(backOut(clamp(k)), backOut(clamp(k))); text(ctx, str, 0, 0, size, fill, INK, size * .2); ctx.restore(); };
const zOpts = (k, extra) => C(typeof k === 'object' ? k : ZK[k % ZK.length], extra);
const drink = (rot = 0) => (c, k, h) => { if (k !== 'R') return; c.save(); c.translate(h[0], h[1]); c.rotate(rot); path(c, [[-.03, -.11], [.03, -.11], [.022, 0], [-.022, 0]]); fillStroke(c, '#ffb347', .012); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(-.02, -.1, .012, .08); line(c, .01, -.1, .04, -.17, .01, '#e0392f'); c.beginPath(); c.arc(-.02, -.13, .03, Math.PI, 0); c.closePath(); fillStroke(c, '#ff7eb6', .01); line(c, -.02, -.13, -.02, -.09, .008); c.restore(); };

// 1 — the ship, alone on the ocean
SHOTS.push({ start: 0, end: 3.4, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: kf(lt, [[0, 700], [3.4, 540]]) + hh[0], y: kf(lt, [[0, 880], [3.4, 800]]) + hh[1], z: kf(lt, [[0, 1.7], [3.4, .86]], easeOut), r: Math.sin(t * .4) * .004 };
  skySea(ctx, t, cam, { horizon: 960, sun: [820, 180, 90], seaDepth: 1 });
  applyCam(ctx, cam, 1);
  drawCruise(ctx, 540, 1085, .95, t);
  for (let i = 0; i < 4; i++) { const gx = 200 + i * 190 + Math.sin(t + i) * 30, gy = 430 + (i % 2) * 90 + Math.sin(t * 2 + i) * 10, fl = Math.sin(t * 9 + i) * 10; ctx.beginPath(); ctx.moveTo(gx - 22, gy - fl); ctx.quadraticCurveTo(gx - 8, gy - 12, gx, gy); ctx.quadraticCurveTo(gx + 8, gy - 12, gx + 22, gy - fl); ctx.lineWidth = 5; ctx.strokeStyle = INK; ctx.stroke(); }
} });
// 2 — a porthole: something is wrong inside
SHOTS.push({ start: 3.4, end: 5.75, tr: 'whip', draw(ctx, lt, t) {
  const slap = .95, sh = lt > slap ? Math.max(0, 1 - (lt - slap) * 3.5) : 0, hk = shake(t * 3, 26 * sh, 3), hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + hk[0], y: 900 + hh[1] + hk[1], z: kf(lt, [[0, 1.0], [2.35, 1.16]]), r: sh * .02 };
  applyCam(ctx, cam, 1);
  ctx.fillStyle = lg(ctx, 0, 0, 0, 1920, '#ffffff', '#e4ebf2'); ctx.fillRect(-600, -400, 2300, 2800);
  ctx.fillStyle = '#e23d32'; ctx.fillRect(-600, 1560, 2300, 46); ctx.fillStyle = '#27407a'; ctx.fillRect(-600, 1606, 2300, 900);
  for (let x = -420; x < 1700; x += 480) { line(ctx, x, -400, x, 1560, 5, 'rgba(60,80,110,.25)'); for (let y = -360; y < 1560; y += 90) { circle(ctx, x + 22, y, 6); ctx.fillStyle = 'rgba(60,80,110,.3)'; ctx.fill(); } }
  for (const px of [-140, 1220]) { circle(ctx, px, 900, 262); fillStroke(ctx, '#d9a441', 7); circle(ctx, px, 900, 220); fillStroke(ctx, '#27405f', 7); }
  circle(ctx, 540, 900, 345); fillStroke(ctx, '#d9a441', 8);
  ctx.save(); circle(ctx, 540, 900, 290); ctx.clip();
  ctx.fillStyle = lg(ctx, 0, 600, 0, 1200, '#1b2a3d', '#0e1622'); ctx.fillRect(200, 560, 700, 700);
  glow(ctx, 540, 640, 380, '170,255,120', .25 + .1 * Math.sin(t * 7));
  const rise = kf(lt, [[.15, 720], [.8, 0, backOut]]);
  drawStick(ctx, zOpts(0, { x: 540, y: 1740 + rise, s: 1050, shadow: false, t, headTilt: Math.sin(t * 2) * .05 - .08, face: { mouth: lt > slap ? 'chomp' : 'groan', look: [Math.sin(t * 3) * .5, 0] }, arms: { L: [.4, -.2], R: [.4, -.2] } }));
  // hands slap the glass
  for (const sd of [-1, 1]) { const k = kf(lt, [[slap - .18 + (sd > 0 ? .25 : 0), 0], [slap + (sd > 0 ? .25 : 0), 1, easeIn]]); if (k > 0) { const hx = 540 + sd * 190, hy = lerp(1300, 1010, k); circle(ctx, hx, hy, 46); fillStroke(ctx, INK, 0); for (let i = -2; i <= 2; i++) line(ctx, hx + i * 16, hy - 20, hx + i * 26, hy - 78 + Math.abs(i) * 10, 17, INK); if (k >= 1) { ctx.globalAlpha = .5; ellipse(ctx, hx, hy + 70, 30, 60); ctx.fillStyle = '#9be24a'; ctx.fill(); ctx.globalAlpha = 1; } } }
  ctx.fillStyle = 'rgba(255,255,255,.16)'; path(ctx, [[250, 820], [520, 610], [640, 610], [250, 960]]); ctx.fill();
  ctx.restore(); circle(ctx, 540, 900, 290); fillStroke(ctx, null, 8);
  for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + .2; circle(ctx, 540 + Math.cos(a) * 318, 900 + Math.sin(a) * 318, 13); fillStroke(ctx, '#8a6420', 4); }
  if (lt > slap + .25) { const k = (lt - slap - .25); for (const [a0, L] of [[-2.3, 150], [-1.2, 120], [.4, 130], [2.5, 110]]) { ctx.beginPath(); ctx.moveTo(730, 1010); ctx.lineTo(730 + Math.cos(a0) * L * clamp(k * 6), 1010 + Math.sin(a0) * L * clamp(k * 6)); ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.stroke(); } }
} });
// 3 — you, by the pool
function poolYou(ctx, t, rot, hip, o) { hipStick(ctx, hip[0], hip[1], 560, rot, C(YOU, o)); }
SHOTS.push({ start: 5.75, end: 9.7, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: kf(lt, [[0, 600], [3.95, 500]]) + hh[0], y: kf(lt, [[0, 1020], [3.95, 1130]]) + hh[1], z: kf(lt, [[0, .92], [3.95, 1.22]]), r: 0 };
  setPool(ctx, t, cam);
  drawStick(ctx, C(PAS[0], { x: 1010, y: 1020, s: 250, face: { eyes: 'happy', mouth: 'smile' }, arms: { L: [.3, -.1], R: [2.6 + Math.sin(t * 6) * .2, .3] } }));
  drawStick(ctx, C(PAS[3], { x: 700, y: 1030, s: 250, face: { eyes: 'normal', mouth: 'smile', look: [.6, 0] } }));
  umbrella(ctx, 190, 520, 330, 1640); lounger(ctx, 560, 1650, 1.25);
  box(ctx, 800, 1500, 150, 16, '#fbfbf8', 5, 6); line(ctx, 875, 1516, 875, 1640, 12, INK); line(ctx, 875, 1516, 875, 1640, 5, '#e9eef2'); fruitBowl(ctx, 875, 1500, .6);
  const sip = kf(lt, [[1.9, 0], [2.3, 1], [3.1, 1], [3.5, 0]]);
  poolYou(ctx, t, -.58, [322, 1500], { legs: { L: [-1.0, -.1], R: [1.45, -1.3] }, arms: { L: { ik: [-.2, -.9], bend: 1 }, R: { ik: [lerp(.3, .14, sip), lerp(-.5, -.66, sip)], bend: -1 } }, armLen: 1.15, prop: drink(.58), headTilt: .12, face: { eyes: sip > .5 ? 'happy' : 'half', mouth: sip > .5 ? 'o' : 'smile', blink: blinkAt(t) } });
  palmPot(ctx, 1010, 1820, 1.5, t);
  tint(ctx, '#ffd9a0', .08, 'screen');
} });
// 4 — screaming from the buffet
SHOTS.push({ start: 9.7, end: 11.95, tr: 'whip', draw(ctx, lt, t) {
  const sc = .7, sh = lt > sc ? Math.max(0, 1 - (lt - sc) * 2.5) : 0, hk = shake(t * 3, 16 * sh, 3), hh = handheld(t, 3);
  const cam = { x: kf(lt, [[0, 470], [2.25, 520]]) + hh[0] + hk[0], y: 1080 + hh[1] + hk[1], z: kf(lt, [[0, 1.4], [2.25, 1.5]]), r: 0 };
  setPool(ctx, t, cam);
  const px = kf(lt, [[.9, 1500], [2.25, 380]], x => x); if (lt > .9) runner(ctx, PAS[2], px, 1040, 260, t, { dir: -1, panic: true });
  if (lt > 1.45) zombie(ctx, kf(lt, [[1.45, 1500], [2.25, 1200]], x => x), 1040, 260, t, { dir: -1, kind: 2, sp: 8 });
  umbrella(ctx, 190, 520, 330, 1640); lounger(ctx, 560, 1650, 1.25);
  const up = kf(lt, [[sc, 0], [sc + .22, 1, backOut]]);
  const dk = lt - sc;
  if (dk > 0) { ctx.save(); ctx.translate(520 + dk * 240, 1180 - dk * 900 + dk * dk * 1500); ctx.rotate(dk * 9); path(ctx, [[-17, -62], [17, -62], [12, 0], [-12, 0]]); fillStroke(ctx, '#ffb347', 5); ctx.restore(); for (let i = 0; i < 5; i++) { circle(ctx, 500 + dk * (120 + i * 60), 1150 - dk * (700 - i * 90) + dk * dk * 1500, 11); fillStroke(ctx, '#ffb347', 3); } }
  poolYou(ctx, t, lerp(-.58, -.06, up), [322, 1500], { legs: { L: [-1.0 + up * .1, -.1], R: [1.45, -1.3] }, arms: up > 0 ? { L: [1.2, .9], R: [1.6, -.9] } : { L: { ik: [-.2, -.9], bend: 1 }, R: { ik: [.3, -.5], bend: -1 } }, armLen: 1.15, prop: up > 0 ? null : drink(.58), face: up > 0 ? { eyes: 'wide', mouth: 'o', browUp: 1, look: [1, 0] } : { eyes: 'half', mouth: 'smile' } });
  shout(ctx, 'AAAH!', 800, 560, 130, (lt - sc) * 6, .1); if (lt > sc) for (let i = 0; i < 3; i++) line(ctx, 1010 - i * 4, 660 + i * 34, 1060, 640 + i * 44, 9, INK);
  if (up > 0 && lt < sc + .7) { sweat(ctx, 470, 1010, 26, 1); text(ctx, '!', 250, 900, 120, '#ffe14d', INK, 16); }
} });
// 5 — the first bite
SHOTS.push({ start: 11.95, end: 14.2, tr: 'cut', draw(ctx, lt, t) {
  const bite = 1.25, sh = lt > bite ? Math.max(0, 1 - (lt - bite) * 3) : 0, hk = shake(t * 3, 22 * sh, 3), hh = handheld(t, 3);
  const cam = { x: 520 + hh[0] + hk[0], y: kf(lt, [[0, 1060], [2.25, 1120]]) + hh[1] + hk[1], z: kf(lt, [[0, 1.0], [2.25, 1.22]]), r: sh * .015 };
  setBuffet(ctx, t, cam);
  const zx = kf(lt, [[0, 120], [bite - .1, 350], [bite, 392, easeIn]]);
  const bit = lt > bite;
  drawStick(ctx, C(PAS[1], { x: 650, y: 1590, s: 540, flip: -1, lean: bit ? -.12 : 0, armLen: 1.2, arms: { L: [.5, -.6], R: bit ? { ik: [.36, -.66] } : [.9, -1.6] }, face: bit ? { eyes: 'wide', mouth: 'teeth', browUp: 1, look: [.8, 0] } : { eyes: 'happy', mouth: 'grin' },
    prop: (c, k, h) => { if (k === 'L' && !bit) { ellipse(c, h[0], h[1] - .01, .09, .02); fillStroke(c, '#fbfbf8', .011); circle(c, h[0], h[1] - .045, .035); fillStroke(c, '#c9772e', .011); } } }));
  zombie(ctx, zx, 1590, 540, t, { kind: 1, sp: 5, mouth: bit ? 'chomp' : 'groan', still: bit, extra: bit ? { arms: { L: [-1.2, .5], R: [1.3, -.5] }, lean: .2 } : {} });
  if (bit) { const k = lt - bite; if (k < .5) { ctx.save(); ctx.translate(515, 1150); const s2 = backOut(clamp(k / .12)) * (1 - clamp((k - .32) / .18)); ctx.scale(s2, s2); burst(ctx, 0, 0, 170, 12, '#ffd23a', 7); burst(ctx, 0, 0, 90, 10, '#fff', 9); ctx.restore(); } shout(ctx, 'CHOMP!', 330, 760, 110, k * 6, -.12, '#b6f06a'); sweat(ctx, 800, 1090, 30, 1); }
  diningTable(ctx, 1000, 1900, 1.25);
} });
// 6 — the dining room is chaos
SHOTS.push({ start: 14.2, end: 17.75, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 6);
  const cam = { x: kf(lt, [[0, 420], [3.55, 1250]], x => x) + hh[0], y: 1120 + hh[1], z: kf(lt, [[0, .98], [3.55, .9]]), r: Math.sin(t * 2) * .008 };
  setBuffet(ctx, t, cam);
  // flying food
  const fly = (fn, x0, t0, vx, vy, rot) => { const k = lt - t0; if (k < 0) return; ctx.save(); ctx.translate(x0 + vx * k, 900 - vy * k + 900 * k * k); ctx.rotate(rot * k); fn(); ctx.restore(); };
  fly(() => cake(ctx, 0, 40, .8), 520, .3, 260, 700, 3); fly(() => { ellipse(ctx, 0, 0, 50, 12); fillStroke(ctx, '#fbfbf8', 4); }, 300, .1, 420, 760, 9); fly(() => { ellipse(ctx, 0, 0, 50, 12); fillStroke(ctx, '#fbfbf8', 4); }, 900, 1.0, 300, 820, -8); fly(() => turkey(ctx, 0, 40, .7), 1100, 1.5, 180, 780, 4); fly(() => { circle(ctx, 0, 0, 26); fillStroke(ctx, '#e0392f', 4); }, 700, .7, 520, 600, 5); fly(() => { ellipse(ctx, 0, 0, 50, 12); fillStroke(ctx, '#fbfbf8', 4); }, 1500, 2.0, -200, 800, 7);
  // back row
  runner(ctx, PAS[4], 300 + lt * 420, 1270, 330, t, { panic: true }); zombie(ctx, 60 + lt * 330, 1270, 330, t, { kind: 2, sp: 9 });
  runner(ctx, PAS[3], 2100 - lt * 380, 1300, 340, t + .3, { dir: -1, panic: true }); zombie(ctx, 2420 - lt * 300, 1300, 340, t, { kind: 4, dir: -1, sp: 9 });
  // the bitten passenger turns
  const turn = kf(lt, [[.5, 0], [1.1, 1]]);
  if (turn < 1) drawStick(ctx, C(PAS[1], { x: 650, y: 1590, s: 520, head: mix(HEAD, ZHEAD, turn), headTilt: Math.sin(t * 20) * .08, arms: { L: [.6, -1.9], R: [.6, -1.9] }, face: { eyes: 'spiral', mouth: 'frown', t } }));
  else zombie(ctx, 650 + (lt - 1.1) * 190, 1590, 520, t, { kind: C(ZBASE, { cols: PAS[1].cols, hat: 'hair', hairCol: PAS[1].hairCol, hairStyle: 'spiky', deco: DECO.stains }), sp: 7 });
  if (turn > 0 && turn < 1) puff(ctx, 650, 1150, 150 * turn, t, '#b6f06a', 5, .8 * (1 - turn));
  zombie(ctx, 250 + lt * 210, 1600, 520, t, { kind: 1, sp: 7 });
  // front row
  runner(ctx, PAS[0], 760 + lt * 520, 1680, 560, t, { panic: true }); runner(ctx, PAS[2], 1250 + lt * 430, 1740, 580, t + .2, {});
  zombie(ctx, 1700 + lt * 60, 1640, 540, t, { kind: 5, dir: -1, sp: 6 }); zombie(ctx, -260 + lt * 300, 1760, 600, t, { kind: 3, sp: 8, ph: 2 });
  diningTable(ctx, 1000, 1960, 1.3); diningTable(ctx, 1900, 1940, 1.2);
} });
// 7 — you run
SHOTS.push({ start: 17.75, end: 18.8, tr: 'cut', draw(ctx, lt, t) {
  const P = setCorridor(ctx, t, { dolly: -lt * 5, vy: 760 });
  const hh = handheld(t, 8);
  ctx.setTransform(1, 0, 0, 1, hh[0], hh[1]);
  for (const [zx, zz, k] of [[-.45, 5.2, 0], [.35, 6, 4], [0, 7, 1]]) { const z = zz - lt * .6; const [x, y] = P(zx, 1.75, z); zombie(ctx, x, y, 1000 / z, t, { kind: k, dir: zx > 0 ? -1 : 1, sp: 9 }); }
  const z = 1.75 - lt * .12; const [x, y] = P(Math.sin(t * 7) * .04, 1.75, z);
  drawStick(ctx, C(YOU, { x, y: y - Math.abs(Math.sin(t * 15)) * 30, s: 1150 / z, legs: walkLegs(t, 15, .5), arms: runArms(t, 15), lean: Math.sin(t * 15) * .05, face: { eyes: 'wide', mouth: 'teeth', browUp: 1 } }));
  sweat(ctx, x + 190, y - 640 + lt * 80, 30, 1); sweat(ctx, x - 200, y - 600 + lt * 60, 24, 1);
} });
// 8 — a floating city, and nowhere to go
SHOTS.push({ start: 18.8, end: 23.9, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: kf(lt, [[0, 120], [2.6, 860], [3.4, 560, ease], [5.1, 540]]) + hh[0], y: kf(lt, [[0, 890], [2.6, 880], [5.1, 760]]) + hh[1], z: kf(lt, [[0, 1.25], [2.6, 1.15], [3.9, .45, ease], [5.1, .36]]), r: 0 };
  skySea(ctx, t, cam, { horizon: 1010, seaDepth: 1, clouds: false, sun: [760, 220, 80] });
  applyCam(ctx, cam, 1);
  drawCloud(ctx, -600, 300, 260, 1); drawCloud(ctx, 1500, 100, 300, 2); drawCloud(ctx, 400, -500, 360, 3); drawCloud(ctx, -1100, -300, 300, 4); drawCloud(ctx, 2000, -700, 320, 5);
  const inf = kf(lt, [[.2, .02], [3.6, .92]], x => x);
  drawCruise(ctx, 540, 1160, 1.9, t, { infect: inf });
  // overlay counter
  const a = clamp(lt * 4) * clamp((3.3 - lt) * 4);
  if (a > 0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = a; box(ctx, 190, 300, 700, 250, 'rgba(20,24,38,.88)', 6, 36); text(ctx, 'INFECTED', 540, 365, 54, '#b6f06a'); text(ctx, Math.round(inf * 3200).toLocaleString('en-US'), 540, 462, 118, '#fff'); ctx.restore(); }
  if (lt > 4.0) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const k = clamp((lt - 4.0) * 4); ctx.globalAlpha = k; for (const [ax, ay, rot] of [[250, 1000, Math.PI], [830, 1000, 0], [540, 1210, Math.PI / 2]]) { ctx.save(); ctx.translate(ax + Math.cos(rot) * Math.sin(t * 6) * 12, ay + Math.sin(rot) * Math.sin(t * 6) * 12); ctx.rotate(rot); text(ctx, '?', 0, 0, 0, '#fff'); path(ctx, [[0, -26], [50, 0], [0, 26]]); fillStroke(ctx, '#ffe14d', 7); ctx.restore(); } ctx.restore(); }
} });
// 9 — sprint through the casino
SHOTS.push({ start: 23.9, end: 28.7, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 5);
  const ux = kf(lt, [[0, 150], [4.8, 2650]], x => x);
  const cam = { x: ux + kf(lt, [[0, 260], [4.8, 60]]) + hh[0], y: 1060 + hh[1], z: kf(lt, [[0, .96], [4.8, 1.08]]), r: 0 };
  setCasino(ctx, t, cam);
  for (let i = 0; i < 17; i++) { const sx = -330 + i * 262; if (i % 6 === 5) continue; const d = ux - sx; if (d > -80 && d < 500) { for (let k = 0; k < 4; k++) { const q = (d + 80) / 580 + k * .08; if (q > 1) continue; ellipse(ctx, sx - 40 + k * 28, 1090 - Math.sin(q * Math.PI) * 240 + q * 120, 17, 17 * Math.abs(Math.cos(q * 9 + k))); fillStroke(ctx, '#ffd23a', 4); } sparkle(ctx, sx + 60, 650, 44 * Math.abs(Math.sin(t * 9 + i)), 1); } }
  zombie(ctx, ux - 760 + lt * 20, 1560, 500, t, { kind: 0, sp: 8 }); zombie(ctx, ux - 980 + lt * 30, 1600, 520, t, { kind: 3, sp: 8, ph: 2 });
  runner(ctx, YOU, ux, 1580, 520, t, { face: { eyes: 'wide', mouth: 'teeth', browUp: 1, look: [.3, 0] } });
  for (let i = 0; i < 3; i++) puff(ctx, ux - 130 - i * 90, 1570, 34 - i * 6, t, '#f1d9c9', 3 + i + Math.floor(t * 8), .5 - i * .14);
  casinoFG(ctx, t, cam);
} });
// 10 — the infected stumble after you
SHOTS.push({ start: 28.7, end: 31.1, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 4);
  const cam = { x: kf(lt, [[0, 1700], [2.4, 1900]]) + hh[0], y: 1080 + hh[1], z: kf(lt, [[0, 1.08], [2.4, 1.18]]), r: 0 };
  setCasino(ctx, t, cam);
  zombie(ctx, 1250 + lt * 80, 1500, 440, t, { kind: 4, ph: 1 }); zombie(ctx, 1520 + lt * 85, 1530, 470, t, { kind: 5, ph: 3 });
  // one trips
  const trip = 1.15, k = clamp((lt - trip) / .35);
  if (lt < trip) zombie(ctx, 1700 + lt * 150, 1640, 540, t, { kind: 2, sp: 6 });
  else { hipStick(ctx, 1700 + trip * 150 + k * 190, 1640 - 160 * (1 - k) - 40, 540, easeIn(k) * 1.5, zOpts(2, { t, arms: { L: [-2.4, .2], R: [2.6, -.2] }, legs: { L: [.3 + Math.sin(t * 14) * .3, -.2], R: [.2 - Math.sin(t * 14) * .3, -.2] }, face: { mouth: 'groan' } })); if (k >= 1) stars(ctx, 2290, 1500, t, 110); if (lt - trip < .5 && k >= 1) puff(ctx, 2250, 1640, 80, t, '#f1d9c9', 4, 1 - (lt - trip - .35) * 6); }
  zombie(ctx, 1960 + lt * 90, 1600, 520, t, { kind: 0, ph: 2 }); zombie(ctx, 2230 + lt * 95, 1680, 560, t, { kind: 1, ph: 4 });
  ropePost(ctx, 1905, 1700);
  casinoFG(ctx, t, cam);
} });
// 11 — the good news
SHOTS.push({ start: 31.1, end: 32.6, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 1130 + hh[0], y: 620 + hh[1], z: kf(lt, [[0, 1.7], [1.5, 1.85]]), r: 0 };
  blurLayer(ctx, 4, c => setStairs(c, t, cam));
  applyCam(ctx, cam, 1);
  const up = kf(lt, [[.15, 0], [.45, 1, backOut]]);
  drawStick(ctx, C(YOU, { x: 1130, y: 968, s: 520, armLen: 1.15, arms: { L: [.9, -2.1], R: { ik: [lerp(.2, .2, up), lerp(-.3, -.86, up)], bend: -1 } }, face: { eyes: 'normal', mouth: 'grin', browOne: 1, blink: blinkAt(t) }, headTilt: .06 }));
  sparkle(ctx, 1250, 470, 50 * kf(lt, [[.4, 0], [.6, 1], [1.1, 0]]), 1);
  blurLayer(ctx, 3, c => { applyCam(c, cam, 1); stairRail(c); });
} });
// 12 — terrible at stairs
const stairY = x => x < STAIR.x0 ? STAIR.y0 : STAIR.y0 - Math.min(STAIR.n, Math.floor((x - STAIR.x0) / STAIR.w) + 1) * STAIR.h;
SHOTS.push({ start: 32.6, end: 37.1, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const bonk = 2.15, sh = lt > bonk ? Math.max(0, 1 - (lt - bonk) * 4) : 0, hk = shake(t * 3, 14 * sh, 3);
  const cam = { x: kf(lt, [[0, 470], [4.5, 420]]) + hh[0] + hk[0], y: kf(lt, [[0, 1010], [4.5, 1050]]) + hh[1] + hk[1], z: kf(lt, [[0, .88], [4.5, .96]]), r: 0 };
  setStairs(ctx, t, cam);
  // you, safe at the top
  drawStick(ctx, C(YOU, { x: 1010, y: 968, s: 400, flip: -1, arms: { L: [.5, -.4], R: [2.5 + Math.sin(t * 7) * .25, .4] }, face: { eyes: 'half', mouth: 'smirk', look: [.6, .6] } }));
  // zombie A: two steps up, then all the way back down
  { const s = 430; if (lt < 1.0) { const x = kf(lt, [[0, -160], [1.0, 290]], q => q); zombie(ctx, x, stairY(x), s, t, { kind: 4, sp: 7 }); }
    else { const k = clamp((lt - 1.0) / .9); const x = lerp(290, -40, k), y = lerp(stairY(290), 1640, easeIn(k)) - Math.abs(Math.sin(k * 9)) * 60 * (1 - k); hipStick(ctx, x, y - 60, s, -k * 7.85, zOpts(4, { t, arms: { L: [2.2, .3], R: [2.4, .3] }, legs: { L: [.6, -.8], R: [.3, -.5] } })); if (k >= 1) stars(ctx, -150, 1500, t, 90, 3, 22); } }
  // zombie B: straight into the post
  { const s = 450; if (lt > 1.2 && lt < bonk) { zombie(ctx, kf(lt, [[1.2, -420], [bonk, 20]], q => q), 1680, s, t, { kind: 5, sp: 8 }); }
    else if (lt >= bonk) { const k = clamp((lt - bonk) / .4); hipStick(ctx, 20 - k * 150, 1680 - s * .3 + easeIn(k) * (s * .3 - 40), s, -easeIn(k) * 1.5, zOpts(5, { t, arms: { L: [1.4, .2], R: [1.2, .2] }, legs: { L: [.2, -.1], R: [.5, -.6] } })); if (lt - bonk < .45) { ctx.save(); ctx.translate(110, 1330); const s2 = backOut(clamp((lt - bonk) / .1)) * (1 - clamp((lt - bonk - .3) / .15)); ctx.scale(s2, s2); burst(ctx, 0, 0, 130, 11, '#ffd23a', 4); ctx.restore(); shout(ctx, 'BONK', 250, 1180, 80, (lt - bonk) * 8 * (lt - bonk < .45 ? 1 : 0), -.1); } else stars(ctx, -330, 1560, t, 90, 3, 22); } }
  // zombie C: gets halfway, lies down, slides back
  { const s = 430; if (lt > 2.3 && lt < 3.5) { const x = kf(lt, [[2.3, -300], [3.5, 470]], q => q); zombie(ctx, x, stairY(x), s, t, { kind: 1, sp: 8 }); }
    else if (lt >= 3.5) { const k = clamp((lt - 3.5) / .3), sl = clamp((lt - 3.85) / .65); const x = lerp(470, 250, easeIn(sl)); hipStick(ctx, x + k * 60, STAIR.y0 - ((x + k * 60 - STAIR.x0) / STAIR.w) * STAIR.h - lerp(s * .3, 46, k), s, k * 2.36, zOpts(1, { t, arms: { L: [2.6, .2], R: [2.7, .2] }, legs: { L: [.2 + Math.sin(t * 12) * .25, -.1], R: [.2 - Math.sin(t * 12) * .25, -.1] } })); } }
  stairRail(ctx);
  if (lt > 3.0) shout(ctx, 'ha!', 820, 500, 70, (lt - 3.0) * 6, .08, '#fff');
} });

// 13 — race down to the lower decks
SHOTS.push({ start: 37.1, end: 39.3, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 5), ux = kf(lt, [[0, 100], [2.2, 1420]], x => x);
  const cam = { x: ux + 200 + hh[0], y: 1000 + hh[1], z: 1.0, r: 0 };
  setSteel(ctx, t, cam);
  for (const [sx, n] of [[250, 3], [900, 2], [1560, 1]]) { stencil(ctx, 'DECK ' + n, sx, 700, 90); path(ctx, [[sx + 200, 660], [sx + 260, 660], [sx + 230, 740]]); ctx.fillStyle = 'rgba(244,241,228,.8)'; ctx.fill(); }
  wtFrame(ctx, 2150, 1250, .95); wtSlab(ctx, 2150, 1250, .95, { open: 1 });
  zombie(ctx, ux - 640, 1560, 500, t, { kind: 0, sp: 8 }); zombie(ctx, ux - 860, 1600, 520, t, { kind: 5, sp: 8, ph: 2 }); zombie(ctx, ux - 1040, 1540, 500, t, { kind: 3, sp: 8, ph: 4 });
  runner(ctx, YOU, ux, 1580, 520, t, {});
  for (let i = 0; i < 3; i++) puff(ctx, ux - 130 - i * 90, 1570, 34 - i * 6, t, '#c9d3da', 3 + i + Math.floor(t * 8), .5 - i * .14);
} });
// 14 — slam the steel door, spin the wheel
function doorScene(ctx, lt, t, cam, o) {
  setSteel(ctx, t, cam, { back: 1560 });
  stencil(ctx, 'DECK 1', 150, 760, 80);
  wtFrame(ctx, 540, 1560, 1.2);
  if (o.open > 0) { ctx.save(); wtClip(ctx, 540, 1560, 1.2); glow(ctx, 540, 1000, 500, '255,90,60', .3); zombie(ctx, 470, 1570, 560, t, { kind: 0, sp: 7, still: true }); zombie(ctx, 640, 1590, 560, t, { kind: 5, sp: 8, ph: 2, still: true }); zombie(ctx, 380, 1600, 520, t, { kind: 3, sp: 6, ph: 4, still: true }); ctx.restore(); }
  wtSlab(ctx, 540, 1560, 1.2, o);
}
SHOTS.push({ start: 39.3, end: 43.4, tr: 'cut', draw(ctx, lt, t) {
  const slam = .9, bangs = [1.4, 1.85, 2.3], lock = 3.5;
  let sh = 0; for (const b of [slam, ...bangs, lock]) if (lt > b) sh += Math.max(0, 1 - (lt - b) * (b === slam ? 2.5 : 5)) * (b === slam ? 1.6 : .6);
  const hk = shake(t * 3, 20 * sh, 3), hh = handheld(t, 3);
  const cam = { x: 560 + hh[0] + hk[0], y: kf(lt, [[0, 1040], [4.1, 1080]]) + hh[1] + hk[1], z: kf(lt, [[0, .96], [4.1, 1.1]]), r: 0 };
  const open = kf(lt, [[0, 1], [slam - .16, .95], [slam, 0, easeIn]]);
  const spin = kf(lt, [[2.6, 0], [lock, 11, easeOut]]);
  doorScene(ctx, lt, t, cam, { open, spin, dents: [[120, -470, 40, (lt - bangs[0]) * 8], [270, -190, 46, (lt - bangs[1]) * 8], [110, -150, 34, (lt - bangs[2]) * 8]] });
  const pushing = lt < slam, turning = lt > 2.5 && lt < lock;
  const wa = spin + .6;
  drawStick(ctx, C(YOU, { x: 850, y: 1620, s: 560, armLen: 1.25, lean: pushing ? -.2 : turning ? -.08 : .02,
    arms: pushing ? { L: { ik: [-.3, -.62] }, R: { ik: [-.2, -.5], bend: -1 } } : turning ? { L: { ik: [-.38 + Math.cos(wa) * .05, -.72 + Math.sin(wa) * .09] }, R: { ik: [-.26 - Math.cos(wa) * .05, -.6 - Math.sin(wa) * .09], bend: -1 } } : lt >= lock ? { L: [.35, -.2], R: [2.6, .3] } : { L: { ik: [-.32, -.55] }, R: { ik: [-.25, -.45], bend: -1 } },
    face: lt >= lock ? { eyes: 'happy', mouth: 'grin' } : { eyes: 'squint', mouth: 'teeth', browAng: .3 } }));
  if (lt > slam && lt < slam + .5) { const k = lt - slam; ctx.save(); ctx.translate(760, 900); const s2 = backOut(clamp(k / .12)) * (1 - clamp((k - .3) / .2)); ctx.scale(s2, s2); burst(ctx, 0, 0, 200, 12, '#ffd23a', 7); ctx.restore(); }
  shout(ctx, 'SLAM!', 300, 520, 130, (lt - slam) * 7 * (lt < slam + .9 ? 1 : 0), -.1);
  bangs.forEach((b, i) => { if (lt > b && lt < b + .4) shout(ctx, 'bang', [380, 700, 330][i], [820, 1160, 1200][i], 60, (lt - b) * 9, [-.1, .1, -.05][i], '#fff'); });
  if (lt > lock) { shout(ctx, 'CLUNK', 300, 520, 110, (lt - lock) * 7, -.08, '#b6f06a'); sparkle(ctx, 540, 1164, 90 * kf(lt, [[lock, 0], [lock + .15, 1], [lock + .55, 0]]), 1); }
  if (!pushing && lt < lock) sweat(ctx, 1000, 1150, 28, 1);
} });
// 15 — now you need supplies
SHOTS.push({ start: 43.4, end: 45.3, tr: 'whip', draw(ctx, lt, t) {
  const b = [.5, 1.3], sh = b.reduce((a, x) => a + (lt > x ? Math.max(0, 1 - (lt - x) * 5) : 0), 0), hk = shake(t * 3, 10 * sh, 3), hh = handheld(t, 3);
  const cam = { x: 760 + hh[0] + hk[0], y: 1060 + hh[1] + hk[1], z: kf(lt, [[0, 1.3], [1.9, 1.42]]), r: 0 };
  doorScene(ctx, lt, t, cam, { open: 0, spin: 11, dents: [[120, -470, 40, 1], [270, -190, 46, 1], [110, -150, 34, 1], [250, -520, 30, (lt - b[0]) * 8], [150, -300, 36, (lt - b[1]) * 8]] });
  drawStick(ctx, C(YOU, { x: 850, y: 1620, s: 560, armLen: 1.15, arms: { L: [.35, -.2], R: { ik: [.2, -.56], bend: -1 } }, headTilt: .08, face: { eyes: 'normal', mouth: 'o', look: [.5, -.8], browOne: 1 } }));
  // thought bubble
  const k = backOut(clamp((lt - .25) * 4));
  for (const [bx, by, r] of [[1010, 1010, 16], [1050, 950, 24]]) { circle(ctx, bx, by, r * k); fillStroke(ctx, '#fff', 5); }
  ctx.save(); ctx.translate(1150, 800); ctx.scale(k, k); ellipse(ctx, 0, 0, 170, 125); fillStroke(ctx, '#fff', 6); can(ctx, -80, 50, 70, 100, '#e0392f'); medkit(ctx, 60, 44, .7); text(ctx, '+', -8, -2, 60, INK); ctx.restore();
} });
// 16 — the galley
SHOTS.push({ start: 45.3, end: 49.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: kf(lt, [[0, 380], [3.9, 1900]]) + hh[0], y: kf(lt, [[0, 900], [3.9, 860]]) + hh[1], z: kf(lt, [[0, 1.02], [3.9, .96]]), r: 0 };
  setKitchen(ctx, t, cam);
  const ux = cam.x - 330;
  drawStick(ctx, C(YOU, { x: ux, y: 1440 - Math.abs(Math.sin(t * 7)) * 12, s: 430, legs: walkLegs(t, 7, .4), arms: { L: [1.0, 1.0], R: [1.0, -1.6] }, face: { eyes: 'wide', mouth: 'grin', look: [.6, -.5], browUp: 1 } }));
  for (let i = 0; i < 5; i++) sparkle(ctx, cam.x - 250 + i * 190, 420 + (i % 2) * 230, 40 * Math.abs(Math.sin(t * 4 + i * 1.3)), 1);
} });
// 17 — grab everything you can carry
SHOTS.push({ start: 49.2, end: 51.7, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: 1960 + hh[0], y: kf(lt, [[0, 1000], [2.5, 900]]) + hh[1], z: kf(lt, [[0, 1.12], [2.5, .98]]), r: 0 };
  blurLayer(ctx, 3, c => setKitchen(c, t, cam)); applyCam(ctx, cam, 1);
  const ux = 1960 + kf(lt, [[1.9, 0], [2.5, 120]], easeIn), sway = Math.sin(t * 3.2) * .05 * clamp(lt);
  drawStick(ctx, C(YOU, { x: ux, y: 1560, s: 480, armLen: 1.2, lean: sway * .5, arms: { L: { ik: [-.16, -1.02] }, R: { ik: [.16, -1.02], bend: -1 } }, legs: lt > 1.9 ? walkLegs(t, 9, .4) : { L: [.2, -.1], R: [.2, -.1] }, face: { eyes: 'squint', mouth: 'teeth', browAng: .25 } }));
  ctx.save(); ctx.translate(ux, 1560 - 1.04 * 480); ctx.rotate(sway);
  box(ctx, -150, -16, 300, 22, '#b9c4cc', 5, 8);
  const items = [() => { drawCrate(ctx, 0, 0, 200, 110, 0, 'FOOD'); return 110; }, () => { can(ctx, -52, 0, 70, 96, '#e0392f'); can(ctx, 30, 0, 70, 96, '#3fa35b'); return 100; }, () => { ellipse(ctx, 0, -56, 96, 56); fillStroke(ctx, '#3fa35b', 5); for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.ellipse(0, -56, Math.abs(i) * 50 + 14, 56, 0, 0, TAU); ctx.lineWidth = 4; ctx.strokeStyle = '#1f6b3a'; ctx.stroke(); } return 108; }, () => { path(ctx, [[-80, 0], [80, 0], [70, -64]]); fillStroke(ctx, '#ffd23a', 5); for (const [hx, hy] of [[-20, -14], [30, -22], [50, -44]]) { circle(ctx, hx, hy, 8); ctx.fillStyle = '#e8a91e'; ctx.fill(); } return 62; }, () => { jar(ctx, -40, 0, 60, 90, '#8e44ad'); jar(ctx, 34, 0, 60, 90, '#ff9a2e'); return 100; }, () => { ctx.save(); ctx.rotate(-.12); box(ctx, -130, -44, 260, 44, '#e2a85a', 5, 22); for (let k = 0; k < 5; k++) line(ctx, -90 + k * 44, -36, -70 + k * 44, -10, 4, '#b87a34'); ctx.restore(); return 50; }, () => { cake(ctx, 0, 0, .75); return 120; }];
  let y = -16; items.forEach((fn, i) => { const k = clamp((lt - .1 - i * .2) / .16); if (k <= 0) return; ctx.save(); ctx.translate(Math.sin(i * 2.3) * 14, y); ctx.rotate(sway * (i + 1) * .5 + Math.sin(i * 1.7) * .04); ctx.scale(backOut(k), backOut(k)); const h = fn(); ctx.restore(); y -= h; });
  ctx.restore();
  sweat(ctx, ux + 150, 1130, 26, clamp(lt - .8)); sweat(ctx, ux - 160, 1160, 22, clamp(lt - 1.2));
} });
// 18 — the medical bay: bandages, medicine
SHOTS.push({ start: 51.7, end: 55.1, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3);
  const cam = { x: kf(lt, [[0, 420], [3.4, 640]]) + hh[0], y: 880 + hh[1], z: kf(lt, [[0, .9], [3.4, 1.0]]), r: 0 };
  setMed(ctx, t, cam);
  const ux = kf(lt, [[0, -150], [1.0, 280]], easeOut), g1 = 1.95, g2 = 2.7;
  const fly = (t0, from, fn) => { const k = clamp((lt - t0) / .45); if (lt < t0 - .3) return; if (k <= 0) { sparkle(ctx, from[0] + 30, from[1] - 40, 60 * clamp((lt - t0 + .3) * 4), 1); return; } if (k >= 1) return; ctx.save(); ctx.translate(lerp(from[0], ux + 40, k), lerp(from[1], 1090, k) - Math.sin(k * Math.PI) * 220); ctx.rotate(k * 5); fn(); ctx.restore(); };
  const got = (lt > g1 + .45 ? 1 : 0) + (lt > g2 + .45 ? 1 : 0);
  drawStick(ctx, C(YOU, { x: ux, y: 1500 - (lt < 1 ? Math.abs(Math.sin(t * 9)) * 12 : 0), s: 460, armLen: 1.15, legs: lt < 1 ? walkLegs(t, 9, .4) : { L: [.14, -.05], R: [.14, -.05] }, arms: lt > 1.5 ? { L: [1.2, 1.2], R: { ik: [.2, -.6 - .08 * Math.sin(t * 5)], bend: -1 } } : { L: [.3, -.2], R: [.5, -.4] }, face: { eyes: 'wide', mouth: 'grin', look: [.8, -.5], browUp: 1 },
    prop: (c, k, h) => { if (k !== 'R' || !got) return; c.save(); c.translate(h[0], h[1]); c.scale(1 / 460, 1 / 460); bandage(c, -6, 0, 30); if (got > 1) bottle(c, 46, 4, 80, '#8e44ad'); c.restore(); } }));
  fly(g1, [590, 640], () => bandage(ctx, 0, 30, 30)); fly(g2, [540, 440], () => bottle(ctx, 0, 40, 80, '#8e44ad'));
} });
// 19 — one very nervous doctor
SHOTS.push({ start: 55.1, end: 57.4, tr: 'whip', draw(ctx, lt, t) {
  const hh = handheld(t, 3), op = kf(lt, [[.5, 0], [.8, 1, easeOut]]);
  const cam = { x: 1700 + hh[0], y: 900 + hh[1], z: kf(lt, [[0, .98], [2.3, 1.14]]), r: 0 };
  setMed(ctx, t, cam);
  const j = Math.sin(t * 46) * 5;
  drawStick(ctx, C(DOC, { x: 1800 + j, y: 1500, s: 470, armLen: 1.1, legs: { L: [.02 + Math.sin(t * 40) * .05, .12], R: [.02 - Math.sin(t * 40) * .05, .12] }, arms: { L: { ik: [-.1, -.52] }, R: { ik: [.1, -.52], bend: -1 } }, headTilt: Math.sin(t * 40) * .03, face: { eyes: 'wide', mouth: 'teeth', browUp: 1, browAng: -.3, look: [-.7, 0] },
    prop: (c, k, h) => { if (k !== 'R') return; c.save(); c.translate(-.0, h[1] + .02); box(c, -.11, -.15, .22, .28, '#c98a4f', .012, .015); box(c, -.09, -.12, .18, .23, '#fbfbf8', .008, .005); for (let i = 0; i < 4; i++) line(c, -.06, -.07 + i * .045, .06, -.07 + i * .045, .008, '#8b96a3'); box(c, -.04, -.17, .08, .035, '#8b96a3', .01, .008); c.restore(); } }));
  if (op > 0) { sweat(ctx, 1930, 1040 + ((t * 80) % 60), 24, 1); sweat(ctx, 1660, 1070 + ((t * 80 + 30) % 60), 20, 1); }
  curtain(ctx, 1330, lerp(2160, 1470, op), 262, 1150, t, op > 0 ? 0 : 5);
  const ux = kf(lt, [[0, 1150], [.5, 1330]], easeOut);
  drawStick(ctx, C(YOU, { x: ux, y: 1520, s: 470, armLen: 1.2, arms: { L: [.3, -.2], R: op > 0 && lt > 1.1 ? [.5, -.3] : { ik: [.28, -.75], bend: -1 } }, face: op > 0 ? { eyes: 'normal', mouth: 'smile', look: [1, 0], browOne: 1 } : { eyes: 'normal', mouth: 'flat', look: [1, 0] } }));
  if (op >= 1 && lt < 1.5) text(ctx, '!', 1800, 880, 110, '#ffe14d', INK, 16);
} });
// 20 — the climb to the bridge
SHOTS.push({ start: 57.4, end: 61.4, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), p = kf(lt, [[0, .02], [3.5, 1]], x => x);
  const [ux, uy, ud] = climbPt(p), [dx, dy, dd] = climbPt(p - .075);
  const cam = { x: 540 + hh[0], y: uy - 260 + hh[1], z: kf(lt, [[0, .82], [4, .95]]), r: 0 };
  setTower(ctx, t, cam);
  runner(ctx, DOC, dx, dy, 200, t + .4, { dir: dd, sp: 13 }); runner(ctx, YOU, ux, uy, 200, t, { dir: ud, sp: 13 });
  towerRails(ctx);
} });
// 21 — the captain is not feeling like himself
SHOTS.push({ start: 61.4, end: 64.0, tr: 'cut', draw(ctx, lt, t) {
  const rv = .95, sh = lt > rv ? Math.max(0, 1 - (lt - rv) * 3) : 0, hk = shake(t * 3, 18 * sh, 3), hh = handheld(t, 3);
  const cam = { x: 560 + hh[0] + hk[0], y: 900 + hh[1] + hk[1], z: kf(lt, [[0, 1.0], [rv, 1.04], [2.6, 1.2]]), r: 0 };
  setBridge(ctx, t, cam);
  shipWheel(ctx, 470, 800, 125, lt < rv ? Math.sin(t * 1.5) * .3 : lt * 3);
  const flipK = clamp((lt - rv) / .22), zs = kf(lt, [[rv, 520], [2.6, 600]]);
  ctx.save(); ctx.translate(470, 0); ctx.scale(Math.abs(1 - 2 * flipK) * .96 + .04, 1); ctx.translate(-470, 0);
  if (flipK < .5) drawStick(ctx, C(ZCAPT, { x: 470, y: 1350, s: 520, sil: '#151b2a', zombie: false, arms: { L: [.9, -1.3], R: [.9, -1.3] } }));
  else zombie(ctx, 470 + (lt - rv) * 50, 1350 + (lt - rv) * 30, zs, t, { kind: ZCAPT, sp: 5, mouth: 'chomp' });
  ctx.restore();
  if (flipK < .5) { ctx.save(); ctx.translate(470, 1350); ctx.scale(520, 520); HATS.cap(ctx, 0, -.765, .19, .017); ctx.restore(); }
  const jump = lt > rv ? Math.max(0, Math.sin((lt - rv) * 9)) * 60 * Math.max(0, 1 - (lt - rv) * 1.4) : 0, sc = lt > rv;
  drawStick(ctx, C(YOU, { x: 860, y: 1430 - jump, s: 400, arms: sc ? panicArms(t) : { L: [.3, -.2], R: [2.6 + Math.sin(t * 8) * .2, .3] }, face: sc ? { eyes: 'wide', mouth: 'teeth', browUp: 1, look: [-.8, 0] } : { eyes: 'happy', mouth: 'grin' } }));
  drawStick(ctx, C(DOC, { x: 1010, y: 1450 - jump * .8, s: 400, arms: sc ? panicArms(t + .2) : { L: [.3, -.2], R: [.3, -.2] }, face: sc ? { eyes: 'wide', mouth: 'o', browUp: 1, look: [-.8, 0] } : { eyes: 'normal', mouth: 'smile', look: [-.6, 0] } }));
  if (!sc) shout(ctx, 'captain!', 900, 930, 56, lt * 6, -.05, '#fff');
  if (sc && lt < rv + .7) { text(ctx, '!!', 930, 900, 120, '#ffe14d', INK, 16); tint(ctx, '#b6f06a', .25 * sh, 'screen'); }
} });
// 22 — the radio still works
SHOTS.push({ start: 64.0, end: 67.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), call = 2.1;
  const cam = { x: kf(lt, [[0, 1180], [3.2, 1260]]) + hh[0], y: 800 + hh[1], z: kf(lt, [[0, 1.12], [3.2, 1.26]]), r: 0 };
  setBridge(ctx, t, cam);
  // the captain keeps walking into the window
  const bx = 800 - Math.abs(Math.sin(t * 2.4)) * 40; zombie(ctx, bx, 1240, 330, t, { kind: ZCAPT, dir: -1, sp: 7 }); if (Math.abs(Math.sin(t * 2.4)) < .25) stars(ctx, bx - 90, 960, t, 50, 3, 14);
  radio(ctx, 1380, 850, t, lt > .4 ? 1 : 0);
  for (let i = 0; i < 3; i++) { const k = ((t * .9 + i / 3) % 1); if (lt < .5) break; ctx.beginPath(); ctx.arc(1570, 380, 40 + k * 190, -2.3, -.4); ctx.lineWidth = 10; ctx.strokeStyle = `rgba(255,225,77,${1 - k})`; ctx.stroke(); }
  drawStick(ctx, C(YOU, { x: 1110, y: 1340, s: 440, armLen: 1.2, arms: { L: [.5, -.5], R: { ik: [.13, -.63], bend: -1 } }, headTilt: .05, face: { eyes: 'wide', mouth: Math.sin(t * 16) > 0 ? 'o' : 'grin', look: [.8, 0], browUp: 1 },
    prop: (c, k, h) => { if (k !== 'R') return; box(c, h[0] - .028, h[1] - .11, .056, .1, '#2b3440', .011, .02); for (let i = 0; i < 3; i++) line(c, h[0] - .016, h[1] - .09 + i * .022, h[0] + .016, h[1] - .09 + i * .022, .006, '#8b96a3'); c.beginPath(); c.moveTo(h[0], h[1]); for (let i = 1; i <= 10; i++) c.lineTo(h[0] + i * .045 + (i % 2) * .012, h[1] + .1 + Math.sin(i * .6) * .12 + (i % 2) * .03); c.lineWidth = .009; c.strokeStyle = INK; c.stroke(); } }));
  drawStick(ctx, C(DOC, { x: 1640, y: 1360, s: 430, flip: -1, arms: { L: [.4, -.3], R: { ik: [.05, -.66], bend: -1 } }, headTilt: Math.sin(t * 30) * .02, face: { eyes: 'wide', mouth: 'teeth', look: [.9, 0], browUp: 1 } }));
  if (lt > call) { 'SOS'.split('').forEach((ch, i) => shout(ctx, ch, 1280 + i * 110, 470 - i * 30, 110, (lt - call - i * .12) * 8, -.1 + i * .08)); }
} });
// 23 — the door starts to bend
SHOTS.push({ start: 67.2, end: 70.2, tr: 'cut', draw(ctx, lt, t) {
  const bangs = [.25, .7, 1.15, 1.55, 1.95, 2.35], found = 1.9;
  let sh = 0; for (const b of bangs) if (lt > b) sh += Math.max(0, 1 - (lt - b) * 5);
  const hk = shake(t * 3, 22 * sh, 3), hh = handheld(t, 3);
  const cam = { x: 540 + hh[0] + hk[0], y: kf(lt, [[0, 1000], [3, 960]]) + hh[1] + hk[1], z: kf(lt, [[0, .98], [3, 1.08]]), r: sh * .01 };
  setSteel(ctx, t, cam, { back: 1500, w1: '#2c3852', w2: '#46557a' });
  sign(ctx, 'BRIDGE', 540, 470, 60, '#fbfbf8', '#1f2c52');
  wtFrame(ctx, 540, 1500, 1.25);
  // fingers through the gaps
  if (lt > found) { const k = clamp((lt - found) * 5); for (const [fx, fy, sd] of [[292, 900, -1], [292, 1200, -1], [788, 800, 1], [788, 1090, 1], [788, 1330, 1]]) for (let i = 0; i < 4; i++) { line(ctx, fx, fy + i * 22, fx - sd * (40 + Math.sin(t * 12 + i + fy) * 12) * k, fy + i * 22 - 8, 15, INK); } }
  wtSlab(ctx, 540, 1500, 1.25, { col: '#8493ad', bulge: clamp(lt / 2.4) + sh * .4, spin: 11, glass: lt > found ? '#3a5a22' : '#17202c',
    window: lt > found ? (c) => { circle(c, 190, -566, 22); c.fillStyle = '#f4f0b8'; c.fill(); circle(c, 194 + Math.sin(t * 5) * 6, -566, 7); c.fillStyle = INK; c.fill(); } : null,
    dents: bangs.map((b, i) => [[110, 280, 170, 300, 90, 230][i], [-480, -420, -220, -130, -300, -560][i], [44, 38, 50, 40, 36, 34][i], (lt - b) * 8]) });
  bangs.forEach((b, i) => { if (lt > b && lt < b + .35) shout(ctx, i % 2 ? 'BANG' : 'THUD', [250, 820, 300, 800, 240, 830][i], [700, 880, 1150, 620, 950, 1180][i], 70, (lt - b) * 9, i % 2 ? .1 : -.1, i % 2 ? '#fff' : '#ffe14d'); });
  if (lt > 1.2) { const k = lt - 1.2; ctx.save(); ctx.translate(790 + k * 300, 760 - k * 500 + k * k * 900); ctx.rotate(k * 12); box(ctx, -16, -22, 32, 44, '#5d6b78', 4, 6); ctx.restore(); }
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const lk = lt > found ? [0, -1] : [Math.sin(t * 3) * .5, -.6];
  drawStick(ctx, C(YOU, { x: 250, y: 2440 + hk[1], s: 1000, shadow: false, headTilt: .06, face: { eyes: 'wide', mouth: 'teeth', browUp: 1, look: lk }, arms: { L: [.3, -.2], R: [.3, -.2] } }));
  drawStick(ctx, C(DOC, { x: 840, y: 2470 - hk[1], s: 980, shadow: false, headTilt: -.06 + Math.sin(t * 40) * .01, face: { eyes: 'wide', mouth: 'o', browUp: 1, look: lk }, arms: { L: [.3, -.2], R: [.3, -.2] } }));
} });
// 24 — only one move left
SHOTS.push({ start: 70.2, end: 72.1, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), pt = kf(lt, [[.55, 0], [.85, 1, backOut]]);
  const cam = { x: kf(lt, [[0, 1440], [1.9, 1520]]) + hh[0], y: 850 + hh[1], z: kf(lt, [[0, 1.15], [1.9, 1.28]]), r: 0 };
  setBridge(ctx, t, cam, { outside: (c) => { line(c, 950, 200, 950, 470, 6, INK); line(c, 1150, 200, 1150, 470, 6, INK); lifeboat(c, 1050, 490, .42); glow(c, 1050, 520, 260, '255,200,120', .35 * pt); sparkle(c, 1180, 440, 60 * pt * (.7 + .3 * Math.sin(t * 9)), 1); } });
  drawStick(ctx, C(DOC, { x: 1250, y: 1440, s: 450, arms: { L: [.5, -1.8], R: [.5, -1.8] }, headTilt: Math.sin(t * 30) * .02, face: { eyes: 'wide', mouth: 'frown', browUp: 1, look: [pt, -pt * .6] } }));
  drawStick(ctx, C(YOU, { x: 1450, y: 1430, s: 460, armLen: 1.2, arms: { L: [.9, -2.1], R: pt > 0 ? { ik: [lerp(.2, .34, pt), lerp(-.5, -.8, pt)], bend: -1 } : [.3, -.2] }, face: { eyes: 'normal', mouth: pt > .5 ? 'grin' : 'flat', browAng: .3, look: [pt, -pt * .5] } }));
} });
// 25 — the lifeboat: run, climb in, cut the rope
SHOTS.push({ start: 72.1, end: 75.5, tr: 'cut', draw(ctx, lt, t) {
  const snap = 2.78, hopY = 1.45, hopD = 1.7, hd = .42, land = snap + .47;
  const fall = lt > snap ? Math.min(1200, 5500 * (lt - snap) * (lt - snap)) : 0, by = 1130 + fall, landed = lt > land;
  const sh = landed ? Math.max(0, 1 - (lt - land) * 5) : 0, hk = shake(t * 3, 20 * sh, 3), hh = handheld(t, 4);
  const cam = { x: kf(lt, [[0, 260], [1.6, 780]]) + hh[0] + hk[0], y: kf(lt, [[0, 960], [1.6, 900]]) + fall * .93 + hh[1] + hk[1], z: kf(lt, [[0, .9], [1.6, .84]]), r: 0 };
  setBoatDeck(ctx, t, cam);
  // zombies pile up at the rail
  for (const [off, k, ph] of [[620, 0, 0], [800, 5, 2], [960, 2, 4], [1130, 4, 1]]) { const zx = Math.min(540 - (off - 620) * .32, -500 + lt * 520 - (off - 620)); zombie(ctx, zx, 1150, 300, t, { kind: k, sp: 9, ph, still: zx >= 540 - (off - 620) * .32 }); }
  // ropes
  const sw = lt > snap ? Math.sin((lt - snap) * 14) * 40 * Math.exp(-(lt - snap) * 3) : 0;
  for (const [tx, ty, bx] of [[700, 640, 700], [1020, 560, 1020]]) { if (lt <= snap) line(ctx, tx, ty, bx, by - 10, 9, '#8a5a2c'); else { line(ctx, tx, ty, tx + sw, ty + 170, 9, '#8a5a2c'); line(ctx, bx, by - 10, bx - sw * .5, by - 150, 9, '#8a5a2c'); } }
  lifeboat(ctx, 860, by, .62, 'back');
  const seat = (base, sx, t0, x0, o) => { const k = clamp((lt - t0) / hd); if (lt < t0) { const rx = Math.min(x0 + lt * 560, 545); runner(ctx, base, rx, 1150, 300, t + x0, { sp: 14 }); } else if (k < 1) { drawStick(ctx, C(base, { x: lerp(545, sx, k), y: lerp(1150, by + 92, k) - Math.sin(k * Math.PI) * 190, s: 300, arms: POSE.handsUp.arms, legs: { L: [.6, -.9], R: [.4, -.8] }, face: { eyes: 'wide', mouth: 'o', browUp: 1 }, shadow: false })); } else drawStick(ctx, C(base, Object.assign({ x: sx, y: by + 92, s: 300, shadow: false }, o))); };
  const cut = kf(lt, [[2.3, 0], [2.55, 1], [snap - .08, 1], [snap, 2, easeIn]]);
  seat(DOC, 950, hopD, -470, { arms: lt > snap ? POSE.handsUp.arms : { L: { ik: [-.12, -.42] }, R: { ik: [.12, -.42], bend: -1 } }, face: { eyes: 'wide', mouth: lt > snap ? 'o' : 'teeth', browUp: 1 } });
  seat(YOU, 780, hopY, -300, { armLen: 1.25, arms: lt > snap ? POSE.handsUp.arms : { L: cut > 0 ? { ik: [lerp(-.2, -.3, clamp(cut)), lerp(-.5, cut > 1 ? -.6 : -.98, clamp(cut))] } : [.4, -.3], R: [.4, -.3] }, face: lt > snap ? { eyes: 'wide', mouth: 'grin', browUp: 1 } : { eyes: 'squint', mouth: 'teeth', browAng: .3 },
    prop: (c, k, h) => { if (k !== 'L' || cut <= 0 || lt > snap + .1) return; c.save(); c.translate(h[0], h[1]); c.rotate(-.6); path(c, [[-.012, 0], [-.012, -.13], [.02, -.17], [.02, 0]]); fillStroke(c, '#d9dde2', .01); box(c, -.02, 0, .05, .035, '#8a4b14', .01, .008); c.restore(); } });
  lifeboat(ctx, 860, by, .62);
  if (lt > snap && lt < snap + .3) { const k = lt - snap; ctx.save(); ctx.translate(700, 950); const s2 = backOut(clamp(k / .1)) * (1 - clamp((k - .18) / .12)); ctx.scale(s2, s2); burst(ctx, 0, 0, 90, 10, '#fff', 5); ctx.restore(); shout(ctx, 'snip!', 480, 860, 70, k * 10, -.1, '#fff'); }
  // water in front + splash
  ctx.fillStyle = 'rgba(208,90,114,.55)'; ctx.fillRect(-3000, 2395, 7000, 2000);
  if (landed) { const k = lt - land; for (let i = 0; i < 7; i++) { const a = -Math.PI * (.12 + i * .127); puff(ctx, 860 + Math.cos(a) * (150 + k * 700), 2400 + Math.sin(a) * (k * 900) + k * k * 1500, 80 - k * 60, t, '#fff1e6', 4 + i, 1 - k * 2.5); } }
} });
// 26 — drifting away at sunset
function boatCrew(ctx, x, by, s, t, you, doc) {
  lifeboat(ctx, x, by, s / 300 * .62, 'back');
  drawStick(ctx, C(YOU, Object.assign({ x: x - .27 * s, y: by + .31 * s, s, shadow: false }, you)));
  drawStick(ctx, C(DOC, Object.assign({ x: x + .3 * s, y: by + .31 * s, s, shadow: false }, doc)));
}
SHOTS.push({ start: 75.5, end: 78.6, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), hz = 1000;
  const cam = { x: kf(lt, [[0, 640], [3.1, 560]]) + hh[0], y: kf(lt, [[0, 1100], [3.1, 1000]]) + hh[1], z: kf(lt, [[0, 1.4], [3.1, 1.0]], easeOut), r: Math.sin(t * .5) * .004 };
  sunsetSky(ctx, t, cam, hz); applyCam(ctx, cam, 1); sunsetSea(ctx, t, hz);
  drawCruise(ctx, 250 - lt * 12, 1070, .62, t, { sil: '#2a1740', silAmt: .93, infect: 1 });
  for (let i = 0; i < 3; i++) { const gx = 700 + i * 110 + Math.sin(t + i) * 20, gy = 520 + (i % 2) * 60, fl = Math.sin(t * 8 + i) * 8; ctx.beginPath(); ctx.moveTo(gx - 18, gy - fl); ctx.quadraticCurveTo(gx - 6, gy - 10, gx, gy); ctx.quadraticCurveTo(gx + 6, gy - 10, gx + 18, gy - fl); ctx.lineWidth = 4; ctx.strokeStyle = '#2a1740'; ctx.stroke(); }
  const bx = 650 + lt * 22, by = 1395 + Math.sin(t * 2) * 6;
  for (let i = 0; i < 5; i++) line(ctx, bx - 150 - i * 70, by + 50 + (i % 2) * 14, bx - 190 - i * 70, by + 50 + (i % 2) * 14, 6, 'rgba(255,230,200,.5)');
  ctx.save(); ctx.translate(bx, by); ctx.rotate(Math.sin(t * 1.6) * .03); ctx.translate(-bx, -by);
  boatCrew(ctx, bx, by, 190, t, { face: { eyes: 'normal', mouth: 'smile', look: [-1, 0] }, arms: { L: [2.5 + Math.sin(t * 7) * .25, .3], R: [.3, -.2] } }, { face: { eyes: 'wide', mouth: 'frown', look: [-1, 0] } });
  lifeboat(ctx, bx, by, 190 / 300 * .62); ctx.restore();
  ellipse(ctx, bx, by + 66, 150, 9); ctx.fillStyle = 'rgba(255,235,210,.55)'; ctx.fill();
} });
// 27/28/29 — in the lifeboat
function boatScene(ctx, lt, t, cam, you, doc, o = {}) {
  const hz = 820; sunsetSky(ctx, t, cam, hz); applyCam(ctx, cam, 1); sunsetSea(ctx, t, hz);
  drawCruise(ctx, 190, 850, .26, t, { sil: '#2a1740', silAmt: .93, infect: 1 });
  const by = 1270 + Math.sin(t * 1.8) * 8, rot = Math.sin(t * 1.3) * .012;
  ctx.save(); ctx.translate(540, by); ctx.rotate(rot); ctx.translate(-540, -by);
  boatCrew(ctx, 540, by, 500, t, you, doc);
  // snacks
  can(ctx, 470, by + 10, 70, 100, '#e0392f'); can(ctx, 548, by + 10, 70, 100, '#3fa35b'); can(ctx, 510, by - 92, 70, 96, '#f2b52a');
  ctx.save(); ctx.translate(610, by + 6); ctx.rotate(-.3); box(ctx, -20, -200, 40, 200, '#e2a85a', 4, 20); for (let k = 0; k < 4; k++) line(ctx, -10, -160 + k * 40, 10, -172 + k * 40, 3, '#b87a34'); ctx.restore();
  path(ctx, [[400, by + 10], [384, by - 110], [450, by - 120], [444, by + 10]]); fillStroke(ctx, '#ffd23a', 5); text(ctx, 'CHIPS', 417, by - 50, 17, '#c2272d');
  lifeboat(ctx, 540, by, 500 / 300 * .62);
  ctx.restore();
  ctx.fillStyle = 'rgba(90,47,114,.5)'; ctx.fillRect(-3000, by + 150, 7000, 2000);
  for (let i = 0; i < 7; i++) line(ctx, 60 + i * 150 + Math.sin(t * 2 + i) * 20, by + 160, 130 + i * 150 + Math.sin(t * 2 + i) * 20, by + 160, 7, 'rgba(255,230,210,.5)');
  tint(ctx, '#ff9a4a', .1, 'overlay');
  return by;
}
const bite = (amt, t) => (c, k, h, a, side) => { if (k !== 'R') return; const bx = h[0] - side * Math.sin(a) * .07, byy = h[1] - Math.cos(a) * .07; if (amt > 0) glow(c, bx, byy, .16, '150,255,90', .55 * amt * (.7 + .3 * Math.sin(t * 8))); ellipse(c, bx, byy, .034, .026, a); fillStroke(c, mix('#e8707a', '#8fd94a', amt), .009); for (let i = -1; i <= 1; i++) { circle(c, bx + i * .017, byy - .012, .005); c.fillStyle = INK; c.fill(); circle(c, bx + i * .017, byy + .012, .005); c.fill(); } };
SHOTS.push({ start: 78.6, end: 83.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), q = 2.3;
  const cam = { x: 540 + hh[0], y: kf(lt, [[0, 1040], [4.6, 1010]]) + hh[1], z: kf(lt, [[0, 1.0], [4.6, 1.1]]), r: 0 };
  const lk = lt < q ? [.6, .4] : [Math.sin((lt - q) * 4.2), -.2];
  const wave = lt > 1.3 && lt < 2.2;
  const by = boatScene(ctx, lt, t, cam,
    { armLen: 1.15, headTilt: lt > q ? Math.sin((lt - q) * 4.2) * .1 : 0, arms: lt < 1.2 ? { L: [.4, -.3], R: { ik: [.3, -.42], bend: -1 } } : lt > q ? { L: [1.5, 1.6], R: [1.5, 1.6] } : { L: [.4, -.3], R: [.4, -.3] }, face: lt > q ? { eyes: 'normal', mouth: 'flat', look: lk, browOne: 1 } : { eyes: 'happy', mouth: 'grin' } },
    { armLen: 1.1, arms: { L: [.5, -.6], R: wave ? [2.4 + Math.sin(t * 10) * .25, .5] : { ik: [.02, -.44], bend: -1 } }, face: { eyes: 'normal', mouth: wave ? 'smile' : 'flat', look: [-.6, 0], browUp: 1 } });
  if (lt < 1.2) for (let i = 0; i < 4; i++) sparkle(ctx, 420 + i * 70, by - 150 - (i % 2) * 60, 44 * Math.abs(Math.sin(t * 5 + i * 1.4)), clamp(lt * 5));
  if (lt > q) ['?', '?', '?'].forEach((c, i) => shout(ctx, c, 190 + i * 110, 700 - (i % 2) * 70, 110 - i * 12, (lt - q - i * .3) * 7, -.2 + i * .2));
} });
SHOTS.push({ start: 83.2, end: 85.5, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2);
  const cam = { x: 350 + hh[0], y: 1060 + hh[1], z: kf(lt, [[0, 1.6], [2.3, 1.78]]), r: 0 };
  const sigh = kf(lt, [[.9, 0], [1.2, 1]]);
  boatScene(ctx, lt, t, cam,
    { armLen: 1.2, headTilt: -.08 * sigh, lean: -.05 * sigh, arms: { L: { ik: [-.14, -.86] }, R: { ik: [.14, -.86], bend: -1 } }, face: { eyes: sigh > .5 ? 'happy' : 'normal', mouth: sigh > .5 ? 'smile' : 'grin', blink: blinkAt(t) } },
    { arms: { L: [.5, -.6], R: { ik: [.02, -.44], bend: -1 } }, face: { eyes: 'normal', mouth: 'flat', look: [.5, .5] } });
  if (sigh > 0) puff(ctx, 480 + (lt - .9) * 60, 1090 - (lt - .9) * 40, 30 + (lt - .9) * 26, t, '#fff', 6, .7 * (1 - clamp((lt - 1.2) / .8)));
} });
SHOTS.push({ start: 85.5, end: 90.5, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), turn = kf(lt, [[3.75, 0], [4.7, .8]]), zf = lt > 4.15;
  const cam = { x: kf(lt, [[0, 350], [.3, 350], [1.7, 740], [5, 770]]) + hh[0], y: kf(lt, [[0, 1060], [1.7, 1090], [3.2, 1100], [5, 1110]]) + hh[1], z: kf(lt, [[0, 1.78], [1.7, 1.8], [3.2, 1.85], [3.7, 2.15], [5, 2.3]]), r: kf(lt, [[3.3, 0], [5, .03]]) };
  const sc = Math.sin(t * 22);
  boatScene(ctx, lt, t, cam,
    { arms: { L: { ik: [-.14, -.86] }, R: { ik: [.14, -.86], bend: -1 } }, face: lt > 2.4 ? { eyes: 'wide', mouth: 'flat', look: [1, .3], browUp: 1 } : { eyes: 'happy', mouth: 'smile' } },
    { armLen: 1.15, head: mix(HEAD, ZHEAD, turn), headSh: mix(HEAD_SH, ZHEAD_SH, turn), zombie: zf, zAmt: turn, t, headTilt: zf ? .12 : Math.sin(t * 3) * .02,
      arms: { L: { ik: [.1 + sc * .025, -.5 + sc * .02], bend: 1 }, R: { ik: [.2, -.62], bend: -1 } }, prop: bite(clamp((lt - 2.2) / 1.2), t),
      face: zf ? { mouth: 'shut', look: [-.6, 0] } : { eyes: lt > 3.3 ? 'wide' : 'normal', mouth: lt > 3.0 ? 'teeth' : 'flat', look: lt > 3.0 ? [-.9, 0] : [.5, .6], browUp: lt > 3 ? 1 : 0 } });
  applyCam(ctx, cam, 1);
  if (lt > 3.0 && !zf) sweat(ctx, 905, 1010 + ((lt - 3) * 40), 22, 1);
  if (lt > 1.9 && lt < 3.2) for (let i = 0; i < 3; i++) line(ctx, 905 + i * 16, 1150 - i * 8 + sc * 4, 925 + i * 16, 1135 - i * 8 + sc * 4, 5, '#fff');
  tint(ctx, '#3a7a1e', .16 * turn, 'overlay');
  darkness(ctx, clamp((lt - 4.75) / .22));
} });
