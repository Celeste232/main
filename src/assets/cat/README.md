# Cat sprite frames

Drop transparent PNGs (400~600px square recommended) into per-action folders:

```
src/assets/cat/
├─ idle/         1.png 2.png 3.png
├─ walking/      1.png 2.png 3.png 4.png
├─ sitting/      1.png 2.png
├─ sleeping/     1.png 2.png 3.png
├─ grooming/     1.png 2.png 3.png
├─ stretching/   1.png 2.png 3.png
├─ yawning/      1.png 2.png
├─ tail-wag/     1.png 2.png 3.png
├─ jumping/      1.png 2.png 3.png
├─ curious/      1.png 2.png
├─ eating/       1.png 2.png 3.png 4.png
├─ drinking/     1.png 2.png 3.png
├─ play-cursor/  1.png 2.png 3.png 4.png
├─ in-house/     1.png 2.png 3.png
└─ startled/     1.png 2.png
```

Frame counts and intervals can be tuned in `src/components/Cat/catFrames.ts`.
While folders are empty the app falls back to a CSS-drawn placeholder cat.
