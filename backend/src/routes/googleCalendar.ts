import express from "express";
import {AuthedRequest, authMiddleware} from "../middleware/auth";
import db from "../db/knex";
import { google } from "googleapis";
import { DateTime } from "luxon";


const router = express.Router();

router.post("/events", authMiddleware, async (req: AuthedRequest, res) => {
	const userId = req.user.userId;
	const day = req.body.day;

	if (!day) {
		return res.status(400).json({ error: "day is required" });
	}

  const tokenData = await db("google_accounts").where({ user_id: userId }).first();

	if (!tokenData) {
			return res.status(400).json({ error: "No Google account linked" });
	}

	const accessToken = tokenData.access_token;

	const auth = new google.auth.OAuth2();
	auth.setCredentials({ access_token: accessToken });

	const calendar = google.calendar({ version: 'v3', auth });

	const settings = await calendar.settings.get({ setting: "timezone" });
	const timeZone = settings.data.value || "UTC";

	const start = DateTime
    .fromISO(day, { zone: timeZone })
    .startOf("day")
    .toUTC()
    .toISO();

  const end = DateTime
    .fromISO(day, { zone: timeZone })
    .endOf("day")
    .toUTC()
    .toISO();

	const response = await calendar.events.list({
		calendarId: "primary",
		timeMin: start,
		timeMax: end,
		singleEvents: true,
		orderBy: "startTime",
	});

	return res.json({ events: response.data.items || [] });
});

export default router;