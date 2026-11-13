// ---------- "Zombie apocalypse at a theme park", part 2: the control booth ----------
const HL = { two: 'y', moving: 'r', down: 'r', lever: 'y', "isn't": 'r', infected: 'r', fell: 'r', three: 'y', minutes: 'y', ground: 'r', radio: 'y', gus: 'y', mechanic: 'y', hub: 'y', "doesn't": 'y', still: 'y', ladder: 'y', climbs: 'y', bites: 'r', twice: 'r', hundred: 'y', feet: 'y', stops: 'y', lights: 'r', calling: 'r', noise: 'y', coaster: 'y', empty: 'r', loudest: 'y', head: 'y', turns: 'y', away: 'y', works: 'y', back: 'r', lap: 'r', bars: 'r', unlock: 'r', themselves: 'r' };
window.HL = HL;
const SHOTS = [];
const GROUND = 1500, WX = 540, WY = 700, WR = 520, N = .95;
function park(ctx, t, cam, o = {}) { const n = o.n == null ? N : o.n; sky(ctx, t, cam, n); skyline(ctx, t, cam, n, o.lit == null ? 1 : o.lit, GROUND); groundP(ctx, cam, n, GROUND); }
function titleTags(ctx, lt, part, clock) {
  ui(ctx, () => { const k = clamp(lt * 3); ctx.globalAlpha = k; ctx.font = '400 44px Bebas'; const s1 = 'ZOMBIE APOCALYPSE AT A THEME PARK', w = ctx.measureText(s1).width + 70; box(ctx, 540 - w / 2, 236, w, 66, RED, 8); text(ctx, s1, 540, 272, 44, CREAM, null, 0, 'Bebas', 400);
    box(ctx, 465, 318, 150, 62, CREAM, 6); text(ctx, part, 540, 352, 46, '#2a2226', null, 0, 'Bebas', 400); });
  pill(ctx, 540, 428, clock, { k: lt * 3 - .3, size: 34 });
}
const ROT0 = Math.PI + .9, rotAt = T => ROT0 + T * .12;   // the wheel keeps turning through the whole episode
const GUS = { skin: '#e0b592', jacket: '#3d5a86', shoes: '#2a2226', browCol: '#8a8a94',
  hair: (c, hy, hr) => { c.beginPath(); c.arc(0, hy, hr + .004, Math.PI + .1, Math.PI + .9); c.lineTo(-hr * .6, hy - hr * .2); c.closePath(); c.fillStyle = '#b9b9c4'; c.fill(); c.beginPath(); c.arc(0, hy, hr + .004, -.9, -.1); c.lineTo(hr * .6, hy - hr * .2); c.closePath(); c.fill(); },
  hat: (c, hy, hr) => { c.beginPath(); c.moveTo(-.075, hy + .085); c.quadraticCurveTo(0, hy + .05, .075, hy + .085); c.quadraticCurveTo(.04, hy + .125, 0, hy + .1); c.quadraticCurveTo(-.04, hy + .125, -.075, hy + .085); c.fillStyle = '#b9b9c4'; c.fill(); c.beginPath(); c.arc(0, hy, hr + .012, Math.PI + .3, -.3); c.quadraticCurveTo(0, hy - hr * .8, -hr * .95, hy - hr * .3); c.closePath(); c.fillStyle = '#c9543e'; c.fill(); c.beginPath(); c.ellipse(0, hy - hr * .42, hr * 1.05, hr * .13, 0, 0, TAU); c.fillStyle = '#a03c2c'; c.fill(); },
  deco: (c, tw, tTop) => { c.fillStyle = '#2f486e'; c.fillRect(-.006, tTop, .012, 1); c.fillStyle = '#f3ead8'; c.beginPath(); c.roundRect(-.11, tTop + .1, .075, .045, .01); c.fill(); } };
function radioBig(ctx, t, on, talk) {
  line(ctx, 690, 520, 760, 120, 26, '#15121a'); circle(ctx, 760, 120, 22); ctx.fillStyle = '#15121a'; ctx.fill();
  for (let i = 0; i < 4; i++) box(ctx, 230, 900 + i * 118, 190, 102, '#9a6a48', 50);
  box(ctx, 330, 480, 440, 960, '#322d40', 50); ctx.fillStyle = 'rgba(0,0,0,.2)'; rrect(ctx, 620, 480, 150, 960, [0, 50, 50, 0]); ctx.fill();
  box(ctx, 380, 540, 340, 170, '#0d2a1a', 16); ctx.beginPath(); for (let i = 0; i <= 40; i++) { const yy = 625 + (on ? Math.sin(i * 1.3 + t * 30) * 48 * Math.sin(i / 40 * Math.PI) * (talk ? 1 : .5 + .5 * Math.sin(t * 50 + i)) : 0); i ? ctx.lineTo(395 + i * 7.7, yy) : ctx.moveTo(395, yy); } ctx.lineWidth = 7; ctx.strokeStyle = '#7dff8a'; ctx.stroke(); if (on) glow(ctx, 550, 625, 380, '125,255,138', .25);
  text(ctx, 'CH 4', 440, 760, 56, '#8a86a0', null, 0, 'Bebas', 400); circle(ctx, 680, 760, 20); ctx.fillStyle = on ? '#ff5a4d' : '#5a2420'; ctx.fill(); if (on) glow(ctx, 680, 760, 120, '255,90,77', .6);
  box(ctx, 380, 830, 340, 380, '#1e1a28', 18); for (let i = 0; i < 9; i++) box(ctx, 404, 856 + i * 38, 292, 14, '#3d3850', 7);
  box(ctx, 660, 1180, 420, 190, '#b57a52', 95); box(ctx, 700, 1330, 600, 800, '#b57a52', 140);
  if (on) for (let i = 0; i < 3; i++) { const k = (t * 2 + i / 3) % 1; ctx.beginPath(); ctx.arc(550, 1020, 260 + k * 260, -2.2, -.95); ctx.lineWidth = 12; ctx.strokeStyle = `rgba(255,197,58,${(1 - k) * .8})`; ctx.stroke(); }
}
function gooseHead(ctx, x, y, s, peck = 0, ang = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(ang - peck * .5); line(ctx, 0, s * .9, 0, 0, s * .55, '#f4f1ea'); circle(ctx, 0, 0, s * .5); ctx.fillStyle = '#f4f1ea'; ctx.fill(); path(ctx, [[-s * .35, -s * .2], [-s * 1.3, 0 - peck * s * .1], [-s * .4, s * .12]]); ctx.fillStyle = '#e8872a'; ctx.fill(); path(ctx, [[-s * .35, s * .06], [-s * 1.1, s * .12 + peck * s * .25], [-s * .35, s * .26]]); ctx.fillStyle = '#c96f1c'; ctx.fill(); circle(ctx, -s * .12, -s * .1, s * .1); ctx.fillStyle = DK; ctx.fill(); line(ctx, -s * .32, -s * .34, s * .08, -s * .24, s * .07, DK); ctx.restore(); }

// 1 — title
SHOTS.push({ start: 0, end: 3.3, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: 540 + hh[0], y: kf(lt, [[0, 820], [3.3, 880]]) + hh[1], z: kf(lt, [[0, .78], [3.3, .9]]), r: 0 };
  park(ctx, t, cam); applyCam(ctx, cam, 1);
  ferris(ctx, WX, WY, WR, rotAt(t), { t, n: N, lit: 1, inside: noraInside([0, 1], true) }); booth(ctx, 1010, GROUND, 1, N, .85);
  tinyCrowd(ctx, t, -400, 1500, 1500, 50, { s: 80, dy: 160, sp: 14, inf: 1, seed: 5 });
  vignette(ctx, .6); titleTags(ctx, lt, 'PART 2', 'DAY 1 · 8:02 PM');
} });
// 2 — her cabin is going down
SHOTS.push({ start: 3.3, end: 6.85, tr: 'cut', draw(ctx, lt, t) {
  const rot = rotAt(t), hx = WX + Math.sin(rot) * WR, hy = WY + Math.cos(rot) * WR, hh = handheld(t, 3);
  const cam = { x: hx + 60 + hh[0], y: hy + 150 + hh[1], z: kf(lt, [[0, 2.5], [3.55, 2.0]]), r: 0 };
  park(ctx, t, cam); applyCam(ctx, cam, 1);
  ferris(ctx, WX, WY, WR, rot, { t, n: N, lit: 1, inside: noraInside([0, 1], true), heroWin: '#4a3a50' });
  for (let i = 0; i < 3; i++) { const yy = hy + 20 + ((t * 160 + i * 60) % 180); line(ctx, hx + 90 + i * 22, yy, hx + 90 + i * 22, yy + 50, 6, 'rgba(243,234,216,.55)'); }
  vignette(ctx, .6);
  if (Math.floor(t * 3) % 2 || lt < .5) pill(ctx, 540, 250, 'CABIN 7: GOING DOWN', { size: 44, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 3 — someone is leaning on the lever
const inBooth = (lt, eyes) => c => { guy(c, { x: 1004, y: GROUND - 62, s: 200, sil: '#120e18', shadow: false, lean: .22, headTilt: .35, eyesGlow: eyes, arms: { L: [.2, -.1], R: [1.7, -.6] } }); line(c, 1066, GROUND - 128, 1080, GROUND - 196, 9, '#120e18'); circle(c, 1080, GROUND - 200, 10); c.fillStyle = RED; c.fill(); };
SHOTS.push({ start: 6.85, end: 10.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), cam = { x: kf(lt, [[0, 820], [3.35, 1005]]) + hh[0], y: kf(lt, [[0, 1220], [3.35, 1300]]) + hh[1], z: kf(lt, [[0, 1.2], [3.35, 3.0]], ease), r: 0 };
  park(ctx, t, cam); applyCam(ctx, cam, 1);
  ferris(ctx, WX, WY, WR, rotAt(t), { t, n: N, lit: 1 }); booth(ctx, 1010, GROUND, 1, N, .85, inBooth(lt, false));
  tinyCrowd(ctx, t, -400, 900, 1500, 40, { s: 80, dy: 160, sp: 14, inf: 1, seed: 5 });
  vignette(ctx, .7);
} });
// 4 — he isn't driving
SHOTS.push({ start: 10.2, end: 13.95, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), on = lt > 1.55, sh = on ? Math.max(0, 1 - (lt - 1.55) * 3) : 0, hk = shake(t * 3, 12 * sh, 3);
  ctx.setTransform(1.02 + lt * .012, 0, 0, 1.02 + lt * .012, -12 - lt * 6 + hh[0] + hk[0], -20 - lt * 10 + hh[1] + hk[1]);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#e9c98a', '#c99a55'); ctx.fillRect(-80, -80, W + 160, H + 160);
  ctx.fillStyle = 'rgba(90,50,10,.12)'; for (let x = 0; x < W; x += 130) ctx.fillRect(x, -80, 10, H + 160);
  box(ctx, 90, 150, 420, 300, '#2a2440', 16); for (let i = 0; i < 6; i++) { circle(ctx, 150 + (i % 3) * 110, 230 + Math.floor(i / 3) * 110, 26); ctx.fillStyle = ['#7dff8a', '#ffc53a', '#ff5a4d'][(i + Math.floor(t * 2)) % 3]; ctx.fill(); }
  // console + lever
  box(ctx, -80, 1380, W + 160, 700, '#3a3358', 0); box(ctx, -80, 1340, W + 160, 70, '#4a4270', 0);
  line(ctx, 800, 1380, 900, 900, 44, '#1b1620'); circle(ctx, 900, 880, 62); ctx.fillStyle = RED; ctx.fill(); text(ctx, 'RUN', 800, 1470, 60, CREAM, null, 0, 'Bebas', 400);
  // slumped figure
  ctx.save(); ctx.translate(430, 1900); ctx.rotate(.3); ctx.fillStyle = '#15111d'; ctx.beginPath(); ctx.roundRect(-290, -900, 580, 1100, 200); ctx.fill(); ctx.restore();
  line(ctx, 610, 1120, 880, 930, 80, '#15111d');
  ctx.save(); ctx.translate(600, 800 + Math.sin(t * 1.5) * 8); ctx.rotate(.42 + Math.sin(t * 1.5) * .02); circle(ctx, 0, 0, 290); ctx.fillStyle = '#15111d'; ctx.fill();
  if (on) for (const sd of [-1, 1]) { glow(ctx, sd * 110, 20, 190, '255,255,255', .6); circle(ctx, sd * 110, 20, 46); ctx.fillStyle = '#fff'; ctx.fill(); }
  ctx.restore();
  tint(ctx, '#d8392b', on ? .22 : 0, 'overlay'); vignette(ctx, .65);
  pill(ctx, 540, 250, on ? 'DRIVER: INFECTED' : 'DRIVER: ?', { size: 44, k: lt * 4, bg: on ? 'rgba(150,25,20,.95)' : undefined, dot: on ? '#fff' : '#ffc53a' });
} });
// 5 — three minutes
function wheelDiagram(ctx, t, ang, o = {}) {
  paper(ctx); const cx = 540, cy = 760, R = 330;
  text(ctx, o.title || 'WHEEL · SIDE VIEW', 90, 180, 40, 'rgba(60,45,35,.6)', null, 0, 'Bebas', 400, 'left');
  line(ctx, 80, cy + R + 150, 1000, cy + R + 150, 10, '#4a3f66'); for (const sd of [-1, 1]) line(ctx, cx, cy, cx + sd * 210, cy + R + 150, 14, '#8a7f9e');
  circle(ctx, cx, cy, R); ctx.lineWidth = 12; ctx.strokeStyle = '#4a3f66'; ctx.stroke();
  for (let i = 0; i < 12; i++) { const a = ang + i * TAU / 12; line(ctx, cx, cy, cx + Math.sin(a) * R, cy + Math.cos(a) * R, 5, '#8a7f9e'); const gx = cx + Math.sin(a) * R, gy = cy + Math.cos(a) * R; box(ctx, gx - 26, gy - 4, 52, 44, i === 0 ? RED : '#b9ab8c', 10); }
  return [cx, cy, R];
}
SHOTS.push({ start: 13.95, end: 17.2, tr: 'cut', draw(ctx, lt, t) {
  const a = Math.PI + 1.3 + lt * .05, [cx, cy, R] = wheelDiagram(ctx, t, a);
  ctx.beginPath(); ctx.arc(cx, cy, R + 60, Math.PI / 2 - (a - TAU), Math.PI / 2, false); ctx.setLineDash([18, 14]); ctx.lineWidth = 9; ctx.strokeStyle = RED; ctx.stroke(); ctx.setLineDash([]);
  path(ctx, [[cx - 6, cy + R + 100], [cx + 46, cy + R + 60], [cx + 40, cy + R + 124]]); ctx.fillStyle = RED; ctx.fill();
  box(ctx, cx - 190, cy + R + 160, 380, 64, RED, 10); text(ctx, 'GROUND · INFECTED', cx, cy + R + 195, 44, CREAM, null, 0, 'Bebas', 400);
  const hx = cx + Math.sin(a) * R, hy = cy + Math.cos(a) * R; circle(ctx, hx, hy + 18, 62 + Math.sin(t * 6) * 6); ctx.lineWidth = 7; ctx.strokeStyle = RED; ctx.stroke(); text(ctx, 'NORA', hx - 84, hy + 20, 44, '#2a2226', null, 0, 'Bebas', 400, 'right');
  const sec = Math.max(0, 180 - Math.floor(lt * 1.0)); ui(ctx, () => { box(ctx, 330, 300, 420, 190, 'rgba(24,18,30,.94)', 26); text(ctx, `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`, 540, 402, 170, sec % 2 ? '#ff5a4d' : CREAM, null, 0, 'Bebas', 400); });
  vignette(ctx, .35);
} });
// 6 — the radio again: Gus
SHOTS.push({ start: 17.2, end: 18.8, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 5); ctx.setTransform(1.06, 0, 0, 1.06, -32 + hh[0], -56 + hh[1]);
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#2a1420', '#140a12'); ctx.fillRect(-80, -80, W + 160, H + 160); glow(ctx, 900, 200, 900, ['255,214,120', '255,120,110', '120,230,255'][Math.floor(t * 2) % 3], .18);
  radioBig(ctx, t, lt > .25, false); vignette(ctx, .7);
  pill(ctx, 540, 250, 'INCOMING · CH 4', { k: lt * 5, size: 40, dot: '#ff5a4d' });
} });
function shed(ctx, t) {
  ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#2c2a3a', '#1a1824'); ctx.fillRect(-100, -100, W + 200, H + 200);
  for (let x = -40; x < W + 100; x += 150) { ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(x, -100, 12, 1500); }
  // window with the lit wheel outside
  box(ctx, 610, 300, 340, 300, '#0d1030', 14); ctx.save(); rrect(ctx, 610, 300, 340, 300, 14); ctx.clip(); circle(ctx, 800, 520, 170); ctx.lineWidth = 8; ctx.strokeStyle = '#2a2a55'; ctx.stroke(); for (let i = 0; i < 26; i++) { const a = i * TAU / 26 + t * .12; circle(ctx, 800 + Math.sin(a) * 170, 520 + Math.cos(a) * 170, 7); ctx.fillStyle = ['#ffd678', '#ff786e', '#78e6ff', '#fff'][i % 4]; ctx.fill(); } ctx.restore(); rrect(ctx, 610, 300, 340, 300, 14); ctx.lineWidth = 16; ctx.strokeStyle = '#3d3a50'; ctx.stroke(); line(ctx, 780, 300, 780, 600, 10, '#3d3a50');
  // generator
  box(ctx, 40, 760, 430, 560, '#b08a2e', 24); box(ctx, 70, 800, 370, 180, '#8a6a1e', 12); for (let i = 0; i < 7; i++) box(ctx, 90 + i * 50, 815, 22, 150, '#5a4410', 6); circle(ctx, 150, 1100, 60); ctx.fillStyle = '#2a2226'; ctx.fill(); line(ctx, 150, 1100, 150 + Math.cos(t * 3) * 44, 1100 + Math.sin(t * 3) * 44, 10, '#ff5a4d'); box(ctx, 260, 1050, 170, 100, '#2a2226', 10); text(ctx, 'GEN 2', 345, 1104, 54, '#7dff8a', null, 0, 'Bebas', 400);
  ctx.save(); ctx.translate(Math.sin(t * 40) * 2, 0); box(ctx, 180, 700, 60, 70, '#3d3a50', 8); ctx.restore();
  box(ctx, -100, 1320, W + 200, 800, '#15131c', 0); ctx.fillStyle = 'rgba(255,255,255,.04)'; ctx.fillRect(-100, 1320, W + 200, 14);
  // lantern
  glow(ctx, 560, 1210, 620, '255,190,110', .5); box(ctx, 525, 1180, 70, 140, '#ffdf9a', 14); box(ctx, 515, 1160, 90, 30, '#3d3a50', 8); box(ctx, 515, 1310, 90, 24, '#3d3a50', 8);
}
SHOTS.push({ start: 18.8, end: 22.6, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2.5); ctx.setTransform(1.03 + lt * .01, 0, 0, 1.03 + lt * .01, -16 - lt * 5 + hh[0], -30 - lt * 8 + hh[1]); shed(ctx, t);
  guy(ctx, C(GUS, { x: 690, y: 1560, s: 620, armLen: 1.2, lean: -.04, legs: { L: [.5, -1.3], R: [.6, -1.4] }, arms: { L: [.5, -.5], R: { ik: [.13, -.66], bend: -1 } }, headTilt: .04, face: { eyes: 'dot', mouth: Math.sin(t * 15) > 0 ? 'o' : 'flat', look: [-.4, -.3], browAng: -.15, browUp: .5 },
    prop: (c, k, h) => { if (k !== 'R') return; c.fillStyle = '#322d40'; c.beginPath(); c.roundRect(h[0] - .03, h[1] - .12, .06, .13, .015); c.fill(); line(c, h[0] + .015, h[1] - .12, h[0] + .03, h[1] - .2, .01, '#15121a'); circle(c, h[0], h[1] - .09, .008); c.fillStyle = '#ff5a4d'; c.fill(); } }));
  vignette(ctx, .7);
  nameCard(ctx, 90, 500, 'GUS · 61', 'NIGHT MECHANIC', (lt - .25) * 5, -.03);
  pill(ctx, 540, 250, 'GENERATOR SHED', { k: (lt - 1.9) * 4, size: 40 });
} });
// 7 — the cabins go down, the hub doesn't
SHOTS.push({ start: 22.6, end: 25.75, tr: 'cut', draw(ctx, lt, t) {
  const a = Math.PI + 1.5 + lt * .25, [cx, cy, R] = wheelDiagram(ctx, t, a, { title: 'WHAT MOVES · WHAT DOESN\'T' });
  for (const [ax, ay] of [[cx - R - 90, cy - 60], [cx - R - 90, cy + 120]]) { const yy = ay + ((t * 90) % 40); line(ctx, ax, yy - 70, ax, yy, 14, RED); path(ctx, [[ax - 26, yy - 6], [ax + 26, yy - 6], [ax, yy + 34]]); ctx.fillStyle = RED; ctx.fill(); }
  const k = clamp((lt - 1.9) / .25); if (k > 0) { circle(ctx, cx, cy, 56 + Math.sin(t * 7) * 6); ctx.fillStyle = `rgba(63,163,91,${.9 * k})`; ctx.fill(); circle(ctx, cx, cy, 110 * k); ctx.lineWidth = 8; ctx.strokeStyle = 'rgba(63,163,91,.7)'; ctx.stroke(); ui(ctx, () => { ctx.translate(540, 470); ctx.scale(backOut(k), backOut(k)); box(ctx, -210, -44, 420, 88, '#2f8f55', 12); text(ctx, 'HUB · STAYS STILL', 0, 4, 56, CREAM, null, 0, 'Bebas', 400); }); } else { circle(ctx, cx, cy, 40); ctx.fillStyle = '#4a3f66'; ctx.fill(); }
  vignette(ctx, .35);
  pill(ctx, 540, 250, 'CABINS: GOING DOWN', { k: lt * 4, size: 40, dot: '#ff5a4d' });
} });
// 8 — rule #2
SHOTS.push({ start: 25.75, end: 29.1, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: 540 + hh[0], y: 860 + hh[1], z: kf(lt, [[0, .9], [3.35, .82]]), r: 0 };
  park(ctx, t, cam); applyCam(ctx, cam, 1); ferris(ctx, WX, WY, WR, rotAt(t), { t, n: N, lit: 1, inside: noraInside([0, 1], true) }); booth(ctx, 1010, GROUND, 1, N, .85);
  tinyCrowd(ctx, t, -400, 1500, 1500, 50, { s: 80, dy: 160, sp: 14, inf: 1, seed: 5 });
  tint(ctx, '#120a1c', .45); vignette(ctx, .6);
  ruleCard(ctx, 540, 640, 'RULE #2', 'FIND THE PART', lt > 2.0 ? 'THAT STAYS STILL.' : '', (lt - .08) * 5, { w: 860, h: 400, size: 124, size2: 100 });
} });
// 9 — the service ladder
function spokeScene(ctx, lt, t, u, o = {}) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#070818', '#12143a', '#2a2050'); ctx.fillRect(0, 0, W, H);
  const A = [1380, 2150], B = [-260, 30], P = k => [lerp(A[0], B[0], k), lerp(A[1], B[1], k)], p = P(u), off = [540 - p[0] + 60, 980 - p[1]];
  const R = rng(4); for (let i = 0; i < 34; i++) { const bx = (R() * 1700 - 300 + off[0] * .25), by = R() * 2100 - 100 + off[1] * .25, r = 20 + R() * 50, c = ['255,214,120', '255,120,110', '120,230,255', '255,255,255'][i % 4]; glow(ctx, bx, by, r * 2.4, c, .2 + .1 * Math.sin(t * 3 + i)); }
  ctx.translate(off[0], off[1]);
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  for (const w of [150, 0]) { line(ctx, A[0] + nx * w, A[1] + ny * w, B[0] + nx * w, B[1] + ny * w, w ? 30 : 110, w ? '#1b1838' : '#2a2650'); }
  line(ctx, A[0] - nx * 30, A[1] - ny * 30, B[0] - nx * 30, B[1] - ny * 30, 12, 'rgba(255,255,255,.07)');
  for (const sd of [-1, 1]) line(ctx, A[0] + nx * sd * 62, A[1] + ny * sd * 62, B[0] + nx * sd * 62, B[1] + ny * sd * 62, 16, '#8f8ab8');
  for (let d = 60; d < L; d += 105) { const x = A[0] + ux * d, y = A[1] + uy * d; line(ctx, x - nx * 62, y - ny * 62, x + nx * 62, y + ny * 62, 13, '#b5b0d8'); if (Math.floor(d / 105) % 3 === 0) { const c = ['255,214,120', '120,230,255', '255,120,110'][Math.floor(d / 315) % 3]; glow(ctx, x + nx * 150, y + ny * 150, 90, c, .6); circle(ctx, x + nx * 150, y + ny * 150, 12); ctx.fillStyle = `rgb(${c})`; ctx.fill(); } }
  if (o.cabin) cabin(ctx, A[0] - 260, A[1] - 760, 560, '#a82e2a', { win: '#2a2440' });
  const ang = Math.atan2(ux, -uy), st = Math.sin(t * 7);
  ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang);
  guy(ctx, C(NORA, { x: 0, y: 0, s: 520, shadow: false, armLen: 1.25, legs: { L: [.25 + st * .25, -.5 - st * .4], R: [.25 - st * .25, -.5 + st * .4] }, arms: { L: { ik: [-.12, -.92 - st * .09] }, R: { ik: [.12, -.92 + st * .09], bend: -1 } }, face: { eyes: 'wide', mouth: 'wavy', browUp: 1, look: [0, -1] } }));
  gooseHead(ctx, 40, -350 + Math.sin(t * 5) * 6, 62, o.peck || 0, .3);
  ctx.restore();
}
SHOTS.push({ start: 29.1, end: 34.2, tr: 'cut', draw(ctx, lt, t) {
  const u = kf(lt, [[0, .2], [2.2, .24], [5.1, .55]], x => x); spokeScene(ctx, lt, t, u, { cabin: true });
  vignette(ctx, .6);
  pill(ctx, 540, 250, 'SERVICE LADDER · EVERY SPOKE', { k: (lt - .5) * 4, size: 38 });
  pill(ctx, 540, 330, `${Math.round(lerp(150, 110, clamp((lt - 2.2) / 2.9)))} FT`, { k: (lt - 2.4) * 4, size: 46, dot: '#7dff8a' });
} });
// 10 — Pickles bites her twice
SHOTS.push({ start: 34.2, end: 35.95, tr: 'cut', draw(ctx, lt, t) {
  const b1 = .7, b2 = 1.4, pk = Math.max(0, 1 - Math.abs(lt - b1) * 9) + Math.max(0, 1 - Math.abs(lt - b2) * 9), hk = shake(t * 3, 14 * pk, 3);
  ctx.setTransform(1, 0, 0, 1, hk[0], hk[1]); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#0a0b20', '#1a1848'); ctx.fillRect(-50, -50, W + 100, H + 100);
  for (let i = 0; i < 12; i++) { const c = ['255,214,120', '255,120,110', '120,230,255'][i % 3]; glow(ctx, 80 + i * 97, 300 + Math.sin(i * 2.3) * 220, 150, c, .22); }
  guy(ctx, C(NORA, { x: 500, y: 2280, s: 1750, shadow: false, headTilt: -.06 - pk * .05, face: { eyes: pk > .2 ? 'closed' : 'wide', mouth: pk > .2 ? 'open' : 'wavy', browUp: 1, browAng: .2 * pk, look: [1, .3] } }));
  gooseHead(ctx, 930 - pk * 150, 1140 - pk * 60, 150, pk, .15);
  for (const [bt, bx] of [[b1, 760], [b2, 770]]) { const k = lt - bt; if (k > 0 && k < .3) { ctx.save(); ctx.translate(bx, 1010); const s2 = backOut(clamp(k / .08)) * (1 - clamp((k - .18) / .12)); ctx.scale(s2, s2); burst(ctx, 0, 0, 120, 10, '#ffd23a', 4); ctx.restore(); } }
  vignette(ctx, .6);
  pill(ctx, 540, 250, `BITES: ${lt > b2 ? 2 : lt > b1 ? 1 : 0}`, { size: 46, k: lt * 5, dot: '#ff5a4d' });
} });
// 11 — at the hub, she stops moving
function hubNora(ctx, t, o = {}) { box(ctx, WX - 120, WY - 20, 240, 26, '#4a4470', 8); for (const sd of [-1, 1]) line(ctx, WX + sd * 110, WY - 20, WX + sd * 110, WY - 90, 7, '#8f8ab8'); line(ctx, WX - 110, WY - 90, WX + 110, WY - 90, 7, '#8f8ab8');
  guy(ctx, C(NORA, Object.assign({ x: WX - 20, y: WY + 44, s: 170, shadow: false, legs: { L: [-1.2, 1.3], R: [1.3, -1.3] }, arms: { L: [1.3, 1.2], R: [1.3, -1.2] }, face: { eyes: 'dot', mouth: 'flat', look: [0, 1] } }, o))); goose(ctx, WX + 62, WY - 22, 110, t, { flip: -1 }); }
SHOTS.push({ start: 35.95, end: 41.35, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), cam = { x: 540 + hh[0], y: kf(lt, [[0, 660], [5.4, 720]]) + hh[1], z: kf(lt, [[0, 3.0], [2.6, 2.3], [5.4, 1.0]], ease), r: 0 };
  park(ctx, t, cam); applyCam(ctx, cam, 1);
  ferris(ctx, WX, WY, WR, rotAt(t) + lt * .25, { t, n: N, lit: 1 });
  hubNora(ctx, t, { face: { eyes: lt > 2.6 ? 'closed' : 'wide', mouth: lt > 2.6 ? 'smile' : 'o', look: [0, 1] } });
  booth(ctx, 1010, GROUND, 1, N, .85); tinyCrowd(ctx, t, -400, 1500, 1500, 50, { s: 80, dy: 160, sp: 14, inf: 1, seed: 5 });
  vignette(ctx, .6);
  pill(ctx, 540, 250, 'HUB · 100 FT', { k: lt * 4, size: 44 });
  pill(ctx, 540, 335, 'NOT MOVING', { k: (lt - 2.5) * 4, size: 44, dot: '#7dff8a' });
} });
// 12 — the lights are still calling them
const ROW = [[90, 1560, 330, 0], [300, 1540, 300, 2], [520, 1560, 340, 4], [740, 1545, 310, 1], [960, 1560, 330, 3], [190, 1760, 470, 5], [470, 1790, 500, 6], [760, 1770, 480, 7], [1010, 1800, 500, 8]];
function crowdUp(ctx, lt, t, cam, turnK) {
  park(ctx, t, cam); applyCam(ctx, cam, 1);
  blurLayer(ctx, 4, c => { applyCam(c, cam, 1); ferris(c, WX, WY - 150, WR, rotAt(t), { t, n: N, lit: 1 }); });
  applyCam(ctx, cam, 1);
  ROW.forEach(([x, y, s, i]) => { const k = turnK ? clamp(turnK(i)) : 0; infected(ctx, x + k * (lt - 1) * 40 * (k >= 1 ? 1 : 0), y, s, t, { ph: i, still: k < 1, sp: 3.4, dir: k > .5 ? 1 : (i % 2 ? -1 : 1), col: i > 4 ? '#0f0c16' : '#1a1626', extra: { headTilt: lerp(-.38, .12, ease(k)), lean: lerp(-.04, .1, k), arms: k >= 1 ? undefined : { L: [.25, -.1], R: [.25, -.1] } } }); });
}
SHOTS.push({ start: 41.35, end: 44.85, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: kf(lt, [[0, 440], [3.5, 640]]) + hh[0], y: 1280 + hh[1], z: kf(lt, [[0, 1.12], [3.5, 1.24]]), r: 0 };
  crowdUp(ctx, lt, t, cam); tint(ctx, '#d8392b', .2 + .1 * Math.sin(t * 6), 'overlay'); vignette(ctx, .7);
  pill(ctx, 540, 250, `INFECTED ${Math.round(lerp(40, 400, clamp(lt / 2.2)))}+`, { size: 46, k: lt * 4, bg: 'rgba(150,25,20,.95)', dot: '#fff' });
} });
// 13 — rule #3
SHOTS.push({ start: 44.85, end: 47.5, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: 640 + hh[0], y: 1280 + hh[1], z: 1.24, r: 0 };
  crowdUp(ctx, lt, t, cam); tint(ctx, '#120a1c', .55); vignette(ctx, .6);
  ruleCard(ctx, 540, 640, 'RULE #3', lt > 1.2 ? 'MOVE THE NOISE.' : '', '', (lt - .08) * 5, { w: 860, h: 340, size: 140, icons: (c) => { if (lt > 1.7) for (let i = 0; i < 3; i++) { c.beginPath(); c.arc(-330 + 0, 110, 30 + i * 22, -.6, .6); c.lineWidth = 7; c.strokeStyle = RED; c.stroke(); c.beginPath(); c.arc(330, 110, 30 + i * 22, Math.PI - .6, Math.PI + .6); c.stroke(); } } });
} });
// 14 — Gus starts the roller coaster
SHOTS.push({ start: 47.5, end: 49.5, tr: 'cut', draw(ctx, lt, t) {
  const pr = kf(lt, [[.45, 0], [.7, 1, easeIn]]), sh = lt > .7 ? Math.max(0, 1 - (lt - .7) * 5) : 0, hk = shake(t * 3, 12 * sh, 3);
  ctx.setTransform(1, 0, 0, 1, hk[0], hk[1]); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#2c2a3a', '#1a1824'); ctx.fillRect(-50, -50, W + 100, H + 100); glow(ctx, 200, 1500, 900, '255,190,110', .3);
  box(ctx, 180, 380, 720, 1000, '#3d3a50', 40); box(ctx, 220, 420, 640, 180, '#15131c', 20); text(ctx, 'COASTER · LIFT CHAIN', 540, 514, 70, lt > .7 ? '#7dff8a' : '#8a86a0', null, 0, 'Bebas', 400);
  circle(ctx, 540, 900, 190); ctx.fillStyle = '#15131c'; ctx.fill(); circle(ctx, 540, 900 + pr * 12, 160); ctx.fillStyle = mix('#2f8f55', '#7dff8a', lt > .7 ? .5 : 0); ctx.fill(); text(ctx, 'START', 540, 908 + pr * 12, 104, CREAM, null, 0, 'Bebas', 400);
  if (sh > 0) { circle(ctx, 540, 900, 190 + (1 - sh) * 220); ctx.lineWidth = 16 * sh; ctx.strokeStyle = `rgba(200,255,210,${sh})`; ctx.stroke(); glow(ctx, 540, 900, 600, '125,255,138', .4 * sh); }
  ctx.save(); ctx.translate(lerp(980, 700, pr), lerp(1420, 1040, pr)); ctx.rotate(-.8); box(ctx, -360, -70, 440, 140, '#e0b592', 70); ellipse(ctx, -306, 0, 42, 48); ctx.fillStyle = '#f2d6bd'; ctx.fill(); ctx.restore(); box(ctx, 760, 1380, 600, 800, '#3d5a86', 120);
  vignette(ctx, .65);
} });
function hillPt(u) { if (u < .55) { const k = u / .55; return [lerp(-320, 760, k), lerp(1500, 430, k)]; } if (u < .7) { const k = (u - .55) / .15, a = [760, 430], b = [900, 290], c = [1040, 430]; return [(1 - k) * (1 - k) * a[0] + 2 * k * (1 - k) * b[0] + k * k * c[0], (1 - k) * (1 - k) * a[1] + 2 * k * (1 - k) * b[1] + k * k * c[1]]; } const k = (u - .7) / .3; return [lerp(1040, 1900, k), lerp(430, 1500, k)]; }
function coasterCar(ctx, u, s, riders, t, i, eyes = 1) { const p = hillPt(u), q = hillPt(u + .004), ang = Math.atan2(q[1] - p[1], q[0] - p[0]); ctx.save(); ctx.translate(p[0], p[1]); ctx.rotate(ang); ctx.scale(s, s);
  if (riders) { ctx.fillStyle = '#120e18'; ctx.beginPath(); ctx.roundRect(-34, -128, 68, 80, 22); ctx.fill(); circle(ctx, 0, -150, 34); ctx.fill(); if (eyes > 0) for (const sd of [-1, 1]) { glow(ctx, sd * 13, -150, 22, '255,255,255', .6 * eyes); circle(ctx, sd * 13, -150, 6); ctx.fillStyle = `rgba(255,255,255,${eyes})`; ctx.fill(); } }
  box(ctx, -78, -86, 156, 62, '#c9543e', 18); box(ctx, -78, -50, 156, 16, '#e9dcc4', 0); ctx.fillStyle = 'rgba(20,8,30,.25)'; ctx.fillRect(20, -84, 56, 58); box(ctx, -70, -108, 20, 40, '#8a3626', 6);
  if (riders) line(ctx, -40, -96, 40, -96, 10, '#e2a62b');
  for (const wx of [-48, 48]) { circle(ctx, wx, -14, 15); ctx.fillStyle = '#1b1620'; ctx.fill(); } ctx.restore(); }
function hill(ctx, t, lit = 1) {
  const c = '#232048'; for (let x = -300; x <= 1900; x += 96) { let best = null; for (let u = 0; u <= 1; u += .005) { const p = hillPt(u); if (!best || Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p; } line(ctx, x, best[1], x, GROUND, 9, c); if (best[1] < GROUND - 220) line(ctx, x, best[1] + 40, x + 96, Math.min(GROUND, best[1] + 240), 5, c); }
  ctx.beginPath(); for (let u = 0; u <= 1.0001; u += .01) { const p = hillPt(u); u ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.lineWidth = 20; ctx.strokeStyle = '#3d3878'; ctx.lineJoin = 'round'; ctx.stroke(); ctx.lineWidth = 6; ctx.strokeStyle = '#8f8ab8'; ctx.stroke();
  for (let u = .02; u < .55; u += .03) { const p = hillPt(u + ((t * .03) % .03)); circle(ctx, p[0], p[1] + 16, 5); ctx.fillStyle = '#b5b0d8'; ctx.fill(); }
  if (lit) for (let u = .05; u < 1; u += .09) { const p = hillPt(u); glow(ctx, p[0], p[1] - 30, 70, '255,214,120', .45); circle(ctx, p[0], p[1] - 30, 8); ctx.fillStyle = '#ffe9a8'; ctx.fill(); }
}
function coasterBG(ctx, t, cam) { sky(ctx, t, cam, N); applyCam(ctx, cam, .35); ctx.fillStyle = '#0e1028'; for (let x = -1200; x < 2600; x += 300) { circle(ctx, x, GROUND - 120, 130); ctx.fill(); } applyCam(ctx, cam, .5); circle(ctx, -200, 900, 300); ctx.lineWidth = 10; ctx.strokeStyle = '#1b1838'; ctx.stroke(); for (let i = 0; i < 30; i++) { const a = i * TAU / 30 + t * .12; circle(ctx, -200 + Math.sin(a) * 300, 900 + Math.cos(a) * 300, 7); ctx.fillStyle = ['#ffd678', '#ff786e', '#78e6ff', '#fff'][i % 4]; ctx.fill(); } glow(ctx, -200, 900, 520, '255,200,140', .2); groundP(ctx, cam, N, GROUND); applyCam(ctx, cam, 1); }
SHOTS.push({ start: 49.5, end: 52.55, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), u0 = kf(lt, [[0, .12], [3.05, .4]], x => x), p = hillPt(u0), jit = Math.sin(t * 38) * 3;
  const cam = { x: lerp(540, p[0], .5) + hh[0], y: lerp(960, p[1], .45) + hh[1] + jit, z: kf(lt, [[0, .95], [3.05, 1.12]]), r: 0 };
  coasterBG(ctx, t, cam); hill(ctx, t);
  for (let i = 0; i < 4; i++) coasterCar(ctx, u0 - i * .062, 1, false, t, i);
  for (let i = 0; i < 3; i++) { const k = (t * 1.6 + i / 3) % 1; ctx.beginPath(); ctx.arc(p[0], p[1] - 60, 90 + k * 300, -2.6, -.5); ctx.lineWidth = 12; ctx.strokeStyle = `rgba(255,197,58,${(1 - k) * .85})`; ctx.stroke(); }
  if (Math.floor(t * 7) % 2) ui(ctx, () => { ctx.translate(800, 620); ctx.rotate(.1); text(ctx, 'CLACK', 0, 0, 90, CREAM, 'rgba(12,8,14,.8)', 12, 'Bebas', 400); });
  vignette(ctx, .6);
  pill(ctx, 540, 250, 'LIFT CHAIN: ON', { size: 44, k: lt * 4, dot: '#7dff8a' }); pill(ctx, 540, 335, 'RIDERS: 0', { size: 40, k: (lt - .4) * 4 });
} });
// 15 — every head turns, away from her
SHOTS.push({ start: 52.55, end: 55.1, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 3), cam = { x: kf(lt, [[0, 600], [2.55, 720]]) + hh[0], y: 1280 + hh[1], z: 1.2, r: 0 };
  crowdUp(ctx, lt, t, cam, i => (lt - .2 - i * .11) * 4);
  tint(ctx, '#d8392b', kf(lt, [[0, .25], [1.6, 0]]), 'overlay'); tint(ctx, '#2a4a9a', kf(lt, [[.8, 0], [2.2, .22]]), 'overlay'); vignette(ctx, .7);
  for (let i = 0; i < 3; i++) { const k = (t * 1.4 + i / 3) % 1; ui(ctx, () => { ctx.beginPath(); ctx.arc(1180, 700, 80 + k * 260, Math.PI - .7, Math.PI + .7); ctx.lineWidth = 12; ctx.strokeStyle = `rgba(255,197,58,${(1 - k) * .8})`; ctx.stroke(); }); }
} });
// 16 — it works. until the train comes back
SHOTS.push({ start: 55.1, end: 56.0, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 2), cam = { x: 540 + hh[0], y: 680 + hh[1], z: kf(lt, [[0, 2.6], [.9, 2.8]]), r: 0 };
  park(ctx, t, cam); applyCam(ctx, cam, 1); ferris(ctx, WX, WY, WR, rotAt(t), { t, n: N, lit: 1 });
  hubNora(ctx, t, { arms: { L: [2.6, .3], R: [2.6 + Math.sin(t * 12) * .2, .3] }, face: { eyes: 'closed', mouth: 'smile' } });
  vignette(ctx, .55);
} });
SHOTS.push({ start: 56.0, end: 58.2, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 5), u0 = kf(lt, [[0, .64], [2.2, .97]], easeIn), p = hillPt(u0);
  const cam = { x: p[0] - 120 + hh[0], y: p[1] - 60 + hh[1], z: kf(lt, [[0, .85], [2.2, 1.35]]), r: 0 };
  coasterBG(ctx, t, cam); hill(ctx, t);
  for (let i = 0; i < 4; i++) coasterCar(ctx, u0 - i * .058, 1, true, t, i, 0);
  for (let i = 0; i < 5; i++) line(ctx, p[0] - 420 - i * 70, p[1] - 320 + i * 60, p[0] - 620 - i * 70, p[1] - 520 + i * 60, 8, 'rgba(243,234,216,.35)');
  vignette(ctx, .65);
  pill(ctx, 540, 250, 'TRAIN: RETURNING', { size: 44, k: lt * 4, dot: '#ffc53a' });
} });
// 17 — it isn't empty   /   18 — the lap bars
function stationBG(ctx, t) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#0a0b20', '#191a40'); ctx.fillRect(0, 0, W, H); box(ctx, -50, 230, W + 100, 120, '#2a1d44', 0); for (let x = 40; x < W; x += 260) { box(ctx, x, 350, 40, 1250, '#231a3a', 0); glow(ctx, x + 20, 420, 300, '255,214,120', .35); circle(ctx, x + 20, 400, 18); ctx.fillStyle = '#ffe9a8'; ctx.fill(); } box(ctx, -50, 1420, W + 100, 60, '#3d3878', 0); box(ctx, -50, 1480, W + 100, 600, '#14122a', 0); }
function bigRider(ctx, x, y, s, eyes, armUp = 0) { ctx.fillStyle = '#100c16'; ctx.beginPath(); ctx.roundRect(x - 150 * s, y - 330 * s, 300 * s, 420 * s, 100 * s); ctx.fill(); circle(ctx, x, y - 420 * s, 150 * s); ctx.fill(); if (armUp > 0) for (const sd of [-1, 1]) line(ctx, x + sd * 130 * s, y - 250 * s, x + sd * (190 + armUp * 40) * s, y - (250 + armUp * 330) * s, 54 * s, '#100c16'); if (eyes > 0) for (const sd of [-1, 1]) { glow(ctx, x + sd * 56 * s, y - 415 * s, 100 * s, '255,255,255', .6 * eyes); circle(ctx, x + sd * 56 * s, y - 415 * s, 25 * s); ctx.fillStyle = `rgba(255,255,255,${eyes})`; ctx.fill(); } }
function bigCar(ctx, x, y, s) { box(ctx, x - 330 * s, y - 150 * s, 660 * s, 300 * s, '#c9543e', 70 * s); box(ctx, x - 330 * s, y - 10 * s, 660 * s, 60 * s, '#e9dcc4', 0); ctx.fillStyle = 'rgba(20,8,30,.22)'; ctx.fillRect(x + 90 * s, y - 146 * s, 236 * s, 290 * s); for (const wx of [-200, 200]) { circle(ctx, x + wx * s, y + 150 * s, 62 * s); ctx.fillStyle = '#1b1620'; ctx.fill(); circle(ctx, x + wx * s, y + 150 * s, 22 * s); ctx.fillStyle = '#4a4470'; ctx.fill(); } }
SHOTS.push({ start: 58.2, end: 60.15, tr: 'cut', draw(ctx, lt, t) {
  const hh = handheld(t, 4), sx = kf(lt, [[0, 900], [1.95, 0]], easeOut); stationBG(ctx, t); ctx.setTransform(1, 0, 0, 1, hh[0], hh[1]);
  for (let i = 0; i < 3; i++) { const x = 60 + i * 700 + sx - 300; bigRider(ctx, x, 1230, .95, clamp((lt - .55 - i * .2) * 6)); bigCar(ctx, x, 1270, .95); line(ctx, x - 190, 1050, x + 190, 1050, 44, '#e2a62b'); }
  tint(ctx, '#d8392b', kf(lt, [[.5, 0], [1.4, .22]]), 'overlay'); vignette(ctx, .7);
  pill(ctx, 540, 250, `RIDERS: ${Math.min(24, Math.round(clamp((lt - .5) / 1.0) * 24))}`, { size: 46, k: lt * 5, bg: lt > .6 ? 'rgba(150,25,20,.95)' : undefined, dot: '#fff' });
} });
SHOTS.push({ start: 60.15, end: 63.9, tr: 'cut', draw(ctx, lt, t) {
  const un = 2.12, k = clamp((lt - un) / 1.2), sh = lt > un ? Math.max(0, 1 - (lt - un) * 4) : 0, hk = shake(t * 3, 12 * sh, 3), hh = handheld(t, 2);
  stationBG(ctx, t); const z = 1.05 + lt * .03; ctx.setTransform(z, 0, 0, z, 540 * (1 - z) + hh[0] + hk[0], 900 * (1 - z) + hh[1] + hk[1]);
  bigRider(ctx, 540, 1250, 1.5, 1, ease(k)); bigCar(ctx, 540, 1330, 1.5);
  // lap bar pivots up
  ctx.save(); ctx.translate(120, 1100); ctx.rotate(-ease(k) * 1.15); line(ctx, 0, 0, 0, -150, 40, '#8a6a1e'); line(ctx, 0, -150, 840, -150, 74, '#e2a62b'); line(ctx, 30, -168, 810, -168, 12, 'rgba(255,255,255,.3)'); ctx.restore(); circle(ctx, 120, 1100, 40); ctx.fillStyle = '#3d3878'; ctx.fill();
  // lock indicator
  box(ctx, 700, 1280, 300, 150, '#15131c', 20); circle(ctx, 760, 1355, 30); ctx.fillStyle = lt > un ? '#7dff8a' : '#ff5a4d'; ctx.fill(); glow(ctx, 760, 1355, 150, lt > un ? '125,255,138' : '255,90,77', .6); text(ctx, lt > un ? 'OPEN' : 'LOCKED', 885, 1360, 64, lt > un ? '#7dff8a' : '#ff5a4d', null, 0, 'Bebas', 400);
  tint(ctx, '#d8392b', .2 + .25 * k, 'overlay'); vignette(ctx, .7);
  pill(ctx, 540, 250, 'STATION · AUTO-RELEASE', { size: 42, k: lt * 4, dot: lt > un ? '#7dff8a' : '#ffc53a' });
  darkness(ctx, clamp((lt - 3.5) / .2));
} });
// 19 — end card
SHOTS.push({ start: 63.9, end: 68.0, tr: 'cut', draw(ctx, lt, t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#0f0d18'; ctx.fillRect(0, 0, W, H);
  const R = rng(9); for (let i = 0; i < 60; i++) { circle(ctx, R() * W, R() * H, 1.5 + R() * 2); ctx.fillStyle = `rgba(240,235,255,${.1 + .2 * Math.sin(t * 2 + i) ** 2})`; ctx.fill(); }
  glow(ctx, 540, 820, 700, '216,57,43', .12);
  const L = (s, y, size, col, t0, sp = 0) => { const k = clamp((lt - t0) / .3); if (k <= 0) return; ctx.save(); ctx.globalAlpha = k; ctx.translate(540, y + (1 - easeOut(k)) * 26); if (sp) ctx.letterSpacing = sp + 'px'; text(ctx, s, 0, 0, size, col, null, 0, 'Bebas', 400); ctx.restore(); };
  L('ZOMBIE APOCALYPSE AT A THEME PARK', 600, 46, 'rgba(243,234,216,.75)', .2, 4); L('PART 3', 790, 280, CREAM, .45, 6); L('THE LAP BARS', 985, 104, '#ff4b3a', .85, 5);
  L('WOULD YOU STAY', 1150, 120, CREAM, 1.35, 2); L('AT THE HUB?', 1268, 120, CREAM, 1.35, 2); L('FOLLOW FOR PART 3', 1420, 50, '#ffc53a', 1.95, 5); L('STORY = FICTION · SURVIVAL FACTS = REAL', 1500, 32, 'rgba(243,234,216,.5)', 2.25, 3);
  vignette(ctx, .5); darkness(ctx, clamp((lt - 3.8) / .25));
} });
