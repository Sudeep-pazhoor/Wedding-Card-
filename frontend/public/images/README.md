# Images

Drop the couple's photographs here. Until a file exists, the site shows a
designed "Photograph coming soon" placeholder — there is no need to change any
code.

| File               | Used by                  | Recommended |
| ------------------ | ------------------------ | ----------- |
| `hero.jpg`         | Full-screen hero background | 3:2 landscape, 2400 px wide |
| `portrait.jpg`     | Invitation arch portrait | 4:5 portrait, 1200 × 1500 |
| `location-qr.png`  | Venue QR code            | 640 × 640, already included |
| `location-qr.svg`  | Fallback QR code         | already included |

Tips:

- Keep the exact lowercase names and `.jpg` extension (Vercel is case-sensitive).
- Compress images before uploading. Under ~400 kB each keeps mobile loading fast.
- `hero.jpg` sits beneath a soft cream wash. Avoid very bright, low-contrast
  photos so the names remain readable.
- The portrait is masked into a decorative arch, so keep faces away from the
  extreme top and bottom edges.
- To regenerate the venue QR code after changing the address, update
  `scripts/generate-qr.mjs` and run `npm run generate:qr` from the project root.
