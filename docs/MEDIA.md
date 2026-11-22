# Media: Footage Audit & Enhancement

## Sources

**Update (Nov 22, 2026):** the client added the logo sheet, the father-and-son photo, 12 job photos and BBB/Google/Facebook screenshots to the Drive folder. Logo variants were cut from the 2400 px sheet into transparent PNGs (`public/brand/`); photos were auto-oriented, resized to ≤2000 px and stripped of all metadata (no GPS data was present) into `public/media/photos/`. Screenshots were used only to verify facts and are not published.


Three recordings from the Google Drive folder “Next Gen Roofing – Project Assets.” No logo files, project photos, family photograph, or BBB/Google screenshots were in that folder (see `OPEN-ITEMS.md`). Facebook could not be accessed from the build environment, so nothing was taken from it.

| File | Container | Video | Duration | Content |
| --- | --- | --- | --- | --- |
| d1 “Drone footage” | MOV | HEVC 1320×758, 60 fps | 22.9 s | Sunny orbit of a finished brown architectural-shingle **hip roof** |
| d2 “Drone footage 2” | MOV | HEVC 1320×748, 60 fps | 21.8 s | Pre-edited **tear-off → new decking → finished** sequence with crossfades |
| d3 “Drone footage 3” | MOV | HEVC 1320×756, 60 fps | 24.5 s | Overcast **farmhouse**: yard sign → crane-up orbit → ridge cap close-up → top-down |

### Findings

- **Screen captures, not camera originals.** 60 fps containers where every other frame duplicates (≈674 unique frames / 22.9 s ≈ 29.4 fps), thin black letterbox lines (cropdetect: 1320×742), and creation timestamps of the upload date. True source detail is roughly 1300×740 at 30 fps — matching the brief's note about low-resolution equipment.
- **Exposure:** d1/d2 well exposed in direct sun with slightly heavy saturation; d3 flat and low-contrast (overcast).
- **Motion:** all three are smooth, gimbal-stabilized moves. No stabilization pass needed; applying one would only crop further.
- **Unsuitable for prominent use:** d2 at 6.0–8.8 s (double-exposure crossfades); d3 first 2 s (ground-level, includes a parked vehicle and a neighbor's property in frame).
- **Privacy:** these are customers' homes. A house number may be faintly visible on the farmhouse porch (d3, street-level frames). Confirm homeowner permission for all project media before launch; replace or crop `farmhouse-street.jpg` if needed.

## Selected segments

| Use | Source | Segment | Why |
| --- | --- | --- | --- |
| Hero Scene 1 “Arrival” | d1 | 5.2–12.0 s → 6 s seamless loop | Strongest, steadiest orbit; full roof geometry and neighborhood context |
| Hero Scene 2 “Craft” | d3 | 10.4–16.4 s → 5.2 s loop | Ridge cap and ridge vent close-up — literally “precision in every detail” |
| Project films | d1, d2, d3 | Full edits | Authentic start-to-finish documentation |
| Stills (galleries, page heroes) | all | 14 frames | Chosen frame-by-frame; crossfade frames rejected |

## Enhancement pipeline — `scripts/media/process-footage.sh`

1. **De-duplicate** frames (`mpdecimate`) and retime to a true 30 fps (removes capture judder, halves decode cost).
2. **Crop** letterbox lines and edge artifacts (→ 1312×736).
3. **Temporal denoise** `hqdn3d 1.5:1.5:4:4` — removes compression shimmer without smearing shingle texture.
4. **Grade** — sunny clips: −10% saturation, deeper blacks, gentle S-curve, neutralized highlights. Overcast clip: +12% contrast, slight mid-tone warmth.
5. **Contrast-adaptive sharpening** `cas 0.35` — conservative; no halos.
6. **Seamless loops** — last 0.8 s crossfades into the first, so loops have no visible jump.
7. **Encode** — AV1 (WebM, SVT-AV1) primary + H.264 (MP4, faststart) fallback; 1280×720 desktop and a 540×720 portrait crop for phones; posters from the loop's first frame.

**No AI super-resolution was applied.** No GPU or ML runtime was available in the build environment, and the source has no hidden detail to recover; the output is delivered at (slightly below) native resolution rather than upscaled. Nothing on the site claims 4K or HD-native footage.

## Delivery

- Hero video loads **after** the page's `load` event during idle time; the poster image is the first paint. Scene 2 footage loads only once the visitor scrolls.
- Phones get the 540 px portrait crop (~0.5 MB AV1 per loop).
- Skipped entirely on Save-Data, 2G connections, and `prefers-reduced-motion`.
- Videos pause when their scene isn't visible; a pause/play control is always available (WCAG 2.2.2).
- Project films are click-to-play; nothing downloads until requested.

## Regenerating

```bash
# put the three originals in a folder as d1.mov, d2.mov, d3.mov
npm run media -- /path/to/raw public/media
node scripts/media/brand-images.cjs     # OG image + Apple touch icon
```

## Concept B (stills)

Concept B uses graded stills (`hip-roof-vents`, `farmhouse-ridge-detail`) with Ken Burns scaling and the same gable-mask reveal. View it at `/hero-concepts?c=stills`, or make it the homepage with `NEXT_PUBLIC_HERO_CONCEPT=stills`.
