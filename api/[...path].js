import app from "../backend/src/app.js";

/** Vercel catch-all serverless entry point for /api/*. */
export default function handler(req, res) {
  return app(req, res);
}
