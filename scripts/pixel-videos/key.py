# Key one take of green screen footage into a video with a transparent
# background. encode.ts then makes the .pxv from it.
#
# Usage (from the root of the repo):
#   uv run --with numpy python -I scripts/pixel-videos/key.py runs <url> [--only green]
#   uv run --with numpy python -I scripts/pixel-videos/key.py <url> --run <n> --name <name> [options]
#
# `runs` downloads the video (best quality) to tmp/source/, once, and prints
# its runs: the takes with a subject on a flat background (green, blue or
# black). The second form keys run <n>:
#
#   1. it finds the box that holds the subject in ALL the frames of the run;
#   2. it keys the background with a colour difference key and removes the
#      green or blue spill, then writes tmp/<name>.mov (ProRes 4444 with
#      alpha: QuickTime and QuickLook show the transparency);
#   3. it writes tmp/<name>.png, a sheet of 8 frames on a checkerboard, so
#      that you can see the key quickly;
#   4. it prints the URL of the take (for `encode.ts --source`).
#
# Options:
#   --only <kind>        use only the runs on this background (green, blue,
#                        black): for example when number cards on black come
#                        between the takes
#   --trim <first> <last>  the frames of the run to keep, from 0
#   --lo, --hi, --despill  the key (see `matte()` below)
import argparse, hashlib, json, pathlib, re, subprocess, sys
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parents[2]
TMP = ROOT / "tmp"
SOURCES = TMP / "source"

# The default key settings. For green and blue, `lo` and `hi` are fractions of
# the colour excess of the screen. For black, they are luma values (0-255).
KEY_DEFAULTS = {
    "green": {"lo": 0.15, "hi": 0.45, "despill": 1.0},
    "blue": {"lo": 0.15, "hi": 0.45, "despill": 1.0},
    "black": {"lo": 8, "hi": 40, "despill": 0},
}
MAX_HEIGHT = 1080  # the height limit of the .mov
def youtube_id(url):
    m = re.search(r"(?:v=|youtu\.be/)([\w-]{11})", url)
    return m and m.group(1)


def source_id(url):
    """The name of the downloaded file: the YouTube id, else a hash of the URL."""
    return youtube_id(url) or hashlib.sha1(url.encode()).hexdigest()[:12]


def source_file(url):
    vid = source_id(url)
    files = [p for p in SOURCES.glob(f"{vid}.*") if p.suffix in (".mp4", ".webm", ".mkv", ".mov")]
    if files:
        return files[0]
    SOURCES.mkdir(parents=True, exist_ok=True)
    if youtube_id(url):
        subprocess.run(["yt-dlp", "-q", "--no-warnings", "-f", "bv*", "-S", "res,tbr",
                        "-o", str(SOURCES / f"{vid}.%(ext)s"), url], check=True)
    else:
        # A direct link to a video file (for example a stock preview).
        subprocess.run(["curl", "-sfL", "-o", str(SOURCES / f"{vid}.mp4"), url], check=True)
    return source_file(url)


def probe(path):
    out = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries",
                          "stream=width,height,r_frame_rate", "-of", "csv=p=0", str(path)],
                         capture_output=True, text=True, check=True).stdout.strip()
    w, h, rate = out.split(",")
    num, den = rate.split("/")
    return int(w), int(h), int(num) / int(den)


def frames(args, w, h):
    """The frames of ffmpeg `args`, as uint8 arrays of h x w x 3."""
    p = subprocess.Popen(["ffmpeg", "-v", "error", *args, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         stdout=subprocess.PIPE)
    n = w * h * 3
    while (buf := p.stdout.read(n)) and len(buf) == n:
        yield np.frombuffer(buf, np.uint8).reshape(h, w, 3)
    p.stdout.close()
    p.wait()


def kind(bg):
    """'green', 'blue' or 'black' for a flat background colour, else None."""
    r, g, b = bg
    # Some screens are yellow green (130, 167, 40): an excess of only 37.
    if g > 120 and g - max(r, b) > 30: return "green"
    if b > 120 and b - max(r, g) > 60: return "blue"
    if max(r, g, b) < 12: return "black"
    return None


def corner(f):
    """The colour of the background: a patch in the top right corner."""
    h, w = f.shape[:2]
    return f[h // 40:h // 40 + max(2, h // 60), w - w // 40 - max(2, w // 60):w - w // 40].reshape(-1, 3).mean(0)


def detect_runs(url, only):
    """The runs of frames with a subject on a flat background, as [first, last, kind]."""
    runs = all_runs(url)
    return [r for r in runs if only is None or r[2] == only]


def all_runs(url):
    cache = SOURCES / f"{source_id(url)}.runs.json"
    if cache.exists():
        return json.loads(cache.read_text())
    runs, cur = [], None
    for i, f in enumerate(frames(["-i", str(source_file(url)), "-vf", "scale=192:108"], 192, 108)):
        f = f.astype(int)
        patch = f[1:4, -6:-3].reshape(-1, 3)
        bg = patch.mean(0)
        k = kind(bg) if patch.std(0).max() < 6 else None
        on = k is not None and (np.abs(f - bg).sum(2) > 60).mean() > 0.002
        if on and cur and cur[2] == k:
            cur[1] = i
        elif on:
            if cur: runs.append(cur)
            cur = [i, i, k]
        elif cur:
            runs.append(cur); cur = None
    if cur: runs.append(cur)
    runs = [r for r in runs if r[1] - r[0] > 15]
    cache.write_text(json.dumps(runs))
    return runs


def matte(f, bg, k, key):
    """The alpha (0-1) of each pixel of `f` (float, 0-255).

    Green and blue: a colour difference key. The excess of the screen colour
    is G - max(R, B) for green (B - max(R, G) for blue). `r` is the excess of
    the pixel divided by the excess of the screen: 1 on the screen, 0 or less
    on skin, grey, black and white. A pixel with r <= lo is opaque, a pixel
    with r >= hi is transparent, and between them alpha is linear. Thus a
    grey shirt or black trousers stay opaque, and only colour with a green
    excess becomes transparent.
    Black: a luma key. A pixel with luma <= lo is transparent, >= hi is opaque.
    """
    if k == "black":
        luma = f @ np.array([0.2126, 0.7152, 0.0722], np.float32)
        return np.clip((luma - key["lo"]) / (key["hi"] - key["lo"]), 0, 1)
    c = 1 if k == "green" else 2
    o = [0, 2] if k == "green" else [0, 1]
    excess = f[..., c] - f[..., o].max(-1)
    r = excess / max(1.0, bg[c] - bg[o].max())
    return np.clip((key["hi"] - r) / (key["hi"] - key["lo"]), 0, 1)


def despill(f, k, amount):
    """Remove the screen colour that the screen reflects on the subject."""
    if k == "black" or amount == 0:
        return f
    c = 1 if k == "green" else 2
    o = [0, 2] if k == "green" else [0, 1]
    limit = f[..., o].max(-1)
    f = f.copy()
    f[..., c] -= amount * np.maximum(0, f[..., c] - limit)
    return f


def checker(h, w, size=16):
    y, x = np.indices((h, w))
    return np.where(((y // size + x // size) % 2)[..., None] == 0, 200, 150).astype(np.float32)


def key_clip(args):
    name, url = args.name, args.url
    mov, sheet = TMP / f"{name}.mov", TMP / f"{name}.png"
    src = source_file(url)
    W, H, FPS = probe(src)
    a, b, k = detect_runs(url, args.only)[args.run - 1]
    if args.trim:
        a, b = a + args.trim[0], a + args.trim[1]
    n = b - a + 1
    given = {"lo": args.lo, "hi": args.hi, "despill": args.despill}
    key = {**KEY_DEFAULTS[k], **{x: v for x, v in given.items() if v is not None}}
    ss = f"{a / FPS:.4f}"

    # Pass 1, at a small size: the colour of the screen in each frame, and
    # the box that holds the subject in all the frames.
    sw = 960
    sh = round(H * sw / W / 2) * 2
    bgs, boxes = [], []
    for f in frames(["-ss", ss, "-i", str(src), "-frames:v", str(n), "-vf", f"scale={sw}:{sh}"], sw, sh):
        f = f.astype(np.float32)
        bg = corner(f)
        bgs.append(bg)
        m = matte(f, bg, k, key) > 0.5
        cols, rows = np.where(m.sum(0) >= 2)[0], np.where(m.sum(1) >= 2)[0]
        boxes.append((cols[0], rows[0], cols[-1], rows[-1]) if len(cols) and len(rows) else None)
    # A frame at the start or the end of the run can be a frame of the
    # transition (for example a black card). It has no screen colour, thus
    # the key keeps all of it. Remove these frames.
    good = [i for i, bg in enumerate(bgs) if kind(bg) == k]
    i0, i1 = good[0], good[-1]
    x0, y0, x1, y1 = sw, sh, 0, 0
    for box in boxes[i0:i1 + 1]:
        if box:
            x0, y0, x1, y1 = min(x0, box[0]), min(y0, box[1]), max(x1, box[2]), max(y1, box[3])
    s = W / sw
    M = 3  # margin, in small pixels
    cx0, cy0 = max(0, int((x0 - M) * s)), max(0, int((y0 - M) * s))
    cx1, cy1 = min(W, int((x1 + 1 + M) * s)), min(H, int((y1 + 1 + M) * s))
    cw, ch = (cx1 - cx0) // 2 * 2, (cy1 - cy0) // 2 * 2
    a, b = a + i0, a + i1
    print(f"{name}: run {args.run}, frames {a}-{b} ({b - a + 1}) at {FPS:g} fps, {k}, "
          f"crop {cw}x{ch}+{cx0}+{cy0} of {W}x{H}", flush=True)

    # Pass 2, at full size: key each frame, and send RGBA to the ProRes
    # encoder. The scale is on premultiplied colour, thus the colour of the
    # transparent pixels does not go into the edges.
    oh = min(ch, MAX_HEIGHT)
    enc = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba",
                            "-s", f"{cw}x{ch}", "-r", f"{FPS}", "-i", "-",
                            "-vf", f"premultiply=inplace=1,scale=-2:{oh}:flags=area,unpremultiply=inplace=1",
                            "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le",
                            "-alpha_bits", "16", "-vendor", "apl0", str(mov)], stdin=subprocess.PIPE)
    picks = set(np.linspace(i0, i1, 8).round().astype(int).tolist())
    tiles = []
    for i, f in enumerate(frames(["-ss", ss, "-i", str(src), "-frames:v", str(n),
                                  "-vf", f"crop={cw}:{ch}:{cx0}:{cy0}"], cw, ch)):
        if i < i0 or i > i1:
            continue
        f = f.astype(np.float32)
        alpha = matte(f, bgs[i], k, key)
        rgb = despill(f, k, key["despill"])
        out = np.dstack([rgb, alpha * 255]).round().clip(0, 255).astype(np.uint8)
        enc.stdin.write(out.tobytes())
        if i in picks:
            tiles.append(rgb * alpha[..., None] + checker(ch, cw) * (1 - alpha[..., None]))
    enc.stdin.close()
    if enc.wait():
        sys.exit(f"{name}: ffmpeg failed")

    # The sheet: 8 frames side by side, 360 px high.
    strip = np.concatenate(tiles, 1).round().clip(0, 255).astype(np.uint8)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24",
                    "-s", f"{strip.shape[1]}x{strip.shape[0]}", "-i", "-", "-vf", "scale=-2:360:flags=area",
                    "-frames:v", "1", str(sheet)], input=strip.tobytes(), check=True)


    # The URL of the take, to find it again. encode.ts writes it in the file.
    take = f"{url}{'&' if '?' in url else '?'}t={int(a / FPS)}s" if youtube_id(url) else url
    print(f"wrote {mov.relative_to(ROOT)} and {sheet.relative_to(ROOT)}\nsource {take}")


def main():
    if sys.argv[1:2] == ["runs"]:
        p = argparse.ArgumentParser()
        p.add_argument("runs")
        p.add_argument("url")
        p.add_argument("--only", choices=list(KEY_DEFAULTS))
        args = p.parse_args()
        _, _, fps = probe(source_file(args.url))
        for i, (a, b, k) in enumerate(detect_runs(args.url, args.only), 1):
            print(f"{i}: frames {a}-{b} ({(b - a + 1) / fps:.2f}s, from {a / fps:.1f}s) {k}")
        return
    p = argparse.ArgumentParser()
    p.add_argument("url")
    p.add_argument("--run", type=int, required=True)
    p.add_argument("--name", required=True)
    p.add_argument("--only", choices=list(KEY_DEFAULTS))
    p.add_argument("--trim", type=int, nargs=2)
    p.add_argument("--lo", type=float)
    p.add_argument("--hi", type=float)
    p.add_argument("--despill", type=float)
    key_clip(p.parse_args())


main()
