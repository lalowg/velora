# VÉLORA — Wear the Unseen

An avant-garde fashion house presented as an interactive fashion film. The site plays like a four-scene short: living silk you can touch, type that slices apart as you scroll, twelve looks lit from one side, and a coat you can inspect stitch by stitch.

**Production URL:** https://velora-theta-hazel.vercel.app

## Concept
VÉLORA designs for "the moment before you are seen": half-light, held breath, the corridor. The current collection, *Penumbra — Collection VII, Autumn–Winter 2026*, is shown the way the house would show it: as a film, not a catalogue. Every reel of the page is a scene, the header runs a timecode, and the footer is a set of end credits.

## Brand & positioning
A fictional Paris couture-adjacent house: severe tailoring, liquid silk and velvet, shown by private appointment only. Tone: quiet, literary, precise. No prices, no discount language, no social proof.

## Audience
Collectors and clients of directional fashion, editors and stylists, and design-literate visitors who expect a fashion house site to feel authored rather than templated.

## Art direction
- Palette: noir `#0A0908`, bone `#EDE6DA`, oxblood `#5A1A1F`, smoke `#8C857C`.
- Letterboxed frame, film grain, single key light from the upper right in every image.
- Sections alternate dark and light like cuts between scenes: noir film, noir strip of looks, bone object study, noir atelier, oxblood interlude, noir archive, bone appointment, noir credits.
- All imagery is original: a parametric SVG "fashion plate" renderer (`looks.js`) draws each look with gradient volume, rim light, drapery folds, textures (pleats, quilting, pinstripe, lacquer, velvet sheen), cast shadows and a light shaft. The silk is a WebGL shader. No photography or external images.

## Typography
- Display: **Bodoni Moda** (optical sizing on, so huge titles get hairline contrast).
- Text and interface: **Jost** 300/400/500, tracked small capitals for labels.

## Motion language
Film grammar instead of fade-ups:
- **Curtain open** on load (letterbox bars part).
- **Type slices**: titles are three clipped horizontal bands that shear apart and reassemble.
- **Mask wipes**: vertical slit, diagonal and horizontal wipes reveal each look.
- **Scope change**: the frame narrows to a wider aspect ratio for the title card.
- **Pinned horizontal film strip** for the looks, each frame opening from a slit as it enters.
- **Rolling credits** in the footer.

## Signature interaction — the living silk (first viewport)
A full-screen WebGL fragment shader renders silk as a procedural height field with anisotropic (Kajiya–Kay) sheen.
- **Move the pointer / drag a finger** across the frame: the cloth ripples from every touch.
- **Click or tap** to drop a stronger ripple. The **"Disturb the silk"** button does the same from the keyboard.
- **Scroll** to play the film: scroll scrubs four pinned scenes (Wear the Unseen → Fabric remembers → Cut from shadow → Penumbra). The silk changes colour (noir → oxblood → bone → noir) and a fold "wipe" sweeps through it at each cut.
- The **I–IV buttons** in the bottom letterbox jump to any scene.

Other interactions: look strip with lightbox (arrows, swipe, ← → keys, Esc; "Request this look" pre-fills the form), Coat No. 7 study (colourway swatches, five construction hotspots, a 2.6× detail loupe driven by mouse, tap or arrow keys), a pattern-cutting board that draws itself step by step, an expandable archive index with hover previews, and a validated appointment form.

## Tech
- Static HTML/CSS/ES modules, no build step.
- GSAP 3.12.5 + ScrollTrigger (cdnjs) for pinning and scrubbing; `gsap.matchMedia` switches between choreographies.
- Raw WebGL 1 (one context) for the silk; no Three.js needed.
- Files: `index.html`, `style.css`, `main.js` (orchestration), `silk.js` (shader), `looks.js` (collection data + SVG renderer), `gallery.js` (strip + lightbox), `object.js` (coat study), `form.js`, `motion.js` (GSAP), `logo.svg`, `favicon.svg`.

## Local development
```
npx serve .
```
Open the printed localhost URL. (ES modules need to be served over http, not opened as a file.)

## Accessibility & performance
- One `<h1>`, landmarks, skip link, visible `:focus-visible` everywhere, English labels throughout.
- Every pointer interaction has a keyboard equivalent: scene buttons, ripple button, loupe arrow keys, hotspot list, lightbox keys, focus-following look strip.
- `prefers-reduced-motion: reduce`: no pinning, scrubbing, intro or grain animation. The film becomes a click-through of scenes; the silk is a still frame that only moves when you touch it.
- Without GSAP the same static mode is used; without WebGL a designed SVG silk with CSS ripple rings replaces the shader; without JavaScript the scenes stack as plain content.
- Shader: DPR capped (2 desktop / 1.5 mobile), render scale 0.62–0.75 with a pixel budget, adaptive resolution if frames are slow, paused off-screen (IntersectionObserver) and on `visibilitychange`, context-loss handled.
- Lightbox uses native `<dialog>` (focus trapped, Esc closes, focus returns to the opening card).
- Form: inline errors linked by `aria-describedby`, error summary with links, success message states clearly that nothing was sent.

## Known limitations
- The look renders are stylised fashion plates, not garment simulations.
- The colourway cross-fade on the coat depends on `@property` support; other browsers switch instantly.
- Collection, archive, salons and availability are fictional; the form performs no network request.

## Credit
Designed & built by Saad Bashir — https://www.linkedin.com/in/saadbashirmarketing/

Fictional concept brand — portfolio project.
