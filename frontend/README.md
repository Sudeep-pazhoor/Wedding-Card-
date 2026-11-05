# Sundeep & Neeraja — Frontend (React 19 + Vite)

Bilingual wedding invitation for **Sundeep & Neeraja** built with React 19, Vite, GSAP, and Lenis.

---

## Deploying to Vercel

You can deploy this frontend directly on **Vercel**.

### Step-by-Step Vercel Deployment:

1. **Log in to [Vercel](https://vercel.com/)**.
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the configuration screen:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click `Edit` and select `frontend`
   - **Build Command**: `npm run build` (or left to default `vite build`)
   - **Output Directory**: `dist`
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: The URL of your Render backend service (e.g. `https://neeraja-sundeep-backend.onrender.com` without trailing slash).
6. Click **Deploy**.

> **Note**: Both `frontend/vercel.json` and root `vercel.json` are already preconfigured, so routing and SPA deep links work automatically.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Start local dev server
npm run dev
```

Runs at `http://localhost:5173`. In development, requests to `/api` automatically proxy to `http://localhost:5000`.

---

## Production Build Check

```bash
npm run build
npm run preview
```
