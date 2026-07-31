#!/usr/bin/env python3
"""
NEUROSTEP static-site build script.

Assembles the shared header/footer/popup/floating-button partials
around each page's body content (pages/*.html) and writes the final,
ready-to-deploy HTML files to the project root — no build tools or
frameworks required at runtime; this script only needs to be re-run
locally whenever the header/footer/nav or a page's content changes.

Usage:
    python3 build.py
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.abspath(__file__))
PARTIALS = os.path.join(ROOT, "partials")
PAGES = os.path.join(ROOT, "pages")

def read(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def write(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

def set_active_nav(header_html, active_page):
    """Mark the current page's nav link with aria-current="page"."""
    pattern = r'(<a href="[^"]+" data-page="%s")(>)' % re.escape(active_page)
    return re.sub(pattern, r'\1 aria-current="page"\2', header_html)

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{description}">
<link rel="canonical" href="https://www.neurostep.in/{slug}">
<meta property="og:type" content="website">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:locale" content="en_IN">
<meta name="theme-color" content="#0b3d3a">
<link rel="icon" href="images/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="css/style.css?v=3">
{schema}
</head>
<body>
{header}
<main id="main">
{body}
</main>
{footer}
{popup}
{floating}
<script src="js/main.js?v=3"></script>
</body>
</html>
"""

def main():
    meta = json.loads(read(os.path.join(ROOT, "meta.json")))
    header_src = read(os.path.join(PARTIALS, "header.html"))
    footer_src = read(os.path.join(PARTIALS, "footer.html"))
    popup_src = read(os.path.join(PARTIALS, "popup.html"))
    floating_src = read(os.path.join(PARTIALS, "floating-buttons.html"))

    built = []
    for key, info in meta.items():
        page_file = os.path.join(PAGES, key + ".html")
        if not os.path.exists(page_file):
            print("  ! skipping %s — no pages/%s.html found" % (key, key))
            continue
        body = read(page_file)
        schema_file = os.path.join(PAGES, key + ".schema.html")
        schema = read(schema_file) if os.path.exists(schema_file) else ""

        header_html = set_active_nav(header_src, key)

        html = PAGE_TEMPLATE.format(
            title=info["title"],
            description=info["description"],
            slug=info["slug"],
            schema=schema,
            header=header_html,
            body=body,
            footer=footer_src,
            popup=popup_src,
            floating=floating_src,
        )
        out_path = os.path.join(ROOT, info["slug"])
        write(out_path, html)
        built.append(info["slug"])
        print("  built %s" % info["slug"])

    print("\nDone. %d pages built to %s" % (len(built), ROOT))

if __name__ == "__main__":
    main()
