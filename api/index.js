import app from "../backend/src/app.js";

/** Vercel serverless entry point: /api and all /api/* requests. */
export default function handler(req, res) {
  return app(req, res);
}
