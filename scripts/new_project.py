#!/usr/bin/env python3
"""Start a new project from content/projects/_template:

    python3 scripts/new_project.py "Project name"
    python3 scripts/new_project.py "Project name" --slug short-name   # to choose the page's address

Copies the template to content/projects/<slug>/, where <slug> is made from the name unless you
give one. Fills in the title, puts the project last on the home page, and keeps it a draft (off
the site) until you set draft: false.
"""
import argparse
import json
import re
import shutil
import sys
import unicodedata
from pathlib import Path

try:
    import yaml
except ImportError:
    sys.exit("This needs PyYAML. Install it once with: python3 -m pip install --user -r scripts/requirements.txt")

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / "content" / "projects"
TEMPLATE = PROJECTS / "_template"


def slugify(name):
    """"Org Picker 2.0" -> "org-picker-2-0"."""
    plain = unicodedata.normalize("NFKD", name).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", plain.lower()).strip("-")


def yaml_text(s):
    """s as a YAML value: as it is when it reads back the same, otherwise in double quotes."""
    try:
        if yaml.load("k: " + s, Loader=yaml.BaseLoader)["k"] == s:
            return s
    except yaml.YAMLError:
        pass
    return json.dumps(s, ensure_ascii=False)


def next_order():
    """One more than the highest `order` of any project, drafts included."""
    orders = []
    for md in PROJECTS.glob("*/index.md"):
        if not md.parent.name.startswith("_"):
            front = md.read_text(encoding="utf-8-sig").split("\n---", 1)[0]
            orders += [int(n) for n in re.findall(r"^order:[ \t]*[\"']?(\d+)", front, re.M)]
    return max(orders, default=0) + 1


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("name", help='the project\'s title, in quotes: "Redesigning the org picker"')
    parser.add_argument("--slug", help="the page's address, work/<slug>/ (default: made from the name)")
    args = parser.parse_args()

    slug = args.slug or slugify(args.name)
    if not re.match(r"^[a-z0-9]+(-[a-z0-9]+)*$", slug):
        sys.exit("The slug %r won't work as an address. Use lowercase words joined by hyphens, like --slug org-picker." % slug)
    folder = PROJECTS / slug
    if folder.exists():
        sys.exit("content/projects/%s/ already exists. Pick another name, or choose an address with --slug." % slug)

    text = (TEMPLATE / "index.md").read_text(encoding="utf-8")
    front, sep, body = text.partition("\n---\n")
    for key, value in (("title", yaml_text(args.name.strip())), ("order", str(next_order())), ("draft", "true")):
        front, count = re.subn(r"^%s:.*$" % key, lambda m: "%s: %s" % (key, value), front, count=1, flags=re.M)
        if not count:
            sys.exit("content/projects/_template/index.md has no `%s:` line" % key)

    shutil.copytree(TEMPLATE, folder, ignore=shutil.ignore_patterns(".DS_Store"))
    (folder / "index.md").write_text(front + sep + body, encoding="utf-8")

    where = "content/projects/%s/" % slug
    print("Created %sindex.md. It's a draft, so it isn't on the site yet.\n" % where)
    print("Next:")
    print("  1. Write the case study in %sindex.md. The notes in it show how." % where)
    print("  2. Put the images in %s: hero.png (top of the page), card.png (home page card)," % where)
    print("     and the ones the case study shows. PNG or JPEG is fine.")
    print("  3. Set draft: false in index.md.")
    print("  4. Run python3 scripts/optimize_images.py. It compresses the images and rebuilds the site.")
    print("  5. Commit. The page will be at work/%s/." % slug)


if __name__ == "__main__":
    main()
