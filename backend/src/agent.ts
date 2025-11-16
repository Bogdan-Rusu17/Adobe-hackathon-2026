import { createAgent } from "langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createEvent } from "./tools/create_event.js";
import { getEvents } from "./tools/get_calendar.js";
import { deleteEvent } from "./tools/delete_event.js";
import z from "zod";
import { getUTCTime } from "./tools/get_current_time.js";
import { getDistanceToLocation } from "./tools/get_user_distance_to_location.js";

const SYSTEM_PROMPT = `
You are a helpful assistant that manages calendar events for users.

If the user prompt has anything like tomorrow, next week, in 3 days, etc.,
you must use the get_utc_time tool to get the current UTC time to know the actual date.

For the hours, always interpret them as the time of Bucharest Romania.

Before you actually add a new event to the calendar you have to check if the user has enough time to reach
the location for the meeting you are trying to schedule. If there are any meetings prior to that, take that location into account.
If not, take the current location into account.

Make sure when trying to add an event that the user doesn't have an overlapping event already.

Please note that the user will be probably working between 9am to 18pm and sleeping between 11pm and 8am.
Don't schedule any meetings during these hours.

Whenever you are asked if the user has time for an event, check the user's calendar for conflicts.
If there are conflicts, suggest alternative times.
If there are none, schedule the event.
`;

export const contextSchema = z.object({
	userId: z.string(),
	accessToken: z.string(),
	userLatitude: z.number(),
	userLongitude: z.number(),
});

// VALID Gemini model
const llm = new ChatGoogleGenerativeAI({
	apiKey: process.env.GOOGLE_API_KEY!,
	model: "gemini-2.0-flash",   // <-- Use this or "gemini-1.5-pro"
});

export const agent = createAgent({
	model: llm,  // <-- IMPORTANT: pass the object, not a string
	tools: [createEvent, getEvents, deleteEvent, getUTCTime, getDistanceToLocation],
	systemPrompt: SYSTEM_PROMPT,
	contextSchema,
});
