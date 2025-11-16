import { google } from "googleapis";
import { tool, ToolRuntime } from "langchain";
import { contextSchema } from "../agent.js";
import * as z from "zod";


const TOOL_DESCRIPTION = `
Get recent mails from the user's inbox.
`

export const getMails = tool(async (_, runtime: ToolRuntime<any, typeof contextSchema>) => {
	const auth = new google.auth.OAuth2();
	auth.setCredentials({ access_token: runtime.context.accessToken });
	const gmail = google.gmail({ version: 'v1', auth });

	const res = await gmail.users.messages.list({
		userId: 'me',
		maxResults: 10,
	});

	const messages = res.data.messages || [];
	let messagesSnippets = [];
	for (const message of messages) {
		const msg = await gmail.users.messages.get({
			userId: 'me',
			id: message.id!,
		});
		messagesSnippets.push(msg.data.snippet);
	}

	return messagesSnippets;
},
{
	name: "get_mails",
	description: TOOL_DESCRIPTION,
	schema: z.undefined(),
}
);
