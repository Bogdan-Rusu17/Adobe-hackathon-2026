import { Router } from "express";
import { getGoogleAuthURL, handleGoogleCallback } from "../services/googleService";

const router = Router();

router.get("/google", (req, res) => {
    const redirectUri = req.query.redirect_uri as string;
    const authUrl = getGoogleAuthURL(redirectUri);

    res.redirect(authUrl);
});

router.get("/google/callback", async (req, res) => {
    const code = req.query.code as string;

    // The `state` contains your expo deep link.
    const redirectUri = req.query.state as string;

    const jwt = await handleGoogleCallback(code);

    // Redirect back to the app
    const finalUrl = `${redirectUri}?token=${jwt}`;

    return res.redirect(finalUrl);
});

export default router;
