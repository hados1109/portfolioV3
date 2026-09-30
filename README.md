# Vinyas Pandey — portfolio

Plain HTML site, published with GitHub Pages. Every commit to `main` goes live in about a minute.

## What's where

| Path | Contains |
|---|---|
| `index.html` | Landing page |
| `about/index.html` | About page |
| `work/<project>/index.html` | Project pages — generated, don't edit by hand (see below) |
| `content/projects.csv` | All project page content (same columns as the Webflow CMS export) |
| `scripts/build_projects.py` | Turns `content/projects.csv` into the project pages |
| `assets/css/site.css` | All styles, shared by every page |
| `assets/js/home.js` | Landing page interactions and the project cards' text |
| `assets/js/about.js` | About and project page interactions |
| `assets/img/` | Images, grouped by where they appear (`assets/img/work/<project>/` for project pages) |
| `assets/fonts/` | Bon Vivant and Helvetica Neue |

## Making a change

| To change | Do this |
|---|---|
| Page text | Open `index.html` or `about/index.html`, click the pencil icon, edit, then **Commit changes** |
| Project cards | Edit the `PROJECTS` list near the top of `assets/js/home.js` |
| A project page | Edit its row in `content/projects.csv`, then rebuild (below) |
| An image | Upload a new file with the **same name** into the same `assets/img/` folder |
| Footer links | Edit the `LINKS` list in `assets/js/home.js` and `assets/js/about.js` |

## Project pages

Each row of `content/projects.csv` becomes a page at `work/<Slug>/`. The columns work like the Webflow CMS fields:

- `Heading`, `description`, `full-thumbnail`, `org`, `timeline`, `team`, `goal` fill the top of the page.
- `m1-heading` … `m3-desc` are the three result cards, shown when `results-applicable` is `true`.
- `research`, `final-solution` and `extras` are rich text (HTML) for the Process, Final solution and Extras sections, each shown when its `-applicable` column is `true`.
- Rows with `Archived` or `Draft` set to `true` are skipped. `order` sets the order.

Images can be a full URL or a path from the site root, like `assets/img/work/msdc-2022/cover.avif`.

After editing the CSV (a spreadsheet app like Numbers or Google Sheets works; keep it as CSV), rebuild and commit:

```bash
python3 scripts/build_projects.py
```

A new project also needs a card: add it to `PROJECTS` in `assets/js/home.js` with `href:"work/<Slug>/"`.
