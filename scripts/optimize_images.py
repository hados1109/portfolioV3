#!/usr/bin/env python3
"""Compress every image in assets/img and content/projects. Works on macOS, Windows and Linux.

    python3 -m pip install --user -r scripts/requirements.txt   # once
    python3 scripts/optimize_images.py          # compresses new or changed images, then rebuilds the pages
    python3 scripts/optimize_images.py --check  # lists images that still need it (used by CI; no install needed)

For each new or changed image it:
- scales it down to twice the largest size it is ever shown at (sharp on retina screens), per RULES
- turns PNG/JPEG into AVIF, and points every reference in src/, content/, assets/css and assets/js at the
  new file, including the bare file names in a project's index.md
- keeps the format where it has to stay (link-preview images, icons), and only compresses those
- removes hidden metadata such as camera details and GPS location
- keeps the result only when it is smaller
GIFs and animated images are left alone.

Images it has handled are recorded in scripts/optimized-images.json by their path in the repo, so
running it again only touches images you've added or replaced since.
"""
import argparse
import fnmatch
import hashlib
import io
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / "content" / "projects"
IMAGE_DIRS = [ROOT / "assets" / "img", PROJECTS]
MANIFEST = ROOT / "scripts" / "optimized-images.json"
# Text files that can refer to images, updated when an image becomes .avif
REFERENCE_GLOBS = ["src/**/*.html", "content/*.csv", "content/*.json", "content/**/*.md", "assets/css/*.css", "assets/js/*.js"]
REFERENCE_END = r"(?=[\"')>\s,?#{]|$)"  # what can come after an image path in those files

AVIF_QUALITY = 75  # 0-100; 75 is visually lossless for these images
AVIF_SPEED = 4     # 0 (smallest files, slowest) to 10 (fastest)
JPEG_QUALITY = 85

# First match wins. Paths are from the repo root. Sizes are 2x the largest size on screen,
# measured at every breakpoint; None means no limit. `convert` turns PNG/JPEG into AVIF.
RULES = [
    # (pattern,                     max width, max height, convert)
    ("assets/img/ui/og-image.png",    1200, None, False),  # link previews: social sites don't read AVIF
    ("content/projects/*/og.jpg",     1200, None, False),
    ("assets/img/ui/webclip.png",      180,  180, False),  # home-screen icon: Apple wants a 180px PNG
    ("assets/img/ui/favicon.png",     None, None, False),
    ("assets/img/ui/*",               None, None, False),  # small interface graphics used by the CSS
    ("assets/img/logos/*",            None,  100, True),   # shown up to 48px tall
    ("assets/img/glance/*",           None,  720, True),   # rows are 360px tall
    ("assets/img/profile/*",            96, None, True),   # navbar photo, 48px
    ("assets/img/testimonials/*",       80, None, True),   # 40px
    ("assets/img/meta/*",               44, None, True),   # 22px
    ("assets/img/hover/*",             660, None, True),   # cursor images, up to 330px
    ("assets/img/about/*",            1400, None, True),   # up to 686px wide on tablets
    ("content/projects/*/hero.*",     2080, None, True),   # project hero, 1040px
    ("content/projects/*/card.*",     1400, None, True),   # home cards, up to 686px wide on tablets
    ("content/projects/*",            1868, None, True),   # case-study images, 934px ({.center} ones: 1120, from index.md)
    ("*",                             2000, None, True),
]
CENTER_WIDTH = 1120  # images with {.center}, or in an align-center figure, are shown at most 560px wide


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()[:16]


def load_manifest():
    return json.loads(MANIFEST.read_text(encoding="utf-8")) if MANIFEST.exists() else {}


def save_manifest(manifest):
    MANIFEST.write_text(json.dumps(dict(sorted(manifest.items())), indent=1) + "\n", encoding="utf-8")


def images():
    exts = {".avif", ".png", ".jpg", ".jpeg", ".gif", ".webp"}
    return sorted(p for d in IMAGE_DIRS for p in d.rglob("*") if p.is_file() and p.suffix.lower() in exts)


def rel(path):
    return path.relative_to(ROOT).as_posix()


def rule_for(r):
    for pattern, max_w, max_h, convert in RULES:
        if fnmatch.fnmatch(r, pattern):
            return max_w, max_h, convert
    return None, None, False


def centered_images():
    """Case-study images shown narrower: ![…](file){.center} in a project's index.md, or <img> in an align-center figure."""
    out = set()
    for md in sorted(PROJECTS.glob("*/index.md")):
        text = md.read_text(encoding="utf-8")
        names = re.findall(r'!\[[^\]]*\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)\s*\{:?\s*\.center\s*\}', text)
        for fig in re.findall(r"<figure\b.*?</figure>", text, re.S):
            if "align-center" in fig:
                names += re.findall(r'<img[^>]*\ssrc="([^"]+)"', fig)
        # a bare file name is in the project's folder; anything else is a path from the site root
        out.update(n if "/" in n else rel(md.parent / n) for n in names)
    return out


def fit(w, h, max_w, max_h):
    scale = min(1.0, (max_w or w) / w, (max_h or h) / h)
    return (w, h) if scale >= 1 else (max(1, round(w * scale)), max(1, round(h * scale)))


def encode(im, fmt, icc):
    from PIL import Image
    buf = io.BytesIO()
    extra = {"icc_profile": icc} if icc else {}
    if fmt == "AVIF":
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() or im.mode == "P" else "RGB")
        im.save(buf, "AVIF", quality=AVIF_QUALITY, speed=AVIF_SPEED, **extra)
    elif fmt == "JPEG":
        im.convert("RGB").save(buf, "JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True, **extra)
    else:
        if im.mode not in ("RGB", "RGBA", "P", "L", "LA"):
            im = im.convert("RGBA")
        im.save(buf, "PNG", optimize=True, **extra)
    return buf.getvalue()


def update_references(old, new):
    """Point every reference to the image `old` at `new` (both paths from the repo root). Images in
    assets/img are referred to by any path ending in img/<path>, the CSS's ../img/ included; a
    project's images by their full path, or in that project's index.md by their bare file name."""
    img = "assets/img/"
    if old.startswith(img):
        replace_in(REFERENCE_GLOBS, r"(?<=img/)" + re.escape(old[len(img):]), new[len(img):])
    else:
        replace_in(REFERENCE_GLOBS, r"(?<![\w.-])" + re.escape(old), new)
    folder, name = old.rsplit("/", 1)
    if (ROOT / folder).parent == PROJECTS:
        replace_in([folder + "/index.md"], r"(?<=[\s\"'(<])" + re.escape(name), new.rsplit("/", 1)[1])


def replace_in(globs, pattern, new):
    pattern = re.compile(pattern + REFERENCE_END, re.M)
    for path in sorted({p for glob in globs for p in ROOT.glob(glob)}):
        text = path.read_text(encoding="utf-8")
        updated = pattern.sub(lambda m: new, text)
        if updated != text:
            path.write_text(updated, encoding="utf-8")
            print("    updated", path.relative_to(ROOT).as_posix())


def optimize(path, cap_override):
    """Compress one image in place. Returns the path it ends up at."""
    from PIL import Image, ImageOps
    r = rel(path)
    max_w, max_h, convert = rule_for(r)
    if cap_override:
        max_w = min(max_w or cap_override, cap_override)
    with Image.open(path) as im:
        if path.suffix.lower() == ".gif" or getattr(im, "is_animated", False):
            return path  # animations stay as they are
        fmt = "JPEG" if im.format == "MPO" else im.format  # MPO: iPhone JPEGs
        im = ImageOps.exif_transpose(im)  # phone photos: apply the rotation before metadata is dropped
        icc = im.info.get("icc_profile")
        size = fit(im.width, im.height, max_w, max_h)
        target = "AVIF" if convert and fmt in ("PNG", "JPEG", "WEBP") else fmt
        if target not in ("AVIF", "JPEG", "PNG"):
            return path
        if target == fmt and fmt in ("AVIF", "JPEG") and size[0] > im.width * 0.92:
            return path  # right format and (nearly) the right size: re-encoding would only lose quality
        resize = size != (im.width, im.height)
        if resize:
            im = im.resize(size, Image.LANCZOS)
        # Usually AVIF wins; for flat graphics a PNG can be smaller, so try both and keep the smaller
        options = [(encode(im, target, icc), target)]
        if target != fmt:
            options.append((encode(im, fmt, icc), fmt))
        data, target = min(options, key=lambda o: len(o[0]))

    before = path.stat().st_size
    if len(data) > before * (1 if resize else 0.9):
        return path  # not worth it: keep the original
    dst = path.with_suffix(".avif") if target == "AVIF" else path
    dst.write_bytes(data)
    if dst != path:
        path.unlink()
        update_references(r, rel(dst))
    print("%-60s %6.0f KB -> %5.0f KB%s" % (r, before / 1024, len(data) / 1024, "  (%dx%d)" % size if resize else ""))
    return dst


def check():
    manifest = load_manifest()
    pending = [rel(p) for p in images() if manifest.get(rel(p)) != sha(p)]
    if pending:
        print("These images haven't been optimized yet. Run: python3 scripts/optimize_images.py")
        for r in pending:
            print("  " + r)
            if "GITHUB_ACTIONS" in os.environ:
                print("::error file=%s::Not optimized. Run python3 scripts/optimize_images.py and commit the result." % r)
        return 1
    print("All %d images are optimized." % len(manifest))
    return 0


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--check", action="store_true", help="only report images that need optimizing")
    parser.add_argument("--no-build", action="store_true", help="don't rebuild the pages afterwards")
    args = parser.parse_args()
    if args.check:
        sys.exit(check())

    try:
        from PIL import features
    except ImportError:
        sys.exit("Pillow isn't installed. Run: python3 -m pip install --user -r scripts/requirements.txt")
    if not features.check("avif"):
        sys.exit("This Pillow can't write AVIF. Run: python3 -m pip install --user --upgrade -r scripts/requirements.txt")

    manifest = load_manifest()
    centered = centered_images()
    for path in images():
        r = rel(path)
        if not path.exists() or manifest.get(r) == sha(path):
            continue
        new = optimize(path, CENTER_WIDTH if r in centered else None)
        if new != path:
            manifest.pop(r, None)
        manifest[rel(new)] = sha(new)
    # forget images that were deleted
    for r in [r for r in manifest if not (ROOT / r).exists()]:
        del manifest[r]
    save_manifest(manifest)

    if not args.no_build:
        sys.path.insert(0, str(ROOT / "scripts"))
        import build
        build.main()


if __name__ == "__main__":
    main()
