import express from "express";
import { agent } from "../agent.js";
import jwt from "jsonwebtoken";
import db from "../db/knex.js";

const router = express.Router();
const conversationHistory = new Map<number, any[]>();

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
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    if (!prompt) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Fetch access token
    const tokenData = await db("google_accounts").where({ user_id: userId }).first();
    if (!tokenData) {
      return res.status(404).json({ error: "No Google account found" });
    }
	let userHistory;
    if (conversationHistory.get(userId)) {
      userHistory = conversationHistory.get(userId);
    } else {
      userHistory = [];
      conversationHistory.set(userId, userHistory);
    }
    userHistory.push({ role: "user", content: prompt });
    console.log("userid to string", userId, userId.toString());
    console.log(userHistory);
    const response = await agent.invoke(
      { messages: userHistory },
      { context: { userId: userId.toString(), accessToken: tokenData, userLatitude: latitude, userLongitude: longitude } }
    );

    userHistory.push(...response.messages);
    console.log(userHistory);
    const responseMessages = response.messages;
    const last = responseMessages[responseMessages.length - 1];

    let finalText = "";

// 🟦 Dacă e un răspuns normal AI
    if (typeof last.content === "string") {
      finalText = last.content;
    }

// 🟩 Dacă Gemini trimite content ca array (uneori o face)
    else if (Array.isArray(last.content)) {
      finalText = last.content
          .map((chunk: any) => chunk.text || "")
          .join(" ");
    }

    console.log(finalText);
    res.json({ response: finalText });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;