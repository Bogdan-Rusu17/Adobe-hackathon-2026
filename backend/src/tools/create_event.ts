import { tool } from "langchain";
import * as z from "zod";
import { google } from "googleapis";
import { GOOGLE_API_KEY } from "../config/envConfig";

const accessToken = ""
process.env.GOOGLE_API_KEY = GOOGLE_API_KEY;

const TOOL_DESCRIPTION = `
Create a calendar event

If no attendees are specified, the list of attendees can be empty.
If location is not specified, it can be an empty string.
If duration or endtime is not specified, assume a default duration of 1 hour.
`

export const createEvent = tool(
	async (input: 
		{
			summary: string,
			location: string, 
			startTime: string,
			endTime: string,
			attendees: string[]
		}
	) => {

		const auth = new google.auth.OAuth2();
		auth.setCredentials({ access_token: accessToken });

		const calendar = google.calendar({ version: 'v3', auth });

		const settings = await calendar.settings.get({ setting: "timezone" });
  	const timeZone = settings.data.value || "UTC";

		const event = {
			summary: input.summary,
			location: input.location,
			start: {
				dateTime: input.startTime,
				timeZone: timeZone,
			},
			end: {
				dateTime: input.endTime,
				timeZone: timeZone,
			},
			attendees: input.attendees.map(email => ({ email })),
		}

		const response = await calendar.events.insert({
    	calendarId: "primary",
    	requestBody: event,
 		});

		return response.data;
	},
	{
		name: "create_event",
		description: TOOL_DESCRIPTION,
		schema: z.object({
			summary: z.string().describe("The summary of the event"),
			location: z.string().describe("The location of the event"),
			startTime: z.string().describe("The start time of the event in ISO 8601 datetime format"),
			endTime: z.string().describe("The end time of the event in ISO 8601 datetime format"),
			attendees: z.array(z.string()).describe("A list of email addresses of the attendees"),
		})
	}
);
