import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
  }

  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const redirectUri = "http://localhost:3000/api/gmail/callback"; // Change to your production URL

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!response.ok) throw new Error("Failed to get Gmail access token");

    const data = await response.json();
    const accessToken = data.access_token;

    // Store Gmail access token in cookies (or database if needed)
    cookies().set("gmail_access_token", accessToken, { httpOnly: true, secure: true });

    return NextResponse.redirect("/dashboard"); // Redirect user after authentication
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
