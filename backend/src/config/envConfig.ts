import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 4000;
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
