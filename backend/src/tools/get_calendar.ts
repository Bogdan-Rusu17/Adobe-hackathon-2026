import { tool, ToolRuntime } from "langchain";
import * as z from "zod";
import { google, calendar_v3 } from "googleapis";
import { DateTime } from "luxon";
import { contextSchema } from "../agent.js";



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
		}, runtime: ToolRuntime<any, typeof contextSchema>
	) => {
		const auth = new google.auth.OAuth2();
		auth.setCredentials({ access_token: runtime.context.accessToken });

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

		})
	}
);
