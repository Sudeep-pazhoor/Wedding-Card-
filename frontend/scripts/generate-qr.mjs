import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const mapsUrl =
  "https://www.google.com/maps/search/?api=1&query=Hilton+Convention+Center%2C+Vettekode+Road%2C+Vayapparappadi%2C+Manjeri%2C+Malappuram%2C+Kerala";

const outDir = path.resolve(__dirname, "..", "public", "images");
fs.mkdirSync(outDir, { recursive: true });

const options = {
  errorCorrectionLevel: "H",
  margin: 1,
  width: 640,
  color: {
    dark: "#7c1e2d",
    light: "#fffaf0",
  },
};

await QRCode.toFile(path.join(outDir, "location-qr.png"), mapsUrl, options);
await QRCode.toFile(path.join(outDir, "location-qr.svg"), mapsUrl, {
  ...options,
  type: "svg",
});

console.log("Venue QR codes written to public/images/location-qr.(png|svg)");
