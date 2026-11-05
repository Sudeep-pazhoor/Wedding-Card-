# Wedding Invitation — Backend API

Express 5 and Mongoose 9 REST API for the Sundeep & Neeraja wedding invitation site.

## Features

- **MongoDB connection handling**: Serverless-safe connection pooling with graceful retry.
- **Blessings API**:
  - `GET /api/health` — Check server status and whether database is connected.
  - `GET /api/messages` — Retrieve up to 60 blessings (most recent first).
  - `POST /api/messages` — Submit a blessing (rate-limited, sanitized, honeypot protected).
- **Security**: Helmet headers, CORS restrictions, rate-limiting on submissions.

## Setup & Running

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `MONGODB_URI` with your MongoDB connection string.

### 3. Run Development Server
```bash
npm run dev
```
The server starts at `http://localhost:5000`.

### 4. Production
```bash
npm start
```

