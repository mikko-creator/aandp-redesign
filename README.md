# A&P Dispensary: redesign pitch

A static, platform-free redesign concept for **A&P Dispensary**, the family-owned cannabis dispensary at 81-37 Lefferts
Blvd, Kew Gardens, NY.

- **Preview (noindex):** https://mikko-creator.github.io/aandp-redesign/
- **Design (v2, light):** "Morning Glass", glassmorphism x ethereal, with tenebrism kept as soft directional light and
  shadow, on A&P's own brand (the green A&P circle mark, black, A&P gold, logo green, mist and forest; Archivo Black,
  Figtree and Roboto Mono). It takes its cue from the shop itself: A&P's black-framed glass display cases, seen in
  daylight. Cream and paper grounds are lit by soft morning sun from the upper left, white frosted-glass panes carry the
  copy over pastel gold and mint glows, and photos, films and cut-outs sit in glass cases, break out of their frames and
  cast soft shadows for depth. The one deep band is A&P forest green (the utility strip and footer). Scroll-through
  reveals, parallax and hover light sweeps throughout. See [docs/DESIGN.md](docs/DESIGN.md).
- **Earlier concept (v1, dark):** "Cabinet of Light" stays viewable at
  https://mikko-creator.github.io/aandp-redesign/v1-dark/ (git tag `v1-dark`).
- **Architecture:** the information architecture of a large multi-state dispensary operator's site (utility bar with a
  store chip, Shop / Deals / Resources mega menus, a category bar, footer columns, page types and URL patterns),
  carrying A&P's own content. Every old A&P address redirects to its new page.
- **Content:** A&P's own words from aandpdispensary.com, plus a sample of A&P's live menu (products, prices and the
  current specials as listed on 2 November 2026).
- **Imagery:** A&P's own photos and store footage, plus AI-generated illustrative stills and one motion loop
  ([docs/MEDIA.md](docs/MEDIA.md)). Generated images never depict A&P's store, staff, customers or products.

## What is in the pitch

Home; the full menu, nine category pages, five collections and the deals page; the Kew Gardens store page and Find Us;
Delivery; About; Reviews; FAQ; Contact; the small-batch drops email list; the Learn hub and A&P's nine articles; 404.

Every form on the preview is a demo and sends nothing, and the product "+" buttons only show a note: ordering connects
at launch. Menu prices and stock change daily on the live menu.

## Build

Node 18+ and `cwebp` on PATH; no npm dependencies.

```bash
node src/build.mjs            # -> dist/
node tools/serve.mjs --root dist --port 8080 --not-found 404.html
```

`src/content/site.json` holds A&P's facts and site copy, `src/content/pages/` and `src/content/articles/` the page
copy, `src/content/menu.json` the menu sample, `src/content/ia.json` the navigation; templates are in `src/theme/`,
styles in `src/styles/`.
