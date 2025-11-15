import { tool } from "langchain";
import * as z from "zod";
import { google, calendar_v3 } from "googleapis";
import { GOOGLE_API_KEY } from "../config/envConfig";
import { DateTime } from "luxon";
import db from "../db/knex";

process.env.GOOGLE_API_KEY = GOOGLE_API_KEY;

const TOOL_DESCRIPTION = `
Get calendar events within a specified time range.
The input should include the start time and end time in ISO 8601 datetime format.
startTime: The start time of the event in ISO 8601 datetime format.
endTime: The end time of the event in ISO 8601 datetime format.
`

export const getEvents = tool(
	async (input:
		{
			startTime: string,
			endTime: string,
			userId: string,
		}
	) => {
		const accessToken = await db("google_accounts").where({ user_id: input.userId }).first();

		const auth = new google.auth.OAuth2();
		auth.setCredentials({ access_token: accessToken });

		const calendar = google.calendar({ version: 'v3', auth });

		const settings = await calendar.settings.get({ setting: "timezone" });
		const timeZone = settings.data.value || "UTC";

		const response = await calendar.events.list({
    	calendarId: "primary",
    	timeMin: DateTime.fromISO(input.startTime, { zone: timeZone }).toISO(),
			timeMax: DateTime.fromISO(input.endTime, { zone: timeZone }).toISO(),
			singleEvents: true,
			orderBy: "startTime",
 		} as calendar_v3.Params$Resource$Events$List);

		return response.data;
	},
	{
		name: "get_events",
		description: TOOL_DESCRIPTION,
		schema: z.object({
			startTime: z.string().describe("The start time of the event in ISO 8601 datetime format"),
			endTime: z.string().describe("The end time of the event in ISO 8601 datetime format"),
			userId: z.string().describe("The ID of the user whose calendar to access"),
		})
	}
);
