# Cut the signs of a "hand signs on a flat background" video (the green
# screen footage of Green Screen Animation, on YouTube). The backgrounds
# are green, blue or black.
# For each sign this script takes the whole run of frames, crops to the box
# that holds the hand in ALL of its frames (full resolution), removes the
# background, puts the hand on black, tones it, and writes a plain mp4 (no
# loop) with the frame rate of the source.
#
# Usage:
#   hand-signs.py <src.mp4>                         print the runs
#   hand-signs.py <src.mp4> <outdir> name:run ...   cut the runs (1, 2, ...)
import subprocess, sys
import numpy as np

SRC, *rest = sys.argv[1:]
OUT, jobs = (rest[0], rest[1:]) if rest else (None, [])


def probe():
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
         "stream=width,height,r_frame_rate", "-of", "csv=p=0", SRC],
        capture_output=True, text=True, check=True).stdout.strip()
    w, h, rate = out.split(",")
    num, den = rate.split("/")
    return int(w), int(h), int(num) / int(den)


W, H, FPS = probe()


def decode(args, w, h):
    p = subprocess.Popen(["ffmpeg", "-v", "error", *args, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         stdout=subprocess.PIPE)
    n = w * h * 3
    while (buf := p.stdout.read(n)) and len(buf) == n:
        yield np.frombuffer(buf, np.uint8).reshape(h, w, 3)
    p.wait()


def kind(bg):
    """'green', 'blue' or 'black' for a flat background colour, else None."""
    r, g, b = bg
    if g > 150 and r < 90 and b < 90: return "green"
    if b > 150 and r < 90 and g < 90: return "blue"
    if max(r, g, b) < 12: return "black"
    return None


# 1. The runs of frames that have a hand on a flat background. A title card
#    has no flat background in its corner, so it is not a run.
runs, cur = [], None
for i, f in enumerate(decode(["-i", SRC, "-vf", "scale=192:108"], 192, 108)):
    f = f.astype(int)
    patch = f[1:4, -6:-3].reshape(-1, 3)
    bg = patch.mean(0)
    flat = patch.std(0).max() < 6 and kind(bg) is not None
    on = flat and (np.abs(f - bg).sum(2) > 60).mean() > 0.002
    if on:
        cur = [cur[0] if cur else i, i]
    elif cur:
        runs.append(cur); cur = None
if cur: runs.append(cur)
runs = [r for r in runs if r[1] - r[0] > 15]

if not jobs:
    for n, (a, b) in enumerate(runs, 1):
        f = next(decode(["-ss", f"{a / FPS:.4f}", "-i", SRC, "-frames:v", "1"], W, H))
        k = kind(f[4:9, -9:-4].reshape(-1, 3).mean(0))
        print(f"{n} frames {a}-{b} ({(b - a + 1) / FPS:.2f}s) {k}")
    sys.exit()

# 2. Each sign.
for job in jobs:
    name, num = job.split(":")
    a, b = runs[int(num) - 1]
    n = b - a + 1
    ss = f"{a / FPS:.4f}"
    x0, y0, x1, y1 = W, H, 0, 0
    bg0 = None
    for f in decode(["-ss", ss, "-i", SRC, "-frames:v", str(n)], W, H):
        bg = f[4:9, -9:-4].reshape(-1, 3).mean(0)
        bg0 = bg if bg0 is None else bg0
        m = np.abs(f.astype(np.int16) - bg.astype(np.int16)).sum(2) > 90
        cols = np.where(m.sum(0) >= 3)[0]
        rows = np.where(m.sum(1) >= 3)[0]
        if len(cols) and len(rows):
            x0, x1 = min(x0, cols[0]), max(x1, cols[-1])
            y0, y1 = min(y0, rows[0]), max(y1, rows[-1])
    M = 4
    x0, y0 = max(0, x0 - M), max(0, y0 - M)
    x1, y1 = min(W - 1, x1 + M), min(H - 1, y1 + M)
    w, h = (x1 - x0 + 1) // 2 * 2, (y1 - y0 + 1) // 2 * 2
    k = kind(bg0)
    hexkey = "0x%02x%02x%02x" % tuple(int(v) for v in bg0)
    print(f"{name}: run {num}, frames {a}-{b} ({n}) at {FPS:g} fps, crop {w}x{h}+{x0}+{y0}, background {k} {hexkey}", flush=True)
    # A black background is already the background layer: no key.
    key = (f"[0:v]crop={w}:{h}:{x0}:{y0},split=2[k][bg];[bg]drawbox=c=black:t=fill[blk];"
           f"[k]chromakey={hexkey}:0.22:0.1,despill=type={k}:mix=0.6:expand=0.2[fg];[blk][fg]overlay=format=auto"
           if k != "black" else f"[0:v]crop={w}:{h}:{x0}:{y0}")
    # Pass 1: the hand on black, in grey, with no tone curve.
    keyed = f"{OUT}/.{name}.keyed.mkv"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", ss, "-i", SRC, "-frames:v", str(n), "-filter_complex",
                    key + ",format=gray,boxblur=1", "-r", f"{FPS}", "-an", "-c:v", "ffv1", keyed], check=True)
    # The skin of each footage has its own brightness (pale or tanned). Map
    # the darkest skin (5%), the median and the brightest skin (95%) of the
    # clip to fixed values, so that the hand has the same share of
    # midtones and highlights with the default thresholds (105 and 161): the
    # median is at the highlight threshold.
    ch = (H * 480 // W) // 2 * 2
    px = []
    for g in list(decode(["-i", keyed, "-vf", "scale=480:%d,format=gray" % ch], 480, ch))[::3]:
        v = g[:, :, 0]
        px.append(v[v > 16])
    p5, p50, p95 = (np.percentile(np.concatenate(px), q) / 255 for q in (5, 50, 95))
    p95 = min(p95, 0.97)
    pts = [(0, 0), (p5 * 0.6, 0.2), (p5, 0.45), (p50, 0.63), (p95, 0.9), (1, 1)]
    curve = " ".join(f"{x:.4f}/{y:.4f}" for x, y in pts)
    print(f"  skin brightness 5%/50%/95%: {p5 * 255:.0f}/{p50 * 255:.0f}/{p95 * 255:.0f}", flush=True)
    # Pass 2: the tone curve.
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", keyed, "-vf",
                    f"curves=all='{curve}',format=yuv420p", "-r", f"{FPS}", "-an", "-c:v", "libx264", "-crf", "10",
                    f"{OUT}/{name}.mp4"], check=True)
    subprocess.run(["rm", keyed])
