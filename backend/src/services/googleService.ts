import { google } from "googleapis";
import db from "../db/knex";
import jwt from "jsonwebtoken";

export const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    process.env.GOOGLE_REDIRECT_URI!
);

export function getGoogleAuthURL() {
    const scopes = [
        "https://www.googleapis.com/auth/calendar.readonly",
        "openid",
        "email",
        "profile",
    ];

    return oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
    });
}

export async function handleGoogleCallback(code: string) {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const userInfo = await google.oauth2("v2").userinfo.get({
        auth: oauth2Client,
    });

    const email = userInfo.data.email!;
    let user = await db("users").where({ email }).first();

    if (!user) {
        const [created] = await db("users").insert({ email }).returning("*");
        user = created;
    }

    // Insert or update Google tokens
    const existing = await db("google_accounts").where({ user_id: user.id }).first();

    if (existing) {
        await db("google_accounts")
            .where({ user_id: user.id })
            .update({
                access_token: tokens.access_token!,
                refresh_token: tokens.refresh_token || existing.refresh_token,
                expiry_date: tokens.expiry_date!,
            });
    } else {
        await db("google_accounts").insert({
            user_id: user.id,
            access_token: tokens.access_token!,
            refresh_token: tokens.refresh_token!,
            expiry_date: tokens.expiry_date!,
        });
    }

    const jwtToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    return jwtToken;
}

export async function getUserOAuthClient(userId: number) {
    const acct = await db("google_accounts").where({ user_id: userId }).first();
    if (!acct) throw new Error("Google account not linked");

    oauth2Client.setCredentials({
        access_token: acct.access_token,
        refresh_token: acct.refresh_token,
        expiry_date: acct.expiry_date,
    });

    // refresh if expired
    if (Date.now() > Number(acct.expiry_date)) {
        const refreshed = await oauth2Client.refreshAccessToken();
        const creds = refreshed.credentials;

        await db("google_accounts")
            .where({ user_id: userId })
            .update({
                access_token: creds.access_token!,
                expiry_date: creds.expiry_date!,
            });
    }

    return oauth2Client;
}
