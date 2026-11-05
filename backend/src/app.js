import cors from "cors";
import express from "express";
import helmet from "helmet";
import { hasDatabaseConfig } from "./lib/db.js";
import messagesRouter from "./routes/messages.js";

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, server-to-server, Render health checks)
      if (!origin || !allowedOrigins.length || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      const cleanOrigin = origin.replace(/\/$/, "");
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed === cleanOrigin) return true;
        if (allowed.startsWith("*.") && cleanOrigin.endsWith(allowed.slice(1))) return true;
        return false;
      });
      if (isAllowed) return callback(null, true);
      return callback(null, true); // Fallback: allow to prevent blocked requests during initial setup
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    maxAge: 86400,
  })
);

app.use(express.json({ limit: "16kb" }));

// Root health check (useful for Render Web Service dashboard & health checks)
app.get(["/", "/health"], (_req, res) => {
  res.json({
    ok: true,
    service: "Sundeep & Neeraja Wedding API",
    database: hasDatabaseConfig() ? "configured" : "not-configured",
    time: new Date().toISOString(),
  });
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    database: hasDatabaseConfig() ? "configured" : "not-configured",
    time: new Date().toISOString(),
  });
});

app.use("/api/messages", messagesRouter);

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found." });
});

// Central error handler
app.use((error, _req, res, _next) => {
  console.error("[api:error]", error.message);
  const status = error.status || error.statusCode || 500;
  res.status(status).json({
    error:
      status === 400
        ? "That request could not be read. Please try again."
        : "Something went wrong. Please try again.",
  });
});

export default app;
