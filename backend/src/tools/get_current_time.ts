import { tool } from "langchain";
import * as z from "zod";

const TOOL_DESCRIPTION = `
Get the current UTC time in ISO 8601 format.
`

export const getUTCTime = tool(
	async () => {
		return new Date().toISOString();
	},
	{
		name: "get_utc_time",
		description: TOOL_DESCRIPTION,
		schema: z.object({}),
	}
)
