# Sundeep & Neeraja — Wedding Invitation

A bilingual (English / Malayalam) wedding invitation and blessing wall for
**Sundeep & Neeraja**, celebrating on **Sunday, 24 January 2027** at
**Hilton Convention Center, Manjeri, Kerala**.

The repository is structured with completely separated **`frontend/`** and **`backend/`** folders, allowing each to be developed, run, and deployed independently or coordinated seamlessly from the root workspace.

---

## Highlights

- **English + Malayalam** copy, switchable at any time. The choice is remembered
  in `localStorage` and can be linked directly with `?lang=ml`.
- **Traditional design** — parchment, maroon and gold palette, serif display
  type, lotus/mandala ornaments, palm sprays, floating petals, and a rotating
  wedding seal.
- **Graceful placeholders** for the couple's photographs and gallery. Drop in
  real photos later without touching component code.
- **Live blessing wall** — guests can leave a wish, which is stored in MongoDB
  and displayed in continuously moving marquee cards. If the database is not
  configured, wishes are saved on the guest's device so the page still works.
- **Venue QR code** generated locally, plus Google Maps and copy-address actions.
- **Accessible details** — skip link, focus styles, keyboard gallery lightbox,
  live form status, reduced-motion support, and semantic landmarks.
- **Lightweight** — React, GSAP and Lenis only. No Three.js or heavy 3D payload.
  Production bundle is roughly 138 kB of JavaScript and 13 kB of CSS (gzipped).

---

## Tech stack

| Layer      | Technology                                        | Location   |
| ---------- | ------------------------------------------------- | ---------- |
| Front end  | React 19, Vite 8, GSAP, Lenis                     | `frontend/`|
| Back end   | Express 5, Mongoose 9                             | `backend/` |
| Database   | MongoDB (local or MongoDB Atlas)                  | Database   |
| Deployment | Vercel (static site + `/api` serverless functions)| Root / Vercel |
| Tooling    | Oxlint, concurrently, qrcode                      | Root & packages |

---

## Quick start

Requirements: **Node.js 20+** and npm.

### Option 1: Run everything from the root

```bash
# Install dependencies across frontend & backend
npm run install:all

# Configure MongoDB for the backend
cp backend/.env.example backend/.env
```

Open `backend/.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wedding?retryWrites=true&w=majority
```

Start both the frontend and backend together with hot reload:

```bash
npm run dev
```

- Website: <http://localhost:5173>
- API health: <http://localhost:5000/api/health>

The front end proxies `/api` to port `5000` during local development, so no other
configuration is needed.

---

### Option 2: Run frontend and backend independently

#### Frontend only
```bash
cd frontend
npm install
npm run dev
```
Runs at <http://localhost:5173>.

#### Backend only
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Runs at <http://localhost:5000>.

---

## MongoDB setup

1. Create a free **MongoDB Atlas** cluster (or use a local MongoDB server).
2. Create a database user with read/write access.
3. Under **Network Access**, allow your current IP for local development. For
   Vercel, either allow `0.0.0.0/0` (simplest for a small wedding site) or use
   Vercel's static egress IPs if your plan provides them.
4. Copy the connection string into `backend/.env` as `MONGODB_URI`.
5. Restart the API. `GET /api/health` should report `"database": "configured"`.

The first blessing creates the `messages` collection automatically.

### Blessing API

| Method | Route           | Purpose                                            |
| ------ | --------------- | -------------------------------------------------- |
| GET    | `/api/health`   | Health and database configuration status           |
| GET    | `/api/messages` | Latest 60 blessings, newest first                  |
| POST   | `/api/messages` | Create a blessing (`name`, `message`, `attending`) |

The write endpoint is rate-limited (10 submissions per 10 minutes per IP),
validates lengths, strips control characters, and includes a honeypot field.

---

## Editing the invitation

All wording lives in:

```text
frontend/src/data/content.js
```

- `SITE` — names, date, venue search query, Maps URL, phone numbers, hashtag.
- `content.en` — English copy for every section.
- `content.ml` — Malayalam copy.
- `starterBlessings` — sample wishes shown only while the wall is empty.

The countdown reads `SITE.weddingDateISO` (`2027-01-24T10:00:00+05:30`).

---

## Adding photographs

The design intentionally ships without personal photos. Until files are added,
each image slot shows an elegant “Photograph coming soon” placeholder.

Place files in `frontend/public/` using these exact names:

| File                                 | Where it appears        | Suggested crop              |
| ------------------------------------ | ----------------------- | --------------------------- |
| `frontend/public/images/hero.jpg`    | Hero background         | 3:2 landscape, 2400 px wide |
| `frontend/public/images/portrait.jpg`| Invitation arch frame   | 4:5 portrait, 1200 × 1500   |
| `frontend/public/gallery/photo-1.jpg`| Gallery — large tile    | 3:2 landscape               |
| `frontend/public/gallery/photo-2.jpg`| Gallery — wide tile     | 3:2 landscape               |
| `frontend/public/gallery/photo-3.jpg`| Gallery — small tile    | 3:2 landscape               |
| `frontend/public/gallery/photo-4.jpg`| Gallery — small tile    | 3:2 landscape               |
| `frontend/public/gallery/photo-5.jpg`| Gallery — wide tile     | 3:2 landscape               |
| `frontend/public/gallery/photo-6.jpg`| Gallery — wide tile     | 3:2 landscape               |

More detailed instructions are in `frontend/public/images/README.md` and
`frontend/public/gallery/README.md`.

---

## Venue QR code

Venue QR codes are generated into:

```text
frontend/public/images/location-qr.png
frontend/public/images/location-qr.svg
```

To regenerate:
```bash
npm run generate:qr
```
Or from the `frontend/` directory:
```bash
npm run generate:qr
```

---

## Deploying to Vercel

### Unified Deployment (Front end + Serverless Back end)
1. Push the project to GitHub/GitLab.
2. In Vercel, import the repository root.
3. Vercel automatically detects the configuration from `vercel.json`:
   - Build command: `npm run build`
   - Output directory: `frontend/dist`
   - Serverless functions: `api/*.js` (which invokes `backend/src/app.js`)
4. Add environment variables in Vercel:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `CLIENT_ORIGIN` — (optional) only needed if frontend domain differs
5. Deploy!

### Separate Hosting
- **Front end**: Can be hosted on Vercel, Netlify, Cloudflare Pages, etc. Set root directory to `frontend`, build command to `npm run build`, and output to `dist`. Set `VITE_API_URL` to your backend's URL.
- **Back end**: Can be hosted on Render, Railway, Fly.io, or any Node.js host. Set root directory to `backend`, start command to `npm start`.

---

## Root Scripts

| Command                | What it does                                                    |
| ---------------------- | --------------------------------------------------------------- |
| `npm run dev`          | Concurrently runs both frontend (port 5173) and backend (5000)  |
| `npm run dev:frontend` | Runs the Vite frontend only                                     |
| `npm run dev:backend`  | Runs the Express backend only                                   |
| `npm run build`        | Builds the frontend to `frontend/dist/`                         |
| `npm run preview`      | Previews the frontend production build                          |
| `npm start`            | Starts the production Express server                            |
| `npm run lint`         | Lints both frontend and backend with Oxlint                     |
| `npm run generate:qr`  | Regenerates the venue QR code in `frontend/public/images/`      |
| `npm run install:all`  | Installs all dependencies in both `frontend` and `backend`      |

---

## Project Structure

```text
.
├── api/                             # Vercel serverless entry points
│   ├── [...path].js
│   └── index.js
├── backend/                         # Express & Mongoose API
│   ├── src/
│   │   ├── lib/db.js                # MongoDB connection helper
│   │   ├── models/Message.js        # Blessing schema
│   │   ├── routes/messages.js       # GET/POST blessing routes
│   │   ├── app.js                   # Express application setup
│   │   └── index.js                 # Standalone local server entry
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── README.md
├── frontend/                        # React 19 + Vite Application
│   ├── public/                      # Static assets (images, gallery, favicon)
│   │   ├── gallery/
│   │   └── images/
│   ├── scripts/
│   │   └── generate-qr.mjs          # QR code generator script
│   ├── src/                         # React components & styles
│   │   ├── components/              # UI components (Hero, Blessings, etc.)
│   │   ├── data/content.js          # Bilingual texts
│   │   ├── lib/                     # API client, calendar, scroll utils
│   │   └── styles/                  # Global and component CSS
│   ├── .env.example
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json
│   ├── README.md
│   └── vite.config.js
├── .env.example                     # Root environment variable template
├── .gitignore                       # Root gitignore
├── package.json                     # Root workspace coordinator
├── README.md                        # Documentation
└── vercel.json                      # Vercel deployment configuration
```
