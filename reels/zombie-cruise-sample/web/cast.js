// ---------- cast: hats, zombie face, presets, pose helpers ----------
const ZHEAD = '#a9d06f', ZHEAD_SH = '#84ab50';
const C = (base, extra) => Object.assign({}, base, extra);
const walkLegs = (t, sp = 9, amp = .55) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const walkArms = (t, sp = 9, amp = .6) => ({ L: [.3 - Math.sin(t * sp) * amp, -.3], R: [.3 + Math.sin(t * sp) * amp, -.3] });
const runArms = (t, sp = 14) => ({ L: [.2 - Math.sin(t * sp) * 1.0, -1.3], R: [.2 + Math.sin(t * sp) * 1.0, -1.3] });
const panicArms = (t, sp = 16) => ({ L: [2.6 + Math.sin(t * sp) * .35, .25], R: [2.6 - Math.sin(t * sp + 1) * .35, .25] });
const handheld = (t, a = 4) => shake(t * .35, a, 1, 2);
const box = (ctx, x, y, w, h, fill, lw = 5, r = 0, stroke = INK) => { rrect(ctx, x, y, w, h, r); fillStroke(ctx, fill, lw, stroke); };
const blinkAt = (t, ph = 0) => ((t + ph) % 3.1) < .12 ? 1 : 0;

function hairCap(ctx, hx, hy, hr, col, lw, style) {
  if (style === 'bun') { circle(ctx, hx, hy - hr * 1.12, hr * .34); fillStroke(ctx, col, lw); }
  if (style === 'pony') { ctx.beginPath(); ctx.moveTo(hx - hr * .85, hy - hr * .5); ctx.quadraticCurveTo(hx - hr * 1.7, hy - hr * .3, hx - hr * 1.35, hy + hr * .55); ctx.quadraticCurveTo(hx - hr * 1.1, hy, hx - hr * .8, hy - hr * .1); ctx.closePath(); fillStroke(ctx, col, lw); }
  if (style === 'spiky' || style === 'messy') { for (let i = -2; i <= 2; i++) { const a = -Math.PI / 2 + i * .42; const bx = hx + Math.cos(a) * hr * .9, by = hy + Math.sin(a) * hr * .9; const L = style === 'messy' ? .55 + (i & 1) * .25 : .5; path(ctx, [[bx - Math.sin(a) * hr * .2, by + Math.cos(a) * hr * .2], [hx + Math.cos(a + (style === 'messy' ? .2 : 0)) * hr * (1 + L), hy + Math.sin(a + (style === 'messy' ? .2 : 0)) * hr * (1 + L)], [bx + Math.sin(a) * hr * .2, by - Math.cos(a) * hr * .2]]); fillStroke(ctx, col, lw); } }
  ctx.beginPath(); ctx.arc(hx, hy, hr + .004, Math.PI + .42, -.42);
  ctx.quadraticCurveTo(hx + hr * .45, hy - hr * .5, hx + hr * .1, hy - hr * .62); ctx.quadraticCurveTo(hx - hr * .2, hy - hr * .42, hx - hr * .5, hy - hr * .6); ctx.quadraticCurveTo(hx - hr * .75, hy - hr * .5, hx - hr * .91, hy - hr * .41); ctx.closePath();
  fillStroke(ctx, col, lw);
}
const HATS = {
  straw(ctx, hx, hy, hr, lw) {
    const by = hy - hr * .6;
    ellipse(ctx, hx, by, hr * 1.5, hr * .22); fillStroke(ctx, '#f3d98c', lw);
    const crown = () => { ctx.beginPath(); ctx.moveTo(hx - hr * .74, by); ctx.quadraticCurveTo(hx - hr * .72, by - hr * .78, hx, by - hr * .8); ctx.quadraticCurveTo(hx + hr * .72, by - hr * .78, hx + hr * .74, by); ctx.quadraticCurveTo(hx, by + hr * .16, hx - hr * .74, by); ctx.closePath(); };
    crown(); ctx.fillStyle = '#eccb72'; ctx.fill();
    ctx.save(); crown(); ctx.clip(); ctx.fillStyle = '#e0392f'; ctx.fillRect(hx - hr, by - hr * .2, hr * 2, hr * .3); ctx.fillStyle = 'rgba(90,50,0,.16)'; ctx.fillRect(hx + hr * .25, by - hr, hr, hr * 1.4); ctx.restore();
    crown(); fillStroke(ctx, null, lw);
  },
  chef(ctx, hx, hy, hr, lw) {
    const by = hy - hr * .7;
    ctx.beginPath(); for (const [dx, dy, r] of [[-.5, -.95, .42], [0, -1.15, .5], [.5, -.95, .42]]) { ctx.moveTo(hx + dx * hr + r * hr, by + dy * hr); ctx.arc(hx + dx * hr, by + dy * hr, r * hr, 0, TAU); } fillStroke(ctx, '#fbfbf8', lw);
    ctx.beginPath(); for (const [dx, dy, r] of [[-.5, -.95, .42], [0, -1.15, .5], [.5, -.95, .42]]) { ctx.moveTo(hx + dx * hr + r * hr, by + dy * hr); ctx.arc(hx + dx * hr, by + dy * hr, r * hr, 0, TAU); } ctx.fillStyle = '#fbfbf8'; ctx.fill();
    box(ctx, hx - hr * .68, by - hr * .75, hr * 1.36, hr * .8, '#fbfbf8', lw, .02);
    ctx.fillStyle = 'rgba(40,50,90,.12)'; ctx.fillRect(hx + hr * .2, by - hr * .7, hr * .45, hr * .7);
  },
  cap(ctx, hx, hy, hr, lw) {
    const by = hy - hr * .62;
    ctx.beginPath(); ctx.moveTo(hx - hr * .95, by - hr * .1); ctx.quadraticCurveTo(hx - hr * 1.25, by - hr * .85, hx, by - hr * .9); ctx.quadraticCurveTo(hx + hr * 1.25, by - hr * .85, hx + hr * .95, by - hr * .1); ctx.closePath(); fillStroke(ctx, '#fbfbf8', lw);
    box(ctx, hx - hr * .95, by - hr * .22, hr * 1.9, hr * .3, '#1f2c52', lw, .015);
    ctx.beginPath(); ctx.moveTo(hx - hr * .98, by + hr * .06); ctx.quadraticCurveTo(hx, by + hr * .42, hx + hr * .98, by + hr * .06); ctx.quadraticCurveTo(hx, by + hr * .12, hx - hr * .98, by + hr * .06); ctx.closePath(); fillStroke(ctx, '#15171f', lw);
    circle(ctx, hx, by - hr * .42, hr * .17); fillStroke(ctx, '#e8c04a', lw * .8);
  },
  hair(ctx, hx, hy, hr, lw, o) { hairCap(ctx, hx, hy, hr, o.hairCol || '#5a3a26', lw, o.hairStyle); },
  doc(ctx, hx, hy, hr, lw, o) {
    hairCap(ctx, hx, hy, hr, o.hairCol || '#9a9aa8', lw, 'none');
    // glasses
    ctx.lineWidth = .014; ctx.strokeStyle = INK;
    for (const sd of [-1, 1]) { circle(ctx, hx + sd * .072, hy - .005, .058); ctx.fillStyle = 'rgba(190,230,255,.22)'; ctx.fill(); ctx.stroke(); }
    line(ctx, hx - .016, hy - .005, hx + .016, hy - .005, .012);
    // head mirror
    line(ctx, hx - hr * .93, hy - hr * .42, hx + hr * .93, hy - hr * .42, .016, '#3a3a44');
    circle(ctx, hx + hr * .25, hy - hr * .7, hr * .26); fillStroke(ctx, '#d9e2ea', lw); circle(ctx, hx + hr * .25, hy - hr * .7, hr * .09); fillStroke(ctx, '#8b96a3', lw * .6);
  },
  none() {},
};
function drawZombieFace(ctx, hx, hy, hr, f, o) {
  const ex = .072, ey = hy - .005, look = f.look || [0, 0], g = o.zAmt == null ? 1 : o.zAmt;
  // blotches + stitches
  ctx.save(); circle(ctx, hx, hy, hr); ctx.clip(); ctx.globalAlpha = g;
  for (const [dx, dy, r] of [[-.11, -.11, .035], [.12, .09, .03], [.02, -.15, .022], [-.13, .1, .02]]) { circle(ctx, hx + dx, hy + dy, r); ctx.fillStyle = 'rgba(70,110,50,.35)'; ctx.fill(); }
  line(ctx, hx + .05, hy - .16, hx + .13, hy - .1, .01, '#4b5e2c'); for (let i = 0; i < 3; i++) { const k = .2 + i * .3; line(ctx, hx + .05 + .08 * k - .012, hy - .16 + .06 * k + .016, hx + .05 + .08 * k + .012, hy - .16 + .06 * k - .016, .008, '#4b5e2c'); }
  ctx.restore();
  for (const side of [-1, 1]) {
    const x = hx + side * ex, r = side < 0 ? .056 : .04;
    ellipse(ctx, x, ey + .014, r * 1.22, r * 1.25); ctx.fillStyle = `rgba(55,75,40,${.5 * g})`; ctx.fill();
    circle(ctx, x, ey, r); ctx.fillStyle = mix('#ffffff', '#f4f0b8', g); ctx.fill(); ctx.lineWidth = .013; ctx.strokeStyle = INK; ctx.stroke();
    circle(ctx, x + look[0] * r * .45 + (side < 0 ? .01 : -.006), ey + look[1] * r * .45 + (side < 0 ? -.008 : .01), side < 0 ? .012 : .017); ctx.fillStyle = INK; ctx.fill();
  }
  // brows: droopy
  line(ctx, hx - ex - .05, ey - .085, hx - ex + .04, ey - .065, .014); line(ctx, hx + ex - .03, ey - .05, hx + ex + .045, ey - .075, .014);
  // mouth
  const mx = hx + .005, my = hy + .095, m = f.mouth || 'groan', op = m === 'chomp' ? .35 + .65 * Math.abs(Math.sin((o.t || 0) * 9)) : m === 'shut' ? .25 : 1;
  const mp = () => { ctx.beginPath(); ctx.moveTo(mx - .07, my - .02); ctx.quadraticCurveTo(mx, my - .045, mx + .065, my - .012); ctx.quadraticCurveTo(mx + .06, my + .06 * op, mx, my + .065 * op); ctx.quadraticCurveTo(mx - .065, my + .055 * op, mx - .07, my - .02); ctx.closePath(); };
  mp(); ctx.fillStyle = '#4a1a26'; ctx.fill();
  ctx.save(); mp(); ctx.clip(); ctx.fillStyle = '#f6f2dc'; ctx.fillRect(mx - .05, my - .05, .026, .034); ctx.fillRect(mx + .012, my - .05, .024, .03); ctx.fillRect(mx - .02, my + .065 * op - .022, .026, .03); ctx.restore();
  mp(); ctx.lineWidth = .013; ctx.strokeStyle = INK; ctx.stroke();
  if (m !== 'shut') { line(ctx, mx + .04, my + .04, mx + .042, my + .09 + Math.sin((o.t || 0) * 2) * .01, .011, 'rgba(150,220,120,.9)'); }
}
// torso decorations (drawn clipped to the torso, unit coords: x -.125..125, y -.62..-.27)
const DECO = {
  flowers: (ctx) => { const R = rng(4); for (let i = 0; i < 9; i++) { const x = -.11 + R() * .22, y = -.6 + R() * .3; for (let k = 0; k < 5; k++) { circle(ctx, x + Math.cos(k * 1.257) * .014, y + Math.sin(k * 1.257) * .014, .011); ctx.fillStyle = i % 2 ? '#fff6d8' : '#ffd23a'; ctx.fill(); } circle(ctx, x, y, .007); ctx.fillStyle = '#ff7a59'; ctx.fill(); } },
  coat: (ctx) => { ctx.fillStyle = '#7fb2e0'; path(ctx, [[-.045, -.63], [.045, -.63], [0, -.47]]); ctx.fill(); line(ctx, -.045, -.62, 0, -.47, .009); line(ctx, .045, -.62, 0, -.47, .009); line(ctx, 0, -.47, 0, -.26, .008); ctx.fillStyle = '#e0392f'; ctx.fillRect(.05, -.46, .045, .014); ctx.fillRect(.0655, -.4755, .014, .045); for (const y of [-.42, -.36]) { circle(ctx, -.02, y, .008); ctx.fillStyle = '#8b96a3'; ctx.fill(); } },
  uniform: (ctx) => { for (const y of [-.55, -.48, -.41, -.34]) for (const x of [-.03, .03]) { circle(ctx, x, y, .011); ctx.fillStyle = '#e8c04a'; ctx.fill(); } ctx.fillStyle = '#1f2c52'; ctx.fillRect(-.13, -.62, .05, .03); ctx.fillRect(.08, -.62, .05, .03); },
  vest: (ctx) => { ctx.fillStyle = '#23232b'; ctx.fillRect(-.13, -.62, .085, .4); ctx.fillRect(.045, -.62, .085, .4); ctx.fillStyle = '#c2272d'; path(ctx, [[-.035, -.6], [0, -.585], [-.035, -.57]]); ctx.fill(); path(ctx, [[.035, -.6], [0, -.585], [.035, -.57]]); ctx.fill(); },
  stains: (ctx) => { const R = rng(9); for (let i = 0; i < 5; i++) { ellipse(ctx, -.1 + R() * .2, -.58 + R() * .28, .02 + R() * .02, .015 + R() * .015, R()); ctx.fillStyle = i % 2 ? 'rgba(90,120,50,.55)' : 'rgba(110,40,40,.45)'; ctx.fill(); } path(ctx, [[-.13, -.27], [-.09, -.32], [-.05, -.27], [0, -.33], [.05, -.27], [.09, -.31], [.13, -.27]]); ctx.fillStyle = 'rgba(30,20,30,.5)'; ctx.fill(); },
  stripes: (ctx) => { ctx.fillStyle = '#fff'; for (let i = 0; i < 6; i++) ctx.fillRect(-.2, -.6 + i * .07, .4, .03); },
};
const YOU = { cols: ['#17a6b8', '#17a6b8'], deco: DECO.flowers, hat: 'straw', belt: false };
const DOC = { cols: ['#f7f7f2', '#f7f7f2'], deco: DECO.coat, hat: 'doc', belt: false };
const PAS = [
  { cols: ['#f06292', '#f06292'], hat: 'hair', hairCol: '#5a3a26', hairStyle: 'bun', belt: false },
  { cols: ['#f2b52a', '#f2b52a'], hat: 'hair', hairCol: '#2b2230', hairStyle: 'spiky', belt: false },
  { cols: ['#7a4bc4', '#7a4bc4'], deco: DECO.stripes, hat: 'hair', hairCol: '#d98a3a', hairStyle: 'pony', belt: false },
  { cols: ['#3fa35b', '#3fa35b'], hat: 'hair', hairCol: '#e8d9b0', hairStyle: 'none', belt: false },
  { cols: ['#fbfbf8', '#fbfbf8'], deco: DECO.vest, hat: 'hair', hairCol: '#2b2230', hairStyle: 'none', belt: false },
];
const ZBASE = { zombie: true, head: ZHEAD, headSh: ZHEAD_SH, belt: false };
const ZK = [
  C(ZBASE, { cols: ['#8d7aa6', '#8d7aa6'], deco: DECO.stains, hat: 'hair', hairCol: '#3b3340', hairStyle: 'messy' }),
  C(ZBASE, { cols: ['#d98a5a', '#d98a5a'], deco: (c) => { DECO.flowers(c); DECO.stains(c); }, hat: 'hair', hairCol: '#6b4a2a', hairStyle: 'bun' }),
  C(ZBASE, { cols: ['#f1f1ea', '#f1f1ea'], deco: DECO.stains, hat: 'chef' }),
  C(ZBASE, { cols: ['#f1f1ea', '#f1f1ea'], deco: (c) => { DECO.vest(c); DECO.stains(c); }, hat: 'hair', hairCol: '#22202a', hairStyle: 'none' }),
  C(ZBASE, { cols: ['#5b8fd1', '#5b8fd1'], deco: DECO.stains, hat: 'hair', hairCol: '#c9c2b0', hairStyle: 'spiky' }),
  C(ZBASE, { cols: ['#e06a8c', '#e06a8c'], deco: DECO.stains, hat: 'hair', hairCol: '#40304a', hairStyle: 'pony' }),
];
const ZCAPT = C(ZBASE, { cols: ['#f6f6f0', '#f6f6f0'], deco: DECO.uniform, hat: 'cap' });
// a shambling zombie; dir = +1 walks/reaches right
function zombie(ctx, x, y, s, t, o = {}) {
  const w = t * (o.sp || 3.2) + (o.ph || 0), dir = o.dir || 1, k = o.kind == null ? 0 : o.kind;
  const base = typeof k === 'object' ? k : ZK[k % ZK.length];
  const arms = { L: [-1.3 + Math.sin(w * 1.3) * .14, .3], R: [1.55 + Math.sin(w * 1.1 + 1) * .14, -.25] };
  const legs = o.still ? { L: [.12, -.05], R: [.16, -.05] } : { L: [Math.sin(w) * .32 + .05, -Math.max(0, Math.sin(w + 1)) * .45], R: [-Math.sin(w) * .32 + .05, -Math.max(0, -Math.sin(w + 1)) * .45] };
  drawStick(ctx, Object.assign({ x, y, s, flip: dir, lean: .1 + Math.sin(w) * .04, headTilt: .16 + Math.sin(w * .7) * .1, bob: -Math.abs(Math.sin(w)) * .012, arms, legs, t, face: { mouth: o.mouth || 'groan', look: [.6, 0] } }, base, o.extra || {}));
}
// a running human; dir = +1 runs right
function runner(ctx, base, x, y, s, t, o = {}) {
  const dir = o.dir || 1, sp = o.sp || 15;
  drawStick(ctx, Object.assign({ x, y: y - Math.abs(Math.sin(t * sp)) * s * .05, s, flip: dir, lean: .18, legs: walkLegs(t, sp, .85), arms: o.panic ? panicArms(t) : runArms(t, sp), face: o.face || { eyes: 'wide', mouth: 'teeth', browUp: 1, look: [.5, 0] } }, base, o.extra || {}));
}
// figure placed by its hips and rotated (sitting, lying, falling)
function hipStick(ctx, hx, hy, s, rot, opts) {
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(rot); drawStick(ctx, Object.assign({ x: 0, y: .3 * s, s, shadow: false }, opts)); ctx.restore();
}
