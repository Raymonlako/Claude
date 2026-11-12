// ---------- 5 s style sample: midnight on the promenade deck, one continuous camera move ----------
const SHOTS = [];
const drink = (rot = 0) => (c, k, h) => { if (k !== 'R') return; c.save(); c.translate(h[0], h[1]); c.rotate(rot); path(c, [[-.03, -.11], [.03, -.11], [.022, 0], [-.022, 0]]); fillStroke(c, '#ffb347', .012); c.fillStyle = 'rgba(255,255,255,.5)'; c.fillRect(-.02, -.1, .012, .08); line(c, .01, -.1, .04, -.17, .01, '#e0392f'); c.beginPath(); c.arc(-.02, -.13, .03, Math.PI, 0); c.closePath(); fillStroke(c, '#ff7eb6', .01); line(c, -.02, -.13, -.02, -.09, .008); c.restore(); };
const _tmp = document.createElement('canvas'); _tmp.width = W; _tmp.height = H;
function blurLayer(ctx, px, fn) { const c = _tmp.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); fn(c); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${px}px)`; ctx.drawImage(_tmp, 0, 0); ctx.restore(); }
function fog(ctx, t, y, n, a, seed, sp = 14) { const R = rng(seed); for (let i = 0; i < n; i++) { const x = ((R() * 3400 + t * sp * (.5 + R())) % 3400) - 900, w = 420 + R() * 420, yy = y + (R() - .5) * 220; const g = ctx.createRadialGradient(x, yy, 10, x, yy, w); g.addColorStop(0, `rgba(190,215,255,${a})`); g.addColorStop(1, 'rgba(190,215,255,0)'); ctx.save(); ctx.translate(0, yy); ctx.scale(1, .32); ctx.translate(0, -yy); ctx.fillStyle = g; ctx.fillRect(x - w, yy - w, w * 2, w * 2); ctx.restore(); } }
function nightBG(ctx, t, cam) {
  applyCam(ctx, cam, .04); ctx.fillStyle = lg(ctx, 0, -300, 0, 900, '#070b22', '#101a45', '#243a7a', '#4a66a8'); ctx.fillRect(-3000, -3000, 7000, 4200);
  const R = rng(5); for (let i = 0; i < 90; i++) { const x = -500 + R() * 2100, y = -300 + R() * 1050, r = 1.5 + R() * 3; circle(ctx, x, y, r * (.8 + .3 * Math.sin(t * 3 + i))); ctx.fillStyle = `rgba(235,240,255,${.35 + .45 * R()})`; ctx.fill(); }
  applyCam(ctx, cam, .07); glow(ctx, 760, 330, 620, '170,200,255', .55); circle(ctx, 760, 330, 150); ctx.fillStyle = '#f4f6ff'; ctx.fill(); for (const [dx, dy, r] of [[-50, -40, 30], [40, 30, 22], [-20, 60, 16], [60, -50, 14]]) { circle(ctx, 760 + dx, 330 + dy, r); ctx.fillStyle = 'rgba(180,195,235,.55)'; ctx.fill(); }
  applyCam(ctx, cam, .12); for (const [cx, cy, w, c] of [[180, 470, 380, '#1a2858'], [980, 250, 330, '#16224e'], [620, 560, 300, '#22346c'], [-150, 250, 300, '#16224e']]) { ellipse(ctx, cx + t * 5, cy, w, 30); ctx.fillStyle = c; ctx.fill(); ellipse(ctx, cx + 70 + t * 5, cy - 26, w * .6, 26); ctx.fill(); }
  applyCam(ctx, cam, .3); const hz = 800; ctx.fillStyle = lg(ctx, 0, hz, 0, hz + 600, '#3f5fa6', '#1a2a66', '#0a1238'); ctx.fillRect(-3000, hz, 7000, 3000);
  const R2 = rng(21); for (let i = 0; i < 70; i++) { const d = R2(), y = hz + 8 + d * d * 500, sc = .3 + d * 1.4, x = 760 + (R2() - .5) * (80 + d * 520) + Math.sin(t * 2 + i) * 10; line(ctx, x - 24 * sc, y, x + 24 * sc, y, 3 + sc * 3, `rgba(220,232,255,${.75 - d * .4})`); }
  ctx.fillStyle = 'rgba(200,220,255,.4)'; ctx.fillRect(-3000, hz - 2, 7000, 4);
  drawCruise(ctx, -260, hz + 34, .2, t, { sil: '#0a1030', silAmt: .95, lit: 1, noSmoke: true });
}
function deckSet(ctx, t, cam) {
  applyCam(ctx, cam, 1);
  // glass rail with posts
  ctx.fillStyle = 'rgba(120,160,230,.2)'; ctx.fillRect(-1200, 905, 4200, 200); for (let x = -1200; x < 3000; x += 240) { ctx.fillStyle = 'rgba(210,225,255,.16)'; path(ctx, [[x + 50, 908], [x + 100, 908], [x + 40, 1100], [x - 10, 1100]]); ctx.fill(); box(ctx, x, 880, 18, 222, '#3d4b78', 5, 4); }
  box(ctx, -1200, 868, 4200, 26, '#56679c', 5, 10);
  // lamp posts + string lights
  const posts = [-520, 180, 880, 1580, 2280];
  for (let i = 0; i < posts.length - 1; i++) { const a = posts[i], b = posts[i + 1]; ctx.beginPath(); ctx.moveTo(a, 300); ctx.quadraticCurveTo((a + b) / 2, 470, b, 300); ctx.lineWidth = 5; ctx.strokeStyle = '#0b1026'; ctx.stroke(); for (let k = 1; k < 9; k++) { const u = k / 9, bx = lerp(a, b, u) + Math.sin(t * 1.3 + k) * 3, by = 300 + 340 * u * (1 - u) + 14; const c = ['255,214,120', '255,150,130', '160,230,255', '200,255,160'][k % 4], fl = .8 + .2 * Math.sin(t * 5 + k * 2 + i); glow(ctx, bx, by, 110, c, .5 * fl); circle(ctx, bx, by, 13); ctx.fillStyle = `rgb(${c})`; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = '#0b1026'; ctx.stroke(); } }
  for (const px of posts) { line(ctx, px, 1100, px, 290, 20, '#0b1026'); line(ctx, px, 1100, px, 290, 10, '#3d4b78'); glow(ctx, px, 270, 480, '255,210,140', .5); path(ctx, [[px - 44, 290], [px + 44, 290], [px + 26, 200], [px - 26, 200]]); fillStroke(ctx, '#ffe9a8', 5, '#0b1026'); box(ctx, px - 52, 284, 104, 18, '#3d4b78', 4, 6); }
  // floor: teak under moonlight, with warm pools under the lamps
  floorP(ctx, 1100, '#4a4266', '#241f3d', 'rgba(10,8,30,.45)', cam.x, 150, 0);
  for (const px of posts) { ctx.save(); ctx.translate(px, 1330); ctx.scale(1, .28); glow(ctx, 0, 0, 520, '255,200,120', .42); ctx.restore(); }
  // deck chairs, life ring, lifeboat on davits
  lounger(ctx, 1380, 1320, .8); lounger(ctx, 2050, 1340, .85);
  circle(ctx, 480, 990, 58); fillStroke(ctx, '#e9e6f2', 5); ctx.save(); circle(ctx, 480, 990, 58); ctx.clip(); ctx.fillStyle = '#c2414d'; ctx.fillRect(420, 974, 120, 32); ctx.fillRect(464, 930, 32, 120); ctx.restore(); circle(ctx, 480, 990, 58); fillStroke(ctx, null, 5); circle(ctx, 480, 990, 26); fillStroke(ctx, '#2a3566', 5);
  for (const dx of [1150, 1500]) { ctx.beginPath(); ctx.moveTo(dx, 880); ctx.lineTo(dx, 560); ctx.quadraticCurveTo(dx, 470, dx + 90, 470); ctx.lineWidth = 26; ctx.strokeStyle = '#0b1026'; ctx.stroke(); ctx.lineWidth = 15; ctx.strokeStyle = '#a8862a'; ctx.stroke(); line(ctx, dx + 90, 470, dx + 90, 640, 6, '#0b1026'); }
  lifeboat(ctx, 1410, 650, .62);
}
SHOTS.push({ start: 0, end: 5.1, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2.5), turn = 2.75, sees = lt > turn;
  const sh = lt > 3.85 ? Math.max(0, 1 - (lt - 3.85) * 3) : 0, hk = shake(t * 3, 10 * sh, 3);
  const cam = { x: kf(lt, [[0, 330], [2.2, 400], [4.2, 720], [5.1, 760]]) + hh[0] + hk[0], y: kf(lt, [[0, 1130], [2.2, 1120], [5.1, 1090]]) + hh[1] + hk[1], z: kf(lt, [[0, 1.5], [2.2, 1.38], [4.2, 1.04], [5.1, 1.0]]), r: Math.sin(t * .6) * .006 };
  blurLayer(ctx, 2.5, c => nightBG(c, t, cam));
  deckSet(ctx, t, cam);
  fog(ctx, t, 1180, 9, .16, 3);
  // they come out of the fog: far ones are shapes with eyes, the nearest steps into the lamplight
  const adv = Math.max(0, lt - .8) + 3.6;
  zombie(ctx, 2150 - adv * 70, 1250, 300, t, { kind: 3, dir: -1, sp: 4, ph: 1, extra: { sil: '#141a3a', eyesGlow: true, zombie: false, face: { eyes: 'normal', pupil: .01 } } });
  zombie(ctx, 1900 - adv * 80, 1300, 340, t, { kind: 5, dir: -1, sp: 4, ph: 3, extra: { sil: '#161d40', eyesGlow: true, zombie: false, face: { eyes: 'normal', pupil: .01 } } });
  zombie(ctx, 1640 - adv * 90, 1360, 390, t, { kind: 2, dir: -1, sp: 4.2, ph: 5, extra: { sil: '#1a2248', eyesGlow: true, zombie: false, face: { eyes: 'normal', pupil: .01 } } });
  fog(ctx, t, 1330, 7, .13, 9, 20);
  zombie(ctx, 1330 - adv * 105, 1470, 470, t, { kind: 0, dir: -1, sp: 4.4, ph: 2 });
  zombie(ctx, 1560 - adv * 100, 1560, 500, t, { kind: ZCAPT, dir: -1, sp: 4.2, ph: 4 });
  // you, at the rail
  const tk = kf(lt, [[turn, 0], [turn + .25, 1, backOut]]);
  drawStick(ctx, C(YOU, { x: 330, y: 1640, s: 640, armLen: 1.15, lean: lerp(-.04, .05, tk), headTilt: lerp(-.1, .05, tk),
    arms: sees ? { L: [.5, -.4], R: [1.5, -1.4] } : { L: { ik: [-.22, -.56] }, R: { ik: [.2, -.6], bend: -1 } }, prop: sees ? null : drink(0),
    face: sees ? { eyes: 'wide', mouth: lt > 3.5 ? 'teeth' : 'o', browUp: 1, look: [1, .1] } : { eyes: 'half', mouth: 'smile', look: [.4, -.7], blink: blinkAt(t) } }));
  if (sees && lt < turn + .8) text(ctx, '!', 560, 880, 120, '#ffe14d', INK, 16);
  if (lt > 3.4) sweat(ctx, 520, 1060 + (lt - 3.4) * 50, 26, 1);
  // foreground: out-of-focus palm passing the lens, then the grade
  blurLayer(ctx, 9, c => { applyCam(c, cam, 1.7); palmPot(c, -560, 2300, 2.2, t); palmPot(c, 1560, 2380, 2.0, t + 2); });
  fog(ctx, t, 1700, 6, .12, 14, 30);
  tint(ctx, '#1b2f8a', .22, 'multiply'); tint(ctx, '#3550c8', .12, 'screen');
  applyCam(ctx, cam, 1); for (const px of [-520, 180, 880, 1580, 2280]) { glow(ctx, px, 280, 560, '255,205,130', .5); ctx.save(); ctx.translate(px, 1340); ctx.scale(1, .28); glow(ctx, 0, 0, 560, '255,190,110', .4); ctx.restore(); }
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const v = ctx.createRadialGradient(540, 980, 420, 540, 980, 1300); v.addColorStop(0, 'rgba(0,0,10,0)'); v.addColorStop(1, 'rgba(0,0,16,.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); ctx.restore();
  if (lt > 3.85) tint(ctx, '#7dff8a', .1 * sh, 'screen');
  darkness(ctx, 1 - clamp(lt / .35));
} });
