# Sundeep & Neeraja — Backend API (Express + MongoDB)

Express 5 and Mongoose 9 REST API for the Sundeep & Neeraja wedding invitation site.

---

## Deploying to Render

You can deploy this backend as a standalone **Render Web Service** pointing to the `backend/` folder.

### Step-by-Step Render Deployment:

1. **Log in to [Render](https://dashboard.render.com/)**.
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository.
4. Configure the service settings:
   - **Name**: `neeraja-sundeep-backend` (or any name you choose)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (or preferred plan)
5. Under **Environment Variables**, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string:
     `mongodb+srv://sudeeppazhoor_db_user:<password>@cluster0.y8o3lfd.mongodb.net/wedding?retryWrites=true&w=majority`
   - `CLIENT_ORIGIN`: Your Vercel frontend URL (e.g. `https://your-project.vercel.app`), or leave empty during initial setup to allow all origins.
6. Click **Create Web Service**.
7. Your live Render Backend URL:
   `https://wedding-card-ns.onrender.com`
   This URL is configured in the frontend (`VITE_API_URL`) to connect live blessings!

---

## Endpoints

- `GET /` or `GET /health` — Service health and database connection status.
- `GET /api/health` — API health check.
- `GET /api/messages` — Retrieve up to 60 blessings (most recent first).
- `POST /api/messages` — Submit a blessing (sanitized, rate-limited, honeypot-protected).

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env and set MONGODB_URI

# 3. Start development server
npm run dev
```

Server starts at `http://localhost:5000`.
