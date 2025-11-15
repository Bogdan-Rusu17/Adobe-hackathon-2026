import { Router } from "express";
import axios from "axios";
import {AuthedRequest, authMiddleware} from "../middleware/auth";

const router = Router();

router.post("/location", authMiddleware, async (req: AuthedRequest, res) => {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Missing coordinates" });
    }

    try {
        // Reverse Geocoding request
        const geocodeUrl =
            "https://maps.googleapis.com/maps/api/geocode/json";

        const response = await axios.get(geocodeUrl, {
            params: {
                latlng: `${latitude},${longitude}`,
                key: process.env.GOOGLE_MAPS_API_KEY!,
            },
        });

        const address =
            response.data.results?.[0]?.formatted_address || "Unknown location";

        return res.json({
            message: "Location received",
            coords: { latitude, longitude },
            address,
            userId: req.user.userId,
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: "Failed to reverse geocode location" });
    }
});

router.post("/distance", authMiddleware, async (req: AuthedRequest, res) => {
    const { from, to } = req.body;

    if (!from || !to) {
        return res.status(400).json({ error: "Missing coordinates" });
    }

    try {
        const url = "https://maps.googleapis.com/maps/api/distancematrix/json";

        const params = {
            origins: `${from.lat},${from.lng}`,
            destinations: `${to.lat},${to.lng}`,
            key: process.env.GOOGLE_MAPS_API_KEY!,
        };

        const response = await axios.get(url, { params });

        return res.json({
            userId: req.user.userId,
            distanceInfo: response.data,
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch distance" });
    }
});

export default router;
