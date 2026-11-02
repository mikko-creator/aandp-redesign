# A&P Dispensary: redesign pitch

A static, platform-free redesign concept for **A&P Dispensary**, the family-owned cannabis dispensary at 81-37 Lefferts
Blvd, Kew Gardens, NY.

- **Preview (noindex):** https://mikko-creator.github.io/aandp-redesign/
- **Design:** "Cabinet of Light", glassmorphism x ethereal x tenebrism on A&P's own brand (the green A&P circle mark,
  black, A&P gold, logo green, mist; Archivo Black, Figtree and Roboto Mono). It takes its cue from the shop itself:
  black-framed glass display cases glowing in a dark brick room. Near-black grounds are carved by one warm key light,
  a soft green glow and drifting smoke add atmosphere, smoked glass panes carry the copy, and photos, films and
  cut-outs sit in glass cases and break out of their frames for depth. Scroll-through reveals, parallax and hover light
  sweeps throughout. See [docs/DESIGN.md](docs/DESIGN.md).
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
