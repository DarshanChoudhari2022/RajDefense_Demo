# Raj Defence prototype: media brief

What the four reference sites do with background video and imagery, what Raj should use in each section, and prompts to generate placeholders. Observed 25 Nov 2026 on desktop, homepage load plus a scroll through each page. Lazy-loaded media I could not trigger is not covered.

---

## 1. What the reference sites actually do

| Site | Hero media | Measured | Other sections | Takeaway for Raj |
|---|---|---|---|---|
| **DJI** (dji.com/global) | Auto-rotating product carousel: one glossy product still per slide on a dusk-sky gradient with a soft reflective floor | Hero is stills. Showcase clips are 2400 × 1440, 8 s, looped, muted | "Shot on" full-bleed lifestyle and action clips, credited to the product. White, airy page | Product is the star, clean surfaces, short loops, bright and calm. Closest to our tone |
| **Raphe** (raphe.com, Indian UAV maker) | One full-screen looped video of drone-camera footage with green HUD telemetry, dark gradient, huge condensed caps | 1280 × 720, 30 s, loop | Pure black. Macro render of a mechanical part, a point-cloud scan of a house with an orbit ring, carbon-fibre macro as a text backdrop, one lab photo | Sensor-view footage plus technical textures on black reads as capable and credible. Few assets, used well |
| **Solar Group** (solargroup.com, Indian defence and explosives) | Documentary factory-floor video: workers in hard hats handling a large casing in a crate warehouse | 1920 × 1080, 21 s, loop. A second 47 s brand film at 3556 × 2000 further down | Dark navy brand-film block, then ordinary photos (people, ferns and moss for sustainability) with overlay cards | Real production footage builds trust more than glossy renders. Mixed quality, which is why it feels corporate |
| **Kratos** (kratosdefense.com) | Abstract glowing red flowing-contour texture with an angular shard, no product at all | 2688 × 1536, 4 s, plays once, does not loop | Product photos in cards, people in workshop photos, dark gradients | An abstract brand texture avoids showing hardware you cannot yet show. Short and cheap to host |

Patterns shared by all four: muted, looping, no audio, a dark overlay or gradient so text stays readable, one idea per clip, and very slow camera moves.

**What this means for us.** Our site is light, calm and typographic, with 3D aircraft doing the showing. So:
- Use video as **atmosphere**, not as the main event.
- **Do not generate the hero aircraft with AI.** A generated aircraft will never match RJS-H1's real layout, and a wrong airframe on a defence site hurts credibility. Show the aircraft only through our own 3D models; generate environments, textures and process footage around it.
- Keep generated footage clearly labelled "illustrative" (the prototype already does this) until real footage replaces it.

---

## 2. Where media goes

| # | Slot (section) | Asset | Type | Priority |
|---|---|---|---|---|
| 1 | Hero background | `hero-atmosphere` | Video loop, 10 s | **P1** |
| 2 | RJS-H1 spotlight background | `rjs-blue-hour-cruise` | Video loop, 8 s | **P1** |
| 3 | Fleet, ISR card and hero modal | `isr-eo-view` | Video loop, 10 s | **P1** |
| 4 | Heritage | `heritage-gas-plant` | Video, 10 s | **P1** |
| 5 | Why hydrogen, step 03 | `fuel-cell-macro` | Video loop, 6 s | P2 |
| 6 | Heritage, Pune strip | `pune-assembly-bench` | Image 3:2 | **P1** |
| 7 | Quality | `quality-inspection` | Image 3:2 | P2 |
| 8 | Quality, behind the checks | `carbon-texture` | Video loop, 6 s | P2 |
| 9 | Fleet, Maritime card | `maritime-deck-dawn` and `harbour-survey` | Images 3:2 | P2 |
| 10 | Share previews | `og-image` | Image 1200 × 630 | P2 |
| 11 | Optional hero film | `hero-launch-film` | Video, 12 s, plays in a modal | P3 |

Every video also needs a poster image (first frame, WebP), which the site shows while loading and for reduced-motion users.

---

## 3. Delivery spec for every video

- 16:9, 1920 × 1080, 24 fps, **no audio**, H.264 MP4 plus a WebM copy.
- Budget: 8–10 s loops under about 2.5 MB each; keep total page video under about 8 MB.
- Generate 5–8 s clips with a **slow** camera move, then loop them: ping-pong or a 1 s crossfade.
- Colour: desaturated, soft, matching the site (bone off-white, ink black, tiny orange and green accents). Avoid high-contrast oranges and neon.
- Leave the **left 45 % calmer and darker or lighter** than the right, so headline text is readable on top.

Compress a clip:

```powershell
ffmpeg -i in.mp4 -an -vf "scale=1920:-2,fps=24" -c:v libx264 -crf 26 -preset slow -movflags +faststart out.mp4
ffmpeg -i in.mp4 -an -vf "scale=1920:-2,fps=24" -c:v libvpx-vp9 -crf 34 -b:v 0 out.webm
ffmpeg -i out.mp4 -frames:v 1 -vf "scale=1920:-2" poster.webp
```

Page markup pattern:

```html
<video autoplay muted loop playsinline preload="metadata" poster="media/hero-atmosphere.webp">
  <source src="media/hero-atmosphere.webm" type="video/webm">
  <source src="media/hero-atmosphere.mp4" type="video/mp4">
</video>
```

---

## 4. Style bible (paste at the start of every prompt)

> Calm, premium, cinematic realism. Muted, slightly desaturated palette of warm bone-white, soft grey and deep ink-black, with a very small touch of warm orange. Soft natural light, gentle haze, shallow depth of field, slow and steady camera. Clean, modern, uncluttered composition with generous empty space. Photorealistic, 35mm film look, fine grain. Indian setting where a place is shown.

**Negative prompt (paste at the end of every prompt):**

> text, captions, watermark, logos, insignia, flags, military markings, serial numbers, weapons firing, explosions, smoke from impact, fire, people in distress, close-up faces, cartoon, CGI look, oversaturated, neon, lens flare, shaky camera, fast motion, jump cuts

---

## 5. Prompts

### 1. `hero-atmosphere` (video loop, 10 s) — P1
Soft backdrop behind the 3D aircraft. No aircraft, no people.
> [Style bible] A very slow, nearly still aerial view of thin high mist and soft clouds drifting across a pale pre-dawn sky, warm bone-white at the horizon fading to a cool pale grey-blue above. A faint line of distant hills at the bottom edge. Extremely gentle drift, barely perceptible, ideal as a calm website background. Centre of frame kept clean and bright. 16:9, 10 seconds, seamless loop, static camera.
> [Negative prompt]

### 2. `rjs-blue-hour-cruise` (video loop, 8 s) — P1
Dark section background behind the exploded view. The aircraft is tiny and abstract on purpose.
> [Style bible] Dark blue-hour scene: a vast field of low clouds seen from above, lit from the horizon by a thin band of warm orange light, deep ink-blue sky overhead. Slow, smooth forward glide over the cloud tops. A tiny distant long-winged aircraft silhouette far in the distance, barely visible. Moody, quiet, premium. Lower third darker for text. 16:9, 8 seconds, seamless loop.
> [Negative prompt]

### 3. `isr-eo-view` (video loop, 10 s) — P1
Like Raphe's sensor-view hero, but neutral. Overlay our own HUD in the browser, because generated text is always garbled.
> [Style bible] A steady overhead camera view from a high-altitude drone looking down at dry rolling terrain and a winding rural road at golden hour, long soft shadows, a few small vehicles far below moving slowly. Slight slow pan along the road. Slightly desaturated like an electro-optical camera feed, fine sensor grain, no overlay graphics. Neutral surveillance and survey feel, nobody targeted. 16:9, 10 seconds, loop.
> [Negative prompt]

### 4. `heritage-gas-plant` (video, 10 s) — P1
> [Style bible] Slow dolly push-in across an Indian industrial compressed-gas plant at golden hour: rows of polished horizontal storage cylinders, neat silver pipework with valves and pressure gauges, clean painted steel, long soft shadows, a few distant workers in hard hats and high-visibility vests, no one in close-up. Quiet, orderly, safety-first atmosphere. 16:9, 10 seconds.
> [Negative prompt]

### 5. `fuel-cell-macro` (video loop, 6 s) — P2
> [Style bible] Extreme macro of the edge of a stacked fuel-cell plate assembly: dozens of thin alternating dark graphite and pale green plates with fine gaskets, against a black background. A soft sweep of white light slides slowly across the edges. Tiny dust-free droplets of condensation catch the light. Precision-engineering feel. 16:9, 6 seconds, seamless loop, camera locked.
> [Negative prompt]

### 6. `pune-assembly-bench` (image 3:2) — P1
> [Style bible] A bright, spotless aircraft assembly hall: a technician in a white lab coat and gloves, seen from behind and slightly from the side, checking a pressure fitting on an open metal cylinder at a clean workbench, tools neatly laid out, a half-assembled long-winged drone airframe blurred in the background, daylight from high windows. Quiet, careful, trustworthy. Shallow depth of field, no faces visible.
> [Negative prompt]

### 7. `quality-inspection` (image 3:2) — P2
> [Style bible] Close-up of hands in gloves holding a pen on a clipboard checklist beside a small pressure-test rig with an analogue gauge, on a clean steel bench, soft window light. Shallow depth of field. Nothing legible.
> [Negative prompt]

### 8. `carbon-texture` (video loop, 6 s) — P2
> [Style bible] Macro of woven carbon-fibre weave, dark graphite, with a slow soft highlight sweeping diagonally across the surface. Black background, premium material feel. 16:9, 6 seconds, seamless loop, camera locked.
> [Negative prompt]

### 9a. `maritime-deck-dawn` (image 3:2) — P2
> [Style bible] The stern deck of a grey patrol vessel at dawn, calm sea and a pale sky, a small long-winged drone with four rotors resting on the deck far from the camera, out of focus, a lone crew member in the distance. Quiet and orderly. Deep empty space in the upper half.
> [Negative prompt]

### 9b. `harbour-survey` (image 3:2) — P2
> [Style bible] Underwater view in a calm harbour: shafts of pale green light falling through the water, a slim torpedo-shaped survey vehicle seen small and far away over a sandy seabed with a pier pile in the distance. Clear, soft, still.
> [Negative prompt]

### 10. `og-image` (image 1200 × 630) — P2
Use the hero atmosphere frame as the background and set the headline over it yourself, so no text comes from the generator.
> [Style bible] Wide, calm sunrise sky with soft mist and a pale warm horizon, large clean empty space on the left half. 1200 × 630.
> [Negative prompt]

### 11. `hero-launch-film` (video, 12 s) — P3, optional
For a "Watch the film" button. Needs sign-off before use because it shows an aircraft.
> [Style bible] A long-winged drone with four rotors lifts off vertically from a grassy clearing at golden hour, hovers, then tilts forward and climbs away into a soft sky, filmed from a distance on a long lens, the aircraft small in frame and plain white with no markings. Calm, confident, no fuss. 16:9, 12 seconds.
> [Negative prompt]

---

## 6. Rules to keep this safe and consistent

1. **No generated aircraft as the product.** Use generated media for places, light and process. Replace with real photos and real RJS-H1 video as soon as they exist.
2. **Keep the "illustrative" labels** on any generated frame until replaced.
3. **No real insignia, flags, ranks, serial numbers or named people.** The negative prompt covers this.
4. **No depiction of strikes or weapons in use.** The loitering munition and interceptor stay as neutral product visuals.
5. **Check each clip on a phone.** Anything that does not look calm at small size gets cut.
