import express from "express";
import cors from "cors";
import { PORT } from "./config/envConfig";
import healthRoute from "./routes/healthCheck";
import googleAuthRoute from "./routes/googleAuthRoute";

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.use("/health", healthRoute);
app.use("/auth", googleAuthRoute);

app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Backend running on http://0.0.0.0:${PORT}`);
});