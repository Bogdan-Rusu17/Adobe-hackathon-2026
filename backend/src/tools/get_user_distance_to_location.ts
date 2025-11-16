import axios from "axios";
import { tool, ToolRuntime } from "langchain";
import * as z from "zod";
import { contextSchema } from "../agent.js";

const TOOL_DESCRIPTION = `
Given the user's current coordinates (latitude & longitude) and the name of a destination location,
this tool finds the destination's coordinates using Google Geocoding and then computes the travel
distance and duration between the two locations using Google Distance Matrix API.
Returns the distance in meters and the duration in minutes.
`;

const inputSchema = z.object({
    destinationName: z.string().describe("The name of the destination place or address")
});

export const getDistanceToLocation = tool(
    async (input, runtime: ToolRuntime<typeof inputSchema, typeof contextSchema>) => {
        const { destinationName } = input;
        const userLatitude = runtime.context.userLatitude;
        const userLongitude = runtime.context.userLongitude;
        const apiKey = process.env.GOOGLE_MAPS_API_KEY;

        if (!apiKey) {
            throw new Error("GOOGLE_MAPS_API_KEY is missing.");
        }

        // ---------------------------------------
        // 1. Reverse Geocode user's current coords
        // ---------------------------------------
        const reverseUrl =
            "https://maps.googleapis.com/maps/api/geocode/json";

        const reverseRes = await axios.get(reverseUrl, {
            params: {
                latlng: `${userLatitude},${userLongitude}`,
                key: apiKey,
            },
        });

        const userAddress =
            reverseRes.data.results?.[0]?.formatted_address || "Unknown location";

        // ---------------------------------------
        // 2. Geocode the destination name
        // ---------------------------------------
        const geocodeUrl =
            "https://maps.googleapis.com/maps/api/geocode/json";

        const geocodeRes = await axios.get(geocodeUrl, {
            params: {
                address: destinationName,
                key: apiKey,
            },
        });

        const dest = geocodeRes.data.results?.[0];
        if (!dest) {
            throw new Error("Destination not found.");
        }

        const destLat = dest.geometry.location.lat;
        const destLng = dest.geometry.location.lng;
        const destAddress = dest.formatted_address;

        // ---------------------------------------
        // 3. Distance Matrix: user → destination
        // ---------------------------------------
        const distanceUrl =
            "https://maps.googleapis.com/maps/api/distancematrix/json";

        const distanceRes = await axios.get(distanceUrl, {
            params: {
                origins: `${userLatitude},${userLongitude}`,
                destinations: `${destLat},${destLng}`,
                key: apiKey,
            },
        });

        const element = distanceRes.data.rows?.[0]?.elements?.[0];
        if (!element || element.status !== "OK") {
            throw new Error("Failed to compute distance.");
        }

        const distanceMeters = element.distance.value;
        const durationMinutes = Math.round(element.duration.value / 60);

        // ---------------------------------------
        // FINAL RESULT
        // ---------------------------------------
        return {
            from: {
                latitude: userLatitude,
                longitude: userLongitude,
                address: userAddress,
            },
            to: {
                latitude: destLat,
                longitude: destLng,
                address: destAddress,
            },
            distanceMeters,
            durationMinutes,
        };
    },
    {
        name: "get_distance_to_location",
        description: TOOL_DESCRIPTION,
        schema: inputSchema,
    }
);
