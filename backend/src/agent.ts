import { createAgent } from "langchain";
import { createEvent } from "./tools/create_event.js";
import { getEvents } from "./tools/get_calendar.js";

const agent = createAgent({
  model: "google-genai:gemini-2.5-flash",
  tools: [createEvent, getEvents],
});

// console.log(
//   await agent.invoke({
//     messages: [{ role: "user", content: "Can you add an event called bomboclacla for 16.11.2025, 10 am to 11 am? I have no attendees and location is Bucharest" }],
//   })
// );


console.log(
  await agent.invoke({
    messages: [{ role: "user", content: "Can you get my events from 12.11.2025 to 15.11.2025?" }],
  })
);