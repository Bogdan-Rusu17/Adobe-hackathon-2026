import express from "express";
import { agent } from "../agent.js";
import jwt from "jsonwebtoken";
import db from "../db/knex.js";

const router = express.Router();
const conversationHistory = new Map<string, any[]>();

router.post("/chat", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded_token = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = (decoded_token as any).userId;
    const prompt = req.body.message;

    if (!prompt) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Fetch access token
    const tokenData = await db("google_accounts").where({ user_id: userId }).first();
    if (!tokenData) {
      return res.status(404).json({ error: "No Google account found" });
    }

		const userHistory = conversationHistory.get(userId) || [];
		userHistory.push({ role: "user", content: prompt });

    const response = await agent.invoke(
      { messages: userHistory },
      { context: { userId, accessToken: tokenData.access_token } }
    );

		userHistory.push(...response.messages);

    res.json({ response: response.messages });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;