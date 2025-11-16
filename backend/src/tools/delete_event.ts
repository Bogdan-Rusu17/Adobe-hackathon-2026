import { tool, ToolRuntime } from "langchain";
import * as z from "zod";
import { google } from "googleapis";
import { contextSchema } from "../agent";

const TOOL_DESCRIPTION = `
Delete a calendar event

In order to delete an event, you need to provide the event ID along with the user ID.
the event ID can be obtained from the get_events tool if you know what event you're looking for.
`

export const deleteEvent = tool(
	async (input: 
		{
			eventId: string,
		}, runtime: ToolRuntime<any, typeof contextSchema>
	) => {
		const auth = new google.auth.OAuth2();
		auth.setCredentials({ access_token: runtime.context.accessToken });

		const calendar = google.calendar({ version: 'v3', auth });

		const response = await calendar.events.delete({
    	calendarId: "primary",
    	eventId: input.eventId,
			sendUpdates: "all",
 		});

		return response.data;
	},
	{
		name: "delete_event",
		description: TOOL_DESCRIPTION,
		schema: z.object({
			eventId: z.string().describe("The ID of the event to delete"),

		})
	}
);
