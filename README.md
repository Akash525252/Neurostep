# NEUROSTEP Website

A static HTML/CSS/JS marketing website for NEUROSTEP Spinal Cord and Neuro
Rehabilitation Center (Dehradun). No frameworks, no build tools required to
run — it's plain HTML/CSS/JS that works by opening a file in a browser or
hosting on GitHub Pages.

## 1. Preview it locally

Because the site uses `fetch`-free, plain `<script>`/`<link>` includes, you
can just open any `.html` file directly in a browser. For the closest match
to how it'll behave once deployed (and to avoid any local file:// quirks),
run a simple local server from the project folder instead:

```bash
# Python 3 (most systems already have this)
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```

or, if you have Node.js installed:

```bash
npx serve .
```

## 2. Project structure

```
neurostep-site/
├── index.html, about.html, services.html, ...   ← FINAL built pages (open these)
├── css/style.css                                  ← one shared stylesheet
├── js/main.js                                     ← one shared script
├── images/                                         ← photo folders (see below)
├── sitemap.xml
├── robots.txt
├── partials/            ← SOURCE: header, footer, popup, floating buttons
├── pages/                ← SOURCE: per-page body content (edit these, not the built HTML)
├── meta.json             ← per-page <title>/description used by the build script
└── build.py              ← re-assembles partials + pages/ into the final HTML files
```

**Where to make edits:** don't hand-edit the built HTML files at the project
root (e.g. `index.html`) directly if you want the change to survive a
rebuild — edit the matching file in `partials/` (for the header, footer,
popup, or floating buttons) or `pages/` (for a specific page's content),
then re-run:

```bash
python3 build.py
```

This regenerates every page from the shared parts in one pass, so the header,
footer, WhatsApp button, and popup only ever need to be changed once.

## 3. Content that still needs real client input before launch

Search the project for the text `Client input needed` — every instance marks
a spot where we intentionally used a placeholder instead of inventing a
fact, name, or number. As of this build, that includes:

- **Team page (`pages/about.html`)** — real therapist names, PT/OT
  qualifications, years of experience, and specialisations (who handles
  spinal cord injury vs. stroke vs. pediatric cases).
- **Photos** — every image slot across the site (hero shots, hydrotherapy
  pool, equipment, therapy sessions, exterior, team) is a labeled
  placeholder. See `images/` for the folder structure to drop real photos
  into (`images/facility`, `images/equipment`, `images/therapy`,
  `images/hydrotherapy`, `images/team`, `images/blog`).
- **Pricing & insurance (`pages/contact.html` FAQ)** — session/program cost
  ranges and accepted insurance plans, if any.
- **Founding story (`pages/about.html`)** — founder background and the
  year the clinic opened.
- **Google review screenshot** — `pages/about.html` and
  `pages/testimonials.html` both have a slot for a real, embedded
  screenshot of the Google Business Profile rating.
- **Video testimonials** — placeholder slots on `pages/testimonials.html`,
  pending patient consent.

Once real photos are ready, replace each `<div class="ph">` /
`.hero-photo-slot` / `.imgslot` placeholder with an `<img>` tag pointing at
the corresponding file in `images/`, then re-run `python3 build.py`.

## 4. Upgrading the WhatsApp flow later

Right now, every WhatsApp button on the site is a simple `wa.me` click-to-chat
link (see `initWhatsAppLinks()` in `js/main.js` — one place to edit the phone
number or default message for the whole site). The appointment form
(`pages/contact.html`) and the popup form (`partials/popup.html`) currently
just show an on-screen confirmation.

To upgrade to WhatsApp marketing automation later (e.g. Interakt, WATI, or
AiSensy):

1. Replace the placeholder `submit` handlers in `js/main.js`
   (`initContactForm` and the popup's form listener in `initPopup`) with a
   `fetch()` call to your chosen provider's API or webhook endpoint.
2. Both forms already collect name + phone (the minimum most WhatsApp API
   tools need to start a conversation), so no markup changes should be
   required — just the submission logic.
3. Because the WhatsApp buttons already use standard `wa.me` links, you can
   swap them for your provider's tracked links later without touching the
   rest of the page.

## 5. Deploying to GitHub Pages

**⚠️ Common mistake to avoid:** GitHub's web "Add file → Upload files"
button often *flattens* subfolders when you drag files from inside a folder
straight into the browser — every file lands in the repo root and all the
relative `css/`, `js/`, and `images/` paths break. Use one of these instead:

- **Option A — Zip upload:** if your Git host/version offers "unzip on
  upload," upload the whole project as a single `.zip` rather than dragging
  individual files.
- **Option B — GitHub Desktop (recommended for non-technical users):**
  install [GitHub Desktop](https://desktop.github.com/), clone your empty
  repo, then use your OS's file explorer to copy the *entire* project
  folder's contents into the cloned repo folder (so `css/`, `js/`, and
  `images/` land as real subfolders), then commit and push from GitHub
  Desktop.
- **Option C — git command line / github.dev:** `git add .`, `git commit`,
  `git push`, or drag the whole project folder into
  [github.dev](https://github.dev) — both preserve folder structure
  correctly.

Once pushed, enable **Settings → Pages → Deploy from a branch**, choose your
main branch and `/ (root)`, and GitHub will publish the site at
`https://<username>.github.io/<repo>/index.html` (or a custom domain if you
configure one).

## 6. Design notes

- Colors, type, and spacing all live as CSS variables at the top of
  `css/style.css` — change a value once there to restyle the whole site.
- Scroll animations only activate once JavaScript confirms
  `IntersectionObserver` support (see `html.js` in `css/style.css` and the
  top of `js/main.js`) — if JavaScript fails to load, every `.reveal`
  element defaults to fully visible.
- `prefers-reduced-motion` is respected sitewide, and all interactive
  elements have a visible keyboard focus state.
