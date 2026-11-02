# Media: what each image and film is, and where it comes from

The pitch uses two kinds of imagery, and they are kept apart on purpose.

1. **A&P's own photos and footage.** Everything that shows A&P Dispensary's store, products or van comes from A&P's
   own website photos and A&P's own store videos. Nothing in this group is generated or altered beyond cropping,
   resizing and re-encoding for the web.
2. **AI-generated illustrative imagery.** Thirteen still images made with an image model (fal.ai, FLUX1.1 [pro] ultra;
   two cut-outs with BiRefNet v2) and one short motion loop made from one of them. They are mood pieces for category
   headers, menus and depth layers. They never depict A&P's store, street, staff, customers, products or results, and
   they carry no text, logos or brand marks. Each file carries an IPTC `trainedAlgorithmicMedia` label (XMP), kept on
   every WebP variant the build makes.

## A&P's own footage: stills (`assets/photos/`)

| file | size | what | source |
|---|---|---|---|
| `store-room.jpg` | 1440x2560 | the store room: a glass counter case in front of the brick wall, tall black-framed cases, track lights, plants | frame of A&P's store-room video |
| `store-room-wide.jpg` | 1920x1080 | landscape crop of the same frame | frame of A&P's store-room video |
| `store-case-1.jpg` | 1440x2560 | a tall glass case, its lit shelves of packaged products | frame of an A&P store video |
| `store-case-2.jpg` | 1440x2560 | a full display case of boxed and bagged products | frame of an A&P store video |
| `store-shelf.jpg` | 1440x2560 | a glass shelf of tins and small boxes against brick | frame of an A&P store video |
| `store-brick.jpg` | 1440x2560 | a glass case against the brick wall | frame of an A&P store video |
| `store-counter.jpg` | 1440x2560 | looking down into the glass counter case | frame of an A&P store video |

The other files in `assets/photos/` (storefront, interior, van, website mockup, product and article art, guide art,
category icons) are A&P's own website images.

## A&P's own footage: web films (`assets/media/`)

All are H.264, yuv420p, no audio track, with a JPEG poster of the first frame. Loops are made by playing a short
section forward and then in reverse (store clips, plants) or by a 1 s crossfade fold (smoke), so they repeat without
a jump.

| id | file(s) | size | length | what |
|---|---|---|---|---|
| `store-room` | `store-room.mp4` + `store-room-sm.mp4` (phones) + `store-room.jpg` | 1920x1080 / 720x1280 | 8.9 s | A&P's store room |
| `inside-1` .. `inside-6` | `inside-n.mp4` + `inside-n.jpg` | 720x1280 | 7.9 s | A&P's six vertical store clips |
| `smoke` | `smoke.mp4` + `smoke.jpg` | 1920x1080 | 10 s | A&P's smoke film |
| `plants` | `plants.mp4` + `plants.jpg` | 1920x1080 | 9.9 s | A&P's backlit-plants film |

The registry with paths, sizes and alt text is `src/content/images.json`.

## AI-generated illustrative stills (`assets/generated/`)

The light version ("Morning Glass"): the eleven backdrop stills were made again on light grounds, with the same names
and shapes as before. One light scheme throughout: bright, high-key still lifes in soft morning sunlight from the upper
left, soft shadows falling to the lower right, cream, paper-white and pale stone with a hint of sage green, and calm
light space where the page sets type. The two cut-outs are unchanged. Prompts, model, seed, request id and the by-eye
review verdict of every image are in the sidecar next to each file (`<file>.json`) and in
`src/content/image-plan.json`.

| id | shape | what is depicted |
|---|---|---|
| `g-hero-case` | 16:9 | a slim black-framed glass display cabinet in a sunlit cream room, a few cured buds on its shelves, a window and a potted plant |
| `g-smoke-glass` | 16:9 | frosted glass panels in soft morning light, pale cream with a faint mint tint, soft leaf shadows |
| `g-bud-macro` | 3:2 | macro of a cured cannabis flower on cream linen |
| `g-prerolls` | 3:2 | two slim paper pre-roll cones on pale marble |
| `g-vape` | 3:2 | one plain, unbranded vape cartridge on a white sill by a window |
| `g-concentrate` | 3:2 | amber cannabis shatter on parchment, the top sheet peeled back, a small bud beside it |
| `g-tincture` | 3:2 | an unlabelled amber dropper bottle, a dropper and a fan leaf on cream linen |
| `g-topical` | 3:2 | an open, unlabelled tin of white balm on pale marble |
| `g-accessories` | 3:2 | a clear glass spoon pipe on a white surface |
| `g-edibles` | 3:2 | a plain ceramic dish of three matte, earth-toned chews on linen |
| `g-cabinet-deals` | 3:2 | empty glass shelves in a bright pale wood display case |
| `g-leaf-cut` | 4:5 | one cannabis fan leaf, transparent cut-out (unchanged) |
| `g-bud-cut` | 1:1 | one cured cannabis bud, transparent cut-out (unchanged) |

Review: every image was viewed whole and in a 100% crop of its subject before it was accepted. Five generations of
the light set were rejected and made again (sugar-like speckles on the chews, a candy-like concentrate twice, pre-roll
tubes without a cone shape or twisted tips twice); for the pre-rolls and the concentrate the best of three attempts was
kept and is marked for an operator check. The dark first-version stills and every rejected file are kept outside the
site as evidence.

## AI-generated motion (`assets/media/haze-loop.mp4`)

`haze-loop` is AI-generated motion: the light still `g-smoke-glass` animated with an image-to-video model (fal, Kling
2.1), so soft haze and morning light drift slowly behind the frosted glass. Six seconds play forward and then in
reverse, which makes the loop seamless: 1920x1068 (and 960x534 for phones), about 12 s, no audio. It is illustrative
atmosphere, not footage of A&P. The MP4s carry the AI note in their metadata and the poster carries the AI label.
