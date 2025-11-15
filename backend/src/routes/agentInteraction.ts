import router from "./googleAuthRoute";
import { agent } from "../agent";

router.post("/prompt-agent", async (req, res) => {
	return res.json({ agent_response: agent.stream(
		{ messages: [{ role: "user", content: "Can you tell the events I have in my calendar for 12.11.2025?" }] },
		{ context: { userId: req.body.userId } }) });
});
