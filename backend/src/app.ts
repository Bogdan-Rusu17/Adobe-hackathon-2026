import express from "express";
import cors from "cors";
import healthRoute from "./routes/healthCheck.js";
import googleAuthRoute from "./routes/googleAuthRoute.js";
import mapsRoutes from "./routes/mapsRoutes.js";
import agentRoute from "./routes/agentInteraction.js";
import calendarRoute from "./routes/googleCalendar.js";

export const PORT = process.env.PORT || 4000;

const app = express();

app.use(cors());
app.use(express.json());

// health check
app.use("/health", healthRoute);
app.use("/auth", googleAuthRoute);
app.use("/maps", mapsRoutes);
app.use("/agent", agentRoute);
app.use("/calendar", calendarRoute);

app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`Backend running on http://0.0.0.0:${PORT}`);
});