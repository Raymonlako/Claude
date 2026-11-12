// ---------- flat "what if" style: people, goose, UI cards, theme-park sets ----------
const DK = '#211a24', CREAM = '#f3ead8', RED = '#d8392b';
const C = (base, extra) => Object.assign({}, base, extra);
const handheld = (t, a = 3) => shake(t * .3, a, 1, 2);
const box = (ctx, x, y, w, h, fill, r = 0) => { rrect(ctx, x, y, w, h, r); ctx.fillStyle = fill; ctx.fill(); };
const dark = (c, a = .35) => mix(c, '#140c1c', a);
function lg(ctx, x0, y0, x1, y1, ...stops) { const g = ctx.createLinearGradient(x0, y0, x1, y1); stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); return g; }
function glow(ctx, x, y, r, col = '255,220,140', a = .5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; const g = ctx.createRadialGradient(x, y, r * .04, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
function tint(ctx, col, a, op = 'source-over') { if (a <= 0) return; ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = op; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function vignette(ctx, a = .6, cy = 900) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); const v = ctx.createRadialGradient(540, cy, 380, 540, cy, 1250); v.addColorStop(0, 'rgba(8,4,14,0)'); v.addColorStop(1, `rgba(8,4,14,${a})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H); ctx.restore(); }
const _tmp = document.createElement('canvas'); _tmp.width = W; _tmp.height = H;
function blurLayer(ctx, px, fn) { const c = _tmp.getContext('2d'); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); fn(c); ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.filter = `blur(${px}px)`; ctx.drawImage(_tmp, 0, 0); ctx.restore(); }

// ----- people: round head, dot eyes, bean jacket, thin dark limbs -----
function guy(ctx, o) {
  const s = o.s || 400, sil = o.sil, skin = sil || o.skin || '#d9a273', jk = sil || o.jacket || '#e0a82e';
  ctx.save(); ctx.translate(o.x, o.y); if (o.alpha != null) ctx.globalAlpha = o.alpha;
  if (o.shadow !== false && !sil) { ctx.save(); ctx.scale(s, s); ellipse(ctx, 0, 0, .22, .035); ctx.fillStyle = 'rgba(10,5,20,.3)'; ctx.fill(); ctx.restore(); }
  ctx.scale(s * (o.flip || 1), s); ctx.rotate(o.lean || 0); ctx.translate(0, o.bob || 0);
  const legs = o.legs || { L: [.1, -.04], R: [.1, -.04] }, arms = o.arms || { L: [.28, -.1], R: [.28, -.1] };
  const hipY = -.3, shY = -.55, limb = sil || DK;
  for (const [k, side] of [['L', -1], ['R', 1]]) {
    const p = limbPts(side * .06, hipY, side, legs[k][0], legs[k][1], .155, .155);
    ctx.beginPath(); ctx.moveTo(...p[0]); ctx.lineTo(...p[1]); ctx.lineTo(...p[2]); ctx.lineWidth = .036; ctx.strokeStyle = limb; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    ellipse(ctx, p[2][0] + side * .02, p[2][1] + .004, .05, .026); ctx.fillStyle = sil || (o.shoes || '#3a3340'); ctx.fill();
  }
  const tw = .29, tTop = -.64, tBot = -.25, torso = () => { ctx.beginPath(); ctx.roundRect(-tw / 2, tTop, tw, tBot - tTop, [.11, .11, .09, .09]); };
  const armDraw = (k, side) => {
    let a1, a2; const al = o.armLen || 1;
    if (arms[k].ik) [a1, a2] = ik(side, side * .115, shY, arms[k].ik[0], arms[k].ik[1], .14 * al, .13 * al, arms[k].bend || 1); else[a1, a2] = arms[k];
    const p = limbPts(side * .115, shY, side, a1, a2, .14 * al, .13 * al);
    ctx.beginPath(); ctx.moveTo(...p[0]); ctx.lineTo(...p[1]); ctx.lineTo(...p[2]); ctx.lineWidth = .036; ctx.strokeStyle = limb; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    if (o.prop && !sil) o.prop(ctx, k, p[2], p[3], side);
    circle(ctx, p[2][0], p[2][1], .03); ctx.fillStyle = sil || skin; ctx.fill();
  };
  if (o.armsBehind) { armDraw('L', -1); armDraw('R', 1); }
  torso(); ctx.fillStyle = jk; ctx.fill();
  if (!sil) {
    ctx.save(); torso(); ctx.clip();
    ctx.fillStyle = 'rgba(20,8,30,.2)'; ctx.fillRect(tw * .18, tTop, tw, 1); ctx.fillStyle = 'rgba(255,255,255,.1)'; ctx.fillRect(-tw / 2, tTop, tw * .16, 1);
    if (o.deco) o.deco(ctx, tw, tTop, tBot); else { ctx.fillStyle = dark(jk, .3); ctx.fillRect(-.006, tTop, .012, 1); }
    ctx.restore();
  }
  if (!o.armsBehind) { armDraw('L', -1); armDraw('R', 1); }
  // head
  const hr = .2, hy = -.8;
  ctx.save(); ctx.translate(0, hy); ctx.rotate(o.headTilt || 0); ctx.translate(0, -hy);
  if (!sil && o.hairBack) o.hairBack(ctx, hy, hr);
  circle(ctx, 0, hy, hr); ctx.fillStyle = skin; ctx.fill();
  if (!sil) {
    ctx.save(); circle(ctx, 0, hy, hr); ctx.clip(); ctx.beginPath(); ctx.arc(0, hy, hr + .01, 0, TAU); ctx.arc(-.05, hy - .045, hr, 0, TAU, true); ctx.fillStyle = 'rgba(60,20,40,.16)'; ctx.fill(); ctx.restore();
    if (o.hair) o.hair(ctx, hy, hr);
    const f = o.face || {}, look = f.look || [0, 0], ey = hy + .02, ex = .078, er = f.eyes === 'wide' ? .03 : .023;
    for (const sd of [-1, 1]) {
      const x = sd * ex + look[0] * .014, y = ey + look[1] * .012;
      if (f.eyes === 'closed' || f.blink) { ctx.beginPath(); ctx.arc(x, y - .004, .022, .2, Math.PI - .2); ctx.lineWidth = .011; ctx.strokeStyle = DK; ctx.stroke(); }
      else { if (f.eyes === 'wide') { circle(ctx, x, y, er + .013); ctx.fillStyle = '#fff'; ctx.fill(); } circle(ctx, x + look[0] * .008, y + look[1] * .008, er * (f.eyes === 'wide' ? .62 : 1)); ctx.fillStyle = DK; ctx.fill(); circle(ctx, x + look[0] * .008 - .007, y + look[1] * .008 - .008, .006); ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fill(); }
      if (f.brow !== false) { const ba = (f.browAng || 0) * sd, by = ey - .058 - (f.browUp || 0) * .02; ctx.save(); ctx.translate(sd * ex, by); ctx.rotate(ba); line(ctx, -.028, 0, .028, 0, .012, o.browCol || dark(skin, .6)); ctx.restore(); }
    }
    const my = hy + .105, m = f.mouth || 'smile'; ctx.lineWidth = .012; ctx.strokeStyle = DK; ctx.lineCap = 'round';
    if (m === 'smile') { ctx.beginPath(); ctx.arc(0, my - .03, .04, .55, Math.PI - .55); ctx.stroke(); }
    else if (m === 'flat') line(ctx, -.028, my, .028, my, .012, DK);
    else if (m === 'frown') { ctx.beginPath(); ctx.arc(0, my + .035, .04, Math.PI + .6, -.6); ctx.stroke(); }
    else if (m === 'wavy') { ctx.beginPath(); ctx.moveTo(-.04, my); ctx.bezierCurveTo(-.02, my - .02, -.005, my + .02, .012, my); ctx.bezierCurveTo(.022, my - .012, .034, my - .005, .04, my + .004); ctx.stroke(); }
    else if (m === 'o') { ellipse(ctx, 0, my + .004, .022, .028); ctx.fillStyle = '#5a1e24'; ctx.fill(); }
    else if (m === 'open') { ctx.beginPath(); ctx.roundRect(-.045, my - .02, .09, .06, .02); ctx.fillStyle = '#5a1e24'; ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-.036, my - .02, .072, .014); }
    if (o.hat) o.hat(ctx, hy, hr);
  } else if (o.eyesGlow) { for (const sd of [-1, 1]) { const g = o.eyeCol || '255,255,255'; glow(ctx, sd * .075, hy + .01, .11, g, .5); circle(ctx, sd * .075, hy + .01, .03); ctx.fillStyle = `rgb(${g})`; ctx.fill(); } }
  ctx.restore(); ctx.restore();
}
// Nora: ride operator, mustard jacket, teal cap, ponytail
const NORA = {
  skin: '#c98d63', jacket: '#e2a62b', shoes: '#f3ead8',
  hairBack: (c, hy, hr) => { c.beginPath(); c.moveTo(-hr * .8, hy - hr * .3); c.quadraticCurveTo(-hr * 1.75, hy, -hr * 1.3, hy + hr * .95); c.quadraticCurveTo(-hr * 1.0, hy + hr * .3, -hr * .7, hy + hr * .1); c.closePath(); c.fillStyle = '#3a2420'; c.fill(); },
  hair: (c, hy, hr) => { c.beginPath(); c.arc(0, hy, hr + .004, Math.PI + .2, -.2); c.quadraticCurveTo(hr * .4, hy - hr * .35, 0, hy - hr * .42); c.quadraticCurveTo(-hr * .5, hy - hr * .3, -hr * .98, hy - hr * .1); c.closePath(); c.fillStyle = '#3a2420'; c.fill(); },
  hat: (c, hy, hr) => { c.beginPath(); c.arc(0, hy, hr + .012, Math.PI + .28, -.28); c.quadraticCurveTo(0, hy - hr * .78, -hr * .97, hy - hr * .28); c.closePath(); c.fillStyle = '#1f8f8a'; c.fill(); c.beginPath(); c.moveTo(hr * .2, hy - hr * .52); c.quadraticCurveTo(hr * 1.15, hy - hr * .62, hr * 1.5, hy - hr * .3); c.quadraticCurveTo(hr * .9, hy - hr * .36, hr * .2, hy - hr * .3); c.closePath(); c.fillStyle = '#16706c'; c.fill(); circle(c, 0, hy - hr * .78, .03); c.fillStyle = '#f3ead8'; c.fill(); },
  deco: (c, tw, tTop) => { c.fillStyle = '#c98d1f'; c.fillRect(-.006, tTop, .012, 1); c.fillStyle = '#f3ead8'; c.beginPath(); c.roundRect(.035, tTop + .1, .075, .05, .01); c.fill(); c.fillStyle = '#d8392b'; c.fillRect(.045, tTop + .118, .055, .012); c.fillStyle = '#1f8f8a'; c.fillRect(-tw, tTop, tw * 2, .05); },
};
const VIS = [
  { skin: '#e3b089', jacket: '#4f7fbf', hair: (c, hy, hr) => { c.beginPath(); c.arc(0, hy, hr + .004, Math.PI + .1, -.1); c.quadraticCurveTo(0, hy - hr * .5, -hr, hy - hr * .1); c.fillStyle = '#6b4a2a'; c.fill(); } },
  { skin: '#8e5b3c', jacket: '#c9543e', hair: (c, hy, hr) => { c.beginPath(); c.arc(0, hy - hr * .1, hr * 1.08, Math.PI, 0); c.closePath(); c.fillStyle = '#1e1618'; c.fill(); } },
  { skin: '#f0c9a4', jacket: '#7a5aa8', hair: (c, hy, hr) => { c.beginPath(); c.arc(0, hy, hr + .004, Math.PI + .25, -.25); c.quadraticCurveTo(0, hy - hr * .2, -hr * .96, hy - hr * .25); c.fillStyle = '#d9b25a'; c.fill(); } },
  { skin: '#c98d63', jacket: '#4a9a6a', hair: (c, hy, hr) => { c.beginPath(); c.arc(0, hy, hr + .004, Math.PI + .3, -.3); c.quadraticCurveTo(0, hy - hr * .6, -hr * .95, hy - hr * .3); c.fillStyle = '#2a1e22'; c.fill(); } },
];
const walkLegs = (t, sp = 9, amp = .5) => ({ L: [Math.sin(t * sp) * amp + .05, -Math.max(0, Math.sin(t * sp + 1)) * .7], R: [-Math.sin(t * sp) * amp + .05, -Math.max(0, -Math.sin(t * sp + 1)) * .7] });
const runArms = (t, sp = 14) => ({ L: [.2 - Math.sin(t * sp) * .9, -1.2], R: [.2 + Math.sin(t * sp) * .9, -1.2] });
// the infected: dark shapes with pale eyes
function infected(ctx, x, y, s, t, o = {}) {
  const w = t * (o.sp || 3) + (o.ph || 0), dir = o.dir || 1;
  guy(ctx, Object.assign({ x, y, s, flip: dir, sil: o.col || '#17131f', eyesGlow: o.eyes !== false, lean: .1 + Math.sin(w) * .04, headTilt: .14 + Math.sin(w * .7) * .08, bob: -Math.abs(Math.sin(w)) * .012,
    arms: o.up ? { L: [-2.6 + Math.sin(w * 1.3) * .2, .2], R: [2.7 + Math.sin(w * 1.1) * .2, -.2] } : { L: [-1.3 + Math.sin(w * 1.3) * .14, .3], R: [1.55 + Math.sin(w * 1.1 + 1) * .14, -.25] },
    legs: o.still ? { L: [.12, -.05], R: [.16, -.05] } : { L: [Math.sin(w) * .3 + .05, -Math.max(0, Math.sin(w + 1)) * .4], R: [-Math.sin(w) * .3 + .05, -Math.max(0, -Math.sin(w + 1)) * .4] } }, o.extra || {}));
}
// Pickles the goose
function goose(ctx, x, y, s, t, o = {}) {
  const honk = o.honk || 0, nk = o.neck == null ? 0 : o.neck;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip || 1), s);
  for (const lx of [-.06, .08]) { line(ctx, lx, -.2, lx + .02, 0, .03, '#e8872a'); path(ctx, [[lx + .02, 0], [lx + .13, .012], [lx + .02, -.03]]); ctx.fillStyle = '#e8872a'; ctx.fill(); }
  ctx.beginPath(); ctx.moveTo(-.34, -.42); ctx.quadraticCurveTo(-.5, -.52, -.46, -.36); ctx.quadraticCurveTo(-.3, -.1, 0, -.12); ctx.quadraticCurveTo(.3, -.12, .3, -.36); ctx.quadraticCurveTo(.28, -.58, 0, -.56); ctx.quadraticCurveTo(-.2, -.56, -.34, -.42); ctx.fillStyle = '#f4f1ea'; ctx.fill();
  ctx.beginPath(); ctx.ellipse(-.06, -.36, .2, .12, -.2, 0, TAU); ctx.fillStyle = '#dcd8cf'; ctx.fill();
  const hx = .3 + nk * .16, hy = -.92 + Math.abs(nk) * .1 - honk * .03;
  ctx.beginPath(); ctx.moveTo(.2, -.4); ctx.quadraticCurveTo(.3, -.66, hx, hy); ctx.lineWidth = .11; ctx.strokeStyle = '#f4f1ea'; ctx.lineCap = 'round'; ctx.stroke();
  circle(ctx, hx, hy, .095); ctx.fillStyle = '#f4f1ea'; ctx.fill();
  const op = honk * .09; path(ctx, [[hx + .07, hy - .035], [hx + .25, hy - .01 - op], [hx + .08, hy + .01]]); ctx.fillStyle = '#e8872a'; ctx.fill(); path(ctx, [[hx + .07, hy + .005], [hx + .22, hy + .02 + op], [hx + .07, hy + .04]]); ctx.fillStyle = '#c96f1c'; ctx.fill();
  circle(ctx, hx + .025, hy - .02, .02); ctx.fillStyle = DK; ctx.fill(); line(ctx, hx - .02, hy - .07, hx + .06, hy - .045, .014, DK);
  ctx.restore();
}
// ----- UI: pills, name cards, rule cards (screen space) -----
function ui(ctx, fn) { ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); fn(); ctx.restore(); }
function pill(ctx, x, y, str, o = {}) {
  const k = o.k == null ? 1 : clamp(o.k); if (k <= 0) return;
  ui(ctx, () => { const size = o.size || 38; ctx.font = `400 ${size}px Bebas`; const tw = ctx.measureText(str).width, w = tw + size * 1.9, h = size * 1.5; ctx.translate(x, y); ctx.scale(.7 + .3 * backOut(k), .7 + .3 * backOut(k)); ctx.globalAlpha = k;
    ctx.shadowColor = 'rgba(0,0,0,.45)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 4; box(ctx, -w / 2, -h / 2, w, h, o.bg || 'rgba(24,18,30,.92)', h / 2); ctx.shadowColor = 'transparent';
    rrect(ctx, -w / 2, -h / 2, w, h, h / 2); ctx.lineWidth = 2.5; ctx.strokeStyle = o.line || 'rgba(243,234,216,.35)'; ctx.stroke();
    circle(ctx, -w / 2 + size * .62, 0, size * .28); ctx.fillStyle = o.dot || '#ffc53a'; ctx.fill();
    text(ctx, str, size * .38, size * .06, size, o.col || CREAM, null, 0, 'Bebas', 400); });
}
function nameCard(ctx, x, y, name, sub, k, rot = -.03) {
  if (k <= 0) return; k = clamp(k);
  ui(ctx, () => { ctx.font = '400 92px Bebas'; const w = Math.max(ctx.measureText(name).width, 200) + 90, h = 168; ctx.translate(x, y); ctx.rotate(rot); ctx.scale(backOut(k), backOut(k));
    ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8; box(ctx, 0, 0, w, h, CREAM, 8); ctx.shadowColor = 'transparent';
    box(ctx, 0, 0, 14, h, RED, 4); text(ctx, name, 44, 68, 92, '#2a2226', null, 0, 'Bebas', 400, 'left'); text(ctx, sub, 46, 132, 34, '#7a6a60', null, 0, 'Bebas', 400, 'left'); });
}
function ruleCard(ctx, cx, cy, tag, l1, l2, k, o = {}) {
  if (k <= 0) return; k = clamp(k);
  ui(ctx, () => { const w = o.w || 780, h = o.h || 380; ctx.translate(cx, cy); ctx.rotate(-.015); ctx.scale(.6 + .4 * backOut(k), .6 + .4 * backOut(k)); ctx.globalAlpha = clamp(k * 2);
    ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 14; box(ctx, -w / 2, -h / 2, w, h, CREAM, 14); ctx.shadowColor = 'transparent';
    rrect(ctx, -w / 2 + 14, -h / 2 + 14, w - 28, h - 28, 8); ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(42,34,38,.25)'; ctx.stroke();
    ctx.font = '400 40px Bebas'; const tw = ctx.measureText(tag).width + 56; box(ctx, -tw / 2, -h / 2 - 26, tw, 58, RED, 8); text(ctx, tag, 0, -h / 2 + 5, 40, CREAM, null, 0, 'Bebas', 400);
    text(ctx, l1, 0, l2 ? -52 : 6, o.size || 124, '#2a2226', null, 0, 'Bebas', 400); if (l2) text(ctx, l2, 0, 72, o.size2 || 104, RED, null, 0, 'Bebas', 400);
    if (o.icons) o.icons(ctx, h); });
}
function paper(ctx) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = lg(ctx, 0, 0, 0, H, '#f1e8d4', '#e6dac0'); ctx.fillRect(0, 0, W, H); ctx.strokeStyle = 'rgba(90,70,50,.07)'; ctx.lineWidth = 2; for (let x = 0; x < W; x += 60) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); } for (let y = 0; y < H; y += 60) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); } }
// ----- the park -----
// n: 0 dusk .. 1 night; lit: 0..1 how much of the park's lighting is on
function sky(ctx, t, cam, n = 0) {
  applyCam(ctx, cam, .04);
  ctx.fillStyle = lg(ctx, 0, -700, 0, 1500, mix('#2a2350', '#070818', n), mix('#6a3f78', '#0d1030', n), mix('#d9705e', '#1a1f4a', n), mix('#f6b667', '#2a2f5e', n)); ctx.fillRect(-4000, -5000, 9000, 8000);
  const R = rng(5); for (let i = 0; i < 80; i++) { const x = -800 + R() * 2700, y = -1500 + R() * 2300, r = 1.5 + R() * 2.5; circle(ctx, x, y, r); ctx.fillStyle = `rgba(240,240,255,${(.15 + .6 * n) * (.5 + .5 * Math.sin(t * 2 + i))})`; ctx.fill(); }
  applyCam(ctx, cam, .07); const sy = 1330 + n * 500; glow(ctx, 260, sy, 620, '255,190,120', .5 * (1 - n)); circle(ctx, 260, sy, 120); ctx.fillStyle = mix('#ffe2a6', '#2a2f5e', n); ctx.fill();
  if (n > .3) { glow(ctx, 840, -200, 360, '190,205,255', .4 * n); circle(ctx, 840, -200, 70); ctx.fillStyle = `rgba(235,238,255,${n})`; ctx.fill(); }
  applyCam(ctx, cam, .12); for (const [cx, cy, w] of [[150, 900, 420], [900, 620, 380], [520, 300, 340], [-200, 200, 360], [1100, -300, 380]]) { ctx.fillStyle = mix('#8a4a78', '#141a3c', n); ellipse(ctx, cx + t * 4, cy, w, 30); ctx.fill(); ellipse(ctx, cx + 70 + t * 4, cy - 24, w * .6, 24); ctx.fill(); }
}
function skyline(ctx, t, cam, n = 0, lit = 0, ground = 1500) {
  applyCam(ctx, cam, .35); const c = mix('#4a3566', '#0e1028', n);
  // coaster
  ctx.beginPath(); ctx.moveTo(-900, ground + 100); for (let x = -900; x <= 2000; x += 20) ctx.lineTo(x, ground - 330 - Math.sin(x * .0052 + 1) * 230 - Math.sin(x * .013) * 60); ctx.lineTo(2000, ground + 100); ctx.lineWidth = 16; ctx.strokeStyle = c; ctx.stroke();
  for (let x = -880; x <= 2000; x += 70) line(ctx, x, ground - 330 - Math.sin(x * .0052 + 1) * 230 - Math.sin(x * .013) * 60, x, ground + 100, 6, c);
  // drop tower + tent
  ctx.fillStyle = c; ctx.fillRect(1010, ground - 1150, 46, 1250); ctx.fillRect(980, ground - 1190, 106, 50); if (lit) for (let i = 0; i < 12; i++) { circle(ctx, 1033, ground - 1100 + i * 90, 8); ctx.fillStyle = `rgba(255,120,110,${lit})`; ctx.fill(); }
  ctx.fillStyle = c; path(ctx, [[-420, ground + 100], [-380, ground - 260], [-160, ground - 470], [60, ground - 260], [100, ground + 100]]); ctx.fill(); line(ctx, -160, ground - 470, -160, ground - 560, 8, c); path(ctx, [[-160, ground - 560], [-90, ground - 535], [-160, ground - 510]]); ctx.fillStyle = mix('#d8392b', '#3a1220', n); ctx.fill();
  applyCam(ctx, cam, .6); const c2 = mix('#352a52', '#0a0c20', n);
  for (let x = -1000; x < 2300; x += 260) { ctx.fillStyle = c2; circle(ctx, x, ground - 150, 110); ctx.fill(); circle(ctx, x + 90, ground - 110, 90); ctx.fill(); ctx.fillRect(x - 12, ground - 100, 24, 200); }
  // stalls with striped awnings + bunting
  for (const sx of [-560, 180, 1180, 1820]) { box(ctx, sx, ground - 210, 300, 320, mix('#5a4470', '#11132c', n), 6); for (let i = 0; i < 6; i++) { ctx.fillStyle = i % 2 ? mix('#e9dcc4', '#2a2c4a', n) : mix('#c9543e', '#3a1826', n); path(ctx, [[sx - 20 + i * 57, ground - 270], [sx - 20 + (i + 1) * 57, ground - 270], [sx - 20 + (i + 1) * 57, ground - 200], [sx - 20 + i * 57, ground - 200]]); ctx.fill(); } box(ctx, sx + 40, ground - 170, 220, 110, lit ? mix('#1a1428', '#ffd98a', lit * .9) : mix('#2a2040', '#0a0a18', n), 4); if (lit) glow(ctx, sx + 150, ground - 110, 330, '255,210,130', .4 * lit); }
  for (let i = 0; i < 4; i++) { const a = -700 + i * 760, b = a + 760; ctx.beginPath(); ctx.moveTo(a, ground - 520); ctx.quadraticCurveTo((a + b) / 2, ground - 400, b, ground - 520); ctx.lineWidth = 4; ctx.strokeStyle = c2; ctx.stroke(); for (let k = 1; k < 12; k++) { const u = k / 12, bx = lerp(a, b, u), by = ground - 520 + 240 * u * (1 - u); path(ctx, [[bx - 16, by], [bx + 16, by], [bx, by + 36]]); ctx.fillStyle = mix(['#d8392b', '#e2a62b', '#1f8f8a', '#e9dcc4'][k % 4], '#151530', n * .75); ctx.fill(); } line(ctx, a, ground - 520, a, ground + 100, 10, c2); if (lit) { glow(ctx, a, ground - 530, 260, '255,220,150', .5 * lit); circle(ctx, a, ground - 530, 16); ctx.fillStyle = '#fff3c4'; ctx.fill(); } }
}
function groundP(ctx, cam, n = 0, ground = 1500) {
  applyCam(ctx, cam, 1); ctx.fillStyle = lg(ctx, 0, ground, 0, ground + 900, mix('#6b5a78', '#161830', n), mix('#3e3350', '#0a0b1c', n)); ctx.fillRect(-5000, ground, 11000, 4000);
  ctx.fillStyle = mix('#8a7690', '#20223e', n); for (let i = -30; i < 40; i++) { const k = i * 190; path(ctx, [[540 + (k - 540) * .55, ground], [540 + (k + 60 - 540) * .55, ground], [k + 110, ground + 900], [k, ground + 900]]); ctx.globalAlpha = .12; ctx.fill(); ctx.globalAlpha = 1; }
}
// Ferris wheel. angle 0 = bottom, PI = top. returns the hero cabin's position
const NG = 12;
function cabin(ctx, x, y, s, col, o = {}) {
  line(ctx, x, y, x, y + s * .3, s * .07, o.steel || '#2e2944');
  ctx.save(); ctx.translate(x, y + s * .3);
  ctx.beginPath(); ctx.roundRect(-s * .5, 0, s, s * .85, [s * .3, s * .3, s * .16, s * .16]); ctx.fillStyle = col; ctx.fill();
  ctx.fillStyle = 'rgba(20,8,30,.22)'; ctx.beginPath(); ctx.roundRect(s * .12, 0, s * .38, s * .85, [0, s * .3, s * .16, 0]); ctx.fill();
  ctx.beginPath(); ctx.roundRect(-s * .38, s * .14, s * .76, s * .34, s * .06); ctx.fillStyle = o.win || '#1b1830'; ctx.fill();
  if (o.inside) { ctx.save(); ctx.beginPath(); ctx.roundRect(-s * .38, s * .14, s * .76, s * .34, s * .06); ctx.clip(); o.inside(ctx, s); ctx.restore(); }
  ctx.fillStyle = 'rgba(255,255,255,.14)'; path(ctx, [[-s * .34, s * .46], [-s * .1, s * .16], [s * .02, s * .16], [-s * .22, s * .46]]); ctx.fill();
  ctx.fillStyle = dark(col, .3); ctx.fillRect(-s * .5, s * .56, s, s * .05);
  ctx.restore();
}
function ferris(ctx, cx, cy, R, rot, o = {}) {
  const n = o.n || 0, lit = o.lit || 0, steel = mix('#3a3358', '#12122a', n), ground = o.ground || cy + R + 280, t = o.t || 0;
  const cols = ['#d8392b', '#e2a62b', '#1f8f8a', '#e9dcc4', '#7a5aa8', '#e07a3a'];
  // legs
  for (const sd of [-1, 1]) { line(ctx, cx, cy, cx + sd * R * .62, ground, R * .06, steel); line(ctx, cx + sd * R * .31, cy + (ground - cy) * .5, cx - sd * R * .1, cy + (ground - cy) * .78, R * .025, steel); }
  line(ctx, cx - R * .7, ground, cx + R * .7, ground, R * .05, steel);
  for (const rr of [1, .93, .5]) { circle(ctx, cx, cy, R * rr); ctx.lineWidth = R * (rr === 1 ? .028 : .014); ctx.strokeStyle = steel; ctx.stroke(); }
  for (let i = 0; i < NG * 2; i++) { const a = rot + i * TAU / (NG * 2); line(ctx, cx, cy, cx + Math.sin(a) * R, cy + Math.cos(a) * R, R * (i % 2 ? .008 : .014), steel); }
  if (lit > 0) { const NB = 72; for (let i = 0; i < NB; i++) { if (i / NB > lit) break; const a = rot + i * TAU / NB, bx = cx + Math.sin(a) * R, by = cy + Math.cos(a) * R, c = ['255,214,120', '255,120,110', '120,230,255', '255,255,255'][(i + Math.floor(t * 3)) % 4]; glow(ctx, bx, by, R * .11, c, .55); circle(ctx, bx, by, R * .014); ctx.fillStyle = `rgb(${c})`; ctx.fill(); } for (let i = 0; i < NG * 2; i++) { if (i / (NG * 2) > lit) break; const a = rot + i * TAU / (NG * 2); for (let k = 1; k < 6; k++) { const bx = cx + Math.sin(a) * R * k / 6, by = cy + Math.cos(a) * R * k / 6; circle(ctx, bx, by, R * .009); ctx.fillStyle = `rgba(255,236,170,${.5 + .5 * Math.sin(t * 6 + k + i)})`; ctx.fill(); } } glow(ctx, cx, cy, R * 1.5, '255,200,140', .22 * lit); }
  circle(ctx, cx, cy, R * .09); ctx.fillStyle = steel; ctx.fill(); circle(ctx, cx, cy, R * .045); ctx.fillStyle = mix('#e2a62b', '#3a3020', n * .6); ctx.fill();
  let hero = null;
  for (let i = 0; i < NG; i++) { const a = rot + i * TAU / NG, gx = cx + Math.sin(a) * R, gy = cy + Math.cos(a) * R, sw = Math.sin(t * 1.5 + i) * .0; if (i === 0) { hero = [gx, gy]; continue; } cabin(ctx, gx, gy, R * .2, mix(cols[i % 6], '#16162e', n * .7), { steel, win: lit ? mix('#1b1830', '#ffd98a', lit * .5) : '#1b1830' }); }
  cabin(ctx, hero[0], hero[1], R * .2, mix('#d8392b', '#3a1424', n * .45), { steel, win: o.heroWin || '#2a2440', inside: o.inside });
  return hero;
}
const noraInside = (look = [0, 0], scared = false) => (c, s) => { guy(c, C(NORA, { x: -s * .12, y: s * .98, s: s * .72, shadow: false, face: { eyes: scared ? 'wide' : 'dot', mouth: scared ? 'o' : 'flat', look, browUp: scared ? 1 : 0 } })); goose(c, s * .16, s * .62, s * .42, 0, {}); };
function booth(ctx, x, ground, s, n = 0, lit = 0, inside) {
  box(ctx, x - 110 * s, ground - 300 * s, 220 * s, 300 * s, mix('#5a4a78', '#15152e', n), 8 * s); path(ctx, [[x - 140 * s, ground - 300 * s], [x + 140 * s, ground - 300 * s], [x + 110 * s, ground - 360 * s], [x - 110 * s, ground - 360 * s]]); ctx.fillStyle = mix('#c9543e', '#3a1826', n); ctx.fill();
  box(ctx, x - 80 * s, ground - 260 * s, 160 * s, 130 * s, lit ? mix('#1b1830', '#ffdf9a', lit) : '#1b1830', 6 * s); if (lit) glow(ctx, x, ground - 195 * s, 360 * s, '255,215,140', .45 * lit);
  if (inside) { ctx.save(); rrect(ctx, x - 80 * s, ground - 260 * s, 160 * s, 130 * s, 6 * s); ctx.clip(); inside(ctx); ctx.restore(); }
  box(ctx, x - 80 * s, ground - 120 * s, 160 * s, 14 * s, mix('#3a3358', '#0c0c1e', n));
}
function tinyCrowd(ctx, t, x0, x1, y, n, o = {}) { const R = rng(o.seed || 7); for (let i = 0; i < n; i++) { const sp = (o.sp || 120) * (.6 + R() * .8) * (o.dir || -1), x = x0 + (((R() * (x1 - x0) + t * sp) % (x1 - x0)) + (x1 - x0)) % (x1 - x0), yy = y + R() * (o.dy || 60), s = (o.s || 60) * (.85 + R() * .3), inf = R() < (o.inf || 0); const c = inf ? '#15121c' : mix(['#4f7fbf', '#c9543e', '#7a5aa8', '#4a9a6a', '#e2a62b'][i % 5], '#1a1830', o.dim || .35); const bob = Math.abs(Math.sin(t * 12 + i)) * s * .08; box(ctx, x - s * .16, yy - s * .62 - bob, s * .32, s * .4, c, s * .12); circle(ctx, x, yy - s * .8 - bob, s * .2); ctx.fillStyle = inf ? '#15121c' : mix(['#e3b089', '#8e5b3c', '#c98d63'][i % 3], '#1a1830', o.dim || .35); ctx.fill(); line(ctx, x - s * .06, yy - s * .22 - bob, x - s * .06 + Math.sin(t * 12 + i) * s * .12, yy, s * .07, DK); line(ctx, x + s * .06, yy - s * .22 - bob, x + s * .06 - Math.sin(t * 12 + i) * s * .12, yy, s * .07, DK); if (inf) { for (const sd of [-1, 1]) { circle(ctx, x + sd * s * .07, yy - s * .8 - bob, s * .035); ctx.fillStyle = '#fff'; ctx.fill(); } } } }
