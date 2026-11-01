# Render a Lottie animation into a video with a transparent background.
# encode.ts then makes the .pxv from it, as from keyed footage.
#
# Usage (from the root of the repo):
#   uv run --with rlottie-python --with pillow python -I scripts/pixel-videos/lottie.py <lottie> --name <name> [options]
#
# <lottie> is one of:
#   - a local Lottie JSON file;
#   - the URL of a Lottie JSON file;
#   - `noto:<codepoint>`, an animated Noto emoji (CC BY 4.0), for example
#     `noto:1f44b` (waving hand). The list of the emoji and their codepoints
#     is at https://googlefonts.github.io/noto-emoji-animation/.
#
# The script:
#   1. downloads the JSON (a URL or a Noto emoji) to tmp/source/, once;
#   2. renders all the frames with rlottie, crops them to the box that holds
#      the drawing in ALL the frames, and writes tmp/<name>.mov (ProRes 4444
#      with alpha), at the frame rate of the animation;
#   3. writes tmp/<name>.png, a sheet of 8 frames on a checkerboard;
#   4. prints the URL of the JSON (for `encode.ts --source`).
#
# Options:
#   --size <n>    the size of the render, in pixels, for the longest side of
#                 the animation (default 1024). encode.ts then scales it down
#   --fps <n>     frames per second of the .mov (default: the rate of the
#                 animation)
#   --loops <n>   play the animation n times (default 1)
#   --pad <n>     transparent pixels around the box, in % of the longest
#                 side of the box (default 3). Without a margin the drawing
#                 touches the edges of the video, and encode.ts finds edges
#                 that cut the subject
import argparse, hashlib, json, pathlib, subprocess, sys, urllib.request

from PIL import Image
from rlottie_python import LottieAnimation

ROOT = pathlib.Path(__file__).resolve().parents[2]
TMP = ROOT / "tmp"
SOURCES = TMP / "source"
NOTO = "https://fonts.gstatic.com/s/e/notoemoji/latest/{}/lottie.json"


def resolve(spec):
    """The local path of the JSON, and its URL (None for a local file)."""
    if spec.startswith("noto:"):
        spec = NOTO.format(spec[5:].lower().replace("u+", "").replace(" ", "_"))
    if not spec.startswith(("http://", "https://")):
        path = pathlib.Path(spec)
        if not path.exists():
            sys.exit(f"no file {spec}")
        return path, None
    SOURCES.mkdir(parents=True, exist_ok=True)
    path = SOURCES / f"lottie-{hashlib.sha1(spec.encode()).hexdigest()[:12]}.json"
    if not path.exists():
        with urllib.request.urlopen(spec) as res:
            path.write_bytes(res.read())
    return path, spec


def checker_sheet(frames, path):
    """8 frames next to each other on a checkerboard, to look at the render."""
    picks = [frames[round(i * (len(frames) - 1) / 7)] for i in range(8)] if len(frames) >= 8 else frames
    w, h = picks[0].size
    scale = min(1, 240 / h)
    tw, th = max(1, round(w * scale)), max(1, round(h * scale))
    sheet = Image.new("RGBA", (tw * len(picks), th))
    tile = Image.new("RGBA", (tw, th))
    for y in range(0, th, 8):
        for x in range(0, tw, 8):
            grey = 200 if (x // 8 + y // 8) % 2 else 240
            tile.paste((grey, grey, grey, 255), (x, y, x + 8, y + 8))
    for i, frame in enumerate(picks):
        cell = tile.copy()
        cell.alpha_composite(frame.resize((tw, th), Image.LANCZOS))
        sheet.paste(cell, (i * tw, 0))
    sheet.save(path)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("lottie")
    ap.add_argument("--name", required=True)
    ap.add_argument("--size", type=int, default=1024)
    ap.add_argument("--fps", type=float)
    ap.add_argument("--loops", type=int, default=1)
    ap.add_argument("--pad", type=float, default=3)
    args = ap.parse_args()

    path, url = resolve(args.lottie)
    anim = LottieAnimation.from_file(str(path))
    aw, ah = anim.lottie_animation_get_size()
    total = anim.lottie_animation_get_totalframe()
    rate = anim.lottie_animation_get_framerate()
    scale = args.size / max(aw, ah)
    w, h = max(1, round(aw * scale)), max(1, round(ah * scale))
    fps = args.fps or rate
    # The frames of the .mov, as frame numbers of the animation.
    count = max(1, round(total / rate * fps)) * args.loops
    numbers = [round(i * rate / fps) % total for i in range(count)]

    cache = {}
    for n in set(numbers):
        cache[n] = anim.render_pillow_frame(frame_num=n, width=w, height=h).convert("RGBA")

    # The box that holds the drawing in all the frames.
    box = None
    for img in cache.values():
        b = img.getchannel("A").getbbox()
        if b:
            box = b if box is None else (min(box[0], b[0]), min(box[1], b[1]), max(box[2], b[2]), max(box[3], b[3]))
    if box is None:
        sys.exit("the animation draws nothing")
    # The margin can go out of the render: crop() fills it with transparent
    # pixels.
    p = round(max(box[2] - box[0], box[3] - box[1]) * args.pad / 100)
    box = (box[0] - p, box[1] - p, box[2] + p, box[3] + p)
    # ProRes needs an even width and height.
    bw = (box[2] - box[0] + 1) // 2 * 2
    bh = (box[3] - box[1] + 1) // 2 * 2
    box = (box[0], box[1], box[0] + bw, box[1] + bh)
    frames = [cache[n].crop(box) for n in numbers]

    TMP.mkdir(exist_ok=True)
    mov = TMP / f"{args.name}.mov"
    enc = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba",
         "-s", f"{bw}x{bh}", "-r", str(fps), "-i", "-",
         "-c:v", "prores_ks", "-profile:v", "4444", "-pix_fmt", "yuva444p10le", str(mov)],
        stdin=subprocess.PIPE)
    for frame in frames:
        enc.stdin.write(frame.tobytes())
    enc.stdin.close()
    if enc.wait():
        sys.exit(f"{args.name}: ffmpeg failed")
    sheet = TMP / f"{args.name}.png"
    checker_sheet(frames, sheet)

    print(f"{mov}: {bw}x{bh}, {len(frames)} frames at {fps:g} fps ({len(frames) / fps:.2f} s)")
    print(f"{sheet}: 8 frames on a checkerboard")
    print(f"source: {url or 'none (a local file)'}")


if __name__ == "__main__":
    main()
