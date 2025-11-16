import { createAgent } from "langchain";
import { createEvent } from "./tools/create_event";
import { getEvents } from "./tools/get_calendar";
import { deleteEvent } from "./tools/delete_event";
import z from "zod";
import { getUTCTime } from "./tools/get_current_time";

const SYSTEM_PROMPT = `
You are a helpful assistant that manages calendar events for users.

If the user prompt has anything like tomorrow, next week, in 3 days, etc., you have to use the get_utc_time tool to get the current UTC time to know the actual date.

Whenever you are asked if the user has time for an event, you have to check the user's calendar for conflicts.
If there are conflicts, suggest alternative times based on the user's existing events.
If there are no conflicts, you can schedule the event using the create_event tool.
`

const contextSchema = z.object({
	userId: z.string().describe("The ID of the user making the request"),
	accessToken: z.string().describe("OAuth2 access token for Google Calendar API"),
});

export const agent = createAgent({
  model: "google-genai:gemini-2.5-flash",
  tools: [createEvent, getEvents, deleteEvent, getUTCTime],
	systemPrompt: SYSTEM_PROMPT,
	contextSchema,
});
