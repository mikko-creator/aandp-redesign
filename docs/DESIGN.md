# Design: Cabinet of Light

A redesign concept for A&P Dispensary, Kew Gardens, Queens. The idea comes from the shop itself: black-framed glass
display cases glowing in a dark brick room. The site is built as that room, in three planes.

## The three planes

- **Back plane: tenebrism.** Near-black grounds (`.band`, `.band--void`) and one warm gold key light per section
  (`.band--lit`, `.band--beam`). The light sits on the band's `::after`, above any backdrop photo or film and under the
  content. A section can move its light with `--lx` / `--ly`, and `[data-spot]` makes it follow the pointer.
- **Atmosphere: ethereal.** A soft green glow, like light leaking from a lit case (`.band--glow`, `--gx` / `--gy`),
  fine grain (`.grain`), haze at band bottoms (`.haze`) and slow drifting light. All motion stops under
  `prefers-reduced-motion`.
- **Mid plane: glass.** Smoked panes (`.glass`) only where something varied sits behind them. The top-left edge
  catches the key light (`.glass--lit`); green panes for the menu (`.glass--leaf`), gold for deals and story
  (`.glass--gold`). The header frosts on a pseudo-element, so the mega menus keep their own blur.
- **Front plane: depth.** Cut-outs (`.cut`) and black-ground art blended with `screen` (`.screen`) cross section
  seams and case frames (`.protrude`). Backdrops live in `.band__clip`, so the band itself never clips what
  protrudes from it.

## The display case

`.case` is the signature component: a thin black frame, an inner glass reflection (`.case__glass`), a light strip
along the top inside edge (`.case__light`) and a green glow at the base. It holds a photo, a product or a film
(`.case__media`; `.case--tall`, `.case--wide`). On hover the glow brightens and the image slowly zooms.

## Type and colour

A&P's own faces and colours: Archivo Black uppercase headlines, Figtree body at 16px / 1.65, Roboto Mono kickers and
prices. Ink black, A&P logo green for actions and prices, A&P gold for the key light and kickers, mist for the one
"lights on" band per page (`.band--mist`). All values are tokens in `src/styles/tokens.css`.

## Motion

Sections fade up and "light on" as they enter (`[data-reveal]`, with a 2.5 s fail-safe), parallax on depth layers
(`[data-depth]`), pointer tilt (`[data-tilt]`), the specials ticker (`[data-marquee]`), promo slides
(`[data-rotator]`), tabs (`[data-tabs]`) and films that play only on screen with a visible pause toggle
(`[data-video]`). Hover adds a light sheen to glass, lifts products with a brighter rim, and grows link underlines
from the left.
