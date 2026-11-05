import { Router } from "express";
import rateLimit from "express-rate-limit";
import { connectDB } from "../lib/db.js";
import { Message } from "../models/Message.js";

const router = Router();

const writeLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "A few too many blessings at once. Please try again in a little while.",
  },
});

const clean = (value) =>
  String(value ?? "")
    // Strip invisible control characters while keeping newlines and tabs.
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();

router.get("/", async (_req, res) => {
  try {
    await connectDB();
    const messages = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(60)
      .lean({ virtuals: false });

    res.set("Cache-Control", "no-store");
    res.json({
      messages: messages.map((item) => ({
        _id: String(item._id),
        name: item.name,
        message: item.message,
        attending: item.attending,
        createdAt: item.createdAt,
      })),
    });
  } catch (error) {
    console.error("[blessings:get]", error.message);
    res.status(503).json({
      error: "The blessing wall is resting. Please try again in a moment.",
    });
  }
});

router.post("/", writeLimiter, async (req, res) => {
  const body = req.body || {};

  // Simple honeypot — real guests never see this field.
  if (clean(body.website)) {
    return res.status(400).json({ error: "Unable to send this message." });
  }

  const name = clean(body.name);
  const message = clean(body.message);
  const attending = body.attending === "blessings" ? "blessings" : "attending";

  if (name.length < 2 || name.length > 40) {
    return res.status(400).json({
      error: "Please add a name between 2 and 40 characters.",
    });
  }

  if (message.length < 2 || message.length > 240) {
    return res.status(400).json({
      error: "Please add a blessing between 2 and 240 characters.",
    });
  }

  try {
    await connectDB();
    const created = await Message.create({ name, message, attending });
    res.status(201).json({ message: created.toJSON() });
  } catch (error) {
    console.error("[blessings:post]", error.message);
    res.status(503).json({
      error: "The blessing wall is resting. Please try again in a moment.",
    });
  }
});

export default router;
