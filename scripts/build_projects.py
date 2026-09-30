#!/usr/bin/env python3
"""Build the project pages (work/<slug>/index.html) from content/projects.csv.

The CSV has the same columns as the Webflow CMS export, so a fresh export can be
dropped in as-is. Run from anywhere:

    python3 scripts/build_projects.py

Only the Python standard library is used.
"""
import csv
import html
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "content" / "projects.csv"
OUT_DIR = ROOT / "work"
SITE_URL = "https://vinyas.me/"
UP = "../../"  # from work/<slug>/ back to the site root

RESUME = "https://drive.google.com/drive/folders/16NA4Vg2wVpLMmNvJw1I25iqJxJHvULP1?usp=sharing"
SECRET_FOOTER = "for more cool projects, check out my socials maybe"


def esc(s):
    return html.escape(s, quote=True)


def asset(url):
    """Site-relative paths (assets/...) are rewritten for pages two folders deep."""
    return url if re.match(r"^(https?:)?//|^/|^data:", url) else UP + url


def absolute(url):
    return url if re.match(r"^https?://", url) else SITE_URL + url.lstrip("/")


def truthy(v):
    return v.strip().lower() == "true"


def clean_rich_text(src):
    """Turn Webflow's exported rich text into the markup Webflow renders on the live site."""
    h = src
    h = re.sub(r'\s+id=""', "", h)
    h = re.sub(r'\s+data-(?:rt-[a-z-]+|page-url)="[^"]*"', "", h)

    def img(m):
        tag = m.group(0)
        s = re.search(r'\ssrc="([^"]*)"', tag).group(1)
        alt = re.search(r'\salt="([^"]*)"', tag)
        alt = "" if not alt or alt.group(1) == "__wf_reserved_inherit" else alt.group(1)
        return '<img src="%s" loading="lazy" alt="%s">' % (asset(html.unescape(s)).replace('"', "&quot;"), alt)
    h = re.sub(r"<img\b[^>]*>", img, h)

    h = re.sub(r"<iframe\b", '<iframe loading="lazy"', h)
    h = re.sub(r'(<a\b[^>]*target="_blank")', r'\1 rel="noopener"', h)
    h = re.sub(r"<(ul|ol)\b", r'<\1 role="list"', h)
    return h


def section(label, body_html):
    return ('  <div class="project-content-container">\n'
            '    <p class="wavy-underline paragraph">%s</p><p>&nbsp;</p>\n'
            '    <div class="w-richtext">%s</div>\n'
            '  </div>\n') % (label, clean_rich_text(body_html))


def metric(value, label):
    return ('    <div class="card-layout project-metric">'
            '<div class="testimonial-top-content"><div class="testimonial-top-left"></div>'
            '<img class="testimonial-top-right-fold" src="%sassets/img/ui/card-fold.png" alt=""></div>'
            '<div class="testimonial-bottom-content not-really-it-is-a-metric">'
            '<h2 class="heading-4">%s</h2><p class="author-name">%s</p></div></div>\n') % (
        UP, esc(value.replace("‍", "")), esc(label))


def render(p):
    slug = p["Slug"]
    results = truthy(p["results-applicable"])
    page_url = "%swork/%s/" % (SITE_URL, slug)
    hero = p["full-thumbnail"]
    og_image = ROOT / "assets" / "img" / "work" / slug / "og.jpg"
    og = absolute("assets/img/work/%s/og.jpg" % slug) if og_image.exists() else absolute("assets/img/ui/og-image.png")

    parts = []
    parts.append(
        '  <div class="project-hero-container">\n'
        '    <div class="project-hero-text"><h1 class="project-heading">%s</h1><p class="project-hero-description">%s</p></div>\n'
        '    <div class="project-hero-image-container"><img class="project-hero-image" src="%s" alt="" fetchpriority="high"></div>\n'
        '  </div>\n' % (esc(p["Heading"]), esc(p["description"]), esc(asset(hero))))
    parts.append(
        '  <div class="project-content-container"><div class="project-meta-flex">\n'
        '    <div class="project-meta-individual"><p>Client:</p><p>%s</p></div>\n'
        '    <div class="project-meta-individual"><p>Timeline:</p><p>%s</p></div>\n'
        '    <div class="project-meta-individual"><p>Team:</p><p>%s</p></div>\n'
        '  </div></div>\n' % (esc(p["org"]), esc(p["timeline"]), esc(p["team"])))
    parts.append(
        '  <div class="project-content-container">\n'
        '    <p class="wavy-underline paragraph">Overview</p><p>&nbsp;</p>\n'
        '    <h1 class="project-goal">The goal</h1><p>%s</p>\n'
        '%s'
        '  </div>\n' % (esc(p["goal"]),
                        '    <p>&nbsp;</p><p>&nbsp;</p><p class="wavy-underline paragraph">Results</p>\n' if results else ""))
    if results:
        parts.append('  <div class="project-content-container results">\n%s  </div>\n' % "".join(
            metric(p["m%d-heading" % i], p["m%d-desc" % i]) for i in (1, 2, 3)))
    if truthy(p["research-applicable"]):
        parts.append(section("Process", p["research"]))
    if truthy(p["final-solution-applicable"]):
        parts.append(section("Final solution", p["final-solution"]))
    if truthy(p["extras-applicable"]):
        parts.append(section("Extras", p["extras"]))

    return TEMPLATE.format(
        up=UP, title="Vinyas Pandey", og_title=esc(p["Heading"]), description=esc(p["description"]),
        url=page_url, og_image=og, resume=RESUME, content="".join(parts), secret=SECRET_FOOTER)


TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<!-- Generated by scripts/build_projects.py from content/projects.csv. Edit those, not this file. -->
<title>{title}</title>
<meta name="description" content="{description}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Vinyas Pandey">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{og_image}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{og_title}">
<meta name="twitter:description" content="{description}">
<meta name="twitter:image" content="{og_image}">
<link rel="canonical" href="{url}">
<link rel="icon" type="image/png" href="{up}assets/img/ui/favicon.png">
<link rel="apple-touch-icon" href="{up}assets/img/ui/webclip.png">
<link rel="stylesheet" href="{up}assets/css/site.css">
</head>
<body>

<!-- Fixed red frame -->
<div class="rounded-border-top"></div><div class="rounded-border-left"></div><div class="rounded-border-right"></div><div class="rounded-border-bottom"></div>
<div class="rounded-corner rc-tl"></div><div class="rounded-corner rc-tr"></div><div class="rounded-corner rc-bl"></div><div class="rounded-corner rc-br"></div>

<!-- Navbar -->
<header class="navbar-container" id="navbarContainer">
  <nav class="navbar" aria-label="Main">
    <div class="navbar-profile-image">
      <button class="navbar-profile-images-container" id="profileStack" type="button" aria-label="Show another photo of Vinyas">
        <img class="profile-image pi-2" data-order="3" src="{up}assets/img/profile/photo-4.avif" alt="">
        <img class="profile-image pi-3" data-order="2" src="{up}assets/img/profile/photo-3.avif" alt="">
        <img class="profile-image pi-4" data-order="1" src="{up}assets/img/profile/photo-2.avif" alt="">
        <img class="profile-image pi-1" data-order="0" src="{up}assets/img/profile/photo-1.avif" alt="">
      </button>
    </div>
    <div class="navbar-controls">
      <a href="{up}" class="navbar-control-link">HOME</a>
      <a href="{up}about/" class="navbar-control-link">ABOUT</a>
      <a href="{resume}" target="_blank" rel="noopener" class="navbar-control-link">RESUME</a>
      <div class="navbar-glow-container" aria-hidden="true">
        <div class="navbar-glow-divs" id="navGlow"><div class="navbar-glow glow-1"></div><div class="navbar-glow glow-2"></div></div>
      </div>
    </div>
  </nav>
</header>

<main class="page-container project-page" id="top">
{content}
  <!-- Footer -->
  <footer class="footer-container">
    <div class="footer-header-text">
      <h1 class="footer-heading"><span class="bon-vivant-style">Fascinated ?</span> &nbsp;Let's connect.</h1>
      <span class="crop-mark crop-mark-top-right"></span><span class="crop-mark crop-mark-top-left"></span>
    </div>
    <div class="footer-actions-row" id="footerRows"></div>
    <div class="last-signature-container">
      <p>Vinyas Pandey</p>
      <div class="footer-signature-right"><p class="paragraph-bon-vivant-style">Portfolio</p><p>2025</p></div>
    </div>
  </footer>
</main>

<div class="secret-footer-container" aria-hidden="true">
  <div class="sf-corner sf-top-right"></div><div class="sf-corner sf-top-left"></div>
  <h2 class="bon-vivant-style sf-easter-egg-text">{secret}</h2>
</div>

<script src="{up}assets/js/about.js"></script>
</body>
</html>
"""


def main():
    with open(CSV_PATH, encoding="utf-8-sig", newline="") as f:
        rows = [r for r in csv.DictReader(f) if not truthy(r["Archived"]) and not truthy(r["Draft"])]
    rows.sort(key=lambda r: int(r["order"] or 0))

    # Remove generated pages for projects that are no longer in the CSV
    keep = {r["Slug"] for r in rows}
    if OUT_DIR.exists():
        for d in OUT_DIR.iterdir():
            page = d / "index.html"
            if d.is_dir() and d.name not in keep and page.exists() and "Generated by scripts/build_projects.py" in page.read_text(encoding="utf-8"):
                shutil.rmtree(d)
                print("removed", d.relative_to(ROOT))

    for r in rows:
        out = OUT_DIR / r["Slug"] / "index.html"
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_text(render(r), encoding="utf-8")
        print("built", out.relative_to(ROOT))


if __name__ == "__main__":
    main()
