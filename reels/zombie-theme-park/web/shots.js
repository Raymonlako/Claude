// ---------- "Zombie apocalypse at a theme park", part 1 ----------
const HL = { "don't": 'r', exit: 'r', nora: 'y', seventeen: 'y', safest: 'y', stupid: 'r', mistake: 'r', thirty: 'y', thousand: 'y', gate: 'y', no: 'r', infected: 'r', up: 'y', ground: 'y', "can't": 'r', climb: 'r', top: 'y', two: 'y', hundred: 'y', water: 'y', kettle: 'y', corn: 'y', radio: 'y', pickles: 'y', everyone: 'r', three: 'y', days: 'y', problem: 'r', eight: 'y', pm: 'y', lights: 'y', music: 'r', head: 'r', turns: 'r', come: 'r', down: 'r', move: 'r', someone: 'r', booth: 'r' };
window.HL = HL;
const SHOTS = [];
const GROUND = 1500, WX = 540, WY = 700, WR = 520;
function park(ctx, t, cam, o = {}) { const n = o.n || 0; sky(ctx, t, cam, n); skyline(ctx, t, cam, n, o.lit || 0, GROUND); groundP(ctx, cam, n, GROUND); }
function titleTags(ctx, lt, part = 'PART 1', clock = 'DAY 1 · 6:42 PM') {
  ui(ctx, () => { const k = clamp(lt * 3); ctx.globalAlpha = k; ctx.font = '400 44px Bebas'; const s1 = 'ZOMBIE APOCALYPSE AT A THEME PARK', w = ctx.measureText(s1).width + 70; box(ctx, 540 - w / 2, 236, w, 66, RED, 8); text(ctx, s1, 540, 272, 44, CREAM, null, 0, 'Bebas', 400);
    box(ctx, 465, 318, 150, 62, CREAM, 6); text(ctx, part, 540, 352, 46, '#2a2226', null, 0, 'Bebas', 400); });
  pill(ctx, 540, 428, clock, { k: lt * 3 - .3, size: 34 });
}
// 1 — hook: don't run for the exit
SHOTS.push({ start: 0, end: 4.5, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: 540 + hh[0], y: kf(lt, [[0, 880], [4.5, 960]]) + hh[1], z: kf(lt, [[0, .74], [4.5, .9]]), r: 0 };
  park(ctx, t, cam); applyCam(ctx, cam, 1);
  ferris(ctx, WX, WY, WR, t * .22, { t }); booth(ctx, 1010, GROUND, 1);
  tinyCrowd(ctx, t, -700, 1800, 1560, 46, { s: 86, dy: 200, sp: lt > 1.3 ? 330 : 60, inf: lt > 1.3 ? .14 : 0, seed: 3 });
  guy(ctx, C(NORA, { x: 880, y: 1505, s: 150, face: { eyes: lt > 1.6 ? 'wide' : 'dot', mouth: lt > 1.6 ? 'o' : 'smile', look: [-1, 0] } }));
  tint(ctx, '#d8392b', kf(lt, [[1.3, 0], [2.6, .14]]), 'overlay'); vignette(ctx, .55);
  titleTags(ctx, lt);
  ruleCard(ctx, 540, 800, 'THE RULE', "DON'T RUN", 'FOR THE EXIT.', (lt - 2.85) * 5);
} });
// 2 — Nora, seventeen
function stand(ctx, x, pull = 0) { box(ctx, x - 60, GROUND - 210, 120, 210, '#4a3f66', 10); box(ctx, x - 74, GROUND - 236, 148, 36, '#5c5080', 8); const a = -.5 + pull * 1.0; line(ctx, x, GROUND - 230, x + Math.sin(a) * 150, GROUND - 230 - Math.cos(a) * 150, 16, '#2a2440'); circle(ctx, x + Math.sin(a) * 150, GROUND - 230 - Math.cos(a) * 150, 24); ctx.fillStyle = RED; ctx.fill(); for (let i = 0; i < 3; i++) { circle(ctx, x - 30 + i * 30, GROUND - 150, 9); ctx.fillStyle = ['#7dff8a', '#ffc53a', '#ff5a4d'][i]; ctx.fill(); } return [x + Math.sin(a) * 150, GROUND - 230 - Math.cos(a) * 150]; }
SHOTS.push({ start: 4.5, end: 8.95, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2.5), cam = { x: kf(lt, [[0, 400], [4.45, 440]]) + hh[0], y: kf(lt, [[0, 1150], [4.45, 1120]]) + hh[1], z: kf(lt, [[0, 1.75], [4.45, 1.9]]), r: 0 };
  blurLayer(ctx, 5, c => { park(c, t, cam); applyCam(c, cam, 1); ferris(c, WX + 160, WY - 80, WR * 1.3, t * .22, { t }); });
  applyCam(ctx, cam, 1);
  const h = stand(ctx, 560, .5 + .5 * Math.sin(t * 1.2));
  const wave = lt > 1.9 && lt < 3.0;
  guy(ctx, C(NORA, { x: 360, y: GROUND, s: 420, armLen: 1.2, headTilt: Math.sin(t * 1.4) * .03, arms: { L: wave ? [2.6 + Math.sin(t * 11) * .25, .4] : [.3, -.15], R: { ik: [(h[0] - 360) / 420, (h[1] - GROUND) / 420], bend: -1 } }, face: { eyes: 'dot', mouth: 'smile', look: [.3, 0], blink: (t % 2.7) < .1 } }));
  vignette(ctx, .5);
  nameCard(ctx, 420, 420, 'NORA · 17', 'RIDE OPERATOR', (lt - .15) * 5);
  pill(ctx, 540, 250, 'DAY 1 · 6:42 PM', { size: 34 });
} });
// 3 — tilt up: the safest place in the park
SHOTS.push({ start: 8.95, end: 13.55, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2.5), cam = { x: 540 + hh[0], y: kf(lt, [[0, 1270], [.5, 1270], [3.6, 400], [4.6, 370]]) + hh[1], z: kf(lt, [[0, 1.05], [4.6, .95]]), r: 0 };
  park(ctx, t, cam); applyCam(ctx, cam, 1);
  const rot = Math.PI - (4.6 - lt) * .2;
  ferris(ctx, WX, WY, WR, rot, { t });
  booth(ctx, 1010, GROUND, 1); stand(ctx, 300, .5);
  guy(ctx, C(NORA, { x: 200, y: GROUND, s: 230, headTilt: -.15, face: { eyes: 'dot', mouth: 'smile', look: [.6, -1] } }));
  // height scale
  const top = WY - WR, hk = clamp((lt - .6) / 2.8), yy = lerp(GROUND, top, hk);
  ctx.setLineDash([14, 12]); line(ctx, 985, GROUND, 985, yy, 5, 'rgba(243,234,216,.85)'); ctx.setLineDash([]);
  for (let i = 1; i <= 4; i++) { const ty = lerp(GROUND, top, i / 4); if (ty < yy - 4) continue; line(ctx, 965, ty, 1005, ty, 5, CREAM); text(ctx, `${i * 50} FT`, 955, ty, 40, CREAM, null, 0, 'Bebas', 400, 'right'); }
  vignette(ctx, .5);
  pill(ctx, 540, 250, 'SAFEST PLACE IN THE PARK?', { k: (lt - 2.7) * 4, dot: '#7dff8a', size: 36 });
} });

// 4 — one very stupid mistake
SHOTS.push({ start: 13.55, end: 17.0, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), cam = { x: 540 + hh[0], y: 960 + hh[1], z: kf(lt, [[0, 1.0], [3.45, 1.1]]), r: 0 }, w = kf(lt, [[1.2, 0], [1.6, 1]]);
  blurLayer(ctx, 12, c => { park(c, t, { x: 540, y: 700, z: 1.5, r: 0 }, { n: .15 }); });
  tint(ctx, '#1a1030', .35); applyCam(ctx, cam, 1);
  guy(ctx, C(NORA, { x: 540, y: 2260, s: 1750, shadow: false, headTilt: Math.sin(t * 1.2) * .015, face: { eyes: w > .5 ? 'wide' : 'dot', mouth: w > .5 ? 'wavy' : 'smile', browUp: w, browAng: -.25 * w, look: [w * .5, w * .4], blink: (t % 3.1) < .1 } }));
  tint(ctx, '#d8392b', .12 * w, 'overlay'); vignette(ctx, .7);
} });
// 5 — the map: everyone has the same idea
const MAPD = (() => { const R = rng(31), a = []; for (let i = 0; i < 150; i++) a.push([150 + R() * 780, 380 + R() * 760, R() * 1.6, (R() - .5) * 150, R() * 110, R() < .5]); return a; })();
function parkMap(ctx, lt, t) {
  paper(ctx);
  text(ctx, 'GOLDEN GULL PARK · VISITOR MAP', 90, 180, 40, 'rgba(60,45,35,.6)', null, 0, 'Bebas', 400, 'left');
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ellipse(ctx, 540, 800, 330, 400); ctx.lineWidth = 54; ctx.strokeStyle = '#d6c6a0'; ctx.stroke(); line(ctx, 540, 1200, 540, 1590, 64, '#d6c6a0'); line(ctx, 210, 800, 870, 800, 40, '#d6c6a0');
  // attractions
  circle(ctx, 300, 560, 86); ctx.lineWidth = 9; ctx.strokeStyle = '#4a3f66'; ctx.stroke(); for (let i = 0; i < 8; i++) line(ctx, 300, 560, 300 + Math.cos(i * TAU / 8 + t * .3) * 86, 560 + Math.sin(i * TAU / 8 + t * .3) * 86, 5, '#4a3f66'); circle(ctx, 300, 560, 14); ctx.fillStyle = '#e2a62b'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(640, 600); ctx.bezierCurveTo(700, 380, 760, 700, 820, 470); ctx.bezierCurveTo(860, 380, 930, 520, 940, 620); ctx.lineWidth = 10; ctx.strokeStyle = '#c9543e'; ctx.stroke();
  path(ctx, [[700, 1060], [780, 930], [860, 1060]]); ctx.fillStyle = '#c9543e'; ctx.fill(); path(ctx, [[742, 1060], [780, 930], [818, 1060]]); ctx.fillStyle = '#f3ead8'; ctx.fill();
  ellipse(ctx, 330, 1020, 110, 70); ctx.fillStyle = '#7fb8c9'; ctx.fill(); ellipse(ctx, 540, 800, 70, 70); ctx.fillStyle = '#9fbf7a'; ctx.fill();
  for (const [lx, ly, s] of [[300, 690, 'WHEEL'], [800, 690, 'COASTER'], [780, 1100, 'BIG TOP'], [330, 1130, 'LAKE']]) text(ctx, s, lx, ly, 34, 'rgba(60,45,35,.75)', null, 0, 'Bebas', 400);
  // gate
  box(ctx, 380, 1590, 320, 70, RED, 10); text(ctx, 'FRONT GATE', 540, 1628, 46, CREAM, null, 0, 'Bebas', 400);
  box(ctx, 100, 1612, 280, 16, '#4a3f66', 6); box(ctx, 700, 1612, 280, 16, '#4a3f66', 6);
  // visitors
  for (const [x0, y0, d, jx, jy] of MAPD) { const k = ease(clamp((lt - .5 - d) / 1.7)), k2 = ease(clamp((lt - 1.9 - d * .6) / 1.3)); let x = lerp(x0, 540 + jx * .25, k), y = lerp(y0, 1210, k); x = lerp(x, 540 + jx * .9, k2); y = lerp(y, 1570 - jy, k2); circle(ctx, x + Math.sin(t * 9 + x0) * 2, y, 11); ctx.fillStyle = '#3d5f9a'; ctx.fill(); }
  for (const sd of [-1, 1]) { const ax = 540 + sd * 230, ay = 1380 + Math.sin(t * 6) * 10; line(ctx, ax, ay - 110, ax - sd * 70, ay, 16, RED); path(ctx, [[ax - sd * 110, ay + 40], [ax - sd * 40, ay + 10], [ax - sd * 90, ay - 30]]); ctx.fillStyle = RED; ctx.fill(); }
}
SHOTS.push({ start: 17.0, end: 22.25, tr: 'cut', draw(ctx, lt, t) {
  parkMap(ctx, lt, t);
  const no = lt - 4.82;
  if (no > 0) { tint(ctx, '#1a0f14', .5); ui(ctx, () => { const k = clamp(no / .12); ctx.translate(540, 860); ctx.rotate(-.07); ctx.scale(2.2 - 1.2 * easeOut(k), 2.2 - 1.2 * easeOut(k)); ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40; text(ctx, 'NO.', 0, 0, 520, '#ff3b2e', null, 0, 'Bebas', 400); }); }
  vignette(ctx, .35);
  pill(ctx, 540, 250, `${Math.round(clamp((lt - .2) / 1.4) * 30) * 1000 >= 1000 ? (Math.round(clamp((lt - .2) / 1.4) * 30)).toString() + ',000' : '0'} VISITORS`, { k: lt * 4, size: 40 });
  pill(ctx, 540, 330, '1 FRONT GATE', { k: (lt - 3.3) * 4, size: 40, dot: '#ff5a4d' });
} });
// 6 — exactly where the infected are
function gate(ctx, n) {
  const c = mix('#5a4a78', '#17162e', n);
  for (let x = -1200; x < 2300; x += 70) line(ctx, x, GROUND, x, GROUND - 260, 10, mix('#3a3358', '#0c0c1e', n)); line(ctx, -1200, GROUND - 240, 2300, GROUND - 240, 12, mix('#3a3358', '#0c0c1e', n));
  ctx.fillStyle = mix('#241c34', '#06060e', n); ctx.fillRect(250, 760, 580, GROUND - 760);
  box(ctx, 150, 640, 130, GROUND - 640, c, 10); box(ctx, 800, 640, 130, GROUND - 640, c, 10);
  ctx.beginPath(); ctx.moveTo(120, 700); ctx.quadraticCurveTo(540, 300, 960, 700); ctx.lineTo(960, 800); ctx.quadraticCurveTo(540, 430, 120, 800); ctx.closePath(); ctx.fillStyle = mix('#c9543e', '#4a1a26', n); ctx.fill();
  ctx.save(); ctx.translate(540, 610); text(ctx, 'GOLDEN GULL', 0, 0, 96, CREAM, null, 0, 'Bebas', 400); ctx.restore();
  for (let i = 0; i < 9; i++) { const u = (i + .5) / 9, bx = lerp(150, 930, u), by = 705 - Math.sin(u * Math.PI) * 215; glow(ctx, bx, by, 90, '255,214,120', .5); circle(ctx, bx, by, 13); ctx.fillStyle = '#fff3c4'; ctx.fill(); }
  for (const tx of [340, 540, 740]) { box(ctx, tx - 26, GROUND - 150, 52, 150, mix('#3a3358', '#0c0c1e', n), 8); line(ctx, tx - 70, GROUND - 100, tx + 70, GROUND - 100, 10, mix('#8a8aa0', '#20203a', n)); }
}
SHOTS.push({ start: 22.25, end: 26.85, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 5), cam = { x: 540 + hh[0], y: kf(lt, [[0, 1180], [4.6, 1120]]) + hh[1], z: kf(lt, [[0, .98], [4.6, 1.22]]), r: Math.sin(t * 2) * .006 };
  const n = .35; sky(ctx, t, cam, n); skyline(ctx, t, cam, n, 0, GROUND); groundP(ctx, cam, n, GROUND); applyCam(ctx, cam, 1);
  gate(ctx, n);
  const come = Math.max(0, lt - 1.9);
  for (const [ix, ph, s] of [[400, 0, 250], [560, 2, 270], [690, 4, 240], [470, 1, 300], [640, 3, 320]]) if (come > ph * .12) infected(ctx, ix, GROUND + 20 + come * 26, s + come * 22, t, { ph, sp: 4, dir: ph % 2 ? -1 : 1, eyes: true });
  tinyCrowd(ctx, t, -300, 1400, 1640, 44, { s: 210, dy: 260, sp: 26, dim: .5, seed: 11, dir: lt > 2.6 ? 1 : -1 });
  tint(ctx, '#d8392b', kf(lt, [[1.6, 0], [3.4, .34]]), 'overlay'); vignette(ctx, .7);
  pill(ctx, 540, 250, '1 GATE · 30,000 PEOPLE', { k: lt * 4, size: 40, dot: '#ff5a4d' });
  pill(ctx, 540, 330, 'INFECTED 40+', { k: (lt - 3.4) * 4, size: 40, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 7 — instead, she goes up  /  8 — rule #1
function climbScene(ctx, lt, t, rot, cam, n = .2) {
  park(ctx, t, cam, { n }); applyCam(ctx, cam, 1);
  const hero = ferris(ctx, WX, WY, WR, rot, { t, n, inside: noraInside([0, 1], false) });
  booth(ctx, 1010, GROUND, 1, n);
  for (const [ix, ph, s] of [[420, 0, 240], [560, 2, 250], [690, 4, 230], [300, 1, 220], [800, 3, 235]]) infected(ctx, ix + Math.sin(t + ph) * 12, GROUND + 6, s, t, { ph, up: true, still: true });
  return hero;
}
SHOTS.push({ start: 26.85, end: 28.45, tr: 'cut', draw(ctx, lt, t) {
  const rot = .15 + lt * .78, hx = WX + Math.sin(rot) * WR, hy = WY + Math.cos(rot) * WR, hh = handheld(t, 4);
  const cam = { x: lerp(540, hx, .45) + hh[0], y: hy - 40 + hh[1], z: kf(lt, [[0, 1.35], [1.6, 1.15]]), r: 0 };
  climbScene(ctx, lt, t, rot, cam);
  for (let i = 0; i < 3; i++) line(ctx, hx - 40 + i * 40, hy + 260 + i * 16, hx - 40 + i * 40, hy + 330 + i * 16, 8, 'rgba(243,234,216,.5)');
  vignette(ctx, .55);
} });
SHOTS.push({ start: 28.45, end: 31.9, tr: 'cut', draw(ctx, lt, t) {
  const rot = .15 + 1.6 * .78 + lt * .36, hh = handheld(t, 3);
  const cam = { x: 540 + hh[0], y: kf(lt, [[0, 900], [3.45, 980]]) + hh[1], z: kf(lt, [[0, .95], [3.45, .86]]), r: 0 };
  climbScene(ctx, lt, t, rot, cam);
  tint(ctx, '#120a1c', .4); vignette(ctx, .6);
  ruleCard(ctx, 540, 640, 'RULE #1', 'GET OFF THE GROUND.', lt > 2.2 ? "THEY CAN'T CLIMB." : '', (lt - .08) * 5, { w: 880, h: 400, size: 108, size2: 96, icons: (c, h) => { if (lt <= 2.2) { c.fillStyle = 'rgba(42,34,38,.18)'; c.fillRect(-150, 60, 300, 8); } } });
} });
// 9 — she locks the wheel, 200 feet up
SHOTS.push({ start: 31.9, end: 33.0, tr: 'cut', draw(ctx, lt, t) {
  const pr = kf(lt, [[.5, 0], [.72, 1, easeIn]]), sh = lt > .72 ? Math.max(0, 1 - (lt - .72) * 5) : 0, hk = shake(t * 3, 12 * sh, 3);
  ctx.setTransform(1, 0, 0, 1, hk[0], hk[1]); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#5a2630', '#3a1822'); ctx.fillRect(-50, -50, W + 100, H + 100);
  ctx.fillStyle = 'rgba(0,0,0,.14)'; for (let y = 0; y < H; y += 180) ctx.fillRect(-50, y, W + 100, 8);
  ctx.beginPath(); ctx.moveTo(560, -20); ctx.bezierCurveTo(620, 200, 480, 300, 540, 470); ctx.lineWidth = 34; ctx.strokeStyle = '#1b1620'; ctx.stroke();
  // fingers behind, pendant, thumb
  for (let i = 0; i < 4; i++) box(ctx, 250, 820 + i * 112, 170, 96, '#b57a52', 46);
  box(ctx, 330, 440, 420, 900, '#e2a62b', 60); ctx.fillStyle = 'rgba(60,20,0,.18)'; rrect(ctx, 600, 440, 150, 900, [0, 60, 60, 0]); ctx.fill(); box(ctx, 360, 470, 360, 840, 'rgba(0,0,0,.08)', 44);
  path(ctx, [[540, 540], [600, 640], [480, 640]]); ctx.fillStyle = '#2f8f55'; ctx.fill(); circle(ctx, 540, 600, 96); ctx.lineWidth = 10; ctx.strokeStyle = '#2a2226'; ctx.stroke();
  circle(ctx, 540, 900, 150); ctx.fillStyle = '#2a2226'; ctx.fill(); circle(ctx, 540, 900 + pr * 10, 126); ctx.fillStyle = mix('#e0392f', '#8a1c16', pr); ctx.fill(); text(ctx, 'STOP', 540, 906 + pr * 10, 96, CREAM, null, 0, 'Bebas', 400);
  if (sh > 0) { circle(ctx, 540, 900, 150 + (1 - sh) * 190); ctx.lineWidth = 14 * sh; ctx.strokeStyle = `rgba(255,240,220,${sh})`; ctx.stroke(); }
  text(ctx, 'WHEEL CONTROL', 540, 1180, 54, '#2a2226', null, 0, 'Bebas', 400);
  ctx.save(); ctx.translate(lerp(930, 660, pr), lerp(1180, 980, pr)); ctx.rotate(-.75); box(ctx, -330, -66, 400, 132, '#c98d63', 66); box(ctx, -330, -66, 400, 132, 'rgba(60,20,30,.0)', 66); ellipse(ctx, -280, 0, 40, 46); ctx.fillStyle = '#e9c3a0'; ctx.fill(); ctx.restore();
  box(ctx, 700, 1150, 500, 800, '#c98d63', 120);
  vignette(ctx, .6);
} });
SHOTS.push({ start: 33.0, end: 36.4, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2.5), cam = { x: 540 + hh[0], y: kf(lt, [[0, 520], [3.4, 800]]) + hh[1], z: kf(lt, [[0, 1.25], [3.4, .78]], easeOut), r: 0 };
  park(ctx, t, cam, { n: .25 }); applyCam(ctx, cam, 1);
  ferris(ctx, WX, WY, WR, Math.PI + Math.sin(lt * 5) * .02 * Math.exp(-lt * 2), { t, n: .25, inside: noraInside([0, 1]) });
  booth(ctx, 1010, GROUND, 1, .25);
  tinyCrowd(ctx, t, 100, 1000, 1500, 26, { s: 80, dy: 80, sp: 8, inf: 1, seed: 5 });
  const top = WY - WR + 60, k = clamp((lt - 1.75) / 1.1), yy = lerp(GROUND, top, easeOut(k));
  if (lt > 1.6) { ctx.setLineDash([14, 12]); line(ctx, 1010, GROUND, 1010, yy, 6, CREAM); ctx.setLineDash([]); line(ctx, 985, yy, 1035, yy, 6, CREAM); line(ctx, 985, GROUND, 1035, GROUND, 6, CREAM); text(ctx, `${Math.round(easeOut(k) * 200)} FT`, 990, (GROUND + yy) / 2, 110, '#ffc53a', 'rgba(12,8,14,.8)', 12, 'Bebas', 400, 'right'); }
  vignette(ctx, .55);
  pill(ctx, 540, 250, 'WHEEL: LOCKED', { k: lt * 4, dot: '#7dff8a', size: 40 });
} });
// 10 — supplies
function bottle(ctx, x, y, s, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); box(ctx, -52, -150, 104, 300, '#bfe3f2', 40); box(ctx, -52, -30, 104, 180, '#5fb0d8', [0, 0, 40, 40]); box(ctx, -52, -40, 104, 80, '#f3ead8', 0); text(ctx, 'H2O', 0, 2, 44, '#3d5f9a', null, 0, 'Bebas', 400); box(ctx, -30, -196, 60, 54, '#3d5f9a', 10); ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.fillRect(-36, -130, 14, 250); ctx.restore(); }
SHOTS.push({ start: 36.4, end: 41.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2); ctx.setTransform(1.04 + lt * .008, 0, 0, 1.04 + lt * .008, -22 + hh[0], -40 + hh[1]);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#5d2b33', '#44202a'); ctx.fillRect(-60, -60, W + 120, H + 120); ctx.fillStyle = 'rgba(0,0,0,.16)'; for (let y = 90; y < H; y += 210) ctx.fillRect(-60, y, W + 120, 8);
  const pop = (t0, fn) => { const k = clamp((lt - t0) / .18); if (k <= 0) return; ctx.save(); fn(backOut(k)); ctx.restore(); };
  const tag = (x, y, s, k) => { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.font = '400 44px Bebas'; const w = ctx.measureText(s).width + 50; box(ctx, -w / 2, -34, w, 68, CREAM, 8); text(ctx, s, 0, 3, 44, '#2a2226', null, 0, 'Bebas', 400); ctx.restore(); };
  pop(.9, k => { ctx.translate(300, 640); ctx.scale(k, k); ellipse(ctx, 20, 30, 230, 200); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fill(); bottle(ctx, -70, 0, 1, -.12); bottle(ctx, 80, 20, 1, .1); }); pop(1.0, k => tag(300, 930, 'WATER × 2', k));
  pop(2.35, k => { ctx.translate(780, 640); ctx.scale(k, k); ctx.rotate(.06); ellipse(ctx, 10, 40, 200, 210); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fill(); for (const [px, py] of [[-70, -200], [-20, -230], [40, -215], [80, -190], [0, -190]]) { circle(ctx, px, py, 36); ctx.fillStyle = '#f6e7b8'; ctx.fill(); } path(ctx, [[-130, -180], [130, -180], [110, 190], [-110, 190]]); ctx.fillStyle = CREAM; ctx.fill(); for (let i = 0; i < 4; i++) { path(ctx, [[-130 + i * 74, -180], [-93 + i * 74, -180], [-88 + i * 63, 190], [-110 + i * 63, 190]]); ctx.fillStyle = RED; ctx.fill(); } box(ctx, -96, -60, 192, 110, CREAM, 10); text(ctx, 'KETTLE', 0, -28, 48, RED, null, 0, 'Bebas', 400); text(ctx, 'CORN', 0, 20, 48, RED, null, 0, 'Bebas', 400); }); pop(2.45, k => tag(780, 930, 'KETTLE CORN × 1', k));
  pop(3.9, k => { ctx.translate(540, 1500); ctx.scale(k, k); ctx.rotate(-.08); ellipse(ctx, 0, 30, 260, 150); ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fill(); line(ctx, 150, -110, 330, -250, 18, '#1b1620'); box(ctx, -210, -120, 420, 240, '#2e2a3a', 30); box(ctx, -180, -90, 170, 180, '#1b1620', 14); for (let i = 0; i < 6; i++) ctx.fillStyle = '#3d3850', ctx.fillRect(-166, -72 + i * 28, 142, 10); box(ctx, 20, -90, 160, 70, '#0d2a1a', 8); text(ctx, 'CH 4', 100, -52, 48, '#7dff8a', null, 0, 'Bebas', 400); circle(ctx, 60, 50, 26); ctx.fillStyle = '#4a455e'; ctx.fill(); circle(ctx, 140, 50, 14); ctx.fillStyle = Math.floor(t * 3) % 2 ? '#ff5a4d' : '#6a2420'; ctx.fill(); }); pop(4.0, k => tag(540, 1720, 'RADIO × 1', k));
  vignette(ctx, .6);
  pill(ctx, 540, 250, 'CABIN 7 · SUPPLIES', { k: lt * 4, size: 40 });
} });
// 11 — Pickles
function cabinIn(ctx, t, n = 0) {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, mix('#7a3038', '#2a1420', n), mix('#4f2028', '#180c14', n)); ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.save(); rrect(ctx, 110, 330, 860, 760, 70); ctx.clip(); ctx.fillStyle = lg(ctx, 0, 330, 0, 1090, mix('#3a2a5e', '#0a0c22', n), mix('#d9705e', '#1a1f4a', n), mix('#f6b667', '#2a2f5e', n)); ctx.fillRect(110, 330, 860, 760);
  circle(ctx, 300, 1010, 90); ctx.fillStyle = mix('#ffe2a6', '#3a3f6e', n); ctx.fill();
  for (let i = 0; i < 5; i++) line(ctx, 1300, -200, 100 + i * 60, 1100 + i * 240, 16, mix('#3a3358', '#0c0c1e', n));
  ctx.fillStyle = 'rgba(255,255,255,.08)'; path(ctx, [[160, 1090], [520, 330], [640, 330], [280, 1090]]); ctx.fill(); ctx.restore();
  rrect(ctx, 110, 330, 860, 760, 70); ctx.lineWidth = 26; ctx.strokeStyle = mix('#5a2028', '#1c0c14', n); ctx.stroke(); line(ctx, 540, 330, 540, 1090, 20, mix('#5a2028', '#1c0c14', n));
  box(ctx, -100, 1420, W + 200, 130, mix('#3a2230', '#140a12', n), 30); box(ctx, -100, 1530, W + 200, 600, mix('#2c1822', '#10080e', n), 0);
}
SHOTS.push({ start: 41.2, end: 44.75, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2.5); ctx.setTransform(1.03, 0, 0, 1.03, -16 + hh[0], -30 + hh[1]); cabinIn(ctx, t, .05);
  const h1 = Math.max(0, 1 - Math.abs(lt - .42) * 5), at = lt > 1.55 ? Math.abs(Math.sin((lt - 1.55) * 7)) * clamp((3.3 - lt) * 3) : 0;
  guy(ctx, C(NORA, { x: 300 - at * 30, y: 1700, s: 600, lean: -.06 - at * .1, shadow: false, legs: { L: [-1.2, 1.3], R: [1.3, -1.3] }, arms: at > .1 ? { L: [1.2, 1.4], R: { ik: [.2, -.7], bend: -1 } } : { L: [.3, -.2], R: [.3, -.2] }, face: { eyes: at > .1 || h1 > .2 ? 'wide' : 'dot', mouth: at > .1 ? 'wavy' : 'flat', look: [1, .2], browUp: 1 } }));
  goose(ctx, 800, 1440, 620, t, { flip: -1, honk: Math.max(h1, at), neck: .25 + at * 1.5 + h1 * .6 });
  if (h1 > .1 || at > .5) for (let i = 0; i < 3; i++) line(ctx, 560 - i * 6, 760 + i * 40, 500 - i * 10, 730 + i * 50, 9, CREAM);
  vignette(ctx, .55);
  nameCard(ctx, 560, 440, 'PICKLES', 'PARK GOOSE · NOT INVITED', (lt - .25) * 5, .03);
} });
// 12 — on paper: three days   /   13 — one problem
function cabinOut(ctx, lt, t, cam, n, look, scared) { park(ctx, t, cam, { n }); applyCam(ctx, cam, 1); ferris(ctx, WX, WY, WR, Math.PI, { t, n, inside: noraInside(look, scared), heroWin: mix('#3a3050', '#ffd98a', .35) }); }
SHOTS.push({ start: 44.75, end: 48.0, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), cam = { x: 540 + hh[0], y: kf(lt, [[0, 330], [3.25, 300]]) + hh[1], z: kf(lt, [[0, 2.3], [3.25, 2.0]]), r: Math.sin(t * .6) * .005 };
  cabinOut(ctx, lt, t, cam, .12 + lt * .05, [0, 0], false); vignette(ctx, .5);
  pill(ctx, 540, 250, 'ON PAPER: 3 DAYS', { k: (lt - .3) * 4, dot: '#7dff8a', size: 42 });
  for (let i = 0; i < 3; i++) { const k = clamp((lt - 1.6 - i * .28) * 5); if (k > 0) ui(ctx, () => { ctx.translate(390 + i * 150, 345); ctx.scale(backOut(k), backOut(k)); box(ctx, -62, -30, 124, 60, 'rgba(24,18,30,.92)', 12); text(ctx, `DAY ${i + 1}`, 10, 3, 36, CREAM, null, 0, 'Bebas', 400); circle(ctx, -40, 0, 9); ctx.fillStyle = '#7dff8a'; ctx.fill(); }); }
} });
SHOTS.push({ start: 48.0, end: 50.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), cam = { x: 540 + hh[0], y: kf(lt, [[0, 420], [2.2, 520]]) + hh[1], z: kf(lt, [[0, 1.7], [2.2, 1.2]]), r: 0 };
  cabinOut(ctx, lt, t, cam, kf(lt, [[0, .3], [2.2, .9]]), [0, 1], false); tint(ctx, '#0a0818', .2); vignette(ctx, .7);
} });
// 14 — 8 p.m.: the park turns itself on
function note(ctx, x, y, s, a) { ctx.save(); ctx.globalAlpha = a; ellipse(ctx, x, y, s * .3, s * .22, -.4); ctx.fillStyle = CREAM; ctx.fill(); line(ctx, x + s * .26, y - s * .05, x + s * .26, y - s * .9, s * .09, CREAM); path(ctx, [[x + s * .26, y - s * .9], [x + s * .7, y - s * .7], [x + s * .26, y - s * .55]]); ctx.fill(); ctx.restore(); }
SHOTS.push({ start: 50.2, end: 55.45, tr: 'cut', draw(ctx, lt, t) {
  const on = 2.0, lit = clamp((lt - on) / 1.3), fl = lt > on ? Math.max(0, 1 - (lt - on) * 3) : 0, hh = handheld(t, 2.5);
  const cam = { x: 540 + hh[0], y: kf(lt, [[0, 760], [5.25, 860]]) + hh[1], z: kf(lt, [[0, .9], [5.25, .8]]), r: 0 };
  park(ctx, t, cam, { n: .92, lit }); applyCam(ctx, cam, 1);
  ferris(ctx, WX, WY, WR, Math.PI, { t, n: .92, lit, inside: noraInside([0, 1], lit > .3) });
  booth(ctx, 1010, GROUND, 1, .92);
  tinyCrowd(ctx, t, -400, 1500, 1500, 44, { s: 80, dy: 160, sp: 10, inf: 1, seed: 5 });
  if (lt > 4.3) for (let i = 0; i < 6; i++) { const k = ((t * .5 + i / 6) % 1); note(ctx, 150 + i * 160 + Math.sin(t * 2 + i) * 30, 1250 - k * 420, 70, (1 - k) * clamp((lt - 4.3) * 3)); }
  tint(ctx, '#fff2d0', fl * .3, 'screen'); vignette(ctx, .6 - lit * .15);
  pill(ctx, 540, 250, lt < .68 ? '7:59 PM' : '8:00 PM', { size: 54, dot: lt < .68 ? '#ffc53a' : '#ff5a4d', k: lt * 5 });
  pill(ctx, 540, 345, '20,000 LIGHTS', { k: (lt - 3.1) * 4, size: 40 });
} });
// 15 — every head turns
SHOTS.push({ start: 55.45, end: 57.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: 540 + hh[0], y: kf(lt, [[0, 1330], [1.75, 1250]]) + hh[1], z: kf(lt, [[0, 1.15], [1.75, 1.28]]), r: 0 };
  park(ctx, t, cam, { n: .95, lit: 1 }); applyCam(ctx, cam, 1);
  blurLayer(ctx, 4, c => { applyCam(c, cam, 1); ferris(c, WX, WY - 150, WR, Math.PI, { t, n: .95, lit: 1 }); });
  applyCam(ctx, cam, 1);
  const zs = [[90, 1560, 330, 0], [300, 1540, 300, 2], [520, 1560, 340, 4], [740, 1545, 310, 1], [960, 1560, 330, 3], [190, 1760, 470, 5], [470, 1790, 500, 6], [760, 1770, 480, 7], [1010, 1800, 500, 8]];
  zs.forEach(([x, y, s, i]) => { const k = clamp((lt - .1 - i * .09) * 6); infected(ctx, x, y, s, t, { ph: i, still: true, eyes: k > 0, dir: i % 2 ? -1 : 1, col: i > 4 ? '#0f0c16' : '#1a1626', extra: { headTilt: lerp(.15, -.38, ease(k)), lean: lerp(.1, -.04, k), arms: { L: [.25, -.1], R: [.25, -.1] } } }); });
  tint(ctx, '#d8392b', .2 + .1 * Math.sin(t * 6), 'overlay'); vignette(ctx, .7);
} });
// 16 — the radio
SHOTS.push({ start: 57.2, end: 60.9, tr: 'cut', draw(ctx, lt, t) {
  const talk = (lt > 1.6 && lt < 2.25) || (lt > 2.3 && lt < 3.55), crackle = (lt > .35 && lt < 1.3) || talk, hh = handheld(t, crackle ? 5 : 2);
  ctx.setTransform(1.05 + lt * .012, 0, 0, 1.05 + lt * .012, -30 - lt * 6 + hh[0], -50 - lt * 10 + hh[1]);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#2a1420', '#140a12'); ctx.fillRect(-80, -80, W + 160, H + 160);
  const lc = ['255,214,120', '255,120,110', '120,230,255'][Math.floor(t * 2) % 3]; glow(ctx, 900, 200, 900, lc, .18);
  line(ctx, 690, 520, 760, 120, 26, '#15121a'); circle(ctx, 760, 120, 22); ctx.fillStyle = '#15121a'; ctx.fill();
  for (let i = 0; i < 4; i++) box(ctx, 230, 900 + i * 118, 190, 102, '#9a6a48', 50);
  box(ctx, 330, 480, 440, 960, '#322d40', 50); ctx.fillStyle = 'rgba(0,0,0,.2)'; rrect(ctx, 620, 480, 150, 960, [0, 50, 50, 0]); ctx.fill();
  box(ctx, 380, 540, 340, 170, '#0d2a1a', 16); ctx.beginPath(); for (let i = 0; i <= 40; i++) { const yy = 625 + (crackle ? Math.sin(i * 1.3 + t * 30) * 48 * Math.sin(i / 40 * Math.PI) * (talk ? 1 : .5 + .5 * Math.sin(t * 50 + i)) : 0); i ? ctx.lineTo(395 + i * 7.7, yy) : ctx.moveTo(395, yy); } ctx.lineWidth = 7; ctx.strokeStyle = '#7dff8a'; ctx.stroke(); if (crackle) glow(ctx, 550, 625, 380, '125,255,138', .25);
  text(ctx, 'CH 4', 440, 760, 56, '#8a86a0', null, 0, 'Bebas', 400); circle(ctx, 680, 760, 20); ctx.fillStyle = crackle ? '#ff5a4d' : '#5a2420'; ctx.fill(); if (crackle) glow(ctx, 680, 760, 120, '255,90,77', .6);
  box(ctx, 380, 830, 340, 380, '#1e1a28', 18); for (let i = 0; i < 9; i++) box(ctx, 404, 856 + i * 38, 292, 14, '#3d3850', 7);
  box(ctx, 660, 1180, 420, 190, '#b57a52', 95); box(ctx, 700, 1330, 600, 800, '#b57a52', 140);
  if (crackle) for (let i = 0; i < 3; i++) { const k = (t * 2 + i / 3) % 1; ctx.beginPath(); ctx.arc(550, 1020, 260 + k * 260, -2.2, -.95); ctx.lineWidth = 12; ctx.strokeStyle = `rgba(255,197,58,${(1 - k) * .8})`; ctx.stroke(); }
  vignette(ctx, .7);
  pill(ctx, 540, 250, talk ? 'INCOMING · CH 4' : 'RADIO · CH 4', { k: lt * 4, size: 40, dot: talk ? '#ff5a4d' : '#7dff8a' });
} });
// 17 — the wheel starts to move
SHOTS.push({ start: 60.9, end: 63.1, tr: 'cut', draw(ctx, lt, t) {
  const sh = Math.max(0, 1 - lt * 1.5), hk = shake(t * 3, 14 * sh, 3), hh = handheld(t, 3), rot = Math.PI + easeIn(clamp(lt / 2.6)) * .9;
  const cam = { x: 540 + hh[0] + hk[0], y: kf(lt, [[0, 620], [2.2, 760]]) + hh[1] + hk[1], z: kf(lt, [[0, 1.25], [2.2, .95]]), r: 0 };
  park(ctx, t, cam, { n: .95, lit: 1 }); applyCam(ctx, cam, 1);
  ferris(ctx, WX, WY, WR, rot, { t, n: .95, lit: 1, inside: noraInside([0, 1], true) });
  booth(ctx, 1010, GROUND, 1, .95, 1);
  tinyCrowd(ctx, t, -400, 1500, 1500, 50, { s: 80, dy: 160, sp: 14, inf: 1, seed: 5 });
  vignette(ctx, .6);
  if (Math.floor(t * 4) % 2 || lt < .4) pill(ctx, 540, 250, 'WHEEL: MOVING', { size: 46, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 18 — someone is in the control booth
SHOTS.push({ start: 63.1, end: 65.5, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), cam = { x: kf(lt, [[0, 860], [2.4, 1005]]) + hh[0], y: kf(lt, [[0, 1250], [2.4, 1300]]) + hh[1], z: kf(lt, [[0, 1.3], [2.4, 3.3]], easeIn), r: 0 };
  park(ctx, t, cam, { n: .95, lit: 1 }); applyCam(ctx, cam, 1);
  ferris(ctx, WX, WY, WR, Math.PI + .9 + lt * .25, { t, n: .95, lit: 1 });
  booth(ctx, 1010, GROUND, 1, .95, .85, c => { guy(c, { x: 1000, y: GROUND - 60, s: 200, sil: '#120e18', shadow: false, arms: { L: [.3, -.1], R: [1.9, -.5] }, headTilt: lt > 1.5 ? .12 : 0 }); line(c, 1066, GROUND - 130, 1076, GROUND - 200, 9, '#120e18'); circle(c, 1076, GROUND - 204, 10); c.fillStyle = RED; c.fill(); });
  tinyCrowd(ctx, t, -400, 900, 1500, 40, { s: 80, dy: 160, sp: 14, inf: 1, seed: 5 });
  vignette(ctx, .75); darkness(ctx, clamp((lt - 2.22) / .15));
} });
// 19 — end card
SHOTS.push({ start: 65.5, end: 69.5, tr: 'cut', draw(ctx, lt, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0f0d18'; ctx.fillRect(0, 0, W, H);
  const R = rng(9); for (let i = 0; i < 60; i++) { circle(ctx, R() * W, R() * H, 1.5 + R() * 2); ctx.fillStyle = `rgba(240,235,255,${.1 + .2 * Math.sin(t * 2 + i) ** 2})`; ctx.fill(); }
  glow(ctx, 540, 820, 700, '216,57,43', .12);
  const L = (s, y, size, col, t0, sp = 0) => { const k = clamp((lt - t0) / .3); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.translate(540, y + (1 - easeOut(k)) * 26); if (sp) ctx.letterSpacing = sp + 'px'; text(ctx, s, 0, 0, size, col, null, 0, 'Bebas', 400); ctx.restore(); };
  L('ZOMBIE APOCALYPSE AT A THEME PARK', 600, 46, 'rgba(243,234,216,.75)', .15, 4); L('PART 2', 790, 280, CREAM, .4, 6); L('THE CONTROL BOOTH', 985, 96, '#ff4b3a', .8, 5);
  L('WHO STARTED', 1150, 120, CREAM, 1.3, 2); L('THE WHEEL?', 1268, 120, CREAM, 1.3, 2); L('FOLLOW FOR PART 2', 1420, 50, '#ffc53a', 1.9, 5); L('STORY = FICTION · SURVIVAL FACTS = REAL', 1500, 32, 'rgba(243,234,216,.5)', 2.2, 3);
  vignette(ctx, .5); darkness(ctx, clamp((lt - 3.75) / .25));
} });
