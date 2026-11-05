import "dotenv/config";
import app from "./app.js";
import { hasDatabaseConfig, connectDB } from "./lib/db.js";

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`\n  Sundeep & Neeraja API  →  http://localhost:${port}/api/health`);
  if (!hasDatabaseConfig()) {
    console.log(
      "  MONGODB_URI is not set — the site will use on-device blessings until it is.\n"
    );
    return;
  }
  connectDB()
    .then(() => console.log("  MongoDB connected.\n"))
    .catch((error) =>
      console.log(`  MongoDB not reachable yet: ${error.message}\n`)
    );
});
