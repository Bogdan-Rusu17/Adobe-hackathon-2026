import { fileURLToPath } from "url";
import path from "path";
import * as dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.resolve(__dirname, "../.env"),
});

console.log("Loaded env:", process.env.GOOGLE_API_KEY ? "OK" : "MISSING");
