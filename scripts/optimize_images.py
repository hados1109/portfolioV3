#!/usr/bin/env python3
"""Compress the project page images listed in content/projects.csv (macOS only: uses the built-in `sips`).

Each image is scaled down to twice the largest size it is ever shown at (sharp on retina
screens, nothing wasted beyond that) and saved as AVIF at quality 75. PNG/JPEG files are
replaced by the .avif and the CSV is updated to point at it. A file is only replaced when
the result is smaller. GIFs are left alone.

    python3 scripts/optimize_images.py      # then: python3 scripts/build_projects.py
"""
import csv
import io
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "content" / "projects.csv"
QUALITY = "75"
# Largest display width in CSS px (desktop layout), doubled for 2x screens
MAX_WIDTH = {"hero": 1040 * 2, "fullwidth": 934 * 2, "center": 560 * 2}


def width_of(path):
    out = subprocess.run(["sips", "-g", "pixelWidth", str(path)], capture_output=True, text=True, check=True).stdout
    return int(re.search(r"pixelWidth: (\d+)", out).group(1))


def optimize(rel, cap):
    src = ROOT / rel
    if not src.exists() or src.suffix.lower() not in (".png", ".jpg", ".jpeg", ".avif"):
        return rel
    dst = src.with_suffix(".avif")
    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp) / ("in" + src.suffix)
        cmd = ["sips", str(src), "--out", str(work)]
        if width_of(src) > cap:
            cmd[1:1] = ["--resampleWidth", str(cap)]
        elif src.suffix.lower() == ".avif":
            return rel  # already AVIF and not oversized: re-encoding would only lose quality
        subprocess.run(cmd, capture_output=True, check=True)
        out = Path(tmp) / "out.avif"
        subprocess.run(["sips", "-s", "format", "avif", "-s", "formatOptions", QUALITY, str(work), "--out", str(out)],
                       capture_output=True, check=True)
        if out.stat().st_size >= src.stat().st_size:
            return rel
        before = src.stat().st_size
        out.replace(dst)
    if src != dst:
        src.unlink()
    print("%-70s %6d KB -> %5d KB" % (rel, before // 1024, dst.stat().st_size // 1024))
    return str(dst.relative_to(ROOT))


def main():
    text = CSV_PATH.read_text(encoding="utf-8")
    rows = list(csv.DictReader(io.StringIO(text)))
    caps = {}
    for r in rows:
        caps[r["full-thumbnail"]] = MAX_WIDTH["hero"]
        for k in ("research", "final-solution", "extras"):
            for fig in re.findall(r"<figure\b.*?</figure>", r[k], re.S):
                kind = "center" if "align-center" in fig else "fullwidth"
                for s in re.findall(r'<img[^>]*src="([^"]+)"', fig):
                    caps[s] = max(caps.get(s, 0), MAX_WIDTH[kind])
    for rel, cap in caps.items():
        if rel.startswith("assets/"):
            new = optimize(rel, cap)
            if new != rel:
                text = text.replace(rel, new)
    CSV_PATH.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
