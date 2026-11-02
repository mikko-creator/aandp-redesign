# Design: Morning Glass

A redesign concept for A&P Dispensary, Kew Gardens, Queens. The idea comes from the shop itself: A&P's black-framed
glass display cases, seen in daylight. This is v2, a lighter take; the first, dark concept ("Cabinet of Light") is
archived at `/v1-dark/`.

## The planes

- **Back plane: light grounds.** Warm paper, cream and A&P mist (`.band`, `.band--void`), lit like morning sun through
  frosted glass: a soft warm pool from the upper left (`.band--lit`), an occasional sunbeam (`.band--beam`), a pastel
  mint glow from A&P's green (`.band--glow`) and white haze at band bottoms (`.haze`). One sage band per page is the
  tinted moment (`.band--mist`). `[data-spot]` lets the sun pool follow the pointer.
- **Mid plane: glass.** White frosted panes (`.glass`) with white hairlines and soft warm shadows, only where
  something varied sits behind them. The top-left edge catches the sun (`.glass--lit`); mint panes for the menu
  (`.glass--leaf`), pale gold for deals and story (`.glass--gold`). The header frosts on a pseudo-element, so the mega
  menus keep their own blur.
- **Front plane: depth.** Cut-outs (`.cut`) carry soft shadows that fall to the lower right, the gentle side of
  chiaroscuro. Art shot on light grounds blends with `multiply` (`.screen`) and may cross section seams and case
  frames (`.protrude`). Backdrops live in `.band__clip`, so the band never clips what protrudes from it.
- **The one deep band** is A&P forest: the footer, with cream text and a giant cropped "A&P" crossed by a slow sheen.

## The display case

`.case` is the signature component: a thin dark frame (A&P's cases are black) catching the light on its top edge,
bright glass reflections (`.case__glass`), a light strip along the top inside edge (`.case__light`) and a soft floor
shadow to the lower right. It holds a photo, a product or a film (`.case__media`; `.case--tall`, `.case--wide`). On
hover the shadow deepens and the image slowly zooms.

## Type and colour

A&P's own faces and colours: Archivo Black uppercase headlines, Figtree body at 16px / 1.65, Roboto Mono kickers and
prices. Dark text on light grounds; green text is A&P pine (`--leaf-deep`) and gold text is the deep gold
(`--gold-hot`), so every line keeps at least 4.5:1. A&P's logo green fills the main action (`.btn--leaf`). All values
are tokens in `src/styles/tokens.css`.

## Motion

Sections fade up out of a soft haze as they enter (`[data-reveal]`, with a 2.5 s fail-safe), parallax on depth layers
(`[data-depth]`), pointer tilt (`[data-tilt]`), the specials ticker (`[data-marquee]`), promo slides
(`[data-rotator]`), tabs (`[data-tabs]`) and films that play only on screen with a visible pause toggle
(`[data-video]`). Hover adds a light sheen to glass, lifts products with a brighter rim, and grows link underlines
from the left. All motion stops under `prefers-reduced-motion`.
