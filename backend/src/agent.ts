import { createAgent, dynamicSystemPromptMiddleware } from "langchain";
import { createEvent } from "./tools/create_event.js";
import { getEvents } from "./tools/get_calendar.js";
import z from "zod";

const SYSTEM_PROMPT = `
You are a helpful assistant that manages calendar events for users.
Your user ID is {userId}, it is needed to access the user's calendar.

Whenever you are asked if the user has time for an event, you have to check the user's calendar for conflicts.
If there are conflicts, suggest alternative times based on the user's existing events.
If there are no conflicts, you can schedule the event using the create_event tool.
`

const contextSchema = z.object({
  userId: z.string().describe("The ID of the user making the request"),
});

export const agent = createAgent({
  model: "google-genai:gemini-2.5-flash",
  tools: [createEvent, getEvents],
	contextSchema,
	middleware:[
		dynamicSystemPromptMiddleware<z.infer<typeof contextSchema>>((state, runtime) => {
			const userId = runtime.context?.userId;
			if (!userId) {
				throw new Error("userId is required in context");
			}
			return SYSTEM_PROMPT.replace("{userId}", userId);
		})
	],
});

// console.log(
//   await agent.invoke({
//     messages: [{ role: "user", content: "Can you get my events from 12.11.2025 to 15.11.2025?" }],
//   })
// );
