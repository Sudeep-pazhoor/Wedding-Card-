# Sundeep & Neeraja — Wedding Invitation

A bilingual (English / Malayalam) wedding invitation and blessing wall for
**Sundeep & Neeraja**, celebrating on **Sunday, 24 January 2027** at
**Hilton Convention Center, Manjeri, Kerala**.

The repository is structured with completely separated **`frontend/`** and **`backend/`** folders, designed for independent deployment:
- **Backend on Render**: Express 5 + MongoDB Atlas API with root directory set to `backend/`.
- **Frontend on Vercel**: React 19 + Vite frontend with root directory set to `frontend/`.

---

## Highlights

- **English + Malayalam** copy, switchable at any time. The choice is remembered
  in `localStorage` and can be linked directly with `?lang=ml`.
- **Traditional design** — parchment, maroon and gold palette, serif display
  type, lotus/mandala ornaments, palm sprays, floating petals, and a rotating
  wedding seal.
- **Background Wedding Audio** — plays festive melody starting at 8 seconds with
  header Play/Pause controls, live equalizer wave animation, and 6-second notice.
- **Live blessing wall** — guests can leave a wish, which is stored in MongoDB Atlas
  and displayed in flowing cards. Real MongoDB data only.
- **Venue QR code** generated locally, plus Google Maps and copy-address actions.
- **Accessible details** — skip link, focus styles, keyboard gallery lightbox,
  live form status, reduced-motion support, and semantic landmarks.
- **Lightweight** — React, GSAP and Lenis only.
  Production bundle is roughly 138 kB of JavaScript and 14 kB of CSS (gzipped).

---

## Tech Stack & Deployment Architecture

| Service    | Technology                    | Directory   | Production Host |
| ---------- | ----------------------------- | ----------- | --------------- |
| Front end  | React 19, Vite 8, GSAP, Lenis | `frontend/` | **Vercel**      |
| Back end   | Express 5, Mongoose 9         | `backend/`  | **Render**      |
| Database   | MongoDB Atlas                 | Cloud       | MongoDB Atlas   |

---

## Deployment Guide

### 1. Deploy Backend to Render

1. Log into [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** → **Web Service** and connect this repository.
3. Configure the service:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string:
     `mongodb+srv://sudeeppazhoor_db_user:<password>@cluster0.y8o3lfd.mongodb.net/wedding?retryWrites=true&w=majority`
   - `CLIENT_ORIGIN`: Your Vercel frontend URL (e.g. `https://your-project.vercel.app`), or leave blank to allow all during setup.
5. Click **Create Web Service**.
6. Render deployed URL:
   `https://wedding-card-ns.onrender.com`

---

### 2. Deploy Frontend to Vercel

1. Log into [Vercel Dashboard](https://vercel.com/).
2. Click **Add New...** → **Project** and import this repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Select `frontend` (Click Edit → select `frontend`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL`: `https://wedding-card-ns.onrender.com` (already bundled in `frontend/.env.production`)
5. Click **Deploy**.

---

## Local Development

Requirements: **Node.js 20+** and npm.

### Run everything together:
```bash
# Install dependencies in frontend and backend
npm run install:all

# Configure MongoDB for the backend
cp backend/.env.example backend/.env
# Edit backend/.env with your MONGODB_URI

# Start both frontend and backend concurrently
npm run dev
```

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:5000/api/health>

In local development, requests to `/api` are automatically proxied to port 5000 by Vite.

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
├── backend/                         # Express & Mongoose API (for Render)
│   ├── src/
│   │   ├── lib/db.js                # MongoDB connection helper
│   │   ├── models/Message.js        # Blessing schema
│   │   ├── routes/messages.js       # GET/POST blessing routes
│   │   ├── app.js                   # Express application setup
│   │   └── index.js                 # Standalone server entry
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json                 # Standalone backend dependencies & start script
│   ├── render.yaml                  # Render Blueprint definition
│   └── README.md                    # Render deployment guide
│
├── frontend/                        # React 19 + Vite Application (for Vercel)
│   ├── public/                      # Static assets (images, gallery, favicon)
│   │   ├── gallery/
│   │   └── images/
│   ├── scripts/
│   │   └── generate-qr.mjs          # QR code generator script
│   ├── src/                         # React components & styles
│   │   ├── components/              # UI components (Hero, Blessings, Navbar, etc.)
│   │   ├── data/content.js          # Bilingual texts
│   │   ├── lib/                     # API client, calendar, scroll utils
│   │   └── styles/                  # Global and component CSS
│   ├── .env.example
│   ├── .gitignore
│   ├── .oxlintrc.json
│   ├── index.html
│   ├── package.json                 # Standalone frontend dependencies & build script
│   ├── README.md                    # Vercel deployment guide
│   ├── vercel.json                  # Vercel SPA rewrites & Vite build config
│   └── vite.config.js
│
├── .env.example                     # Root environment variable template
├── .gitignore                       # Root gitignore
├── package.json                     # Root workspace coordinator
├── README.md                        # Project documentation
└── vercel.json                      # Fallback Vercel config if deployed from repo root
```
