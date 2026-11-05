# Gallery photos

Add six photographs named exactly:

```text
photo-1.jpg
photo-2.jpg
photo-3.jpg
photo-4.jpg
photo-5.jpg
photo-6.jpg
```

They fill the "Our moments" gallery in order. Until a file exists, its tile
shows a designed placeholder and is not clickable.

- Recommended size: 1600 px on the long edge, 3:2 landscape.
- Use `object-fit: cover`-friendly crops with faces near the centre; the grid is
  responsive and tiles change shape on phones.
- `photo-1.jpg` is the large feature tile on desktop and a tall portrait tile on
  phones.
- Keep each file under ~400 kB, and keep the lowercase `.jpg` extension for
  compatibility with Vercel/Linux.
- Captions live in `src/data/content.js` under `gallery.captions`.
- To use a different number of photos, update the `PHOTOS` array in
  `src/components/Gallery.jsx` and add matching captions.
