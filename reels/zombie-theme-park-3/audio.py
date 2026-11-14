import numpy as np, soundfile as sf, json
from scipy import signal
SR = 44100
import json as _j, os as _os
WARP = _j.load(open('audio/warp.json')) if _os.path.exists('audio/warp.json') else None
def toNew(x):
    if not WARP: return x
    A = WARP['anchors']
    if x <= A[0][0]: return x - A[0][0] + A[0][1]
    for i in range(len(A) - 1):
        if x <= A[i + 1][0]: k = (x - A[i][0]) / (A[i + 1][0] - A[i][0]); return A[i][1] + k * (A[i + 1][1] - A[i][1])
    return x - A[-1][0] + A[-1][1]
DUR = 70.0 + 0.3
N = int(DUR * SR)
rng = np.random.default_rng(3)
def T(n): return np.arange(n) / SR
def env(n, a=.005, d=.2, curve=4):
    t = T(n); e = np.minimum(1, t / max(a, 1e-4)) * np.exp(-np.maximum(0, t - a) * curve / max(d, 1e-4)); return e
def place(buf, x, at, g=1.0):
    i = int(toNew(at) * SR); j = min(len(buf), i + len(x))
    if i < 0 or i >= len(buf): return
    buf[i:j] += x[:j - i] * g
def bp(x, lo, hi, order=2):
    b, a = signal.butter(order, [lo / (SR / 2), min(hi / (SR / 2), .99)], 'band'); return signal.lfilter(b, a, x)
def lp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), 'low'); return signal.lfilter(b, a, x)
def hp(x, f, order=2):
    b, a = signal.butter(order, f / (SR / 2), 'high'); return signal.lfilter(b, a, x)

# ---------------- SFX ----------------
def whoosh(dur=.35, up=True):
    n = int(dur * SR); x = rng.standard_normal(n); t = T(n)
    lo, hi = bp(x, 250, 1200), bp(x, 1500, 6000); k = np.linspace(0, 1, n) if up else np.linspace(1, 0, n)
    e = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    return (lo * (1 - k) + hi * k) * e * 1.6
def thud(f0=70, dur=.35, g=1):
    n = int(dur * SR); t = T(n); f = f0 * (1 + 1.5 * np.exp(-t * 30))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 12)
    x += lp(rng.standard_normal(n), 900) * np.exp(-t * 40) * .6
    return x * g
def clang(f0=520, dur=1.0):
    n = int(dur * SR); t = T(n); x = np.zeros(n)
    for k, (r, a, d) in enumerate([(1, 1, 5), (2.76, .6, 7), (5.4, .4, 10), (8.9, .25, 14), (1.5, .5, 6)]):
        x += a * np.sin(2 * np.pi * f0 * r * t + k) * np.exp(-t * d)
    x += hp(rng.standard_normal(n), 2000) * np.exp(-t * 60) * .8
    return x * .5 + thud(90, dur, .7)[:n]
def pluck(f, dur=.5, bright=.5):
    n = int(dur * SR); p = int(SR / f); buf = rng.uniform(-1, 1, p); out = np.zeros(n)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = bright * buf[i % p] + (1 - bright) * .5 * (buf[i % p] + buf[(i + 1) % p]) * .996 if False else .5 * (buf[i % p] + buf[(i + 1) % p]) * .995
    return out
def chime(f=1760, dur=.8):
    n = int(dur * SR); t = T(n)
    return (np.sin(2 * np.pi * f * t) + .5 * np.sin(2 * np.pi * f * 2.01 * t) + .3 * np.sin(2 * np.pi * f * 3 * t)) * np.exp(-t * 6) * np.minimum(1, t / .003) * .5
def sparkle_sfx():
    out = np.zeros(int(.7 * SR))
    for i, f in enumerate([2093, 2637, 3136, 4186]): place(out, chime(f, .5) * .5, i * .05)
    return out
def tick(): n = int(.04 * SR); t = T(n); return hp(rng.standard_normal(n), 3000) * np.exp(-t * 200) * .8 + np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 150) * .4
def pop(f=600):
    n = int(.12 * SR); t = T(n); fr = f * (1 + 2 * t * 10); return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 40)
def boing(f=220, dur=.5):
    n = int(dur * SR); t = T(n); fr = f * (1 + .35 * np.sin(2 * np.pi * 9 * t) * np.exp(-t * 3)) * (1 + t)
    return np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.exp(-t * 5) * .6
def tweet():
    out = np.zeros(int(1.2 * SR))
    for i in range(4):
        n = int(.1 * SR); t = T(n); fr = 3200 + 900 * np.sin(2 * np.pi * 30 * t)
        place(out, np.sin(2 * np.pi * np.cumsum(fr) / SR) * np.sin(np.pi * t / .1) * .25, i * .25)
    return out
def scribble(dur=.18):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 1500, 6000) * (0.5 + .5 * np.sin(2 * np.pi * 30 * t)) * np.sin(np.pi * t / dur) * .5
def riser(dur=2.8):
    n = int(dur * SR); t = T(n); f = 200 * (2 ** (t / dur * 2.5))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .3 + bp(rng.standard_normal(n), 800, 5000) * .3 * (t / dur)
    return x * (t / dur) ** 2
def waves(dur):
    n = int(dur * SR); t = T(n); x = lp(rng.standard_normal(n), 700, 2)
    return x * (0.5 + .5 * np.sin(2 * np.pi * t / 4.5) ** 2) * .5
def heartbeat():
    out = np.zeros(int(.8 * SR)); place(out, thud(55, .3, .8), 0); place(out, thud(50, .3, .6), .22); return out


def splash(dur=1.1):
    n = int(dur * SR); t = T(n); x = bp(rng.standard_normal(n), 300, 5000)
    return x * np.minimum(1, t / .02) * np.exp(-t * 3.5) * 1.2 + thud(60, dur, .8)[:n]
def static(dur=.5):
    n = int(dur * SR); t = T(n); return bp(rng.standard_normal(n), 1200, 5000) * (.6 + .4 * np.sin(2 * np.pi * 23 * t)) * np.sin(np.pi * t / dur) * .4
def beep(f=880, dur=.1):
    n = int(dur * SR); t = T(n); return np.sin(2 * np.pi * f * t) * np.minimum(1, t / .005) * np.minimum(1, (dur - t) / .01) * .4
def steps(t0, t1, rate=6.5, f=150, g=.22):
    k = 0; t = t0
    while t < t1: place(sfx, thud(f + (k % 2) * 30, .08, 1), t, g); t += 1 / rate; k += 1
def groan(dur=.9, f=85):
    n = int(dur * SR); t = T(n); fr = f * (1 + .25 * np.sin(2 * np.pi * 1.3 * t / dur)) * (1 - .2 * t / dur)
    ph = np.cumsum(fr) / SR; x = lp((2 * (ph % 1) - 1) * (1 + .5 * np.sin(2 * np.pi * 27 * t)), 600)
    return x * np.sin(np.pi * t / dur) ** 1.2 * .5
def honk(dur=.28, f=430):
    n = int(dur * SR); t = T(n); fr = f * (1 - .25 * t / dur) * (1 + .03 * np.sin(2 * np.pi * 40 * t)); ph = np.cumsum(fr) / SR
    x = bp((2 * (ph % 1) - 1) + .5 * np.sign(np.sin(2 * np.pi * ph)), 500, 2600); return x * np.minimum(1, t / .01) * np.minimum(1, (dur - t) / .05) * .6
def rotor(dur, g0=.2, g1=1.0):
    n = int(dur * SR); t = T(n); x = lp(rng.standard_normal(n), 320) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 13 * t)) * .8) + np.sin(2 * np.pi * 52 * t) * .5
    return x * np.linspace(g0, g1, n) * np.minimum(1, t / .3) * np.minimum(1, (dur - t) / .3)
sfx = np.zeros(N)
place(sfx, thud(50, .6), 2.24, .8); place(sfx, clang(700, .4), 3.6, .4); place(sfx, groan(1.2, 65), 3.7, .5)
steps(4.6, 7.3, 4, 110, .2)
for g0 in [5.0, 5.9, 6.6]: place(sfx, groan(.9, 70 + (g0 * 31) % 30), g0, .4)
for i in range(30): place(sfx, clang(520, .09), 7.5 + i * .14, .16)
steps(7.6, 11.8, 7, 130, .1); place(sfx, chime(1320, .8), 8.4, .2)
place(sfx, thud(48, .7), 12.56, .8)
for i in range(30): place(sfx, tick(), 12.2 + i * .09, .14)
place(sfx, pop(520), 13.2, .3); place(sfx, pop(700), 15.6, .35)
for b0 in [15.65, 16.3, 17.35, 17.9, 18.45, 19.0, 19.45]: place(sfx, thud(60, .4), b0, .9); place(sfx, clang(210, .5), b0, .4)
place(sfx, groan(1.0, 80), 18.9, .5)
place(sfx, whoosh(1.4, False), 21.0, .2); place(sfx, chime(1046, 1.2), 21.9, .25)
place(sfx, thud(55, .5), 23.2, .8); place(sfx, pop(640), 25.5, .35)
place(sfx, static(.4), 26.4, .5)
for b0, f in [(28.24, 660), (28.96, 660), (30.32, 440), (30.96, 990)]: place(sfx, beep(f, .12), b0, .4)
steps(31.0, 31.6, 10, 170, .25)
place(sfx, heartbeat(), 33.9, .5); place(sfx, heartbeat(), 34.7, .55)
for g0 in [32.2, 33.4, 34.9]: place(sfx, groan(1.0, 62 + (g0 * 29) % 36), g0, .35)
n2 = int(.35 * SR); place(sfx, bp(rng.standard_normal(n2), 2000, 7000) * np.linspace(.2, 1, n2) * .5, 36.75, .5)
for h0, f in [(37.25, 470), (38.3, 430), (38.75, 480), (39.5, 440), (41.5, 460), (42.4, 430), (43.3, 470), (44.2, 440), (45.0, 420)]: place(sfx, honk(.24, f), h0, .7 if h0 < 41 else .5)
place(sfx, whoosh(.8), 38.1, .3); place(sfx, pop(520), 40.1, .3)
steps(42.0, 46.2, 5, 120, .13)
for g0 in [42.6, 43.9, 45.1]: place(sfx, groan(.9, 72 + (g0 * 31) % 30), g0, .3)
place(sfx, clang(110, 1.4), 43.7, .5)
for i in range(22): place(sfx, clang(880 + (i % 2) * 110, .12), 46.6 + i * .24, .16)
place(sfx, whoosh(.9, False), 49.2, .2)
place(sfx, chime(1568, 1.6), 53.7, .25); place(sfx, waves(3.2), 52.0, .2)
place(sfx, static(.5), 55.4, .6); place(sfx, static(.25), 57.3, .45); place(sfx, beep(880, .08), 57.7, .3); place(sfx, static(.2), 61.5, .4)
place(sfx, rotor(8.2, .12, 1.0), 57.6, .55); place(sfx, thud(45, .8), 61.12, .9)
for g0 in [62.6, 63.2, 63.8, 64.4]: place(sfx, groan(1.1, 60 + (g0 * 37) % 40), g0, .45)
place(sfx, riser(3.2), 62.3, .45)
place(sfx, thud(45, .9), 66.3, 1.0); place(sfx, clang(130, 1.6), 66.3, .35)
# ---------------- music (procedural sea-shanty jig, D minor, 6/8) ----------------
BPM = 132  # dotted-quarter = beat; eighth = 60/BPM/... use eighth duration
E8 = 60 / BPM / 2 * 1.0  # eighth note seconds (6/8 feel)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def saw_pad(f, dur, g=.2):
    n = int(dur * SR); t = T(n); vib = 1 + .004 * np.sin(2 * np.pi * 5.5 * t)
    ph = np.cumsum(f * vib) / SR; x = 2 * (ph % 1) - 1 + .6 * (2 * ((ph * 1.005) % 1) - 1)
    x = lp(x, 1400); e = np.minimum(1, t / .06) * np.minimum(1, (dur - t) / .08)
    return x * e * g
mel = [62, 65, 69, 67, 65, 64, 62, 64, 65, 64, 62, 61, 62, 65, 69, 72, 70, 69, 67, 65, 64, 62, 61, 62]  # 24 eighths = 4 bars of 6/8
chords = [(50, 57, 62, 65), (48, 55, 60, 64), (46, 53, 58, 62), (45, 52, 57, 61)]
plk_cache = {}
def plk(m, dur):
    k = (m, round(dur, 2))
    if k not in plk_cache: plk_cache[k] = pluck(midi(m), dur)
    return plk_cache[k]
music = np.zeros(N)
def jig(t0, t1, g=1.0, mel_on=True, bass_on=True, pad_on=True, drum=True, mel_g=.55):
    t = t0; i = 0
    while t < t1:
        bar = (i // 6) % 4; ch = chords[bar]
        if bass_on and i % 6 == 0: place(music, plk(ch[0] - 12, E8 * 6) * .7, t, g)
        if pad_on and i % 6 == 0:
            for m in ch[1:]: place(music, saw_pad(midi(m), min(E8 * 6, t1 - t)), t, g * .25)
        if mel_on and i % 3 == 0: place(music, plk(mel[i % 24], E8 * 3) * .8, t, g * mel_g)
        # light percussion: frame drum on 1 and 4
        if drum and i % 6 == 0: place(music, thud(100, .12, .15), t, g)
        t += E8; i += 1
def drone(t0, t1, g=1.0):
    n = int((t1 - t0) * SR); t = T(n)
    x = (np.sin(2 * np.pi * 73.4 * t) + .5 * np.sin(2 * np.pi * 110 * t + 1) + .3 * np.sin(2 * np.pi * 146.8 * t * 1.003)) * (0.7 + .3 * np.sin(2 * np.pi * .3 * t))
    x *= np.minimum(1, t / .4) * np.minimum(1, (t1 - t0 - t) / .4)
    place(music, x * .25, t0, g)
# ---- whimsical comedic underscore (replaces jig) ----
music = np.zeros(N)
BEAT = 60 / 104
def pizz(m, dur=.45, g=1.0):
    k = ('pz', m, round(dur, 2))
    if k not in plk_cache:
        x = pluck(midi(m), dur); n = len(x); t = T(n)
        x = bp(x, 180, 3500) * np.exp(-t * 7) + bp(rng.standard_normal(n), 1500, 5000) * np.exp(-t * 300) * .15
        plk_cache[k] = x / (np.max(np.abs(x)) + 1e-9)
    return plk_cache[k] * g
def glock(m, dur=1.2, g=1.0):
    n = int(dur * SR); t = T(n); f = midi(m)
    x = (np.sin(2 * np.pi * f * t) + .35 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 6) + .15 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 12))
    return x * np.exp(-t * 3.5) * np.minimum(1, t / .002) * .5 * g
def reed(m, dur=.22, g=1.0):
    n = int(dur * SR); t = T(n); f = midi(m); ph = (f * t) % 1
    x = lp(np.sign(np.sin(2 * np.pi * ph)) * .6 + (2 * ph - 1) * .4, 900)
    return x * np.minimum(1, t / .015) * np.exp(-t * 6) * np.minimum(1, (dur - t) / .03) * .5 * g
def strings(ms, dur, g=1.0):
    n = int(dur * SR); t = T(n); x = np.zeros(n)
    for m in ms:
        for d in (-.004, 0, .005):
            ph = np.cumsum(midi(m) * (1 + d) * (1 + .003 * np.sin(2 * np.pi * 5 * t))) / SR; x += 2 * (ph % 1) - 1
    x = lp(x / (len(ms) * 3), 1100); e = np.minimum(1, t / .5) * np.minimum(1, (dur - t) / .5)
    return x * e * g
# progressions (root, chord tones) in midi
DM = [(38, (62, 65, 69)), (43, (62, 67, 71)), (38, (62, 65, 69)), (45, (61, 64, 67))]   # Dm G Dm A7
DMAJ = [(38, (62, 66, 69)), (43, (62, 67, 71)), (45, (61, 64, 69)), (38, (62, 66, 69))]  # D G A D
motif = [(0, 74), (.5, 77), (1, 81), (2, 79), (2.5, 77), (3, 76)]  # glock line over 1 bar
def playful(t0, t1, prog, g=1.0, glock_on=True, stabs=True):
    t = t0; bar = 0
    while t < t1 - .05:
        root, ch = prog[bar % 4]
        place(music, pizz(root, .5, .9), t, g); place(music, pizz(root + 7, .5, .7), t + 2 * BEAT, g)
        if stabs:
            for bt in (1, 3): 
                for m in ch: place(music, pizz(m - 12, .3, .28), t + bt * BEAT, g)
        if glock_on and bar % 2 == 0:
            for (bt, m) in motif:
                mm = m if prog is DM else m + (1 if m % 12 in (5,) else 0)
                if t + bt * BEAT < t1: place(music, glock(mm, 1.0, .35), t + bt * BEAT, g)
        t += 4 * BEAT; bar += 1
def sneak(t0, t1, g=1.0):
    steps = [38, 38, 41, 40, 39, 38, 36, 37]
    t = t0; i = 0
    while t < t1 - .05:
        place(music, reed(steps[i % 8] + 12, .2, .8), t, g); place(music, pizz(steps[i % 8], .35, .6), t, g)
        t += BEAT * (1 if i % 2 == 0 else 1); i += 1

def carnival(t0, t1, g=1.0, prog=None, step=.26):
    prog = prog or [62, 66, 69, 74, 69, 66, 64, 67, 71, 76, 71, 67]
    t = t0; i = 0
    while t < t1 - .05: place(music, glock(prog[i % len(prog)] + 12, .7, .35), t, g); (i % 3 == 0) and place(music, pizz(prog[(i // 3 * 3) % len(prog)] - 24, .5, .7), t, g); t += step; i += 1
drone(0, 7.4, 1.1); place(music, strings((38, 44, 49), 7.4, .5), 0)
for k in range(8): place(music, pizz(37, .7, .55), .4 + k * .85)
playful(7.5, 11.8, DM, .7, glock_on=False)
sneak(12.0, 15.2, .9)
drone(15.3, 19.8, 1.3); place(music, strings((38, 44, 50), 4.5, .5), 15.3)
place(music, strings((50, 57, 62, 66), 3.1, .45), 19.9)
place(music, strings((50, 57, 62), 3.1, .4), 23.1)
sneak(26.3, 31.6, 1.0)
place(music, strings((49, 55, 61), 4.1, .5), 31.7); drone(31.7, 35.8, 1.0)
playful(35.9, 46.3, DMAJ, .95)
playful(46.5, 51.8, DM, .7, glock_on=False)
place(music, strings((50, 57, 62, 66), 3.4, .6), 51.9)
for k, m in enumerate([74, 78, 81, 86]): place(music, glock(m, 1.6, .3), 52.2 + k * .6)
drone(55.2, 65.8, 1.3); place(music, strings((38, 44, 49), 10.4, .5), 55.3)
for k in range(9): place(music, pizz(38, .7, .6), 60.4 + k * .6)
place(music, strings((38, 45, 50, 56), 3.6, .7), 66.2); drone(66.2, 70.1, 1.0)
for k, m in enumerate([74, 73, 69, 62]): place(music, glock(m, 1.6, .35), 66.8 + k * .55)
music = lp(music, 6000)

# ---------------- VO + mix ----------------
vo, vsr = sf.read('audio/vo.wav')
if vo.ndim > 1: vo = vo.mean(1)
vo = signal.resample_poly(vo, SR, vsr)
vo = hp(vo, 90)
# gentle compression
envv = np.abs(signal.hilbert(vo)); envv = lp(envv, 20)
gain = np.where(envv > .15, (.15 / np.maximum(envv, 1e-6)) ** .4, 1.0); vo = vo * gain
vo = vo / np.max(np.abs(vo)) * .9
VO = np.zeros(N); VO[:min(N, len(vo))] = vo[:N]
# duck music under VO
venv = lp(np.abs(VO), 6); vtrack = np.clip(venv / .05, 0, 1)
duck = 1 - .55 * vtrack
mixL = VO * 1.0 + music * .22 * duck + sfx * .7
mixR = mixL.copy()
out = np.stack([mixL, mixR], 1)
fade = np.ones(N); fl = int(.5 * SR); fade[-fl:] = np.linspace(1, 0, fl); out *= fade[:, None]
pk = np.max(np.abs(out)); out = out / pk * .89
sf.write('audio/mix.wav', out, SR)
print('done', out.shape, 'rms dB', 20 * np.log10(np.sqrt(np.mean(out ** 2))))
