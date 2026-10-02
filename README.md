# Vinyas Pandey — portfolio

Plain HTML site, published with GitHub Pages. Every commit to `main` goes live in about a minute.

The pages are built from a few source files by one script. You edit `src/` and `content/`, run the build, and commit everything.

The scripts need three Python packages (Markdown, PyYAML and Pillow). Install them once, into a `.venv` folder in the project (git ignores it):

```bash
python3 -m venv .venv
```

```bash
.venv/bin/python -m pip install -r scripts/requirements.txt
```

Then run the scripts with that Python, `.venv/bin/python` (on Windows, `.venv\Scripts\python`). After each change:

```bash
.venv/bin/python scripts/build.py
```

If you'd rather type `python3`, run `source .venv/bin/activate` once in each new terminal window first.

## What's where

| Path | Contains |
|---|---|
| `src/layout.html` | The shell every page shares: `<head>`, red frame, navbar, footer |
| `src/pages/home.html`, `src/pages/about.html` | The home and about page content |
| `src/project.html` | The layout of a project page |
| `content/site.json` | Name, age, navbar links (incl. resume), footer links |
| `content/projects/<slug>/` | One folder per project: its `index.md` (its page **and** its card on the home page) and its images |
| `content/projects/_template/` | What a new project starts from |
| `content/logos.csv` | The previous-workplaces logo carousel |
| `assets/css/site.css` | All styles |
| `assets/js/home.js` | Home page interactions |
| `assets/js/about.js` | About and project page interactions |
| `assets/img/` | The other images, grouped by where they appear |
| `index.html`, `about/`, `work/`, `sitemap.xml` | **Generated** by the build. Don't edit these; your changes would be overwritten. |
| `scripts/` | `build.py` (builds the pages), `new_project.py` (starts a project), `optimize_images.py` (compresses images), `check_site.py` (finds broken links) |

In the source files, write paths from the site root (`assets/img/…`, `about/`). The build fixes them up for each page. It also adds `width`/`height` to any image that doesn't have them. In a project's `index.md`, an image's bare file name (`screen.avif`) means the file in that project's folder.

## Making a change

| To change | Do this, then build |
|---|---|
| Home or about page text | Edit `src/pages/home.html` or `src/pages/about.html` |
| Navbar, footer, `<head>` | Edit `src/layout.html` (one place for every page) |
| Footer or navbar links, resume link | Edit `links` or `nav` in `content/site.json` |
| Age | `age` in `content/site.json`. The footer year updates on its own. |
| A project's page or card | Edit its `content/projects/<slug>/index.md` |
| An image | Replace the file (same name), then run the image optimizer (below) |

## Adding a project

1. Run `.venv/bin/python scripts/new_project.py "Project name"`. It makes `content/projects/<slug>/` from the template, as a draft.
2. Write `index.md` and drop the images in the folder: `hero.png` for the top of the page, `card.png` for the home page card, and the ones the case study shows (any PNG/JPEG/AVIF).
3. Set `draft: false`.
4. Run `.venv/bin/python scripts/optimize_images.py`. It compresses the new images, points `index.md` at the `.avif` files it makes, and rebuilds the site.
5. Commit.

The home page card, the project page, the sitemap and the carousel's scroll length all come from that one folder. Its name is the page's address, `work/<slug>/`. Set `draft: true` or `archived: true` to take a project down; its page and card both go.

### What goes in index.md

The settings go at the top, between two `---` lines. If a value contains `: ` or ` #`, put it in "double quotes".

- `title`, `description`: the card's and page's title and intro. The description is also the text of link previews.
- `order`: position on the home page and in the sitemap (1 is first).
- `tags`: the card's two tags, like `[Product Design, Content Discovery]`.
- `client`, `timeline`, `team`, `goal`: the top of the project page.
- `results`: the three result cards, one `- [80%, flow completion rate]` line each. Leave it out for none.
- `draft`, `archived`: `true` leaves the project out.
- `hero`, `card`: only needed when the images aren't called `hero.*` and `card.*`.

Below them is the case study, in Markdown:

- `# Process`, `# Final solution` and `# Extras` start its three sections, in that order. A section that isn't there isn't shown.
- Inside a section, `##` starts a heading and `###` a smaller one.
- An image on a line of its own becomes a full-width figure: `![What the image shows](screen.avif)`. Add `{.center}` straight after it for a narrower, centred one.
- A YouTube link on a line of its own becomes a video: `https://youtu.be/<id> "Title of the video"`, with `{.center}` for a narrower one.
- Paragraphs sit close together, as on the other pages. For more space, put `&nbsp;` on a line of its own.
- HTML works too, as it is. The existing projects are written in HTML, one element per line.
- `<!-- notes -->` aren't shown on the page.

A link-preview image can go in the folder as `og.jpg` (1200×675). Without one, the site's default is used.

## Adding a logo

Put the logo in `assets/img/logos/`, then add a line to `content/logos.csv`:

```csv
file,name,height
new-company.png,New Company,40
```

`name` is what screen readers announce. `height` is how tall it shows, in px (the others are 27–48, so they look balanced). Then run `.venv/bin/python scripts/optimize_images.py`. The loop gets longer, not faster: the speed stays at 99 px/s. The row repeats itself if there are only a few logos.

## Images

`scripts/optimize_images.py` works on macOS, Windows and Linux. After adding or replacing images, run:

```bash
.venv/bin/python scripts/optimize_images.py
```

It handles every image in `assets/img` and `content/projects`. It scales each one down to twice the largest size it's shown at (see `RULES` at the top of the script), turns PNG/JPEG into AVIF (and updates whatever points at them), and strips camera and GPS metadata. Images it has already done are listed in `scripts/optimized-images.json`, so it only touches new or replaced ones. GIFs and animated images are left alone. Link-preview images and icons keep their format.

## Checks

Every push and pull request runs `.github/workflows/checks.yml`. It fails if:

- the generated pages don't match `src/` and `content/`, meaning someone forgot to run the build or edited a generated file
- an image hasn't been through the optimizer
- a page points at a file that doesn't exist

Case-study images without alt text and unused images show up as warnings. `.github/workflows/links.yml` checks links to other sites every Monday and emails you if any break.

To run the same checks yourself:

```bash
.venv/bin/python scripts/check_site.py
```

The footer year comes from the date of the build. In January, the first check of the year will ask for a rebuild. Run the build and commit.

To preview the site locally, run `python3 -m http.server` in this folder and open http://localhost:8000.
