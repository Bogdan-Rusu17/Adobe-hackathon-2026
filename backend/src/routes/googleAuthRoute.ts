import { Router } from "express";
import { getGoogleAuthURL, handleGoogleCallback } from "../services/googleService";

const router = Router();

router.get("/google", (req, res) => {
    res.redirect(getGoogleAuthURL());
});

router.get("/google/callback", async (req, res) => {
    const code = req.query.code as string;
    const jwt = await handleGoogleCallback(code);

    res.json({ success: true, jwt });
});

export default router;
