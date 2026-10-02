# Vinyas Pandey — portfolio

Plain HTML site, published with GitHub Pages. Every commit to `main` goes live in about a minute.

The pages are built from a few source files by one script. You edit `src/` and `content/`, run the build, and commit everything.

```bash
python3 scripts/build.py
```

## What's where

| Path | Contains |
|---|---|
| `src/layout.html` | The shell every page shares: `<head>`, red frame, navbar, footer |
| `src/pages/home.html`, `src/pages/about.html` | The home and about page content |
| `src/project.html` | The layout of a project page |
| `content/site.json` | Name, age, navbar links (incl. resume), footer links |
| `content/projects.csv` | Every project: its page **and** its card on the home page |
| `content/logos.csv` | The previous-workplaces logo carousel |
| `assets/css/site.css` | All styles |
| `assets/js/home.js` | Home page interactions |
| `assets/js/about.js` | About and project page interactions |
| `assets/img/` | Images, grouped by where they appear (`assets/img/work/<project>/` for project pages) |
| `index.html`, `about/`, `work/`, `sitemap.xml` | **Generated** by the build. Don't edit these; your changes would be overwritten. |
| `scripts/` | `build.py` (builds the pages), `optimize_images.py` (compresses images), `check_site.py` (finds broken links) |

In the source files, write paths from the site root (`assets/img/…`, `about/`). The build fixes them up for each page. It also adds `width`/`height` to any image that doesn't have them.

## Making a change

| To change | Do this, then build |
|---|---|
| Home or about page text | Edit `src/pages/home.html` or `src/pages/about.html` |
| Navbar, footer, `<head>` | Edit `src/layout.html` (one place for every page) |
| Footer or navbar links, resume link | Edit `links` or `nav` in `content/site.json` |
| Age | `age` in `content/site.json`. The footer year updates on its own. |
| A project's page or card | Edit its row in `content/projects.csv` |
| An image | Replace the file in `assets/img/` (same name), then run the image optimizer (below) |

## Adding a project

1. Put the images in `assets/img/work/<slug>/` (any PNG/JPEG/AVIF). Put the card image in `assets/img/projects/<slug>.png`.
2. Add a row to `content/projects.csv`. A spreadsheet app works; keep it as CSV. Copying an existing row is the easiest start.
3. Run `python3 scripts/optimize_images.py`. It compresses the new images, points the CSV at the `.avif` files it makes, and rebuilds the site.
4. Commit.

The home page card, the project page, the sitemap and the carousel's scroll length all come from that one row. Set `Draft` or `Archived` to `true` to take a project down; its page and card both go.

The columns:

- `Slug`: the page's address, `work/<Slug>/`. Lowercase words and hyphens.
- `order`: position on the home page and in the sitemap (1 is first).
- `Heading`, `description`: the card's and page's title and intro.
- `home-thumbnail`, `attribute-1`, `attribute-2`: the card's image and its two tags.
- `full-thumbnail`, `org`, `timeline`, `team`, `goal`: the top of the project page.
- `m1-heading` … `m3-desc`: the three result cards, shown when `results-applicable` is `true`.
- `research`, `final-solution`, `extras`: rich text (HTML) for the Process, Final solution and Extras sections. Each is shown when its `-applicable` column is `true`.
  Images go in a figure: `<figure class="figure-image align-full"><div><img src="assets/img/work/…" alt="What the image shows"></div></figure>`. Use `align-center` for a narrower, centred image. YouTube videos use `figure-video` with an `<iframe>` inside the `<div>`; copy an existing one.
- `Archived`, `Draft`: `true` leaves the project out.

A link-preview image can go at `assets/img/work/<slug>/og.jpg` (1200×675). Without one, the site's default is used.

## Adding a logo

Put the logo in `assets/img/logos/`, then add a line to `content/logos.csv`:

```csv
file,name,height
new-company.png,New Company,40
```

`name` is what screen readers announce. `height` is how tall it shows, in px (the others are 27–48, so they look balanced). Then run `python3 scripts/optimize_images.py`. The loop gets longer, not faster: the speed stays at 99 px/s. The row repeats itself if there are only a few logos.

## Images

`scripts/optimize_images.py` works on macOS, Windows and Linux. Install its one dependency once:

```bash
python3 -m pip install --user -r scripts/requirements.txt
```

Then, after adding or replacing images:

```bash
python3 scripts/optimize_images.py
```

It handles every image in `assets/img`. It scales each one down to twice the largest size it's shown at (see `RULES` at the top of the script), turns PNG/JPEG into AVIF, and strips camera and GPS metadata. Images it has already done are listed in `scripts/optimized-images.json`, so it only touches new or replaced ones. GIFs and animated images are left alone. Link-preview images and icons keep their format.

## Checks

Every push and pull request runs `.github/workflows/checks.yml`. It fails if:

- the generated pages don't match `src/` and `content/`, meaning someone forgot to run the build or edited a generated file
- an image hasn't been through the optimizer
- a page points at a file that doesn't exist

Case-study images without alt text and unused images show up as warnings. `.github/workflows/links.yml` checks links to other sites every Monday and emails you if any break.

To run the same checks yourself:

```bash
python3 scripts/check_site.py
```

The footer year comes from the date of the build. In January, the first check of the year will ask for a rebuild. Run the build and commit.

To preview the site locally, run `python3 -m http.server` in this folder and open http://localhost:8000.
