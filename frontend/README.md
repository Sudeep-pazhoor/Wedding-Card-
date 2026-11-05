# Wedding Invitation — Frontend

React 19, Vite 8, GSAP, and Lenis single-page wedding invitation for **Sundeep & Neeraja**.

## Features

- **Bilingual**: English and Malayalam text toggle with URL and `localStorage` persistence.
- **Traditional Hindu Aesthetic**: Maroon, gold, and ivory parchment palette with traditional motifs.
- **GSAP & Lenis Smooth Motion**: Smooth animations with full `prefers-reduced-motion` accessibility support.
- **Interactive Wall**: Blessing marquee with real-time API sync and offline local storage fallback.
- **Gallery & Lightbox**: Responsive photo gallery with keyboard navigation.
- **Venue Map & QR Code**: Google Maps links and generated QR code.

## Setup & Running

### 1. Install dependencies
```bash
npm install
```

### 2. Development Server
```bash
npm run dev
```
Runs at `http://localhost:5173`. Requests to `/api` are automatically proxied to the backend at `http://localhost:5000`.

### 3. Production Build
```bash
npm run build
```
Builds the production-ready static assets to `dist/`.

### 4. Preview Build
```bash
npm run preview
```

### 5. Generate Venue QR Code
```bash
npm run generate:qr
```
Regenerates QR codes in `public/images/location-qr.(png|svg)`.

