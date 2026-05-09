# Reference sheets → cat sprite frames

Drop your reference sheet PNGs into this folder. They can be either:

1. **A grid sheet** — multiple frames laid out in rows/columns on one image.
2. **Individual frames already cropped** — in that case you can skip this folder
   and put them directly in `src/assets/cat/<action>/<n>.png`. The app picks
   them up automatically.

If you use a grid sheet, you also need a `layout.json` describing pixel
coordinates for each frame. There's a starter at `layout.example.json` —
copy it and edit the numbers to match your actual sheets:

```bash
cp layout.example.json layout.json
# edit coordinates, then:
npm run slice
```

The slicer crops each frame, trims white background, and saves to
`src/assets/cat/<action>/<n>.png` at 512px square. From then on the app
displays the PNG sprite instead of the SVG fallback.

## Action names

Folder names must match these exactly:

```
idle  walking  sitting  sleeping  grooming  stretching  yawning
tail-wag  jumping  curious  eating  drinking  play-cursor  in-house
startled  loaf  sprawl  held
```

## Frame counts

Each action expects a specific number of frames; see
`src/components/Cat/catFrames.ts` (`FRAME_SPECS`) for the canonical list.
The slicer accepts any number — extras are ignored, missing frames fall
back to the doodle SVG.
